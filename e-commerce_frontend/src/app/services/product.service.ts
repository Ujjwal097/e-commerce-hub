import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Product, Review } from '../models/product.model';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '../data/mock-products';
import { ToastService } from './toast.service';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private apiUrl = environment.productApiUrl;

  // Products signal (initialized with mock fallback and immediately refreshed from SQLite DB)
  private _products = signal<Product[]>(MOCK_PRODUCTS);
  readonly products = this._products.asReadonly();

  // Active filters state
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('All');
  readonly priceRange = signal<{ min: number; max: number }>({ min: 0, max: 1500 });
  readonly minRating = signal<number>(0);
  readonly inStockOnly = signal<boolean>(false);
  readonly sortBy = signal<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  readonly viewMode = signal<'grid' | 'list'>('grid');

  // Dynamic quick-view product modal
  readonly quickViewProduct = signal<Product | null>(null);

  // Reviews dictionary state
  private _reviews = signal<Record<string, Review[]>>(MOCK_REVIEWS);

  // Computed unique categories with count
  readonly categories = computed(() => {
    const list = this._products();
    const map = new Map<string, number>();
    map.set('All', list.length);

    for (const p of list) {
      map.set(p.category, (map.get(p.category) || 0) + 1);
    }

    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  });

  // Computed filtered and sorted products
  readonly filteredProducts = computed(() => {
    let list = this._products();
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.selectedCategory();
    const { min, max } = this.priceRange();
    const rating = this.minRating();
    const inStock = this.inStockOnly();
    const sort = this.sortBy();

    // 1. Search Query
    if (query) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    // 2. Category
    if (category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // 3. Price
    list = list.filter(p => p.price >= min && p.price <= max);

    // 4. Rating
    if (rating > 0) {
      list = list.filter(p => p.rating >= rating);
    }

    // 5. In Stock Only
    if (inStock) {
      list = list.filter(p => p.inStock && p.stockQuantity > 0);
    }

    // 6. Sorting
    const sorted = [...list];
    switch (sort) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return sorted;
  });

  // Featured and trending items
  readonly featuredProducts = computed(() => this._products().filter(p => p.isFeatured));
  readonly trendingProducts = computed(() => this._products().filter(p => p.isTrending));

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).pipe(
      tap(dbProducts => {
        if (dbProducts && dbProducts.length > 0) {
          this._products.set(dbProducts);
        }
      }),
      catchError(err => {
        console.warn('Backend API unavailable, using cached catalog', err);
        return of(MOCK_PRODUCTS);
      })
    ).subscribe();
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, productData).pipe(
      tap(newProduct => {
        this._products.update(curr => [newProduct, ...curr]);
        this.toastService.success(`"${newProduct.name}" added to SQLite catalog!`, 'Product Created');
      })
    );
  }

  updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updatedProduct => {
        this._products.update(curr => curr.map(p => p.id === id ? updatedProduct : p));
        this.toastService.success(`Updated "${updatedProduct.name}"`, 'Product Saved');
      })
    );
  }

  deleteProduct(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._products.update(curr => curr.filter(p => p.id !== id));
        this.toastService.info('Product removed from database', 'Product Deleted');
      })
    );
  }

  getProductById(id: string): Product | undefined {
    return this._products().find(p => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this._products().find(p => p.slug === slug);
  }

  getRelatedProducts(category: string, excludeId: string, limit: number = 4): Product[] {
    return this._products()
      .filter(p => p.category === category && p.id !== excludeId)
      .slice(0, limit);
  }

  getReviews(productId: string): Review[] {
    return this._reviews()[productId] || [
      {
        id: 'default-1',
        userName: 'Alex Rivera',
        rating: 5,
        date: 'Recent',
        comment: 'Absolutely love the build quality and performance. Worth every penny!',
        verifiedPurchase: true,
        helpfulCount: 8
      }
    ];
  }

  addReview(productId: string, review: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'verifiedPurchase'>): void {
    const newRev: Review = {
      ...review,
      id: 'rev_' + Date.now(),
      date: 'Just now',
      helpfulCount: 0,
      verifiedPurchase: true
    };

    this._reviews.update(all => {
      const existing = all[productId] || [];
      return {
        ...all,
        [productId]: [newRev, ...existing]
      };
    });
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('All');
    this.priceRange.set({ min: 0, max: 1500 });
    this.minRating.set(0);
    this.inStockOnly.set(false);
    this.sortBy.set('featured');
  }

  openQuickView(product: Product): void {
    this.quickViewProduct.set(product);
  }

  closeQuickView(): void {
    this.quickViewProduct.set(null);
  }
}

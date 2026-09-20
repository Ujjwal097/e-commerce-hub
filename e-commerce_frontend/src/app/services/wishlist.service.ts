import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';

const WISHLIST_STORAGE_KEY = 'lumina_ecommerce_wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private toastService = inject(ToastService);

  private _items = signal<Product[]>(this.loadWishlistFromStorage());
  readonly items = this._items.asReadonly();

  readonly count = computed(() => this._items().length);

  constructor() {
    effect(() => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this._items()));
        }
      } catch (e) {
        console.error('Failed saving wishlist to storage', e);
      }
    });
  }

  isInWishlist(productId: string): boolean {
    return this._items().some(p => p.id === productId);
  }

  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this._items.update(current => current.filter(p => p.id !== product.id));
      this.toastService.info(`Removed "${product.name}" from wishlist`);
    } else {
      this._items.update(current => [...current, product]);
      this.toastService.success(`Added "${product.name}" to wishlist!`, 'Saved to Wishlist');
    }
  }

  removeFromWishlist(productId: string): void {
    const item = this._items().find(p => p.id === productId);
    this._items.update(current => current.filter(p => p.id !== productId));
    if (item) {
      this.toastService.info(`Removed "${item.name}" from wishlist`);
    }
  }

  clearWishlist(): void {
    this._items.set([]);
  }

  private loadWishlistFromStorage(): Product[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (data) return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed loading wishlist from storage', e);
    }
    return [];
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="catalog-page">
      <div class="container">
        
        <!-- Breadcrumb & Page Title -->
        <div class="page-header">
          <div class="breadcrumb">
            <a routerLink="/">Home</a>
            <span class="sep">/</span>
            <span class="current">Store Catalog</span>
            @if (productService.selectedCategory() !== 'All') {
              <span class="sep">/</span>
              <span class="current">{{ productService.selectedCategory() }}</span>
            }
          </div>
          <h1 class="page-title">
            @if (productService.searchQuery()) {
              Results for "{{ productService.searchQuery() }}"
            } @else if (productService.selectedCategory() !== 'All') {
              {{ productService.selectedCategory() }}
            } @else {
              All Products & Tech Gear
            }
          </h1>
        </div>

        <!-- Catalog Layout: Sidebar + Main Content -->
        <div class="catalog-layout">
          
          <!-- FILTERS SIDEBAR (Desktop) -->
          <aside class="filters-sidebar glass-card" [class.mobile-open]="mobileFiltersOpen()">
            <div class="sidebar-header">
              <h3>Filters</h3>
              <div class="sidebar-actions">
                <button class="reset-btn" (click)="productService.resetFilters()">Reset All</button>
                <button class="close-mobile-filters" (click)="mobileFiltersOpen.set(false)">✕</button>
              </div>
            </div>

            <!-- Categories -->
            <div class="filter-group">
              <h4 class="filter-title">Categories</h4>
              <div class="category-list">
                @for (cat of productService.categories(); track cat.name) {
                  <button 
                    class="category-btn" 
                    [class.active]="productService.selectedCategory() === cat.name"
                    (click)="selectCategory(cat.name)"
                  >
                    <span>{{ cat.name }}</span>
                    <span class="cat-pill-count">{{ cat.count }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Price Range -->
            <div class="filter-group">
              <div class="filter-title-row">
                <h4 class="filter-title">Max Price</h4>
                <span class="price-indicator">\${{ productService.priceRange().max }}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1500" 
                step="25" 
                [ngModel]="productService.priceRange().max" 
                (ngModelChange)="onPriceChange($event)"
                class="range-slider"
              />
              <div class="range-labels">
                <span>\$50</span>
                <span>\$750</span>
                <span>\$1,500</span>
              </div>
            </div>

            <!-- Minimum Rating -->
            <div class="filter-group">
              <h4 class="filter-title">Customer Rating</h4>
              <div class="rating-filters">
                <button 
                  class="rating-btn" 
                  [class.active]="productService.minRating() === 0"
                  (click)="productService.minRating.set(0)"
                >
                  All Ratings
                </button>
                <button 
                  class="rating-btn" 
                  [class.active]="productService.minRating() === 4.8"
                  (click)="productService.minRating.set(4.8)"
                >
                  ★ 4.8 & above
                </button>
                <button 
                  class="rating-btn" 
                  [class.active]="productService.minRating() === 4.5"
                  (click)="productService.minRating.set(4.5)"
                >
                  ★ 4.5 & above
                </button>
              </div>
            </div>

            <!-- In Stock Only Switch -->
            <div class="filter-group">
              <label class="toggle-control">
                <input 
                  type="checkbox" 
                  [ngModel]="productService.inStockOnly()" 
                  (ngModelChange)="productService.inStockOnly.set($event)" 
                />
                <span class="toggle-slider"></span>
                <span class="toggle-label">In Stock Only</span>
              </label>
            </div>
          </aside>

          <!-- MAIN PRODUCTS CONTENT -->
          <main class="catalog-main">
            
            <!-- Controls Bar: Count, Sort, View Toggle -->
            <div class="controls-bar glass-card">
              <div class="results-meta">
                <span class="results-count">
                  Showing <strong>{{ productService.filteredProducts().length }}</strong> products
                </span>
                <button class="mobile-filter-trigger btn btn-sm btn-secondary" (click)="mobileFiltersOpen.set(true)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                  </svg>
                  Filters
                </button>
              </div>

              <div class="controls-right">
                <!-- Sort Dropdown -->
                <div class="sort-wrapper">
                  <label for="sort-select">Sort by:</label>
                  <select 
                    id="sort-select" 
                    [ngModel]="productService.sortBy()" 
                    (ngModelChange)="productService.sortBy.set($event)"
                    class="sort-select"
                  >
                    <option value="featured">Featured & Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                <!-- View Mode Toggle -->
                <div class="view-modes">
                  <button 
                    class="mode-btn" 
                    [class.active]="productService.viewMode() === 'grid'" 
                    (click)="productService.viewMode.set('grid')"
                    title="Grid View"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </button>
                  <button 
                    class="mode-btn" 
                    [class.active]="productService.viewMode() === 'list'" 
                    (click)="productService.viewMode.set('list')"
                    title="List View"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Active filter chips row -->
            @if (hasActiveFilters()) {
              <div class="active-chips">
                @if (productService.selectedCategory() !== 'All') {
                  <span class="filter-chip">
                    Category: {{ productService.selectedCategory() }}
                    <button (click)="productService.selectedCategory.set('All')">✕</button>
                  </span>
                }
                @if (productService.priceRange().max < 1500) {
                  <span class="filter-chip">
                    Under \${{ productService.priceRange().max }}
                    <button (click)="productService.priceRange.set({min: 0, max: 1500})">✕</button>
                  </span>
                }
                @if (productService.minRating() > 0) {
                  <span class="filter-chip">
                    ★ {{ productService.minRating() }}+
                    <button (click)="productService.minRating.set(0)">✕</button>
                  </span>
                }
                @if (productService.inStockOnly()) {
                  <span class="filter-chip">
                    In Stock
                    <button (click)="productService.inStockOnly.set(false)">✕</button>
                  </span>
                }
                @if (productService.searchQuery()) {
                  <span class="filter-chip">
                    "{{ productService.searchQuery() }}"
                    <button (click)="productService.searchQuery.set('')">✕</button>
                  </span>
                }
              </div>
            }

            <!-- Products List / Empty State -->
            @if (productService.filteredProducts().length === 0) {
              <div class="empty-results glass-card">
                <div class="empty-icon">🔍</div>
                <h3>No Matching Gear Found</h3>
                <p>Try adjusting your search criteria, widening the price limit, or removing applied filters.</p>
                <button class="btn btn-primary" (click)="productService.resetFilters()">
                  Clear All Filters
                </button>
              </div>
            } @else {
              <div [class]="productService.viewMode() === 'grid' ? 'grid-products' : 'list-products'">
                @for (prod of productService.filteredProducts(); track prod.id) {
                  <app-product-card 
                    [product]="prod" 
                    [isListMode]="productService.viewMode() === 'list'"
                  ></app-product-card>
                }
              </div>
            }

          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catalog-page {
      padding: 2.5rem 0 5rem;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .breadcrumb a:hover {
      color: var(--primary-light);
    }
    .breadcrumb .current {
      color: var(--text-primary);
      font-weight: 500;
    }
    .page-title {
      font-size: 2.25rem;
      font-weight: 800;
    }

    /* Layout */
    .catalog-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
      align-items: start;
    }

    /* Filters Sidebar */
    .filters-sidebar {
      padding: 1.5rem;
      position: sticky;
      top: 90px;
    }
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 1.5rem;
    }
    .sidebar-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
    }
    .reset-btn {
      font-size: 0.8rem;
      color: var(--primary-light);
      font-weight: 600;
    }
    .reset-btn:hover {
      text-decoration: underline;
    }
    .close-mobile-filters {
      display: none;
      color: var(--text-muted);
      font-size: 1.2rem;
    }

    .filter-group {
      margin-bottom: 1.75rem;
    }
    .filter-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .filter-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .price-indicator {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--primary-light);
    }

    /* Categories list */
    .category-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .category-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      color: var(--text-secondary);
      transition: all 0.15s;
      text-align: left;
    }
    .category-btn:hover {
      background: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .category-btn.active {
      background: var(--primary-glow);
      color: var(--primary-light);
      font-weight: 700;
    }
    .cat-pill-count {
      font-size: 0.75rem;
      background: var(--bg-surface);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
    }

    /* Range slider */
    .range-slider {
      width: 100%;
      accent-color: var(--primary);
      margin-bottom: 0.4rem;
    }
    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Ratings */
    .rating-filters {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .rating-btn {
      padding: 0.45rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      text-align: left;
      transition: all 0.15s;
    }
    .rating-btn:hover {
      border-color: var(--border-strong);
      color: var(--text-primary);
    }
    .rating-btn.active {
      border-color: var(--primary);
      color: var(--primary-light);
      background: var(--primary-glow);
      font-weight: 600;
    }

    /* Toggle switch */
    .toggle-control {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      user-select: none;
    }
    .toggle-control input {
      display: none;
    }
    .toggle-slider {
      width: 38px;
      height: 22px;
      background: var(--bg-surface-hover);
      border-radius: 999px;
      position: relative;
      transition: background 0.2s;
    }
    .toggle-slider::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      top: 3px;
      left: 3px;
      transition: transform 0.2s;
    }
    .toggle-control input:checked + .toggle-slider {
      background: var(--primary);
    }
    .toggle-control input:checked + .toggle-slider::after {
      transform: translateX(16px);
    }
    .toggle-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Controls bar */
    .controls-bar {
      padding: 0.85rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .results-count {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .mobile-filter-trigger {
      display: none;
    }
    .controls-right {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .sort-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .sort-select {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 0.4rem 0.75rem;
      color: var(--text-primary);
      font-size: 0.85rem;
    }
    .view-modes {
      display: flex;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 2px;
    }
    .mode-btn {
      padding: 4px 8px;
      border-radius: 4px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }
    .mode-btn.active {
      background: var(--primary);
      color: white;
    }

    /* Chips */
    .active-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-strong);
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      color: var(--primary-light);
    }
    .filter-chip button {
      color: var(--text-muted);
      font-size: 0.75rem;
      cursor: pointer;
    }

    /* Empty */
    .empty-results {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .empty-icon {
      font-size: 3rem;
    }
    .empty-results h3 {
      font-size: 1.35rem;
    }
    .empty-results p {
      max-width: 420px;
      margin-bottom: 0.5rem;
    }

    /* List mode products */
    .list-products {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    @media (max-width: 900px) {
      .catalog-layout {
        grid-template-columns: 1fr;
      }
      .mobile-filter-trigger {
        display: inline-flex;
      }
      .filters-sidebar {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 320px;
        z-index: 10002;
        background: var(--bg-surface);
        box-shadow: var(--shadow-lg);
        overflow-y: auto;
      }
      .filters-sidebar.mobile-open {
        display: block;
      }
      .close-mobile-filters {
        display: block;
      }
    }
  `]
})
export class CatalogComponent implements OnInit {
  productService = inject(ProductService);
  route = inject(ActivatedRoute);

  mobileFiltersOpen = signal<boolean>(false);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.productService.selectedCategory.set(params['category']);
      }
      if (params['search']) {
        this.productService.searchQuery.set(params['search']);
      }
      if (params['sort']) {
        this.productService.sortBy.set(params['sort']);
      }
    });
  }

  selectCategory(category: string) {
    this.productService.selectedCategory.set(category);
    this.mobileFiltersOpen.set(false);
  }

  onPriceChange(maxPrice: number) {
    this.productService.priceRange.update(r => ({ ...r, max: Number(maxPrice) }));
  }

  hasActiveFilters(): boolean {
    return (
      this.productService.selectedCategory() !== 'All' ||
      this.productService.priceRange().max < 1500 ||
      this.productService.minRating() > 0 ||
      this.productService.inStockOnly() ||
      this.productService.searchQuery().trim().length > 0
    );
  }
}

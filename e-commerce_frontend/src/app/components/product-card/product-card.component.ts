import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card glass-card" [class.list-mode]="isListMode">
      
      <!-- Media Section -->
      <div class="card-media">
        <!-- Badges -->
        <div class="badges-group">
          @if (product.badge) {
            <span class="badge" [ngClass]="'badge-' + product.badge.toLowerCase()">
              {{ product.badge }}
            </span>
          }
          @if (product.discountPercent) {
            <span class="badge badge-sale">-{{ product.discountPercent }}%</span>
          }
        </div>

        <!-- Wishlist Button -->
        <button 
          class="wishlist-toggle" 
          [class.active]="wishlistService.isInWishlist(product.id)" 
          (click)="wishlistService.toggleWishlist(product)"
          title="Save to wishlist"
          aria-label="Wishlist toggle"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" [attr.fill]="wishlistService.isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <!-- Product Image Link -->
        <a [routerLink]="['/product', product.id]" class="image-link">
          <img [src]="product.images[0]" [alt]="product.name" loading="lazy" class="product-img" />
        </a>

        <!-- Quick View Hover Action -->
        <div class="quick-view-overlay">
          <button class="btn btn-sm btn-secondary quick-view-btn" (click)="productService.openQuickView(product)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Quick View
          </button>
        </div>
      </div>

      <!-- Details Section -->
      <div class="card-details">
        <div class="card-meta">
          <span class="card-brand">{{ product.brand }}</span>
          <span class="card-dot">•</span>
          <span class="card-category">{{ product.category }}</span>
        </div>

        <h3 class="card-title">
          <a [routerLink]="['/product', product.id]">{{ product.name }}</a>
        </h3>

        <!-- Rating -->
        <div class="card-rating">
          <div class="stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span class="rating-num">{{ product.rating.toFixed(1) }}</span>
          </div>
          <span class="reviews-count">({{ product.reviewCount }})</span>
        </div>

        <!-- Color Swatches (if any) -->
        @if (product.colors && product.colors.length > 0) {
          <div class="color-swatches">
            @for (c of product.colors; track c.name) {
              <span class="color-dot" [style.background-color]="c.hex" [title]="c.name"></span>
            }
          </div>
        }

        <!-- Price and Action Bottom -->
        <div class="card-footer">
          <div class="price-container">
            <span class="current-price">\${{ product.price.toFixed(2) }}</span>
            @if (product.originalPrice) {
              <span class="original-price">\${{ product.originalPrice.toFixed(2) }}</span>
            }
          </div>

          <button 
            class="btn btn-sm btn-primary add-cart-btn" 
            (click)="cartService.addToCart(product, 1)" 
            title="Add to shopping bag"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
      height: 100%;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: rgba(99, 102, 241, 0.35);
    }

    /* Media */
    .card-media {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      background: var(--bg-surface-elevated);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .image-link {
      display: block;
      width: 100%;
      height: 100%;
    }
    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .product-card:hover .product-img {
      transform: scale(1.06);
    }

    /* Badges */
    .badges-group {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      pointer-events: none;
    }

    /* Wishlist toggle */
    .wishlist-toggle {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      z-index: 2;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: var(--bg-glass);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .wishlist-toggle:hover {
      background: var(--bg-surface-elevated);
      color: var(--accent-rose);
      transform: scale(1.1);
    }
    .wishlist-toggle.active {
      color: var(--accent-rose);
      border-color: rgba(244, 63, 94, 0.4);
      background: rgba(244, 63, 94, 0.15);
    }

    /* Quick View Overlay */
    .quick-view-overlay {
      position: absolute;
      bottom: 0.75rem;
      left: 0.75rem;
      right: 0.75rem;
      z-index: 2;
      opacity: 0;
      transform: translateY(8px);
      transition: all 0.25s ease;
      display: flex;
      justify-content: center;
    }
    .product-card:hover .quick-view-overlay {
      opacity: 1;
      transform: translateY(0);
    }
    .quick-view-btn {
      width: 100%;
      background: var(--bg-glass);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-strong);
      box-shadow: var(--shadow-sm);
    }

    /* Details */
    .card-details {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-meta {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.4rem;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.35;
      margin-bottom: 0.4rem;
    }
    .card-title a {
      color: var(--text-primary);
      transition: color 0.15s ease;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-title a:hover {
      color: var(--primary-light);
    }

    /* Rating */
    .card-rating {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      margin-bottom: 0.6rem;
    }
    .stars {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #fbbf24;
    }
    .rating-num {
      font-weight: 700;
      color: var(--text-primary);
    }
    .reviews-count {
      color: var(--text-muted);
    }

    /* Swatches */
    .color-swatches {
      display: flex;
      gap: 0.35rem;
      margin-bottom: 0.75rem;
    }
    .color-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1.5px solid var(--border-subtle);
    }

    /* Footer */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-subtle);
    }
    .price-container {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
    }
    .current-price {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .original-price {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }
    .add-cart-btn {
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-sm);
    }

    /* List mode override */
    .product-card.list-mode {
      flex-direction: row;
      height: auto;
    }
    .product-card.list-mode .card-media {
      width: 240px;
      aspect-ratio: auto;
    }
    .product-card.list-mode .card-details {
      padding: 1.5rem;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() isListMode: boolean = false;

  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  productService = inject(ProductService);
}

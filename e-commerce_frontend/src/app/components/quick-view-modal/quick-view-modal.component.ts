import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-quick-view-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (productService.quickViewProduct(); as product) {
      <div class="modal-backdrop" (click)="productService.closeQuickView()">
        <div class="modal-dialog glass-card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          
          <!-- Close Modal Button -->
          <button class="modal-close-btn" (click)="productService.closeQuickView()" aria-label="Close dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="modal-grid">
            <!-- Left: Gallery -->
            <div class="modal-gallery">
              <div class="main-preview">
                <img [src]="selectedImage() || product.images[0]" [alt]="product.name" class="active-img" />
              </div>
              @if (product.images.length > 1) {
                <div class="thumbnails-row">
                  @for (img of product.images; track img) {
                    <button 
                      class="thumb-btn" 
                      [class.active]="(selectedImage() || product.images[0]) === img"
                      (click)="selectedImage.set(img)"
                    >
                      <img [src]="img" [alt]="product.name" />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Right: Details -->
            <div class="modal-info">
              <div class="info-top">
                <span class="info-brand">{{ product.brand }}</span>
                <span class="info-category">{{ product.category }}</span>
              </div>

              <h2 class="info-title">{{ product.name }}</h2>

              <!-- Rating & Reviews -->
              <div class="info-rating">
                <div class="stars">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span class="rating-val">{{ product.rating.toFixed(1) }}</span>
                </div>
                <span class="rating-sep">•</span>
                <span class="rating-count">{{ product.reviewCount }} Verified Customer Reviews</span>
              </div>

              <!-- Price Box -->
              <div class="price-box">
                <span class="price-val">\${{ product.price.toFixed(2) }}</span>
                @if (product.originalPrice) {
                  <span class="original-val">\${{ product.originalPrice.toFixed(2) }}</span>
                  <span class="badge badge-sale">Save \${{ (product.originalPrice - product.price).toFixed(2) }}</span>
                }
              </div>

              <p class="info-desc">{{ product.description }}</p>

              <!-- Stock status -->
              <div class="stock-status">
                <span class="stock-indicator in-stock"></span>
                <span>In Stock — Ready for immediate dispatch</span>
              </div>

              <!-- Color Variants (if any) -->
              @if (product.colors && product.colors.length > 0) {
                <div class="variant-group">
                  <label class="variant-label">Color: <strong>{{ selectedColor() || product.colors[0].name }}</strong></label>
                  <div class="color-options">
                    @for (color of product.colors; track color.name) {
                      <button 
                        class="color-chip" 
                        [class.active]="(selectedColor() || product.colors[0].name) === color.name"
                        (click)="selectedColor.set(color.name)"
                        [title]="color.name"
                      >
                        <span class="swatch-circle" [style.background-color]="color.hex"></span>
                        <span>{{ color.name }}</span>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Quantity and Action Buttons -->
              <div class="action-row">
                <div class="quantity-picker">
                  <button (click)="decrementQty()">-</button>
                  <span>{{ quantity() }}</span>
                  <button (click)="incrementQty()">+</button>
                </div>

                <button class="btn btn-primary add-btn" (click)="addToCart(product)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Add To Bag
                </button>

                <button 
                  class="btn btn-icon" 
                  [class.active]="wishlistService.isInWishlist(product.id)"
                  (click)="wishlistService.toggleWishlist(product)"
                  title="Wishlist"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" [attr.fill]="wishlistService.isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>

              <!-- Full Details Link -->
              <div class="view-full-wrap">
                <a [routerLink]="['/product', product.id]" (click)="productService.closeQuickView()" class="full-link">
                  View Full Product Details & Technical Specs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 10005;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.25s ease;
    }

    .modal-dialog {
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      overflow-y: auto;
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-strong);
      position: relative;
      padding: 2rem;
      box-shadow: var(--shadow-lg);
    }

    .modal-close-btn {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      z-index: 10;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-subtle);
      transition: all 0.15s;
    }
    .modal-close-btn:hover {
      color: var(--text-primary);
      background: var(--bg-surface-hover);
    }

    .modal-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
      align-items: start;
    }

    /* Gallery */
    .modal-gallery {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .main-preview {
      width: 100%;
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
      background: var(--bg-surface-elevated);
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }
    .active-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .thumbnails-row {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
    }
    .thumb-btn {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      border: 2px solid var(--border-subtle);
      transition: border-color 0.2s;
      flex-shrink: 0;
    }
    .thumb-btn.active {
      border-color: var(--primary);
    }
    .thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Info */
    .modal-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .info-top {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .info-title {
      font-size: 1.6rem;
      line-height: 1.25;
      font-weight: 800;
    }
    .info-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }
    .stars {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #fbbf24;
    }
    .rating-val {
      font-weight: 700;
      color: var(--text-primary);
    }
    .rating-sep {
      color: var(--text-muted);
    }
    .rating-count {
      color: var(--text-muted);
    }

    .price-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0.25rem 0;
    }
    .price-val {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .original-val {
      font-size: 1.1rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }

    .info-desc {
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--text-secondary);
    }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--accent-emerald);
      font-weight: 600;
    }
    .stock-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-emerald);
      box-shadow: 0 0 8px var(--accent-emerald);
    }

    /* Variants */
    .variant-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .variant-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .color-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .color-chip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface-elevated);
      color: var(--text-primary);
      font-size: 0.825rem;
      font-weight: 500;
      transition: all 0.15s;
    }
    .color-chip.active {
      border-color: var(--primary);
      background: var(--primary-glow);
      color: var(--primary-light);
    }
    .swatch-circle {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Actions */
    .action-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .quantity-picker {
      display: flex;
      align-items: center;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      background: var(--bg-surface-elevated);
      height: 48px;
    }
    .quantity-picker button {
      width: 40px;
      height: 100%;
      font-size: 1.1rem;
      color: var(--text-secondary);
    }
    .quantity-picker button:hover {
      color: var(--text-primary);
    }
    .quantity-picker span {
      font-weight: 700;
      font-size: 1rem;
      padding: 0 0.5rem;
    }

    .add-btn {
      flex: 1;
      height: 48px;
    }
    .action-row .btn-icon {
      height: 48px;
      width: 48px;
    }
    .action-row .btn-icon.active {
      color: var(--accent-rose);
      border-color: var(--accent-rose);
    }

    .view-full-wrap {
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-subtle);
    }
    .full-link {
      font-size: 0.875rem;
      color: var(--primary-light);
      font-weight: 600;
      display: inline-block;
      transition: transform 0.15s;
    }
    .full-link:hover {
      transform: translateX(4px);
    }

    @media (max-width: 768px) {
      .modal-grid {
        grid-template-columns: 1fr;
      }
      .modal-dialog {
        padding: 1.5rem;
      }
    }
  `]
})
export class QuickViewModalComponent {
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  selectedImage = signal<string | null>(null);
  selectedColor = signal<string | null>(null);
  quantity = signal<number>(1);

  incrementQty() {
    this.quantity.update(q => q + 1);
  }

  decrementQty() {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart(product: import('../../models/product.model').Product) {
    const color = this.selectedColor() || (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    this.cartService.addToCart(product, this.quantity(), color);
    this.productService.closeQuickView();
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="wishlist-page">
      <div class="container">
        
        <div class="wishlist-header">
          <div>
            <h1 class="page-title">Saved Wishlist</h1>
            <p class="page-subtitle">Your curated collection of dream gear and future additions</p>
          </div>
          @if (wishlistService.items().length > 0) {
            <div class="header-actions">
              <button class="btn btn-secondary btn-sm" (click)="moveAllToCart()">
                Move All to Bag
              </button>
              <button class="btn btn-outline btn-sm" (click)="wishlistService.clearWishlist()">
                Clear Wishlist
              </button>
            </div>
          }
        </div>

        @if (wishlistService.items().length === 0) {
          <div class="empty-wishlist glass-card">
            <div class="empty-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you love by clicking the heart icon on any product card while browsing.</p>
            <a routerLink="/shop" class="btn btn-primary btn-lg">Explore Store Catalog</a>
          </div>
        } @else {
          <div class="grid-products">
            @for (prod of wishlistService.items(); track prod.id) {
              <app-product-card [product]="prod"></app-product-card>
            }
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .wishlist-page {
      padding: 2.5rem 0 6rem;
    }
    .wishlist-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .page-title {
      font-size: 2.25rem;
      font-weight: 800;
      margin-bottom: 0.25rem;
    }
    .page-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .empty-wishlist {
      padding: 5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      max-width: 540px;
      margin: 2rem auto;
    }
    .empty-icon {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .empty-wishlist p {
      max-width: 380px;
      line-height: 1.6;
    }
  `]
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  toastService = inject(ToastService);

  moveAllToCart() {
    const items = this.wishlistService.items();
    for (const prod of items) {
      this.cartService.addToCart(prod, 1);
    }
    this.wishlistService.clearWishlist();
    this.toastService.success(`Moved ${items.length} items to your shopping bag!`, 'Wishlist Moved');
  }
}

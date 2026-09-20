import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    @if (cartService.isDrawerOpen()) {
      <!-- Backdrop Overlay -->
      <div class="drawer-overlay" (click)="cartService.closeDrawer()"></div>

      <!-- Slide-Over Panel -->
      <aside class="cart-drawer-panel" role="dialog" aria-modal="true" aria-label="Shopping Cart">
        
        <!-- Header -->
        <div class="drawer-header">
          <div class="header-title">
            <h3>Your Bag</h3>
            <span class="item-count">({{ cartService.totalItemCount() }} items)</span>
          </div>
          <button class="close-btn" (click)="cartService.closeDrawer()" aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Free Shipping Progress Meter -->
        <div class="shipping-meter">
          @if (cartService.freeShippingProgress() >= 100) {
            <div class="shipping-msg unlocked">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Congratulations! You've unlocked <strong>FREE Express Shipping</strong>!</span>
            </div>
          } @else {
            <div class="shipping-msg">
              Add <strong>\${{ cartService.remainingForFreeShipping() }}</strong> more to unlock <strong>FREE Express Shipping</strong>
            </div>
          }
          <div class="progress-bar-track">
            <div class="progress-bar-fill" [style.width.%]="cartService.freeShippingProgress()"></div>
          </div>
        </div>

        <!-- Cart Items / Empty State -->
        <div class="drawer-body">
          @if (cartService.items().length === 0) {
            <div class="empty-cart">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h4>Your bag is currently empty</h4>
              <p>Explore our latest audio, tech, and lifestyle collections.</p>
              <a routerLink="/shop" (click)="cartService.closeDrawer()" class="btn btn-primary btn-sm">
                Browse Products
              </a>
            </div>
          } @else {
            <div class="cart-items-list">
              @for (item of cartService.items(); track item.product.id + (item.selectedColor || '')) {
                <div class="cart-item">
                  <img [src]="item.product.images[0]" [alt]="item.product.name" class="cart-item-img" />
                  <div class="cart-item-info">
                    <div class="item-title-row">
                      <a [routerLink]="['/product', item.product.id]" (click)="cartService.closeDrawer()" class="cart-item-name">
                        {{ item.product.name }}
                      </a>
                      <button class="remove-btn" (click)="cartService.removeFromCart(item.product.id, item.selectedColor)" title="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>

                    @if (item.selectedColor) {
                      <div class="cart-item-variant">Color: {{ item.selectedColor }}</div>
                    }

                    <div class="cart-item-bottom">
                      <div class="quantity-stepper">
                        <button (click)="cartService.updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)">-</button>
                        <span>{{ item.quantity }}</span>
                        <button (click)="cartService.updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)">+</button>
                      </div>

                      <div class="cart-item-pricing">
                        <span class="unit-price">\${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Footer / Checkout Area -->
        @if (cartService.items().length > 0) {
          <div class="drawer-footer">
            
            <!-- Promo Code Input -->
            <div class="promo-box">
              @if (cartService.appliedPromo(); as promo) {
                <div class="applied-promo-tag">
                  <span>Promo <strong>{{ promo.code }}</strong> applied ({{ promo.discountPercent }}% OFF)</span>
                  <button class="remove-promo-btn" (click)="cartService.removePromoCode()">✕</button>
                </div>
              } @else {
                <div class="promo-input-group">
                  <input type="text" placeholder="Promo code (try SAVE20)" [(ngModel)]="couponCode" />
                  <button class="btn btn-sm btn-secondary" (click)="applyCoupon()">Apply</button>
                </div>
              }
            </div>

            <!-- Price Breakdown -->
            <div class="summary-lines">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>\${{ cartService.subtotal().toFixed(2) }}</span>
              </div>
              @if (cartService.discountAmount() > 0) {
                <div class="summary-row discount-row">
                  <span>Discount</span>
                  <span>-\${{ cartService.discountAmount().toFixed(2) }}</span>
                </div>
              }
              <div class="summary-row">
                <span>Estimated Shipping</span>
                <span>{{ cartService.shippingFee() === 0 ? 'FREE' : ('$' + cartService.shippingFee().toFixed(2)) }}</span>
              </div>
              <div class="summary-row">
                <span>Estimated Tax</span>
                <span>\${{ cartService.taxAmount().toFixed(2) }}</span>
              </div>
              <div class="summary-row total-row">
                <span>Total</span>
                <span class="total-amount">\${{ cartService.totalPrice().toFixed(2) }}</span>
              </div>
            </div>

            <!-- Action CTAs -->
            <div class="drawer-actions">
              <a routerLink="/checkout" (click)="cartService.closeDrawer()" class="btn btn-primary checkout-cta">
                Proceed to Checkout
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <a routerLink="/cart" (click)="cartService.closeDrawer()" class="view-cart-link">
                View Full Bag Details
              </a>
            </div>
          </div>
        }
      </aside>
    }
  `,
  styles: [`
    .drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(6px);
      z-index: 10000;
      animation: fadeIn 0.25s ease;
    }

    .cart-drawer-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 440px;
      max-width: 100vw;
      background: var(--bg-surface);
      border-left: 1px solid var(--border-strong);
      z-index: 10001;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
      animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Header */
    .drawer-header {
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-subtle);
    }
    .header-title {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .header-title h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .item-count {
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    .close-btn {
      color: var(--text-muted);
      padding: 6px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s, background 0.15s;
    }
    .close-btn:hover {
      color: var(--text-primary);
      background: var(--bg-surface-elevated);
    }

    /* Shipping meter */
    .shipping-meter {
      background: var(--bg-surface-elevated);
      padding: 0.85rem 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .shipping-msg {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .shipping-msg.unlocked {
      color: var(--accent-emerald);
      font-weight: 600;
    }
    .progress-bar-track {
      width: 100%;
      height: 6px;
      background: var(--bg-surface);
      border-radius: 999px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald));
      border-radius: 999px;
      transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Body */
    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }
    .empty-cart {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 1rem;
    }
    .empty-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .empty-cart h4 {
      font-size: 1.1rem;
    }
    .empty-cart p {
      font-size: 0.85rem;
      color: var(--text-muted);
      max-width: 240px;
    }

    /* Cart item */
    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .cart-item {
      display: flex;
      gap: 1rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .cart-item-img {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }
    .cart-item-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .item-title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .cart-item-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: color 0.15s;
    }
    .cart-item-name:hover {
      color: var(--primary-light);
    }
    .remove-btn {
      color: var(--text-muted);
      padding: 2px;
      transition: color 0.15s;
    }
    .remove-btn:hover {
      color: var(--accent-rose);
    }
    .cart-item-variant {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .cart-item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
    }
    .quantity-stepper {
      display: flex;
      align-items: center;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      background: var(--bg-surface-elevated);
    }
    .quantity-stepper button {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: bold;
    }
    .quantity-stepper button:hover {
      color: var(--text-primary);
      background: var(--bg-surface-hover);
    }
    .quantity-stepper span {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0 0.4rem;
    }
    .unit-price {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-primary);
    }

    /* Footer */
    .drawer-footer {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
    }
    .promo-box {
      margin-bottom: 1rem;
    }
    .promo-input-group {
      display: flex;
      gap: 0.5rem;
    }
    .promo-input-group input {
      flex: 1;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 0.45rem 0.75rem;
      color: var(--text-primary);
      font-size: 0.825rem;
    }
    .applied-promo-tag {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(16, 185, 129, 0.1);
      border: 1px dashed rgba(16, 185, 129, 0.4);
      color: var(--accent-emerald);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
    }
    .remove-promo-btn {
      color: var(--accent-emerald);
      font-weight: bold;
      cursor: pointer;
    }

    .summary-lines {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      margin-bottom: 1.25rem;
      font-size: 0.85rem;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      color: var(--text-secondary);
    }
    .discount-row {
      color: var(--accent-emerald);
    }
    .total-row {
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.6rem;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .total-amount {
      color: var(--primary-light);
    }

    .drawer-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      text-align: center;
    }
    .checkout-cta {
      width: 100%;
      padding: 0.85rem;
      font-size: 0.95rem;
    }
    .view-cart-link {
      font-size: 0.825rem;
      color: var(--text-muted);
      transition: color 0.15s;
    }
    .view-cart-link:hover {
      color: var(--text-primary);
      text-decoration: underline;
    }
  `]
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  couponCode: string = '';

  applyCoupon() {
    if (this.couponCode) {
      const success = this.cartService.applyPromoCode(this.couponCode);
      if (success) {
        this.couponCode = '';
      }
    }
  }
}

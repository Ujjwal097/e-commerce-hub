import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="cart-page">
      <div class="container">
        
        <div class="cart-header">
          <h1 class="page-title">Your Shopping Bag</h1>
          @if (cartService.items().length > 0) {
            <span class="bag-subtitle">{{ cartService.totalItemCount() }} items ready for checkout</span>
          }
        </div>

        @if (cartService.items().length === 0) {
          <!-- Empty Cart State -->
          <div class="empty-bag-card glass-card">
            <div class="empty-bag-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h2>Your Bag Is Empty</h2>
            <p>Looks like you haven't added any premium gear yet. Explore our curated collections to get started.</p>
            <a routerLink="/shop" class="btn btn-primary btn-lg">Explore Store Catalog</a>
          </div>
        } @else {
          <!-- Two Column Layout: Cart Items & Order Summary -->
          <div class="cart-layout">
            
            <!-- Left: Items Table -->
            <div class="cart-items-section">
              
              <!-- Free shipping bar -->
              <div class="shipping-card glass-card">
                @if (cartService.freeShippingProgress() >= 100) {
                  <div class="shipping-unlocked">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>You've unlocked <strong>FREE Express Courier Shipping</strong>!</span>
                  </div>
                } @else {
                  <div class="shipping-needed">
                    Add <strong>\${{ cartService.remainingForFreeShipping() }}</strong> more to claim <strong>FREE Express Shipping</strong>
                  </div>
                }
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="cartService.freeShippingProgress()"></div>
                </div>
              </div>

              <!-- Item rows -->
              <div class="items-card glass-card">
                @for (item of cartService.items(); track item.product.id + (item.selectedColor || '')) {
                  <div class="cart-row">
                    <img [src]="item.product.images[0]" [alt]="item.product.name" class="item-thumbnail" />
                    
                    <div class="item-main">
                      <a [routerLink]="['/product', item.product.id]" class="item-title">
                        {{ item.product.name }}
                      </a>
                      <div class="item-meta">
                        <span>{{ item.product.brand }}</span>
                        @if (item.selectedColor) {
                          <span>• Color: {{ item.selectedColor }}</span>
                        }
                      </div>
                      <div class="item-unit-price">\${{ item.product.price.toFixed(2) }} each</div>
                    </div>

                    <div class="item-stepper-wrap">
                      <div class="stepper">
                        <button (click)="cartService.updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)">-</button>
                        <span>{{ item.quantity }}</span>
                        <button (click)="cartService.updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)">+</button>
                      </div>
                    </div>

                    <div class="item-subtotal">
                      \${{ (item.product.price * item.quantity).toFixed(2) }}
                    </div>

                    <button class="remove-action" (click)="cartService.removeFromCart(item.product.id, item.selectedColor)" title="Remove item">
                      ✕
                    </button>
                  </div>
                }

                <div class="cart-actions-row">
                  <a routerLink="/shop" class="continue-link">← Continue Shopping</a>
                  <button class="btn btn-outline btn-sm" (click)="cartService.clearCart()">Clear Bag</button>
                </div>
              </div>

            </div>

            <!-- Right: Order Summary Card -->
            <aside class="order-summary-section">
              <div class="summary-card glass-card">
                <h3>Order Summary</h3>

                <!-- Coupon Section -->
                <div class="coupon-box">
                  @if (cartService.appliedPromo(); as promo) {
                    <div class="promo-badge">
                      <span>Promo code <strong>{{ promo.code }}</strong> applied (-{{ promo.discountPercent }}%)</span>
                      <button class="remove-code-btn" (click)="cartService.removePromoCode()">✕</button>
                    </div>
                  } @else {
                    <div class="coupon-input-wrap">
                      <input type="text" placeholder="Promo code (SAVE20)" [(ngModel)]="couponCode" />
                      <button class="btn btn-sm btn-secondary" (click)="applyCoupon()">Apply</button>
                    </div>
                  }
                </div>

                <!-- Price Lines -->
                <div class="price-breakdown">
                  <div class="breakdown-line">
                    <span>Subtotal</span>
                    <span>\${{ cartService.subtotal().toFixed(2) }}</span>
                  </div>

                  @if (cartService.discountAmount() > 0) {
                    <div class="breakdown-line discount-text">
                      <span>Discount</span>
                      <span>-\${{ cartService.discountAmount().toFixed(2) }}</span>
                    </div>
                  }

                  <div class="breakdown-line">
                    <span>Shipping</span>
                    <span>{{ cartService.shippingFee() === 0 ? 'FREE' : ('$' + cartService.shippingFee().toFixed(2)) }}</span>
                  </div>

                  <div class="breakdown-line">
                    <span>Estimated Tax (8%)</span>
                    <span>\${{ cartService.taxAmount().toFixed(2) }}</span>
                  </div>

                  <div class="breakdown-total">
                    <span>Estimated Total</span>
                    <span class="total-val">\${{ cartService.totalPrice().toFixed(2) }}</span>
                  </div>
                </div>

                <a routerLink="/checkout" class="btn btn-primary btn-lg checkout-btn">
                  Proceed to Secure Checkout
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>

                <div class="security-guarantees">
                  <div class="sec-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
                  <div class="sec-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                </div>
              </div>
            </aside>

          </div>

          <!-- Cross-sell recommendations -->
          <div class="cross-sell-section">
            <h2 class="section-title">Frequently Added With Your Items</h2>
            <div class="grid-products">
              @for (prod of productService.featuredProducts().slice(0, 3); track prod.id) {
                <app-product-card [product]="prod"></app-product-card>
              }
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      padding: 2.5rem 0 6rem;
    }
    .cart-header {
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 2.25rem;
      font-weight: 800;
      margin-bottom: 0.25rem;
    }
    .bag-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    /* Empty state */
    .empty-bag-card {
      padding: 5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      max-width: 600px;
      margin: 2rem auto;
    }
    .empty-bag-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .empty-bag-card p {
      max-width: 400px;
      line-height: 1.6;
    }

    /* Layout */
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2.5rem;
      align-items: start;
    }

    /* Shipping card */
    .shipping-card {
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .shipping-unlocked {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--accent-emerald);
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }
    .shipping-needed {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 0.75rem;
    }
    .bar-track {
      width: 100%;
      height: 7px;
      background: var(--bg-surface-elevated);
      border-radius: 999px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald));
      border-radius: 999px;
      transition: width 0.3s ease;
    }

    /* Items card */
    .items-card {
      padding: 1.5rem;
    }
    .cart-row {
      display: grid;
      grid-template-columns: 80px 1fr auto auto 32px;
      gap: 1.5rem;
      align-items: center;
      padding: 1.25rem 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .cart-row:first-child {
      padding-top: 0;
    }
    .item-thumbnail {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      object-fit: cover;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .item-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
      display: block;
      margin-bottom: 0.25rem;
      transition: color 0.15s;
    }
    .item-title:hover {
      color: var(--primary-light);
    }
    .item-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }
    .item-unit-price {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    /* Stepper */
    .stepper {
      display: flex;
      align-items: center;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      background: var(--bg-surface-elevated);
      height: 38px;
    }
    .stepper button {
      width: 34px;
      height: 100%;
      font-size: 1rem;
      color: var(--text-secondary);
    }
    .stepper button:hover {
      color: var(--text-primary);
    }
    .stepper span {
      padding: 0 0.5rem;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .item-subtotal {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-primary);
      min-width: 90px;
      text-align: right;
    }
    .remove-action {
      color: var(--text-muted);
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s;
    }
    .remove-action:hover {
      color: var(--accent-rose);
    }

    .cart-actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
    }
    .continue-link {
      font-size: 0.9rem;
      color: var(--primary-light);
      font-weight: 600;
    }

    /* Summary card */
    .summary-card {
      padding: 1.75rem;
      position: sticky;
      top: 90px;
    }
    .summary-card h3 {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    /* Coupon */
    .coupon-box {
      margin-bottom: 1.5rem;
    }
    .coupon-input-wrap {
      display: flex;
      gap: 0.5rem;
    }
    .coupon-input-wrap input {
      flex: 1;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 0.55rem 0.85rem;
      color: var(--text-primary);
      font-size: 0.85rem;
    }
    .promo-badge {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(16, 185, 129, 0.1);
      border: 1px dashed rgba(16, 185, 129, 0.4);
      color: var(--accent-emerald);
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
    }
    .remove-code-btn {
      color: var(--accent-emerald);
      font-weight: bold;
      cursor: pointer;
    }

    /* Price lines */
    .price-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.75rem;
    }
    .breakdown-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.925rem;
      color: var(--text-secondary);
    }
    .discount-text {
      color: var(--accent-emerald);
    }
    .breakdown-total {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .total-val {
      color: var(--primary-light);
    }

    .checkout-btn {
      width: 100%;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .security-guarantees {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.78rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border-subtle);
      padding-top: 1rem;
    }
    .sec-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .sec-item svg {
      color: var(--accent-emerald);
    }

    .cross-sell-section {
      margin-top: 5rem;
    }
    .cross-sell-section .section-title {
      margin-bottom: 2rem;
      font-size: 1.75rem;
    }

    @media (max-width: 900px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }
      .cart-row {
        grid-template-columns: 70px 1fr;
        gap: 1rem;
      }
      .item-stepper-wrap {
        grid-column: 2;
      }
      .item-subtotal {
        grid-column: 2;
        text-align: left;
      }
      .remove-action {
        position: absolute;
        top: 1rem;
        right: 1rem;
      }
      .cart-row {
        position: relative;
      }
    }
  `]
})
export class CartPageComponent {
  cartService = inject(CartService);
  productService = inject(ProductService);
  couponCode: string = '';

  applyCoupon() {
    if (this.couponCode) {
      if (this.cartService.applyPromoCode(this.couponCode)) {
        this.couponCode = '';
      }
    }
  }
}

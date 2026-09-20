import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="orders-page">
      <div class="container">
        
        <div class="orders-header">
          <h1 class="page-title">My Orders</h1>
          <p class="page-subtitle">Track, manage, and view receipts for all your Lumina purchases</p>
        </div>

        @if (orderService.orders().length === 0) {
          <div class="empty-orders glass-card">
            <div class="empty-icon">📦</div>
            <h2>No Orders Placed Yet</h2>
            <p>You haven't made any purchases yet. Your completed orders will appear here.</p>
            <a routerLink="/shop" class="btn btn-primary">Start Shopping</a>
          </div>
        } @else {
          <div class="orders-list">
            @for (ord of orderService.orders(); track ord.id) {
              <div class="order-card glass-card">
                
                <!-- Order Top Bar -->
                <div class="order-card-top">
                  <div class="order-info-group">
                    <span class="info-label">ORDER PLACED</span>
                    <span class="info-val">{{ ord.date }}</span>
                  </div>

                  <div class="order-info-group">
                    <span class="info-label">TOTAL AMOUNT</span>
                    <span class="info-val font-bold">\${{ ord.total.toFixed(2) }}</span>
                  </div>

                  <div class="order-info-group">
                    <span class="info-label">SHIP TO</span>
                    <span class="info-val">{{ ord.shippingAddress.fullName }}</span>
                  </div>

                  <div class="order-info-group order-id-group">
                    <span class="info-label">ORDER # {{ ord.id }}</span>
                    <a [routerLink]="['/order-success', ord.id]" class="view-details-link">View Receipt & Tracking →</a>
                  </div>
                </div>

                <!-- Order Status Row -->
                <div class="order-status-row">
                  <div class="status-indicator">
                    <span class="status-badge" [ngClass]="'status-' + ord.status.toLowerCase().replace(' ', '-')">
                      {{ ord.status }}
                    </span>
                    <span class="delivery-est">
                      Estimated Delivery: <strong>{{ ord.estimatedDelivery }}</strong>
                    </span>
                  </div>
                  <span class="tracking-code">Tracking: <code>{{ ord.trackingNumber }}</code></span>
                </div>

                <!-- Items Row -->
                <div class="order-items-list">
                  @for (item of ord.items; track item.product.id) {
                    <div class="order-item-row">
                      <img [src]="item.product.images[0]" [alt]="item.product.name" class="item-img" />
                      <div class="item-meta">
                        <a [routerLink]="['/product', item.product.id]" class="item-name">{{ item.product.name }}</a>
                        <span class="item-sub">Qty: {{ item.quantity }} @if (item.selectedColor) { • Finish: {{ item.selectedColor }} }</span>
                        <span class="item-price">\${{ item.product.price.toFixed(2) }}</span>
                      </div>
                      <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" (click)="reorderItem(item.product)">
                          Buy Again
                        </button>
                      </div>
                    </div>
                  }
                </div>

              </div>
            }
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .orders-page {
      padding: 2.5rem 0 6rem;
    }
    .orders-header {
      margin-bottom: 2.5rem;
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

    .empty-orders {
      padding: 5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      max-width: 500px;
      margin: 2rem auto;
    }
    .empty-icon {
      font-size: 3.5rem;
    }

    /* Orders List */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .order-card {
      overflow: hidden;
    }
    .order-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.75rem;
      background: var(--bg-surface-elevated);
      border-bottom: 1px solid var(--border-subtle);
      flex-wrap: wrap;
      gap: 1.25rem;
    }
    .order-info-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .info-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }
    .info-val {
      font-size: 0.875rem;
      color: var(--text-primary);
    }
    .info-val.font-bold {
      font-weight: 800;
      color: var(--primary-light);
    }
    .order-id-group {
      text-align: right;
    }
    .view-details-link {
      font-size: 0.8rem;
      color: var(--primary-light);
      font-weight: 600;
    }
    .view-details-link:hover {
      text-decoration: underline;
    }

    /* Status row */
    .order-status-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.75rem;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 0.85rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .status-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      text-transform: uppercase;
    }
    .status-delivered {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-processing {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
    .status-shipped {
      background: rgba(6, 182, 212, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(6, 182, 212, 0.3);
    }
    .delivery-est {
      color: var(--text-secondary);
    }
    .tracking-code code {
      background: var(--bg-surface-elevated);
      padding: 0.2rem 0.45rem;
      border-radius: 4px;
      font-size: 0.8rem;
      border: 1px solid var(--border-subtle);
    }

    /* Items */
    .order-items-list {
      padding: 1.5rem 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .order-item-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .item-img {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      background: var(--bg-surface-elevated);
    }
    .item-meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .item-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .item-name:hover {
      color: var(--primary-light);
    }
    .item-sub {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .item-price {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    @media (max-width: 640px) {
      .order-card-top {
        flex-direction: column;
        align-items: flex-start;
      }
      .order-id-group {
        text-align: left;
      }
    }
  `]
})
export class OrdersComponent {
  orderService = inject(OrderService);
  cartService = inject(CartService);
  toastService = inject(ToastService);

  reorderItem(product: import('../../models/product.model').Product) {
    this.cartService.addToCart(product, 1);
  }
}

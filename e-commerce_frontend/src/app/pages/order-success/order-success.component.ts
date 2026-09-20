import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="order-success-page">
      <div class="container">
        
        @if (order(); as ord) {
          <!-- Celebration Banner -->
          <div class="success-card glass-card">
            <div class="success-icon-wrap">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <span class="badge badge-new">ORDER CONFIRMED</span>
            <h1 class="success-title">Thank You For Your Order!</h1>
            <p class="success-subtitle">
              We've received your purchase and sent confirmation to <strong>{{ ord.shippingAddress.email }}</strong>.
            </p>

            <div class="order-meta-pill">
              <div class="meta-segment">
                <span class="meta-label">ORDER ID</span>
                <span class="meta-value font-mono">{{ ord.id }}</span>
              </div>
              <div class="meta-div"></div>
              <div class="meta-segment">
                <span class="meta-label">DATE</span>
                <span class="meta-value">{{ ord.date }}</span>
              </div>
              <div class="meta-div"></div>
              <div class="meta-segment">
                <span class="meta-label">ESTIMATED ARRIVAL</span>
                <span class="meta-value highlighted">{{ ord.estimatedDelivery }}</span>
              </div>
              <div class="meta-div"></div>
              <div class="meta-segment">
                <span class="meta-label">TRACKING NO.</span>
                <span class="meta-value font-mono">{{ ord.trackingNumber }}</span>
              </div>
            </div>

            <!-- Delivery Progress Tracker -->
            <div class="tracker-box">
              <h4>Delivery Journey</h4>
              <div class="tracker-timeline">
                <div class="step completed">
                  <div class="step-dot">✓</div>
                  <span class="step-label">Order Placed</span>
                  <span class="step-time">Confirmed</span>
                </div>
                <div class="step-line active"></div>
                <div class="step in-progress">
                  <div class="step-dot">📦</div>
                  <span class="step-label">Processing</span>
                  <span class="step-time">At Fulfillment Hub</span>
                </div>
                <div class="step-line"></div>
                <div class="step pending">
                  <div class="step-dot">✈️</div>
                  <span class="step-label">In Transit</span>
                  <span class="step-time">With Courier</span>
                </div>
                <div class="step-line"></div>
                <div class="step pending">
                  <div class="step-dot">🏠</div>
                  <span class="step-label">Delivered</span>
                  <span class="step-time">{{ ord.estimatedDelivery }}</span>
                </div>
              </div>
            </div>

            <!-- Order Receipt Breakdown -->
            <div class="receipt-grid">
              
              <!-- Items Purchased -->
              <div class="receipt-items">
                <h4>Items in this shipment</h4>
                <div class="items-list">
                  @for (item of ord.items; track item.product.id) {
                    <div class="receipt-item-row">
                      <img [src]="item.product.images[0]" [alt]="item.product.name" class="item-img" />
                      <div class="item-info">
                        <span class="item-name">{{ item.product.name }}</span>
                        <span class="item-details">Qty: {{ item.quantity }} @if (item.selectedColor) { • {{ item.selectedColor }} }</span>
                      </div>
                      <span class="item-total">\${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Shipping & Payment Breakdown -->
              <div class="receipt-summary">
                <h4>Delivery & Payment</h4>
                <div class="address-preview">
                  <strong>{{ ord.shippingAddress.fullName }}</strong>
                  <p>{{ ord.shippingAddress.addressLine1 }}</p>
                  <p>{{ ord.shippingAddress.city }}, {{ ord.shippingAddress.state }} {{ ord.shippingAddress.postalCode }}</p>
                  <p>{{ ord.shippingAddress.country }}</p>
                  <p class="phone-text">Phone: {{ ord.shippingAddress.phone }}</p>
                </div>

                <div class="summary-lines">
                  <div class="line">
                    <span>Subtotal</span>
                    <span>\${{ ord.subtotal.toFixed(2) }}</span>
                  </div>
                  @if (ord.discount > 0) {
                    <div class="line discount">
                      <span>Discount</span>
                      <span>-\${{ ord.discount.toFixed(2) }}</span>
                    </div>
                  }
                  <div class="line">
                    <span>Shipping ({{ ord.shippingMethod }})</span>
                    <span>{{ ord.shipping === 0 ? 'FREE' : ('$' + ord.shipping.toFixed(2)) }}</span>
                  </div>
                  <div class="line">
                    <span>Sales Tax</span>
                    <span>\${{ ord.tax.toFixed(2) }}</span>
                  </div>
                  <div class="line total-line">
                    <span>Total Paid</span>
                    <span class="total-price">\${{ ord.total.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Action CTAs -->
            <div class="actions-row">
              <a routerLink="/shop" class="btn btn-primary btn-lg">
                Continue Shopping
              </a>
              <a routerLink="/orders" class="btn btn-secondary btn-lg">
                View All Orders
              </a>
              <button class="btn btn-outline btn-lg" (click)="printReceipt()">
                🖨️ Print Receipt
              </button>
            </div>

          </div>
        } @else {
          <div class="not-found-order glass-card">
            <h2>Order Details Not Found</h2>
            <p>Could not locate the requested order ID.</p>
            <a routerLink="/orders" class="btn btn-primary">Check Orders Page</a>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .order-success-page {
      padding: 3rem 0 6rem;
    }
    .success-card {
      max-width: 880px;
      margin: 0 auto;
      padding: 3rem 2.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .success-icon-wrap {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.15);
      border: 2px solid var(--accent-emerald);
      color: var(--accent-emerald);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
      animation: pulseGlow 2s infinite;
    }
    .success-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0.75rem 0 0.5rem;
    }
    .success-subtitle {
      font-size: 1.05rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
      max-width: 500px;
    }

    /* Meta Pill */
    .order-meta-pill {
      display: flex;
      align-items: center;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1rem 1.75rem;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .meta-segment {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .meta-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }
    .meta-value {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .meta-value.font-mono {
      font-family: monospace;
    }
    .meta-value.highlighted {
      color: var(--accent-emerald);
    }
    .meta-div {
      width: 1px;
      height: 28px;
      background: var(--border-subtle);
    }

    /* Tracker */
    .tracker-box {
      width: 100%;
      background: var(--bg-surface-elevated);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      margin-bottom: 2.5rem;
      border: 1px solid var(--border-subtle);
    }
    .tracker-box h4 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 1.75rem;
      text-align: left;
    }
    .tracker-timeline {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      min-width: 90px;
    }
    .step-dot {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--bg-surface);
      border: 2px solid var(--border-strong);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 800;
    }
    .step.completed .step-dot {
      background: var(--accent-emerald);
      border-color: var(--accent-emerald);
      color: white;
    }
    .step.in-progress .step-dot {
      border-color: var(--primary);
      box-shadow: 0 0 12px var(--primary-glow);
    }
    .step-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .step-time {
      font-size: 0.7rem;
      color: var(--text-muted);
    }
    .step-line {
      flex: 1;
      height: 3px;
      background: var(--border-strong);
      margin: 0 0.5rem 1.5rem;
    }
    .step-line.active {
      background: var(--accent-emerald);
    }

    /* Receipt */
    .receipt-grid {
      width: 100%;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 2rem;
      text-align: left;
      margin-bottom: 2.5rem;
    }
    .receipt-items, .receipt-summary {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
    }
    .receipt-items h4, .receipt-summary h4 {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .receipt-item-row {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .item-img {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      object-fit: cover;
    }
    .item-info {
      flex: 1;
    }
    .item-name {
      font-size: 0.875rem;
      font-weight: 600;
      display: block;
    }
    .item-details {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .item-total {
      font-weight: 700;
      font-size: 0.95rem;
    }

    .address-preview {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .address-preview strong {
      color: var(--text-primary);
      display: block;
      margin-bottom: 0.25rem;
    }
    .phone-text {
      color: var(--text-muted);
      margin-top: 0.35rem;
    }

    .summary-lines {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.85rem;
    }
    .line {
      display: flex;
      justify-content: space-between;
      color: var(--text-secondary);
    }
    .line.discount {
      color: var(--accent-emerald);
    }
    .line.total-line {
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.75rem;
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .total-price {
      color: var(--primary-light);
    }

    /* Actions */
    .actions-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .receipt-grid {
        grid-template-columns: 1fr;
      }
      .tracker-timeline {
        flex-direction: column;
        gap: 1rem;
      }
      .step-line {
        width: 3px;
        height: 20px;
        margin: 0;
      }
    }
  `]
})
export class OrderSuccessComponent implements OnInit {
  orderService = inject(OrderService);
  route = inject(ActivatedRoute);

  orderId = signal<string>('');
  order = signal<Order | undefined>(undefined);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderId.set(id);
        this.order.set(this.orderService.getOrderById(id));
      }
    });
  }

  printReceipt() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}

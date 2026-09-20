import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';
import { AdminStats } from '../../models/auth.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-portal">
      <div class="container-wide">
        
        <!-- Top Admin Bar -->
        <div class="admin-header glass-card">
          <div class="admin-title-wrap">
            <span class="badge badge-hot">RESTRICTED ACCESS</span>
            <h1 class="portal-heading">Store Administration & DB Console</h1>
            <p class="portal-sub">
              Logged in as: <strong>{{ authService.currentUser()?.name }}</strong> ({{ authService.currentUser()?.identifier }})
            </p>
          </div>

          <div class="header-actions">
            <a routerLink="/shop" class="btn btn-secondary btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              View Storefront
            </a>
            <button class="btn btn-outline btn-sm" (click)="authService.logout()">
              Sign Out
            </button>
          </div>
        </div>

        <!-- KPI Metrics Grid -->
        <div class="kpi-grid">
          <div class="kpi-card glass-card">
            <div class="kpi-icon icon-emerald">💰</div>
            <div class="kpi-data">
              <span class="kpi-label">TOTAL REVENUE</span>
              <span class="kpi-value">\${{ stats()?.totalRevenue?.toFixed(2) || '0.00' }}</span>
              <span class="kpi-hint">Processed in SQLite</span>
            </div>
          </div>

          <div class="kpi-card glass-card">
            <div class="kpi-icon icon-indigo">📦</div>
            <div class="kpi-data">
              <span class="kpi-label">TOTAL ORDERS</span>
              <span class="kpi-value">{{ stats()?.totalOrders || orderService.orders().length }}</span>
              <span class="kpi-hint">Across all customers</span>
            </div>
          </div>

          <div class="kpi-card glass-card">
            <div class="kpi-icon icon-cyan">🏷️</div>
            <div class="kpi-data">
              <span class="kpi-label">CATALOG PRODUCTS</span>
              <span class="kpi-value">{{ productService.products().length }}</span>
              <span class="kpi-hint">Live in database</span>
            </div>
          </div>

          <div class="kpi-card glass-card">
            <div class="kpi-icon icon-amber">👥</div>
            <div class="kpi-data">
              <span class="kpi-label">REGISTERED USERS</span>
              <span class="kpi-value">{{ stats()?.totalCustomers || 1 }}</span>
              <span class="kpi-hint">OTP Verified</span>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="portal-tabs">
          <button 
            class="portal-tab" 
            [class.active]="activeTab() === 'products'" 
            (click)="activeTab.set('products')"
          >
            📦 Product Management ({{ productService.products().length }})
          </button>
          <button 
            class="portal-tab" 
            [class.active]="activeTab() === 'orders'" 
            (click)="activeTab.set('orders')"
          >
            🚚 Order Fulfillment ({{ orderService.orders().length }})
          </button>
        </div>

        <!-- TAB 1: PRODUCT MANAGEMENT -->
        @if (activeTab() === 'products') {
          <div class="tab-view glass-card animate-fade-in">
            <div class="table-toolbar">
              <div>
                <h3>Live Product Inventory</h3>
                <p>Add, edit, or delete items stored in the SQLite database.</p>
              </div>

              <button class="btn btn-primary" (click)="openAddModal()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add New Product
              </button>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Badge</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (prod of productService.products(); track prod.id) {
                    <tr>
                      <td class="product-cell">
                        <img [src]="prod.images[0]" [alt]="prod.name" class="table-thumb" />
                        <div>
                          <span class="table-prod-name">{{ prod.name }}</span>
                          <span class="table-prod-brand">{{ prod.brand }} • ID: {{ prod.id }}</span>
                        </div>
                      </td>
                      <td><span class="cat-pill">{{ prod.category }}</span></td>
                      <td class="price-cell">
                        <strong>\${{ prod.price.toFixed(2) }}</strong>
                        @if (prod.originalPrice) {
                          <span class="strike">\${{ prod.originalPrice.toFixed(2) }}</span>
                        }
                      </td>
                      <td>
                        <span class="stock-pill" [class.low]="prod.stockQuantity < 5">
                          {{ prod.stockQuantity }} units
                        </span>
                      </td>
                      <td>
                        @if (prod.badge) {
                          <span class="badge" [ngClass]="'badge-' + prod.badge.toLowerCase()">
                            {{ prod.badge }}
                          </span>
                        } @else {
                          <span class="text-muted">—</span>
                        }
                      </td>
                      <td>
                        <div class="action-buttons">
                          <a [routerLink]="['/product', prod.id]" class="table-btn" title="View product on storefront">
                            👁️
                          </a>
                          <button class="table-btn delete-btn" (click)="deleteProduct(prod)" title="Delete from SQLite">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- TAB 2: ORDER MANAGEMENT -->
        @if (activeTab() === 'orders') {
          <div class="tab-view glass-card animate-fade-in">
            <div class="table-toolbar">
              <div>
                <h3>Customer Orders & Status Management</h3>
                <p>Advance fulfillment status in real-time.</p>
              </div>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (order of orderService.orders(); track order.id) {
                    <tr>
                      <td>
                        <strong>{{ order.id }}</strong>
                        <span class="order-date-text">{{ order.date }}</span>
                      </td>
                      <td>
                        <div>
                          <strong>{{ order.shippingAddress.fullName }}</strong>
                          <span class="order-email-text">{{ order.shippingAddress.email }}</span>
                        </div>
                      </td>
                      <td>{{ order.items.length }} items</td>
                      <td><strong>\${{ order.total.toFixed(2) }}</strong></td>
                      <td>
                        <span class="badge" [ngClass]="'status-' + order.status.toLowerCase().replace(' ', '-')">
                          {{ order.status }}
                        </span>
                      </td>
                      <td>
                        <select 
                          [ngModel]="order.status" 
                          (ngModelChange)="updateOrderStatus(order.id, $event)"
                          class="status-select input-control"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- ADD PRODUCT MODAL -->
        @if (isAddModalOpen()) {
          <div class="modal-backdrop" (click)="closeAddModal()">
            <div class="modal-card glass-card animate-fade-in" (click)="$event.stopPropagation()">
              
              <div class="modal-header">
                <h3>Create New Product in Database</h3>
                <button class="close-btn" (click)="closeAddModal()">✕</button>
              </div>

              <form (submit)="saveNewProduct($event)" class="modal-form">
                
                <div class="form-row">
                  <div class="form-field">
                    <label>Product Name *</label>
                    <input type="text" [(ngModel)]="newProd.name" name="name" placeholder="e.g. AuraPods Quantum ANC" class="input-control" required />
                  </div>

                  <div class="form-field">
                    <label>Brand Name</label>
                    <input type="text" [(ngModel)]="newProd.brand" name="brand" placeholder="e.g. AuraSound" class="input-control" required />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-field">
                    <label>Category *</label>
                    <select [(ngModel)]="newProd.category" name="category" class="input-control">
                      <option value="Audio">Audio</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Computer & Office">Computer & Office</option>
                      <option value="Photography">Photography</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div class="form-field">
                    <label>Badge Tag</label>
                    <select [(ngModel)]="newProd.badge" name="badge" class="input-control">
                      <option value="">None</option>
                      <option value="NEW">NEW</option>
                      <option value="SALE">SALE</option>
                      <option value="HOT">HOT</option>
                      <option value="BESTSELLER">BESTSELLER</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-field">
                    <label>Selling Price (\$) *</label>
                    <input type="number" step="0.01" [(ngModel)]="newProd.price" name="price" placeholder="199.99" class="input-control" required />
                  </div>

                  <div class="form-field">
                    <label>Original Price (\$) (for sale strikethrough)</label>
                    <input type="number" step="0.01" [(ngModel)]="newProd.originalPrice" name="originalPrice" placeholder="249.99" class="input-control" />
                  </div>

                  <div class="form-field">
                    <label>Inventory Quantity</label>
                    <input type="number" [(ngModel)]="newProd.stockQuantity" name="stockQuantity" placeholder="25" class="input-control" required />
                  </div>
                </div>

                <div class="form-field">
                  <label>Primary Image URL *</label>
                  <input type="url" [(ngModel)]="newProdImage" name="image" placeholder="https://images.unsplash.com/..." class="input-control" required />
                  <div class="preset-links">
                    <span>Presets:</span>
                    <button type="button" (click)="setImagePreset('audio')">Headphones</button>
                    <button type="button" (click)="setImagePreset('watch')">Smartwatch</button>
                    <button type="button" (click)="setImagePreset('camera')">Camera</button>
                    <button type="button" (click)="setImagePreset('desk')">Desk Gear</button>
                  </div>
                </div>

                <div class="form-field">
                  <label>Product Description *</label>
                  <textarea [(ngModel)]="newProd.description" name="description" rows="3" placeholder="Highlight engineering specs, materials, and acoustic design..." class="input-control" required></textarea>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" (click)="closeAddModal()">Cancel</button>
                  <button type="submit" class="btn btn-primary">Save to Database</button>
                </div>

              </form>

            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .admin-portal {
      padding: 2.5rem 0 6rem;
    }
    .admin-header {
      padding: 1.75rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    .portal-heading {
      font-size: 1.85rem;
      font-weight: 800;
      margin: 0.35rem 0 0.25rem;
    }
    .portal-sub {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    /* KPI grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .kpi-card {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .kpi-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .kpi-data {
      display: flex;
      flex-direction: column;
    }
    .kpi-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }
    .kpi-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.2;
    }
    .kpi-hint {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Tabs */
    .portal-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .portal-tab {
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 0.925rem;
      background: var(--bg-surface-elevated);
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
      transition: all 0.2s;
    }
    .portal-tab.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
      box-shadow: 0 4px 14px var(--primary-glow);
    }

    /* Tab view */
    .tab-view {
      padding: 2rem;
    }
    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .table-toolbar h3 {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 0.2rem;
    }
    .table-toolbar p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Table */
    .table-responsive {
      overflow-x: auto;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .admin-table th {
      text-align: left;
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--border-strong);
      color: var(--text-muted);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }
    .admin-table td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-subtle);
      vertical-align: middle;
    }
    .product-cell {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .table-thumb {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .table-prod-name {
      font-weight: 700;
      color: var(--text-primary);
      display: block;
    }
    .table-prod-brand {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .cat-pill {
      font-size: 0.75rem;
      background: var(--bg-surface-elevated);
      padding: 0.25rem 0.6rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
    }
    .price-cell strong {
      color: var(--primary-light);
    }
    .strike {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-decoration: line-through;
      margin-left: 0.35rem;
    }
    .stock-pill {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--accent-emerald);
    }
    .stock-pill.low {
      color: var(--accent-amber);
    }
    .action-buttons {
      display: flex;
      gap: 0.4rem;
    }
    .table-btn {
      padding: 0.35rem 0.5rem;
      border-radius: var(--radius-sm);
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      font-size: 0.85rem;
    }
    .table-btn:hover {
      background: var(--bg-surface-hover);
    }
    .table-btn.delete-btn:hover {
      border-color: var(--accent-rose);
      background: rgba(244, 63, 94, 0.15);
    }

    .order-date-text, .order-email-text {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .status-select {
      padding: 0.35rem 0.65rem;
      font-size: 0.8rem;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 10010;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-card {
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 2rem;
      background: var(--bg-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-strong);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .modal-header h3 {
      font-size: 1.35rem;
      font-weight: 800;
    }
    .close-btn {
      color: var(--text-muted);
      font-size: 1.25rem;
    }
    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-field label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .preset-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.35rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .preset-links button {
      color: var(--primary-light);
      text-decoration: underline;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }
  `]
})
export class AdminComponent implements OnInit {
  productService = inject(ProductService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  private http = inject(HttpClient);

  activeTab = signal<'products' | 'orders'>('products');
  stats = signal<AdminStats | null>(null);
  isAddModalOpen = signal<boolean>(false);

  newProd: Partial<Product> = {
    name: '',
    brand: 'Lumina Craft',
    category: 'Audio',
    price: 199.99,
    originalPrice: 249.99,
    stockQuantity: 20,
    badge: 'NEW',
    description: ''
  };
  newProdImage: string = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80';

  ngOnInit() {
    this.fetchStats();
    this.orderService.loadOrders();
    this.productService.loadProducts();
  }

  fetchStats() {
    this.http.get<AdminStats>(`${environment.adminApiUrl}/stats`).subscribe({
      next: data => this.stats.set(data),
      error: err => console.warn('Could not fetch admin stats', err)
    });
  }

  openAddModal() {
    this.isAddModalOpen.set(true);
  }

  closeAddModal() {
    this.isAddModalOpen.set(false);
  }

  setImagePreset(type: 'audio' | 'watch' | 'camera' | 'desk') {
    const presets: Record<string, string> = {
      audio: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      desk: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    };
    this.newProdImage = presets[type] || presets['audio'];
  }

  saveNewProduct(e: Event) {
    e.preventDefault();
    if (!this.newProd.name || !this.newProd.price) return;

    this.productService.createProduct({
      ...this.newProd,
      images: [this.newProdImage],
      features: ['Precision engineered', 'Aerospace components', 'Direct factory warranty'],
      specs: { 'Release': '2026', 'Origin': 'Handcrafted' }
    }).subscribe({
      next: () => {
        this.closeAddModal();
        this.fetchStats();
        // Reset form
        this.newProd = {
          name: '',
          brand: 'Lumina Craft',
          category: 'Audio',
          price: 199.99,
          originalPrice: 249.99,
          stockQuantity: 20,
          badge: 'NEW',
          description: ''
        };
      }
    });
  }

  deleteProduct(prod: Product) {
    if (confirm(`Are you sure you want to delete "${prod.name}" from the database?`)) {
      this.productService.deleteProduct(prod.id).subscribe({
        next: () => this.fetchStats()
      });
    }
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.toastService.success(`Order ${orderId} updated to ${newStatus}`, 'Status Updated');
        this.fetchStats();
      }
    });
  }
}

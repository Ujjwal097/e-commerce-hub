import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="product-detail-page">
      <div class="container">
        
        @if (product(); as prod) {
          <!-- Breadcrumbs -->
          <nav class="breadcrumb">
            <a routerLink="/">Home</a>
            <span class="sep">/</span>
            <a routerLink="/shop">Shop</a>
            <span class="sep">/</span>
            <a [routerLink]="['/shop']" [queryParams]="{category: prod.category}">{{ prod.category }}</a>
            <span class="sep">/</span>
            <span class="current">{{ prod.name }}</span>
          </nav>

          <!-- Top Product Section -->
          <div class="product-showcase-grid">
            
            <!-- Gallery Column -->
            <div class="gallery-col">
              <div class="main-image-viewport glass-card">
                <img [src]="selectedImage() || prod.images[0]" [alt]="prod.name" class="main-img" />
                @if (prod.badge) {
                  <span class="badge main-badge" [ngClass]="'badge-' + prod.badge.toLowerCase()">
                    {{ prod.badge }}
                  </span>
                }
              </div>

              @if (prod.images.length > 1) {
                <div class="thumbnails-track">
                  @for (img of prod.images; track img) {
                    <button 
                      class="thumb-btn glass-card" 
                      [class.active]="(selectedImage() || prod.images[0]) === img"
                      (click)="selectedImage.set(img)"
                    >
                      <img [src]="img" [alt]="prod.name" />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Buy Box / Details Column -->
            <div class="details-col">
              <div class="product-header">
                <span class="product-brand">{{ prod.brand }}</span>
                <h1 class="product-title">{{ prod.name }}</h1>

                <!-- Rating -->
                <div class="product-rating-row">
                  <div class="stars">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span class="rating-num">{{ prod.rating.toFixed(1) }}</span>
                  </div>
                  <span class="dot-sep">•</span>
                  <a href="#reviews-section" (click)="activeTab.set('reviews')" class="reviews-anchor">
                    {{ prod.reviewCount }} Verified Customer Reviews
                  </a>
                  <span class="dot-sep">•</span>
                  <span class="stock-badge">
                    <span class="pulse-dot"></span> In Stock ({{ prod.stockQuantity }} units)
                  </span>
                </div>
              </div>

              <!-- Price Card -->
              <div class="price-banner glass-card">
                <div class="price-wrap">
                  <span class="price-current">\${{ prod.price.toFixed(2) }}</span>
                  @if (prod.originalPrice) {
                    <span class="price-strike">\${{ prod.originalPrice.toFixed(2) }}</span>
                    <span class="badge badge-sale">Save \${{ (prod.originalPrice - prod.price).toFixed(2) }}</span>
                  }
                </div>
                <div class="shipping-hint">
                  Free 2-day delivery available • Or 4 interest-free payments of \${{ (prod.price / 4).toFixed(2) }}
                </div>
              </div>

              <p class="product-summary">{{ prod.description }}</p>

              <!-- Color Variant Selector -->
              @if (prod.colors && prod.colors.length > 0) {
                <div class="variant-selection">
                  <span class="variant-heading">Finish: <strong>{{ selectedColor() || prod.colors[0].name }}</strong></span>
                  <div class="color-chips">
                    @for (color of prod.colors; track color.name) {
                      <button 
                        class="color-btn" 
                        [class.active]="(selectedColor() || prod.colors[0].name) === color.name"
                        (click)="selectedColor.set(color.name)"
                      >
                        <span class="color-dot" [style.background-color]="color.hex"></span>
                        <span>{{ color.name }}</span>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Purchase Controls -->
              <div class="purchase-controls">
                <div class="quantity-box">
                  <button (click)="decrementQty()">-</button>
                  <span>{{ quantity() }}</span>
                  <button (click)="incrementQty()">+</button>
                </div>

                <button class="btn btn-primary btn-lg add-cart-action" (click)="addToCart(prod)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Add To Bag
                </button>

                <button class="btn btn-secondary btn-lg buy-now-action" (click)="buyNow(prod)">
                  Buy Now
                </button>

                <button 
                  class="btn btn-icon wishlist-action" 
                  [class.active]="wishlistService.isInWishlist(prod.id)"
                  (click)="wishlistService.toggleWishlist(prod)"
                  title="Save to Wishlist"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" [attr.fill]="wishlistService.isInWishlist(prod.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>

              <!-- Perks -->
              <div class="perks-grid">
                <div class="perk-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>2-Year Lumina Warranty</span>
                </div>
                <div class="perk-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                  <span>30-Day Risk-Free Trial</span>
                </div>
                <div class="perk-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  <span>Complimentary Carbon-Neutral Shipping</span>
                </div>
              </div>

            </div>
          </div>

          <!-- TABS SECTION -->
          <div class="product-tabs-section" id="reviews-section">
            <div class="tabs-header">
              <button 
                class="tab-btn" 
                [class.active]="activeTab() === 'overview'" 
                (click)="activeTab.set('overview')"
              >
                Features & Highlights
              </button>
              <button 
                class="tab-btn" 
                [class.active]="activeTab() === 'specs'" 
                (click)="activeTab.set('specs')"
              >
                Technical Specifications
              </button>
              <button 
                class="tab-btn" 
                [class.active]="activeTab() === 'reviews'" 
                (click)="activeTab.set('reviews')"
              >
                Customer Reviews ({{ reviews().length }})
              </button>
            </div>

            <div class="tab-content glass-card">
              <!-- Tab 1: Overview -->
              @if (activeTab() === 'overview') {
                <div class="tab-pane animate-fade-in">
                  <h3>Engineered for Precision & Longevity</h3>
                  <p class="tab-desc">{{ prod.description }}</p>
                  
                  <div class="features-list">
                    @for (feature of prod.features; track feature) {
                      <div class="feature-item">
                        <div class="feature-bullet">✓</div>
                        <span>{{ feature }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Tab 2: Specs Table -->
              @if (activeTab() === 'specs') {
                <div class="tab-pane animate-fade-in">
                  <h3>Technical Parameters</h3>
                  <table class="specs-table">
                    <tbody>
                      @for (spec of getSpecsList(prod.specs); track spec.key) {
                        <tr>
                          <td class="spec-name">{{ spec.key }}</td>
                          <td class="spec-value">{{ spec.val }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

              <!-- Tab 3: Reviews -->
              @if (activeTab() === 'reviews') {
                <div class="tab-pane animate-fade-in">
                  <div class="reviews-overview-box">
                    <div class="reviews-score">
                      <span class="big-score">{{ prod.rating.toFixed(1) }}</span>
                      <div class="stars">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      </div>
                      <span class="score-sub">Based on {{ reviews().length }} customer reviews</span>
                    </div>

                    <button class="btn btn-secondary" (click)="toggleReviewForm()">
                      {{ showReviewForm() ? 'Cancel Review' : 'Write a Review' }}
                    </button>
                  </div>

                  <!-- Review Submission Form -->
                  @if (showReviewForm()) {
                    <form (submit)="submitReview(prod.id, $event)" class="review-form glass-card animate-fade-in">
                      <h4>Share Your Experience</h4>
                      <div class="form-row">
                        <div class="form-field">
                          <label>Your Name</label>
                          <input type="text" [(ngModel)]="newReviewName" name="name" class="input-control" placeholder="e.g. Johnathan Doe" required />
                        </div>
                        <div class="form-field">
                          <label>Rating</label>
                          <select [(ngModel)]="newReviewRating" name="rating" class="input-control">
                            <option [value]="5">5 Stars - Outstanding</option>
                            <option [value]="4">4 Stars - Very Good</option>
                            <option [value]="3">3 Stars - Average</option>
                            <option [value]="2">2 Stars - Below Average</option>
                            <option [value]="1">1 Star - Disappointed</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-field">
                        <label>Your Feedback</label>
                        <textarea [(ngModel)]="newReviewComment" name="comment" rows="3" class="input-control" placeholder="What did you think of the design, performance, and craftsmanship?" required></textarea>
                      </div>
                      <button type="submit" class="btn btn-primary btn-sm">Publish Review</button>
                    </form>
                  }

                  <!-- Reviews list -->
                  <div class="reviews-list">
                    @for (rev of reviews(); track rev.id) {
                      <div class="review-card">
                        <div class="review-header">
                          <div class="user-meta">
                            <span class="user-avatar">{{ rev.userName.charAt(0) }}</span>
                            <div>
                              <div class="user-name">
                                {{ rev.userName }}
                                @if (rev.verifiedPurchase) {
                                  <span class="verified-tag">✓ Verified Buyer</span>
                                }
                              </div>
                              <span class="review-date">{{ rev.date }}</span>
                            </div>
                          </div>
                          <div class="stars">
                            @for (star of [1,2,3,4,5]; track star) {
                              <span [style.color]="star <= rev.rating ? '#fbbf24' : 'var(--border-strong)'">★</span>
                            }
                          </div>
                        </div>
                        <p class="review-body">{{ rev.comment }}</p>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- RELATED PRODUCTS -->
          @if (relatedProducts().length > 0) {
            <section class="related-section">
              <div class="section-header">
                <div>
                  <span class="section-subtitle">Complementary Gear</span>
                  <h2 class="section-title">You May Also Like</h2>
                </div>
              </div>
              <div class="grid-products">
                @for (rel of relatedProducts(); track rel.id) {
                  <app-product-card [product]="rel"></app-product-card>
                }
              </div>
            </section>
          }

        } @else {
          <!-- Product Not Found -->
          <div class="not-found-state glass-card">
            <h2>Product Not Found</h2>
            <p>The product you are looking for might have been moved or is currently discontinued.</p>
            <a routerLink="/shop" class="btn btn-primary">Back to Catalog</a>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .product-detail-page {
      padding: 2rem 0 6rem;
    }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .breadcrumb a:hover {
      color: var(--primary-light);
    }
    .breadcrumb .current {
      color: var(--text-primary);
      font-weight: 500;
    }

    /* Showcase Grid */
    .product-showcase-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3.5rem;
      align-items: start;
      margin-bottom: 4rem;
    }

    /* Gallery */
    .gallery-col {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: sticky;
      top: 90px;
    }
    .main-image-viewport {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      border-radius: var(--radius-xl);
      overflow: hidden;
      background: var(--bg-surface-elevated);
    }
    .main-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .main-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
    }
    .thumbnails-track {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .thumb-btn {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 2px solid var(--border-subtle);
      transition: all 0.2s;
      flex-shrink: 0;
      padding: 0;
    }
    .thumb-btn.active {
      border-color: var(--primary);
    }
    .thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Details */
    .details-col {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .product-brand {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary-light);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .product-title {
      font-size: 2.25rem;
      line-height: 1.15;
      font-weight: 800;
      margin: 0.35rem 0 0.75rem;
    }
    .product-rating-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.875rem;
      flex-wrap: wrap;
    }
    .stars {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .rating-num {
      font-weight: 700;
      color: var(--text-primary);
    }
    .dot-sep {
      color: var(--text-muted);
    }
    .reviews-anchor {
      color: var(--text-secondary);
      transition: color 0.15s;
    }
    .reviews-anchor:hover {
      color: var(--primary-light);
      text-decoration: underline;
    }
    .stock-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--accent-emerald);
      font-weight: 600;
      font-size: 0.8rem;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-emerald);
      box-shadow: 0 0 6px var(--accent-emerald);
    }

    /* Price banner */
    .price-banner {
      padding: 1.25rem 1.5rem;
      background: var(--bg-surface-elevated);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .price-wrap {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
    }
    .price-current {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .price-strike {
      font-size: 1.25rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }
    .shipping-hint {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .product-summary {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-secondary);
    }

    /* Variant */
    .variant-heading {
      font-size: 0.9rem;
      color: var(--text-secondary);
      display: block;
      margin-bottom: 0.5rem;
    }
    .color-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
    }
    .color-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.95rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface-elevated);
      color: var(--text-primary);
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .color-btn.active {
      border-color: var(--primary);
      background: var(--primary-glow);
      color: var(--primary-light);
      font-weight: 600;
    }
    .color-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Purchase controls */
    .purchase-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }
    .quantity-box {
      display: flex;
      align-items: center;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      background: var(--bg-surface-elevated);
      height: 52px;
    }
    .quantity-box button {
      width: 44px;
      height: 100%;
      font-size: 1.1rem;
      color: var(--text-secondary);
    }
    .quantity-box button:hover {
      color: var(--text-primary);
    }
    .quantity-box span {
      font-weight: 700;
      font-size: 1.05rem;
      padding: 0 0.6rem;
    }

    .add-cart-action {
      flex: 1;
      height: 52px;
    }
    .buy-now-action {
      height: 52px;
      padding: 0 1.5rem;
    }
    .wishlist-action {
      height: 52px;
      width: 52px;
    }
    .wishlist-action.active {
      color: var(--accent-rose);
      border-color: var(--accent-rose);
      background: rgba(244, 63, 94, 0.15);
    }

    /* Perks */
    .perks-grid {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }
    .perk-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .perk-item svg {
      color: var(--primary-light);
      flex-shrink: 0;
    }

    /* Tabs */
    .product-tabs-section {
      margin-bottom: 5rem;
    }
    .tabs-header {
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }
    .tab-btn {
      padding: 0.85rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-muted);
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .tab-btn:hover {
      color: var(--text-primary);
    }
    .tab-btn.active {
      color: var(--primary-light);
      border-bottom-color: var(--primary);
    }

    .tab-content {
      padding: 2rem;
    }
    .tab-pane h3 {
      font-size: 1.35rem;
      margin-bottom: 1rem;
    }
    .tab-desc {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .features-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .feature-bullet {
      color: var(--accent-emerald);
      font-weight: 800;
    }

    /* Specs table */
    .specs-table {
      width: 100%;
      border-collapse: collapse;
    }
    .specs-table tr {
      border-bottom: 1px solid var(--border-subtle);
    }
    .specs-table td {
      padding: 0.85rem 1rem;
      font-size: 0.9rem;
    }
    .spec-name {
      font-weight: 600;
      color: var(--text-primary);
      width: 35%;
      background: var(--bg-surface-elevated);
    }
    .spec-value {
      color: var(--text-secondary);
    }

    /* Reviews tab */
    .reviews-overview-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .reviews-score {
      display: flex;
      align-items: baseline;
      gap: 1rem;
    }
    .big-score {
      font-size: 2.5rem;
      font-weight: 800;
    }
    .score-sub {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Review form */
    .review-form {
      padding: 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
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

    /* Reviews list */
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .review-card {
      padding: 1.25rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .user-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--primary-glow);
      color: var(--primary-light);
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-name {
      font-size: 0.9rem;
      font-weight: 600;
    }
    .verified-tag {
      font-size: 0.75rem;
      color: var(--accent-emerald);
      margin-left: 0.4rem;
      font-weight: 500;
    }
    .review-date {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .review-body {
      font-size: 0.925rem;
      line-height: 1.6;
      color: var(--text-secondary);
    }

    /* Related */
    .related-section {
      margin-top: 4rem;
    }
    .not-found-state {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    @media (max-width: 900px) {
      .product-showcase-grid {
        grid-template-columns: 1fr;
      }
      .gallery-col {
        position: static;
      }
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  productId = signal<string>('');
  product = computed(() => this.productService.getProductById(this.productId()));
  
  selectedImage = signal<string | null>(null);
  selectedColor = signal<string | null>(null);
  quantity = signal<number>(1);
  activeTab = signal<'overview' | 'specs' | 'reviews'>('overview');

  showReviewForm = signal<boolean>(false);
  newReviewName: string = '';
  newReviewRating: number = 5;
  newReviewComment: string = '';

  reviews = computed(() => this.productService.getReviews(this.productId()));
  
  relatedProducts = computed(() => {
    const prod = this.product();
    if (!prod) return [];
    return this.productService.getRelatedProducts(prod.category, prod.id, 4);
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId.set(id);
        this.selectedImage.set(null);
        this.selectedColor.set(null);
        this.quantity.set(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  incrementQty() {
    this.quantity.update(q => q + 1);
  }

  decrementQty() {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  toggleReviewForm() {
    this.showReviewForm.update(v => !v);
  }

  addToCart(product: Product) {
    const color = this.selectedColor() || (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    this.cartService.addToCart(product, this.quantity(), color);
  }

  buyNow(product: Product) {
    this.addToCart(product);
    this.router.navigate(['/checkout']);
  }

  getSpecsList(specs: Record<string, string>): { key: string; val: string }[] {
    return Object.entries(specs).map(([key, val]) => ({ key, val }));
  }

  submitReview(productId: string, e: Event) {
    e.preventDefault();
    if (!this.newReviewName || !this.newReviewComment) return;

    this.productService.addReview(productId, {
      userName: this.newReviewName,
      rating: Number(this.newReviewRating),
      comment: this.newReviewComment
    });

    this.toastService.success('Thank you! Your verified review has been published.', 'Review Posted');
    this.newReviewName = '';
    this.newReviewComment = '';
    this.showReviewForm.set(false);
  }
}

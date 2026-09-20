import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="home-page">
      
      <!-- HERO BANNER SECTION -->
      <section class="hero-section">
        <div class="container hero-container">
          
          <div class="hero-content">
            <div class="hero-badge">
              <span class="pulse-dot"></span>
              <span>Next-Gen 2026 Innovation Collection</span>
            </div>

            <h1 class="hero-title">
              Crafted For Pure <span class="gradient-text">Acoustic & Digital</span> Mastery.
            </h1>

            <p class="hero-subtitle">
              Engineered with aerospace titanium, audiophile biocellulose drivers, and smart ambient algorithms. Experience luxury everyday gear designed for high performers.
            </p>

            <div class="hero-actions">
              <a routerLink="/shop" class="btn btn-primary btn-lg">
                Explore Flagship Gear
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>

              <a routerLink="/shop" [queryParams]="{sort: 'featured'}" class="btn btn-secondary btn-lg">
                View Bestsellers
              </a>
            </div>

            <!-- Social proof stats -->
            <div class="hero-metrics">
              <div class="metric-item">
                <span class="metric-val">50,000+</span>
                <span class="metric-label">Enthusiasts Worldwide</span>
              </div>
              <div class="metric-sep"></div>
              <div class="metric-item">
                <span class="metric-val">4.9 ★</span>
                <span class="metric-label">Average 12k+ Reviews</span>
              </div>
              <div class="metric-sep"></div>
              <div class="metric-item">
                <span class="metric-val">48h</span>
                <span class="metric-label">Fast Express Dispatch</span>
              </div>
            </div>
          </div>

          <!-- Hero Right: Featured Visual Showcase Card -->
          <div class="hero-showcase">
            <div class="showcase-glow"></div>
            @if (productService.products().length > 0) {
              @let heroProd = productService.products()[0];
              <div class="showcase-card glass-card">
                <div class="showcase-badge">
                  <span class="badge badge-hot">FEATURED FLAGSHIP</span>
                </div>
                
                <div class="showcase-image-wrap">
                  <img [src]="heroProd.images[0]" [alt]="heroProd.name" class="showcase-img" />
                </div>

                <div class="showcase-details">
                  <span class="showcase-category">{{ heroProd.category }} • {{ heroProd.brand }}</span>
                  <h3 class="showcase-name">{{ heroProd.name }}</h3>
                  
                  <div class="showcase-footer">
                    <div class="showcase-price-box">
                      <span class="showcase-price">\${{ heroProd.price.toFixed(2) }}</span>
                      <span class="showcase-original">\${{ heroProd.originalPrice?.toFixed(2) }}</span>
                    </div>

                    <button class="btn btn-primary btn-sm" (click)="cartService.addToCart(heroProd, 1)">
                      Quick Add
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- FLASH SALE COUNTDOWN STRIP -->
      <section class="flash-sale-strip">
        <div class="container flash-inner">
          <div class="flash-label">
            <span class="flash-icon">⚡</span>
            <div>
              <h3>SPRING EQUINOX FLASH SALE</h3>
              <p>Extra 20% OFF site-wide with checkout code <strong>SAVE20</strong></p>
            </div>
          </div>

          <div class="countdown-clock">
            <div class="clock-unit">
              <span class="clock-num">{{ hours() }}</span>
              <span class="clock-lbl">Hours</span>
            </div>
            <span class="clock-colon">:</span>
            <div class="clock-unit">
              <span class="clock-num">{{ minutes() }}</span>
              <span class="clock-lbl">Mins</span>
            </div>
            <span class="clock-colon">:</span>
            <div class="clock-unit">
              <span class="clock-num">{{ seconds() }}</span>
              <span class="clock-lbl">Secs</span>
            </div>
          </div>

          <div class="flash-cta">
            <button class="btn btn-secondary btn-sm copy-coupon-btn" (click)="copyCoupon('SAVE20')">
              Copy "SAVE20"
            </button>
          </div>
        </div>
      </section>

      <!-- CATEGORY SPOTLIGHT PILLS -->
      <section class="section categories-section">
        <div class="container">
          <div class="section-header">
            <div>
              <span class="section-subtitle">Curated Departments</span>
              <h2 class="section-title">Explore By Specialty</h2>
            </div>
            <a routerLink="/shop" class="section-link">View All Categories →</a>
          </div>

          <div class="categories-grid">
            @for (cat of categoryCards; track cat.name) {
              <a [routerLink]="['/shop']" [queryParams]="{category: cat.name}" class="category-card glass-card">
                <div class="cat-icon-box" [style.background]="cat.gradient">
                  <span class="cat-emoji">{{ cat.icon }}</span>
                </div>
                <div class="cat-info">
                  <h4 class="cat-title">{{ cat.name }}</h4>
                  <span class="cat-count">{{ cat.desc }}</span>
                </div>
                <span class="cat-arrow">→</span>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- TRENDING PRODUCTS GRID -->
      <section class="section trending-section">
        <div class="container">
          <div class="section-header">
            <div>
              <span class="section-subtitle">Trending This Week</span>
              <h2 class="section-title">Most Coveted Pieces</h2>
            </div>
            <div class="filter-pills">
              <button 
                class="filter-pill" 
                [class.active]="activeTab() === 'trending'" 
                (click)="activeTab.set('trending')"
              >
                Trending Now
              </button>
              <button 
                class="filter-pill" 
                [class.active]="activeTab() === 'featured'" 
                (click)="activeTab.set('featured')"
              >
                Editor's Choice
              </button>
            </div>
          </div>

          <div class="grid-products">
            @for (product of displayedProducts(); track product.id) {
              <app-product-card [product]="product"></app-product-card>
            }
          </div>

          <div class="section-bottom-cta">
            <a routerLink="/shop" class="btn btn-primary btn-lg">
              Explore All {{ productService.products().length }} Items
            </a>
          </div>
        </div>
      </section>

      <!-- LIFESTYLE PROMO BANNER -->
      <section class="section promo-banner-section">
        <div class="container">
          <div class="promo-banner glass-card">
            <div class="promo-banner-content">
              <span class="badge badge-primary">STUDIO UPGRADE INITIATIVE</span>
              <h2 class="banner-heading">Upgrade Your Creative Workflow in 2026.</h2>
              <p class="banner-text">
                Invest in ergonomic precision chairs, high-refresh 1000R curved displays, and hot-swappable mechanical keyboards engineered for flawless execution.
              </p>
              <div class="banner-buttons">
                <a routerLink="/shop" [queryParams]="{category: 'Computer & Office'}" class="btn btn-primary">
                  Shop Studio Collection
                </a>
              </div>
            </div>
            <div class="promo-banner-visual">
              <img 
                src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" 
                alt="Studio setup" 
                class="promo-img"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    /* Hero */
    .hero-section {
      position: relative;
      padding: 5rem 0 4rem;
      background: var(--hero-gradient);
      overflow: hidden;
    }
    .hero-container {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 3.5rem;
      align-items: center;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-full);
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--primary-light);
      margin-bottom: 1.5rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--primary);
      box-shadow: 0 0 8px var(--primary);
      animation: pulseGlow 1.5s infinite;
    }
    .hero-title {
      font-size: 3.25rem;
      line-height: 1.12;
      font-weight: 800;
      margin-bottom: 1.25rem;
      letter-spacing: -0.03em;
    }
    .hero-subtitle {
      font-size: 1.125rem;
      line-height: 1.65;
      color: var(--text-secondary);
      margin-bottom: 2rem;
      max-width: 540px;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }
    .hero-metrics {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);
    }
    .metric-item {
      display: flex;
      flex-direction: column;
    }
    .metric-val {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .metric-label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .metric-sep {
      width: 1px;
      height: 32px;
      background: var(--border-subtle);
    }

    /* Showcase */
    .hero-showcase {
      position: relative;
      display: flex;
      justify-content: center;
    }
    .showcase-glow {
      position: absolute;
      width: 320px;
      height: 320px;
      background: var(--primary-glow);
      filter: blur(80px);
      border-radius: 50%;
      z-index: 0;
    }
    .showcase-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      padding: 1.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
    }
    .showcase-badge {
      margin-bottom: 1rem;
    }
    .showcase-image-wrap {
      width: 100%;
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 1.25rem;
      background: var(--bg-surface-elevated);
    }
    .showcase-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .showcase-card:hover .showcase-img {
      transform: scale(1.05);
    }
    .showcase-category {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .showcase-name {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0.35rem 0 0.85rem;
    }
    .showcase-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-subtle);
    }
    .showcase-price-box {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .showcase-price {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .showcase-original {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }

    /* Flash sale */
    .flash-sale-strip {
      background: linear-gradient(90deg, #181b2b 0%, #1e293b 50%, #181b2b 100%);
      border-top: 1px solid var(--border-strong);
      border-bottom: 1px solid var(--border-strong);
      padding: 1.25rem 0;
    }
    .flash-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .flash-label {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .flash-icon {
      font-size: 1.8rem;
    }
    .flash-label h3 {
      font-size: 1.05rem;
      font-weight: 800;
      letter-spacing: 0.03em;
    }
    .flash-label p {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .countdown-clock {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .clock-unit {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 0.4rem 0.7rem;
      text-align: center;
      min-width: 54px;
    }
    .clock-num {
      display: block;
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary-light);
    }
    .clock-lbl {
      font-size: 0.65rem;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 600;
    }
    .clock-colon {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-muted);
    }

    /* Sections */
    .section {
      padding: 5rem 0;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .section-subtitle {
      font-size: 0.825rem;
      font-weight: 700;
      color: var(--primary-light);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: block;
      margin-bottom: 0.35rem;
    }
    .section-title {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .section-link {
      color: var(--primary-light);
      font-weight: 600;
      font-size: 0.925rem;
      transition: transform 0.15s;
    }
    .section-link:hover {
      transform: translateX(4px);
    }

    /* Categories Grid */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    .category-card {
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.25s ease;
    }
    .category-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary);
    }
    .cat-icon-box {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .cat-emoji {
      font-size: 1.5rem;
    }
    .cat-info {
      flex: 1;
    }
    .cat-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .cat-count {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .cat-arrow {
      color: var(--text-muted);
      font-size: 1.2rem;
      transition: transform 0.2s;
    }
    .category-card:hover .cat-arrow {
      color: var(--primary-light);
      transform: translateX(4px);
    }

    /* Filter pills */
    .filter-pills {
      display: flex;
      gap: 0.5rem;
      background: var(--bg-surface-elevated);
      padding: 0.35rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
    }
    .filter-pill {
      padding: 0.45rem 1.1rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all 0.2s;
    }
    .filter-pill.active {
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 2px 8px var(--primary-glow);
    }

    .section-bottom-cta {
      margin-top: 3.5rem;
      display: flex;
      justify-content: center;
    }

    /* Promo Banner */
    .promo-banner {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid var(--border-strong);
      background: linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(17, 19, 30, 0.9) 100%);
    }
    .promo-banner-content {
      padding: 3.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1.25rem;
    }
    .banner-heading {
      font-size: 2.25rem;
      line-height: 1.2;
      font-weight: 800;
    }
    .banner-text {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-secondary);
    }
    .promo-banner-visual {
      position: relative;
      height: 100%;
      min-height: 320px;
    }
    .promo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 1024px) {
      .hero-container {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .hero-subtitle {
        margin-left: auto;
        margin-right: auto;
      }
      .hero-actions {
        justify-content: center;
      }
      .hero-metrics {
        justify-content: center;
      }
      .promo-banner {
        grid-template-columns: 1fr;
      }
      .promo-banner-visual {
        min-height: 240px;
      }
    }

    @media (max-width: 640px) {
      .hero-title {
        font-size: 2.35rem;
      }
      .flash-inner {
        flex-direction: column;
        text-align: center;
      }
      .flash-label {
        flex-direction: column;
      }
      .promo-banner-content {
        padding: 2rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  productService = inject(ProductService);
  cartService = inject(CartService);
  toastService = inject(ToastService);

  activeTab = signal<'trending' | 'featured'>('trending');

  // Flash sale countdown timer state
  hours = signal<string>('08');
  minutes = signal<string>('42');
  seconds = signal<string>('19');
  private timerInterval?: any;

  categoryCards = [
    { name: 'Audio', desc: 'Noise-cancelling & Hi-Fi', icon: '🎧', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)' },
    { name: 'Wearables', desc: 'Titanium Smartwatches', icon: '⌚', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
    { name: 'Computer & Office', desc: 'Keyboards, Chairs & Hubs', icon: '💻', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
    { name: 'Photography', desc: '4K Drones & Cameras', icon: '📷', gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
    { name: 'Home & Kitchen', desc: 'Artisan Espresso & Lights', icon: '☕', gradient: 'linear-gradient(135deg, #10b981, #059669)' }
  ];

  displayedProducts() {
    return this.activeTab() === 'trending' 
      ? this.productService.trendingProducts() 
      : this.productService.featuredProducts();
  }

  ngOnInit() {
    let totalSecs = 8 * 3600 + 42 * 60 + 19;
    this.timerInterval = setInterval(() => {
      if (totalSecs > 0) {
        totalSecs--;
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        this.hours.set(h.toString().padStart(2, '0'));
        this.minutes.set(m.toString().padStart(2, '0'));
        this.seconds.set(s.toString().padStart(2, '0'));
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  copyCoupon(code: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      this.toastService.success(`Copied code "${code}" to clipboard!`, 'Coupon Copied');
    } else {
      this.toastService.info(`Use coupon code ${code} at checkout`);
    }
  }
}

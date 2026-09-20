import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Trust Badges Strip -->
    <div class="trust-section">
      <div class="container trust-grid">
        <div class="trust-card">
          <div class="trust-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <div class="trust-info">
            <h4>Free Express Shipping</h4>
            <p>On all domestic orders over \$100</p>
          </div>
        </div>

        <div class="trust-card">
          <div class="trust-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div class="trust-info">
            <h4>2-Year Full Warranty</h4>
            <p>Comprehensive coverage guaranteed</p>
          </div>
        </div>

        <div class="trust-card">
          <div class="trust-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </div>
          <div class="trust-info">
            <h4>30-Day Effortless Returns</h4>
            <p>No questions asked return policy</p>
          </div>
        </div>

        <div class="trust-card">
          <div class="trust-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          <div class="trust-info">
            <h4>24/7 Expert Support</h4>
            <p>Live chat with tech specialists</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer -->
    <footer class="site-footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <div class="brand-logo">
            <div class="logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <span class="brand-name">LUMINA LUXE</span>
          </div>
          <p class="brand-bio">
            Curating state-of-the-art consumer audio, luxury wearables, and studio workspace gear for modern innovators.
          </p>
          <div class="social-links">
            <a href="#" class="social-icon" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" class="social-icon" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" class="social-icon" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>
        </div>

        <div class="footer-column">
          <h4 class="footer-heading">Collections</h4>
          <ul class="footer-nav">
            <li><a routerLink="/shop" [queryParams]="{category: 'Audio'}">Wireless Audio</a></li>
            <li><a routerLink="/shop" [queryParams]="{category: 'Wearables'}">Smart Wearables</a></li>
            <li><a routerLink="/shop" [queryParams]="{category: 'Computer & Office'}">Studio & Desk Tech</a></li>
            <li><a routerLink="/shop" [queryParams]="{category: 'Photography'}">Creator Photography</a></li>
            <li><a routerLink="/shop" [queryParams]="{category: 'Home & Kitchen'}">Artisan Lifestyle</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="footer-heading">Customer Care</h4>
          <ul class="footer-nav">
            <li><a routerLink="/orders">Track Your Order</a></li>
            <li><a routerLink="/cart">Shopping Bag</a></li>
            <li><a routerLink="/wishlist">Saved Wishlist</a></li>
            <li><a href="#returns">Shipping & Returns</a></li>
            <li><a href="#warranty">Warranty Registration</a></li>
          </ul>
        </div>

        <div class="footer-column newsletter-col">
          <h4 class="footer-heading">Join The Lumina Circle</h4>
          <p class="newsletter-sub">Get 15% off your first purchase, private drops, and VIP audio previews.</p>
          <form (submit)="subscribeNewsletter($event)" class="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              [(ngModel)]="newsletterEmail" 
              name="email" 
              class="newsletter-input" 
              required 
            />
            <button type="submit" class="btn btn-primary btn-sm newsletter-btn">Subscribe</button>
          </form>
          <div class="payment-guarantee">
            <span>Guaranteed Safe & Encrypted Checkout</span>
            <div class="payment-badges">
              <span class="pay-pill">VISA</span>
              <span class="pay-pill">MC</span>
              <span class="pay-pill">AMEX</span>
              <span class="pay-pill">APPLE PAY</span>
              <span class="pay-pill">UPI</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container bottom-inner">
          <p>© 2026 Lumina Luxe Inc. Built with Angular 19 Signals Architecture.</p>
          <div class="legal-links">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">Terms of Service</a>
            <span>•</span>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* Trust Section */
    .trust-section {
      background: var(--bg-surface);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      padding: 3rem 0;
    }
    .trust-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 2rem;
    }
    .trust-card {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .trust-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--primary-glow);
      color: var(--primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .trust-info h4 {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }
    .trust-info p {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Site Footer */
    .site-footer {
      background: var(--bg-app);
      border-top: 1px solid var(--border-subtle);
      padding-top: 4rem;
    }
    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 2fr;
      gap: 3rem;
      margin-bottom: 3.5rem;
    }
    .footer-brand .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1rem;
    }
    .brand-logo .logo-mark {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-name {
      font-weight: 800;
      letter-spacing: 0.05em;
      font-size: 1.15rem;
      color: var(--text-primary);
    }
    .brand-bio {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1.5rem;
      max-width: 320px;
    }
    .social-links {
      display: flex;
      gap: 0.75rem;
    }
    .social-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--bg-surface-elevated);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-subtle);
      transition: all 0.2s;
    }
    .social-icon:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    /* Links */
    .footer-heading {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .footer-nav {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .footer-nav a {
      font-size: 0.875rem;
      color: var(--text-muted);
      transition: color 0.15s ease;
    }
    .footer-nav a:hover {
      color: var(--primary-light);
    }

    /* Newsletter */
    .newsletter-sub {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }
    .newsletter-form {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .newsletter-input {
      flex: 1;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.6rem 0.85rem;
      color: var(--text-primary);
      font-size: 0.875rem;
    }
    .newsletter-input:focus {
      border-color: var(--primary);
    }
    .payment-guarantee span {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .payment-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .pay-pill {
      font-size: 0.65rem;
      font-weight: 800;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      color: var(--text-secondary);
    }

    /* Bottom */
    .footer-bottom {
      border-top: 1px solid var(--border-subtle);
      padding: 1.5rem 0;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .bottom-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .legal-links {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .legal-links a:hover {
      color: var(--text-primary);
    }

    @media (max-width: 900px) {
      .footer-content {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 600px) {
      .footer-content {
        grid-template-columns: 1fr;
      }
      .bottom-inner {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  toastService = inject(ToastService);
  newsletterEmail: string = '';

  subscribeNewsletter(e: Event) {
    e.preventDefault();
    if (this.newsletterEmail) {
      this.toastService.success(`Welcome to the Lumina Circle! 15% promo sent to ${this.newsletterEmail}`, 'Subscription Confirmed');
      this.newsletterEmail = '';
    }
  }
}

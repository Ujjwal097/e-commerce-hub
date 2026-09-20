import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Top Announcement Bar -->
    <div class="announcement-bar">
      <div class="container announcement-inner">
        <div class="announcement-text">
          <span class="pulse-dot"></span>
          <span><strong>LIMITED TIME:</strong> Use code <span class="promo-pill">SAVE20</span> for 20% off • Free Express Shipping over $100</span>
        </div>
        <div class="announcement-links">
          @if (authService.isAdmin()) {
            <a routerLink="/admin" class="announcement-link admin-highlight">🛡️ Admin Portal Console</a>
            <span class="divider">|</span>
          }
          <a routerLink="/orders" class="announcement-link">Track Orders</a>
          <span class="divider">|</span>
          <span class="support-text">24/7 VIP Concierge</span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="main-header" [class.header-scrolled]="isScrolled()">
      <div class="container header-container">
        
        <!-- Left: Logo -->
        <a routerLink="/" class="brand-logo">
          <div class="logo-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-title">LUMINA</span>
            <span class="logo-subtitle">LUXE</span>
          </div>
        </a>

        <!-- Middle: Nav Links (Desktop) -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/shop" routerLinkActive="active">All Products</a>
          <a routerLink="/shop" [queryParams]="{category: 'Audio'}" routerLinkActive="active">Audio</a>
          <a routerLink="/shop" [queryParams]="{category: 'Wearables'}" routerLinkActive="active">Wearables</a>
          <a routerLink="/shop" [queryParams]="{category: 'Computer & Office'}" routerLinkActive="active">Studio Tech</a>
          <a routerLink="/orders" routerLinkActive="active">My Orders</a>
          @if (authService.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active" class="admin-nav-item">
              <span class="admin-star">🛡️</span> Admin Portal
            </a>
          }
        </nav>

        <!-- Search Bar with Live Preview -->
        <div class="search-wrapper">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search gear, audio, tech..." 
              [ngModel]="productService.searchQuery()" 
              (ngModelChange)="onSearchChange($event)"
              (focus)="showSearchDropdown.set(true)"
              (keydown.enter)="executeSearch()"
            />
            @if (productService.searchQuery()) {
              <button class="clear-search" (click)="productService.searchQuery.set('')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            }
          </div>

          <!-- Live Search Results Dropdown -->
          @if (showSearchDropdown() && productService.searchQuery().trim().length >= 2) {
            <div class="search-dropdown glass-card animate-fade-in">
              <div class="search-dropdown-header">
                <span>Matching Products</span>
                <button class="close-dropdown" (click)="showSearchDropdown.set(false)">✕</button>
              </div>

              @if (productService.filteredProducts().length === 0) {
                <div class="search-empty">No products found matching "{{ productService.searchQuery() }}"</div>
              } @else {
                <div class="search-results-list">
                  @for (prod of productService.filteredProducts().slice(0, 5); track prod.id) {
                    <a [routerLink]="['/product', prod.id]" (click)="showSearchDropdown.set(false)" class="search-item">
                      <img [src]="prod.images[0]" [alt]="prod.name" class="search-item-thumb" />
                      <div class="search-item-details">
                        <div class="search-item-title">{{ prod.name }}</div>
                        <div class="search-item-meta">
                          <span class="search-item-cat">{{ prod.category }}</span>
                          <span class="search-item-price">\${{ prod.price.toFixed(2) }}</span>
                        </div>
                      </div>
                    </a>
                  }
                </div>
                <div class="search-dropdown-footer">
                  <button class="btn btn-sm btn-outline view-all-btn" (click)="executeSearch()">
                    View all {{ productService.filteredProducts().length }} results →
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <!-- Right: Action Buttons -->
        <div class="header-actions">
          <!-- Theme Toggle -->
          <button class="action-btn theme-toggle" (click)="toggleTheme()" [title]="isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            @if (isDarkMode()) {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            }
          </button>

          <!-- Wishlist Button -->
          <a routerLink="/wishlist" class="action-btn wishlist-btn" title="Saved Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            @if (wishlistService.count() > 0) {
              <span class="badge-count">{{ wishlistService.count() }}</span>
            }
          </a>

          <!-- Cart Drawer Button -->
          <button class="action-btn cart-btn" (click)="cartService.openDrawer()" title="View Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            @if (cartService.totalItemCount() > 0) {
              <span class="badge-count cart-badge-count">{{ cartService.totalItemCount() }}</span>
            }
          </button>

          <!-- User Authentication Section -->
          @if (authService.isLoggedIn()) {
            <div class="user-menu-wrapper">
              <button class="user-pill-btn" (click)="toggleUserDropdown()" title="Account details">
                <span class="user-avatar-circle">
                  {{ (authService.currentUser()?.name || 'U').charAt(0).toUpperCase() }}
                </span>
                <span class="user-role-tag" [class.admin-role]="authService.isAdmin()">
                  {{ authService.isAdmin() ? 'ADMIN' : 'USER' }}
                </span>
              </button>

              @if (userDropdownOpen()) {
                <div class="user-dropdown-panel glass-card animate-fade-in" (click)="$event.stopPropagation()">
                  <div class="user-dropdown-info">
                    <span class="user-name-text">{{ authService.currentUser()?.name }}</span>
                    <div class="user-handle-row">
                      <span class="user-handle-text">&#64;{{ authService.currentUser()?.username || 'user' }}</span>
                      <button type="button" class="edit-handle-btn" (click)="openUsernameModal($event)" title="Change username">
                        ✏️ Edit
                      </button>
                    </div>
                    <span class="user-id-text">{{ authService.currentUser()?.email || authService.currentUser()?.identifier }}</span>
                    @if (authService.currentUser()?.phoneNumber) {
                      <span class="user-phone-text">📱 {{ authService.currentUser()?.phoneNumber }}</span>
                    }
                    <span class="role-badge" [class.admin]="authService.isAdmin()">
                      {{ authService.currentUser()?.role?.toUpperCase() }}
                    </span>
                  </div>

                  <div class="dropdown-links">
                    @if (authService.isAdmin()) {
                      <a routerLink="/admin" (click)="userDropdownOpen.set(false)" class="drop-link admin-link">
                        🛡️ Admin Dashboard
                      </a>
                    }
                    <a routerLink="/orders" (click)="userDropdownOpen.set(false)" class="drop-link">
                      📦 My Purchases & Orders
                    </a>
                    <a routerLink="/wishlist" (click)="userDropdownOpen.set(false)" class="drop-link">
                      ❤️ Saved Wishlist
                    </a>
                    <button class="drop-link logout-btn" (click)="userDropdownOpen.set(false); authService.logout()">
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="header-auth-group">
              <a routerLink="/login" [queryParams]="{ mode: 'signin' }" class="signin-nav-link">
                Sign In
              </a>
              <a routerLink="/login" [queryParams]="{ mode: 'signup' }" class="btn btn-sm btn-primary signup-nav-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                <span>Sign Up</span>
              </a>
            </div>
          }

          <!-- Mobile Menu Hamburger -->
          <button class="action-btn mobile-menu-btn" (click)="toggleMobileMenu()">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      @if (mobileMenuOpen()) {
        <div class="mobile-nav-panel glass-card animate-fade-in">
          @if (authService.isLoggedIn()) {
            <div class="mobile-user-card">
              <span>Signed in as: <strong>{{ authService.currentUser()?.name }}</strong></span>
              <span class="role-badge" [class.admin]="authService.isAdmin()">{{ authService.currentUser()?.role?.toUpperCase() }}</span>
            </div>
          } @else {
            <div class="mobile-auth-actions">
              <a routerLink="/login" [queryParams]="{ mode: 'signin' }" (click)="mobileMenuOpen.set(false)" class="btn btn-outline btn-sm">
                Sign In
              </a>
              <a routerLink="/login" [queryParams]="{ mode: 'signup' }" (click)="mobileMenuOpen.set(false)" class="btn btn-primary btn-sm">
                ✨ Create Account (Sign Up)
              </a>
            </div>
          }
          <a routerLink="/" (click)="mobileMenuOpen.set(false)">Home</a>
          <a routerLink="/shop" (click)="mobileMenuOpen.set(false)">Explore All Products</a>
          @if (authService.isAdmin()) {
            <a routerLink="/admin" (click)="mobileMenuOpen.set(false)" class="admin-highlight">🛡️ Admin Operations Portal</a>
          }
          <a routerLink="/orders" (click)="mobileMenuOpen.set(false)">My Purchases & Orders</a>
          <a routerLink="/wishlist" (click)="mobileMenuOpen.set(false)">Saved Wishlist ({{ wishlistService.count() }})</a>
          @if (authService.isLoggedIn()) {
            <button class="btn btn-outline btn-sm" (click)="mobileMenuOpen.set(false); authService.logout()">
              Sign Out
            </button>
          }
        </div>
      }

      <!-- Edit Username Modal -->
      @if (isEditingUsername()) {
        <div class="username-modal-backdrop" (click)="closeUsernameModal()">
          <div class="username-modal glass-card animate-fade-in" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Change Your Username</h3>
              <button type="button" class="modal-close-btn" (click)="closeUsernameModal()">×</button>
            </div>
            <p class="modal-sub">Choose a unique handle between 3 and 30 characters (letters, numbers, underscores).</p>
            
            <div class="modal-input-wrapper">
              <span class="prefix-symbol">&#64;</span>
              <input 
                type="text" 
                [(ngModel)]="newUsernameInput" 
                placeholder="new_username" 
                class="input-control modal-input" 
                maxlength="30"
                autofocus 
              />
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary btn-sm" (click)="closeUsernameModal()">Cancel</button>
              <button 
                type="button" 
                class="btn btn-primary btn-sm" 
                (click)="saveUsername()" 
                [disabled]="isSavingUsername() || !newUsernameInput.trim()"
              >
                {{ isSavingUsername() ? 'Updating...' : 'Save Username' }}
              </button>
            </div>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    /* Announcement Bar */
    .announcement-bar {
      background: linear-gradient(90deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
      color: #e0e7ff;
      font-size: 0.78rem;
      padding: 0.45rem 0;
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    }
    .announcement-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .announcement-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      background: var(--accent-emerald);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--accent-emerald);
      display: inline-block;
      animation: pulseGlow 1.5s infinite;
    }
    .promo-pill {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .announcement-links {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .announcement-link {
      transition: color 0.15s;
    }
    .announcement-link:hover {
      color: #ffffff;
      text-decoration: underline;
    }
    .admin-highlight {
      color: #f43f5e !important;
      font-weight: 700;
    }
    .divider {
      color: rgba(255, 255, 255, 0.2);
    }
    .support-text {
      color: #a5b4fc;
    }

    /* Main Header */
    .main-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--bg-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-subtle);
      transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .header-scrolled {
      box-shadow: var(--shadow-md);
      border-bottom-color: var(--border-strong);
    }
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      gap: 1.25rem;
    }

    /* Brand Logo */
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }
    .logo-mark {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--primary) 0%, #4338ca 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px var(--primary-glow);
    }
    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    .logo-title {
      font-weight: 800;
      font-size: 1.25rem;
      letter-spacing: 0.05em;
      color: var(--text-primary);
    }
    .logo-subtitle {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.35em;
      color: var(--primary-light);
    }

    /* Navigation Links */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .nav-links a {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: color 0.15s ease;
      position: relative;
      padding: 0.25rem 0;
      white-space: nowrap;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--text-primary);
    }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--primary);
      border-radius: 2px;
    }
    .admin-nav-item {
      color: #fb7185 !important;
      font-weight: 700 !important;
    }

    /* Search Bar */
    .search-wrapper {
      position: relative;
      flex: 1;
      max-width: 280px;
    }
    .search-box {
      display: flex;
      align-items: center;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      padding: 0.45rem 0.85rem;
      transition: all 0.2s ease;
    }
    .search-box:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-glow);
    }
    .search-icon {
      color: var(--text-muted);
      margin-right: 0.5rem;
      flex-shrink: 0;
    }
    .search-box input {
      background: transparent;
      border: none;
      color: var(--text-primary);
      width: 100%;
      font-size: 0.875rem;
    }
    .clear-search {
      color: var(--text-muted);
      display: flex;
      align-items: center;
      padding: 2px;
    }

    /* Search Dropdown */
    .search-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      width: 360px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: 0.75rem;
      z-index: 1001;
    }
    .search-dropdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      padding: 0.25rem 0.5rem 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .close-dropdown {
      color: var(--text-muted);
      cursor: pointer;
    }
    .search-results-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-top: 0.5rem;
      max-height: 280px;
      overflow-y: auto;
    }
    .search-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      transition: background 0.15s ease;
    }
    .search-item:hover {
      background: var(--bg-surface-hover);
    }
    .search-item-thumb {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      object-fit: cover;
    }
    .search-item-details {
      flex: 1;
      min-width: 0;
    }
    .search-item-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .search-item-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .search-item-price {
      font-weight: 700;
      color: var(--primary-light);
    }
    .search-dropdown-footer {
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-subtle);
    }
    .view-all-btn {
      width: 100%;
    }
    .search-empty {
      padding: 1.5rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .action-btn {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface-elevated);
      color: var(--text-primary);
      border: 1px solid var(--border-subtle);
      transition: all var(--transition-fast);
    }
    .action-btn:hover {
      background: var(--bg-surface-hover);
      border-color: var(--border-strong);
      color: var(--primary-light);
    }
    .badge-count {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      border-radius: var(--radius-full);
      background: var(--accent-rose);
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--bg-surface);
    }
    .cart-badge-count {
      background: var(--primary);
    }

    /* User Authentication Controls */
    .user-menu-wrapper {
      position: relative;
    }
    .user-pill-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.6rem 0.25rem 0.35rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      transition: all 0.2s;
    }
    .user-pill-btn:hover {
      border-color: var(--primary);
      background: var(--bg-surface-hover);
    }
    .user-avatar-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      font-weight: 800;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-role-tag {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }
    .user-role-tag.admin-role {
      color: #fb7185;
    }

    .user-dropdown-panel {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 240px;
      padding: 1rem;
      z-index: 1002;
    }
    .user-dropdown-info {
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .user-handle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 2px 0;
    }
    .user-handle-text {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--primary-light);
    }
    .edit-handle-btn {
      background: none;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-size: 0.7rem;
      font-weight: 600;
      padding: 1px 5px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .edit-handle-btn:hover {
      color: var(--primary-light);
      border-color: var(--primary);
    }
    .user-phone-text {
      font-size: 0.725rem;
      color: var(--text-muted);
    }
    .user-name-text {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .user-id-text {
      font-size: 0.75rem;
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .role-badge {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 800;
      background: rgba(99, 102, 241, 0.15);
      color: var(--primary-light);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      align-self: flex-start;
      margin-top: 0.25rem;
    }
    .role-badge.admin {
      background: rgba(244, 63, 94, 0.15);
      color: #fb7185;
    }

    .dropdown-links {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .drop-link {
      padding: 0.45rem 0.5rem;
      font-size: 0.825rem;
      color: var(--text-secondary);
      border-radius: var(--radius-sm);
      transition: background 0.15s, color 0.15s;
      text-align: left;
    }
    .drop-link:hover {
      background: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .drop-link.admin-link {
      color: #fb7185;
      font-weight: 700;
    }
    .drop-link.logout-btn {
      color: var(--accent-rose);
      margin-top: 0.35rem;
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.6rem;
    }

    /* Username modal */
    .username-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .username-modal {
      max-width: 420px;
      width: 100%;
      padding: 1.75rem;
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      box-shadow: var(--shadow-lg);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }
    .modal-header h3 {
      font-size: 1.15rem;
      font-weight: 700;
    }
    .modal-close-btn {
      background: none;
      border: none;
      font-size: 1.35rem;
      color: var(--text-muted);
      cursor: pointer;
      line-height: 1;
    }
    .modal-sub {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 1.25rem;
    }
    .modal-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .prefix-symbol {
      position: absolute;
      left: 1rem;
      color: var(--text-muted);
      font-weight: 700;
    }
    .modal-input {
      padding-left: 2.25rem;
      width: 100%;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .header-auth-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .signin-nav-link {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      padding: 0.45rem 0.65rem;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .signin-nav-link:hover {
      color: var(--primary-light);
      background: var(--bg-surface-hover);
    }
    .signup-nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.95rem;
      font-weight: 700;
      box-shadow: 0 2px 10px var(--primary-glow);
      transition: all 0.2s ease;
    }
    .signup-nav-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px var(--primary-glow);
    }
    .mobile-auth-actions {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding: 0.5rem 0 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .mobile-menu-btn {
      display: none;
    }

    /* Mobile panel */
    .mobile-nav-panel {
      display: flex;
      flex-direction: column;
      padding: 1rem 1.5rem;
      gap: 0.75rem;
      border-top: 1px solid var(--border-subtle);
    }
    .mobile-nav-panel a {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .mobile-user-card {
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .nav-links {
        display: none;
      }
      .mobile-menu-btn {
        display: flex;
      }
      .announcement-links {
        display: none;
      }
      .search-wrapper {
        max-width: 220px;
      }
    }

    @media (max-width: 640px) {
      .announcement-bar {
        display: none;
      }
      .search-wrapper {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  productService = inject(ProductService);
  authService = inject(AuthService);
  router = inject(Router);

  isScrolled = signal<boolean>(false);
  isDarkMode = signal<boolean>(true);
  showSearchDropdown = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);
  userDropdownOpen = signal<boolean>(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  onSearchChange(value: string) {
    this.productService.searchQuery.set(value);
    if (value.trim().length >= 2) {
      this.showSearchDropdown.set(true);
    }
  }

  executeSearch() {
    this.showSearchDropdown.set(false);
    this.router.navigate(['/shop'], {
      queryParams: { search: this.productService.searchQuery() }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  toggleUserDropdown() {
    this.userDropdownOpen.update(v => !v);
  }

  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
    if (typeof document !== 'undefined') {
      const body = document.body;
      if (this.isDarkMode()) {
        body.classList.remove('theme-light');
        body.classList.add('theme-dark');
      } else {
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
      }
    }
  }

  // Username Editing
  isEditingUsername = signal<boolean>(false);
  isSavingUsername = signal<boolean>(false);
  newUsernameInput = '';

  openUsernameModal(e: Event) {
    e.stopPropagation();
    this.newUsernameInput = this.authService.currentUser()?.username || '';
    this.isEditingUsername.set(true);
    this.userDropdownOpen.set(false);
  }

  closeUsernameModal() {
    this.isEditingUsername.set(false);
  }

  saveUsername() {
    const clean = this.newUsernameInput.trim().toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
    if (!clean) return;
    this.isSavingUsername.set(true);

    this.authService.updateUsername(clean).subscribe({
      next: () => {
        this.isSavingUsername.set(false);
        this.isEditingUsername.set(false);
      },
      error: () => {
        this.isSavingUsername.set(false);
      }
    });
  }
}

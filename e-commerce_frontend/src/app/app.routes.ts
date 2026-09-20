import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Lumina Luxe — Next-Gen Tech & Audio Gear'
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent),
    title: 'Product Catalog | Lumina Luxe'
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Product Details | Lumina Luxe'
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart-page/cart-page.component').then(m => m.CartPageComponent),
    title: 'Shopping Bag | Lumina Luxe'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Secure Checkout | Lumina Luxe'
  },
  {
    path: 'order-success/:id',
    loadComponent: () => import('./pages/order-success/order-success.component').then(m => m.OrderSuccessComponent),
    title: 'Order Confirmed | Lumina Luxe'
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
    title: 'Saved Wishlist | Lumina Luxe'
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
    title: 'My Purchases & Orders | Lumina Luxe'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Sign In with OTP | Lumina Luxe'
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Create Account (Sign Up) | Lumina Luxe'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard],
    title: 'Admin Operations Portal | Lumina Luxe'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

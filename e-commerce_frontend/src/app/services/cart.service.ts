import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartItem, Product } from '../models/product.model';
import { PROMO_CODES } from '../data/mock-products';
import { ToastService } from './toast.service';

const CART_STORAGE_KEY = 'lumina_ecommerce_cart';
const PROMO_STORAGE_KEY = 'lumina_ecommerce_promo';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private toastService = inject(ToastService);

  private _items = signal<CartItem[]>(this.loadCartFromStorage());
  readonly items = this._items.asReadonly();

  readonly isDrawerOpen = signal<boolean>(false);
  readonly appliedPromo = signal<{ code: string; discountPercent: number } | null>(this.loadPromoFromStorage());

  readonly freeShippingThreshold = 0;
  readonly standardShippingFee = 0; // FREE for 1 Rupee testing
  readonly taxRate = 0.00; // 0% for testing

  // Computations
  readonly totalItemCount = computed(() => {
    return this._items().reduce((acc, item) => acc + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this._items().reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  });

  readonly freeShippingProgress = computed(() => {
    const sub = this.subtotal();
    if (sub >= this.freeShippingThreshold) return 100;
    return Math.min(100, Math.round((sub / this.freeShippingThreshold) * 100));
  });

  readonly remainingForFreeShipping = computed(() => {
    const remaining = this.freeShippingThreshold - this.subtotal();
    return remaining > 0 ? Number(remaining.toFixed(2)) : 0;
  });

  readonly discountAmount = computed(() => {
    const promo = this.appliedPromo();
    if (!promo || promo.discountPercent <= 0) return 0;
    return Number(((this.subtotal() * promo.discountPercent) / 100).toFixed(2));
  });

  readonly shippingFee = computed(() => {
    const promo = this.appliedPromo();
    if (promo?.code === 'FREESHIP') return 0;
    if (this._items().length === 0) return 0;
    return this.subtotal() >= this.freeShippingThreshold ? 0 : this.standardShippingFee;
  });

  readonly taxAmount = computed(() => {
    const taxableSubtotal = Math.max(0, this.subtotal() - this.discountAmount());
    return Number((taxableSubtotal * this.taxRate).toFixed(2));
  });

  readonly totalPrice = computed(() => {
    if (this._items().length === 0) return 0;
    const finalTotal = this.subtotal() - this.discountAmount() + this.shippingFee() + this.taxAmount();
    return Number(Math.max(0, finalTotal).toFixed(2));
  });

  constructor() {
    // Persist cart to localStorage on changes
    effect(() => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this._items()));
        }
      } catch (e) {
        console.error('Failed saving cart to storage', e);
      }
    });

    // Persist promo
    effect(() => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const promo = this.appliedPromo();
          if (promo) {
            localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promo));
          } else {
            localStorage.removeItem(PROMO_STORAGE_KEY);
          }
        }
      } catch (e) {
        console.error('Failed saving promo to storage', e);
      }
    });
  }

  addToCart(product: Product, quantity: number = 1, selectedColor?: string): void {
    const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);

    this._items.update(current => {
      const existingIndex = current.findIndex(
        i => i.product.id === product.id && i.selectedColor === color
      );

      if (existingIndex > -1) {
        const copy = [...current];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: copy[existingIndex].quantity + quantity
        };
        return copy;
      } else {
        return [...current, { product, quantity, selectedColor: color }];
      }
    });

    this.toastService.success(`Added "${product.name}" to cart!`, 'Cart Updated');
    this.openDrawer();
  }

  updateQuantity(productId: string, quantity: number, selectedColor?: string): void {
    if (quantity <= 0) {
      this.removeFromCart(productId, selectedColor);
      return;
    }

    this._items.update(current => {
      return current.map(item => {
        if (item.product.id === productId && (selectedColor === undefined || item.selectedColor === selectedColor)) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  }

  removeFromCart(productId: string, selectedColor?: string): void {
    const itemToRemove = this._items().find(
      i => i.product.id === productId && (selectedColor === undefined || i.selectedColor === selectedColor)
    );

    this._items.update(current => {
      return current.filter(
        i => !(i.product.id === productId && (selectedColor === undefined || i.selectedColor === selectedColor))
      );
    });

    if (itemToRemove) {
      this.toastService.info(`Removed "${itemToRemove.product.name}" from cart`);
    }
  }

  clearCart(): void {
    this._items.set([]);
    this.appliedPromo.set(null);
  }

  applyPromoCode(code: string): boolean {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      this.toastService.warning('Please enter a coupon code', 'Promo Code');
      return false;
    }

    if (cleanCode in PROMO_CODES) {
      const discountPercent = PROMO_CODES[cleanCode];
      this.appliedPromo.set({ code: cleanCode, discountPercent });
      
      if (cleanCode === 'FREESHIP') {
        this.toastService.success('Free shipping unlocked with code FREESHIP!', 'Discount Applied');
      } else {
        this.toastService.success(`${discountPercent}% discount applied with code ${cleanCode}!`, 'Discount Applied');
      }
      return true;
    } else {
      this.toastService.error(`"${cleanCode}" is not a valid coupon code. Try SAVE20 or WELCOME10`, 'Invalid Code');
      return false;
    }
  }

  removePromoCode(): void {
    this.appliedPromo.set(null);
    this.toastService.info('Coupon code removed');
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  toggleDrawer(): void {
    this.isDrawerOpen.update(open => !open);
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(CART_STORAGE_KEY);
        if (data) return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading cart from localStorage', e);
    }
    // Default starter items for initial presentation
    return [
      {
        product: {
          id: 'prod-1',
          name: 'AuraPulse Pro Noise-Cancelling Headphones',
          slug: 'aurapulse-pro-headphones',
          brand: 'AuraSound',
          category: 'Audio',
          price: 299.99,
          rating: 4.9,
          reviewCount: 428,
          inStock: true,
          stockQuantity: 18,
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Experience pure sonic brilliance.',
          features: [],
          specs: {},
          tags: ['audio']
        },
        quantity: 1,
        selectedColor: 'Matte Obsidian'
      }
    ];
  }

  private loadPromoFromStorage(): { code: string; discountPercent: number } | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(PROMO_STORAGE_KEY);
        if (data) return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading promo from localStorage', e);
    }
    return null;
  }
}

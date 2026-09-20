import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { Order, CartItem, ShippingAddress } from '../models/product.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.orderApiUrl;

  private _orders = signal<Order[]>([]);
  readonly orders = this._orders.asReadonly();

  constructor() {
    this.loadOrders();
  }

  loadOrders(userId?: string): void {
    const url = userId ? `${this.apiUrl}?userId=${userId}` : this.apiUrl;
    this.http.get<Order[]>(url).pipe(
      tap(orders => {
        if (orders) {
          this._orders.set(orders);
        }
      }),
      catchError(err => {
        console.warn('Failed loading orders from backend, using memory cache', err);
        return of([]);
      })
    ).subscribe();
  }

  createOrder(data: {
    userId?: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    shippingMethod: string;
    tax: number;
    total: number;
    shippingAddress: ShippingAddress;
    paymentMethod: 'card' | 'upi' | 'cod' | 'razorpay';
    transactionRef?: string;
  }): Order {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${randomNum}`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (data.shippingMethod.includes('Express') ? 2 : 4));

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...data.items],
      subtotal: data.subtotal,
      discount: data.discount,
      shipping: data.shipping,
      shippingMethod: data.shippingMethod,
      tax: data.tax,
      total: data.total,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      transactionRef: data.transactionRef,
      status: 'Processing',
      estimatedDelivery: deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      trackingNumber: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };

    // Optimistically update local signal
    this._orders.update(current => [newOrder, ...current]);

    // Persist to backend SQLite
    this.http.post<Order>(this.apiUrl, {
      ...data,
      id: orderId,
      userId: data.userId || 'guest'
    }).subscribe({
      next: saved => {
        this._orders.update(curr => curr.map(o => o.id === orderId ? saved : o));
      },
      error: err => console.error('Failed saving order to backend', err)
    });

    return newOrder;
  }

  updateOrderStatus(id: string, status: string) {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      tap(updated => {
        this._orders.update(curr => curr.map(o => o.id === id ? updated : o));
      })
    );
  }

  getOrderById(id: string): Order | undefined {
    return this._orders().find(o => o.id === id);
  }
}

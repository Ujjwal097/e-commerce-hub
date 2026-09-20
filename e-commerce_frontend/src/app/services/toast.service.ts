import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', title?: string, duration: number = 3500): void {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const toast: ToastMessage = { id, message, type, title, duration };
    
    this._toasts.update(current => [...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, title: string = 'Success!'): void {
    this.show(message, 'success', title);
  }

  info(message: string, title: string = 'Note'): void {
    this.show(message, 'info', title);
  }

  warning(message: string, title: string = 'Attention'): void {
    this.show(message, 'warning', title);
  }

  error(message: string, title: string = 'Error'): void {
    this.show(message, 'error', title, 4500);
  }

  remove(id: string): void {
    this._toasts.update(current => current.filter(t => t.id !== id));
  }
}

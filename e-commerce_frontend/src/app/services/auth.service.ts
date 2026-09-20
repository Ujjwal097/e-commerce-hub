import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { User, SendOtpResponse, VerifyOtpResponse, SignupRequest, VerifySignupRequest, UpdateUsernameRequest } from '../models/auth.model';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';

const AUTH_USER_KEY = 'lumina_auth_user';
const AUTH_TOKEN_KEY = 'lumina_auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);

  private apiUrl = environment.authApiUrl;

  private _currentUser = signal<User | null>(this.loadUserFromStorage());
  readonly currentUser = this._currentUser.asReadonly();

  readonly isLoggedIn = computed(() => !!this._currentUser());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  readonly userIdentifier = computed(() => this._currentUser()?.identifier || '');
  readonly username = computed(() => this._currentUser()?.username || 'user');

  /**
   * 1. Initiate User Sign Up
   */
  initiateSignup(request: SignupRequest): Observable<SendOtpResponse> {
    return this.http.post<SendOtpResponse>(`${this.apiUrl}/signup/initiate`, request).pipe(
      tap(res => {
        this.toastService.info(
          'Security verification code generated & dispatched. Valid for 2 minutes.',
          '🔑 Verification Code Sent'
        );
      }),
      catchError(err => {
        const msg = err.error?.message || err.error?.error || 'Registration failed. Please check details and try again.';
        this.toastService.error(msg, 'Sign Up Error');
        return throwError(() => err);
      })
    );
  }

  /**
   * 2. Verify Sign Up & Create Account
   */
  verifySignup(request: VerifySignupRequest): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(`${this.apiUrl}/signup/verify`, request).pipe(
      tap(res => {
        if (res.success && res.user) {
          this.setUserSession(res.user, res.token);
          this.toastService.success(
            `Welcome to Lumina Luxe, ${res.user.name}! Your account has been verified.`,
            'Account Created'
          );
        }
      }),
      catchError(err => {
        const msg = err.error?.message || err.error?.error || 'Invalid or expired verification code.';
        this.toastService.error(msg, 'Verification Failed');
        return throwError(() => err);
      })
    );
  }

  /**
   * 3. Send Login OTP
   */
  sendOtp(
    identifier: string, 
    type: 'email' | 'phone', 
    role: 'customer' | 'admin' = 'customer',
    name?: string,
    mode: 'signin' | 'signup' = 'signin'
  ): Observable<SendOtpResponse> {
    const cleanId = identifier.trim().toLowerCase();
    const payload = { identifier: cleanId, type, role, name: name?.trim(), mode };

    return this.http.post<SendOtpResponse>(`${this.apiUrl}/send-otp`, payload).pipe(
      tap(res => {
        this.toastService.info(
          'Security verification code generated & dispatched. Valid for 2 minutes.',
          '🔑 Verification Code Sent'
        );
      }),
      catchError(err => {
        const msg = err.error?.message || err.error?.error || 'Failed to send OTP code. Please try again.';
        this.toastService.error(msg, 'Sign In Error');
        return throwError(() => err);
      })
    );
  }

  /**
   * 4. Verify Login OTP
   */
  verifyOtp(
    identifier: string, 
    code: string, 
    role: 'customer' | 'admin' = 'customer',
    name?: string
  ): Observable<VerifyOtpResponse> {
    const cleanId = identifier.trim().toLowerCase();
    const cleanCode = code.trim();
    const cleanName = name?.trim();
    const payload = { identifier: cleanId, code: cleanCode, role, name: cleanName };

    return this.http.post<VerifyOtpResponse>(`${this.apiUrl}/verify-otp`, payload).pipe(
      tap(res => {
        if (res.success && res.user) {
          this.setUserSession(res.user, res.token);
          this.toastService.success(
            `Welcome back, ${res.user.name}! Logged in as ${res.user.role.toUpperCase()}`,
            'Authentication Successful'
          );
        }
      }),
      catchError(err => {
        const msg = err.error?.message || err.error?.error || 'Invalid or expired OTP code. Please try again.';
        this.toastService.error(msg, 'Verification Failed');
        return throwError(() => err);
      })
    );
  }

  /**
   * 5. Update Username
   */
  updateUsername(newUsername: string): Observable<VerifyOtpResponse> {
    const user = this._currentUser();
    if (!user) {
      return throwError(() => new Error('User not logged in'));
    }

    const payload: UpdateUsernameRequest = {
      identifier: user.email || user.identifier,
      newUsername: newUsername.trim()
    };

    return this.http.put<VerifyOtpResponse>(`${this.apiUrl}/username`, payload).pipe(
      tap(res => {
        if (res.success && res.user) {
          const current = this._currentUser();
          const updatedUser: User = {
            ...current!,
            ...res.user
          };
          this.setUserSession(updatedUser, localStorage.getItem(AUTH_TOKEN_KEY) || '');
          this.toastService.success(
            `Username updated to @${res.user.username}`,
            'Profile Updated'
          );
        }
      }),
      catchError(err => {
        const msg = err.error?.message || err.error?.error || 'Failed to update username.';
        this.toastService.error(msg, 'Update Error');
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this._currentUser.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    this.toastService.info('You have been logged out safely.', 'Signed Out');
    this.router.navigate(['/']);
  }

  private setUserSession(user: User, token: string): void {
    this._currentUser.set(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
    }
  }

  private loadUserFromStorage(): User | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(AUTH_USER_KEY);
        if (data) return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading user from storage', e);
    }
    return null;
  }
}

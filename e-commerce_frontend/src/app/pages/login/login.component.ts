import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { SignupRequest, VerifySignupRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="container">
        
        <div class="auth-card glass-card animate-fade-in">
          
          <!-- Logo & Header -->
          <div class="auth-header">
            <div class="brand-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h2>
              {{ isStepOtp() 
                ? 'Security Verification' 
                : (authMode() === 'signup' ? 'Create Your Account' : 'Sign In to Lumina Luxe') }}
            </h2>
            <p class="auth-subtitle">
              {{ isStepOtp() 
                ? 'Enter the 6-digit OTP code to complete ' + (authMode() === 'signup' ? 'registration' : 'sign in')
                : (authMode() === 'signup' 
                    ? 'Join Lumina Luxe for VIP access, tracked orders & seamless checkout' 
                    : 'Access your luxury catalog, past purchases, or administration portal') }}
            </p>
          </div>

          <!-- Mode Switcher Tabs (Sign In vs Sign Up) -->
          @if (!isStepOtp()) {
            <div class="mode-tabs">
              <button 
                type="button" 
                class="mode-tab" 
                [class.active]="authMode() === 'signin'" 
                (click)="setMode('signin')"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>Sign In</span>
              </button>
              <button 
                type="button" 
                class="mode-tab" 
                [class.active]="authMode() === 'signup'" 
                (click)="setMode('signup')"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                <span>Create Account</span>
              </button>
            </div>
          }

          <!-- Super Admin Quick Access Notice (Sign In Only) -->
          @if (!isStepOtp() && authMode() === 'signin') {
            <div class="super-admin-banner glass-card">
              <div class="banner-top">
                <span class="badge-pill">🛡️ Super Admin</span>
                <span class="banner-note">Login Only • Cannot Sign Up</span>
              </div>
              <div class="admin-creds-row">
                <button type="button" class="admin-quick-btn" (click)="fillSuperAdmin('email')">
                  ✉️ panditujjwaltiwari&#64;gmail.com
                </button>
                <button type="button" class="admin-quick-btn" (click)="fillSuperAdmin('phone')">
                  📱 9889933097
                </button>
              </div>
            </div>
          }

          <!-- Alert / Error Message -->
          @if (errorMessage()) {
            <div class="alert-banner animate-fade-in">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ errorMessage() }}</span>
              <button type="button" class="close-alert" (click)="errorMessage.set(null)">×</button>
            </div>
          }

          <!-- STEP 1A: SIGN IN FORM -->
          @if (!isStepOtp() && authMode() === 'signin') {
            <form (submit)="requestLoginOtp($event)" class="auth-form">
              <div class="form-group">
                <label for="signin-identifier">
                  Email Address or Mobile Number <span class="required-star">*</span>
                </label>
                <div class="input-with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input 
                    id="signin-identifier"
                    type="text" 
                    [(ngModel)]="identifier" 
                    name="identifier" 
                    placeholder="e.g. panditujjwaltiwari@gmail.com or 9889933097" 
                    class="input-control" 
                    required 
                    autofocus
                  />
                </div>
                <span class="field-hint">Enter your registered email or 10-digit mobile number</span>
              </div>

              <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="isLoading() || !identifier.trim()">
                @if (isLoading()) {
                  <span>Checking Credentials & Sending OTP...</span>
                } @else {
                  <span>Send 6-Digit OTP</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                }
              </button>

              <div class="mode-switch-footer">
                <span>New to Lumina Luxe? </span>
                <button type="button" class="switch-link-btn" (click)="setMode('signup')">
                  Create a new account (Sign Up) →
                </button>
              </div>
            </form>
          }

          <!-- STEP 1B: SIGN UP FORM -->
          @if (!isStepOtp() && authMode() === 'signup') {
            <form (submit)="requestSignupOtp($event)" class="auth-form">
              
              <!-- Full Name -->
              <div class="form-group">
                <label for="signup-name">Full Name <span class="required-star">*</span></label>
                <div class="input-with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input 
                    id="signup-name"
                    type="text" 
                    [(ngModel)]="fullName" 
                    name="fullName" 
                    placeholder="e.g. Alex Morgan or Ujjwal Tiwari" 
                    class="input-control" 
                    required 
                    autofocus
                  />
                </div>
              </div>

              <!-- Email Address -->
              <div class="form-group">
                <label for="signup-email">Email Address <span class="required-star">*</span></label>
                <div class="input-with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
                  </svg>
                  <input 
                    id="signup-email"
                    type="email" 
                    [(ngModel)]="email" 
                    (ngModelChange)="onEmailChanged($event)"
                    name="email" 
                    placeholder="e.g. yourname@gmail.com" 
                    class="input-control" 
                    required 
                  />
                </div>
              </div>

              <!-- Mobile Phone Number -->
              <div class="form-group">
                <label for="signup-phone">Mobile Phone Number <span class="required-star">*</span></label>
                <div class="input-with-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                  <input 
                    id="signup-phone"
                    type="tel" 
                    [(ngModel)]="phoneNumber" 
                    name="phoneNumber" 
                    placeholder="e.g. 9876543210" 
                    class="input-control" 
                    required 
                  />
                </div>
              </div>

              <!-- Username (Default from email, editable) -->
              <div class="form-group">
                <div class="label-with-tag">
                  <label for="signup-username">Username</label>
                  <span class="optional-tag">Editable anytime</span>
                </div>
                <div class="input-with-prefix">
                  <span class="input-prefix">&#64;</span>
                  <input 
                    id="signup-username"
                    type="text" 
                    [(ngModel)]="username" 
                    name="username" 
                    placeholder="username" 
                    class="input-control with-prefix" 
                  />
                </div>
                <span class="field-hint">Initial default derived from email. You can change this now or in your profile.</span>
              </div>

              <!-- OTP Channel Selection -->
              <div class="form-group">
                <label>Send 2-Minute Security OTP to:</label>
                <div class="channel-selector">
                  <label class="channel-option" [class.selected]="otpChannel === 'email'">
                    <input type="radio" [(ngModel)]="otpChannel" name="otpChannel" value="email" />
                    <span>✉️ My Email</span>
                  </label>
                  <label class="channel-option" [class.selected]="otpChannel === 'phone'">
                    <input type="radio" [(ngModel)]="otpChannel" name="otpChannel" value="phone" />
                    <span>📱 My Mobile Phone</span>
                  </label>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="isLoading() || !fullName.trim() || !email.trim() || !phoneNumber.trim()">
                @if (isLoading()) {
                  <span>Validating & Sending Verification Code...</span>
                } @else {
                  <span>Create Account & Send OTP</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                }
              </button>

              <div class="mode-switch-footer">
                <span>Already have an account? </span>
                <button type="button" class="switch-link-btn" (click)="setMode('signin')">
                  Sign In to existing account →
                </button>
              </div>
            </form>
          }

          <!-- STEP 2: VERIFY OTP -->
          @if (isStepOtp()) {
            <div class="otp-verification-flow">
              
              <div class="destination-card glass-card">
                <div class="dest-info">
                  <span class="dest-label">Code Sent To</span>
                  <strong class="dest-target">{{ targetDestination() }}</strong>
                </div>
                <button type="button" class="edit-id-btn" (click)="isStepOtp.set(false); errorMessage.set(null)">
                  ✏️ Edit
                </button>
              </div>

              <div class="security-info-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <p>
                  <strong>Realistic Verification:</strong> For security, OTP is never shown on screen. 
                  In this development environment, please check your <strong>Spring Boot terminal console</strong> to view the dispatched code.
                </p>
              </div>

              <form (submit)="confirmOtp($event)" class="otp-form">
                <div class="form-group">
                  <label for="otp-input-field">Enter 6-Digit Code (Valid for 2 minutes)</label>
                  <input 
                    id="otp-input-field"
                    type="text" 
                    [(ngModel)]="otpCode" 
                    name="otpCode" 
                    placeholder="• • • • • •" 
                    maxlength="6" 
                    class="input-control otp-input" 
                    required 
                    autofocus 
                  />
                </div>

                <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="isLoading() || otpCode.length < 6">
                  @if (isLoading()) {
                    <span>Verifying Code...</span>
                  } @else {
                    <span>{{ authMode() === 'signup' ? 'Verify & Complete Sign Up' : 'Verify & Sign In' }}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  }
                </button>

                <!-- 2-Minute Timer & Resend Button -->
                <div class="timer-section">
                  @if (countdown() > 0) {
                    <div class="countdown-badge">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>OTP expires in <strong>{{ formattedCountdown() }}</strong></span>
                    </div>
                  } @else {
                    <div class="expired-badge">
                      <span class="expired-text">⚠️ Code expired.</span>
                      <button type="button" class="resend-btn" (click)="resendOtp()">
                        Click to Resend Fresh 2-Min OTP
                      </button>
                    </div>
                  }
                </div>
              </form>

            </div>
          }

          <div class="auth-footer">
            <p>🔒 256-Bit Encrypted Authentication • 2-Minute Expiry • Persistent Storage</p>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    .login-page {
      padding: 3.5rem 0 5rem;
      min-height: 82vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .auth-card {
      max-width: 500px;
      width: 100%;
      margin: 0 auto;
      padding: 2.5rem;
      border-radius: var(--radius-xl);
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      box-shadow: var(--shadow-lg);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .brand-badge {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--primary) 0%, #4338ca 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
      box-shadow: 0 4px 14px var(--primary-glow);
    }
    .auth-header h2 {
      font-size: 1.65rem;
      font-weight: 800;
      margin-bottom: 0.4rem;
    }
    .auth-subtitle {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    /* Mode tabs */
    .mode-tabs {
      display: flex;
      background: var(--bg-surface-elevated);
      padding: 0.35rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
      margin-bottom: 1.25rem;
      gap: 0.35rem;
    }
    .mode-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 0.6rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-secondary);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .mode-tab.active {
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 2px 10px var(--primary-glow);
    }
    .mode-tab:hover:not(.active) {
      color: var(--text-primary);
      background: var(--bg-surface-hover);
    }

    /* Super Admin banner */
    .super-admin-banner {
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .banner-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badge-pill {
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--primary-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .banner-note {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .admin-creds-row {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .admin-quick-btn {
      padding: 0.35rem 0.65rem;
      border-radius: var(--radius-sm);
      background: var(--bg-surface);
      color: var(--primary-light);
      border: 1px solid var(--border-subtle);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .admin-quick-btn:hover {
      border-color: var(--primary);
      background: var(--primary-glow);
    }

    /* Alert Banner */
    .alert-banner {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem 1rem;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      border-radius: var(--radius-md);
      color: #f87171;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }
    .alert-banner span {
      flex: 1;
    }
    .close-alert {
      background: none;
      border: none;
      color: #f87171;
      font-size: 1.25rem;
      cursor: pointer;
      line-height: 1;
    }

    /* Form */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }
    .form-group label {
      font-size: 0.825rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .label-with-tag {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .optional-tag {
      font-size: 0.725rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .required-star {
      color: var(--accent-rose);
      font-weight: 700;
    }
    .input-with-icon {
      position: relative;
    }
    .input-icon {
      position: absolute;
      top: 50%;
      left: 1rem;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }
    .input-with-icon .input-control {
      padding-left: 2.75rem;
    }
    .input-with-prefix {
      display: flex;
      align-items: center;
      position: relative;
    }
    .input-prefix {
      position: absolute;
      left: 1rem;
      color: var(--text-muted);
      font-weight: 700;
      font-size: 0.95rem;
    }
    .with-prefix {
      padding-left: 2.25rem;
    }
    .field-hint {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Channel Selector */
    .channel-selector {
      display: flex;
      gap: 0.75rem;
    }
    .channel-option {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 0.75rem;
      border-radius: var(--radius-md);
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .channel-option.selected {
      border-color: var(--primary);
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary-light);
    }

    .submit-btn {
      width: 100%;
      padding: 0.95rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    /* Mode switch footer */
    .mode-switch-footer {
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }
    .switch-link-btn {
      color: var(--primary-light);
      font-weight: 700;
      background: none;
      border: none;
      cursor: pointer;
      text-decoration: underline;
      padding: 0.2rem 0.4rem;
      transition: color 0.15s;
    }
    .switch-link-btn:hover {
      color: var(--primary);
    }

    /* OTP Flow */
    .otp-verification-flow {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .destination-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }
    .dest-info {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .dest-label {
      font-size: 0.725rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 700;
    }
    .dest-target {
      font-size: 0.95rem;
      color: var(--text-primary);
    }
    .edit-id-btn {
      background: none;
      border: none;
      color: var(--primary-light);
      font-weight: 700;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .security-info-box {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      padding: 0.75rem 1rem;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.8rem;
      line-height: 1.45;
    }
    .security-info-box svg {
      color: var(--primary-light);
      flex-shrink: 0;
      margin-top: 0.15rem;
    }
    .otp-input {
      text-align: center;
      font-size: 2rem;
      letter-spacing: 0.4em;
      font-family: monospace;
      font-weight: 800;
      padding: 0.85rem;
    }
    .timer-section {
      text-align: center;
      margin-top: 0.5rem;
    }
    .countdown-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-full);
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .countdown-badge strong {
      color: var(--primary-light);
    }
    .expired-badge {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      align-items: center;
    }
    .expired-text {
      color: #f87171;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .resend-btn {
      background: none;
      border: none;
      color: var(--primary-light);
      font-weight: 700;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: underline;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-subtle);
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  authMode = signal<'signin' | 'signup'>('signin');
  isStepOtp = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Sign In credentials
  identifier: string = '';

  // Sign Up credentials
  fullName: string = '';
  email: string = '';
  phoneNumber: string = '';
  username: string = '';
  otpChannel: 'email' | 'phone' = 'email';

  // OTP Verification
  otpCode: string = '';
  countdown = signal<number>(120); // 2 minutes (120s)
  private countdownTimer?: any;
  private returnUrl: string = '/';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'signup') {
        this.setMode('signup');
      } else {
        this.setMode('signin');
      }
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  ngOnDestroy() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  setMode(mode: 'signin' | 'signup') {
    this.authMode.set(mode);
    this.isStepOtp.set(false);
    this.errorMessage.set(null);
  }

  onEmailChanged(newEmail: string) {
    if (newEmail && !this.username) {
      const prefix = newEmail.split('@')[0].toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
      this.username = prefix;
    }
  }

  fillSuperAdmin(type: 'email' | 'phone') {
    this.setMode('signin');
    this.identifier = type === 'email' ? 'panditujjwaltiwari@gmail.com' : '9889933097';
    this.toastService.info('Super Admin credentials loaded. Click Send OTP to proceed.', 'Super Admin');
  }

  targetDestination(): string {
    if (this.authMode() === 'signup') {
      return this.otpChannel === 'phone' ? this.phoneNumber : this.email;
    }
    return this.identifier;
  }

  formattedCountdown(): string {
    const totalSecs = this.countdown();
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // 1. Request Login OTP
  requestLoginOtp(e?: Event) {
    if (e) e.preventDefault();
    this.errorMessage.set(null);

    const cleanId = this.identifier.trim();
    if (!cleanId) {
      this.errorMessage.set('Please enter your email address or mobile number.');
      return;
    }

    this.isLoading.set(true);
    const type = cleanId.includes('@') ? 'email' : 'phone';

    this.authService.sendOtp(cleanId, type, 'customer', undefined, 'signin').subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.isStepOtp.set(true);
        this.otpCode = res.otp || '';
        this.startCountdown(120);
        if (res.otp) {
          this.toastService.success(`Verification OTP: ${res.otp}`, '🔐 Code Generated');
        }
      },
      error: err => {
        this.isLoading.set(false);
        const msg = err.error?.message || err.error?.error || 'Account not found. Please sign up to register.';
        this.errorMessage.set(msg);
      }
    });
  }

  // 2. Request Sign Up OTP
  requestSignupOtp(e?: Event) {
    if (e) e.preventDefault();
    this.errorMessage.set(null);

    if (!this.fullName.trim()) {
      this.errorMessage.set('Full Name is required.');
      return;
    }
    if (!this.email.trim()) {
      this.errorMessage.set('Email address is required.');
      return;
    }
    if (!this.phoneNumber.trim()) {
      this.errorMessage.set('Mobile phone number is required.');
      return;
    }

    const cleanEmail = this.email.trim().toLowerCase();
    const cleanPhone = this.phoneNumber.trim().replace(/[^0-9+]/g, '');

    // Super Admin check
    if (cleanEmail === 'panditujjwaltiwari@gmail.com' || cleanPhone === '9889933097') {
      this.errorMessage.set('Super Admin account cannot be created via Sign Up. Please use Sign In.');
      return;
    }

    const payload: SignupRequest = {
      name: this.fullName.trim(),
      email: cleanEmail,
      phoneNumber: cleanPhone,
      username: this.username.trim() || undefined,
      otpChannel: this.otpChannel
    };

    this.isLoading.set(true);
    this.authService.initiateSignup(payload).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.isStepOtp.set(true);
        this.otpCode = res.otp || '';
        this.startCountdown(120);
        if (res.otp) {
          this.toastService.success(`Verification OTP: ${res.otp}`, '🔐 Code Generated');
        }
      },
      error: err => {
        this.isLoading.set(false);
        const msg = err.error?.message || err.error?.error || 'Registration failed. Please check your credentials.';
        this.errorMessage.set(msg);
      }
    });
  }

  // 3. Confirm OTP (Handles both Login & Signup)
  confirmOtp(e: Event) {
    e.preventDefault();
    this.errorMessage.set(null);

    const cleanCode = this.otpCode.trim();
    if (cleanCode.length < 6) {
      this.errorMessage.set('Please enter the full 6-digit verification code.');
      return;
    }

    this.isLoading.set(true);

    if (this.authMode() === 'signup') {
      const verifyReq: VerifySignupRequest = {
        name: this.fullName.trim(),
        email: this.email.trim().toLowerCase(),
        phoneNumber: this.phoneNumber.trim().replace(/[^0-9+]/g, ''),
        username: this.username.trim() || undefined,
        code: cleanCode,
        otpChannel: this.otpChannel
      };

      this.authService.verifySignup(verifyReq).subscribe({
        next: res => {
          this.isLoading.set(false);
          this.navigateAfterAuth(res.user.role);
        },
        error: err => {
          this.isLoading.set(false);
          const msg = err.error?.message || err.error?.error || 'Invalid or expired OTP code.';
          this.errorMessage.set(msg);
        }
      });
    } else {
      this.authService.verifyOtp(this.identifier.trim(), cleanCode).subscribe({
        next: res => {
          this.isLoading.set(false);
          this.navigateAfterAuth(res.user.role);
        },
        error: err => {
          this.isLoading.set(false);
          const msg = err.error?.message || err.error?.error || 'Invalid or expired OTP code.';
          this.errorMessage.set(msg);
        }
      });
    }
  }

  resendOtp() {
    if (this.authMode() === 'signup') {
      this.requestSignupOtp();
    } else {
      this.requestLoginOtp();
    }
  }

  private navigateAfterAuth(role: string) {
    if (role === 'admin') {
      this.router.navigateByUrl(this.returnUrl === '/' ? '/admin' : this.returnUrl);
    } else {
      this.router.navigateByUrl(this.returnUrl === '/admin' ? '/orders' : this.returnUrl);
    }
  }

  private startCountdown(seconds: number) {
    this.countdown.set(seconds);
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = setInterval(() => {
      if (this.countdown() > 0) {
        this.countdown.update(c => c - 1);
      } else {
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  }
}

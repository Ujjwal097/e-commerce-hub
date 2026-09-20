export interface User {
  id: string;
  identifier: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  username?: string;
  name: string;
  role: 'customer' | 'admin';
  type: 'email' | 'phone';
}

export interface SignupRequest {
  name: string;
  email: string;
  phoneNumber: string;
  username?: string;
  otpChannel?: 'email' | 'phone';
}

export interface VerifySignupRequest {
  name: string;
  email: string;
  phoneNumber: string;
  username?: string;
  code: string;
  otpChannel?: 'email' | 'phone';
}

export interface UpdateUsernameRequest {
  identifier: string;
  newUsername: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  identifier: string;
  otp?: string;
  expiresInSeconds?: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: import('./product.model').Order[];
}

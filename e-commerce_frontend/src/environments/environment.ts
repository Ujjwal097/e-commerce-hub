/**
 * Lumina Luxe Frontend Environment Configuration (Production)
 * Connected to Live Spring Boot Backend on Render
 */

const BASE_API_URL = 'https://e-commerce-hub-ncgm.onrender.com/api';

export const environment = {
  production: true,
  apiUrl: BASE_API_URL,
  productApiUrl: `${BASE_API_URL}/products`,
  authApiUrl: `${BASE_API_URL}/auth`,
  orderApiUrl: `${BASE_API_URL}/orders`,
  adminApiUrl: `${BASE_API_URL}/admin`,
  razorpayKeyId: 'rzp_test_TeMLUTVG6Qm9Tp'
};

/**
 * Lumina Luxe Frontend Environment Configuration
 * Unified Spring Boot Backend running on port 8080
 */

const BASE_API_URL = 'http://localhost:8080/api';

export const environment = {
  production: false,
  apiUrl: BASE_API_URL,
  productApiUrl: `${BASE_API_URL}/products`,
  authApiUrl: `${BASE_API_URL}/auth`,
  orderApiUrl: `${BASE_API_URL}/orders`,
  adminApiUrl: `${BASE_API_URL}/admin`,
  razorpayKeyId: 'rzp_test_TeMLUTVG6Qm9Tp' //  Razorpay Test Key ID or replace with your live Key ID
};

# Lumina Luxe E-Commerce Platform

A modern, production-ready full-stack e-commerce platform built with **Angular 19** and **Spring Boot 3.3 (Java 21)**.

The project is cleanly divided into two independent, decoupled applications:
- **`e-commerce_frontend/`**: Angular 19 Single Page Application (SPA) running on port `4200`.
- **`e-commerce_backend/`**: Unified Spring Boot REST API application running on port `8080` with a single persistent H2 database (`ecommercedb`).

> 📘 **For detailed architectural diagrams, communication flows, and design patterns, see [ARCHITECTURE.md](file:///c:/Users/UjjwalTiwari/project/ARCHITECTURE.md).**

---

## Folder Structure

```
project/
├── e-commerce_frontend/          # Standalone Angular 19 Client Application (Port 4200)
│   ├── src/                      # Components, Services, Models, Guards, Environments
│   │   ├── app/
│   │   │   ├── components/       # Header, Footer, Hero, ProductCard, CartDrawer, etc.
│   │   │   ├── pages/            # Home, Catalog, ProductDetail, Cart, Checkout, Admin, Auth
│   │   │   ├── services/         # ProductService, AuthService, OrderService, CartService
│   │   │   └── models/           # TypeScript models & API contracts
│   │   └── environments/         # API Endpoint Configuration (http://localhost:8080/api)
│   ├── public/                   # Static assets & icons
│   ├── angular.json              # Angular CLI workspace configuration
│   ├── package.json              # Frontend dependencies & npm scripts
│   ├── package-lock.json
│   ├── tsconfig.json             # TypeScript compiler configuration
│   └── ...
│
├── e-commerce_backend/           # Standalone Spring Boot Backend Application (Port 8080)
│   ├── src/                      # Unified Spring Boot Application
│   │   ├── main/java/com/lumina/ecommerce/
│   │   │   ├── config/           # CorsConfig, SecurityConfig, DataInitializer
│   │   │   ├── controller/       # ProductController, OrderController, AuthController, AdminController
│   │   │   ├── dto/              # AuthResponse, LoginRequest, OrderDto, ProductDto
│   │   │   ├── entity/           # ProductEntity, OrderEntity, UserEntity, OtpVerification
│   │   │   ├── repository/       # ProductRepository, OrderRepository, UserRepository, OtpRepository
│   │   │   ├── service/          # ProductService, OrderService, AuthService, EmailService
│   │   │   └── EcommerceApplication.java
│   │   └── main/resources/
│   │       ├── application.properties
│   │       └── schema.sql
│   ├── pom.xml                   # Spring Boot Maven POM (Java 21, Spring Boot 3.3.5)
│   ├── data/                     # Single Persistent H2 database directory
│   │   └── ecommercedb.mv.db     # Disk-persisted H2 database file
│   └── start-backend.ps1         # One-click startup script for backend
│
├── ARCHITECTURE.md               # Architectural documentation & communication guide
└── README.md                     # Project documentation
```

---

## 1. Running the Frontend (`e-commerce_frontend`)

The Angular frontend can be run independently using npm or Angular CLI:

```bash
cd e-commerce_frontend
npm install
npm start
```

Once running, navigate to **`http://localhost:4200/`** in your browser.

### Available Frontend Scripts
- `npm start` or `ng serve`: Starts the development server on `http://localhost:4200`
- `npm run build`: Compiles production build into `dist/ecommerce-app/browser/`
- `npm test`: Runs unit tests via Karma

---

## 2. Running the Backend (`e-commerce_backend`)

The backend is a single, unified Spring Boot service containing all business modules (Catalog, Auth, Orders, and Admin):

### Option A: Using Maven
```bash
cd e-commerce_backend
mvn spring-boot:run
```

### Option B: Using the PowerShell Script
```powershell
cd e-commerce_backend
.\start-backend.ps1
```

- **Application API Base URL**: `http://localhost:8080/api`
- **H2 Web Console**: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:file:./data/ecommercedb`
  - **User**: `sa`
  - **Password**: *(leave blank)*

---

## 3. API Endpoints Overview

All APIs are consolidated under the single backend service on port `8080`:

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Products** | `GET` | `/api/products` | Get all products (with category, search, price filters) |
| **Products** | `GET` | `/api/products/{id}` | Get product details by ID |
| **Products** | `GET` | `/api/products/count` | Total active product count |
| **Auth** | `POST` | `/api/auth/send-otp` | Generate and dispatch 6-digit OTP |
| **Auth** | `POST` | `/api/auth/verify-otp` | Validate OTP and issue session token |
| **Auth** | `GET` | `/api/auth/me` | Fetch currently authenticated user profile |
| **Orders** | `POST` | `/api/orders` | Place a new order with cart items and shipping info |
| **Orders** | `GET` | `/api/orders/{id}` | Get order details by tracking ID |
| **Orders** | `GET` | `/api/orders/user/{email}` | Retrieve order history for a customer |
| **Admin** | `GET` | `/api/admin/stats` | Retrieve store metrics (revenue, orders, product count) |

---

## 4. Frontend-to-Backend Configuration

Angular API URLs are configured in `e-commerce_frontend/src/environments/environment.ts`:

```typescript
const BASE_API_URL = 'http://localhost:8080/api';

export const environment = {
  production: false,
  apiUrl: BASE_API_URL,
  productApiUrl: `${BASE_API_URL}/products`,
  authApiUrl: `${BASE_API_URL}/auth`,
  orderApiUrl: `${BASE_API_URL}/orders`,
  adminApiUrl: `${BASE_API_URL}/admin`
};
```

- **ProductService**: Calls `environment.productApiUrl`
- **AuthService**: Calls `environment.authApiUrl`
- **OrderService**: Calls `environment.orderApiUrl`
- **AdminComponent**: Calls `${environment.adminApiUrl}/stats`

---

## 5. Database Persistence & Pre-seeded Data

The backend persists all state to a single H2 disk database at `e-commerce_backend/data/ecommercedb.mv.db`.

On application startup, `DataInitializer.java` automatically seeds:
- **Product Catalog**: Curated premium products with categories, variants, and stock counts.
- **Admin Account**: `admin@lumina.com` (Role: `ADMIN`)
- **Customer Account**: `customer@lumina.com` (Role: `CUSTOMER`)
- **Demo Orders**: Initial purchase orders for admin metrics and reporting.

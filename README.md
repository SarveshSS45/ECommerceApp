# ECommerceApp

A full-stack e-commerce platform inspired by Amazon — built to demonstrate production-grade architecture end to end, from a Clean Architecture ASP.NET Core backend to a modern React frontend.

![.NET 8](https://img.shields.io/badge/.NET-8-512BD4?logo=dotnet&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-EF_Core_8-CC2927?logo=microsoftsqlserver&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2451)

## Overview

ECommerceApp is a full-stack online store covering the whole customer and admin journey — product discovery, cart, checkout, and payments on one side; catalog, order, and analytics management on the other. It's built as a portfolio project, so the emphasis throughout is on architecture that holds up in a real codebase: the backend follows **Clean Architecture** with a strict one-way dependency rule (`Domain → Application → Infrastructure → API`), and every feature is implemented through the same `Controller → Service → Repository → Database` pipeline.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Author](#author)

## Features

### Storefront
- Product catalog with category browsing and search
- Product detail pages with a **multi-image gallery** and a selectable primary image
- Ratings & reviews
- Wishlist
- Cart and checkout
- Saved addresses (multiple shipping addresses per account)
- Coupon codes applied at checkout
- **Razorpay** payment integration
- Order history with per-order detail and status tracking
- JWT authentication (register/login) with silent access-token refresh

### Admin Panel
- Analytics dashboard — revenue chart, top products, low-stock alerts, recent orders, order-status summary (Chart.js)
- Product management, including image-gallery upload, delete, and primary-image selection
- Category management
- Order management with status updates
- Role-based access control — customer vs. Admin — enforced across both API and frontend routes

### Engineering Highlights
- Clean Architecture with entities that have zero framework dependencies
- Repository + Service pattern behind interfaces, wired up through dependency injection
- Global exception-handling middleware for consistent error responses
- Centralized Axios instance with request/response interceptors for auth-token attachment and silent refresh
- Swagger/OpenAPI docs with bearer-token auth pre-configured
- Consistent `ApiResponse<T>` response envelope across the API

## Tech Stack

**Frontend**

| | |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 4 |
| HTTP Client | Axios (with interceptors) |
| Charts | Chart.js / react-chartjs-2 |
| Notifications | react-hot-toast |
| Icons | react-icons |

**Backend**

| | |
|---|---|
| Framework | ASP.NET Core Web API (.NET 8) |
| Architecture | Clean Architecture — Domain / Application / Infrastructure / API |
| Data Access | Entity Framework Core 8 → SQL Server |
| Authentication | JWT Bearer (access + refresh tokens), BCrypt.Net-Next for password hashing |
| Payments | Razorpay .NET SDK |
| API Docs | Swashbuckle (Swagger / OpenAPI) |

## Architecture

```
ECommerce.Domain            Entities only — zero project references
        ↑
ECommerce.Application       DTOs, service interfaces, business logic — depends on Domain only
        ↑
ECommerce.Infrastructure    EF Core, repositories, Razorpay integration — depends on Application + Domain
        ↑
ECommerceApp (API)          Controllers, DI composition root, JWT/Swagger config — depends on Application + Infrastructure
```

Dependencies only ever point inward — `Domain` and `Application` have no idea that EF Core, HTTP, or ASP.NET Core exist. Every feature follows the same request path:

```
Controller → Service (interface) → Repository (interface) → AppDbContext → SQL Server
```

That discipline extends to file handling: `IFormFile` is only ever touched inside the API layer's controllers. Everything below the API — Application, Infrastructure, Domain — only ever sees a plain image-URL string, so the lower layers stay completely unaware that "file upload" is even a concept.

## Project Structure

```
ECommerceApp/
├── backend/
│   └── ECommerceApp/
│       ├── ECommerceApp.sln
│       ├── ECommerce.Domain/
│       │   └── Entities/              # Product, Category, Order, User, Address, Coupon, Review, Wishlist, ProductImage...
│       ├── ECommerce.Application/
│       │   ├── DTOs/
│       │   ├── Interfaces/
│       │   └── Services/
│       ├── ECommerce.Infrastructure/
│       │   ├── Data/                  # AppDbContext
│       │   ├── Repositories/
│       │   └── Services/              # PaymentService (Razorpay)
│       └── ECommerceApp/              # Web API host — composition root
│           ├── Controllers/
│           ├── Middleware/            # ExceptionMiddleware
│           ├── Program.cs
│           └── wwwroot/images/products/
└── frontend/
    └── src/
        ├── components/                # shared UI + admin/
        ├── context/                   # AuthContext, CartContext, WishlistContext
        ├── pages/                     # shared pages + admin/
        └── services/                  # one file per API resource
```

## Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- Node.js 20.19+ (or 22.12+) and npm
- SQL Server (LocalDB, Express, or a full instance)
- A [Razorpay](https://razorpay.com) account for test API keys
- EF Core CLI tools: `dotnet tool install --global dotnet-ef` (skip if already installed)

### Backend Setup

Create `backend/ECommerceApp/ECommerceApp/appsettings.Development.json` (git-ignored, so your secrets stay local):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ECommerceDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "a-long-random-secret-at-least-32-characters"
  },
  "Razorpay": {
    "Key": "your-razorpay-key-id",
    "Secret": "your-razorpay-key-secret"
  }
}
```

Then, from `backend/ECommerceApp`:

```bash
dotnet restore
dotnet ef migrations add InitialCreate --project ECommerce.Infrastructure --startup-project ECommerceApp
dotnet ef database update --project ECommerce.Infrastructure --startup-project ECommerceApp
dotnet run --project ECommerceApp
```

The API starts at `https://localhost:7172`, with Swagger UI at `https://localhost:7172/swagger`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. It talks to the API via the base URL configured in `src/services/api.js` — update it there if your backend runs on a different port.

## API Overview

| Resource | Route | Notes |
|---|---|---|
| Auth | `/api/auth` | Register, login, refresh-token |
| Products | `/api/products` | List, detail, search |
| Product Images | `/api/product-images` | Gallery upload, delete, set primary image |
| Categories | `/api/admin/categories` | Category CRUD |
| Coupons | `/api/coupons` | Admin CRUD + authenticated `apply` |
| Reviews | `/api/reviews` | Product ratings & reviews |
| Wishlist | `/api/wishlist` | Authenticated |
| Addresses | `/api/addresses` | Authenticated |
| Orders | `/api/orders` | Authenticated |
| Admin Orders | `/api/admin/orders` | Order status management |
| Payments | `/api/payments` | Razorpay order creation |
| Dashboard | `/api/dashboard` | Revenue & sales analytics |

Full request/response schemas and live testing (including bearer-token auth) are available through Swagger once the API is running.

## Screenshots

*Add a few screenshots or a short demo GIF here — the homepage, a product gallery, and the admin dashboard are good picks.*

## Roadmap

- [ ] Extract image upload/delete logic out of `ProductImagesController` into a dedicated `ImageStorageService` in the Infrastructure layer
- [ ] Add drag-to-reorder for gallery images (the `DisplayOrder` field is already modeled)
- [ ] Commit EF Core migrations for reproducible database setup
- [ ] Remove the default `WeatherForecast` scaffold and flesh out `Middleware/` and `Extensions/`
- [ ] Add a `hooks/` folder and a shared constants file on the frontend
- [ ] Automated tests (xUnit for the backend, Vitest/RTL for the frontend)
- [ ] CI pipeline for build/test on push

## Author

Built by **Sarvesh** — [@SarveshSS45](https://github.com/SarveshSS45)

# Shoemart Project Overview

Shoemart is a full-stack footwear e-commerce application with a React/Vite frontend, an Express/Prisma backend, PostgreSQL persistence, Razorpay payments, Cloudinary image uploads, and an admin dashboard for catalog and order management.

## What The App Does

- Lets shoppers browse products by brand, category, and gender.
- Supports account creation, login, profile management, and protected user routes.
- Provides cart, wishlist, checkout, and order history flows.
- Supports admin product, order, and user management.
- Integrates payment handling through Razorpay and media storage through Cloudinary.

## Architecture

### Frontend

The client is a Vite app built with React 18, React Router, Redux Toolkit, Tailwind CSS, and Framer Motion. The main routing surface lives in [client/src/App.jsx](client/src/App.jsx), where the app separates public/user pages from admin pages and protects authenticated routes with `ProtectedRoute`.

Global state is split across three slices in [client/src/store/store.js](client/src/store/store.js): auth, cart, and wishlist. Auth persists user and token data in local storage, while cart and wishlist state are meant to stay in sync with backend APIs.

API access is centralized in [client/src/api/index.js](client/src/api/index.js). That client attaches the bearer token automatically, redirects on 401 responses, and exposes grouped helpers for auth, products, cart, wishlist, orders, payments, and admin actions.

### Backend

The server is a Node.js/Express app started from [server/server.js](server/server.js) and assembled in [server/src/app.js](server/src/app.js). It enables JSON and URL-encoded parsing, configures CORS for the local client and the configured client URL, exposes modular routes, and includes a lightweight health check at `/api/health`.

The API is organized by domain:

- auth
- products
- cart
- wishlist
- orders
- payments
- admin

Persistence is handled with Prisma against PostgreSQL, defined in [server/prisma/schema.prisma](server/prisma/schema.prisma).

## Data Model

The Prisma schema centers on these entities:

- `User` for authentication, roles, and saved addresses.
- `Product` for catalog data, including brand, category, gender, sizes, images, stock, and tags.
- `CartItem` for cart lines with quantity and size.
- `WishlistItem` for saved products.
- `Address` for checkout destinations.
- `Order` and `OrderItem` for purchase history and fulfillment.

Enums define the catalog and order domain, including roles, brands, categories, genders, order status, and payment status.

## Key User Flows

- Public browsing: home, product listing, product detail, brand pages, category pages, and about page.
- Authenticated shopping: profile, cart, wishlist, orders, order detail, and checkout.
- Admin workflow: dashboard, product management, order management, and user management.

## Implementation Notes

- Cart and wishlist state should be hydrated from the backend on page load and cleared on logout.
- Wishlist rows are returned with nested `product` data, so UI code should pass `item.product` into shared product components.
- Cart additions require a `size`, so quick-add flows need a default size when one is available.
- Product image payloads can arrive as arrays or comma-separated strings, so shared image rendering should use a fallback helper plus `onError` handling.
- The backend allows localhost client origins and the configured `CLIENT_URL`, which makes local development straightforward.

## Runtime And Scripts

### Client

- `npm run dev` starts the Vite frontend.
- `npm run build` produces a production build.

### Server

- `npm run dev` starts the Express API with nodemon.
- `npm run start` runs the API directly with Node.js.
- `npm run seed` seeds the database.
- `npm run studio` opens Prisma Studio.

## Local Setup Summary

1. Install dependencies in `client/` and `server/`.
2. Configure environment variables for the API URL, database connection, Razorpay, and Cloudinary.
3. Run Prisma migrations and seed data from `server/prisma/`.
4. Start the server and client in separate terminals.

## Notes For Maintainers

- The repo already contains a useful project-specific memory note in /memories/repo/shoemart.md that captures cart, wishlist, and image rendering edge cases.
- The Prisma schema currently uses `paymentMethod` defaulting to `STRIPE`, while the app dependencies and frontend flows use Razorpay. That may be a legacy naming detail worth keeping in mind when reading payment code.
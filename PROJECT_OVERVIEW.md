# SHOEMART — Project Overview

> A comprehensive reference document for any developer onboarding to this project.  
> **Read time: ~10 minutes**

---

## 1. Project Introduction

**SHOEMART** is a full-stack e-commerce platform for premium footwear. It is built as a production-ready web application that allows customers to browse, filter, and purchase shoes from top brands, while giving administrators a dedicated panel to manage inventory, orders, and users.

### Who is it for?

| Audience | Role |
|----------|------|
| End customers | Browse and buy shoes across brands, categories, and genders |
| Administrators | Manage products, track orders, and oversee users |
| Developers | A reference full-stack project demonstrating modern React + Node.js e-commerce architecture |

### What problem does it solve?

SHOEMART demonstrates a complete, production-grade online shoe store with:
- Real payment processing via **Razorpay** (India's leading payments gateway)
- Cloud image management via **Cloudinary** (no local file storage)
- A robust admin panel with live stats, charts, and full CRUD controls
- A clean, luxury dark-themed UI aimed at premium brand positioning

### Links

| Resource | URL |
|----------|-----|
| **Live Application** | https://shoemart-sigma.vercel.app |
| **GitHub Repository** | https://github.com/Sudharsanv06/shoemart |

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 18.2.0 | Component-based UI |
| **Build Tool** | Vite | 5.2.0 | Fast dev server and bundler |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first CSS with custom design tokens |
| **State Management** | Redux Toolkit | 2.12.0 | Global state for auth, cart, wishlist |
| **Routing** | React Router DOM | 6.30.3 | Client-side navigation |
| **HTTP Client** | Axios | 1.16.1 | API requests with interceptors for token injection |
| **Animations** | Framer Motion | 12.39.0 | Smooth UI transitions |
| **Icons** | Lucide React + React Icons | latest | Icon library across all pages |
| **Toast Notifications** | React Hot Toast | 2.6.0 | Non-intrusive toast alerts |
| **Charts** | Recharts | 3.8.1 | Bar and Pie charts in the admin dashboard |
| **Backend Framework** | Express.js | 4.18.3 | REST API server |
| **Runtime** | Node.js | LTS | Server runtime |
| **ORM** | Prisma | 5.10.2 | Type-safe database client and migrations |
| **Database** | PostgreSQL | — | Relational database |
| **Authentication** | JWT (jsonwebtoken) | 9.0.2 | Stateless token-based auth |
| **Password Hashing** | bcryptjs | 2.4.3 | Secure password storage |
| **File Upload** | Multer + multer-storage-cloudinary | 1.4.5 / 4.0.0 | Multipart form parsing routed to Cloudinary |
| **Image Storage** | Cloudinary | 2.2.0 | Cloud-hosted product and avatar images |
| **Payment Gateway** | Razorpay | 2.9.2 | Indian rupee payment processing with signature verification |
| **Fonts** | Google Fonts (Cormorant Garamond, DM Sans) | — | Premium serif display + clean body font |
| **Frontend Deployment** | Vercel | — | Zero-config React deployment |
| **Backend Deployment** | Render | — | Node.js web service with `render.yaml` config |
| **Dev Tools** | nodemon, Prisma Studio | — | Hot reload and DB inspection |

---

## 3. Features List

### Customer Features

| Feature | Description |
|---------|-------------|
| **Homepage** | Hero banner with CTA, brand strip, featured products grid, gender category cards, sport-type navigation, USP strip, newsletter subscription |
| **Product Browsing** | Full product listing page with left-side filter panel |
| **Filtering** | Filter by brand (Nike, Adidas, Puma, Reebok, Skechers, Woodland), category (14 types), gender, and price range sliders |
| **Sorting** | Sort by Featured, Price Low–High, Price High–Low, Newest, Top Rated |
| **Pagination** | Server-side pagination (12 products/page); client-side pagination when multi-filters are active |
| **Search** | Keyword search across product name, description, and tags |
| **Product Detail** | Full product page with image gallery, size picker, quantity selector, discount badge, add to cart and wishlist |
| **Quick View** | Hover-triggered modal on product cards showing image, sizes, price, and add-to-cart button |
| **Image Hover Cycle** | Product card cycles through multiple images on hover (800ms interval) |
| **Cart** | Persistent cart stored in DB; quantity update, remove item, clear cart; free delivery threshold at ₹999 |
| **Wishlist** | Save/remove products; persisted per user in DB |
| **3-Step Checkout** | Step 1 — Address selection/creation; Step 2 — Order review; Step 3 — Razorpay payment |
| **Razorpay Payment** | Native Razorpay popup with HMAC-SHA256 signature verification before order confirmation |
| **Order History** | List of all past orders with status badges |
| **Order Detail** | Full breakdown of a single order including items, address, payment status, total, and delivery charge |
| **Profile Management** | Edit name and phone; upload avatar photo (stored on Cloudinary); change password with old-password verification |
| **Address Book** | Add, delete, and set default delivery addresses (stored in DB via `Address` model) |
| **Brand Pages** | Dedicated filtered view for each brand |
| **Category Pages** | Dedicated filtered view for each shoe category |
| **About Page** | Brand story / informational page |
| **Responsive Design** | Mobile hamburger menu, responsive grids, mobile-first layout |
| **Toast Alerts** | Inline notifications for add-to-cart, wishlist, errors, and order success |
| **Auto-Logout** | Axios interceptor auto-logs out and redirects to `/login` on any 401 response |
| **Auth Persistence** | `shoemart_user` and `shoemart_token` stored in `localStorage`; restored on page reload |

### Admin Features

> All admin routes are protected by `role === "ADMIN"` check both on frontend (`ProtectedRoute adminOnly`) and backend (`admin` middleware).

| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Stat cards (Total Revenue, Orders, Products, Users); Bar chart of orders by date; Pie chart of order status distribution; Recent orders table |
| **Product Management** | Full list of all products with search; create, edit, and delete products |
| **Add Product** | Form with name, description, price, MRP, brand, category, gender, sizes, stock, tags, featured/new toggles, and multi-image upload (up to 5 images via Cloudinary) |
| **Edit Product** | Pre-populated form; manage existing images (keep or remove); upload additional images |
| **Order Management** | Paginated list of all orders with status filter; update order status (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → CANCELLED → RETURNED) |
| **Order Detail (Admin)** | Full breakdown including customer info, address, payment IDs, and all ordered items |
| **User Management** | Paginated user list; change role between USER and ADMIN; delete users (cannot delete own account) |
| **Admin Sidebar** | Persistent sidebar navigation linking to Dashboard, Products, Orders, and Users |
| **Admin-Only Layout** | Admin pages have no public Navbar/Footer; use the `AdminSidebar` component instead |

---

## 4. Project Structure

```
shoemart/                           # Monorepo root
├── client/                         # React frontend (Vite)
│   ├── index.html                  # HTML entry point (loads Razorpay SDK script)
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind design tokens and custom colors/fonts
│   ├── postcss.config.js           # PostCSS config for Tailwind
│   ├── package.json                # Client dependencies
│   ├── .env.example                # Client environment variable template
│   └── src/
│       ├── main.jsx                # React app entry: wraps with Redux Provider, BrowserRouter, Toaster
│       ├── App.jsx                 # Root component: defines all routes, splits admin vs public layout
│       ├── index.css               # Global styles: CSS variables, Tailwind directives, custom component classes
│       ├── api/
│       │   └── index.js            # Axios instance with auth interceptor; exports authAPI, productAPI, cartAPI, wishlistAPI, orderAPI, paymentAPI, adminAPI
│       ├── store/
│       │   ├── store.js            # Redux store configuration (auth + cart + wishlist slices)
│       │   ├── authSlice.js        # Auth state: user, token; persisted in localStorage
│       │   ├── cartSlice.js        # Cart state: items, count, total; synced with backend
│       │   └── wishlistSlice.js    # Wishlist state: items array
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.jsx      # Sticky top nav: logo, links, brands dropdown, cart/wishlist badges, user menu, mobile hamburger
│       │   │   ├── Footer.jsx      # Site footer with brand links and quick navigation
│       │   │   ├── ProductCard.jsx # Reusable product card: image cycle on hover, quick-add to cart, quick-wishlist, quick-view modal, discount badge
│       │   │   ├── ProtectedRoute.jsx  # Route guard: redirects unauthenticated or non-admin users
│       │   │   └── Loader.jsx      # Simple loading spinner component
│       │   └── admin/
│       │       └── AdminSidebar.jsx    # Admin sidebar navigation links
│       └── pages/
│           ├── NotFound.jsx        # 404 page
│           ├── public/
│           │   ├── Home.jsx        # Homepage: hero, brand strip, featured, categories, new arrivals, sport types, USP, newsletter
│           │   ├── Products.jsx    # Product listing: filters, sorting, pagination, grid layout
│           │   ├── ProductDetail.jsx  # Product detail page: image gallery, size picker, cart/wishlist actions, related info
│           │   ├── BrandPage.jsx   # Filtered product listing for a specific brand
│           │   ├── CategoryPage.jsx   # Filtered product listing for a specific category/gender
│           │   ├── Login.jsx       # Email/password login form; dispatches setCredentials to Redux
│           │   ├── Signup.jsx      # Registration form; dispatches setCredentials on success
│           │   └── About.jsx       # Static about/brand story page
│           ├── user/
│           │   ├── Cart.jsx        # Shopping cart: item list, quantity controls, totals, checkout CTA
│           │   ├── Checkout.jsx    # 3-step checkout: address → review → Razorpay payment
│           │   ├── Wishlist.jsx    # Saved items list with move-to-cart and remove actions
│           │   ├── Orders.jsx      # Order history list with status badges
│           │   ├── OrderDetail.jsx # Individual order breakdown: items, address, payment, timeline
│           │   └── Profile.jsx     # User profile: edit name/phone, avatar upload, change password, manage addresses
│           └── admin/
│               ├── AdminDashboard.jsx   # Dashboard: stat cards, Recharts bar/pie charts, recent orders table
│               ├── AdminProducts.jsx    # Product list with search, delete, and links to add/edit
│               ├── AdminAddProduct.jsx  # Product creation form with multi-image Cloudinary upload
│               ├── AdminEditProduct.jsx # Product edit form with image management (keep/remove/add)
│               ├── AdminOrders.jsx      # All orders table with status filter and pagination
│               ├── AdminOrderDetail.jsx # Full order view with customer info and status update dropdown
│               └── AdminUsers.jsx       # User list with role management and delete actions
│
├── server/                         # Node.js Express backend
│   ├── server.js                   # Entry point: connects DB, starts Express, handles SIGTERM graceful shutdown
│   ├── package.json                # Server dependencies
│   ├── render.yaml                 # Render deployment config (build + start commands + env vars)
│   ├── .env.example                # Server environment variable template
│   ├── prisma/
│   │   ├── schema.prisma           # Prisma data model: all tables, enums, and relations
│   │   ├── seed.js                 # Database seeder script (sample products)
│   │   └── migrations/             # Auto-generated Prisma migration SQL files
│   └── src/
│       ├── app.js                  # Express app: CORS config, JSON parsing, route mounting, error handler
│       ├── config/
│       │   ├── db.js               # Prisma client singleton
│       │   └── cloudinary.js       # Cloudinary SDK config (reads env vars)
│       ├── middlewares/
│       │   ├── auth.js             # JWT verification middleware; attaches req.user
│       │   ├── admin.js            # Role guard middleware; 403 if not ADMIN
│       │   ├── upload.js           # Multer + CloudinaryStorage middleware; folder: shoemart/products; max 5MB
│       │   └── error.middleware.js # Global error handler; formats ApiError responses
│       ├── controllers/
│       │   ├── auth.controller.js  # signup, login, getMe, updateProfile (with avatar upload support)
│       │   ├── product.controller.js  # getProducts (with filters/sort/pagination), getProduct, getFeatured, getNewArrivals, createProduct, updateProduct, deleteProduct
│       │   ├── cart.controller.js  # getCart, addToCart (upsert), updateCart, removeFromCart, clearCart
│       │   ├── wishlist.controller.js # getWishlist, addToWishlist (upsert), removeFromWishlist
│       │   ├── order.controller.js # createOrder (clears cart after), getUserOrders, getOrder, getAllOrders (admin), getAdminOrder (admin), updateOrderStatus (admin)
│       │   └── payment.controller.js  # createOrder (Razorpay order), verifyPayment (HMAC signature check)
│       ├── routes/
│       │   ├── auth.routes.js      # /api/auth — signup, login, me, profile update
│       │   ├── product.routes.js   # /api/products — public reads, admin CRUD with upload
│       │   ├── cart.routes.js      # /api/cart — all routes auth-protected
│       │   ├── wishlist.routes.js  # /api/wishlist — all routes auth-protected
│       │   ├── order.routes.js     # /api/orders — user routes + admin sub-routes
│       │   ├── payment.routes.js   # /api/payments — create-order, verify
│       │   └── admin.routes.js     # /api/admin — stats, users CRUD (inline, no controller file)
│       └── utils/
│           ├── ApiError.js         # Custom error class with statusCode and message
│           └── ApiResponse.js      # Consistent response wrapper: {statusCode, data, message, success}
│
├── .gitignore                      # Root git ignore rules
├── render.yaml                     # Render deployment config
├── README.md                       # Basic readme
└── PROJECT_OVERVIEW.md             # This file
```

---

## 5. Data Models

All models are defined in [`server/prisma/schema.prisma`](./server/prisma/schema.prisma). The database is **PostgreSQL**. Prisma generates a type-safe client from this schema.

### User

The core account model. Supports two roles: `USER` (default) and `ADMIN`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | Primary key |
| `name` | String | Display name |
| `email` | String | Unique — used for login |
| `password` | String | bcrypt hash (12 rounds) |
| `role` | Role enum | `USER` or `ADMIN` |
| `avatar` | String? | Cloudinary URL |
| `phone` | String? | Optional contact number |
| `createdAt` | DateTime | Auto-set |
| `updatedAt` | DateTime | Auto-updated |
| Relations | — | `addresses[]`, `cart[]`, `orders[]`, `wishlist[]` |

### Product

The central catalog model. Images and sizes are stored as comma-separated strings (serialized arrays) for portability with PostgreSQL. The controller layer parses/formats these transparently.

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | Primary key |
| `name` | String | Product title |
| `description` | String | Full description |
| `price` | Float | Selling price (INR) |
| `mrp` | Float | Maximum Retail Price — used to compute discount % |
| `brand` | Brand enum | NIKE, ADIDAS, PUMA, REEBOK, SKECHERS, WOODLAND, OTHER |
| `category` | Category enum | 14 categories (CASUALS, FORMALS, SPORTS, RUNNING, SNEAKERS, SANDALS, BOOTS, FLATS, HEELS, SCHOOL, DANCE, BASKETBALL, FOOTBALL, TRAINING) |
| `gender` | Gender enum | MEN, WOMEN, KIDS, UNISEX |
| `sizes` | String | Comma-separated size list e.g. `"6,7,8,9,10"` |
| `images` | String | Comma-separated Cloudinary URLs |
| `stock` | Int | Current inventory count |
| `isFeatured` | Boolean | Appears in "Featured Collection" on homepage |
| `isNew` | Boolean | Appears in "New Arrivals" on homepage |
| `tags` | String | Comma-separated search tags |
| `rating` | Float | Average rating (currently seeded manually) |
| `reviewCount` | Int | Total review count |
| `createdAt` | DateTime | Auto-set |
| `updatedAt` | DateTime | Auto-updated |

### CartItem

Represents one line in a user's cart. The composite unique constraint `[userId, productId, size]` ensures the same product+size combination is merged (quantity incremented) rather than duplicated.

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | Primary key |
| `quantity` | Int | Default 1 |
| `size` | String | Selected shoe size |
| `userId` | String | FK → User (cascade delete) |
| `productId` | String | FK → Product |
| Unique | — | `(userId, productId, size)` |

### WishlistItem

Simple junction table between User and Product. Composite unique constraint prevents duplicates.

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | Primary key |
| `userId` | String | FK → User (cascade delete) |
| `productId` | String | FK → Product |
| Unique | — | `(userId, productId)` |

### Address

User-managed delivery addresses. One address can be marked as default. Orders reference an address at time of placement.

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | Primary key |
| `label` | String | "Home" or "Work" |
| `fullName` | String | Recipient name |
| `phone` | String | Contact number |
| `line1` | String | Street address line 1 |
| `line2` | String? | Street address line 2 (optional) |
| `city` | String | City |
| `state` | String | State |
| `pincode` | String | PIN code |
| `isDefault` | Boolean | Default delivery address |
| `userId` | String | FK → User (cascade delete) |

### Order

The primary order record. `subtotal + deliveryCharge = total`. Delivery is free for orders ≥ ₹999. The `stripePaymentId` field is reused to store the Razorpay payment/order ID (legacy field name retained for DB compatibility).

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | Primary key |
| `orderNumber` | String | Unique display order number (cuid) |
| `status` | OrderStatus enum | PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → CANCELLED → RETURNED |
| `paymentStatus` | PaymentStatus enum | PENDING, PAID, FAILED, REFUNDED |
| `paymentMethod` | String | Always `"RAZORPAY"` |
| `stripePaymentId` | String? | Stores Razorpay payment/order ID |
| `subtotal` | Float | Sum of item prices |
| `discount` | Float | Default 0 (coupon system not yet implemented) |
| `deliveryCharge` | Float | ₹99 if subtotal < ₹999, else ₹0 |
| `total` | Float | Final payable amount |
| `userId` | String | FK → User |
| `addressId` | String? | FK → Address |
| `createdAt` | DateTime | Auto-set |
| `updatedAt` | DateTime | Auto-updated |

### OrderItem

Line items within an order. Snapshot of price at time of purchase (not the live product price).

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | Primary key |
| `quantity` | Int | Units ordered |
| `size` | String | Selected size |
| `price` | Float | Price at time of order |
| `productId` | String | FK → Product |
| `orderId` | String | FK → Order |

### Enums

| Enum | Values |
|------|--------|
| `Role` | USER, ADMIN |
| `Brand` | NIKE, ADIDAS, PUMA, REEBOK, SKECHERS, WOODLAND, OTHER |
| `Category` | CASUALS, FORMALS, SPORTS, RUNNING, SNEAKERS, SANDALS, BOOTS, FLATS, HEELS, SCHOOL, DANCE, BASKETBALL, FOOTBALL, TRAINING |
| `Gender` | MEN, WOMEN, KIDS, UNISEX |
| `OrderStatus` | PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED |
| `PaymentStatus` | PENDING, PAID, FAILED, REFUNDED |

---

## 6. API Endpoints

All endpoints are prefixed with `/api`. The base URL in production is your Render server URL (set via `VITE_API_URL` on the client).

### Authentication — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/signup` | No | Register a new user. Body: `{ name, email, password }`. Returns `{ user, token }`. |
| POST | `/auth/login` | No | Login with email and password. Returns `{ user, token }`. |
| GET | `/auth/me` | JWT | Fetch the authenticated user's full profile including addresses. |
| PATCH | `/auth/profile` | JWT | Update profile: name, phone, avatar (multipart/form-data), or change password. |
| PATCH | `/auth/me` | JWT | Alias for profile update (JSON body only). |

### Products — `/api/products`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/products` | No | List products. Supports query params: `brand`, `category`, `gender`, `search`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`. |
| GET | `/products/featured` | No | Returns up to 8 products where `isFeatured = true`. |
| GET | `/products/new` | No | Returns up to 8 products where `isNew = true`, ordered by newest first. |
| GET | `/products/:id` | No | Fetch single product by ID. |
| POST | `/products` | JWT + ADMIN | Create a product. Multipart form data. Up to 5 images uploaded to Cloudinary. |
| PATCH | `/products/:id` | JWT + ADMIN | Update a product. Supports `existingImages` (JSON array) + new file uploads. |
| DELETE | `/products/:id` | JWT + ADMIN | Delete a product. Also deletes related CartItem, WishlistItem, and OrderItem records first. |

### Cart — `/api/cart`

All cart routes require JWT authentication.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/cart` | JWT | Fetch the authenticated user's cart with product details. |
| POST | `/cart` | JWT | Add item to cart. Body: `{ productId, size, quantity }`. Uses upsert — increments quantity if same product+size exists. |
| PATCH | `/cart/:id` | JWT | Update cart item quantity. If quantity < 1, the item is deleted. |
| DELETE | `/cart/:id` | JWT | Remove a specific cart item by cart item ID. |
| DELETE | `/cart/clear` | JWT | Remove all items from the authenticated user's cart. |

### Wishlist — `/api/wishlist`

All wishlist routes require JWT authentication.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/wishlist` | JWT | Fetch the authenticated user's wishlist with product details. |
| POST | `/wishlist` | JWT | Add a product to wishlist. Body: `{ productId }`. Uses upsert — safe to call if already in list. |
| DELETE | `/wishlist/:productId` | JWT | Remove a product from wishlist by product ID. |

### Orders — `/api/orders`

All order routes require JWT authentication.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/orders` | JWT | Create an order from the current cart. Accepts `{ addressId, address, paymentMethod, razorpayOrderId, razorpayPaymentId }`. Cart is cleared after successful order creation. |
| GET | `/orders` | JWT | List all orders for the authenticated user, newest first. |
| GET | `/orders/:id` | JWT | Fetch a single order belonging to the authenticated user. |
| GET | `/orders/admin/all` | JWT + ADMIN | List all orders across all users. Supports `status` filter and `page`/`limit` params. |
| GET | `/orders/admin/:id` | JWT + ADMIN | Fetch any single order with full customer, address, and item details. |
| PATCH | `/orders/admin/:id` | JWT + ADMIN | Update an order's status. Body: `{ status }`. |

### Payments — `/api/payments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/payments/create-order` | JWT | Create a Razorpay order. Body: `{ amount }` in INR. Returns `{ orderId, amount, currency, keyId }`. |
| POST | `/payments/verify` | JWT | Verify a Razorpay payment signature using HMAC-SHA256. Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`. |

### Admin — `/api/admin`

All admin routes require JWT authentication **and** `role === "ADMIN"`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/stats` | JWT + ADMIN | Returns totalUsers, totalProducts, totalOrders (PAID), totalRevenue, and the 5 most recent orders. |
| GET | `/admin/users` | JWT + ADMIN | Paginated list of all users. Supports `page` and `limit` query params. |
| PUT | `/admin/users/:id/role` | JWT + ADMIN | Change a user's role between `USER` and `ADMIN`. |
| DELETE | `/admin/users/:id` | JWT + ADMIN | Delete a user. Cannot delete own account. |

### Health Check

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Returns `{ status: "ok" }`. Used by monitoring and Render health checks. |

---

## 7. User Flows

### Flow 1 — Guest Browsing

```
1. User lands on / (Home page)
   → Sees hero section, featured products, category cards, new arrivals
2. User clicks a category card (e.g. "Men's") 
   → Navigated to /category/men → renders Products page filtered by gender=MEN
3. User browses the product grid
   → Applies filters (brand checkboxes, price slider, category checkboxes)
   → Changes sort order (e.g. "Price: Low to High")
4. User clicks a product card
   → Navigated to /products/:id (ProductDetail page)
   → Sees image gallery, full description, size options
5. User tries to add to cart without being logged in
   → Redirected to /login page
```

### Flow 2 — Signup and First Purchase

```
1. User visits /signup
   → Fills in name, email, password
   → On success: token + user stored in localStorage and Redux; redirected to /
2. User browses to a product detail page
   → Selects a size (e.g. UK 9)
   → Clicks "Add to Cart"
   → Cart item created in DB; Redux cart state updated; toast notification shown
3. User opens cart at /cart
   → Sees item with price, size, quantity controls
   → Delivery charge shown as ₹99 (free if total ≥ ₹999)
   → Clicks "Proceed to Checkout"
4. User is on /checkout
   STEP 1 — Address:
     → Loads saved addresses from DB via GET /auth/me
     → If no address: fills in "Add New Address" form (name, phone, line1, city, state, pincode)
     → Clicks "Continue to Review"
   STEP 2 — Review:
     → Sees all cart items with images, sizes, quantities, and prices
     → Clicks "Proceed to Payment"
   STEP 3 — Payment:
     → Sees subtotal, delivery charge, and grand total
     → Clicks "Pay ₹X,XXX"
     → Razorpay checkout modal opens (themed with SHOEMART gold #C9A84C)
     → User completes payment (UPI, card, netbanking, etc.)
5. On payment success (Razorpay handler):
   → POST /payments/verify — signature verified server-side
   → POST /orders — order created, cart cleared
   → User redirected to /orders/:id (Order confirmation page)
   → Success toast shown
```

### Flow 3 — Admin Managing Products

```
1. Admin logs in with an account that has role=ADMIN
   → User menu in Navbar shows "Admin" link
2. Admin navigates to /admin (Dashboard)
   → Sees 4 stat cards: Total Revenue, Orders, Products, Users
   → Sees Bar chart (orders by date) and Pie chart (orders by status)
   → Sees recent orders table
3. Admin clicks "Products" in AdminSidebar → /admin/products
   → Sees paginated table of all products with name, brand, price, stock, and action buttons
4. Admin clicks "+ Add Product"
   → Navigated to /admin/products/add
   → Fills in product name, description, price, MRP, brand (dropdown), category (dropdown),
     gender (dropdown), sizes (comma-separated or multi-select), stock, tags, featured toggle, new toggle
   → Uploads 1–5 product images (files sent as multipart/form-data)
   → On submit: images uploaded to Cloudinary (folder: shoemart/products), product created in DB
5. Admin edits an existing product at /admin/products/:id/edit
   → Pre-populated form; sees existing image thumbnails with "×" remove buttons
   → Can upload additional images; existing + new images merged
6. Admin clicks "Orders" → /admin/orders
   → Filters orders by status
   → Clicks an order to view /admin/orders/:id
   → Sees customer info, delivery address, all ordered items, payment status
   → Updates order status via dropdown (e.g. CONFIRMED → PROCESSING → SHIPPED → DELIVERED)
```

---

## 8. Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `obsidian` | `#0D0D0D` | Page background |
| `charcoal` | `#1A1A1A` | Card and panel background |
| `carbon` | `#242424` | Nested surfaces |
| `gold` | `#C9A84C` | Primary accent — buttons, borders, highlights, prices |
| `gold-light` | `#E8C97A` | Hover state of gold elements |
| `gold-dark` | `#8B6914` | Pressed / active gold |
| `ivory` | `#F5F0E8` | Primary text color |
| `cream` | `#EDE8DC` | Secondary text |
| `velvet` | `#6B1E3C` | Accent for special labels (defined but sparingly used) |
| `muted` | `#8A8A8A` | Placeholder / secondary text |

### Typography

| Role | Font | Weights |
|------|------|---------|
| Display / Headings (`font-display`) | Cormorant Garamond (serif) | 300, 400, 600, 700 |
| Body / UI (`font-body`) | DM Sans (sans-serif) | 300, 400, 500, 600 |

Both fonts are loaded from **Google Fonts** via `@import` in `index.css`.

### Animations

| Name | Definition | Usage |
|------|-----------|-------|
| `fade-up` | opacity 0→1 + translateY 24px→0 over 0.6s | Page section entrances |
| `shimmer` | opacity 1→0.5→1 over 2s loop | Loading skeleton states |
| `slide-in` | translateX -100%→0 over 0.4s | Sidebar or drawer opens |

### Global CSS Classes (from `index.css`)

| Class | Description |
|-------|-------------|
| `.btn-gold` | Primary gold-filled button: gold background, obsidian text, uppercase tracking, hover glow |
| `.btn-outline` | Ghost button: gold border, gold text, hover fills gold |
| `.card-dark` | Dark card base: charcoal bg, subtle border, hover gold border + shadow |
| `.section` | Section padding: `py-16 px-6 md:px-12 lg:px-24` |
| `.gold-divider` | Thin gold horizontal rule |
| `.input-dark` | Dark form input: obsidian bg, white/10 border, gold focus ring |
| `.badge-gold` | Small rounded gold badge label |
| `.category-card` | Category card with hover image scale and brightness |
| `.category-label` | Centered gold label overlay on category cards |

### Scrollbar

Custom styled: 4px width, obsidian track, gold thumb.

---

## 9. Environment Variables

### Server (`server/.env`)

| Variable | Service | Where to Get | Description |
|----------|---------|-------------|-------------|
| `DATABASE_URL` | PostgreSQL (Neon / Supabase / Render Postgres) | Your DB provider dashboard | Full connection string e.g. `postgresql://user:pass@host:5432/dbname` |
| `JWT_SECRET` | — | Generate locally: `openssl rand -hex 32` | At least 32 random characters; used to sign/verify JWTs |
| `JWT_EXPIRES_IN` | — | Static value | Token lifetime e.g. `"7d"`. Render sets this to `7d` automatically |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary | Cloudinary Dashboard → Account Details | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary | Cloudinary Dashboard → API Keys | API key for upload authentication |
| `CLOUDINARY_API_SECRET` | Cloudinary | Cloudinary Dashboard → API Keys | API secret (keep private) |
| `RAZORPAY_KEY_ID` | Razorpay | Razorpay Dashboard → API Keys | Public key (starts with `rzp_test_` or `rzp_live_`) |
| `RAZORPAY_KEY_SECRET` | Razorpay | Razorpay Dashboard → API Keys | Secret key for HMAC signature verification |
| `CLIENT_URL` | — | Your Vercel deployment URL | Used for CORS allowlist e.g. `https://shoemart-sigma.vercel.app` |
| `PORT` | — | Static value | Server port (default: `5000`) |
| `NODE_ENV` | — | Static value | `development` or `production` |

### Client (`client/.env`)

| Variable | Service | Where to Get | Description |
|----------|---------|-------------|-------------|
| `VITE_API_URL` | Your backend | Render service URL | API base URL e.g. `https://shoemart-api.onrender.com/api` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay | Same as server `RAZORPAY_KEY_ID` | Public Razorpay key used to init the checkout popup in the browser |

> **Security Note:** `VITE_` prefixed variables are embedded into the client bundle and are publicly visible. Never expose `RAZORPAY_KEY_SECRET` or `JWT_SECRET` in client-side code.

---

## 10. Known Limitations & Future Improvements

### Current Limitations

| Area | Limitation |
|------|-----------|
| **Search** | Search is a per-request server filter; there is no debounced live search bar in the Navbar (the search icon in the Navbar is a placeholder button with no functionality wired up yet) |
| **Ratings & Reviews** | The `rating` and `reviewCount` fields exist in the schema but there is no review submission flow; ratings are seeded manually |
| **Coupon / Discount System** | The `discount` field exists on the Order model but there is no coupon code input or discount logic implemented |
| **Address Persistence (Profile page)** | Addresses added on the Profile page are stored only in local React state, not persisted to the DB via an API call — only the Checkout flow creates addresses in the DB |
| **Newsletter** | The newsletter email input on the homepage is a UI-only element; there is no mailing list integration |
| **Razorpay field reuse** | The `stripePaymentId` column on Order is used to store the Razorpay payment ID (a legacy field name from an earlier payment gateway choice) |
| **Stock Decrement** | Stock is not automatically decremented when an order is placed; it is only editable by admins manually |
| **Image Deletion from Cloudinary** | When a product image is removed in the admin edit form, the Cloudinary asset is NOT deleted; only the DB reference is removed, causing orphaned files |
| **Multi-filter Performance** | When more than one brand or category is selected simultaneously, the client fetches all 1000 products and filters locally, which could be slow for large catalogs |

### Future Improvements

| Priority | Feature |
|----------|---------|
| 🔴 High | Wire up the Navbar search bar to a debounced product search API call |
| 🔴 High | Implement automatic stock decrement on order creation |
| 🔴 High | Persist Profile page addresses to the DB (POST /auth/addresses endpoint) |
| 🟡 Medium | Add a Review & Rating system with a review submission form on product detail pages |
| 🟡 Medium | Implement coupon/promo code logic at checkout |
| 🟡 Medium | Add Cloudinary public ID tracking and delete assets when images are removed |
| 🟡 Medium | Refactor `stripePaymentId` to `paymentGatewayId` or add a dedicated `razorpayPaymentId` column |
| 🟡 Medium | Add email notifications (order confirmation, status updates) via Nodemailer or a transactional email provider like Resend |
| 🟢 Low | Implement OAuth login (Google Sign-In) |
| 🟢 Low | Add product comparison feature |
| 🟢 Low | Add an order return/refund request flow |
| 🟢 Low | Switch to server-side filtering for all multi-select filter combinations (OR queries in Prisma) to avoid the 1000-record fetch workaround |
| 🟢 Low | Integrate a real newsletter platform (Mailchimp, ConvertKit) for the homepage signup |
| 🟢 Low | Add unit and integration tests (Jest + Supertest for the backend, React Testing Library for frontend) |
| 🟢 Low | Add React Query or SWR to replace manual fetch-with-useState patterns for better caching and refetching |

---

*Generated on 2026-06-03. Based on full source code analysis of the shoemart monorepo.*
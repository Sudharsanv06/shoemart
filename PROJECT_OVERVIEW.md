# SHOEMART Project Overview

## 1. Project Summary
SHOEMART is a premium, full-stack footwear e-commerce application designed to provide a seamless shopping experience for customers alongside robust management tools for administrators. Features include product browsing with advanced filtering, cart and wishlist management, Razorpay payment processing, an AI-powered chatbot, and a comprehensive admin dashboard.

**Live URLs:**
- **Frontend** (Vercel): `https://shoemart.vercel.app` (Example)
- **Backend** (Render): `https://shoemart-api.onrender.com` (Example)

**Tech Stack Overview:**  
The project is built on the MERN-inspired stack but utilizes a relational database. It relies on React 18 with Vite, Tailwind CSS, and Redux Toolkit for the frontend. The backend is powered by Node.js, Express, and the Prisma ORM, interfacing with a PostgreSQL database hosted on Supabase.

## 2. Tech Stack

### Frontend (`client/package.json`)
*   **`react` / `react-dom`**: UI rendering library component framework.
*   **`@reduxjs/toolkit` / `react-redux`**: Global state management (Cart, Wishlist, Auth).
*   **`react-router-dom`**: Client-side routing for protected and public views.
*   **`tailwindcss` / `@tailwindcss/postcss`**: Utility-first CSS framework for styling.
*   **`framer-motion`**: Animation library for smooth page transitions and UI interactions.
*   **`lucide-react` / `react-icons`**: Icon libraries for UI elements.
*   **`axios`**: Promise-based HTTP client for data fetching.
*   **`razorpay`**: Client-side integration for processing payments.
*   **`react-hot-toast`**: Elegant, customizable pop-up notifications.
*   **`recharts`**: Charting library utilized in the admin dashboard for revenue analytics.

### Backend (`server/package.json`)
*   **`express`**: Fast, unopinionated web framework for Node.js routing.
*   **`@prisma/client`**: Auto-generated, type-safe ORM for database operations.
*   **`bcryptjs`**: Password hashing algorithm to secure user credentials.
*   **`jsonwebtoken`**: Generation and verification of stateless authentication tokens.
*   **`cors`**: Middleware to enable Cross-Origin Resource Sharing from the frontend.
*   **`cloudinary` / `multer` / `multer-storage-cloudinary`**: Services and middlewares for handling image uploads and storage.
*   **`razorpay`**: Server-side SDK for creating and verifying Razorpay orders.
*   **`resend`**: Email delivery service API for sending order confirmations and status updates.
*   **`pdfkit`**: Document generation library for creating downloadable PDF invoices.
*   **`groq-sdk` / `@anthropic-ai/sdk`**: AI integrations managing the customer-facing chatbot (Llama 3.3).

## 3. Repository Structure

### Frontend (`client/src/`)
*   **`api/`**: Axios instances and API service calls.
*   **`assets/`**: Static media like placeholder images, categories, and product icons.
*   **`components/`**: Reusable React components grouped logically:
    *   `admin/`: Admin sidebar, headers, and dashboard widgets.
    *   `common/`: Universal components (Navbar, Footer, Loader, Chatbot, ProductCard).
*   **`hooks/`**: Custom React hooks (e.g., `useRecentlyViewed.js` for localStorage data).
*   **`pages/`**: View components for frontend routing:
    *   `admin/`: Dashboard, Product additions, Order listings.
    *   `public/`: Home, Shop, Product Detail, Login.
    *   `user/`: Profile, Cart, Wishlist, Checkout.
*   **`store/`**: Redux configurations, slices (`authSlice.js`, `cartSlice.js`), and the global `store.js`.
*   **`App.jsx`**: Main application router and layout wrapper.
*   **`main.jsx`**: React DOM injection point with global context providers.

### Backend (`server/src/`)
*   **`config/`**: Configuration files (`db.js` for Prisma, `cloudinary.js`).
*   **`controllers/`**: Logic handlers for routes (Auth, Cart, Orders, Products, Chat, Reviews).
*   **`middlewares/`**: Request interceptors (`auth.js`, `admin.js`, `upload.js`, `error.middleware.js`).
*   **`routes/`**: Express Router definitions mapping endpoints to controllers.
*   **`utils/`**: Helper modules (`ApiError.js`, `ApiResponse.js`, `pdfKit`, NodeMailer/Resend templates).
*   **`app.js`**: Core Express initialization, CORS config, and route mounting.
*   **`server.js`** *(Root)*: Entry point script that handles DB retries and boots the HTTP server.
*   **`prisma/`** *(Root)*: DB schema definitions (`schema.prisma`) and seeding scripts.

## 4. Frontend Architecture

*   **Bootstrapping**: The application mounts via `main.jsx`, where it wraps `<App />` within Redux's `<Provider>`, `react-router-dom`'s `<BrowserRouter>`, and the `react-hot-toast` `<Toaster>`.
*   **Providers**: 
    *   `Provider` (Redux) passes the store containing the authentication token/user data, cart items, and wishlist details.
    *   *Note: Using Redux Toolkit for centralized mutable state instead of React Context or Zustand.*
*   **Routing (`App.jsx`)**:
    *   `/admin/*` -> Rendered inside a specialized Layout (`ProtectedRoute` with `adminOnly=true`).
    *   Public routes (`/`, `/products`, `/login`, `/signup`) -> Normal wrapper with `Navbar` and `Footer`.
    *   User-protected routes (`/profile`, `/cart`, `/checkout`) -> Wrapped in `<ProtectedRoute>`.
*   **State Management Approach**: Uses **Redux Toolkit** alongside standard Redux slices. `useSelector` extracts active user sessions, cart totals, and UI states seamlessly.

## 5. Backend Architecture

*   **Startup**: `server.js` establishes a retry-based connection to the PostgreSQL database using Prisma's query capabilities, while instantly launching the Express server defined in `app.js`.
*   **Database Solution**: Uses Prisma as an ORM connected to a PostgreSQL dialect (running on Supabase).
*   **API Mounting (`app.js`)**:
    *   `/api/auth` (Authentication)
    *   `/api/products` (Catalog and listings)
    *   `/api/cart` (Shopping cart sync)
    *   `/api/wishlist` (User wishlist)
    *   `/api/orders` (Order fulfillment)
    *   `/api/payments` (Razorpay gateways)
    *   `/api/admin` (Admin-only routes)
    *   `/api/reviews` (Product reviews)
    *   `/api/chat` (AI integrations)
    *   `/api/coupons/validate` (Coupon logic built directly in `app.js` and standalone modules)
*   **Middlewares**: 
    *   `auth.js`: Verifies JWT tokens and attaches the `user` object to requests.
    *   `admin.js`: Extends `auth.js` by checking `req.user.role === 'ADMIN'`.
    *   `error.middleware.js`: Catch-all for API operational bugs filtering errors based on environment.
    *   `upload.js`: Multer instances bound to Cloudinary storage streams.

## 6. Database Schema

Models built through Prisma (`schema.prisma`):

| Model | Description & Notable Fields |
|---|---|
| **User** | `id`, `name`, `email` (Unique), `password`, `role` (USER/ADMIN), `avatar`, `phone`. |
| **Product** | `id`, `name`, `price`, `mrp`, `brand`, `category`, `gender`, `stock`, `rating`, `reviewCount`, `images`, `sizes`. |
| **CartItem** | `quantity`, `size`, `userId`, `productId`. Enforces `@@unique([userId, productId, size])`. |
| **WishlistItem** | `userId`, `productId`. Enforces `@@unique([userId, productId])`. |
| **Address** | `id`, `label`, `fullName`, `line1`, `line2`, `city`, `state`, `pincode`, `isDefault`, `userId`. |
| **Order** | `orderNumber` (Unique), `status`, `paymentStatus`, `paymentMethod`, `subtotal`, `discount`, `total`, `userId`, `addressId`. |
| **OrderItem** | Represents snapshot of a product inside an order: `quantity`, `size`, `price`, `productId`, `orderId`. |
| **OrderStatusLog**| `orderId`, `status`, `message`, `createdAt`. Used for the frontend shipping timeline. |
| **Review** | `rating`, `title`, `body`, `userId`, `productId`. Enforces `@@unique([userId, productId])`. |
| **Coupon** | `code` (Unique), `discountType` (PERCENTAGE/FIXED), `discountValue`, `minOrder`, `maxUses`, `isActive`. |

**Enums Utilized**:
*   `Role`: `USER`, `ADMIN`
*   `Brand`: `NIKE`, `ADIDAS`, `PUMA`, `REEBOK`, `SKECHERS`, `WOODLAND`, `OTHER`
*   `Category`: `CASUALS`, `FORMALS`, `SPORTS`, `RUNNING`, `SNEAKERS`, `SANDALS`, `BOOTS`, etc.
*   `Gender`: `MEN`, `WOMEN`, `KIDS`, `UNISEX`
*   `OrderStatus`: `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `RETURNED`
*   `PaymentStatus`: `PENDING`, `PAID`, `FAILED`, `REFUNDED`
*   `DiscountType`: `PERCENTAGE`, `FIXED`

## 7. Features — Detailed

### Feature 1 — Product Catalog
Products are stored in the PostgreSQL database and queried via Prisma through `/api/products` endpoints. Data fetching involves dynamic filters utilizing Prisma `where` queries based on `req.query` params like `gender`, `brand`, and `category`. Search functionality handles autocomplete by mapping user input to products via a specialized debounced API.

### Feature 2 — Authentication
The system relies on JSON Web Tokens (JWT). When a user successfully logs in, the backend issues an encrypted token signed with `JWT_SECRET`. The frontend stores this token and attaches it to the `Authorization: Bearer <token>` header of every subsequent Axios request. Access to the Admin dashboard requires the backend to verify the `req.user.role === "ADMIN"`.

### Feature 3 — Cart & Wishlist
Cart and Wishlist logic stores items strictly in the database (ensuring continuity across devices). The `CartItem` model maps a `Product`, `User`, and `size`. Frontend actions dispatch Redux events triggering API pushes. The shopping cart count displayed globally in the `Navbar` is driven entirely by the hydrated Redux store object parameter length.

### Feature 4 — Checkout & Payment
The application integrates Razorpay's gateway. 
1. The user selects an address and confirms order details.
2. The server receives the intent and generates a Razorpay `order_id`.
3. The frontend initiates the Razorpay modal window.
4. On success, the response is verified on the backend before finalizing the DB `Order` status as `PAID`.
5. Discounts are determined prior to intent creation by hitting the `/api/coupons/validate` endpoint.

### Feature 5 — Reviews & Ratings
Verified users can leave reviews. The database enforces a `@@unique([userId, productId])` constraint to ensure a maximum of one review per user per product. Upon creation, Prisma acts inside a transaction to recalculate and aggregate the respective product's overall `rating` and `reviewCount`. Admins possess overrides allowing them to moderate and delete inappropriate reviews.

### Feature 6 — Email Notifications
Resend's API allows the backend to send targeted email updates. Templates are stored within `utils/emailTemplates.js`. Event listeners inside the order and status change controllers trigger distinct emails for 'Order Confirmation' and shipping status pipeline updates.

### Feature 7 — Invoice PDF
Handled internally utilizing the `pdfkit` module. Upon order confirmation or via the dashboard download endpoint, `generateInvoice.js` plots lines and tables showing the Order items, applied discounts, and totals into a PDF document, streaming the binary buffer back to the client application for seamless downloads.

### Feature 8 — Enhanced Admin Controls
The Admin suite allows privileged users to read key analytics aggregated by Prisma methods mapped to Recharts data models. Administrators can toggle product `isFeatured` statuses, check low stock warning metrics, govern active `Coupons` (enabling toggles or tracking `usedCount`), and fully CRUD products.

### Feature 9 — Order Status Timeline
Every mutation to an `Order`'s status triggers the creation of an `OrderStatusLog` document containing a snapshot message and timestamp. On the frontend, the timeline maps this model's array, dynamically constructing a vertical timeline component visualizing every stage of handling from `CONFIRMED` to `DELIVERED`.

### Feature 10 — AI Chatbot
A floating UI invokes a specialized intelligent assistant integrated with the Groq API (utilizing the model `llama-3.3-70b-versatile`). The system prompt is specifically injected with the exact SHOEMART environment context enabling it to assist accurately with brand inquiries and navigation persistently over every page route.

### Feature 11 — Search Autocomplete
Triggered through a `SearchOverlay` component. A specialized frontend debouncer minimizes network calls, while the backend responds dynamically by searching `name` strings natively and mapping for implicit brand/category recognition mapped directly against enums.

### Feature 12 — Recently Viewed
A client-exclusive loop using a custom hook (`useRecentlyViewed.js`). The UI monitors components mounted via `ProductDetail.jsx` and appends product IDs into an array stored in the user's browser `localStorage`. A cap truncates the array length to the 5 most recent entities, rendering uniformly on the home and shop product pipelines.

### Feature 13 — Size Guide Modal
An informative interaction component triggered on specific product pages. Providing a robust table equating US, UK, EU, and CM scales alongside gender-specific columns allowing clients accurate reference metrics for footwear precision including a how to measure illustration element.

## 8. API Reference

| Group | Method | Path | Auth Required | Description |
|---|---|---|---|---|
| **Auth** | POST | `/api/auth/register` | No | Creates a new user |
| **Auth** | POST | `/api/auth/login` | No | Authenticates user / returns JWT |
| **Products** | GET | `/api/products` | No | Fetch filtered product catalog |
| **Products** | GET | `/api/products/:id` | No | Fetch details for a specific product |
| **Cart** | POST | `/api/cart` | Yes | Add item to shopping cart |
| **Cart** | GET | `/api/cart` | Yes | View user's cart |
| **Wishlist** | POST | `/api/wishlist` | Yes | Toggle item in wishlist |
| **Orders** | POST | `/api/orders` | Yes | Create payment intent / check out |
| **Coupons** | POST | `/api/coupons/validate`| Yes | Check viability of a discount code |
| **Chat** | POST | `/api/chat` | No | Send message to AI Groq Chatbot |
| **Admin** | POST | `/api/admin/products` | Yes (ADMIN) | Insert a new product listing |

## 9. Environment Variables

### Backend (`server/.env`)
| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Supabase PostgreSQL direct connection string. |
| `DIRECT_URL` | Yes | Direct connection fallback array for Prisma migrations. |
| `PORT` | Optional | Backend listener port (Default 5000). |
| `JWT_SECRET` | Yes | Signature key used for generating user auth tokens. |
| `CLIENT_URL` | Yes | Target pointing out to the Frontend URL for CORS. |
| `RAZORPAY_KEY_ID` | Yes | Payment gateway public client identifier. |
| `RAZORPAY_KEY_SECRET`| Yes | Payment gateway matching private identity secret. |
| `RESEND_API_KEY` | Optional | Resend mailing service payload key. |
| `CLOUD_NAME` | Yes | Cloudinary account identifier slug string. |
| `CLOUD_API_KEY` | Yes | Cloudinary programmatic API Key map. |
| `CLOUD_API_SECRET` | Yes | Cloudinary backend secret token key. |
| `GROQ_API_KEY` | Optional | API token required to utilize AI Llama 3 models. |

### Frontend (`client/.env`)
| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Domain pointing to backend API server routes. |
| `VITE_RAZORPAY_KEY_ID`| Yes | Matching Razorpay client key for invoking modal. |

## 10. Local Development Setup

**Prerequisites:** Node.js `>=18.x`, PostgreSQL/Supabase database mapping parameters configured.

**1. Clone the Repository:**
```bash
git clone <repository_url> && cd shoemart
```

**2. Backend Setup:**
```bash
cd server
npm install
npm run dev
```
*Note: Make sure to push DB schema changes first utilizing `npx prisma db push` and `npm run seed` to load default user states.*

**3. Frontend Setup:**
```bash
cd ../client
npm install
npm run dev
```

## 11. Deployment

### Backend (Render)
*   **Build Command**: `npm install && npx prisma generate`
*   **Start Command**: `npm start`
*   **Env Variables**: Supply all exact values corresponding to your localized environments.

### Frontend (Vercel)
*   **Root Directory**: Set build execution context strictly to `client/`.
*   Ensure the `VITE_API_URL` environment parameter points to your live Render backend endpoint.
*   Configure routing rules via `vercel.json` if relying strictly on React Client side routes natively.

### Database (Supabase)
*   Update your Backend Render `DATABASE_URL`/`DIRECT_URL` configs.
*   Deploy relations tracking smoothly safely by executing `npx prisma migrate deploy` locally to force the latest schema synchronization context.

## 12. Known Limitations

*   **Render Cold Starts**: Because the backend API may be hosted on a free Render tier, the web service occasionally spins down after periods of inactivity. Visitors might initially experience a cold start initialization delay of up to `~50 seconds`.
*   **TCP Connection Reliability**: The initial build phase encountered random issues utilizing Neon's platform causing intermittent connection drops on the free tier — **Supabase** was supplemented specifically to circumvent these timeouts.
*   *(Note: Razorpay is currently confined locally to its Sandbox mode logic testing, hence live transactions require integration modifications moving ahead)*.
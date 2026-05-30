# 👟 SHOEMART — Premium Footwear E-Commerce

Full-stack footwear store with customer shopping flows, Razorpay payments, and an admin panel.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit |
| Backend | Node.js, Express, Prisma ORM |
| Database | PostgreSQL |
| Payments | Razorpay |
| Images | Cloudinary |
| Auth | JWT |

## Features
- Browse by brand, category, and gender
- User auth with protected routes
- Cart, wishlist, and checkout flow
- Razorpay test-mode payments
- Order history and status tracking
- Admin product, order, and user management

## Quick Start

### Prerequisites
Node.js 18+, PostgreSQL, Razorpay account, Cloudinary account

### Install
```bash
git clone <repo-url> && cd shoemart
cd client && npm install
cd ../server && npm install
```

### Configure environment
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Database
```bash
cd server
npx prisma@5.10.2 migrate dev --name init --schema prisma/schema.prisma
npx prisma@5.10.2 generate --schema prisma/schema.prisma
node prisma/seed.js
```

### Run
```bash
cd server && npm run dev
cd client && npm run dev
```

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@shoemart.com | Admin@123 |
| User | user@shoemart.com | User@123 |

## Razorpay Test Payment
Use the test card or UPI details from your Razorpay dashboard in test mode.

## Project Structure

shoemart/
├── client/        React + Vite frontend
└── server/        Express + Prisma backend

# GoSolo E-commerce Platform - PRD

## Original Problem Statement
Build a full-stack e-commerce web application called "GoSolo" with:
- Product catalog and shopping cart
- Razorpay payment integration (test mode)
- Order management for users and admins
- Stock management with automatic deduction on purchase
- Admin product management with discounts

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (client-side cart)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Payments**: Razorpay (Test Mode)
- **Deployment**: Vercel

## Database Schema
- `Product`: { id, name, description, price, discountPercent, stock, imageUrl, isActive, createdAt, updatedAt }
- `Order`: { id, totalAmount, status: [PENDING, PAID, SHIPPED, DELIVERED, CANCELLED], userId? }
- `OrderItem`: { id, orderId, productId, name, quantity, price }
- `Payment`: { id, orderId, amount, currency, status, provider, razorpayPaymentId, razorpayOrderId, razorpaySignature }

## Implemented Features

### Phase 1: Core E-commerce (Completed)
- [x] Product catalog with shop page
- [x] Individual product detail pages
- [x] Shopping cart functionality (Zustand)
- [x] Checkout flow
- [x] Razorpay payment integration
- [x] Payment verification and order status updates
- [x] Stock deduction on successful payment

### Phase 2: Orders & Admin Management (Completed - Jan 4, 2026)
- [x] User Orders page (`/orders`)
- [x] Order Detail page (`/orders/[id]`) with progress tracker
- [x] Admin Orders page (`/admin/orders`) with status management
- [x] Status transition validation
- [x] Payment status display in orders table

### Phase 3: Admin Product Management (Completed - Jan 4, 2026)
- [x] Admin Products page (`/admin/products`)
  - Product table with images, prices, discounts, stock, status
  - Stats cards (Total, Active, Out of Stock, On Discount)
  - Quick stock +/- buttons for instant updates
  - Add/Edit product modal with form validation
  - **Image upload** (JPEG, PNG, WebP, GIF, max 5MB)
  - Delete product (soft delete for products with orders)
- [x] Discount System
  - Admin sets discount percentage (0-100%)
  - Shop page shows discount badges ("20% OFF")
  - Strikethrough original price with discounted price
  - "Save ₹X" display
- [x] Admin Navigation
  - Admin dropdown in navbar (Orders, Products)
  - Mobile menu with admin section

### APIs Implemented
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Active products with stock > 0 |
| `/api/admin/products` | GET | All products (including inactive) |
| `/api/admin/products` | POST | Create new product |
| `/api/admin/products/[id]` | GET | Single product details |
| `/api/admin/products/[id]` | PATCH | Update product |
| `/api/admin/products/[id]` | DELETE | Soft/hard delete |
| `/api/orders` | POST | Create order + Razorpay payment |
| `/api/orders/list` | GET | User orders |
| `/api/payments/verify` | POST | Verify Razorpay payment |
| `/api/admin/orders` | GET | All orders |
| `/api/admin/orders/[id]` | GET | Single order |
| `/api/admin/orders/[id]` | PATCH | Update order status |

## Testing Status
- Iteration 1: Orders API - 15/15 passed
- Iteration 2: Admin Products API - 22/22 passed
- Test files: `/app/tests/`

## Backlog / Future Tasks

### P1 - High Priority
- [ ] User authentication (JWT or OAuth)
- [ ] Role-based access control (Admin vs User)

### P2 - Medium Priority
- [ ] Email notifications on order status change
- [ ] Product categories/tags
- [ ] Search and filter products

### P3 - Low Priority
- [ ] Dashboard analytics
- [ ] Coupons and promotions (beyond simple discounts)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality

## Test Credentials
**Razorpay Test Cards:**
- Success: `4111 1111 1111 1111` (any future expiry, any CVV)
- Failure: `4000 0000 0000 0002`

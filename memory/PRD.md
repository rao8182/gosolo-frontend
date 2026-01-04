# GoSolo E-commerce Platform - PRD

## Original Problem Statement
Build a full-stack e-commerce web application called "GoSolo" with:
- Product catalog and shopping cart
- Razorpay payment integration (test mode)
- Order management for users and admins
- Stock management with automatic deduction on purchase

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (client-side cart)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Payments**: Razorpay (Test Mode)
- **Deployment**: Vercel

## Database Schema
- `Product`: { id, name, description, price, imageUrl, stock }
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
  - Order list with status badges
  - Item count and total amount display
  - Date formatting
  - Empty state handling
- [x] Order Detail page (`/orders/[id]`)
  - Order progress tracker
  - Order information section
  - Items list with product images
  - Payment details
  - Help section with contact support link
- [x] Admin Orders page (`/admin/orders`)
  - Status filter cards with counts
  - Orders table with all details
  - Status update dropdown with transition validation
  - Success/error message handling
  - Status flow legend
- [x] Navigation updates
  - "My Orders" link in navbar (desktop & mobile)

### APIs Implemented
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List all products |
| `/api/orders` | POST | Create order + Razorpay payment |
| `/api/orders/list` | GET | User orders with payment & item count |
| `/api/payments/verify` | POST | Verify Razorpay payment, update status |
| `/api/admin/orders` | GET | All orders with items & payment details |
| `/api/admin/orders/[id]` | GET | Single order full details |
| `/api/admin/orders/[id]` | PATCH | Update order status (with validation) |

### Status Transition Rules
```
PENDING → PAID, CANCELLED
PAID → SHIPPED, CANCELLED
SHIPPED → DELIVERED
DELIVERED → (no changes allowed)
CANCELLED → (no changes allowed)
```

## Testing Status
- Backend API Tests: 15/15 passed
- Frontend UI Tests: All passed
- Test files: `/app/tests/test_orders_api.py`

## Backlog / Future Tasks

### P1 - High Priority
- [ ] User authentication (JWT or OAuth)
- [ ] Role-based access control (Admin vs User)

### P2 - Medium Priority
- [ ] Edge case handling improvements
- [ ] Final code cleanup (remove console.logs)
- [ ] Email notifications on order status change

### P3 - Low Priority
- [ ] Dashboard analytics
- [ ] Coupons and promotions
- [ ] Product reviews and ratings
- [ ] Wishlist functionality

## Environment Configuration
Required environment variables:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `RAZORPAY_KEY_ID` - Razorpay test key
- `RAZORPAY_KEY_SECRET` - Razorpay test secret
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Public Razorpay key for frontend

## Test Credentials
**Razorpay Test Cards:**
- Success: `4111 1111 1111 1111` (any future expiry, any CVV)
- Failure: `4000 0000 0000 0002`

## File Structure
```
/app
├── app/
│   ├── orders/
│   │   ├── page.tsx (User orders list)
│   │   └── [id]/page.tsx (Order detail)
│   ├── admin/orders/
│   │   └── page.tsx (Admin order management)
│   ├── api/
│   │   ├── orders/
│   │   │   ├── route.ts (Create order)
│   │   │   └── list/route.ts (List user orders)
│   │   ├── admin/orders/
│   │   │   ├── route.ts (List all orders)
│   │   │   └── [id]/route.ts (Get/Update order)
│   │   ├── payments/verify/route.ts
│   │   └── products/route.ts
├── components/Navbar.tsx
├── prisma/schema.prisma
├── tests/test_orders_api.py
└── test_reports/iteration_1.json
```

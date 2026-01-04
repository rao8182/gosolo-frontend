# GoSolo E-Commerce Platform

A modern Next.js e-commerce application for selling premium gummy supplements with integrated Razorpay payment processing.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Supabase - External)
- **ORM:** Prisma
- **Payment:** Razorpay (Test Mode)
- **State Management:** Zustand
- **Styling:** Tailwind CSS 4

## ⚠️ IMPORTANT: Database Configuration

**This application uses EXTERNAL PostgreSQL (Supabase), NOT Emergent's managed MongoDB.**

The app was built with PostgreSQL/Prisma and requires the external Supabase connection to function.

## 🔐 Required Environment Variables

```env
DATABASE_URL=postgresql://postgres.smgjcwybeijnhxlbpdzd:TZMbExYBq5a01SjO@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
RAZORPAY_KEY_ID=rzp_test_RzWT68NDWaooal
RAZORPAY_KEY_SECRET=P2OoZuaruB3PXsP5HfVE9olO
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RzWT68NDWaooal
```

## 🚀 Deployment to Emergent

1. Add all environment variables in deployment dashboard
2. Ensure Supabase database is accessible from deployment environment
3. Deploy - the app will use external PostgreSQL

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

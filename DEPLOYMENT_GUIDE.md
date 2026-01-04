# GoSolo Deployment Guide

## ✅ Deployment Readiness Checklist

### Fixed Issues:
1. ✅ **Database**: Migrated to Supabase PostgreSQL (production-ready)
2. ✅ **Hardcoded Keys**: Razorpay key moved to environment variable
3. ✅ **Environment Variables**: Properly configured in `.env` file
4. ✅ **Database Migrations**: All migrations applied to Supabase
5. ✅ **Database Seeding**: 4 products seeded in production database

---

## 🔐 Environment Variables Required for Deployment

Add these to your Emergent deployment secrets:

```
DATABASE_URL=postgresql://postgres.smgjcwybeijnhxlbpdzd:TZMbExYBq5a01SjO@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

RAZORPAY_KEY_ID=rzp_test_RzWT68NDWaooal
RAZORPAY_KEY_SECRET=P2OoZuaruB3PXsP5HfVE9olO

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RzWT68NDWaooal
```

---

## 📋 Pre-Deployment Steps

1. **Verify Local Build Works**:
   ```bash
   cd /app
   yarn build
   ```

2. **Verify Database Connection**:
   - All migrations applied ✅
   - 4 products seeded ✅
   - Supabase connection working ✅

3. **Test Critical Flows**:
   - Browse products ✅
   - Add to cart ✅
   - Checkout process ✅
   - Razorpay integration (test mode) ✅

---

## 🚀 Deployment Steps

### Step 1: Prepare for Deployment
- Ensure all changes are committed to Git
- Verify `.env` is in `.gitignore` (✅ Done)
- `.env.example` is committed for reference (✅ Done)

### Step 2: Configure Secrets in Emergent
Go to your Emergent dashboard and add these environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres.smgjcwybeijnhxlbpdzd:TZMbExYBq5a01SjO@aws-1-ap-south-1.pooler.supabase.com:5432/postgres` |
| `RAZORPAY_KEY_ID` | `rzp_test_RzWT68NDWaooal` |
| `RAZORPAY_KEY_SECRET` | `P2OoZuaruB3PXsP5HfVE9olO` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_RzWT68NDWaooal` |

### Step 3: Deploy
1. Click **Deploy** button in Emergent
2. Wait for build to complete (~10-15 minutes)
3. Receive your production URL

### Step 4: Post-Deployment Testing
Test the following on your live URL:

1. **Products Page**: Verify all 4 products load
2. **Product Details**: Click on a product
3. **Add to Cart**: Add multiple products
4. **Cart Page**: Verify items and quantities
5. **Checkout**: Fill delivery details
6. **Payment**: Use Razorpay test card:
   - Card: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits
7. **Order Confirmation**: Verify redirect to success page
8. **Orders Page**: Check order appears
9. **Admin Panel**: Go to `/admin/orders` and verify

---

## 🧪 Test Cards for Production Testing

Even though you're in production, you're using Razorpay TEST mode:

**Success Card:**
```
Card Number: 4111 1111 1111 1111
Expiry Date: 12/25
CVV: 123
```

**Other Test Cards:**
- Insufficient funds: `4000 0000 0000 9995`
- Card declined: `4000 0000 0000 0002`

---

## ⚠️ Important Notes

### Database
- ✅ Using **Supabase PostgreSQL** (external, production-ready)
- ✅ Connection pooling enabled for better performance
- ✅ Migrations applied and schema is up to date
- ✅ Data is persistent (won't be lost on redeployment)

### Razorpay
- 🧪 Currently in **TEST MODE**
- No real money will be charged
- Switch to live keys when ready for production

### Security
- ✅ `.env` file in `.gitignore`
- ✅ Secrets managed through Emergent dashboard
- ✅ No hardcoded credentials in code

---

## 🔄 Updating After Deployment

To push updates:
1. Make your code changes locally
2. Test locally
3. Commit to Git
4. Click **Redeploy** in Emergent (no extra cost)

---

## 🐛 Troubleshooting

### If deployment fails:

**Check logs for:**
- Build errors (usually dependency issues)
- Database connection errors (verify DATABASE_URL)
- Missing environment variables

**Common fixes:**
- Ensure all env variables are set in Emergent dashboard
- Verify Supabase connection string is correct
- Check that `NEXT_PUBLIC_` prefix is used for client-side variables

### If app loads but features don't work:

1. **Products not showing**: Check DATABASE_URL is correct
2. **Payment not working**: Verify NEXT_PUBLIC_RAZORPAY_KEY_ID is set
3. **Orders not saving**: Check database connection and migrations

---

## 📊 Monitoring

After deployment, monitor:
- Response times
- Error rates in logs
- Database query performance
- Payment success rates

---

## 🎯 Next Steps After Successful Deployment

1. Test thoroughly on production URL
2. Share with team/stakeholders
3. When ready for real customers:
   - Switch Razorpay to live mode
   - Update keys in Emergent secrets
   - Test with small real transaction
4. Consider adding:
   - Email notifications
   - User authentication
   - Analytics tracking
   - Error monitoring (Sentry)

---

## ✅ Deployment Status: READY

All blockers resolved. You can now deploy to production! 🚀

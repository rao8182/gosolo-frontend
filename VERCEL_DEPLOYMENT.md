# Vercel Deployment Guide - GoSolo

## ✅ Current Deployment Status

**Live URL:** https://gosolo-topaz.vercel.app

---

## 🔧 Recent Fixes Applied

### 1. **Prisma Client Generation**
- ✅ Updated `package.json` to include `prisma generate` in build script
- ✅ Added `postinstall` script for automatic Prisma client generation

### 2. **Improved Error Handling**
- ✅ Orders API now returns detailed error messages for debugging
- ✅ Better error logging for troubleshooting

### 3. **Metadata Updates**
- ✅ Updated app title to "GoSolo - Premium Gummy Supplements"
- ✅ Proper SEO description

---

## 🔐 Environment Variables Required on Vercel

Make sure these are set in **Settings → Environment Variables**:

```env
DATABASE_URL=postgresql://postgres.smgjcwybeijnhxlbpdzd:TZMbExYBq5a01SjO@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

RAZORPAY_KEY_ID=rzp_test_RzWT68NDWaooal
RAZORPAY_KEY_SECRET=P2OoZuaruB3PXsP5HfVE9olO

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RzWT68NDWaooal
```

**Important:** Set each variable for all three environments:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🚀 How to Redeploy After Changes

### Option 1: Push to Git
```bash
git add .
git commit -m "Fix: Add Prisma generate to build"
git push
```
Vercel will automatically redeploy.

### Option 2: Manual Redeploy
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Deployments** tab
4. Click the three dots on latest deployment
5. Click **Redeploy**

---

## 🧪 Testing After Deployment

### 1. Test Products Page
Visit: `https://gosolo-topaz.vercel.app/shop`
- ✅ Should show 4 products
- ✅ Each product should be clickable

### 2. Test Cart Icon
- ✅ Should be visible in navbar (shopping cart icon)
- ✅ Shows item count badge when items added
- ✅ Clicking redirects to `/cart`

### 3. Test Add to Cart
- ✅ Click "Add to cart" on any product
- ✅ Alert shows confirmation
- ✅ Cart badge updates with quantity

### 4. Test Checkout Flow
- ✅ Add items to cart
- ✅ Go to cart page
- ✅ Click "Proceed to Checkout"
- ✅ Fill delivery details
- ✅ Click "Place Order"
- ✅ Razorpay modal should open

### 5. Test Payment
Use Razorpay test card:
- Card: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `123`
- ✅ Payment should complete
- ✅ Redirect to order success page

---

## 🐛 Troubleshooting

### Issue: "Order creation failed"

**Check:**
1. Are all 4 environment variables set on Vercel?
2. Is DATABASE_URL correct and accessible from Vercel?
3. Is Razorpay key valid?

**Debug:**
1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Find `/api/orders` function
4. Check **Logs** for detailed error messages

### Issue: Cart icon not visible

**Possible causes:**
1. Material Icons not loading (check browser console)
2. CSS not applied properly
3. JavaScript not executing

**Fix:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check browser console for errors

### Issue: Products not loading

**Check:**
1. DATABASE_URL is set on Vercel
2. Supabase database is accessible
3. Prisma migrations are applied to Supabase

**Fix:**
Run migrations on Supabase:
```bash
cd /app
DATABASE_URL="your_supabase_url" yarn prisma migrate deploy
```

---

## 📊 Vercel Function Logs

To see detailed API errors:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Deployments** → Latest deployment
4. Click **View Function Logs**
5. Filter by function (e.g., `/api/orders`)
6. Check for error messages

---

## 🔄 Common Deployment Issues

### Build Fails
- **Cause:** Dependencies not installed
- **Fix:** Check `package.json` has all dependencies

### API Routes 500 Error
- **Cause:** Environment variables missing or Prisma client not generated
- **Fix:** 
  1. Verify all env vars are set
  2. Ensure build script has `prisma generate`

### Database Connection Error
- **Cause:** DATABASE_URL incorrect or Supabase not accessible
- **Fix:** Verify Supabase URL and check network access

---

## ✅ Deployment Checklist

Before each deployment:
- [ ] All environment variables set on Vercel
- [ ] `package.json` includes `prisma generate` in build
- [ ] Changes committed to Git
- [ ] Supabase database accessible
- [ ] Razorpay keys are valid

After deployment:
- [ ] Visit `/shop` - products load
- [ ] Cart icon visible in navbar
- [ ] Add to cart works
- [ ] Checkout flow works
- [ ] Payment test completes

---

## 📞 Support

If issues persist:
1. Check Vercel function logs
2. Check browser console for errors
3. Verify all environment variables
4. Ensure Supabase is accessible from Vercel's network

---

**Deployment Platform:** Vercel  
**Database:** Supabase PostgreSQL  
**Payment:** Razorpay (Test Mode)  

All set! 🚀

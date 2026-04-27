# Stripe Payment Integration Setup Guide

## Overview
This guide explains how to set up Stripe test keys for the payment integration.

## Prerequisites
- Stripe account (create free at https://dashboard.stripe.com/register)
- Node.js and npm installed
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`

## Step 1: Get Your Stripe Test Keys

### Login to Stripe Dashboard
1. Go to https://dashboard.stripe.com
2. Sign in with your Stripe account

### Locate API Keys
1. In the left sidebar, click **Developers**
2. Select **API Keys** from the submenu
3. Make sure you're viewing **Test Mode** (toggle in top right)

### Find Your Keys
You'll see two keys:

**Publishable Key:**
- Format: `pk_test_xxxxxxxxx...`
- Used on frontend (safe to expose)
- You need this for `STRIPE_API_KEY`

**Secret Key:**
- Format: `sk_test_xxxxxxxxx...`
- Used on backend (KEEP SECRET!)
- You need this for `STRIPE_SECRET_KEY`

⚠️ **IMPORTANT:** 
- **Never** put the Secret Key on frontend
- **Never** commit real keys to git
- Use `.env` files with `.gitignore` protection

## Step 2: Configure Backend (.env)

### Open File
`backend/config/.env`

### Update Keys
Replace the placeholders with your actual Stripe test keys:

```
# Before (WRONG - has placeholders):
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_API_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE



## Step 3: Restart Your Application

### Backend
If the backend is running:
1. Stop it: Press `Ctrl+C` in terminal
2. Start again: `npm start`

### Frontend  
If the frontend is running:
1. Stop it: Press `Ctrl+C` in terminal
2. Start again: `npm run dev`

The app will now pick up the new Stripe keys.

## Step 4: Test the Payment Integration

### Access Checkout
1. Go to http://localhost:3000
2. Add items to cart
3. Proceed to checkout
4. You should now see the payment form without errors

### Use Test Card Numbers

Stripe provides test card numbers for different scenarios:

**Successful Payment:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
Name: Any name
```

**Card Declined:**
```
Card Number: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

**Requires Authentication (3D Secure):**
```
Card Number: 4000 0025 0000 3155
Expiry: Any future date
CVC: Any 3 digits
```

### Complete a Test Payment
1. Fill in shipping address
2. Click "Continue to Payment"
3. Select "Pay with Debit/credit card"
4. Enter cardholder name
5. Enter test card number: `4242 4242 4242 4242`
6. Enter expiry: Any future date (e.g., 12/25)
7. Enter CVC: Any 3 digits (e.g., 123)
8. Click "Pay Now"

You should see:
- ✅ Order confirmation page
- ✅ No "Elements context" errors
- ✅ No "Invalid API Key" errors

## Troubleshooting

### Error: "Could not find Elements context"
**Cause:** Stripe API key is missing or invalid  
**Solution:** 
1. Check `.env` has your actual `STRIPE_API_KEY`
2. Verify it starts with `pk_test_`
3. Restart frontend after changing `.env`

### Error: "Invalid API Key provided: sk_test_*"
**Cause:** Backend is using placeholder or wrong secret key  
**Solution:**
1. Check `backend/config/.env` for `STRIPE_SECRET_KEY`
2. Verify it's your actual secret key starting with `sk_test_`
3. It should NOT be a placeholder like `sk_test_YOUR_SECRET_KEY_HERE`
4. Restart backend: `npm start`

### Error: "Payment system unavailable"
**Cause:** Either:
1. Backend `/payment/stripeapikey` endpoint returning error
2. Stripe keys not configured
3. Network issue

**Solution:**
1. Check browser console for detailed error
2. Verify backend is running on `http://localhost:8000`
3. Check `.env` has valid keys
4. Check backend logs for errors

### Error: "Failed to load resource: 400 (Bad Request)"
**Cause:** Payment endpoint receiving bad request  
**Solution:**
1. Check amount is being calculated correctly
2. Amount must be in cents (e.g., 5000 = $50.00)
3. Check CheckoutPage is sending correct data

### Card not working
**Cause:** Using production card numbers or invalid test card  
**Solution:**
1. Use test cards from list above
2. Use correct expiry (any future date)
3. Use any 3-digit CVC
4. No real cards on test mode!

## API Endpoints

### Get Stripe API Key (Frontend)
```
GET /api/v2/payment/stripeapikey
Response: { stripeApiKey: "pk_test_..." }
```

### Process Payment
```
POST /api/v2/payment/process
Body: { amount: 5000 }  // in cents
Response: { client_secret: "pi_...", payment_intent_id: "pi_..." }
```

## Environment Variables Explained

```
# Backend (backend/config/.env)

STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
- Secret key for server-side Stripe operations
- KEEP THIS PRIVATE - Never expose to frontend
- Authenticate all backend payment requests with this key

STRIPE_API_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
- Publishable key for client-side Stripe operations
- Safe to expose on frontend
- Used by StripeProvider to initialize Stripe.js
```

## Common Mistakes

### ❌ Using production keys in test
- Production keys start with `pk_live_` or `sk_live_`
- Test mode starts with `pk_test_` or `sk_test_`
- Always use `pk_test_` and `sk_test_` for development

### ❌ Putting secret key on frontend
- Secret key must ONLY be on backend
- Never commit to git
- Never expose in frontend code

### ❌ Using real card numbers
- Stripe test mode only accepts test card numbers
- Real cards will fail
- Use test cards from the list above

### ❌ Forgetting to restart after .env changes
- Changes to `.env` require server restart
- Kill process and restart `npm start`

## Going Live (Production)

When moving to production:

1. **Switch to Live Mode** in Stripe Dashboard
2. **Get Live Keys:**
   - Live Secret Key: `sk_live_xxx`
   - Live Publishable Key: `pk_live_xxx`

3. **Update Production .env:**
   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_API_KEY=pk_live_xxx
   ```

4. **Test with real payments** before going live
5. **Implement proper error handling** for production
6. **Enable HTTPS** (required for live Stripe.js)
7. **PCI Compliance** - Never handle raw card data

## Support

- Stripe Docs: https://stripe.com/docs
- API Reference: https://stripe.com/docs/api
- Testing Guide: https://stripe.com/docs/testing

## Checklist

- [ ] Created Stripe account
- [ ] Found API Keys in Stripe Dashboard
- [ ] Updated `backend/config/.env` with actual keys
- [ ] Restarted backend
- [ ] Restarted frontend
- [ ] Tested with card `4242 4242 4242 4242`
- [ ] See order confirmation without errors
- [ ] No "Elements context" errors
- [ ] No "Invalid API Key" errors

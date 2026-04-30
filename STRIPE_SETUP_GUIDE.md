# 💳 Stripe Payment Integration Setup

## 📌 Overview
This project integrates Stripe (test mode) for handling payments.  
Follow the steps below to configure and test it locally.

---

## ⚙️ Prerequisites
- Node.js and npm installed  
- Backend running on `http://localhost:8000`  
- Frontend running on `http://localhost:3000`  
- Stripe account → https://dashboard.stripe.com/register  

---

## 🔑 Step 1: Get API Keys
1. Login to Stripe Dashboard  
2. Enable **Test Mode**  
3. Go to **Developers → API Keys**  

Copy:
- Publishable Key → `pk_test_...`  
- Secret Key → `sk_test_...`  

---

## 🛠️ Step 2: Configure `.env`

backend/config/.env


Add:

STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_API_KEY=pk_test_your_publishable_key


---

## 🔄 Step 3: Restart Servers

Restart both backend and frontend:


npm start


---

## 🧪 Step 4: Test Payment

Use Stripe test card:


Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits


Expected result:
- Payment succeeds  
- Order is created  
- No Stripe errors  

---

## 📡 API Endpoints

**Get Stripe Key**

GET /api/v2/payment/stripeapikey


**Process Payment**

POST /api/v2/payment/process
Body: { "amount": 5000 }


---

## ⚠️ Important Notes
- Never expose `STRIPE_SECRET_KEY` in frontend  
- Never commit `.env` to Git  
- Always use test keys in development  
- Restart server after changing `.env`  

---

## 🚀 Production
- Replace with live keys:
  - `sk_live_...`
  - `pk_live_...`
- Enable HTTPS  
- Test with real payments  

---

## ✅ Checklist
- [ ] Stripe account created  
- [ ] API keys added  
- [ ] Backend restarted  
- [ ] Frontend restarted  
- [ ] Payment tested successfully  
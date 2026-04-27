# Multi-Shop Ordering System Guide

## Overview
When a customer orders items from different shops in a single checkout, the system automatically splits the order into multiple shop orders. Each shop processes their items independently while the customer receives a unified order number.

## Scenario Example
**Customer adds to cart:**
- Product A from Shop 1 (₨2,000)
- Product B from Shop 2 (₨3,000)
- Product C from Shop 1 (₨1,500)

**Result:** Single order with 2 shop orders
- Shop Order 1: Products A, C (₨3,500)
- Shop Order 2: Product B (₨3,000)
- **Total: ₨6,500**

## Database Schema

### Order Model
```javascript
{
  user: ObjectId,           // Customer
  cart: Array,              // All cart items
  shippingAddress: Object,  // Single address for all shops
  totalPrice: Number,       // Total for all shops combined
  paymentMethod: String,    // "card", "paypal", "cod"
  paymentStatus: String,    // "pending", "completed", "failed", "cancelled"
  orderStatus: String,      // Overall order status
  paymentInfo: Object,      // Stripe/payment details
  paidAt: Date,            // Payment completion time
  
  // Multi-shop tracking
  shopOrders: [
    {
      shopId: ObjectId,
      shopName: String,
      items: Array,         // Items from this shop
      subTotal: Number,
      status: String,       // "pending", "processing", "shipped", "delivered"
      shippedAt: Date,
      deliveredAt: Date,
    },
    // ... more shops
  ],
  
  timestamps: { createdAt, updatedAt }
}
```

## Order Processing Flow

### 1. **Checkout (Frontend)**
```
User adds items from multiple shops → 
Proceeds to checkout → 
Selects payment method → 
Pays once for all items → 
Order created
```

### 2. **Order Creation (Backend)**
```
POST /api/v2/order/create-order
├─ Validate cart items
├─ Group items by shop (shopOrders array)
├─ Create single Order document
├─ Store all shop orders in array
└─ Return order with shopOrders breakdown
```

**Request Body:**
```json
{
  "cart": [
    {
      "id": "prod1",
      "name": "Product A",
      "price": 2000,
      "qty": 1,
      "shopId": "shop1",
      "shopName": "Shop 1"
    },
    {
      "id": "prod2",
      "name": "Product B",
      "price": 3000,
      "qty": 1,
      "shopId": "shop2",
      "shopName": "Shop 2"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Karachi",
    "country": "Pakistan",
    "zipCode": "75500"
  },
  "totalPrice": 5000,
  "paymentMethod": "card",
  "paymentInfo": {
    "status": "succeeded",
    "type": "card",
    "stripePaymentIntentId": "pi_..."
  }
}
```

### 3. **Order Status Management**

#### Overall Order Status
- **pending**: Payment not completed or any shop order is pending
- **processing**: Payment completed, shops are preparing items
- **shipped**: All shop orders are shipped
- **delivered**: All shop orders are delivered
- **cancelled**: Order or all shop orders cancelled

#### Individual Shop Order Status
- **pending**: Shop received order, not yet processing
- **processing**: Shop is picking/packing items
- **shipped**: Shop shipped their items
- **delivered**: Customer received items from this shop

#### Status Progression
```
Single Shop Order:
pending → processing → shipped → delivered

Multi-Shop Order:
Order pending (if any shop pending) →
Order processing (all shops started) →
Order shipped (all shops shipped) →
Order delivered (all shops delivered)
```

## API Endpoints

### Create Order
**POST** `/api/v2/order/create-order`
- Creates order with automatic shop grouping
- Returns order with shopOrders array

### Get User Orders
**GET** `/api/v2/order/user-orders`
- Returns all orders for user
- Includes shopOrders breakdown

### Get Single Order
**GET** `/api/v2/order/:id`
- Returns complete order details
- Includes all shop orders and status

### Get Shop Orders Breakdown
**GET** `/api/v2/order/:id/shop-orders`
- Returns only the shopOrders array
- Useful for viewing order split details

### Update Order Status
**PUT** `/api/v2/order/:id/status`
- Update overall order status
- Body: `{ orderStatus?, paymentStatus? }`

### Update Individual Shop Order Status
**PUT** `/api/v2/order/:id/shop-order/:shopOrderId/status`
- Update specific shop's order status
- Body: `{ status?, shippedAt?, deliveredAt? }`
- Automatically updates main order if all shops delivered

## Frontend Components

### MultiShopOrderBreakdown
Display order breakdown with shop-wise items and status.

```jsx
<MultiShopOrderBreakdown 
  shopOrders={order.shopOrders}
  shippingAddress={order.shippingAddress}
/>
```

Features:
- Shows each shop's items and subtotal
- Displays individual shop order status
- Shows shipping address
- Visual indicators for order stages

### Order Utilities
```javascript
import {
  groupItemsByShop,
  calculateOrderTotals,
  formatOrderStatus,
  isMultiShopOrder,
  getOrderProgress,
  formatOrderDate,
} from '@/utils/orderUtils';

// Check if multi-shop
const isMulti = isMultiShopOrder(order.shopOrders);

// Get progress
const progress = getOrderProgress(order.shopOrders);
// Returns: { completed: 1, total: 2, percentage: 50 }
```

## Key Features

### 1. **Single Payment**
- Customer pays once for all items
- Payment covers all shops
- On success, all shop orders created at once

### 2. **Unified Shipping Address**
- One address for all shops
- All items shipped to same location
- Shops use same address data

### 3. **Separate Tracking**
- Each shop's items tracked separately
- Different delivery timelines possible
- Independent shop order status

### 4. **Flexible Status Updates**
- Shops update their order status independently
- Main order status reflects overall progress
- Automatic status promotion when all shops complete

### 5. **Independent Processing**
- Each shop processes items independently
- No coordination between shops needed
- Shops can ship at different times

## Example Flow: 3 Items from 3 Shops

```
CHECKOUT
├─ Item 1 (₨1000) from Shop A
├─ Item 2 (₨2000) from Shop B
└─ Item 3 (₨1500) from Shop C
│
└─→ PAYMENT
    └─ Customer pays ₨4500 total
    
└─→ ORDER CREATED
    ├─ Order ID: #12345
    ├─ Total: ₨4500
    └─ shopOrders: [
        {
          shopId: A,
          items: [Item 1],
          subTotal: ₨1000,
          status: "pending"
        },
        {
          shopId: B,
          items: [Item 2],
          subTotal: ₨2000,
          status: "pending"
        },
        {
          shopId: C,
          items: [Item 3],
          subTotal: ₨1500,
          status: "pending"
        }
      ]

PROCESSING
├─ Shop A: processing (Item 1)
├─ Shop B: shipped (Item 2) ✓
└─ Shop C: processing (Item 3)
│
└─→ Order Status: "processing" (not all shipped)

FULFILLMENT
├─ Shop A: delivered ✓
├─ Shop B: delivered ✓
└─ Shop C: delivered ✓
│
└─→ Order Status: "delivered" ✓

CUSTOMER RECEIVES
└─ 3 separate shipments from 3 shops
```

## Seller Dashboard

### View Orders They Need to Fulfill
```javascript
// Get orders for a specific shop
GET /api/v2/seller/:shopId/orders
// Returns orders with only their shopOrder item
```

### Update Order Status
```javascript
// Shop updates their order status
PUT /api/v2/order/:orderId/shop-order/:shopOrderId/status
Body: { status: "shipped", shippedAt: Date.now() }
```

## Notifications & Communication

### Customer Notifications
- ✉️ Order confirmation with all shop details
- 📦 Separate notifications when each shop ships
- 🚚 Tracking links for each shipment
- ✓ Delivered notifications for each shop

### Seller Notifications
- New order notification showing:
  - Customer name and address
  - Their shop's items and qty
  - Subtotal for their items
- Status change notifications when customer marked as received

## Handling Edge Cases

### What if one shop's items run out?
- Payment already received
- Customer receives items from other shops
- Refund or credit for unavailable shop's items

### What if a shop goes offline?
- Order remains valid
- Customer contacts support
- Refund initiated if needed
- Order marked as "partially failed"

### What if customer returns items?
- Each shop handles returns separately
- Partial refunds supported
- Track return per shop order

## Future Enhancements

- [ ] Partial payment support per shop
- [ ] Shop-specific shipping rates
- [ ] Group shipments from same area
- [ ] Estimated delivery date per shop
- [ ] Chat with individual shops
- [ ] Rate shops separately
- [ ] Seller dashboard for order management

## Testing

### Test Scenario 1: Single Shop Order
- Add 2 items from same shop
- Verify: 1 shop order created

### Test Scenario 2: Two Shops
- Add 1 item from Shop A
- Add 1 item from Shop B
- Verify: 2 shop orders created
- Verify: Items grouped correctly

### Test Scenario 3: Three Shops
- Add items from 3 different shops
- Complete payment
- Verify: 3 shop orders created
- Verify: Status tracking works

## Code Examples

### Creating Order (Frontend)
```javascript
const orderData = {
  cart: cartItems, // Full cart with shopId/shopName
  shippingAddress: { ... },
  totalPrice: 5000,
  paymentMethod: "card",
  paymentInfo: {
    status: "succeeded",
    stripePaymentIntentId: "pi_..."
  }
};

const result = await dispatch(createOrder(orderData));
```

### Fetching Order with Shop Details
```javascript
const order = await getOrderDetails(orderId);

console.log(order.shopOrders);
// [
//   { shopId, shopName, items, subTotal, status, ... },
//   { shopId, shopName, items, subTotal, status, ... }
// ]
```

### Updating Shop Order Status
```javascript
await axios.put(
  `/api/v2/order/${orderId}/shop-order/${shopOrderId}/status`,
  { status: "shipped", shippedAt: new Date() },
  { withCredentials: true }
);
```

## Important Notes

1. **All items ship to same address** - No option for split addresses in single order
2. **Single payment** - One payment covers all shops
3. **Independent processing** - Shops don't coordinate with each other
4. **Unified refunds** - Refunds handled per shop order
5. **Customer communication** - Gets updates from each shop separately

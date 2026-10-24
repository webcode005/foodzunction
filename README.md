# FoodZunction - Premium Fresh Halal Meat & Seafood Platform

FoodZunction is a modern, responsive, high-performance e-commerce platform for farm-fresh chicken, tender goat & mutton, coastal fresh catch, and chef-crafted marinades with 90-minute chilled delivery.

---

## 🚀 Key Features

1. **High-Impact Hero Slider & Visual Catalog:**
   - 3-slide auto-rotating banner inspired by FoodZunction's brand aesthetic (`#C41E24` crimson red, `#1B5E20` emerald green).
   - Category navigation: Tender Chicken, Tender Mutton, Fresh Seafood, and Ready-to-Cook & Combos.
   - Live Pincode delivery eligibility checker (560001, 560034, 560038, 560043, 560068, 560100, 560102, 560103, 110001, 400001).

2. **Customer Registration, Authentication & "My Account" Portal:**
   - Instant customer signup with email, password, full name, phone, and delivery address.
   - Dedicated **My Account** tab:
     - **Profile & Saved Addresses**
     - **Order History with Live Cold-Chain Tracker** (showing dispatch temperatures like 2.4°C, ice gel-pack status, and butcher cut notes)
     - **Quality Issue Helpdesk** (report temperature, freshness, incorrect cut, or delivery issues directly with photo attachment & claim refunds/replacements)

3. **Super Admin Dashboard (WordPress / E-Commerce Style):**
   - Access from header "Admin" button or `/admin`
   - **Credentials:**
     - **Email:** `admin@foodzunction.com`
     - **Password:** `FoodZunction@2026`
   - Real-time management across 5 panels:
     - **Store Overview:** Gross revenue, total orders, active cold-chain fleet status, open quality issues.
     - **Orders Manager:** Live status updates (`Placed` ➔ `Butcher Processing` ➔ `Chilled Dispatch` ➔ `Out for Delivery` ➔ `Delivered`), delivery slot tracking, customer contact.
     - **Product & Inventory Manager:** Add new products, update prices, manage stock quantities, toggle custom cuts (Curry cut, Biryani cut, Boneless, Keema).
     - **Customer Accounts:** Manage customer directory, total spend, phone numbers, and address book.
     - **Quality Issues Helpdesk:** Review customer complaints, approve refunds, or dispatch fresh replacements.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons
- **State Management & Mock Persistence:** LocalStorage synced data layer with preloaded seed data
- **Testing:** Node.js native test runner (`tsx --test src/utils/*.test.ts`) with 11 automated test assertions

---

## 📦 How to Push Code to GitHub

All files have been committed to the local `main` branch with remote:
```bash
https://github.com/webcode005/foodzunction.git
```

GitHub requires personal token authentication (PAT) for HTTPS push.

### Step 1: Create a Personal Access Token (PAT)
1. Go to [GitHub Settings ➔ Developer Settings ➔ Personal Access Tokens ➔ Tokens (classic)](https://github.com/settings/tokens).
2. Click **Generate new token (classic)**.
3. Name it `FoodZunction Deployment` and check the **`repo`** permission scope.
4. Click **Generate token** and copy your token (e.g. `ghp_xxxx...`).

### Step 2: Push Using Your Token
Run in your terminal:
```bash
git push https://<YOUR_GITHUB_TOKEN>@github.com/webcode005/foodzunction.git main
```

Or configure credential helper:
```bash
git remote set-url origin https://webcode005:<YOUR_GITHUB_TOKEN>@github.com/webcode005/foodzunction.git
git push -u origin main
```

---

## 🗄️ Database Integration Guide

FoodZunction is designed with modular data structures (`src/types/store.ts` and `src/types/auth.ts`) making it straightforward to connect to any persistent database.

### Recommended Schema Design

#### 1. `users` Table / Collection
| Field | Type | Description |
|---|---|---|
| `id` | String / UUID | Primary Key |
| `email` | String | Unique user email |
| `password_hash` | String | Salted bcrypt hash |
| `name` | String | Customer full name |
| `phone` | String | 10-digit mobile number |
| `role` | String | `'customer'` or `'superadmin'` |
| `saved_addresses` | JSON / Array | Array of delivery locations |
| `created_at` | Timestamp | Registration timestamp |

#### 2. `products` Table / Collection
| Field | Type | Description |
|---|---|---|
| `id` | String / UUID | Primary Key |
| `title` | String | Product name (e.g., Farm Fresh Tender Chicken Curry Cut) |
| `category` | String | `'chicken'`, `'mutton'`, `'fish'`, `'ready-to-cook'` |
| `price` | Number | Current selling price in INR |
| `original_price` | Number | MRP before discount |
| `unit` | String | `'500g'`, `'1kg'`, etc. |
| `stock_kg` | Number | Available inventory in kilograms |
| `in_stock` | Boolean | Inventory availability flag |
| `custom_cuts` | JSON / Array | e.g. `['Skinless', 'Bone-in', 'Keema / Mince']` |
| `image_url` | String | Product photo URL |

#### 3. `orders` Table / Collection
| Field | Type | Description |
|---|---|---|
| `id` | String / UUID | e.g. `ORD-8492` |
| `customer_id` | String / UUID | Foreign key referencing `users.id` |
| `customer_name` | String | Name for delivery |
| `customer_email` | String | Notification email |
| `customer_phone` | String | Phone for delivery rider |
| `items` | JSON / Array | Order line items with cut choices & quantities |
| `subtotal` | Number | Sum of items |
| `delivery_fee` | Number | Delivery charges (free over ₹499) |
| `grand_total` | Number | Final bill |
| `payment_method` | String | `'cod'` or `'online'` (UPI, Cards) |
| `order_status` | String | `'placed'`, `'butcher_processing'`, `'chilled_dispatch'`, `'out_for_delivery'`, `'delivered'`, `'cancelled'` |
| `cold_chain_temp` | Number | Delivery chilled sensor reading (e.g. 2.4°C) |
| `delivery_slot` | String | e.g. `'Today, 4:00 PM - 5:30 PM'` |
| `created_at` | Timestamp | Order placement timestamp |

#### 4. `order_issues` Table / Collection
| Field | Type | Description |
|---|---|---|
| `id` | String / UUID | Issue ID e.g. `ISS-102` |
| `order_id` | String / UUID | Related Order ID |
| `customer_id` | String / UUID | Reporting customer |
| `issue_type` | String | `'temperature'`, `'freshness'`, `'wrong_cut'`, `'packaging'`, `'delayed'` |
| `description` | String | Details from customer |
| `photo_url` | String | Image evidence |
| `status` | String | `'submitted'`, `'under_review'`, `'refund_approved'`, `'replacement_dispatched'`, `'resolved'` |
| `resolution_notes`| String | Admin actions taken |

---

### Implementation Options

#### Option A: Firebase Firestore & Authentication (Zero Server Maintenance)
1. **Initialize Firebase in AI Studio or locally:**
   ```bash
   npm install firebase
   ```
2. **Configure Client (`src/firebase.ts`):**
   ```ts
   import { initializeApp } from 'firebase/app';
   import { getFirestore, collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
   };

   export const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const auth = getAuth(app);
   ```
3. **Save an Order:**
   ```ts
   import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

   async function saveOrder(orderData) {
     const docRef = await addDoc(collection(db, 'orders'), {
       ...orderData,
       createdAt: serverTimestamp(),
     });
     return docRef.id;
   }
   ```

#### Option B: PostgreSQL / MySQL with Node.js Express Backend
1. **Setup Server:**
   Create an Express backend (`server.ts`) with Drizzle ORM or Prisma:
   ```ts
   import express from 'express';
   import { Pool } from 'pg';

   const app = express();
   app.use(express.json());

   const pool = new Pool({ connectionString: process.env.DATABASE_URL });

   app.post('/api/orders', async (req, res) => {
     const { customerId, items, grandTotal, deliveryAddress } = req.body;
     const result = await pool.query(
       'INSERT INTO orders (customer_id, items, grand_total, delivery_address) VALUES ($1, $2, $3, $4) RETURNING *',
       [customerId, JSON.stringify(items), grandTotal, deliveryAddress]
     );
     res.status(201).json(result.rows[0]);
   });
   ```

#### Option C: Supabase (PostgreSQL with instant REST & Auth)
- Direct frontend client `@supabase/supabase-js`
- Built-in Row Level Security (RLS) policies allowing customers to read only their own orders while granting super admins full access.

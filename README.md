# 🛒 Pebble Ecommerce

<p align="center">
  <img src="<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/49800ff2-f827-4262-a1e4-dadf566cfbec" />
" alt="Pebble Ecommerce Logo" width="120" />
</p>

<h3 align="center">
Modern Ecommerce Marketplace Built with React, TypeScript & Supabase
</h3>

<p align="center">
A full-stack ecommerce platform featuring authentication, role-based access, seller onboarding, cart management, checkout flows, and order tracking.
</p>

---

## 🎥 Live Demo

### Product Walkthrough

https://www.linkedin.com/posts/aditya-idnani-445881202_react-typescript-vite-ugcPost-7470495418867621888-yO0a/?utm_source=share&utm_medium=member_desktop&rcm=ACoAADO-ETUBJbYj6kaC1eTc4agabZjiCnEmK7o)


## 📸 Screenshots

### 🏠 Home Page

<img width="1511" height="1034" alt="image" src="https://github.com/user-attachments/assets/f197b5ec-a340-4c25-a49e-abece71faed9" />


### 🛍️ Product Catalog

<img width="1508" height="1048" alt="image" src="https://github.com/user-attachments/assets/c4a41b42-32a1-4fe7-af18-5ace2b5f97cd" />


### 📦 Product Details

<img width="1498" height="997" alt="image" src="https://github.com/user-attachments/assets/81d2e207-9200-4478-afff-6fa556764ce1" />


---

# ✨ Features

## Authentication

* Email & Password Authentication
* Magic Link Login
* Session Persistence
* Password Reset
* Protected Routes

## Customer Experience

* Browse Products
* Product Detail Pages
* Collections & Deals
* Shopping Cart
* Secure Checkout Flow
* Order History
* Account Management

## Seller Experience

* Seller Registration
* Seller Onboarding
* Product Management
* Inventory Overview
* Order Monitoring
* Analytics Dashboard
* Payout Tracking

## User Experience

* Fully Responsive Design
* Modern UI Animations
* Fast Navigation
* Optimized Performance
* Mobile Friendly

---

# 🛠️ Tech Stack

## Frontend

* React 18
* TypeScript
* Vite
* React Router
* TanStack Query
* Zustand
* Tailwind CSS
* Framer Motion

## Backend & Services

* Supabase Authentication
* Supabase Database
* Supabase Session Management

---

# 🏗️ Architecture

```text
Client (React + Vite)
        │
        ▼
React Router
        │
        ▼
State Management (Zustand)
        │
        ▼
TanStack Query
        │
        ▼
Supabase
 ├── Authentication
 ├── Database
 └── Session Management
```

---

# 📂 Project Structure

```bash
Pebble-Ecommerce/
│
├── public/
│   ├── images/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── data/
│   ├── lib/
│   └── assets/
│
├── .env
├── package.json
├── vite.config.ts
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Pebble-Ecommerce.git
cd Pebble-Ecommerce
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Run Development Server

```bash
npm run dev
```

Application runs at:

```bash
http://localhost:5173
```

---

# 🗄️ Database Setup

## Orders Table

```sql
create table if not exists orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid,
    total numeric not null,
    status text not null,
    created_at timestamptz default now()
);
```

## Order Items Table

```sql
create table if not exists order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references orders(id) on delete cascade,
    product_id text not null,
    quantity integer not null,
    price numeric not null
);
```

---

# 🔐 Authentication Flow

Pebble Ecommerce uses Supabase Authentication.

Supported features:

* Sign Up
* Login
* Magic Links
* Password Reset
* Session Persistence
* Route Protection

Role Selection:

### Customer

```text
Signup → Login → Shop → Checkout → Orders
```

### Seller

```text
Signup → Seller Onboarding → Seller Dashboard
```

---

# 📦 Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run test:watch
```

---

# 🌐 Deployment

The application can be deployed on:

* Vercel
* Netlify
* Render

Before deployment, ensure production Supabase credentials are configured.

---

# 🚀 Future Enhancements

* Stripe Payments
* Wishlist Persistence
* Product Reviews
* Admin Dashboard
* Inventory Automation
* Advanced Search & Filters
* PWA Support
* Multi-Vendor Marketplace Features

---

# 🧠 Key Learnings

While building Pebble Ecommerce, I gained hands-on experience with:

* Authentication Systems
* Role-Based Access Control
* Ecommerce Architecture
* State Management
* Database Design
* API Integration
* Responsive UI/UX Design
* Production Deployment Workflows

---

# 📄 License

Licensed under the MIT License.

---

<p align="center">
Built with ❤️ using React, TypeScript and Supabase
</p>

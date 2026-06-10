# 🛒 Pebble Ecommerce

<<<<<<< HEAD
A modern full-stack ecommerce web application built using **React, TypeScript, Vite, and Supabase**.  
Pebble Ecommerce delivers a clean shopping experience with authentication, cart management, checkout flow, and real-time order handling.
=======
Pebble Ecommerce is a modern marketplace experience built with **React**, **TypeScript**, **Vite**, and **Supabase**. It combines a polished storefront, role-based authentication, account management, seller onboarding, and order flows into a single responsive application.

The project is designed to feel like a real commerce product rather than a landing-page demo: shoppers can browse products, view details, add items to cart, sign in or sign up, complete checkout, and review their account history. Sellers also get a dedicated onboarding and dashboard experience.

## Highlights

- Authentication with email/password and magic link support
- Protected account and checkout routes
- Customer and seller role selection during signup
- Product browsing, product detail pages, and curated collections
- Cart drawer and checkout flow
- Order confirmation and order history
- Seller onboarding plus a multi-section seller dashboard
- Responsive UI with custom branding and motion
- Supabase-backed session management and database integration

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Framer Motion
- Zustand

### Backend and Services

- Supabase Auth
- Supabase Database
- Supabase session persistence
- Local mock persistence for a few profile and role helpers in `src/lib/api.ts`

## Project Structure

```bash
Pebble-Ecommerce/
├── public/
│   ├── images/
│   └── robots.txt
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   └── stores/
├── .env
├── package.json
├── vite.config.ts
└── README.md
```

## Key Pages

- `/` Home page
- `/shop` Product catalog
- `/product/:slug` Product detail page
- `/collections` Curated collections
- `/deals` Promotions and featured offers
- `/about` Brand and story page
- `/login` Sign in
- `/signup` Sign up with customer or seller role selection
- `/account` Customer account area
- `/checkout` Protected checkout flow
- `/seller/onboarding` Seller onboarding
- `/seller` Seller dashboard
>>>>>>> 09fdbb4 (updated the database details)

---

<<<<<<< HEAD
## 🚀 Features

- 🔐 User Authentication (Signup / Login)
- 🛍️ Dynamic Product Catalog
- 🛒 Add to Cart Functionality
- 💳 Checkout Flow with Validation
- 📦 Order Management
- 👤 User-specific Orders
- ⚡ Responsive Modern UI
- 🎨 Custom Favicon & Clean Branding
- ☁️ Supabase Backend Integration
- 📱 Mobile Friendly Design

---

## 🧰 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend / Services
- Supabase
  - Authentication
  - Database
  - Session Management

---

# 📂 Project Structure

```bash
Pebble-Ecommerce/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   ├── lib/
│   └── assets/
│
├── .env
├── package.json
└── vite.config.ts
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Pebble-Ecommerce.git
cd Pebble-Ecommerce
```

---

## 2️⃣ Install Dependencies
=======
### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Pebble-Ecommerce.git
cd Pebble-Ecommerce
```

### 2. Install dependencies
>>>>>>> 09fdbb4 (updated the database details)

```bash
npm install
```

<<<<<<< HEAD
---

## 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 4️⃣ Run Development Server
=======
### 3. Configure environment variables

Create a `.env` file in the project root and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Important: the Supabase URL must match the project ref encoded in the anon key. If those do not match exactly, auth requests can fail with `failed to fetch`.

### 4. Start the development server
>>>>>>> 09fdbb4 (updated the database details)

```bash
npm run dev
```

<<<<<<< HEAD
---

# 🛢️ Supabase Setup

Create the following tables in Supabase:

## Orders Table

```sql
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  total numeric,
  status text,
  created_at timestamp default now()
);
```

---

## Order Items Table

```sql
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid,
  product_id text,
  quantity int,
  price numeric
);
```

---

# 🔒 Authentication

Pebble Ecommerce uses **Supabase Authentication** for:
- User Signup
- Login
- Session Persistence
- Protected Routes

---

# 📸 Screenshots

_Add your project screenshots here_

```md
![Home Page](your-image-link)
![Cart Page](your-image-link)
![Checkout](your-image-link)
```

---

# 🌟 Future Improvements

- 💳 Stripe Payment Gateway
- 📊 Admin Dashboard
- ❤️ Wishlist Feature
- 🔎 Advanced Product Search
- 📦 Inventory Management
- 📱 PWA Support

---

# 🧠 What I Learned

While building this project, I explored:
- Full-stack ecommerce architecture
- Authentication & protected routes
- State management
- Supabase integration
- Form validation
- Responsive UI/UX
- Git & GitHub workflows

---

# 🚀 Deployment

You can deploy this project easily using:
=======
### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

## Scripts

```json
{
   "dev": "vite",
   "build": "vite build",
   "build:dev": "vite build --mode development",
   "lint": "eslint .",
   "preview": "vite preview",
   "test": "vitest run",
   "test:watch": "vitest"
}
```

## Supabase Setup

Pebble Ecommerce uses Supabase directly for authentication and order data. The app expects these services to be available:

- `orders`
- `order_items`

### Orders table

```sql
create table if not exists orders (
   id uuid default gen_random_uuid() primary key,
   user_id uuid,
   total numeric not null,
   status text not null,
   created_at timestamp with time zone default now()
);
```

### Order items table

```sql
create table if not exists order_items (
   id uuid default gen_random_uuid() primary key,
   order_id uuid references orders(id) on delete cascade,
   product_id text not null,
   quantity int not null,
   price numeric not null
);
```

### Recommended security setup

If you want real multi-user behavior, add Row Level Security policies in Supabase and scope reads/writes to the authenticated user. The current app code expects authentication to work via Supabase and uses the logged-in user session to load account data.

## Authentication Flow

Authentication is handled through `src/services/authService.ts` and the Supabase client in `src/lib/supabase.ts`.

Supported flows include:

- Email and password signup
- Email and password login
- Magic link login
- Password reset
- Session retrieval and auth state subscriptions

The signup page also captures a role choice:

- Customer: routes into the account area
- Seller: routes into the seller onboarding flow

## Notes on Data Handling

Pebble Ecommerce uses Supabase for auth and database-backed order handling, while a few profile and role helpers currently use local mock storage in `src/lib/api.ts`. That makes the app easier to run in a demo environment while still keeping the main auth and order flows tied to Supabase.

## Screens and Experience

The UI includes:

- A storefront shell with header, footer, and cart drawer
- Account pages for profile, orders, wishlist, addresses, payments, reviews, rewards, notifications, security, and help
- Seller dashboard pages for products, orders, inventory, analytics, payouts, discounts, settings, reviews, notifications, and help
- Protected routes for authenticated users and seller-only pages

## Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key for client-side auth |

## Troubleshooting

### `failed to fetch` on login or signup

This usually means the Supabase URL and anon key do not belong to the same project, or the URL is incorrect. Double-check that the hostname in `VITE_SUPABASE_URL` matches the `ref` value inside the anon key.

### Environment variables not loading

Make sure the `.env` file is in the project root and restart the dev server after changing it.

### Auth works in the app but account data looks empty

Some account-related data is backed by local mock storage in `src/lib/api.ts`. If you want that data to persist in Supabase instead, those helper calls need to be wired to real tables.

## Future Improvements

- Stripe or another payment processor
- Real database-backed profile and role tables
- Admin dashboard
- Inventory management workflow
- Wishlist persistence in Supabase
- Search and filtering enhancements
- PWA support

## Deployment

The app can be deployed with any static hosting provider that supports Vite builds, including:
>>>>>>> 09fdbb4 (updated the database details)

- Vercel
- Netlify
- Render

<<<<<<< HEAD
---

# 📄 License

This project is open-source and available under the MIT License.
=======
Before deploying, confirm the production environment has the correct Supabase variables configured.

## License

This project is open source and available under the MIT License.
>>>>>>> 09fdbb4 (updated the database details)

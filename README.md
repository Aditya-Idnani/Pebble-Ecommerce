# 🛒 Pebble Ecommerce

A modern full-stack ecommerce web application built using **React, TypeScript, Vite, and Supabase**.  
Pebble Ecommerce delivers a clean shopping experience with authentication, cart management, checkout flow, and real-time order handling.

---

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

```bash
npm install
```

---

## 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

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

- Vercel
- Netlify
- Render

---

# 📄 License

This project is open-source and available under the MIT License.

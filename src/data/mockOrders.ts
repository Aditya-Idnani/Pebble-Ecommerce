export type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'return_requested';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  variant: string;
  qty: number;
  price: number;
  reviewed: boolean;
}

export interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  address: string;
  paymentMethod: string;
  carrier: string;
  trackingNumber: string;
  trackingEvents: TrackingEvent[];
  estimatedDelivery: string;
}

export const mockOrders: MockOrder[] = [
  {
    id: "ord-1", orderNumber: "#PBL-2024-1847", date: "2024-12-15",
    status: "delivered",
    items: [
      { id: "1", name: "Handcrafted Ceramic Vase", image: "https://picsum.photos/seed/ceramic-vase-1/800/1000", variant: "Sand / M", qty: 1, price: 89, reviewed: true },
      { id: "3", name: "Artisan Linen Tote", image: "https://picsum.photos/seed/linen-tote-1/800/1000", variant: "Natural", qty: 1, price: 64, reviewed: false },
    ],
    subtotal: 153, discount: 0, shipping: 0, tax: 12.24, total: 165.24,
    address: "42 Maple Street, Apt 3B, Mumbai, MH 400001",
    paymentMethod: "Visa ****4242",
    carrier: "BlueDart", trackingNumber: "BD9847261035",
    trackingEvents: [
      { timestamp: "Dec 15, 9:30 AM", location: "Mumbai Hub", description: "Delivered — signed by recipient" },
      { timestamp: "Dec 15, 7:00 AM", location: "Mumbai Hub", description: "Out for delivery" },
      { timestamp: "Dec 14, 11:00 PM", location: "Mumbai Hub", description: "Arrived at local facility" },
      { timestamp: "Dec 13, 3:00 PM", location: "Pune Sorting Center", description: "In transit" },
      { timestamp: "Dec 12, 10:00 AM", location: "Seller Warehouse", description: "Shipped" },
    ],
    estimatedDelivery: "Dec 15",
  },
  {
    id: "ord-2", orderNumber: "#PBL-2024-2103", date: "2025-01-08",
    status: "shipped",
    items: [
      { id: "5", name: "Hand-Poured Soy Candle Set", image: "https://picsum.photos/seed/soy-candle-1/800/1000", variant: "Lavender", qty: 2, price: 34, reviewed: false },
    ],
    subtotal: 68, discount: 6.8, shipping: 0, tax: 4.90, total: 66.10,
    address: "18 Park Avenue, Delhi, DL 110001",
    paymentMethod: "Mastercard ****8891",
    carrier: "Delhivery", trackingNumber: "DL2024010893847",
    trackingEvents: [
      { timestamp: "Jan 10, 2:00 PM", location: "Jaipur Hub", description: "In transit to Delhi" },
      { timestamp: "Jan 9, 8:00 AM", location: "Seller Warehouse", description: "Shipped" },
    ],
    estimatedDelivery: "Jan 12",
  },
  {
    id: "ord-3", orderNumber: "#PBL-2024-2250", date: "2025-01-22",
    status: "processing",
    items: [
      { id: "2", name: "Organic Cotton Robe", image: "https://picsum.photos/seed/cotton-robe-1/800/1000", variant: "Oatmeal / L", qty: 1, price: 128, reviewed: false },
    ],
    subtotal: 128, discount: 0, shipping: 5.99, tax: 10.72, total: 144.71,
    address: "42 Maple Street, Apt 3B, Mumbai, MH 400001",
    paymentMethod: "Visa ****4242",
    carrier: "", trackingNumber: "",
    trackingEvents: [],
    estimatedDelivery: "Jan 28-30",
  },
  {
    id: "ord-4", orderNumber: "#PBL-2024-1502", date: "2024-11-03",
    status: "cancelled",
    items: [
      { id: "6", name: "Woven Wall Hanging", image: "https://picsum.photos/seed/wall-hanging-1/800/1000", variant: "Earth Tones", qty: 1, price: 78, reviewed: false },
    ],
    subtotal: 78, discount: 0, shipping: 5.99, tax: 6.72, total: 90.71,
    address: "7 Lake View Road, Bangalore, KA 560001",
    paymentMethod: "Visa ****4242",
    carrier: "", trackingNumber: "",
    trackingEvents: [],
    estimatedDelivery: "",
  },
  {
    id: "ord-5", orderNumber: "#PBL-2024-2301", date: "2025-02-01",
    status: "out_for_delivery",
    items: [
      { id: "4", name: "Minimal Leather Wallet", image: "https://picsum.photos/seed/leather-wallet-1/800/1000", variant: "Tan", qty: 1, price: 55, reviewed: false },
      { id: "7", name: "Natural Stone Coaster Set", image: "https://picsum.photos/seed/stone-coaster-1/800/1000", variant: "Marble", qty: 1, price: 42, reviewed: false },
    ],
    subtotal: 97, discount: 0, shipping: 0, tax: 7.76, total: 104.76,
    address: "42 Maple Street, Apt 3B, Mumbai, MH 400001",
    paymentMethod: "Mastercard ****8891",
    carrier: "BlueDart", trackingNumber: "BD2025020145623",
    trackingEvents: [
      { timestamp: "Feb 2, 8:00 AM", location: "Mumbai Hub", description: "Out for delivery" },
      { timestamp: "Feb 1, 10:00 PM", location: "Mumbai Hub", description: "Arrived at local facility" },
      { timestamp: "Feb 1, 12:00 PM", location: "Pune", description: "In transit" },
    ],
    estimatedDelivery: "Feb 2",
  },
  {
    id: "ord-6", orderNumber: "#PBL-2024-1120", date: "2024-09-18",
    status: "delivered",
    items: [
      { id: "8", name: "Handmade Ceramic Mug", image: "https://picsum.photos/seed/ceramic-mug-1/800/1000", variant: "Speckled Cream", qty: 2, price: 28, reviewed: true },
    ],
    subtotal: 56, discount: 0, shipping: 0, tax: 4.48, total: 60.48,
    address: "42 Maple Street, Apt 3B, Mumbai, MH 400001",
    paymentMethod: "Visa ****4242",
    carrier: "BlueDart", trackingNumber: "BD2024091823456",
    trackingEvents: [
      { timestamp: "Sep 22, 11:00 AM", location: "Mumbai", description: "Delivered" },
    ],
    estimatedDelivery: "Sep 22",
  },
];

export const mockNotifications = [
  { id: "n1", type: "order" as const, message: "Your order #PBL-2024-2301 is out for delivery!", time: "2 hours ago", read: false },
  { id: "n2", type: "promo" as const, message: "Flash Sale: 30% off all ceramics this weekend", time: "5 hours ago", read: false },
  { id: "n3", type: "order" as const, message: "Your order #PBL-2024-2103 has been shipped", time: "2 days ago", read: true },
  { id: "n4", type: "system" as const, message: "Welcome to Pebble Rewards! You've earned 100 bonus points", time: "3 days ago", read: true },
  { id: "n5", type: "review" as const, message: "Your review for Ceramic Vase was marked helpful by 5 people", time: "5 days ago", read: true },
  { id: "n6", type: "promo" as const, message: "New arrivals from Artisan Studio — check them out!", time: "1 week ago", read: true },
  { id: "n7", type: "order" as const, message: "Your order #PBL-2024-1847 has been delivered", time: "2 weeks ago", read: true },
  { id: "n8", type: "system" as const, message: "Complete your profile to earn 25 reward points", time: "3 weeks ago", read: true },
];

export const mockReviews = [
  { id: "r1", productId: "1", productName: "Handcrafted Ceramic Vase", productImage: "https://picsum.photos/seed/ceramic-vase-1/800/1000", rating: 5, title: "Absolutely stunning piece", body: "The glaze is beautiful and the shape is perfect. It's even more gorgeous in person.", date: "Dec 20, 2024", helpful: 12 },
  { id: "r2", productId: "8", productName: "Handmade Ceramic Mug", productImage: "https://picsum.photos/seed/ceramic-mug-1/800/1000", rating: 4, title: "Great daily mug", body: "Love the weight and feel. The speckled glaze is unique. Only wish the handle was slightly bigger.", date: "Oct 1, 2024", helpful: 5 },
  { id: "r3", productId: "3", productName: "Artisan Linen Tote", productImage: "https://picsum.photos/seed/linen-tote-1/800/1000", rating: 5, title: "Perfect everyday bag", body: "Spacious, well-made, and looks great with everything.", date: "Jan 5, 2025", helpful: 3 },
];

export const mockAddresses = [
  { id: "a1", label: "Home", name: "Aditya Idnani", phone: "+91 98765 43210", line1: "42 Maple Street, Apt 3B", line2: "", city: "Mumbai", state: "Maharashtra", pincode: "400001", country: "India", isDefault: true },
  { id: "a2", label: "Work", name: "Aditya Idnani", phone: "+91 98765 43210", line1: "18 Park Avenue, WeWork", line2: "3rd Floor", city: "Mumbai", state: "Maharashtra", pincode: "400051", country: "India", isDefault: false },
];

export const mockCards = [
  { id: "c1", brand: "visa", last4: "4242", expiry: "12/26", isDefault: true },
  { id: "c2", brand: "mastercard", last4: "8891", expiry: "03/27", isDefault: false },
];

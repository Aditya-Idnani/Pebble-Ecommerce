export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  seller: string;
  tags: string[];
  description: string;
  variants?: {
    colors?: { name: string; hex: string }[];
    sizes?: { label: string; inStock: boolean }[];
  };
  specs?: Record<string, string>;
}

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;
const picsum = (seed: string, i: number, w = 800, h = 1000) =>
  `https://picsum.photos/seed/${seed}-${i}/${w}/${h}`;

export const products: Product[] = [
  {
    id: "1", title: "Handcrafted Ceramic Vase", slug: "handcrafted-ceramic-vase",
    price: 89, comparePrice: 120,
    images: [
      unsplash("1526198049595-f32cde2a219d"),
      unsplash("1597696929736-6d13bed8e6a8"),
      unsplash("1631125915361-b749fdeea230"),
      unsplash("1660721671073-e139688fa3cf"),
    ],
    category: "Home", rating: 4.8, reviewCount: 124, stock: 5, seller: "Artisan Studio",
    tags: ["ceramic", "handmade"],
    description: "A beautifully handcrafted ceramic vase with organic curves and a warm matte glaze. Each piece is wheel-thrown by hand, making every vase unique. The reactive glaze creates subtle color variations that catch the light beautifully.",
    variants: {
      colors: [{ name: "Sand", hex: "#c9b99a" }, { name: "Terracotta", hex: "#c4654a" }, { name: "Sage", hex: "#87a878" }],
      sizes: [{ label: "S", inStock: true }, { label: "M", inStock: true }, { label: "L", inStock: false }],
    },
    specs: { Material: "Stoneware clay", Dimensions: '8" H × 5" W', Weight: "1.2 lbs", SKU: "PBL-CV-001", Origin: "Portland, OR", Care: "Hand wash recommended" },
  },
  {
    id: "2", title: "Linen Throw Blanket", slug: "linen-throw-blanket",
    price: 145,
    images: [
      unsplash("1546617956-17c132905cab"),
      unsplash("1557686652-6731ba12410f"),
      unsplash("1598622444897-58985111f62b"),
      unsplash("1639690222869-1e608aa51f82"),
    ],
    category: "Home", rating: 4.9, reviewCount: 89, stock: 12, seller: "Woven Stories",
    tags: ["linen", "cozy"],
    description: "Premium European linen throw blanket in a warm sand tone. Stonewashed for ultimate softness, this throw gets softer with every wash. Perfect draped over a sofa or layered on your bed.",
    variants: {
      colors: [{ name: "Sand", hex: "#d4c5a9" }, { name: "Oat", hex: "#e8dcc8" }, { name: "Charcoal", hex: "#4a4a4a" }],
      sizes: [{ label: "Throw", inStock: true }, { label: "Queen", inStock: true }, { label: "King", inStock: true }],
    },
    specs: { Material: "100% European linen", Dimensions: '60" × 80"', Weight: "2.4 lbs", SKU: "PBL-LT-002", Origin: "Lithuania", Care: "Machine wash cold, tumble dry low" },
  },
  {
    id: "3", title: "Walnut Serving Board", slug: "walnut-serving-board",
    price: 68, comparePrice: 85,
    images: [
      unsplash("1544892348-e9d2e2324c33"),
      unsplash("1584526375971-91289298ed95"),
      unsplash("1624456494702-3453929857bd"),
      unsplash("1661359782364-7c465ddd653d"),
    ],
    category: "Kitchen", rating: 4.7, reviewCount: 201, stock: 8, seller: "Timber & Grain",
    tags: ["walnut", "kitchen"],
    description: "Sustainably sourced walnut serving board with natural grain patterns. Hand-finished with food-safe mineral oil. The live edge adds rustic charm to any table setting.",
    variants: {
      sizes: [{ label: 'Small (12")', inStock: true }, { label: 'Medium (16")', inStock: true }, { label: 'Large (20")', inStock: false }],
    },
    specs: { Material: "American Black Walnut", Dimensions: '16" × 8" × 0.75"', Weight: "1.8 lbs", SKU: "PBL-WS-003", Origin: "Vermont, USA", Care: "Hand wash, oil monthly" },
  },
  {
    id: "4", title: "Organic Cotton Robe", slug: "organic-cotton-robe",
    price: 195,
    images: [
      unsplash("1591176557752-f84109c388ea"),
      unsplash("1591349215290-8e909a4577d6"),
      unsplash("1619365734740-b3e1ca4b571c"),
      unsplash("1661660228516-0aa581671bd0"),
    ],
    category: "Apparel", rating: 4.6, reviewCount: 67, stock: 15, seller: "Soft Thread",
    tags: ["organic", "cotton"],
    description: "Luxuriously soft organic cotton robe in a warm cream tone. GOTS certified organic cotton with a waffle weave texture. Features deep pockets and a self-tie belt.",
    variants: {
      colors: [{ name: "Cream", hex: "#f5f0e0" }, { name: "Sage", hex: "#a8c0a0" }, { name: "Clay", hex: "#c17c74" }],
      sizes: [{ label: "S", inStock: true }, { label: "M", inStock: true }, { label: "L", inStock: true }, { label: "XL", inStock: true }],
    },
    specs: { Material: "GOTS Certified Organic Cotton", Dimensions: "One Size (fits S-XL)", Weight: "1.5 lbs", SKU: "PBL-CR-004", Origin: "India", Care: "Machine wash warm" },
  },
  {
    id: "5", title: "Stoneware Mug Set", slug: "stoneware-mug-set",
    price: 54, comparePrice: 72,
    images: [
      unsplash("1495100497150-fe209c585f50"),
      unsplash("1517430536-ef20313aea20"),
      unsplash("1544687216-294c8cf702f2"),
      unsplash("1572003414077-38770ebec0a4"),
    ],
    category: "Kitchen", rating: 4.9, reviewCount: 312, stock: 3, seller: "Artisan Studio",
    tags: ["stoneware", "set"],
    description: "Set of 4 hand-thrown stoneware mugs with reactive glaze. Each mug is unique — the glaze reacts differently in the kiln, creating one-of-a-kind color patterns. Microwave and dishwasher safe.",
    variants: {
      colors: [{ name: "Earth", hex: "#8b7355" }, { name: "Ocean", hex: "#6ba3c8" }, { name: "Moss", hex: "#5a8a5c" }],
    },
    specs: { Material: "High-fire stoneware", Dimensions: '4" H × 3.5" W, 12oz', Weight: "2.8 lbs (set)", SKU: "PBL-SM-005", Origin: "Asheville, NC", Care: "Dishwasher & microwave safe" },
  },
  {
    id: "6", title: "Brass Table Lamp", slug: "brass-table-lamp",
    price: 220,
    images: [
      unsplash("1612735849751-38ba2c6f4458"),
      unsplash("1646766598333-a45fd416fbbe"),
      unsplash("1655151419937-e05e5c23d765"),
      unsplash("1706072613979-e2bddb367f41"),
    ],
    category: "Lighting", rating: 4.5, reviewCount: 45, stock: 7, seller: "Lumiere",
    tags: ["brass", "lamp"],
    description: "Minimalist brass table lamp with a linen shade and warm glow. The solid brass base develops a beautiful patina over time. Includes a dimmable LED bulb for adjustable ambiance.",
    variants: {
      colors: [{ name: "Brass", hex: "#cd7f32" }, { name: "Matte Black", hex: "#2d2d2d" }],
    },
    specs: { Material: "Solid brass base, linen shade", Dimensions: '18" H × 10" shade', Weight: "3.2 lbs", SKU: "PBL-BL-006", Origin: "Brooklyn, NY", Care: "Wipe with soft cloth" },
  },
  {
    id: "7", title: "Wool Area Rug", slug: "wool-area-rug",
    price: 380, comparePrice: 450,
    images: [
      unsplash("1564444247765-a377a8bfd0b8"),
      unsplash("1594040226829-7f251ab46d80"),
      unsplash("1661658216076-f7245f96afbb"),
      unsplash("1693899849404-c65b391d3d74"),
    ],
    category: "Home", rating: 4.8, reviewCount: 156, stock: 4, seller: "Woven Stories",
    tags: ["wool", "rug"],
    description: "Hand-knotted wool area rug with a subtle geometric pattern. Made from 100% New Zealand wool using traditional techniques. The neutral palette complements any decor style.",
    variants: {
      colors: [{ name: "Natural", hex: "#e8e4dd" }, { name: "Charcoal", hex: "#4a4a4a" }],
      sizes: [{ label: '4×6', inStock: true }, { label: '5×8', inStock: true }, { label: '8×10', inStock: true }],
    },
    specs: { Material: "100% New Zealand Wool", Dimensions: "5' × 8'", Weight: "18 lbs", SKU: "PBL-WR-007", Origin: "India (Fair Trade)", Care: "Professional cleaning recommended" },
  },
  {
    id: "8", title: "Leather Journal", slug: "leather-journal",
    price: 42,
    images: [
      unsplash("1583341655648-78bdf4ed6d13"),
      unsplash("1598404349715-61c2b92cfed3"),
      unsplash("1627763815344-74ab3b4f6e6a"),
      unsplash("1639371040157-55b642d03f4f"),
    ],
    category: "Accessories", rating: 4.7, reviewCount: 98, stock: 20, seller: "Timber & Grain",
    tags: ["leather", "journal"],
    description: "Full-grain leather journal with hand-stitched binding. Contains 192 pages of acid-free, fountain-pen-friendly paper. The cover develops a rich patina with use.",
    variants: {
      colors: [{ name: "Cognac", hex: "#8b4513" }, { name: "Dark Brown", hex: "#3e2723" }, { name: "Black", hex: "#1a1a1a" }],
      sizes: [{ label: "A5", inStock: true }, { label: "A4", inStock: true }],
    },
    specs: { Material: "Full-grain vegetable-tanned leather", Dimensions: '8.5" × 5.5" (A5)', Weight: "0.6 lbs", SKU: "PBL-LJ-008", Origin: "Florence, Italy", Care: "Condition with leather balm annually" },
  },
];

export const categories = ["All", "Home", "Kitchen", "Apparel", "Lighting", "Accessories"];

export const mockReviews = [
  {
    id: "r1", productId: "1", author: "Sarah M.", date: "March 12, 2026", rating: 5, verified: true,
    title: "Absolutely stunning piece", body: "This vase exceeded all my expectations. The glaze is even more beautiful in person — it catches the light in the most magical way. It's the perfect centerpiece for my dining table.",
    helpful: 23, images: [picsum("review", 1, 200, 200)],
  },
  {
    id: "r2", productId: "1", author: "James K.", date: "February 28, 2026", rating: 4, verified: true,
    title: "Beautiful but slightly smaller than expected", body: "Gorgeous craftsmanship and the glaze is truly unique. Only giving 4 stars because it was a bit smaller than I imagined from the photos. Still love it though!",
    helpful: 11, images: [],
  },
  {
    id: "r3", productId: "1", author: "Aanya P.", date: "February 15, 2026", rating: 5, verified: true,
    title: "A work of art", body: "I bought this as a gift and my friend was absolutely thrilled. The packaging was also beautiful — felt like a real luxury experience from start to finish.",
    helpful: 8, images: [picsum("review", 2, 200, 200)],
  },
  {
    id: "r4", productId: "1", author: "Tom R.", date: "January 20, 2026", rating: 5, verified: false,
    title: "Third purchase from this seller", body: "I keep coming back to Artisan Studio because the quality is consistently outstanding. This vase is no exception. The terracotta tone is warm and inviting.",
    helpful: 5, images: [],
  },
  {
    id: "r5", productId: "1", author: "Mia C.", date: "January 5, 2026", rating: 3, verified: true,
    title: "Nice but arrived with a small chip", body: "The vase itself is lovely but mine arrived with a tiny chip on the base. Customer service was responsive and offered a partial refund. The chip isn't visible when displayed.",
    helpful: 3, images: [],
  },
];

// Mock coupon codes
export const mockCoupons: Record<string, { type: 'percent' | 'fixed'; value: number; label: string }> = {
  'PEBBLE10': { type: 'percent', value: 10, label: '10% off' },
  'SAVE20': { type: 'fixed', value: 20, label: '$20 off' },
  'WELCOME15': { type: 'percent', value: 15, label: '15% off your first order' },
};

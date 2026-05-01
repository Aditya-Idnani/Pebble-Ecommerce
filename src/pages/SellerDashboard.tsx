import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Box,
  Boxes,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Grid3X3,
  HelpCircle,
  ImageUp,
  Layers,
  LifeBuoy,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  Upload,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountUp } from "@/components/account/useCountUp";
import { useAuthStore } from "@/stores/auth";
import { UserMenu } from "@/components/UserMenu";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type SellerProductStatus = "Active" | "Draft" | "Out of Stock" | "Archived";
type SellerOrderStatus = "New" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returns";

interface SellerProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  comparePrice?: number;
  stock: number;
  status: SellerProductStatus;
  sales: number;
  image: string;
}

interface SellerOrder {
  id: string;
  customer: string;
  initials: string;
  total: number;
  status: SellerOrderStatus;
  date: string;
  itemCount: number;
  items: { name: string; qty: number; price: number; variant: string; image: string }[];
  fulfillment: "Unfulfilled" | "Fulfilled" | "Delivered";
  needsReply?: boolean;
}

const sellerNav = [
  { to: "/seller", label: "Overview", icon: Grid3X3, end: true },
  { to: "/seller/products", label: "Products", icon: Box },
  { to: "/seller/orders", label: "Orders", icon: ShoppingBag, badge: 3 },
  { to: "/seller/inventory", label: "Inventory", icon: Layers },
  { to: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/seller/payouts", label: "Payouts", icon: Wallet },
  { to: "/seller/discounts", label: "Discounts", icon: Tag },
  { to: "/seller/settings", label: "Store Settings", icon: Settings },
  { to: "/seller/reviews", label: "Reviews", icon: Star },
  { to: "/seller/notifications", label: "Notifications", icon: Bell, badge: 4 },
];

const mockProducts: SellerProduct[] = [
  { id: "p-1", name: "Linen Throw Blanket", sku: "PEBBLE-1742", category: "Home", price: 68, comparePrice: 82, stock: 8, status: "Active", sales: 44, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200" },
  { id: "p-2", name: "Handmade Stone Mug", sku: "PEBBLE-2241", category: "Kitchen", price: 24, stock: 3, status: "Active", sales: 51, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=200" },
  { id: "p-3", name: "Cotton Robe", sku: "PEBBLE-3001", category: "Apparel", price: 74, stock: 2, status: "Active", sales: 28, image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=200" },
  { id: "p-4", name: "Terracotta Vase", sku: "PEBBLE-8018", category: "Home", price: 42, stock: 0, status: "Out of Stock", sales: 15, image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=200" },
  { id: "p-5", name: "Rattan Storage Basket", sku: "PEBBLE-4181", category: "Home", price: 34, stock: 12, status: "Draft", sales: 0, image: "https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?w=200" },
  { id: "p-6", name: "Ceramic Plate Set", sku: "PEBBLE-6620", category: "Kitchen", price: 58, stock: 6, status: "Active", sales: 38, image: "https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=200" },
];

const mockOrders: SellerOrder[] = [
  {
    id: "OR-1032",
    customer: "Ariana Shaw",
    initials: "AS",
    total: 124,
    status: "New",
    date: "Apr 17, 2026",
    itemCount: 2,
    fulfillment: "Unfulfilled",
    items: [
      { name: "Linen Throw Blanket", qty: 1, price: 68, variant: "Sand", image: mockProducts[0].image },
      { name: "Handmade Stone Mug", qty: 2, price: 24, variant: "Ivory", image: mockProducts[1].image },
    ],
  },
  {
    id: "OR-1031",
    customer: "Kai Morales",
    initials: "KM",
    total: 74,
    status: "Processing",
    date: "Apr 16, 2026",
    itemCount: 1,
    fulfillment: "Unfulfilled",
    items: [{ name: "Cotton Robe", qty: 1, price: 74, variant: "M / Clay", image: mockProducts[2].image }],
    needsReply: true,
  },
  {
    id: "OR-1030",
    customer: "Lena Park",
    initials: "LP",
    total: 58,
    status: "Shipped",
    date: "Apr 16, 2026",
    itemCount: 1,
    fulfillment: "Fulfilled",
    items: [{ name: "Ceramic Plate Set", qty: 1, price: 58, variant: "Set of 4", image: mockProducts[5].image }],
  },
  {
    id: "OR-1029",
    customer: "Theo Ford",
    initials: "TF",
    total: 42,
    status: "Delivered",
    date: "Apr 15, 2026",
    itemCount: 1,
    fulfillment: "Delivered",
    items: [{ name: "Terracotta Vase", qty: 1, price: 42, variant: "Tall", image: mockProducts[3].image }],
  },
  {
    id: "OR-1028",
    customer: "Nia Clark",
    initials: "NC",
    total: 136,
    status: "Returns",
    date: "Apr 13, 2026",
    itemCount: 3,
    fulfillment: "Delivered",
    items: [
      { name: "Linen Throw Blanket", qty: 1, price: 68, variant: "Sage", image: mockProducts[0].image },
      { name: "Handmade Stone Mug", qty: 1, price: 24, variant: "Ivory", image: mockProducts[1].image },
      { name: "Rattan Storage Basket", qty: 1, price: 44, variant: "Large", image: mockProducts[4].image },
    ],
  },
];

const revenueSeries = {
  "7D": Array.from({ length: 7 }).map((_, i) => ({ day: `D${i + 1}`, revenue: [148, 190, 132, 210, 184, 224, 248][i] })),
  "30D": Array.from({ length: 30 }).map((_, i) => ({ day: `Apr ${i + 1}`, revenue: Math.round(120 + Math.sin(i / 4) * 42 + i * 3.8) })),
  "90D": Array.from({ length: 90 }).map((_, i) => ({ day: `${i + 1}`, revenue: Math.round(90 + Math.sin(i / 8) * 30 + i * 1.1) })),
};

const defaultPolicies = {
  shipping: "Orders process in 1-3 business days. Delivery windows vary by zone and carrier. Tracking details are emailed once shipped.",
  returns: "Returns accepted within 30 days for unused items in original condition. Refunds are issued after quality check.",
  privacy: "We collect only data necessary to process orders and improve your experience. We never sell customer personal data.",
};

function useMockLoading(delay = 700) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return loading;
}

function formatMoney(amount: number) {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusBadgeClass(status: SellerOrderStatus | SellerProductStatus) {
  if (status === "New") return "bg-accent/20 text-accent animate-pulse";
  if (status === "Processing" || status === "Draft") return "bg-amber-100 text-amber-700";
  if (status === "Shipped" || status === "Active") return "bg-blue-100 text-blue-700";
  if (status === "Delivered") return "bg-emerald-100 text-emerald-700";
  if (status === "Out of Stock" || status === "Cancelled") return "bg-red-100 text-red-700";
  if (status === "Returns") return "bg-purple-100 text-purple-700";
  return "bg-muted text-muted-foreground";
}

function SellerSectionLoader({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <Skeleton key={idx} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}

export const SellerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [storeName, setStoreName] = useState("Pebble Atelier");
  const [storeHandle, setStoreHandle] = useState("pebble-atelier");
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const { user } = useAuthStore();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    let active = true;
    const fetchStore = async () => {
      if (!user) return;
      const { data } = await api.db.stores.getBySeller(user.id);
      if (active && data) {
        setStoreName(data.name);
        setStoreHandle(data.handle);
        setStoreLogo(data.logo_url);
      }
    };
    fetchStore();
    return () => {
      active = false;
    };
  }, [user]);

  const title = useMemo(() => {
    const match = sellerNav.find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
    );
    if (location.pathname.includes("/products/new")) return "Add Product";
    if (location.pathname.includes("/products/") && location.pathname.includes("/edit")) return "Edit Product";
    if (location.pathname.includes("/orders/")) return "Order Detail";
    return match?.label ?? "Seller Hub";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside
          className={cn(
            "hidden md:flex flex-col border-r bg-card sticky top-0 h-screen transition-[width] duration-300 ease-out",
            collapsed ? "w-[72px]" : "w-[260px]"
          )}
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-accent text-accent-foreground flex items-center justify-center font-display text-lg">P</div>
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="font-display leading-tight">Pebble</p>
                    <p className="text-xs text-muted-foreground">Seller Hub</p>
                  </div>
                )}
              </div>
              <button className="p-1.5 rounded-md hover:bg-muted" onClick={() => setCollapsed((s) => !s)}>
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary border overflow-hidden shrink-0">
                {storeLogo ? (
                  <img src={storeLogo} alt={storeName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-semibold">{storeName[0]}</div>
                )}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{storeName}</p>
                  <p className="text-xs text-muted-foreground truncate">@{storeHandle}</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {sellerNav.map(({ to, icon: Icon, label, end, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-full text-sm transition-colors relative",
                    isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{label}</span>}
                {!collapsed && badge ? (
                  <span className="ml-auto text-[10px] h-5 min-w-5 px-1 rounded-full bg-foreground/10 flex items-center justify-center">{badge}</span>
                ) : null}
              </NavLink>
            ))}

            <div className="my-2 border-t" />
            <a
              href={`/store/${storeHandle}`}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-full text-sm hover:bg-muted text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <ExternalLink className="w-4 h-4" />
              {!collapsed && "View My Store"}
            </a>
            <Link
              to="/seller/help"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-full text-sm hover:bg-muted text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <LifeBuoy className="w-4 h-4" />
              {!collapsed && "Help"}
            </Link>
            <Link
              to="/account"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-full text-sm hover:bg-muted text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              {!collapsed && "Back to Shopping"}
            </Link>
          </nav>

          <div className="p-3 border-t">
            {!collapsed && (
              <div className="rounded-xl p-3 bg-secondary/60">
                <p className="text-xs text-muted-foreground">Free Plan</p>
                <button className="mt-2 w-full rounded-lg bg-accent text-accent-foreground py-2 text-sm">Upgrade</button>
              </div>
            )}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="h-16 border-b bg-card/90 backdrop-blur sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
            <h1 className="text-xl font-display">{title}</h1>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-full hover:bg-muted">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-accent" />
              </button>
              <UserMenu />
            </div>
          </header>
          <main className="p-4 md:p-6 pb-24 md:pb-6">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>

      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 border-t bg-card z-40 flex items-center justify-around">
          {[
            { to: "/seller", label: "Overview", icon: Grid3X3, end: true },
            { to: "/seller/products", label: "Products", icon: Box },
            { to: "/seller/orders", label: "Orders", icon: ShoppingBag },
            { to: "/seller/analytics", label: "Analytics", icon: BarChart3 },
            { to: "/seller/settings", label: "Settings", icon: Settings },
          ].map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => cn("text-[10px] flex flex-col items-center", isActive ? "text-accent" : "text-muted-foreground")}>
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
};

export const SellerOverviewPage = () => {
  const loading = useMockLoading();
  const [range, setRange] = useState<"7D" | "30D" | "90D">("30D");
  const kpis = [
    { label: "Today's Revenue", value: 248, money: true },
    { label: "This Month", value: 4820, money: true },
    { label: "Pending Orders", value: 3 },
    { label: "Total Products", value: 24 },
    { label: "Average Rating", value: 4.8, decimal: true, suffix: "★" },
    { label: "Total Sales", value: 186 },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card border p-5">
        <h2 className="text-2xl font-display">Welcome back, Pebble Atelier! 👋</h2>
        <a href="/store/pebble-atelier" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-accent text-sm">
          View Your Store <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border bg-card p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-lg">Revenue Chart</h3>
            <div className="rounded-full bg-muted p-1 inline-flex">
              {(["7D", "30D", "90D"] as const).map((tab) => (
                <button key={tab} onClick={() => setRange(tab)} className={cn("px-3 py-1 text-xs rounded-full", range === tab ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <SellerSectionLoader rows={5} />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries[range]}>
                  <defs>
                    <linearGradient id="sellerRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--terracotta))" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="hsl(var(--terracotta))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v: number) => formatMoney(v)} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--terracotta))" fill="url(#sellerRevenue)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-4">
          <h3 className="font-display text-lg mb-3">Top Products</h3>
          <div className="space-y-3">
            {mockProducts
              .slice()
              .sort((a, b) => b.sales * b.price - a.sales * a.price)
              .slice(0, 5)
              .map((product, idx, arr) => {
                const revenue = product.sales * product.price;
                const max = arr[0].sales * arr[0].price;
                return (
                  <div key={product.id} className="rounded-xl border p-3">
                    <div className="flex gap-3">
                      <p className="text-2xl font-display text-muted-foreground/60">{idx + 1}</p>
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sold • {formatMoney(revenue)} • ★4.{9 - idx}</p>
                      </div>
                    </div>
                    <Progress className="h-1 mt-2" value={(revenue / max) * 100} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg">Recent Orders</h3>
          <Link to="/seller/orders" className="text-sm text-accent inline-flex items-center gap-1">View all orders <ArrowRight className="w-4 h-4" /></Link>
        </div>
        {loading ? (
          <SellerSectionLoader rows={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2">Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th />
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b hover:bg-cream/50 transition-colors">
                    <td className="py-3 font-mono">{order.id}</td>
                    <td><div className="flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px]">{order.initials}</span>{order.customer}</div></td>
                    <td>{order.items[0].name} {order.itemCount > 1 ? `+${order.itemCount - 1}` : ""}</td>
                    <td>{formatMoney(order.total)}</td>
                    <td><span className={cn("px-2 py-1 rounded-full text-xs", statusBadgeClass(order.status))}>{order.status}</span></td>
                    <td>{order.date}</td>
                    <td><Link to={`/seller/orders/${order.id}`} className="text-xs px-2 py-1 rounded-md border hover:bg-muted">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {[{ count: 3, text: "orders awaiting fulfillment", action: "Fulfill Now", tone: "bg-orange-50 border-orange-200" }, { count: 2, text: "products low on stock", action: "Update Inventory", tone: "bg-yellow-50 border-yellow-200" }, { count: 1, text: "reviews need a reply", action: "View Reviews", tone: "bg-blue-50 border-blue-200" }].map((card) => (
          card.count > 0 ? (
            <div key={card.text} className={cn("rounded-2xl border p-4", card.tone)}>
              <p className="font-medium">{card.count} {card.text}</p>
              <button className="mt-3 text-sm bg-white px-3 py-1.5 rounded-md border">{card.action}</button>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

function KpiCard({ label, value, money, decimal, suffix }: { label: string; value: number; money?: boolean; decimal?: boolean; suffix?: string }) {
  const intTarget = decimal ? Math.round(value * 10) : Math.round(value);
  const animated = useCountUp(intTarget, 900);
  const display = decimal ? (animated / 10).toFixed(1) : animated.toString();
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-2xl border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-display mt-1">{money ? formatMoney(Number(display)) : `${display}${suffix ?? ""}`}</p>
    </motion.div>
  );
}

export const SellerProductsPage = () => {
  const [rows, setRows] = useState<SellerProduct[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();
  const loading = useMockLoading();

  const filtered = rows.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All" || item.status === status;
    const matchesCategory = category === "All" || item.category === category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: rows.length,
    active: rows.filter((p) => p.status === "Active").length,
    draft: rows.filter((p) => p.status === "Draft").length,
    out: rows.filter((p) => p.stock === 0 || p.status === "Out of Stock").length,
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const bulkAction = (action: "Activate" | "Deactivate" | "Delete") => {
    if (action === "Delete") setRows((prev) => prev.filter((p) => !selected.includes(p.id)));
    if (action === "Activate") setRows((prev) => prev.map((p) => (selected.includes(p.id) ? { ...p, status: "Active" } : p)));
    if (action === "Deactivate") setRows((prev) => prev.map((p) => (selected.includes(p.id) ? { ...p, status: "Draft" } : p)));
    toast({ title: `${action} complete`, description: `${selected.length} products updated.` });
    setSelected([]);
  };

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-3">
        {[
          ["Total", stats.total],
          ["Active", stats.active],
          ["Draft", stats.draft],
          ["Out of Stock", stats.out],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border bg-card p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-display">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input className="w-full pl-9 pr-3 py-2 rounded-lg border bg-background text-sm" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm">
            {["All", "Active", "Draft", "Out of Stock", "Archived"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm">
            {["All", "Home", "Kitchen", "Apparel"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="px-3 py-2 rounded-lg border text-sm" onClick={() => toast({ title: "Export successful", description: "CSV generated successfully." })}>Export CSV</button>
          <button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm inline-flex items-center gap-2" onClick={() => navigate("/seller/products/new")}><Plus className="w-4 h-4" />Add Product</button>
        </div>

        <motion.div initial={false} animate={{ height: selected.length ? "auto" : 0, opacity: selected.length ? 1 : 0 }} className="overflow-hidden">
          <div className="mt-3 rounded-xl border bg-secondary/50 p-3 flex flex-wrap items-center gap-2">
            <p className="text-sm">{selected.length} selected</p>
            {(["Activate", "Deactivate", "Delete"] as const).map((action) => (
              <button key={action} onClick={() => bulkAction(action)} className={cn("px-3 py-1.5 rounded-md text-sm", action === "Delete" ? "bg-destructive text-destructive-foreground" : "bg-card border")}>
                {action}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="mt-4"><SellerSectionLoader rows={7} /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center border rounded-xl mt-4">
            <Boxes className="w-10 h-10 mx-auto text-muted-foreground" />
            <p className="font-display mt-3">No products yet</p>
            <button onClick={() => navigate("/seller/products/new")} className="mt-3 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm">Add your first product</button>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2"><input type="checkbox" checked={selected.length === filtered.length} onChange={(e) => setSelected(e.target.checked ? filtered.map((f) => f.id) : [])} /></th>
                  <th>Image</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Sales</th><th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="group border-b hover:bg-cream/50">
                    <td className="py-3"><input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggleSelect(product.id)} /></td>
                    <td><img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md" /></td>
                    <td>
                      <p>{product.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                    </td>
                    <td><Badge variant="secondary">{product.category}</Badge></td>
                    <td>{formatMoney(product.price)}{product.comparePrice ? <span className="ml-2 text-xs line-through text-muted-foreground">{formatMoney(product.comparePrice)}</span> : null}</td>
                    <td className={cn(product.stock === 0 ? "text-red-600" : product.stock < 5 ? "text-orange-600" : "text-emerald-700")}>{product.stock}</td>
                    <td><span className={cn("px-2 py-1 rounded-full text-xs", statusBadgeClass(product.status))}>{product.status}</span></td>
                    <td>{product.sales}</td>
                    <td>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button onClick={() => navigate(`/seller/products/${product.id}/edit`)} className="p-1.5 rounded-md border"><Pencil className="w-4 h-4" /></button>
                        <a href={`/product/${product.id}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-md border"><Eye className="w-4 h-4" /></a>
                        <button onClick={() => setRows((prev) => prev.filter((p) => p.id !== product.id))} className="p-1.5 rounded-md border text-destructive"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm">
          <button className="px-3 py-1.5 rounded-lg border">Previous</button>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => <button key={p} className={cn("w-8 h-8 rounded-md border", p === 1 && "bg-accent text-accent-foreground border-accent")}>{p}</button>)}
          </div>
          <button className="px-3 py-1.5 rounded-lg border">Next</button>
        </div>
      </div>
    </div>
  );
};

export const SellerProductFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const existing = mockProducts.find((p) => p.id === id);
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement | null>(null);

  const [title, setTitle] = useState(existing?.name ?? "");
  const [tags, setTags] = useState<string[]>(["handmade", "eco"]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>(existing ? [existing.image] : []);
  const [uploading, setUploading] = useState(false);
  const [price, setPrice] = useState(existing?.price ?? 0);
  const [compareAt, setCompareAt] = useState(existing?.comparePrice ?? 0);
  const [cost, setCost] = useState(20);
  const [sku, setSku] = useState(existing?.sku ?? "");
  const [trackQty, setTrackQty] = useState(true);
  const [qty, setQty] = useState(existing?.stock ?? 10);
  const [continueSelling, setContinueSelling] = useState(false);
  const [threshold, setThreshold] = useState(5);
  const [physical, setPhysical] = useState(true);
  const [hasVariants, setHasVariants] = useState(false);
  const [variantOptions, setVariantOptions] = useState<{ name: string; values: string[]; input: string }[]>([]);
  const [productStatus, setProductStatus] = useState<"Active" | "Draft" | "Archived">("Draft");
  const [schedule, setSchedule] = useState(false);
  const [publishAt, setPublishAt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (!slug) setSlug(title.toLowerCase().trim().replace(/\s+/g, "-"));
  }, [title, slug]);

  const margin = price > 0 ? ((price - cost) / price) * 100 : 0;

  const onTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !tagInput.trim()) return;
    event.preventDefault();
    setTags((prev) => Array.from(new Set([...prev, tagInput.trim()])));
    setTagInput("");
  };

  const onUpload = async (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).slice(0, 8 - images.length);
    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast({ title: "Invalid file", description: `${file.name} must be JPG, PNG, or WEBP.`, variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 5MB.`, variant: "destructive" });
        return;
      }
    }

    setUploading(true);
    const nextUrls: string[] = [];
    for (const file of files) {
      const path = `mock/${Date.now()}-${file.name}`;
      const { error, url } = await api.storage.upload("products", path, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        setUploading(false);
        return;
      }
      if (url) nextUrls.push(url);
    }
    setImages((prev) => [...prev, ...nextUrls]);
    setUploading(false);
  };

  const updateOptionValue = (idx: number, key: "name" | "input", value: string) => {
    setVariantOptions((prev) => prev.map((opt, i) => (i === idx ? { ...opt, [key]: value } : opt)));
  };

  const addOptionValue = (idx: number) => {
    const input = variantOptions[idx].input.trim();
    if (!input) return;
    setVariantOptions((prev) =>
      prev.map((opt, i) => (i === idx ? { ...opt, values: Array.from(new Set([...opt.values, input])), input: "" } : opt))
    );
  };

  const combinations = useMemo(() => {
    const active = variantOptions.filter((opt) => opt.name && opt.values.length);
    if (active.length === 0) return [];
    let result: string[][] = [[]];
    active.forEach((option) => {
      result = result.flatMap((acc) => option.values.map((value) => [...acc, value]));
    });
    return result.map((combo) => ({ name: combo.join(" / "), price, stock: qty, sku }));
  }, [variantOptions, price, qty, sku]);

  const runEditorCommand = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const save = (kind: "Draft" | "Publish") => {
    toast({ title: kind === "Draft" ? "Draft saved" : "Product published", description: `${title || "Untitled product"} was ${kind === "Draft" ? "saved as draft" : "published"}.` });
    navigate("/seller/products");
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur border rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <button onClick={() => navigate("/seller/products")} className="inline-flex items-center text-sm gap-1 text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Back to Products</button>
        <span className="px-2 py-1 rounded-full text-xs bg-muted">Draft</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => save("Draft")} className="px-3 py-2 rounded-lg border text-sm">Save Draft</button>
          <button onClick={() => save("Publish")} className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm">Publish</button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.7fr_1fr] gap-5">
        <div className="space-y-5">
          <section className="rounded-2xl border bg-card p-4 space-y-4">
            <h3 className="font-display text-lg">Basic Information</h3>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-lg px-3 py-2 rounded-lg border bg-background" placeholder="Product title" />
            <div className="border rounded-xl overflow-hidden">
              <div className="flex gap-1 p-2 border-b bg-muted/40">
                {[
                  ["B", "bold"],
                  ["I", "italic"],
                  ["U", "underline"],
                  ["• List", "insertUnorderedList"],
                  ["1. List", "insertOrderedList"],
                ].map(([label, cmd]) => (
                  <button key={cmd} type="button" className="px-2 py-1 text-xs rounded-md border bg-card" onClick={() => runEditorCommand(cmd)}>
                    {label}
                  </button>
                ))}
              </div>
              <div ref={editorRef} contentEditable className="min-h-40 p-3 outline-none text-sm" suppressContentEditableWarning>
                {isEdit ? "A soft, breathable robe made from natural cotton fibers." : "Describe your product here..."}
              </div>
            </div>

            <div>
              <p className="text-sm mb-2">Tags</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-full bg-secondary text-xs inline-flex items-center gap-1">
                    {tag}
                    <button onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}>×</button>
                  </span>
                ))}
              </div>
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={onTagKeyDown} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Type tag and press Enter" />
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-4 space-y-4">
            <h3 className="font-display text-lg">Media</h3>
            <label className="border-2 border-dashed rounded-xl p-8 text-center block cursor-pointer hover:border-accent transition-colors">
              <ImageUp className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm mt-2">Drag images here or click to browse</p>
              <p className="text-xs text-muted-foreground">Max 8 images • JPG, PNG, WEBP • 5MB each</p>
              <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => onUpload(e.target.files)} />
            </label>
            {uploading && <div className="text-sm text-muted-foreground inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Uploading...</div>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((src, idx) => (
                <div key={src} className="relative rounded-lg border overflow-hidden">
                  <img src={src} alt="" className="w-full h-24 object-cover" />
                  {idx === 0 && <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground">Main</span>}
                  <button className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white" onClick={() => setImages((prev) => prev.filter((img) => img !== src))}>×</button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-4">
            <h3 className="font-display text-lg mb-3">Pricing</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <Field label="Price"><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background" /></Field>
              <Field label="Compare-at"><input type="number" value={compareAt} onChange={(e) => setCompareAt(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background" /></Field>
              <Field label="Cost per item"><input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background" /></Field>
            </div>
            <p className="text-xs mt-2 text-muted-foreground">Margin: {margin.toFixed(1)}%</p>
            {compareAt > price && <p className="text-xs mt-1 text-accent">On Sale preview enabled.</p>}
            <label className="mt-3 text-sm inline-flex items-center gap-2"><input type="checkbox" />Charge tax on this product</label>
          </section>

          <section className="rounded-2xl border bg-card p-4 space-y-3">
            <h3 className="font-display text-lg">Inventory</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="SKU">
                <div className="flex gap-2">
                  <input value={sku} onChange={(e) => setSku(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border bg-background" />
                  <button onClick={() => setSku(`PEBBLE-${Math.floor(1000 + Math.random() * 9000)}`)} className="px-3 rounded-lg border text-sm">Auto</button>
                </div>
              </Field>
              <Field label="Barcode"><input className="w-full px-3 py-2 rounded-lg border bg-background" /></Field>
            </div>
            <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" checked={trackQty} onChange={(e) => setTrackQty(e.target.checked)} />Track quantity</label>
            {trackQty && (
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Stock quantity"><input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background" /></Field>
                <Field label="Low stock threshold"><input type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background" /></Field>
                <label className="text-sm inline-flex items-center gap-2 mt-7"><input type="checkbox" checked={continueSelling} onChange={(e) => setContinueSelling(e.target.checked)} />Continue when out</label>
              </div>
            )}
            <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" checked={physical} onChange={(e) => setPhysical(e.target.checked)} />Physical product</label>
          </section>

          <section className="rounded-2xl border bg-card p-4 space-y-3">
            <h3 className="font-display text-lg">Variants</h3>
            <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" checked={hasVariants} onChange={(e) => setHasVariants(e.target.checked)} />This product has variants</label>
            {hasVariants && (
              <>
                <div className="space-y-3">
                  {variantOptions.map((option, idx) => (
                    <div key={idx} className="border rounded-xl p-3">
                      <input value={option.name} onChange={(e) => updateOptionValue(idx, "name", e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background mb-2" placeholder="Option name (e.g. Size)" />
                      <div className="flex flex-wrap gap-2 mb-2">
                        {option.values.map((value) => (
                          <span key={value} className="px-2 py-1 rounded-full bg-secondary text-xs">{value}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input value={option.input} onChange={(e) => updateOptionValue(idx, "input", e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOptionValue(idx))} className="flex-1 px-3 py-2 rounded-lg border bg-background" placeholder="Type value, press Enter" />
                        <button onClick={() => addOptionValue(idx)} className="px-3 rounded-lg border text-sm">Add</button>
                      </div>
                    </div>
                  ))}
                </div>
                {variantOptions.length < 3 && (
                  <button onClick={() => setVariantOptions((prev) => [...prev, { name: "", values: [], input: "" }])} className="px-3 py-2 rounded-lg border text-sm">
                    Add another option
                  </button>
                )}
                {combinations.length > 0 && (
                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40"><tr><th className="p-2 text-left">Variant</th><th className="p-2 text-left">Price</th><th className="p-2 text-left">Stock</th><th className="p-2 text-left">SKU</th></tr></thead>
                      <tbody>
                        {combinations.map((combo) => (
                          <tr key={combo.name} className="border-t">
                            <td className="p-2">{combo.name}</td>
                            <td className="p-2"><input defaultValue={combo.price} className="w-20 px-2 py-1 rounded border bg-background" /></td>
                            <td className="p-2"><input defaultValue={combo.stock} className="w-20 px-2 py-1 rounded border bg-background" /></td>
                            <td className="p-2"><input defaultValue={combo.sku} className="w-32 px-2 py-1 rounded border bg-background" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>

          {physical && (
            <section className="rounded-2xl border bg-card p-4">
              <h3 className="font-display text-lg mb-3">Shipping</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Weight"><div className="flex gap-2"><input className="flex-1 px-3 py-2 rounded-lg border bg-background" /><select className="px-2 rounded-lg border bg-background"><option>kg</option><option>g</option><option>lb</option></select></div></Field>
                <Field label="Dimensions"><div className="flex gap-2"><input className="w-full px-2 py-2 rounded-lg border bg-background" placeholder="L" /><input className="w-full px-2 py-2 rounded-lg border bg-background" placeholder="W" /><input className="w-full px-2 py-2 rounded-lg border bg-background" placeholder="H" /><select className="px-2 rounded-lg border bg-background"><option>cm</option><option>in</option></select></div></Field>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border bg-card p-4 space-y-3">
            <h3 className="font-display text-lg">Product Status</h3>
            {(["Active", "Draft", "Archived"] as const).map((state) => (
              <label key={state} className="block text-sm"><input type="radio" checked={productStatus === state} onChange={() => setProductStatus(state)} className="mr-2" />{state}</label>
            ))}
            <label className="text-sm inline-flex items-center gap-2 mt-2"><input type="checkbox" checked={schedule} onChange={(e) => setSchedule(e.target.checked)} />Publish at specific date</label>
            {schedule && <input type="datetime-local" value={publishAt} onChange={(e) => setPublishAt(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />}
          </section>

          <section className="rounded-2xl border bg-card p-4 space-y-3">
            <h3 className="font-display text-lg">Product Organization</h3>
            <select className="w-full px-3 py-2 rounded-lg border bg-background text-sm"><option>Category</option><option>Home</option><option>Kitchen</option><option>Apparel</option></select>
            <select className="w-full px-3 py-2 rounded-lg border bg-background text-sm"><option>Sub-category</option><option>Textiles</option><option>Ceramics</option></select>
            <input className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Product type" />
            <div className="space-y-1 text-sm">
              {["Spring", "Best Sellers", "Handmade"].map((name) => (
                <label key={name} className="inline-flex items-center gap-2 mr-3"><input type="checkbox" />{name}</label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-4 space-y-3">
            <h3 className="font-display text-lg">SEO Preview</h3>
            <Field label={`Meta title (${metaTitle.length}/60)`}><input value={metaTitle} maxLength={60} onChange={(e) => setMetaTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" /></Field>
            <Field label={`Meta description (${metaDescription.length}/160)`}><textarea value={metaDescription} maxLength={160} onChange={(e) => setMetaDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm h-24" /></Field>
            <Field label="URL slug"><input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" /></Field>
            <div className="rounded-xl border bg-background p-3">
              <p className="text-xs text-emerald-700">pebble.com/store/{slug || "your-slug"}</p>
              <p className="text-sm text-blue-700 mt-1">{metaTitle || title || "Product title"}</p>
              <p className="text-xs text-muted-foreground mt-1">{metaDescription || "Meta description preview appears here."}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm mb-1">{label}</p>
      {children}
    </div>
  );
}

export const SellerOrdersPage = () => {
  const [tab, setTab] = useState<SellerOrderStatus>("New");
  const loading = useMockLoading();
  const visible = mockOrders.filter((order) => order.status === tab);

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as SellerOrderStatus)}>
        <TabsList className="flex flex-wrap h-auto">
          {(["New", "Processing", "Shipped", "Delivered", "Cancelled", "Returns"] as const).map((status) => (
            <TabsTrigger key={status} value={status}>{status}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-2xl border bg-card p-4">
        {loading ? (
          <SellerSectionLoader rows={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground border-b"><th className="py-2">Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Fulfillment</th><th /></tr></thead>
              <tbody>
                {visible.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-cream/50">
                    <td className="py-3"><p className="font-mono">{order.id}</p><p className="text-xs text-muted-foreground">{order.date}</p></td>
                    <td><div className="flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px]">{order.initials}</span>{order.customer}</div></td>
                    <td>{order.itemCount} items</td>
                    <td>{formatMoney(order.total)}</td>
                    <td><span className={cn("px-2 py-1 rounded-full text-xs", statusBadgeClass(order.status))}>{order.status}</span></td>
                    <td>{order.fulfillment}</td>
                    <td><Link to={`/seller/orders/${order.id}`} className="px-2 py-1 border rounded-md text-xs">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const SellerOrderDetailPage = () => {
  const { id } = useParams();
  const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0];
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [note, setNote] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [status, setStatus] = useState(order.status);

  return (
    <div className="grid xl:grid-cols-[1.8fr_1fr] gap-5">
      <div className="space-y-5">
        <section className="rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">{order.initials}</span>
            <div>
              <p className="font-medium">{order.customer}</p>
              <p className="text-sm text-muted-foreground">{order.customer.toLowerCase().replace(" ", ".")}@mail.com</p>
              <p className="text-xs text-muted-foreground mt-1">3 orders from this customer</p>
            </div>
            <button className="ml-auto px-3 py-2 rounded-lg border text-sm">Email Customer</button>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-4">
          <h3 className="font-display text-lg mb-3">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b text-muted-foreground"><th className="py-2">Item</th><th>Variant</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.name + item.variant} className="border-b">
                    <td className="py-2"><div className="flex items-center gap-2"><img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />{item.name}</div></td>
                    <td>{item.variant}</td>
                    <td>{item.qty}</td>
                    <td>{formatMoney(item.price)}</td>
                    <td>{formatMoney(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-4">
          <h3 className="font-display text-lg mb-3">Shipping address</h3>
          <p className="text-sm">24 Stone Garden Ave, Apt 5B<br />Portland, OR 97205<br />United States</p>
        </section>

        <section className="rounded-2xl border bg-card p-4">
          <h3 className="font-display text-lg mb-3">Order timeline</h3>
          <div className="space-y-2 text-sm">
            {["Order placed", "Confirmed", "Shipped", "Delivered"].map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <span className={cn("w-3 h-3 rounded-full", idx <= 1 ? "bg-accent" : "bg-muted")} />
                <span className={idx <= 1 ? "text-foreground" : "text-muted-foreground"}>{step}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-5">
        <section className="rounded-2xl border bg-card p-4 space-y-2">
          <h3 className="font-display text-lg">Actions</h3>
          {status === "New" && <button className="w-full py-2 rounded-lg bg-emerald-600 text-white text-sm" onClick={() => setStatus("Processing")}>Confirm Order</button>}
          {status === "Processing" && (
            <Dialog open={trackingOpen} onOpenChange={setTrackingOpen}>
              <DialogTrigger asChild><button className="w-full py-2 rounded-lg bg-accent text-accent-foreground text-sm">Mark as Shipped</button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Shipment details</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <select className="w-full px-3 py-2 rounded-lg border bg-background text-sm"><option>Carrier</option><option>UPS</option><option>FedEx</option><option>DHL</option></select>
                  <input className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Tracking number" />
                  <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" defaultChecked />Notify customer</label>
                  <button className="w-full py-2 rounded-lg bg-accent text-accent-foreground text-sm" onClick={() => { setStatus("Shipped"); setTrackingOpen(false); }}>Confirm</button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {status === "Shipped" && <button className="w-full py-2 rounded-lg bg-emerald-600 text-white text-sm" onClick={() => setStatus("Delivered")}>Mark as Delivered</button>}
          <button className="w-full py-2 rounded-lg border text-sm">Print Invoice</button>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full min-h-24 px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Add internal note" />
        </section>

        {order.status === "Returns" && (
          <section className="rounded-2xl border bg-card p-4 space-y-2">
            <h3 className="font-display text-lg">Return request</h3>
            <p className="text-sm text-muted-foreground">Reason: Item arrived damaged</p>
            <input value={returnReason} onChange={(e) => setReturnReason(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Optional reason" />
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 rounded-lg bg-emerald-600 text-white text-sm">Approve Return</button>
              <button className="py-2 rounded-lg bg-destructive text-destructive-foreground text-sm">Reject Return</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export const SellerInventoryPage = () => {
  const [rows, setRows] = useState(mockProducts.map((p) => ({ ...p, threshold: 5 })));
  const [filter, setFilter] = useState<"All" | "Low Stock" | "Out of Stock">("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkQty, setBulkQty] = useState(0);

  const filtered = rows.filter((row) => {
    if (filter === "Low Stock") return row.stock > 0 && row.stock <= row.threshold;
    if (filter === "Out of Stock") return row.stock === 0;
    return true;
  });

  const lowStock = rows.filter((r) => r.stock > 0 && r.stock <= r.threshold);

  return (
    <div className="space-y-4">
      {lowStock.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {lowStock.slice(0, 2).map((item) => (
            <div key={item.id} className="rounded-xl border bg-orange-50 border-orange-200 p-3 flex items-center justify-between">
              <p className="text-sm">{item.name} — Only {item.stock} left!</p>
              <button className="text-sm px-3 py-1.5 rounded-md border bg-white">Restock</button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          {(["All", "Low Stock", "Out of Stock"] as const).map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} className={cn("px-3 py-1.5 rounded-full text-sm", filter === tab ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>
              {tab}
            </button>
          ))}
          {selected.length > 0 && (
            <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
              <DialogTrigger asChild><button className="ml-auto px-3 py-2 rounded-lg border text-sm">Update Stock</button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Bulk stock update</DialogTitle></DialogHeader>
                <input type="number" value={bulkQty} onChange={(e) => setBulkQty(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                <button className="w-full py-2 rounded-lg bg-accent text-accent-foreground text-sm" onClick={() => { setRows((prev) => prev.map((p) => selected.includes(p.id) ? { ...p, stock: bulkQty } : p)); setBulkOpen(false); setSelected([]); }}>Apply</button>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b text-muted-foreground"><th className="py-2"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={(e) => setSelected(e.target.checked ? filtered.map((f) => f.id) : [])} /></th><th>Product</th><th>SKU</th><th>Variants</th><th>Stock</th><th>Threshold</th></tr></thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b hover:bg-cream/50">
                  <td className="py-3"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((prev) => prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id])} /></td>
                  <td><div className="flex items-center gap-2"><img src={item.image} alt={item.name} className="w-9 h-9 rounded-md object-cover" />{item.name}</div></td>
                  <td className="font-mono text-xs">{item.sku}</td>
                  <td>1</td>
                  <td className={cn(item.stock === 0 ? "text-red-600" : item.stock <= item.threshold ? "text-orange-600" : "text-emerald-700")}>
                    {editing === item.id ? (
                      <input
                        type="number"
                        autoFocus
                        defaultValue={item.stock}
                        className="w-20 px-2 py-1 rounded border bg-background"
                        onBlur={(e) => { setRows((prev) => prev.map((p) => p.id === item.id ? { ...p, stock: Number(e.target.value) } : p)); setEditing(null); }}
                        onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                      />
                    ) : (
                      <button className="underline-offset-2 hover:underline" onClick={() => setEditing(item.id)}>{item.stock}</button>
                    )}
                  </td>
                  <td>{item.threshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SellerAnalyticsPage = () => {
  const [range, setRange] = useState("30D");
  const [tab, setTab] = useState<"overview" | "products" | "customers" | "funnel">("overview");
  const [sortKey, setSortKey] = useState<"views" | "conversion" | "revenue">("revenue");

  const topProductRows = [
    { rank: 1, name: "Linen Throw Blanket", views: 1240, carts: 210, purchases: 84, conversion: 6.8, revenue: 5712, image: mockProducts[0].image },
    { rank: 2, name: "Handmade Stone Mug", views: 1042, carts: 171, purchases: 102, conversion: 9.8, revenue: 2448, image: mockProducts[1].image },
    { rank: 3, name: "Cotton Robe", views: 820, carts: 122, purchases: 43, conversion: 5.2, revenue: 3182, image: mockProducts[2].image },
  ].sort((a, b) => b[sortKey] - a[sortKey]);

  const categoryData = [{ name: "Home", value: 48 }, { name: "Kitchen", value: 29 }, { name: "Apparel", value: 23 }];
  const funnelStages = [
    { label: "Product Views", count: 5200 },
    { label: "Add to Cart", count: 1280 },
    { label: "Checkout Started", count: 730 },
    { label: "Purchased", count: 412 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-1 bg-muted rounded-full p-1">
          {["7D", "30D", "90D", "Custom"].map((d) => (
            <button key={d} onClick={() => setRange(d)} className={cn("px-3 py-1 rounded-full text-xs", range === d ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>{d}</button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-3">
            {[
              ["Revenue", "$4,820", "+14%"],
              ["Orders", "132", "+8%"],
              ["Units Sold", "186", "+11%"],
              ["AOV", "$38.4", "-2%"],
              ["Conversion", "3.9%", "+0.4%"],
              ["Refund Rate", "1.2%", "-0.3%"],
            ].map(([label, value, delta]) => (
              <div key={label} className="rounded-xl border bg-card p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-display">{value}</p>
                <p className={cn("text-xs", delta.startsWith("+") ? "text-emerald-600" : "text-red-600")}>{delta}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-card p-4 h-72">
              <h3 className="font-display mb-2">Revenue Over Time</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries["30D"]}>
                  <defs><linearGradient id="analyticsA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--terracotta))" stopOpacity={0.45} /><stop offset="100%" stopColor="hsl(var(--terracotta))" stopOpacity={0.05} /></linearGradient></defs>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip formatter={(v: number) => formatMoney(v)} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--terracotta))" fill="url(#analyticsA)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border bg-card p-4 h-72">
              <h3 className="font-display mb-2">Orders Over Time</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueSeries["30D"].map((d) => ({ ...d, orders: Math.round(d.revenue / 14) }))}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--stone))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border bg-card p-4">
            <h3 className="font-display mb-3">Top products</h3>
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b text-muted-foreground"><th className="py-2">#</th><th>Product</th><th><button onClick={() => setSortKey("views")}>Views</button></th><th>Add to carts</th><th>Purchases</th><th><button onClick={() => setSortKey("conversion")}>Conv %</button></th><th><button onClick={() => setSortKey("revenue")}>Revenue</button></th></tr></thead>
              <tbody>
                {topProductRows.map((row) => (
                  <tr key={row.name} className="border-b">
                    <td className="py-2">{row.rank}</td>
                    <td><div className="flex items-center gap-2"><img src={row.image} alt={row.name} className="w-8 h-8 rounded-md object-cover" />{row.name}</div></td>
                    <td>{row.views}</td><td>{row.carts}</td><td>{row.purchases}</td><td>{row.conversion}%</td><td>{formatMoney(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-4 h-64">
              <h3 className="font-display mb-2">Revenue by category</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" innerRadius={44} outerRadius={70}>
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={["#B36B4C", "#A88E72", "#D8C2A8"][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border bg-card p-4">
              <h3 className="font-display mb-2">Needs attention</h3>
              <ul className="text-sm space-y-1">
                <li>Rattan Storage Basket — 142 views, 0 purchases</li>
                <li>Terracotta Vase — 119 views, 0 purchases</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === "customers" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-card p-4 h-72">
            <h3 className="font-display mb-2">New vs Returning</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries["7D"].map((d, idx) => ({ ...d, new: 12 + idx, returning: 5 + Math.round(idx / 2) }))}>
                <XAxis dataKey="day" /><Tooltip />
                <Bar stackId="a" dataKey="new" fill="hsl(var(--terracotta))" />
                <Bar stackId="a" dataKey="returning" fill="hsl(var(--stone))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Repeat purchase rate</p>
              <p className="text-4xl font-display mt-1">31%</p>
              <Progress className="h-2 mt-3" value={31} />
            </div>
            <div className="rounded-2xl border bg-card p-4">
              <h3 className="font-display mb-2">Top customers</h3>
              <table className="w-full text-sm"><tbody>{["Ariana Shaw", "Kai Morales", "Theo Ford"].map((name, idx) => <tr key={name} className="border-b"><td className="py-2">{name}</td><td>{5 - idx}</td><td>{formatMoney(230 - idx * 40)}</td></tr>)}</tbody></table>
            </div>
          </div>
        </div>
      )}

      {tab === "funnel" && (
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-display mb-4">Conversion Funnel</h3>
          <div className="space-y-4">
            {funnelStages.map((stage, idx) => {
              const prev = idx === 0 ? stage.count : funnelStages[idx - 1].count;
              const pct = idx === 0 ? 100 : (stage.count / prev) * 100;
              const drop = 100 - pct;
              return (
                <div key={stage.label}>
                  <div className="flex justify-between text-sm"><span>{stage.label}</span><span>{stage.count} ({pct.toFixed(1)}%) {idx > 0 && <span className="text-red-600">drop {drop.toFixed(1)}%</span>}</span></div>
                  <div className="h-8 mt-1 rounded-md bg-secondary relative overflow-hidden"><div className="h-full bg-accent" style={{ width: `${Math.max(18, pct)}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const SellerPayoutsPage = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const available = 1240;
  const history = [
    { date: "Apr 11, 2026", amount: 540, status: "Paid", bank: "1244", id: "trf_7H2A0" },
    { date: "Apr 04, 2026", amount: 320, status: "Pending", bank: "1244", id: "trf_7G1C1" },
    { date: "Mar 28, 2026", amount: 290, status: "Failed", bank: "1244", id: "trf_7F9X2" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="rounded-2xl border bg-emerald-50 border-emerald-200 p-4"><p className="text-xs text-emerald-700">Available Balance</p><p className="text-3xl font-display text-emerald-700">$1,240.00</p></div>
        <div className="rounded-2xl border bg-orange-50 border-orange-200 p-4"><p className="text-xs text-orange-700">Pending</p><p className="text-3xl font-display text-orange-700">$380.00</p><p className="text-xs text-orange-700">clears in 7 days</p></div>
        <div className="rounded-2xl border bg-card p-4"><p className="text-xs text-muted-foreground">Total Earned</p><p className="text-3xl font-display">$8,420.00</p></div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm">Request Payout</button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Request payout</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input type="number" value={amount} max={available} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Amount" />
            <p className="text-xs text-muted-foreground">Bank account ending in 1244</p>
            <button disabled={amount <= 0 || amount > available} onClick={() => { setOpen(false); toast({ title: "Payout requested", description: `${formatMoney(amount)} transfer initiated.` }); }} className="w-full py-2 rounded-lg bg-accent text-accent-foreground disabled:opacity-50 text-sm">Transfer to bank</button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-2xl border bg-card p-4">
        <p className="text-sm">Pebble charges <b>8% commission</b> on each sale.</p>
        <p className="text-sm mt-2">This month: sold $520 → commission $41.60 → you keep $478.40</p>
      </div>

      <div className="rounded-2xl border bg-card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground border-b"><th className="py-2">Date</th><th>Amount</th><th>Status</th><th>Bank</th><th>Transfer ID</th></tr></thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.date}</td>
                <td>{formatMoney(item.amount)}</td>
                <td><span className={cn("px-2 py-1 rounded-full text-xs", item.status === "Paid" ? "bg-emerald-100 text-emerald-700" : item.status === "Pending" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700")}>{item.status}</span></td>
                <td>****{item.bank}</td>
                <td className="font-mono text-xs">{item.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <h3 className="font-display text-lg">Connect Bank Account</h3>
        <button className="mt-2 px-4 py-2 rounded-lg border text-sm" onClick={() => toast({ title: "Coming soon", description: "Stripe Connect integration is coming soon." })}>Connect with Stripe</button>
      </div>
    </div>
  );
};

export const SellerDiscountsPage = () => {
  const [tab, setTab] = useState<"Active" | "Expired">("Active");
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("SAVE10");
  const [type, setType] = useState<"Percentage" | "Fixed">("Percentage");
  const [value, setValue] = useState(10);
  const [minOrder, setMinOrder] = useState(30);
  const [usageTotal, setUsageTotal] = useState(100);
  const [usagePerCustomer, setUsagePerCustomer] = useState(1);
  const [specificProducts, setSpecificProducts] = useState(false);

  const cards = [
    { code: "SAVE10", type: "%", value: "10%", usage: "14 / 100", expiry: "May 10, 2026", active: true },
    { code: "SPRING20", type: "$", value: "$20", usage: "6 / 50", expiry: "May 22, 2026", active: true },
    { code: "OLD5", type: "%", value: "5%", usage: "50 / 50", expiry: "Mar 30, 2026", active: false },
  ];

  const shown = cards.filter((c) => (tab === "Active" ? c.active : !c.active));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-full bg-muted p-1">
          {(["Active", "Expired"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={cn("px-3 py-1 text-sm rounded-full", tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>{t}</button>)}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm">Create Coupon</button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Coupon</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm font-mono" placeholder="Code" />
                <button className="px-3 rounded-lg border text-sm" onClick={() => setCode(`SAVE${Math.floor(10 + Math.random() * 80)}`)}>Auto</button>
              </div>
              <select value={type} onChange={(e) => setType(e.target.value as "Percentage" | "Fixed")} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                <option value="Percentage">Percentage off</option>
                <option value="Fixed">Fixed amount off</option>
              </select>
              <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Value" />
              <input type="number" value={minOrder} onChange={(e) => setMinOrder(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Minimum order" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={usageTotal} onChange={(e) => setUsageTotal(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Usage limit total" />
                <input type="number" value={usagePerCustomer} onChange={(e) => setUsagePerCustomer(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Per customer" />
              </div>
              <input type="date" className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
              <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" checked={specificProducts} onChange={(e) => setSpecificProducts(e.target.checked)} />Specific products only</label>
              {specificProducts && (
                <select multiple className="w-full px-3 py-2 rounded-lg border bg-background text-sm h-24">
                  {mockProducts.map((p) => <option key={p.id}>{p.name}</option>)}
                </select>
              )}
              <div className="rounded-xl border bg-muted/40 p-2 text-sm">
                Customer enters <span className="font-mono">{code}</span> → gets {type === "Percentage" ? `${value}% off` : `$${value} off`} orders over ${minOrder}
              </div>
              <button onClick={() => { setOpen(false); toast({ title: "Coupon created", description: `${code} is now active.` }); }} className="w-full py-2 rounded-lg bg-accent text-accent-foreground text-sm">Save</button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {shown.map((card) => (
          <div key={card.code} className="rounded-2xl border bg-card p-4">
            <p className="text-lg font-mono">{card.code}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">{card.type}</Badge>
              <span className="text-sm font-medium">{card.value}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Usage {card.usage}</p>
            <p className="text-xs text-muted-foreground">Expires {card.expiry}</p>
            <div className="mt-3 flex items-center gap-2">
              <label className="text-sm inline-flex items-center gap-1"><input type="checkbox" defaultChecked={card.active} />Active</label>
              <button className="ml-auto p-1.5 rounded-md border"><Pencil className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-md border text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SellerSettingsPage = () => {
  const [tab, setTab] = useState<"identity" | "contact" | "policies" | "shipping" | "danger">("identity");
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [storeName, setStoreName] = useState("Pebble Atelier");
  const [handle, setHandle] = useState("pebble-atelier");
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [zoneCountries, setZoneCountries] = useState("");
  const [zoneRate, setZoneRate] = useState("");
  const [zones, setZones] = useState<{ name: string; countries: string; rate: string }[]>([
    { name: "US", countries: "United States", rate: "$6.00" },
    { name: "Canada", countries: "Canada", rate: "$9.00" },
  ]);
  const [closeStore, setCloseStore] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const uploadAsset = async (bucketPath: string, file: File, setLoading: (value: boolean) => void) => {
    setLoading(true);
    const { error } = await api.storage.upload("store-assets", `${bucketPath}/${Date.now()}-${file.name}`, file);
    setLoading(false);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Uploaded", description: `${file.name} uploaded successfully.` });
  };

  const addZone = (event: FormEvent) => {
    event.preventDefault();
    if (!zoneName || !zoneCountries || !zoneRate) return;
    setZones((prev) => [...prev, { name: zoneName, countries: zoneCountries, rate: zoneRate }]);
    setZoneName("");
    setZoneCountries("");
    setZoneRate("");
  };

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="h-auto flex flex-wrap">
          <TabsTrigger value="identity">Store Identity</TabsTrigger>
          <TabsTrigger value="contact">Contact & Social</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "identity" && (
        <div className="rounded-2xl border bg-card p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="border rounded-xl p-4 text-center cursor-pointer">
              <p className="text-sm">Store logo upload (circular)</p>
              {logoUploading && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadAsset("logo", e.target.files[0], setLogoUploading)} />
            </label>
            <label className="border rounded-xl p-4 text-center cursor-pointer">
              <p className="text-sm">Banner image upload (wide)</p>
              {bannerUploading && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadAsset("banner", e.target.files[0], setBannerUploading)} />
            </label>
          </div>
          <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Store name" />
          <input value={handle} onChange={(e) => setHandle(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Handle" />
          <p className="text-xs text-muted-foreground">pebble.com/store/{handle}</p>
          <input className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Tagline" />
          <textarea className="w-full px-3 py-2 rounded-lg border bg-background text-sm h-28" placeholder="Description" />
          <select className="w-full px-3 py-2 rounded-lg border bg-background text-sm"><option>Primary category</option><option>Home</option><option>Kitchen</option><option>Apparel</option></select>
        </div>
      )}

      {tab === "contact" && (
        <div className="rounded-2xl border bg-card p-4 grid md:grid-cols-2 gap-3">
          {["Business email", "Phone", "Website URL", "Instagram handle", "Twitter handle", "Facebook page", "YouTube channel"].map((field) => (
            <input key={field} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder={field} />
          ))}
        </div>
      )}

      {tab === "policies" && (
        <div className="rounded-2xl border bg-card p-4 space-y-4">
          <PolicyEditor title="Shipping Policy" value={shippingPolicy} setValue={setShippingPolicy} onDefault={() => setShippingPolicy(defaultPolicies.shipping)} />
          <PolicyEditor title="Return Policy" value={returnPolicy} setValue={setReturnPolicy} onDefault={() => setReturnPolicy(defaultPolicies.returns)} />
          <PolicyEditor title="Privacy Policy" value={privacyPolicy} setValue={setPrivacyPolicy} onDefault={() => setPrivacyPolicy(defaultPolicies.privacy)} />
        </div>
      )}

      {tab === "shipping" && (
        <div className="rounded-2xl border bg-card p-4 space-y-4">
          <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" />Free shipping threshold</label>
          <input className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Threshold amount" />
          <input className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Flat rate shipping amount" />
          <select className="w-full px-3 py-2 rounded-lg border bg-background text-sm"><option>Estimated processing time</option><option>1-2 days</option><option>3-5 days</option><option>1 week</option><option>2 weeks</option></select>
          <div className="rounded-xl border p-3">
            <h4 className="font-medium mb-2">Shipping zones</h4>
            <table className="w-full text-sm mb-3">
              <thead><tr className="text-left border-b text-muted-foreground"><th className="py-2">Zone</th><th>Countries</th><th>Rate</th></tr></thead>
              <tbody>{zones.map((zone) => <tr key={zone.name + zone.rate} className="border-b"><td className="py-2">{zone.name}</td><td>{zone.countries}</td><td>{zone.rate}</td></tr>)}</tbody>
            </table>
            <form onSubmit={addZone} className="grid md:grid-cols-4 gap-2">
              <input value={zoneName} onChange={(e) => setZoneName(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Zone name" />
              <input value={zoneCountries} onChange={(e) => setZoneCountries(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Countries" />
              <input value={zoneRate} onChange={(e) => setZoneRate(e.target.value)} className="px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Rate" />
              <button className="px-3 py-2 rounded-lg border text-sm">Add zone</button>
            </form>
          </div>
        </div>
      )}

      {tab === "danger" && (
        <div className="rounded-2xl border bg-card p-4 space-y-4">
          <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" checked={closeStore} onChange={(e) => setCloseStore(e.target.checked)} />Temporarily close store</label>
          {closeStore && <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm">This store is temporarily closed.</div>}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild><button className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm">Permanently delete store</button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Confirm deletion</DialogTitle></DialogHeader>
              <p className="text-sm text-muted-foreground">Type your store name to confirm: <b>{storeName}</b></p>
              <input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
              <button disabled={deleteConfirm !== storeName} className="w-full py-2 rounded-lg bg-destructive text-destructive-foreground text-sm disabled:opacity-50">Delete store</button>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

function PolicyEditor({ title, value, setValue, onDefault }: { title: string; value: string; setValue: (value: string) => void; onDefault: () => void }) {
  return (
    <div className="border rounded-xl p-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <button onClick={onDefault} className="text-xs px-2 py-1 rounded-md border">Use default template</button>
      </div>
      <textarea value={value} onChange={(e) => setValue(e.target.value)} className="mt-2 w-full h-28 px-3 py-2 rounded-lg border bg-background text-sm" />
    </div>
  );
}

export const SellerReviewsPage = () => {
  const [filter, setFilter] = useState("All");
  const [openReply, setOpenReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Record<string, string>>({ "rv-2": "Thanks so much for your thoughtful feedback!" });
  const reviews = [
    { id: "rv-1", name: "Ariana Shaw", initials: "AS", date: "Apr 16, 2026", verified: true, product: mockProducts[0], stars: 5, title: "Absolutely love it", body: "Quality is excellent and shipping was quick." },
    { id: "rv-2", name: "Kai Morales", initials: "KM", date: "Apr 14, 2026", verified: true, product: mockProducts[2], stars: 4, title: "Really soft fabric", body: "Fits great, color is slightly darker than expected." },
    { id: "rv-3", name: "Lena Park", initials: "LP", date: "Apr 11, 2026", verified: false, product: mockProducts[1], stars: 3, title: "Good mug", body: "Arrived safely but packaging could be better." },
  ];
  const visible = reviews.filter((r) => filter === "All" || filter === "Unreplied" ? (filter === "Unreplied" ? !replies[r.id] : true) : r.stars === Number(filter));
  const average = (reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div><p className="text-3xl font-display">{average}</p><p className="text-xs text-muted-foreground">{reviews.length} total reviews</p></div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.stars === star).length;
              return <div key={star} className="flex items-center gap-2 text-xs"><span className="w-6">{star}★</span><Progress value={(count / reviews.length) * 100} className="h-1.5" /><span>{count}</span></div>;
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "5", "4", "3", "2", "1", "Unreplied"].map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)} className={cn("px-3 py-1.5 rounded-full text-sm", filter === tab ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>
            {tab.includes("Un") ? tab : `${tab}★`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((review) => (
          <div key={review.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs">{review.initials}</span>
                <div><p className="text-sm font-medium">{review.name}</p><p className="text-xs text-muted-foreground">{review.date}</p></div>
                {review.verified && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Verified</span>}
              </div>
              <div className="flex items-center gap-2">
                <img src={review.product.image} alt={review.product.name} className="w-8 h-8 rounded-md object-cover" />
                <p className="text-xs text-muted-foreground">{review.product.name}</p>
              </div>
            </div>
            <p className="mt-2 text-sm">{Array.from({ length: review.stars }).map((_, i) => <Star key={i} className="w-4 h-4 inline fill-current text-amber-500" />)}</p>
            <p className="mt-1 font-medium">{review.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{review.body}</p>

            {!replies[review.id] ? (
              openReply === review.id ? (
                <div className="mt-3 space-y-2">
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm h-20" placeholder="Reply as store owner..." />
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm" onClick={() => { setReplies((prev) => ({ ...prev, [review.id]: replyText })); setReplyText(""); setOpenReply(null); }}>Post Reply</button>
                    <button className="px-3 py-2 rounded-lg border text-sm" onClick={() => setOpenReply(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setOpenReply(review.id)} className="mt-3 px-3 py-2 rounded-lg border text-sm">Reply</button>
              )
            ) : (
              <div className="mt-3 rounded-lg bg-cream p-3 text-sm">
                <p className="text-xs text-muted-foreground mb-1">Store Owner</p>
                <p>{replies[review.id]}</p>
                <div className="mt-2 flex gap-2">
                  <button className="text-xs px-2 py-1 rounded border" onClick={() => { setOpenReply(review.id); setReplyText(replies[review.id]); setReplies((prev) => { const next = { ...prev }; delete next[review.id]; return next; }); }}>Edit</button>
                  <button className="text-xs px-2 py-1 rounded border text-destructive" onClick={() => setReplies((prev) => { const next = { ...prev }; delete next[review.id]; return next; })}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SellerNotificationsPage = () => {
  const loading = useMockLoading(550);
  const notifications = [
    "3 new orders placed in the last 2 hours.",
    "Stock alert: Cotton Robe is below threshold.",
    "New 5★ review on Handmade Stone Mug.",
    "Payout of $540 marked as paid.",
  ];
  return (
    <div className="rounded-2xl border bg-card p-4">
      <h3 className="font-display text-lg mb-3">Notifications</h3>
      {loading ? (
        <SellerSectionLoader rows={4} />
      ) : (
        <ul className="space-y-2">
          {notifications.map((item) => (
            <li key={item} className="rounded-lg border p-3 text-sm hover:bg-cream/50">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const SellerHelpPage = () => {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="inline-flex items-center gap-2 text-accent mb-2"><HelpCircle className="w-5 h-5" />Seller Help</div>
      <h2 className="text-2xl font-display mb-2">Need help running your store?</h2>
      <p className="text-sm text-muted-foreground mb-4">Reach our support team anytime for payout, order, and catalog help.</p>
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { title: "Seller Guide", text: "Best practices for listings and fulfillment." },
          { title: "Live Chat", text: "Average response in under 5 minutes." },
          { title: "Email Support", text: "support@pebble.com" },
        ].map((card) => (
          <div key={card.title} className="rounded-xl border p-3">
            <p className="font-medium">{card.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

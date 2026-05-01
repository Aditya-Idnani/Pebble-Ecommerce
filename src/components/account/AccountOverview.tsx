import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, Heart, Award, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useWishlistStore } from '@/stores/wishlist';
import { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { useCountUp } from './useCountUp';
import { ProductImage } from '@/components/ProductImage';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const statCards = [
  { icon: Package, label: 'Total Orders', value: 12, color: 'bg-accent/10 text-accent' },
  { icon: Truck, label: 'Pending Deliveries', value: 2, color: 'bg-blue-500/10 text-blue-600' },
  { icon: Heart, label: 'Wishlist Items', value: 0, color: 'bg-pink-500/10 text-pink-600' },
  { icon: Award, label: 'Reward Points', value: 840, color: 'bg-amber-500/10 text-amber-600' },
];

const statusColors: Record<string, string> = {
  processing: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  return_requested: 'bg-purple-100 text-purple-800',
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export const AccountOverview = () => {
  const { profile, user } = useAuthStore();
  const wishlistCount = useWishlistStore(s => s.items.length);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const data = await orderService.fetchUserOrders(user.id);
        const mapped = data.map((o: any) => ({
          id: o.id,
          orderNumber: o.id.split('-')[0].toUpperCase(),
          date: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: o.status,
          total: o.total,
          items: o.order_items.map((i: any) => ({
            id: i.id,
            name: `Product ${i.product_id}`,
            image: `https://via.placeholder.com/150?text=Product+${i.product_id}`,
            qty: i.quantity,
            price: i.price,
          }))
        }));
        setUserOrders(mapped);
      } catch (e) {}
    };
    fetchOrders();
  }, [user]);

  const recentOrders = userOrders.slice(0, 3);
  const totalOrders = userOrders.length;
  
  const updatedStatCards = statCards.map(c => {
    if (c.label === 'Total Orders') return { ...c, value: totalOrders };
    if (c.label === 'Wishlist Items') return { ...c, value: wishlistCount };
    return c;
  });

  const cards = updatedStatCards;

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
      {/* Greeting */}
      <motion.div variants={fadeUp}>
        <h1 className="font-display text-2xl lg:text-3xl text-foreground">
          {getGreeting()}, {profile?.display_name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="font-body text-muted-foreground text-sm mt-1">Here's what's happening with your account.</p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </motion.div>

      {/* Recent Orders */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg">Recent Orders</h2>
          <Link to="/account/orders" className="text-sm text-accent hover:underline font-body flex items-center gap-1">
            View all orders <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="border rounded-xl overflow-hidden bg-card">
          {recentOrders.map((order, i) => (
            <Link key={order.id} to={`/account/orders/${order.id}`}
              className={`flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors ${i < recentOrders.length - 1 ? 'border-b' : ''}`}>
              <div className="flex -space-x-2">
                {order.items.slice(0, 2).map(item => (
                  <div key={item.id} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-card">
                    <ProductImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-mono border-2 border-card">
                    +{order.items.length - 2}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-foreground">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground font-body">{order.date}</p>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-body ${statusColors[order.status] || ''}`}>
                {order.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </span>
              <span className="text-sm font-mono font-medium">${order.total.toFixed(2)}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Profile Completion */}
      <motion.div variants={fadeUp}>
        <div className="border rounded-xl p-5 bg-card">
          <h3 className="font-display text-base mb-2">Complete Your Profile</h3>
          <p className="text-xs text-muted-foreground font-body mb-3">Complete your profile to unlock rewards and better recommendations.</p>
          <div className="w-full bg-muted rounded-full h-2 mb-3">
            <div className="bg-accent h-2 rounded-full transition-all" style={{ width: '60%' }} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { label: 'Add avatar', done: !!profile?.avatar_url },
              { label: 'Add phone number', done: false },
              { label: 'Add address', done: true },
              { label: 'Write first review', done: true },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${item.done ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {item.done ? '✓' : '○'}
                </span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => {
  const display = useCountUp(value);
  return (
    <div className="border rounded-xl p-4 bg-card hover:shadow-sm transition-shadow">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="font-display text-2xl">{display}</p>
      <p className="text-xs text-muted-foreground font-body">{label}</p>
    </div>
  );
};

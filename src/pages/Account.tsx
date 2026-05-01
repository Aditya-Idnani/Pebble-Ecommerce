import { useAuthStore } from '@/stores/auth';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, CreditCard, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Account = () => {
  const { user, profile } = useAuthStore();

  const cards = [
    { icon: Package, label: 'My Orders', desc: 'Track and manage your orders', to: '/account/orders' },
    { icon: Heart, label: 'Wishlist', desc: 'Saved items for later', to: '/account/wishlist' },
    { icon: MapPin, label: 'Addresses', desc: 'Manage shipping addresses', to: '/account/addresses' },
    { icon: CreditCard, label: 'Payment Methods', desc: 'Saved payment options', to: '/account/payments' },
    { icon: Bell, label: 'Notifications', desc: 'Alerts and updates', to: '/account/notifications' },
    { icon: Settings, label: 'Settings', desc: 'Profile and security', to: '/account/settings' },
  ];

  return (
    <div className="container py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-8">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-accent" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-mono font-medium">
              {(profile?.display_name || user?.email || '?')[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl text-foreground">{profile?.display_name || 'Your Account'}</h1>
            <p className="font-body text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(({ icon: Icon, label, desc, to }) => (
            <Link key={label} to={to}
              className="group p-6 rounded-xl border bg-card hover:shadow-md hover:border-accent/30 transition-all">
              <Icon className="w-6 h-6 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-lg text-foreground mb-1">{label}</h3>
              <p className="font-body text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Account;

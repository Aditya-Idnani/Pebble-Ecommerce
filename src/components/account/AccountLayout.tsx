import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import {
  Home, Package, Heart, MapPin, CreditCard, Star, Bell, Gift,
  User, Shield, LifeBuoy, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { to: '/account', icon: Home, label: 'Overview', end: true },
  { to: '/account/orders', icon: Package, label: 'My Orders' },
  { to: '/account/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/account/addresses', icon: MapPin, label: 'Addresses' },
  { to: '/account/payments', icon: CreditCard, label: 'Payment Methods' },
  { to: '/account/reviews', icon: Star, label: 'My Reviews' },
  { to: '/account/notifications', icon: Bell, label: 'Notifications', badge: 2 },
  { to: '/account/rewards', icon: Gift, label: 'Rewards & Referrals' },
  { to: '/account/profile', icon: User, label: 'Profile Settings' },
  { to: '/account/security', icon: Shield, label: 'Security' },
  { to: '/account/help', icon: LifeBuoy, label: 'Help & Support' },
];

const mobileLinks = [
  { to: '/account', icon: Home, label: 'Overview', end: true },
  { to: '/account/orders', icon: Package, label: 'Orders' },
  { to: '/account/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/account/notifications', icon: Bell, label: 'Alerts', badge: 2 },
  { to: '/account/profile', icon: User, label: 'Profile' },
];

export const AccountLayout = () => {
  const { user, profile, signOut } = useAuthStore();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)] pb-20">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t flex items-center justify-around h-16 px-2">
          {mobileLinks.map(({ to, icon: Icon, label, end, badge }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-0.5 text-[10px] font-body relative py-1 px-2 rounded-lg transition-colors",
                isActive ? "text-accent" : "text-muted-foreground"
              )}>
              <Icon className="w-5 h-5" />
              {badge && <span className="absolute -top-0.5 right-0 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] flex items-center justify-center font-mono">{badge}</span>}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r bg-card/50 flex flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {/* User info */}
        <div className="p-5 border-b">
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-display font-medium">
                {(profile?.display_name || user?.email || '?')[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-display text-sm text-foreground truncate">{profile?.display_name || 'Your Account'}</p>
              <p className="text-[11px] text-muted-foreground truncate font-body">{user?.email}</p>
            </div>
          </div>
          <NavLink to="/account/profile" className="text-[11px] text-accent hover:underline font-body mt-1.5 inline-block">
            Edit Profile
          </NavLink>
        </div>

        {/* Links */}
        <nav className="flex-1 py-2 px-2 space-y-0.5">
          {sidebarLinks.map(({ to, icon: Icon, label, end, badge }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body transition-all relative",
                isActive
                  ? "bg-accent/15 text-accent font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
              {badge && (
                <span className="ml-auto w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-mono">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign out + version */}
        <div className="p-2 border-t">
          <button onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="text-[10px] text-muted-foreground/50 font-mono px-3 mt-1">Pebble v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 lg:p-8 max-w-5xl"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

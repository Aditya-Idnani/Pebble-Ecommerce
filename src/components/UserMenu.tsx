import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, LayoutDashboard, Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

export const UserMenu = () => {
  const { user, profile, role, isAuthenticated, signOut } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
          Login
        </Link>
        <Link to="/signup"
          className="text-sm font-body bg-accent text-accent-foreground px-3 py-1.5 rounded-full hover:bg-accent/90 transition-colors">
          Sign Up
        </Link>
      </div>
    );
  }

  const initials = (profile?.display_name || user?.email || '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    toast({ title: 'Signed out', description: 'You have been signed out successfully.' });
    navigate('/');
  };

  return (
    <div ref={menuRef} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 group">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-accent transition-colors" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-mono font-medium">
            {initials}
          </div>
        )}
        {!isMobile && profile?.display_name && (
          <span className="text-sm font-body text-foreground max-w-[100px] truncate">{profile.display_name.split(' ')[0]}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-card rounded-lg border shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b bg-secondary/30">
              <p className="text-sm font-body font-medium text-foreground truncate">{profile?.display_name || 'User'}</p>
              <p className="text-xs font-body text-muted-foreground truncate">{user?.email}</p>
            </div>
            <div className="py-1">
              <MenuLink to="/account" icon={User} label="My Account" onClick={() => setOpen(false)} />
              <MenuLink to="/account/orders" icon={Package} label="My Orders" onClick={() => setOpen(false)} />
              <MenuLink to="/account/wishlist" icon={Heart} label="Wishlist" onClick={() => setOpen(false)} />
              {role === 'seller' && (
                <MenuLink to="/seller" icon={LayoutDashboard} label="Seller Dashboard" onClick={() => setOpen(false)} />
              )}
              {role === 'admin' && (
                <MenuLink to="/admin" icon={Shield} label="Admin Panel" onClick={() => setOpen(false)} />
              )}
            </div>
            <div className="border-t py-1">
              <button onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-body text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function MenuLink({ to, icon: Icon, label, onClick }: { to: string; icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-foreground hover:bg-secondary transition-colors">
      <Icon className="w-4 h-4 text-muted-foreground" /> {label}
    </Link>
  );
}

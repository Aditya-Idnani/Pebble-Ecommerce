import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchOverlay } from '@/components/SearchOverlay';
import { UserMenu } from '@/components/UserMenu';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header = () => {
  const { toggle, itemCount } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const count = itemCount();

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-2xl text-foreground tracking-tight">
          pebble
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {[['Shop', '/shop'], ['Collections', '/collections'], ['Deals', '/deals'], ['Sellers', '/sellers'], ['About', '/about']].map(([label, href]) => (
            <Link key={label} to={href} className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 relative">
          <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <Search className="w-5 h-5 text-foreground" />
          </button>
          
          {/* Desktop search dropdown */}
          {!isMobile && <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} isMobile={false} />}

          <button onClick={toggle} className="relative p-2 hover:bg-secondary rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-mono rounded-full flex items-center justify-center"
              >
                {count}
              </motion.span>
            )}
          </button>

          <UserMenu />

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search overlay */}
      {isMobile && <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} isMobile={true} />}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t"
          >
            <nav className="container py-4 flex flex-col gap-3">
              {[['Shop', '/shop'], ['Collections', '/collections'], ['Deals', '/deals'], ['Sellers', '/sellers'], ['About', '/about']].map(([label, href]) => (
                <Link key={label} to={href} onClick={() => setMenuOpen(false)} className="text-lg font-display text-foreground py-1">
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

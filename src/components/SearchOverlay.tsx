import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { ProductImage } from '@/components/ProductImage';

const RECENT_KEY = 'pebble_recent_searches';
const MAX_RECENT = 5;
const MAX_RESULTS = 6;

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch { return []; }
}

function saveRecentSearch(q: string) {
  const recent = getRecentSearches().filter(s => s !== q);
  recent.unshift(q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

// For now search against local data; will switch to backend full-text when products are in DB
function searchProducts(query: string) {
  const q = query.toLowerCase();
  return products
    .filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    .slice(0, MAX_RESULTS);
}

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const SearchOverlay = ({ isOpen, onClose, isMobile }: SearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof products>([]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setShowRecent(true);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); setShowRecent(true); return; }
    setShowRecent(false);
    debounceRef.current = setTimeout(() => {
      setResults(searchProducts(q));
    }, 300);
  }, []);

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    saveRecentSearch(q.trim());
    onClose();
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  const handleProductClick = (slug: string) => {
    if (query.trim()) saveRecentSearch(query.trim());
    onClose();
    navigate(`/product/${slug}`);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!isMobile && isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose();
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile, isOpen, onClose]);

  const recentSearches = getRecentSearches();
  const hasQuery = query.trim().length > 0;

  const ResultsContent = () => (
    <div className="divide-y divide-border">
      {!hasQuery && showRecent && recentSearches.length > 0 && (
        <div className="p-3">
          <p className="text-xs font-body text-muted-foreground mb-2 uppercase tracking-wider">Recent Searches</p>
          {recentSearches.map((s, i) => (
            <button key={i} onClick={() => { setQuery(s); handleSearch(s); }}
              className="block w-full text-left text-sm font-body text-foreground py-1.5 px-2 rounded hover:bg-secondary transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
      {hasQuery && results.length > 0 && (
        <>
          {results.map(p => (
            <button key={p.id} onClick={() => handleProductClick(p.slug)}
              className="flex items-center gap-3 w-full p-3 hover:bg-secondary transition-colors text-left">
              <div className="w-10 h-10 rounded-md bg-secondary overflow-hidden flex-shrink-0">
                <ProductImage src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body text-foreground truncate">{p.title}</p>
                <p className="text-xs font-mono text-muted-foreground">${p.price}</p>
              </div>
            </button>
          ))}
          <button onClick={() => handleSubmit(query)}
            className="flex items-center justify-between w-full p-3 text-sm font-body text-accent hover:bg-secondary transition-colors">
            See all results for "{query}" <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}
      {hasQuery && results.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-sm font-body text-muted-foreground mb-2">No results for "{query}"</p>
          <button onClick={() => { onClose(); navigate('/collections'); }}
            className="text-sm font-body text-accent hover:underline">Browse categories →</button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background">
            <div className="flex items-center gap-2 p-4 border-b">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input ref={inputRef} value={query} onChange={e => handleSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(query)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-foreground font-body text-base outline-none placeholder:text-muted-foreground" />
              <button onClick={onClose} className="p-1"><X className="w-5 h-5 text-foreground" /></button>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-65px)]">
              <ResultsContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div ref={containerRef} initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute right-0 top-full mt-1 z-50 overflow-hidden">
          <div className="bg-card rounded-lg border shadow-lg">
            <div className="flex items-center gap-2 p-3 border-b">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input ref={inputRef} value={query} onChange={e => handleSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(query)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-sm text-foreground font-body outline-none placeholder:text-muted-foreground" />
              <button onClick={onClose} className="p-0.5"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <ResultsContent />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

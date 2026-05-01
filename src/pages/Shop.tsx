import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { products, categories, type Product } from '@/data/products';
import { useCartStore } from '@/stores/cart';
import { QuickViewModal } from '@/components/QuickViewModal';
import { ProductImage } from '@/components/ProductImage';
import {
  SlidersHorizontal, Grid3X3, List, X, ChevronDown, ChevronUp,
  Heart, ShoppingBag, Star, Eye, Store, Search,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const allTags = [...new Set(products.flatMap(p => p.tags))];
const priceRange = { min: Math.min(...products.map(p => p.price)), max: Math.max(...products.map(p => p.price)) };
const ITEMS_PER_PAGE = 12;

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'rating', label: 'Top Rated' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const addItem = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.open);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'relevance';
  const view = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  const minPrice = Number(searchParams.get('minPrice')) || priceRange.min;
  const maxPrice = Number(searchParams.get('maxPrice')) || priceRange.max;
  const minRating = Number(searchParams.get('rating')) || 0;
  const inStockOnly = searchParams.get('inStock') === 'true';
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [expandedSections, setExpandedSections] = useState({ category: true, price: true, rating: true, availability: false, tags: false });

  const setParam = useCallback((key: string, value: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value === null || value === '') next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const clearAllFilters = () => { setSearchParams({}, { replace: true }); };

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
    setParam('tags', next.length > 0 ? next.join(',') : null);
  };

  const hasActiveFilters = category !== 'All' || minPrice > priceRange.min || maxPrice < priceRange.max || minRating > 0 || inStockOnly || selectedTags.length > 0;

  const activeChips: { label: string; clear: () => void }[] = [];
  if (category !== 'All') activeChips.push({ label: category, clear: () => setParam('category', null) });
  if (minPrice > priceRange.min || maxPrice < priceRange.max) activeChips.push({ label: `$${minPrice}–$${maxPrice}`, clear: () => { setParam('minPrice', null); setParam('maxPrice', null); } });
  if (minRating > 0) activeChips.push({ label: `${minRating}★ & up`, clear: () => setParam('rating', null) });
  if (inStockOnly) activeChips.push({ label: 'In Stock', clear: () => setParam('inStock', null) });
  selectedTags.forEach(tag => activeChips.push({ label: tag, clear: () => toggleTag(tag) }));

  const filtered = useMemo(() => {
    let result = products;
    if (category !== 'All') result = result.filter(p => p.category === category);
    result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);
    if (inStockOnly) result = result.filter(p => p.stock > 0);
    if (selectedTags.length > 0) result = result.filter(p => selectedTags.some(t => p.tags.includes(t)));
    return [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'bestseller') return b.reviewCount - a.reviewCount;
      return 0;
    });
  }, [category, sort, minPrice, maxPrice, minRating, inStockOnly, selectedTags]);

  const visible = filtered.slice(0, displayCount);
  const allLoaded = displayCount >= filtered.length;

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || allLoaded) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setDisplayCount(c => c + ITEMS_PER_PAGE);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [allLoaded, filtered.length]);

  useEffect(() => { setDisplayCount(ITEMS_PER_PAGE); }, [category, sort, minPrice, maxPrice, minRating, inStockOnly, selectedTags.join(',')]);

  const toggleSection = (key: keyof typeof expandedSections) => setExpandedSections(s => ({ ...s, [key]: !s[key] }));

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-foreground">Filters</h3>
        {hasActiveFilters && <button onClick={clearAllFilters} className="text-xs font-body text-accent hover:underline">Clear all</button>}
      </div>
      <div>
        <button onClick={() => toggleSection('category')} className="flex items-center justify-between w-full py-2">
          <span className="text-sm font-body font-medium text-foreground">Category</span>
          {expandedSections.category ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSections.category && (
          <div className="space-y-1 mt-1">
            {categories.map(cat => (
              <button key={cat} onClick={() => setParam('category', cat === 'All' ? null : cat)}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm font-body transition-colors ${category === cat ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-secondary'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full py-2">
          <span className="text-sm font-body font-medium text-foreground">Price Range</span>
          {expandedSections.price ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSections.price && (
          <div className="mt-3 px-1">
            <Slider min={priceRange.min} max={priceRange.max} step={5} value={[minPrice, maxPrice]}
              onValueChange={([lo, hi]) => { setParam('minPrice', lo > priceRange.min ? String(lo) : null); setParam('maxPrice', hi < priceRange.max ? String(hi) : null); }} className="mb-2" />
            <div className="flex justify-between text-xs font-mono text-muted-foreground"><span>${minPrice}</span><span>${maxPrice}</span></div>
          </div>
        )}
      </div>
      <div>
        <button onClick={() => toggleSection('rating')} className="flex items-center justify-between w-full py-2">
          <span className="text-sm font-body font-medium text-foreground">Rating</span>
          {expandedSections.rating ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2 mt-1">
            {[4, 3, 2].map(r => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={minRating === r} onChange={() => setParam('rating', minRating === r ? null : String(r))} className="rounded border-border" />
                <span className="text-sm font-body text-foreground flex items-center gap-1">{r}<Star className="w-3 h-3 fill-stone text-stone" /> & up</span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div>
        <button onClick={() => toggleSection('availability')} className="flex items-center justify-between w-full py-2">
          <span className="text-sm font-body font-medium text-foreground">Availability</span>
          {expandedSections.availability ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSections.availability && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-body text-foreground">In Stock only</span>
            <Switch checked={inStockOnly} onCheckedChange={v => setParam('inStock', v ? 'true' : null)} />
          </div>
        )}
      </div>
      <div>
        <button onClick={() => toggleSection('tags')} className="flex items-center justify-between w-full py-2">
          <span className="text-sm font-body font-medium text-foreground">Tags</span>
          {expandedSections.tags ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {expandedSections.tags && (
          <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-body transition-colors ${selectedTags.includes(tag) ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ShopProductCard = ({ product, index }: { product: Product; index: number }) => {
    const [liked, setLiked] = useState(false);
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }} className="group">
        <div className="relative overflow-hidden rounded-2xl bg-card aspect-square mb-3">
          <Link to={`/product/${product.slug}`}>
            <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
              <ProductImage src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            </div>
          </Link>
          {product.comparePrice && (
            <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-mono px-2.5 py-1 rounded-full">
              -{Math.round((1 - product.price / product.comparePrice) * 100)}%
            </span>
          )}
          <button onClick={() => setLiked(!liked)}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center transition-opacity ${liked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button onClick={() => setQuickView(product)} className="flex-1 bg-card/90 backdrop-blur text-foreground py-2 rounded-full text-xs font-body font-medium flex items-center justify-center gap-1 hover:bg-card transition-colors">
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
            <button onClick={() => { addItem(product); openCart(); }} className="bg-accent text-accent-foreground p-2.5 rounded-full hover:opacity-90 transition-opacity">
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="space-y-1 px-0.5">
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-body"><Store className="w-3 h-3" /> {product.seller}</div>
          <h3 className="font-display text-foreground text-sm leading-tight line-clamp-2">{product.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-stone text-stone" />
            <span className="text-xs font-mono text-muted-foreground">{product.rating} ({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-foreground font-medium">${product.price}</span>
            {product.comparePrice && <span className="font-mono text-muted-foreground text-sm line-through">${product.comparePrice}</span>}
          </div>
        </div>
      </motion.div>
    );
  };

  const ListProductCard = ({ product, index }: { product: Product; index: number }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.2) }} className="group flex gap-4 bg-card rounded-2xl p-3 hover:shadow-md transition-shadow">
      <Link to={`/product/${product.slug}`} className="flex-shrink-0 w-[120px] h-[120px] rounded-xl overflow-hidden">
        <ProductImage src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0 py-1">
        <p className="text-xs text-muted-foreground font-body flex items-center gap-1"><Store className="w-3 h-3" />{product.seller}</p>
        <Link to={`/product/${product.slug}`}><h3 className="font-display text-foreground text-sm mt-0.5 hover:text-accent transition-colors">{product.title}</h3></Link>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 fill-stone text-stone" />
          <span className="text-xs font-mono text-muted-foreground">{product.rating} ({product.reviewCount})</span>
        </div>
        <p className="text-xs text-muted-foreground font-body mt-1 line-clamp-1">{product.description}</p>
      </div>
      <div className="flex flex-col items-end justify-between py-1">
        <div className="text-right">
          <span className="font-mono text-foreground font-medium">${product.price}</span>
          {product.comparePrice && <span className="block font-mono text-muted-foreground text-xs line-through">${product.comparePrice}</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setQuickView(product)} className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"><Eye className="w-3.5 h-3.5 text-foreground" /></button>
          <button onClick={() => { addItem(product); openCart(); }} className="p-2 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity"><ShoppingBag className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-4xl md:text-5xl text-foreground">Shop</h1>
        <p className="text-muted-foreground font-body mt-1">Explore our curated collection of artisan goods</p>
      </motion.div>

      <div className="flex gap-8">
        {!isMobile && (
          <aside className="w-[260px] flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-none">
            <FilterContent />
          </aside>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-body">
                    <SlidersHorizontal className="w-4 h-4" /> Filter {hasActiveFilters && <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">{activeChips.length}</span>}
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl max-h-[80vh] overflow-y-auto">
                  <SheetHeader><SheetTitle className="font-display">Filters</SheetTitle></SheetHeader>
                  <div className="mt-4"><FilterContent /></div>
                </SheetContent>
              </Sheet>
            )}
            <span className="text-sm font-body text-muted-foreground">Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeChips.map(chip => (
                  <span key={chip.label} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-body">
                    {chip.label}<button onClick={chip.clear}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">
              <select value={sort} onChange={e => setParam('sort', e.target.value === 'relevance' ? null : e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-body text-foreground">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button onClick={() => setParam('view', 'grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setParam('view', view === 'list' ? null : 'list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <svg className="w-24 h-24 mx-auto mb-6 text-muted-foreground/30" viewBox="0 0 100 100" fill="currentColor">
                <ellipse cx="50" cy="55" rx="40" ry="35" /><ellipse cx="50" cy="50" rx="35" ry="30" opacity="0.5" />
              </svg>
              <h3 className="font-display text-xl text-foreground mb-2">Nothing matches your filters</h3>
              <p className="text-sm text-muted-foreground font-body mb-6">Try adjusting your filters or browse our categories</p>
              <button onClick={clearAllFilters} className="px-6 py-2.5 rounded-full bg-accent text-accent-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity">Clear Filters</button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((p, i) => <ShopProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {visible.map((p, i) => <ListProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}

          {!allLoaded && filtered.length > 0 && (
            <div ref={loaderRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3"><Skeleton className="aspect-square rounded-2xl" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
              ))}
            </div>
          )}
          {allLoaded && filtered.length > ITEMS_PER_PAGE && (
            <p className="text-center text-sm text-muted-foreground font-body py-8">All products loaded</p>
          )}
        </div>
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
};

export default Shop;

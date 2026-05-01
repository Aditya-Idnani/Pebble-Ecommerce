import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Heart, ShoppingBag, Minus, Plus, ArrowLeft, ArrowRight, Truck, RefreshCw,
  Shield, Share2, MapPin, ChevronRight, X, Check, Store, BadgeCheck, ThumbsUp, Camera, Loader2,
} from 'lucide-react';
import { products, mockReviews } from '@/data/products';
import { useCartStore } from '@/stores/cart';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ProductImage } from '@/components/ProductImage';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/* ─── Recently Viewed Hook ─── */
const useRecentlyViewed = (currentSlug: string) => {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('pebble_recently_viewed') || '[]') as string[];
    const updated = [currentSlug, ...stored.filter(s => s !== currentSlug)].slice(0, 9);
    localStorage.setItem('pebble_recently_viewed', JSON.stringify(updated));
    setItems(updated.filter(s => s !== currentSlug).slice(0, 8));
  }, [currentSlug]);
  return items.map(s => products.find(p => p.slug === s)).filter(Boolean) as typeof products;
};

/* ─── Confetti burst ─── */
const ConfettiBurst = () => (
  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
    {[...Array(6)].map((_, i) => {
      const angle = (i / 6) * 360;
      const rad = (angle * Math.PI) / 180;
      return (
        <span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-accent"
          style={{
            animation: `confetti-burst 0.6s ease-out forwards`,
            animationDelay: `${i * 0.03}s`,
            ['--tx' as string]: `${Math.cos(rad) * 20}px`,
            ['--ty' as string]: `${Math.sin(rad) * 20}px`,
          }}
        />
      );
    })}
  </span>
);

/* ─── Rating breakdown ─── */
const ratingDistribution = [
  { stars: 5, pct: 60 }, { stars: 4, pct: 25 }, { stars: 3, pct: 8 },
  { stars: 2, pct: 5 }, { stars: 1, pct: 2 },
];

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.slug === slug);
  const addItem = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.open);

  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [addedState, setAddedState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewStars, setReviewStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);

  const reviewsRef = useRef<HTMLDivElement>(null);
  const recentlyViewed = useRecentlyViewed(slug || '');

  useEffect(() => { setMainImg(0); setQty(1); setAddedState('idle'); window.scrollTo(0, 0); }, [slug]);

  const handleAddToCart = useCallback(() => {
    if (!product || addedState !== 'idle') return;
    setAddedState('loading');
    setTimeout(() => {
      for (let i = 0; i < qty; i++) addItem(product);
      setAddedState('done');
      setTimeout(() => setAddedState('idle'), 2000);
    }, 400);
  }, [product, qty, addItem, addedState]);

  const handleWishlist = () => {
    setLiked(!liked);
    if (!liked) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 700); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="font-display text-2xl text-foreground">Product not found</p>
        <Link to="/shop" className="text-accent mt-4 inline-block font-body">Back to shop</Link>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);
  const sellerProducts = products.filter(p => p.seller === product.seller && p.id !== product.id).slice(0, 6);
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  const filteredReviews = mockReviews.filter(r => {
    if (reviewFilter === 'all') return true;
    if (reviewFilter === 'photos') return r.images.length > 0;
    return r.rating === parseInt(reviewFilter);
  });

  return (
    <div className="min-h-screen">
      <div className="container py-6 md:py-10">
        {/* Breadcrumb */}
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm font-body text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-foreground transition-colors">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
        </motion.nav>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* ─── LEFT: Image Gallery ─── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {/* Main image */}
            <div
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream cursor-zoom-in group"
              onClick={() => setLightbox(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <ProductImage
                    src={product.images[mainImg]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[400ms]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-none pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(i)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === mainImg ? 'border-accent' : 'border-transparent hover:border-border'
                  }`}
                >
                  <ProductImage src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* ─── RIGHT: Product Info ─── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-foreground leading-tight">{product.title}</h1>
              {/* Seller row */}
              <div className="flex items-center gap-2.5 mt-3">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <Store className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <Link to="/shop" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">{product.seller}</Link>
                <span className="flex items-center gap-1 text-xs font-mono text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </span>
              </div>
              {/* Rating */}
              <button onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 mt-3 group/rating">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-stone text-stone' : 'text-border'}`} />
                  ))}
                </div>
                <span className="text-sm font-mono text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground font-body group-hover/rating:underline">({product.reviewCount} reviews)</span>
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl text-foreground font-semibold">${product.price}</span>
              {product.comparePrice && (
                <>
                  <span className="font-mono text-lg text-muted-foreground line-through">${product.comparePrice}</span>
                  <span className="text-sm font-mono bg-accent/10 text-accent px-2.5 py-1 rounded-full font-medium">
                    Save ${product.comparePrice - product.price} ({discount}% off)
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock === 0 ? (
                <><span className="w-2 h-2 rounded-full bg-destructive" /><span className="text-sm font-body text-destructive">Out of Stock</span></>
              ) : product.stock <= 5 ? (
                <><span className="w-2 h-2 rounded-full bg-orange-500" /><span className="text-sm font-body text-orange-600">Only {product.stock} left!</span></>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-green-500" /><span className="text-sm font-body text-green-700">In Stock</span></>
              )}
            </div>

            {/* Color variants */}
            {product.variants?.colors && (
              <div>
                <p className="text-sm font-body text-muted-foreground mb-2">Color: <span className="text-foreground">{product.variants.colors[selectedColor].name}</span></p>
                <div className="flex gap-2">
                  {product.variants.colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(i)}
                      title={c.name}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${i === selectedColor ? 'border-foreground scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size variants */}
            {product.variants?.sizes && (
              <div>
                <p className="text-sm font-body text-muted-foreground mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((s, i) => (
                    <button
                      key={s.label}
                      onClick={() => s.inStock && setSelectedSize(i)}
                      disabled={!s.inStock}
                      className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                        !s.inStock
                          ? 'bg-muted text-muted-foreground/40 cursor-not-allowed line-through'
                          : i === selectedSize
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-body text-muted-foreground">Quantity</span>
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-l-full transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono text-sm">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-r-full transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedState !== 'idle'}
                className={`w-full py-3.5 rounded-xl font-body font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  addedState === 'done'
                    ? 'bg-green-600 text-white'
                    : 'bg-accent text-accent-foreground hover:opacity-90'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedState === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : addedState === 'done' ? (
                  <><Check className="w-5 h-5" /> Added to Cart!</>
                ) : (
                  <><ShoppingBag className="w-5 h-5" /> Add to Cart — ${product.price * qty}</>
                )}
              </button>
              <button
                onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                className="w-full py-3.5 rounded-xl border border-foreground text-foreground font-body font-semibold hover:bg-foreground hover:text-card transition-colors"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist + Share */}
            <div className="flex items-center gap-6">
              <button onClick={handleWishlist} className="relative flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                <Heart className={`w-5 h-5 transition-all ${liked ? 'fill-accent text-accent scale-110' : ''}`} />
                {liked ? 'Saved' : 'Save to Wishlist'}
                {showConfetti && <ConfettiBurst />}
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            {/* Delivery check */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-body font-medium text-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Check Delivery</p>
              <div className="flex gap-2">
                <input
                  type="text" placeholder="Enter pincode" value={pincode}
                  onChange={e => { setPincode(e.target.value); setDeliveryChecked(false); }}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <button onClick={() => setDeliveryChecked(true)} className="px-4 py-2 bg-foreground text-card rounded-lg text-sm font-body font-medium hover:opacity-90 transition-opacity">
                  Check
                </button>
              </div>
              {deliveryChecked && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-body text-green-700 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Estimated delivery: 3–5 business days
                </motion.p>
              )}
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'Orders $50+' },
                { icon: RefreshCw, label: '30-Day Returns', desc: 'Hassle-free' },
                { icon: Shield, label: 'Secure Checkout', desc: 'SSL encrypted' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 mx-auto text-stone mb-1" />
                  <span className="text-xs font-body font-medium text-foreground block">{label}</span>
                  <span className="text-[10px] font-body text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>

            {/* Seller card */}
            <div className="border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Store className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-medium text-foreground">{product.seller}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-stone text-stone" /> {product.rating}
                    <span>·</span>
                    <span>{products.filter(p => p.seller === product.seller).length} products</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/shop" className="flex-1 py-2 rounded-lg bg-secondary text-foreground text-sm font-body font-medium text-center hover:bg-secondary/80 transition-colors">
                  Visit Store
                </Link>
                <button
                  onClick={() => setFollowing(!following)}
                  className={`flex-1 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
                    following ? 'bg-accent text-accent-foreground' : 'border border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── TABS ─── */}
        <div ref={reviewsRef} className="mt-16 md:mt-24">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 gap-0 h-auto overflow-x-auto scrollbar-none">
              {['description', 'specifications', 'reviews', 'shipping'].map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-body capitalize text-sm"
                >
                  {tab === 'shipping' ? 'Shipping & Returns' : tab} {tab === 'reviews' && `(${product.reviewCount})`}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Description */}
            <TabsContent value="description" className="pt-8">
              <div className="max-w-3xl space-y-4">
                <p className="text-muted-foreground font-body leading-relaxed text-base">{product.description}</p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground font-body">
                  <li>Handmade with care by skilled artisans</li>
                  <li>Sustainably sourced materials</li>
                  <li>Each piece is unique with natural variations</li>
                  <li>Packaged with recycled materials</li>
                </ul>
                <div className="flex flex-wrap gap-3 pt-4">
                  {[
                    { icon: '🌿', label: 'Sustainable' },
                    { icon: '✋', label: 'Handmade' },
                    { icon: '♻️', label: 'Eco-Packaged' },
                    { icon: '🏷️', label: 'Fair Trade' },
                  ].map(f => (
                    <span key={f.label} className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-sm font-body">
                      {f.icon} {f.label}
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Specifications */}
            <TabsContent value="specifications" className="pt-8">
              <div className="max-w-2xl rounded-xl overflow-hidden border border-border">
                {product.specs && Object.entries(product.specs).map(([key, val], i) => (
                  <div key={key} className={`grid grid-cols-2 text-sm font-body ${i % 2 === 0 ? 'bg-secondary/30' : 'bg-card'}`}>
                    <span className="px-5 py-3 text-muted-foreground font-medium">{key}</span>
                    <span className="px-5 py-3 text-foreground">{val}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="pt-8">
              <div className="grid lg:grid-cols-[300px_1fr] gap-10">
                {/* Summary sidebar */}
                <div className="space-y-5">
                  <div className="text-center lg:text-left">
                    <p className="font-display text-5xl text-foreground">{product.rating}</p>
                    <div className="flex justify-center lg:justify-start mt-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? 'fill-stone text-stone' : 'text-border'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-body mt-1">{product.reviewCount} reviews</p>
                  </div>
                  {ratingDistribution.map(r => (
                    <div key={r.stars} className="flex items-center gap-2">
                      <span className="text-xs font-mono w-5 text-right">{r.stars}★</span>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${r.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="h-full bg-stone rounded-full" />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-8">{r.pct}%</span>
                    </div>
                  ))}
                  <button onClick={() => setShowWriteReview(true)} className="w-full py-2.5 rounded-xl border border-accent text-accent font-body font-semibold hover:bg-accent/5 transition-colors text-sm">
                    Write a Review
                  </button>
                </div>

                {/* Reviews list */}
                <div className="space-y-6">
                  {/* Filter pills */}
                  <div className="flex flex-wrap gap-2">
                    {['all', '5', '4', '3', 'photos'].map(f => (
                      <button
                        key={f}
                        onClick={() => setReviewFilter(f)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-body transition-colors ${
                          reviewFilter === f ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {f === 'all' ? 'All' : f === 'photos' ? 'With Photos' : `${f}★`}
                      </button>
                    ))}
                  </div>

                  {filteredReviews.map(review => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-display text-foreground">
                        {review.avatar ? (
                          <img src={review.avatar} alt={review.author} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          review.author.split(' ').map(n => n[0]).join('')
                        )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-body font-medium text-foreground">{review.author}</span>
                            {review.verified && (
                              <span className="text-[10px] font-mono text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Verified</span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground font-body">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-stone text-stone' : 'text-border'}`} />
                        ))}
                      </div>
                      <p className="font-body font-medium text-foreground text-sm mb-1">{review.title}</p>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">{review.body}</p>
                      {review.images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {review.images.map((img, i) => (
                            <ProductImage key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                          ))}
                        </div>
                      )}
                      <button className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                        <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Shipping */}
            <TabsContent value="shipping" className="pt-8">
              <div className="max-w-3xl grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-stone" />
                    <h3 className="font-display text-lg text-foreground">Shipping Policy</h3>
                  </div>
                  <div className="text-sm text-muted-foreground font-body space-y-2 leading-relaxed">
                    <p>Free standard shipping on all orders over $50. Orders are processed within 1–2 business days.</p>
                    <p><strong className="text-foreground">Standard Shipping:</strong> 3–5 business days (Free over $50, $4.99 otherwise)</p>
                    <p><strong className="text-foreground">Express Shipping:</strong> 1–2 business days ($12.99)</p>
                    <p>International shipping available to select countries. Rates calculated at checkout.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-stone" />
                    <h3 className="font-display text-lg text-foreground">Return Policy</h3>
                  </div>
                  <div className="text-sm text-muted-foreground font-body space-y-2 leading-relaxed">
                    <p>We accept returns within 30 days of delivery. Items must be in original condition with all packaging.</p>
                    <p><strong className="text-foreground">How to return:</strong> Contact our support team with your order number. We'll provide a prepaid return label.</p>
                    <p><strong className="text-foreground">Refunds:</strong> Processed within 5–7 business days after we receive the item.</p>
                    <p>Handmade items with minor natural variations are not eligible for returns due to appearance.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* ─── Carousels ─── */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl text-foreground">Customers Also Bought</h2>
              <Link to="/shop" className="text-sm font-body text-accent hover:underline">View All</Link>
            </div>
            <div className="flex gap-6 overflow-x-auto scrollbar-none pb-4">
              {related.map((p, i) => (
                <div key={p.id} className="min-w-[220px] max-w-[220px]">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}

        {sellerProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl text-foreground">More from {product.seller}</h2>
              <Link to="/shop" className="text-sm font-body text-accent hover:underline">View All</Link>
            </div>
            <div className="flex gap-6 overflow-x-auto scrollbar-none pb-4">
              {sellerProducts.map((p, i) => (
                <div key={p.id} className="min-w-[220px] max-w-[220px]">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}

        {recentlyViewed.length > 0 && (
          <section className="mt-16 mb-10">
            <h2 className="font-display text-2xl text-foreground mb-8">Recently Viewed</h2>
            <div className="flex gap-6 overflow-x-auto scrollbar-none pb-4">
              {recentlyViewed.map((p, i) => (
                <div key={p.id} className="min-w-[180px] max-w-[180px]">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ─── Mobile sticky bottom bar ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex items-center gap-4 z-40">
        <div>
          <span className="font-mono text-xl text-foreground font-semibold">${product.price}</span>
          {product.comparePrice && <span className="font-mono text-sm text-muted-foreground line-through ml-2">${product.comparePrice}</span>}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || addedState !== 'idle'}
          className={`flex-1 py-3 rounded-xl font-body font-semibold flex items-center justify-center gap-2 transition-all ${
            addedState === 'done' ? 'bg-green-600 text-white' : 'bg-accent text-accent-foreground'
          }`}
        >
          {addedState === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> :
           addedState === 'done' ? <><Check className="w-5 h-5" /> Added!</> :
           <><ShoppingBag className="w-5 h-5" /> Add to Cart</>}
        </button>
      </div>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button onClick={() => setLightbox(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-card/10 flex items-center justify-center">
              <X className="w-5 h-5 text-card" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); setMainImg(i => (i - 1 + product.images.length) % product.images.length); }}
              className="absolute left-4 md:left-8 w-10 h-10 rounded-full bg-card/10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-card" />
            </button>
            <motion.div
              key={mainImg}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <ProductImage
                src={product.images[mainImg]}
                alt={product.title}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              />
            </motion.div>
            <button
              onClick={e => { e.stopPropagation(); setMainImg(i => (i + 1) % product.images.length); }}
              className="absolute right-4 md:right-8 w-10 h-10 rounded-full bg-card/10 flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5 text-card" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Write Review Modal ─── */}
      <AnimatePresence>
        {showWriteReview && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowWriteReview(false)}
          >
            <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-card rounded-2xl p-6 md:p-8 max-w-lg w-full space-y-5"
            >
              <button onClick={() => setShowWriteReview(false)} className="absolute top-4 right-4">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <h3 className="font-display text-xl text-foreground">Write a Review</h3>
              <div>
                <p className="text-sm font-body text-muted-foreground mb-2">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)} onClick={() => setReviewStars(s)}>
                      <Star className={`w-7 h-7 transition-colors ${s <= (hoverStar || reviewStars) ? 'fill-stone text-stone' : 'text-border'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <input type="text" placeholder="Review title" className="w-full bg-secondary border-0 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/30" />
              <textarea placeholder="Tell us about your experience..." rows={4} className="w-full bg-secondary border-0 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                <Camera className="w-4 h-4" /> Add photos (optional)
              </div>
              <button
                onClick={() => { setShowWriteReview(false); toast.success('Review submitted! Thank you.'); }}
                className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-body font-semibold hover:opacity-90 transition-opacity"
              >
                Submit Review
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;

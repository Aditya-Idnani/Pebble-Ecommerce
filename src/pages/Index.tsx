import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown, Shield, Truck, RefreshCw, BadgeCheck, Heart, Star, Store, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { useCartStore } from '@/stores/cart';
import { ProductImage } from '@/components/ProductImage';
import { toast } from 'sonner';

const FloatingCircle = ({ size, x, y, delay }: { size: number; x: string; y: string; delay: number }) => (
  <div
    className="absolute rounded-full bg-stone/15 pointer-events-none"
    style={{ width: size, height: size, left: x, top: y, animation: `drift ${18 + delay * 4}s ease-in-out ${delay}s infinite alternate` }}
  />
);

const mockSellers = [
  { name: 'Artisan Studio', products: 48, rating: 4.8, tagline: 'Handcrafted ceramics & pottery' },
  { name: 'Woven Stories', products: 35, rating: 4.9, tagline: 'Premium textiles & linens' },
  { name: 'Timber & Grain', products: 62, rating: 4.7, tagline: 'Sustainable woodwork' },
];

const Index = () => {
  const addItem = useCartStore(s => s.addItem);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const words = ['Curated', 'craft.', 'Timeless', 'design.'];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); toast.success('Welcome to the Pebble community!'); }
  };

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-sand via-cream to-background" />
        <FloatingCircle size={400} x="5%" y="10%" delay={0} />
        <FloatingCircle size={250} x="60%" y="5%" delay={2} />
        <FloatingCircle size={320} x="75%" y="55%" delay={1} />
        <FloatingCircle size={180} x="20%" y="65%" delay={3} />
        <FloatingCircle size={140} x="85%" y="80%" delay={1.5} />
        <div className="container relative z-10 py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm font-body uppercase tracking-[0.3em] text-muted-foreground mb-8">
            The Artisan Marketplace
          </motion.p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] text-foreground leading-[0.95] max-w-5xl flex flex-wrap gap-x-5">
            {words.map((word, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }} className="inline-block">
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mt-8 max-w-lg text-muted-foreground text-lg font-body leading-relaxed">
            Discover handcrafted goods from verified artisans. Every piece tells a story of tradition, sustainability, and care.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="mt-10 flex flex-wrap gap-4">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-full font-body font-semibold hover:opacity-90 transition-opacity">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/sellers" className="inline-flex items-center gap-2 border border-foreground text-foreground px-8 py-3.5 rounded-full font-body font-medium hover:bg-foreground hover:text-card transition-colors">
              Start Selling
            </Link>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ NEW ARRIVALS — Asymmetric Masonry ═══ */}
      <section className="container py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground mb-2">Just In</p>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl md:text-4xl text-foreground">New Arrivals</h2>
            <Link to="/shop" className="text-sm font-body text-accent hover:underline flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-[280px]">
          {products.slice(0, 8).map((p, i) => (
            <motion.div
              key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className={`group relative overflow-hidden rounded-2xl bg-card ${i === 0 ? 'row-span-2' : ''}`}
            >
              <Link to={`/product/${p.slug}`} className="block w-full h-full">
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                  <ProductImage src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                </div>
                {p.comparePrice && (
                  <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-mono px-2 py-0.5 rounded-full">Sale</span>
                )}
                <button onClick={(e) => { e.preventDefault(); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                </button>
              </Link>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-4 pt-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-card font-display text-sm">{p.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-card font-mono text-sm">${p.price}</span>
                  <span className="text-card/60 text-xs font-body">{p.seller}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ TRENDING STRIP ═══ */}
      <section className="py-20 overflow-hidden">
        <div className="container mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground mb-2">Trending Now</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">What's Hot</h2>
          </motion.div>
        </div>
        <div className="flex gap-5 overflow-x-auto scrollbar-none px-[max(1rem,calc((100vw-1400px)/2+2rem))] pb-4">
          {products.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex-shrink-0 w-[280px] md:w-[320px] group">
              <Link to={`/product/${p.slug}`}>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-3">
                  <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <ProductImage src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute top-3 left-3 bg-card/90 backdrop-blur text-foreground text-xs font-body px-3 py-1 rounded-full">{p.category}</span>
                </div>
                <h3 className="font-display text-foreground text-sm">{p.title}</h3>
                <span className="font-mono text-muted-foreground text-sm">${p.price}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ SELLER SPOTLIGHT ═══ */}
      <section className="container py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground mb-2">Featured</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Seller Spotlight</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockSellers.map((seller, i) => (
            <motion.div key={seller.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl overflow-hidden bg-card group">
              <div className="h-32 bg-gradient-to-br from-stone/40 via-accent/20 to-cream relative">
                <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-full bg-card border-4 border-card flex items-center justify-center">
                  <Store className="w-6 h-6 text-stone" />
                </div>
              </div>
              <div className="p-6 pt-10">
                <h3 className="font-display text-foreground text-lg">{seller.name}</h3>
                <p className="text-sm text-muted-foreground font-body mt-1">{seller.tagline}</p>
                <div className="flex items-center gap-4 mt-3 text-xs font-body text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-stone text-stone" />{seller.rating}</span>
                  <span>{seller.products} products</span>
                </div>
                <Link to="/shop" className="mt-4 inline-flex items-center gap-1 text-sm font-body text-accent hover:underline">
                  Visit Store <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="container py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl text-foreground">How Pebble Works</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="pr-0 md:pr-12 md:border-r border-border pb-10 md:pb-0">
            <h3 className="font-display text-xl text-foreground mb-8">For Shoppers</h3>
            {[
              { num: '01', title: 'Browse & Discover', desc: 'Explore curated collections from verified artisans worldwide.' },
              { num: '02', title: 'Add to Cart', desc: 'Select your favorites and check out with secure payment.' },
              { num: '03', title: 'Enjoy Quality', desc: 'Receive handcrafted goods shipped with care to your door.' },
            ].map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-5 mb-8 last:mb-0">
                <span className="font-display text-4xl text-muted/50 leading-none">{step.num}</span>
                <div>
                  <h4 className="font-display text-foreground text-base">{step.title}</h4>
                  <p className="text-sm text-muted-foreground font-body mt-1">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="pl-0 md:pl-12 pt-10 md:pt-0">
            <h3 className="font-display text-xl text-foreground mb-8">For Sellers</h3>
            {[
              { num: '01', title: 'Create Your Store', desc: 'Set up your shop in minutes with our simple onboarding.' },
              { num: '02', title: 'List Products', desc: 'Upload photos, set prices, and tell your product story.' },
              { num: '03', title: 'Get Paid Fast', desc: 'Low commissions and quick payouts to your bank account.' },
            ].map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-5 mb-8 last:mb-0">
                <span className="font-display text-4xl text-muted/50 leading-none">{step.num}</span>
                <div>
                  <h4 className="font-display text-foreground text-base">{step.title}</h4>
                  <p className="text-sm text-muted-foreground font-body mt-1">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section className="bg-cream py-14">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Secure Checkout', desc: 'SSL encryption on every transaction' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free return policy' },
              { icon: BadgeCheck, title: 'Verified Sellers', desc: 'Every artisan vetted for quality' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over $50' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
                <div className="w-12 h-12 rounded-full bg-card mx-auto mb-3 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-stone" />
                </div>
                <h3 className="font-display text-sm text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground font-body mt-1">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="container py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-foreground rounded-3xl p-10 md:p-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-card mb-4">Stay in the Loop</h2>
          <p className="text-card/60 font-body max-w-md mx-auto mb-8">
            Be the first to know about new collections, artisan stories, and exclusive offers.
          </p>
          <AnimatePresence mode="wait">
            {!subscribed ? (
              <motion.form key="form" onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" exit={{ opacity: 0, scale: 0.95 }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 px-5 py-3 rounded-full bg-card/10 border border-card/20 text-card placeholder:text-card/40 font-body text-sm focus:outline-none focus:border-card/40" />
                <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-8 py-3 rounded-full bg-accent text-accent-foreground font-body font-semibold hover:opacity-90 transition-opacity">
                  Subscribe
                </motion.button>
              </motion.form>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 text-card">
                <div className="w-8 h-8 rounded-full bg-moss flex items-center justify-center"><Check className="w-4 h-4 text-card" /></div>
                <span className="font-body font-medium">You're on the list!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;

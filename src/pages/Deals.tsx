import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Clock, Flame, Tag, Package, Star, ShoppingBag } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/stores/cart';
import { Link } from 'react-router-dom';
import dealsHero from '@/assets/deals-hero.jpg';

const DEAL_END = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6h from now

const useCountdown = (target: Date) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
};

type Tab = 'today' | 'clearance' | 'bundles';

const dealProducts = products.filter(p => p.comparePrice);
const clearanceProducts = products.filter(p => p.stock <= 5);

const Deals = () => {
  const [tab, setTab] = useState<Tab>('today');
  const { h, m, s } = useCountdown(DEAL_END);
  const addItem = useCartStore(s => s.addItem);

  const displayed = tab === 'today' ? dealProducts : tab === 'clearance' ? clearanceProducts : products.slice(0, 3);

  return (
    <div>
      {/* Hero with countdown */}
      <section className="relative h-[50vh] overflow-hidden">
        <img src={dealsHero} alt="Flash deals" className="w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-accent" />
              <span className="text-sm font-body uppercase tracking-[0.2em] text-accent">Flash Sale Live</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-4xl md:text-6xl text-card max-w-2xl"
            >
              Deals That Won't Last
            </motion.h1>
            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 mt-8"
            >
              {[
                { val: String(h).padStart(2, '0'), label: 'Hours' },
                { val: String(m).padStart(2, '0'), label: 'Minutes' },
                { val: String(s).padStart(2, '0'), label: 'Seconds' },
              ].map(unit => (
                <div key={unit.label} className="bg-card/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-card/10">
                  <span className="font-mono text-3xl md:text-4xl text-card font-medium">{unit.val}</span>
                  <p className="text-card/50 font-body text-xs mt-1 uppercase tracking-wider">{unit.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="container py-10">
        <div className="flex gap-3 mb-10 border-b border-border pb-4">
          {[
            { key: 'today' as Tab, label: "Today's Deals", icon: Tag },
            { key: 'clearance' as Tab, label: 'Clearance', icon: Clock },
            { key: 'bundles' as Tab, label: 'Bundle Offers', icon: Package },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm transition-all ${
                tab === t.key
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Deal cards — distinct from /shop */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl overflow-hidden border border-border group"
            >
              <div className="relative aspect-[4/3] bg-cream flex items-center justify-center overflow-hidden">
                <span className="font-display text-stone italic text-lg px-4 text-center">{product.title}</span>
                {/* Discount badge — prominent */}
                {product.comparePrice && (
                  <div className="absolute top-0 right-0 bg-accent text-accent-foreground font-mono text-sm font-bold px-4 py-2 rounded-bl-2xl">
                    {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                  </div>
                )}
                {/* Urgency */}
                {product.stock <= 5 && (
                  <div className="absolute bottom-3 left-3 bg-foreground/80 text-card text-xs font-mono px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-accent" />
                    Only {product.stock} left!
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{product.seller}</p>
                <h3 className="font-display text-lg text-foreground">{product.title}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-stone text-stone" />
                  <span className="text-xs font-mono text-muted-foreground">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl text-accent font-bold">${product.price}</span>
                    {product.comparePrice && (
                      <span className="font-mono text-sm text-muted-foreground line-through">${product.comparePrice}</span>
                    )}
                  </div>
                  {product.comparePrice && (
                    <span className="bg-moss/10 text-moss font-mono text-xs px-2.5 py-1 rounded-full">
                      Save ${product.comparePrice - product.price}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-body font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Grab This Deal
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {displayed.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-foreground mb-2">No deals right now</p>
            <p className="text-muted-foreground font-body">Check back soon — new deals drop daily.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Deals;

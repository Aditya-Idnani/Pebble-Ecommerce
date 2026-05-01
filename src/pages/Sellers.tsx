import { motion } from 'framer-motion';
import { Zap, BarChart3, DollarSign, Rocket, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import sellersHero from '@/assets/sellers-hero.jpg';

const Sellers = () => (
  <div>
    {/* Hero */}
    <section className="relative h-[60vh] overflow-hidden">
      <img src={sellersHero} alt="Sell on Pebble" className="w-full h-full object-cover" width={1920} height={800} />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      <div className="absolute inset-0 flex items-center">
        <div className="container">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-body uppercase tracking-[0.3em] text-card/70 mb-4"
          >
            For Artisans & Makers
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-6xl text-card max-w-2xl leading-tight"
          >
            Your craft deserves a stage.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-card/70 font-body mt-4 max-w-lg text-lg"
          >
            Reach thousands of customers who value handmade quality. No corporate middlemen — just you, your craft, and people who care.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <button className="mt-8 inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-full font-body font-semibold hover:opacity-90 transition-opacity">
              Start Selling <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Benefits grid */}
    <section className="container py-20">
      <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-14">Why Sellers Love Pebble</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Rocket, title: 'Easy Setup', desc: 'List your first product in under 10 minutes. Drag-and-drop uploads, guided forms, instant publishing.' },
          { icon: DollarSign, title: 'Low Commission', desc: 'Just 8% per sale — one of the lowest in the industry. You keep more of what you earn.' },
          { icon: BarChart3, title: 'Rich Analytics', desc: 'Track views, conversions, top products, and customer demographics in real time.' },
          { icon: Zap, title: 'Fast Payouts', desc: 'Get paid within 3 business days via direct deposit. No holding periods, no surprises.' },
        ].map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-7 border border-border"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
              <b.icon className="w-6 h-6 text-stone" />
            </div>
            <h3 className="font-display text-lg text-foreground mb-2">{b.title}</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section className="bg-card py-20">
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-14">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Create Your Store', desc: 'Sign up, add your logo and bio, and set your shipping policies. Takes about 5 minutes.' },
            { step: '02', title: 'List Your Products', desc: 'Upload beautiful photos, write descriptions, set prices and variants. Our AI helps with SEO.' },
            { step: '03', title: 'Start Earning', desc: 'Orders flow in. Pack with care, ship on time, and watch your artisan business grow.' },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <span className="font-mono text-5xl text-stone/30 font-bold">{s.step}</span>
              <h3 className="font-display text-xl text-foreground mt-4 mb-3">{s.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="container py-20">
      <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-14">Seller Stories</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: 'Maria Gonzalez', store: 'Barro Studio', quote: 'Pebble helped me turn my weekend pottery hobby into a thriving business. The community here actually values handmade.' },
          { name: 'Akira Tanaka', store: 'Woodcraft Kyoto', quote: 'The low commission rate means I can price my pieces fairly. My customers on Pebble understand the work that goes into each item.' },
          { name: 'Sophie Laurent', store: 'Lin et Pierre', quote: 'The analytics dashboard is incredible. I can see exactly what my customers love and plan my next collection around real data.' },
        ].map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="bg-cream rounded-2xl p-8 relative"
          >
            <Quote className="w-8 h-8 text-stone/20 mb-4" />
            <p className="text-foreground font-body leading-relaxed mb-6 italic">"{t.quote}"</p>
            <div>
              <p className="font-display text-sm text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground font-body">{t.store}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Final CTA */}
    <section className="container pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-foreground rounded-3xl p-10 md:p-16 text-center"
      >
        <h2 className="font-display text-3xl md:text-4xl text-card mb-4">Ready to Sell?</h2>
        <p className="text-card/60 font-body max-w-md mx-auto mb-8 text-lg">
          Join 500+ artisans already growing their business on Pebble. Setup is free — you only pay when you sell.
        </p>
        <button className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-10 py-4 rounded-full font-body font-semibold text-lg hover:opacity-90 transition-opacity">
          Start Selling Today <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </section>
  </div>
);

export default Sellers;

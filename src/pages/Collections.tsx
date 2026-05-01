import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import collectionsHero from '@/assets/collections-hero.jpg';
import collectionHome from '@/assets/collection-home.jpg';
import collectionKitchen from '@/assets/collection-kitchen.jpg';
import collectionApparel from '@/assets/collection-apparel.jpg';
import collectionLighting from '@/assets/collection-lighting.jpg';

const collections = [
  { name: 'Home & Living', slug: 'Home', items: 342, image: collectionHome, desc: 'Vases, throws, and décor crafted with organic warmth.' },
  { name: 'Kitchen & Table', slug: 'Kitchen', items: 218, image: collectionKitchen, desc: 'Handmade stoneware, boards, and tools for mindful cooking.' },
  { name: 'Apparel & Textiles', slug: 'Apparel', items: 156, image: collectionApparel, desc: 'Organic cotton, linen, and sustainably dyed fabrics.' },
  { name: 'Lighting & Ambiance', slug: 'Lighting', items: 89, image: collectionLighting, desc: 'Brass lamps, candle holders, and warm-glow fixtures.' },
];

const Collections = () => (
  <div>
    {/* Hero */}
    <section className="relative h-[50vh] overflow-hidden">
      <img src={collectionsHero} alt="Curated collections" className="w-full h-full object-cover" width={1920} height={800} />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 container pb-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-body uppercase tracking-[0.3em] text-card/70 mb-3"
        >
          Explore
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl md:text-6xl text-card max-w-2xl"
        >
          Curated Collections
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-card/70 font-body mt-4 max-w-lg text-lg"
        >
          Handpicked groupings of artisan goods, each telling a cohesive story of craft and intention.
        </motion.p>
      </div>
    </section>

    {/* Collection Cards — editorial masonry */}
    <section className="container py-16">
      <div className="grid md:grid-cols-2 gap-8">
        {collections.map((col, i) => (
          <motion.div
            key={col.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
            className={`group relative overflow-hidden rounded-3xl ${i === 0 ? 'md:row-span-2 aspect-[3/4]' : 'aspect-[4/3]'}`}
          >
            <img
              src={col.image}
              alt={col.name}
              loading="lazy"
              width={800}
              height={800}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-mono text-xs text-card/60 uppercase tracking-wider mb-2">{col.items} Items</p>
              <h3 className="font-display text-2xl md:text-3xl text-card mb-2">{col.name}</h3>
              <p className="text-card/70 font-body text-sm mb-5 max-w-sm">{col.desc}</p>
              <Link
                to={`/shop?collection=${col.slug}`}
                className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm text-card px-6 py-2.5 rounded-full font-body text-sm border border-card/20 hover:bg-card/30 transition-colors"
              >
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Bottom CTA */}
    <section className="container pb-20">
      <div className="bg-card rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Can't decide?</h2>
          <p className="text-muted-foreground font-body mt-2">Browse all products and discover something unexpected.</p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-full font-body font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Shop Everything <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  </div>
);

export default Collections;

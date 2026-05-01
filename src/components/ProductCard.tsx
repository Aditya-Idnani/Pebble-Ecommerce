import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCartStore } from '@/stores/cart';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ProductImage } from '@/components/ProductImage';

interface Props {
  product: Product;
  index?: number;
  onQuickView?: (product: Product) => void;
}

export const ProductCard = ({ product, index = 0, onQuickView }: Props) => {
  const addItem = useCartStore(s => s.addItem);
  const open = useCartStore(s => s.open);
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`}>
        <div className="relative overflow-hidden rounded-2xl bg-card aspect-[3/4] mb-4">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} className="w-full h-full">
            <ProductImage
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
          {product.comparePrice && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-mono px-2.5 py-1 rounded-full">
              -{Math.round((1 - product.price / product.comparePrice) * 100)}%
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-3 right-12 bg-foreground/80 text-card text-xs font-mono px-2.5 py-1 rounded-full">
              Only {product.stock} left
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              className="absolute bottom-3 left-3 right-12 bg-card/90 backdrop-blur text-foreground py-2 rounded-xl text-xs font-body font-medium flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
          )}
          <motion.button
            onClick={(e) => { e.preventDefault(); addItem(product); open(); }}
            className="absolute bottom-3 right-3 bg-foreground text-card p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.button>
        </div>
      </Link>
      <div className="space-y-1.5 px-1">
        <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{product.seller}</p>
        <h3 className="font-display text-foreground text-base leading-tight line-clamp-2">{product.title}</h3>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-stone text-stone" />
          <span className="text-xs font-mono text-muted-foreground">{product.rating} ({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-foreground font-medium">${product.price}</span>
          {product.comparePrice && (
            <span className="font-mono text-muted-foreground text-sm line-through">${product.comparePrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

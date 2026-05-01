import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

const ConfettiDot = ({ index }: { index: number }) => {
  const angle = (index / 20) * 360;
  const rad = (angle * Math.PI) / 180;
  const distance = 60 + Math.random() * 40;
  const colors = ['hsl(var(--accent))', 'hsl(var(--moss))', 'hsl(var(--stone))', '#f0d78c', '#c4654a'];
  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{ x: Math.cos(rad) * distance, y: Math.sin(rad) * distance, scale: 0, opacity: 0 }}
      transition={{ duration: 0.8 + Math.random() * 0.4, delay: Math.random() * 0.3 }}
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: colors[index % colors.length] }}
    />
  );
};

const OrderConfirmation = () => {
  const clearCart = useCartStore(s => s.clearCart);
  const user = useAuthStore(s => s.user);
  const [orderNum] = useState(() => `PBL-2026-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`);

  useEffect(() => { clearCart(); }, [clearCart]);

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 5);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-lg w-full py-16">
        {/* Animated checkmark */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Confetti */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(20)].map((_, i) => <ConfettiDot key={i} index={i} />)}
          </div>
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            initial="hidden"
            animate="visible"
          >
            <motion.circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="hsl(var(--moss))"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <motion.path
              d="M30 52 L45 67 L72 37"
              fill="none"
              stroke="hsl(var(--moss))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
          </motion.svg>
        </div>

        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="font-display text-3xl md:text-4xl text-foreground mb-4">
          Order Confirmed!
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="space-y-3">
          <p className="font-mono text-lg text-foreground bg-secondary inline-block px-4 py-2 rounded-lg">{orderNum}</p>
          <p className="text-sm text-muted-foreground font-body">
            A confirmation email has been sent to <span className="text-foreground">{user?.email || 'your email'}</span>
          </p>
          <p className="text-sm text-muted-foreground font-body">
            Estimated delivery: <span className="text-foreground font-medium">{estimatedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/account" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-foreground text-foreground font-body font-medium hover:bg-foreground hover:text-card transition-colors">
            Track Your Order
          </Link>
          <Link to="/shop" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-body font-semibold hover:opacity-90 transition-opacity">
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;

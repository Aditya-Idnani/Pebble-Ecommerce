import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
import { authService } from '@/services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    setLoading(true); setError('');
    const { error } = await authService.resetPasswordForEmail(email);
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-card rounded-2xl border p-8 shadow-sm">
              <Link to="/" className="font-display text-2xl text-foreground block mb-6">pebble</Link>
              <h1 className="font-display text-xl text-foreground mb-1">Forgot your password?</h1>
              <p className="font-body text-sm text-muted-foreground mb-6">Enter your email and we'll send you a reset link.</p>

              {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-body">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                    placeholder="you@example.com" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground font-body font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm font-body text-muted-foreground">
                <Link to="/login" className="text-accent hover:underline">← Back to login</Link>
              </p>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl border p-8 shadow-sm text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-moss/20 flex items-center justify-center">
                <Mail className="w-8 h-8 text-moss" />
              </motion.div>
              <h2 className="font-display text-xl text-foreground mb-2">Check your inbox</h2>
              <p className="font-body text-sm text-muted-foreground mb-6">
                We sent a password reset link to <strong className="text-foreground">{email}</strong>
              </p>
              <Link to="/login" className="text-sm font-body text-accent hover:underline">← Back to login</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

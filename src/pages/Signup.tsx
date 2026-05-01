import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Store, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

type Step = 'form' | 'role';

const Signup = () => {
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'seller' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (password.length < 6) e.password = 'Min 6 characters';
    if (password !== confirmPw) e.confirmPw = 'Passwords don\'t match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    const { data, error } = await api.auth.signUp({
      email, password,
    });
    setLoading(false);
    if (error) { setErrors({ general: error.message }); return; }
    if (data.user) {
      setUserId(data.user.id);
      setStep('role');
    }
  };

  const handleRoleSelect = async (role: 'customer' | 'seller') => {
    setSelectedRole(role);
    if (!userId) return;
    setLoading(true);

    const { error } = await api.db.user_roles.insert({ user_id: userId, role });
    setLoading(false);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }

    toast({ title: 'Account created!', description: role === 'seller' ? 'Let\'s set up your store.' : 'Welcome to Pebble!' });
    navigate(role === 'seller' ? '/seller/onboarding' : '/account');
  };

  const handleGoogle = async () => {
    toast({ title: 'Not Available', description: 'Google Sign In is not available in the demo.' });
  };

  return (
    <div className="min-h-screen flex">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-3xl text-foreground mb-2 block">pebble</Link>

          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-2xl text-foreground mb-1">Create your account</h1>
                <p className="font-body text-muted-foreground mb-8">Join the Pebble community</p>

                {errors.general && (
                  <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-body">{errors.general}</div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="text-sm font-body text-foreground mb-1 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-foreground font-body text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                        placeholder="you@example.com" />
                    </div>
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-body text-foreground mb-1 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border bg-card text-foreground font-body text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                        placeholder="Min 6 characters" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showPw ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-body text-foreground mb-1 block">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-foreground font-body text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                        placeholder="••••••••" />
                    </div>
                    {errors.confirmPw && <p className="text-xs text-destructive mt-1">{errors.confirmPw}</p>}
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground font-body font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50">
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" /><span className="text-xs font-body text-muted-foreground">OR</span><div className="flex-1 h-px bg-border" />
                </div>

                <button onClick={handleGoogle}
                  className="w-full py-2.5 rounded-lg border bg-card text-foreground font-body text-sm hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>

                <p className="mt-8 text-center text-sm font-body text-muted-foreground">
                  Already have an account? <Link to="/login" className="text-accent hover:underline font-medium">Log in</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="font-display text-2xl text-foreground mb-1">How will you use Pebble?</h1>
                <p className="font-body text-muted-foreground mb-8">You can always change this later</p>

                <div className="grid grid-cols-2 gap-4">
                  {([
                    { role: 'customer' as const, icon: ShoppingBag, title: 'I want to Shop', desc: 'Browse & buy curated products from verified sellers' },
                    { role: 'seller' as const, icon: Store, title: 'I want to Sell', desc: 'Set up your store and start selling your creations' },
                  ]).map(({ role, icon: Icon, title, desc }) => (
                    <button key={role} onClick={() => handleRoleSelect(role)} disabled={loading}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                        selectedRole === role ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                      }`}>
                      {selectedRole === role && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-accent-foreground" />
                        </motion.div>
                      )}
                      <Icon className="w-8 h-8 text-accent mb-3" />
                      <h3 className="font-display text-lg text-foreground mb-1">{title}</h3>
                      <p className="text-xs font-body text-muted-foreground">{desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="hidden lg:flex flex-1 bg-secondary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/30" />
        <div className="relative z-10 max-w-sm text-center px-8">
          <p className="font-display text-3xl text-foreground italic leading-snug">
            "Every object has a soul. Find yours."
          </p>
          <p className="font-body text-muted-foreground mt-4">— The Pebble Community</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [useMagic, setUseMagic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/account';

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!useMagic && !password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    if (useMagic) {
      const { error } = await api.auth.signInWithOtp({ email });
      setLoading(false);
      if (error) { setErrors({ general: error.message }); return; }
      toast({ title: 'Check your inbox', description: 'We sent you a login link.' });
      return;
    }

    const { error } = await api.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErrors({ general: error.message }); return; }
    navigate(from, { replace: true });
  };

  const handleGoogle = async () => {
    toast({ title: 'Not Available', description: 'Google Sign In is not available in the demo.' });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-3xl text-foreground mb-2 block">pebble</Link>
          <h1 className="font-display text-2xl text-foreground mb-1">Welcome back</h1>
          <p className="font-body text-muted-foreground mb-8">Sign in to your account</p>

          {errors.general && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-body">{errors.general}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-body text-foreground mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-foreground font-body text-sm
                    focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {!useMagic && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-body text-foreground">Password</label>
                  <Link to="/forgot-password" className="text-xs font-body text-accent hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border bg-card text-foreground font-body text-sm
                      focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showPw ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground font-body font-medium text-sm
                hover:bg-accent/90 transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : useMagic ? 'Send Magic Link' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-body text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button onClick={handleGoogle}
            className="w-full py-2.5 rounded-lg border bg-card text-foreground font-body text-sm hover:bg-secondary transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <button onClick={() => setUseMagic(!useMagic)}
            className="w-full mt-3 py-2 text-xs font-body text-muted-foreground hover:text-foreground transition-colors">
            {useMagic ? '← Use password instead' : '✉ Email me a login link'}
          </button>

          <p className="mt-8 text-center text-sm font-body text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </motion.div>

      {/* Right — Image */}
      <div className="hidden lg:flex flex-1 bg-secondary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/30" />
        <div className="relative z-10 max-w-sm text-center px-8">
          <p className="font-display text-3xl text-foreground italic leading-snug">
            "Discover objects that tell a story."
          </p>
          <p className="font-body text-muted-foreground mt-4">— The Pebble Philosophy</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

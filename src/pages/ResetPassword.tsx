import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

function getStrength(pw: string): { label: string; pct: number; color: string } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', pct: 20, color: 'bg-destructive' };
  if (score <= 3) return { label: 'Fair', pct: 55, color: 'bg-primary' };
  return { label: 'Strong', pct: 100, color: 'bg-moss' };
}

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const strength = getStrength(password);

  useEffect(() => {
    // Mock recovery mode effect
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Min 6 characters'); return; }
    if (password !== confirmPw) { setError('Passwords don\'t match'); return; }
    setLoading(true); setError('');

    const { error } = await api.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    toast({ title: 'Password updated', description: 'You can now sign in with your new password.' });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-2xl border p-8 shadow-sm">
        <Link to="/" className="font-display text-2xl text-foreground block mb-6">pebble</Link>
        <h1 className="font-display text-xl text-foreground mb-1">Set new password</h1>
        <p className="font-body text-sm text-muted-foreground mb-6">Choose a strong password for your account.</p>

        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-body">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-body text-foreground mb-1 block">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPw ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${strength.pct}%` }}
                    className={`h-full ${strength.color} rounded-full transition-all`} />
                </div>
                <p className="text-xs font-body text-muted-foreground mt-1">{strength.label}</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-body text-foreground mb-1 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground font-body font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

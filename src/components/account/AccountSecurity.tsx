import { useState } from 'react';
import { Shield, Monitor, Smartphone, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const AccountSecurity = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const strength = newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : /[A-Z]/.test(newPw) && /\d/.test(newPw) ? 4 : 3;
  const strengthColors = ['bg-muted', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const updatePassword = async () => {
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setUpdating(true);
    const { error } = await api.auth.updateUser({ password: newPw });
    setUpdating(false);
    if (error) toast.error(error.message);
    else { toast.success('Password updated'); setNewPw(''); setConfirmPw(''); }
  };

  const handleDeleteAccount = async () => {
    if (deleteText !== 'DELETE') return;
    await signOut();
    navigate('/');
    toast.success('Account deleted');
  };

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="font-display text-2xl">Security</h1>

      {/* Change password */}
      <div className="border rounded-xl p-5 bg-card space-y-4">
        <h3 className="font-display text-base">Change Password</h3>
        <div>
          <Label className="text-xs">New Password</Label>
          <Input type="password" className="mt-1" value={newPw} onChange={e => setNewPw(e.target.value)} />
          {newPw && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : 'bg-muted'}`} />
                ))}
              </div>
              <span className="text-[10px] font-body text-muted-foreground">{strengthLabels[strength]}</span>
            </div>
          )}
        </div>
        <div>
          <Label className="text-xs">Confirm New Password</Label>
          <Input type="password" className="mt-1" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
        </div>
        <Button onClick={updatePassword} disabled={updating}>{updating ? 'Updating...' : 'Update Password'}</Button>
      </div>

      {/* Sessions */}
      <div className="border rounded-xl p-5 bg-card space-y-3">
        <h3 className="font-display text-base">Active Sessions</h3>
        {[
          { icon: Monitor, device: 'Chrome on macOS', location: 'Mumbai, India', time: 'Active now', current: true },
          { icon: Smartphone, device: 'Safari on iPhone', location: 'Mumbai, India', time: '2 hours ago', current: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <s.icon className="w-5 h-5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body">{s.device}</p>
              <p className="text-[10px] text-muted-foreground font-body">{s.location} · {s.time}</p>
            </div>
            {s.current ? (
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-body">This device</span>
            ) : (
              <Button variant="ghost" size="sm" className="text-xs text-destructive">Revoke</Button>
            )}
          </div>
        ))}
      </div>

      {/* 2FA */}
      <div className="border rounded-xl p-5 bg-card space-y-3">
        <h3 className="font-display text-base">Two-Factor Authentication</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-body">Disabled</span>
        </div>
        <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.info('2FA setup would open here')}>
          Enable 2FA
        </Button>
      </div>

      {/* Danger zone */}
      <div className="border border-destructive/30 rounded-xl p-5 space-y-3">
        <h3 className="font-display text-base text-destructive flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground font-body">This will permanently delete all your data. This action cannot be undone.</p>
        {!showDelete ? (
          <Button variant="destructive" size="sm" className="text-xs" onClick={() => setShowDelete(true)}>Delete Account</Button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-body">Type <span className="font-mono font-bold">DELETE</span> to confirm:</p>
            <Input value={deleteText} onChange={e => setDeleteText(e.target.value)} className="border-destructive/50" />
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" disabled={deleteText !== 'DELETE'} onClick={handleDeleteAccount}>Confirm Delete</Button>
              <Button variant="ghost" size="sm" onClick={() => { setShowDelete(false); setDeleteText(''); }}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const AccountProfile = () => {
  const { user, profile, refreshProfile } = useAuthStore();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let avatar_url = profile?.avatar_url || null;

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `avatars/${user.id}.${ext}`;
        const { error: uploadError, url } = await api.storage.upload('store-assets', path, avatarFile);
        if (uploadError) throw uploadError;
        if (url) avatar_url = url;
      } else if (!avatarPreview) {
        avatar_url = null;
      }

      const { error } = await api.db.profiles.update(user.id, {
        display_name: displayName,
        avatar_url,
        phone: phone || null,
      });

      if (error) throw error;
      await refreshProfile();
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="font-display text-2xl">Profile Settings</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          {avatarPreview ? (
            <img src={avatarPreview} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-display">
              {(displayName || user?.email || '?')[0].toUpperCase()}
            </div>
          )}
          <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <Camera className="w-5 h-5 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        {avatarPreview && (
          <button onClick={removeAvatar} className="text-xs text-muted-foreground hover:text-destructive font-body">Remove photo</button>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <Label className="text-xs">Display Name</Label>
          <Input className="mt-1" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Email</Label>
          <Input className="mt-1" value={user?.email || ''} disabled />
          <p className="text-[10px] text-muted-foreground font-body mt-1">Email cannot be changed</p>
        </div>
        <div>
          <Label className="text-xs">Phone</Label>
          <Input className="mt-1" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
      </div>

      <Button onClick={save} disabled={saving} className="w-full sm:w-auto">
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

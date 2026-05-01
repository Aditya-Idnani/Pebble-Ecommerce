import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Upload, Store, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { toast } from '@/hooks/use-toast';

const steps = ['Store Info', 'Description', 'Branding', 'Done!'];
const categoryOptions = ['Home & Living', 'Kitchen', 'Apparel', 'Accessories', 'Lighting', 'Art', 'Jewelry', 'Other'];

const SellerOnboarding = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [storeName, setStoreName] = useState('');
  const [handle, setHandle] = useState('');
  const [handleStatus, setHandleStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Step 2
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  // Step 3
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  // Debounced handle check
  useEffect(() => {
    if (!handle || handle.length < 3) { setHandleStatus('idle'); return; }
    setHandleStatus('checking');
    const t = setTimeout(async () => {
      const { data } = await api.db.stores.getByHandle(handle);
      setHandleStatus(data ? 'taken' : 'available');
    }, 500);
    return () => clearTimeout(t);
  }, [handle]);

  const handleFileChange = (type: 'logo' | 'banner', file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'logo') { setLogoFile(file); setLogoPreview(url); }
    else { setBannerFile(file); setBannerPreview(url); }
  };

  const next = () => setCurrent(c => Math.min(c + 1, 3));
  const prev = () => setCurrent(c => Math.max(c - 1, 0));

  const canProceed = (step: number) => {
    if (step === 0) return storeName.trim().length >= 2 && handle.length >= 3 && handleStatus === 'available';
    if (step === 1) return description.trim().length >= 10 && !!category;
    return true;
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);

    let logoUrl = '';
    let bannerUrl = '';

    try {
      if (logoFile) {
        const path = `${user.id}/logo-${Date.now()}`;
        const { error, url } = await api.storage.upload('store-assets', path, logoFile);
        if (!error && url) {
          logoUrl = url;
        }
      }
      if (bannerFile) {
        const path = `${user.id}/banner-${Date.now()}`;
        const { error, url } = await api.storage.upload('store-assets', path, bannerFile);
        if (!error && url) {
          bannerUrl = url;
        }
      }

      const { error } = await api.db.stores.insert({
        seller_id: user.id,
        handle,
        name: storeName,
        description,
        category,
        logo_url: logoUrl || null,
        banner_url: bannerUrl || null,
        onboarding_complete: true,
      });

      if (error) throw error;
      setCurrent(3);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= current ? 'bg-accent' : 'bg-secondary'}`} />
              <p className={`text-xs font-body mt-1 ${i <= current ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</p>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {current === 0 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-2xl border p-8">
              <Store className="w-8 h-8 text-accent mb-4" />
              <h2 className="font-display text-xl text-foreground mb-1">Name your store</h2>
              <p className="font-body text-sm text-muted-foreground mb-6">Choose a name and unique handle for your storefront.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-body text-foreground mb-1 block">Store Name</label>
                  <input value={storeName} onChange={e => setStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-accent outline-none"
                    placeholder="My Beautiful Store" />
                </div>
                <div>
                  <label className="text-sm font-body text-foreground mb-1 block">Store Handle</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">@</span>
                    <input value={handle} onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="w-full pl-8 pr-10 py-2.5 rounded-lg border bg-background text-foreground font-mono text-sm focus:ring-2 focus:ring-accent outline-none"
                      placeholder="my-store" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {handleStatus === 'checking' && <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />}
                      {handleStatus === 'available' && <Check className="w-4 h-4 text-moss" />}
                      {handleStatus === 'taken' && <X className="w-4 h-4 text-destructive" />}
                    </div>
                  </div>
                  {handleStatus === 'taken' && <p className="text-xs text-destructive mt-1">This handle is taken</p>}
                </div>
              </div>

              <button onClick={next} disabled={!canProceed(0)}
                className="w-full mt-6 py-2.5 rounded-lg bg-accent text-accent-foreground font-body font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50">
                Continue
              </button>
            </motion.div>
          )}

          {current === 1 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-2xl border p-8">
              <FileText className="w-8 h-8 text-accent mb-4" />
              <h2 className="font-display text-xl text-foreground mb-1">Tell us about your store</h2>
              <p className="font-body text-sm text-muted-foreground mb-6">A short description and your primary category.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-body text-foreground mb-1 block">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-accent outline-none resize-none"
                    placeholder="What do you create and sell?" />
                </div>
                <div>
                  <label className="text-sm font-body text-foreground mb-2 block">Primary Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryOptions.map(cat => (
                      <button key={cat} onClick={() => setCategory(cat)}
                        className={`px-3 py-2 rounded-lg text-sm font-body border transition-all ${
                          category === cat ? 'border-accent bg-accent/10 text-foreground' : 'border-border text-muted-foreground hover:border-accent/50'
                        }`}>{cat}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={prev} className="flex-1 py-2.5 rounded-lg border text-foreground font-body text-sm hover:bg-secondary transition-colors">Back</button>
                <button onClick={next} disabled={!canProceed(1)}
                  className="flex-1 py-2.5 rounded-lg bg-accent text-accent-foreground font-body font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50">
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {current === 2 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-2xl border p-8">
              <ImageIcon className="w-8 h-8 text-accent mb-4" />
              <h2 className="font-display text-xl text-foreground mb-1">Brand your store</h2>
              <p className="font-body text-sm text-muted-foreground mb-6">Upload a logo and banner image (optional).</p>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-body text-foreground mb-2 block">Logo</label>
                  {logoPreview ? (
                    <div className="relative w-20 h-20">
                      <img src={logoPreview} alt="Logo" className="w-20 h-20 rounded-full object-cover border" />
                      <button onClick={() => { setLogoFile(null); setLogoPreview(''); }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-accent transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange('logo', e.target.files?.[0] || null)} />
                    </label>
                  )}
                </div>

                <div>
                  <label className="text-sm font-body text-foreground mb-2 block">Banner</label>
                  {bannerPreview ? (
                    <div className="relative">
                      <img src={bannerPreview} alt="Banner" className="w-full h-32 rounded-lg object-cover border" />
                      <button onClick={() => { setBannerFile(null); setBannerPreview(''); }}
                        className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full h-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
                      <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                      <span className="text-xs font-body text-muted-foreground">Drag & drop or click to upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange('banner', e.target.files?.[0] || null)} />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={prev} className="flex-1 py-2.5 rounded-lg border text-foreground font-body text-sm hover:bg-secondary transition-colors">Back</button>
                <button onClick={handleFinish} disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-accent text-accent-foreground font-body font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50">
                  {loading ? 'Creating store...' : 'Launch Store'}
                </button>
              </div>
            </motion.div>
          )}

          {current === 3 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl border p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-moss/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-moss" />
              </motion.div>
              <h2 className="font-display text-2xl text-foreground mb-2">Your store is live!</h2>
              <p className="font-body text-muted-foreground mb-8">Congratulations! Start adding products to your store.</p>
              <button onClick={() => navigate('/seller')}
                className="px-8 py-3 rounded-lg bg-accent text-accent-foreground font-body font-medium hover:bg-accent/90 transition-colors">
                Add Your First Product
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellerOnboarding;

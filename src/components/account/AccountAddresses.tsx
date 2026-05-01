import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react';
import { mockAddresses } from '@/data/mockOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type Address = typeof mockAddresses[0];

export const AccountAddresses = () => {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [editing, setEditing] = useState<Address | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => {
    setEditing({ id: `a${Date.now()}`, label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India', isDefault: false });
    setIsNew(true);
  };

  const openEdit = (a: Address) => { setEditing({ ...a }); setIsNew(false); };

  const save = () => {
    if (!editing) return;
    if (isNew) setAddresses(prev => [...prev, editing]);
    else setAddresses(prev => prev.map(a => a.id === editing.id ? editing : a));
    setEditing(null);
    toast.success(isNew ? 'Address added' : 'Address updated');
  };

  const remove = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast('Address removed');
  };

  const setDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('Default address updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Addresses</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map(a => (
          <div key={a.id} className="border rounded-xl p-4 bg-card relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-body">{a.label}</span>
              {a.isDefault && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-body">Default</span>}
            </div>
            <p className="text-sm font-body font-medium">{a.name}</p>
            <p className="text-xs text-muted-foreground font-body mt-1">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
            <p className="text-xs text-muted-foreground font-body">{a.city}, {a.state} {a.pincode}</p>
            <p className="text-xs text-muted-foreground font-body">{a.phone}</p>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => openEdit(a)}>
                <Pencil className="w-3 h-3" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => remove(a.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
              {!a.isDefault && (
                <Button variant="ghost" size="sm" className="text-xs text-accent ml-auto" onClick={() => setDefault(a.id)}>
                  Set as Default
                </Button>
              )}
            </div>
          </div>
        ))}
        <button onClick={openNew} className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-accent/40 hover:text-accent transition-colors min-h-[160px]">
          <Plus className="w-6 h-6" />
          <span className="text-sm font-body">Add New Address</span>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto space-y-4" onClick={e => e.stopPropagation()}>
              <h3 className="font-display text-lg">{isNew ? 'Add Address' : 'Edit Address'}</h3>
              <div className="flex gap-2">
                {['Home', 'Work', 'Other'].map(l => (
                  <button key={l} onClick={() => setEditing(prev => prev ? { ...prev, label: l } : null)}
                    className={`px-3 py-1 rounded-full text-xs font-body ${editing.label === l ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>{l}</button>
                ))}
              </div>
              {[
                { key: 'name', label: 'Full Name' },
                { key: 'phone', label: 'Phone' },
                { key: 'line1', label: 'Address Line 1' },
                { key: 'line2', label: 'Address Line 2 (optional)' },
                { key: 'city', label: 'City' },
                { key: 'state', label: 'State' },
                { key: 'pincode', label: 'Pincode' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-xs">{label}</Label>
                  <Input className="mt-1" value={(editing as any)[key]} onChange={e => setEditing(prev => prev ? { ...prev, [key]: e.target.value } : null)} />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={save}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

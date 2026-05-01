import { useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { mockCards } from '@/data/mockOrders';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const brandIcon: Record<string, string> = { visa: '💳 Visa', mastercard: '💳 Mastercard' };

export const AccountPayments = () => {
  const [cards, setCards] = useState(mockCards);

  const remove = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    toast('Card removed');
  };

  const setDefault = (id: string) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
    toast.success('Default payment updated');
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">Payment Methods</h1>

      <div className="space-y-3">
        {cards.map(card => (
          <div key={card.id} className="border rounded-xl p-4 bg-card flex items-center gap-4">
            <div className="w-12 h-8 rounded bg-muted flex items-center justify-center text-xs font-body">
              {card.brand === 'visa' ? 'VISA' : 'MC'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-body font-medium">•••• •••• •••• {card.last4}</p>
              <p className="text-xs text-muted-foreground font-body">Expires {card.expiry}</p>
            </div>
            {card.isDefault && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-body">Default</span>}
            <div className="flex gap-1">
              {!card.isDefault && (
                <Button variant="ghost" size="sm" className="text-xs text-accent" onClick={() => setDefault(card.id)}>Set Default</Button>
              )}
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => remove(card.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}

        <button onClick={() => toast.info('Card form modal would appear')}
          className="border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:border-accent/40 hover:text-accent transition-colors w-full">
          <Plus className="w-5 h-5" />
          <span className="text-sm font-body">Add New Card</span>
        </button>
      </div>

      <div className="border rounded-xl p-4 bg-card/50">
        <p className="text-xs text-muted-foreground font-body">🔒 Your card details are secured by Stripe. Pebble never stores your full card number.</p>
      </div>
    </div>
  );
};

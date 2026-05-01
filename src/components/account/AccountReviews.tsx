import { useState } from 'react';
import { Star, Pencil } from 'lucide-react';
import { mockReviews, mockOrders } from '@/data/mockOrders';
import { ProductImage } from '@/components/ProductImage';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const AccountReviews = () => {
  const [tab, setTab] = useState<'written' | 'pending'>('written');

  const pendingItems = mockOrders
    .filter(o => o.status === 'delivered')
    .flatMap(o => o.items.filter(i => !i.reviewed));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">My Reviews</h1>

      <div className="flex gap-2">
        {(['written', 'pending'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${tab === t ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
            {t === 'written' ? `Written (${mockReviews.length})` : `Pending (${pendingItems.length})`}
          </button>
        ))}
      </div>

      {tab === 'written' ? (
        <div className="space-y-3">
          {mockReviews.map(review => (
            <div key={review.id} className="border rounded-xl p-4 bg-card">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                  <ProductImage src={review.productImage} alt={review.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium truncate">{review.productName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1 font-body">{review.date}</span>
                  </div>
                  <p className="text-sm font-body font-medium mt-1">{review.title}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{review.body}</p>
                  <p className="text-[10px] text-muted-foreground font-body mt-1">👍 {review.helpful} found helpful</p>
                </div>
                <Button variant="ghost" size="sm" className="self-start text-xs gap-1">
                  <Pencil className="w-3 h-3" /> Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {pendingItems.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-8">No pending reviews</p>
          ) : (
            pendingItems.map(item => (
              <div key={item.id} className="border rounded-xl p-4 bg-card flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                  <ProductImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-body">Share your experience to earn 50 reward points!</p>
                </div>
                <Button size="sm" className="text-xs" onClick={() => toast.info('Review modal would open')}>Write Review</Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

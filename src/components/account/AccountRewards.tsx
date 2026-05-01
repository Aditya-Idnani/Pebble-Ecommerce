import { motion } from 'framer-motion';
import { Gift, Copy, Share2 } from 'lucide-react';
import { useCountUp } from './useCountUp';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const earningMethods = [
  { emoji: '🛍️', label: 'Make a purchase', detail: '1 point per $1 spent' },
  { emoji: '⭐', label: 'Write a review', detail: '+50 points' },
  { emoji: '👥', label: 'Refer a friend', detail: '+100 points' },
  { emoji: '✅', label: 'Complete profile', detail: '+25 points' },
  { emoji: '🎂', label: 'Birthday bonus', detail: '+200 points' },
];

const historyData = [
  { date: 'Jan 22, 2025', action: 'Order #PBL-2024-2250', points: -128, balance: 840 },
  { date: 'Jan 8, 2025', action: 'Order #PBL-2024-2103 (10% coupon)', points: -68, balance: 968 },
  { date: 'Jan 5, 2025', action: 'Review: Artisan Linen Tote', points: 50, balance: 1036 },
  { date: 'Dec 20, 2024', action: 'Review: Ceramic Vase', points: 50, balance: 986 },
  { date: 'Dec 15, 2024', action: 'Order #PBL-2024-1847', points: 153, balance: 936 },
  { date: 'Nov 15, 2024', action: 'Profile completion', points: 25, balance: 783 },
  { date: 'Nov 10, 2024', action: 'Welcome bonus', points: 100, balance: 758 },
];

export const AccountRewards = () => {
  const points = useCountUp(840);
  const referralLink = 'https://pebble.shop/ref/ADITYA2024';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl">Rewards & Referrals</h1>

      {/* Points display */}
      <div className="border rounded-2xl p-6 bg-card text-center">
        <Gift className="w-8 h-8 text-accent mx-auto mb-2" />
        <p className="font-display text-4xl">{points}</p>
        <p className="text-sm text-muted-foreground font-body">Reward Points</p>
        <p className="text-xs text-accent font-body mt-1">= ${(840 / 100).toFixed(2)} off your next order</p>

        {/* Tier progress */}
        <div className="mt-4 max-w-xs mx-auto">
          <div className="flex justify-between text-[10px] text-muted-foreground font-body mb-1">
            <span>Silver</span><span>Gold (1000 pts)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-accent h-2 rounded-full transition-all" style={{ width: '84%' }} />
          </div>
          <p className="text-[10px] text-muted-foreground font-body mt-1">160 points to Gold tier</p>
        </div>
      </div>

      {/* Earn methods */}
      <div>
        <h3 className="font-display text-base mb-3">How to Earn</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {earningMethods.map(m => (
            <div key={m.label} className="border rounded-xl p-3 bg-card text-center">
              <span className="text-2xl">{m.emoji}</span>
              <p className="text-xs font-body font-medium mt-1">{m.label}</p>
              <p className="text-[10px] text-muted-foreground font-body">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Points history */}
      <div>
        <h3 className="font-display text-base mb-3">Points History</h3>
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground">
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Action</th>
                <th className="text-right p-3">Points</th>
                <th className="text-right p-3">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {historyData.map((row, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <td className="p-3 text-muted-foreground">{row.date}</td>
                  <td className="p-3">{row.action}</td>
                  <td className={`p-3 text-right font-mono ${row.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {row.points > 0 ? '+' : ''}{row.points}
                  </td>
                  <td className="p-3 text-right font-mono">{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referrals */}
      <div className="border rounded-2xl p-6 bg-card space-y-4">
        <h3 className="font-display text-lg">Refer a Friend</h3>
        <p className="text-sm text-muted-foreground font-body">You share → Friend signs up → Friend makes first purchase → You get $10, they get $5</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-xs font-mono truncate">{referralLink}</div>
          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={copyLink}>
            <Copy className="w-3.5 h-3.5" /> Copy
          </Button>
        </div>
        <div className="flex gap-4 text-center">
          <div><p className="font-display text-xl">3</p><p className="text-[10px] text-muted-foreground font-body">Friends Referred</p></div>
          <div><p className="font-display text-xl">$30</p><p className="text-[10px] text-muted-foreground font-body">Earned</p></div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Bell, Package, Tag, Settings, MessageSquare } from 'lucide-react';
import { mockNotifications } from '@/data/mockOrders';
import { Switch } from '@/components/ui/switch';

const typeIcons: Record<string, { icon: any; color: string }> = {
  order: { icon: Package, color: 'bg-blue-100 text-blue-600' },
  promo: { icon: Tag, color: 'bg-accent/15 text-accent' },
  system: { icon: Settings, color: 'bg-muted text-muted-foreground' },
  review: { icon: MessageSquare, color: 'bg-amber-100 text-amber-600' },
};

const tabs = ['All', 'Orders', 'Promotions', 'System'] as const;
const tabFilter: Record<string, string[]> = {
  All: [], Orders: ['order'], Promotions: ['promo'], System: ['system', 'review'],
};

export const AccountNotifications = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(mockNotifications);

  const filtered = notifications.filter(n => {
    const f = tabFilter[activeTab];
    return !f.length || f.includes(n.type);
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs text-accent hover:underline font-body">Mark all as read</button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${activeTab === tab ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="border rounded-xl bg-card divide-y overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-body">No notifications</p>
          </div>
        ) : (
          filtered.map(n => {
            const { icon: Icon, color } = typeIcons[n.type] || typeIcons.system;
            return (
              <button key={n.id} onClick={() => markRead(n.id)}
                className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/20 ${!n.read ? 'bg-accent/5' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-body ${!n.read ? 'font-medium' : ''}`}>{n.message}</p>
                  <p className="text-[10px] text-muted-foreground font-body mt-0.5">{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />}
              </button>
            );
          })
        )}
      </div>

      {/* Preferences */}
      <div className="border rounded-xl p-5 bg-card space-y-4">
        <h3 className="font-display text-base">Notification Preferences</h3>
        {[
          { label: 'Order updates', desc: 'Status changes, delivery updates' },
          { label: 'Price drop alerts', desc: 'When wishlist items go on sale' },
          { label: 'Back in stock', desc: 'When saved items are available again' },
          { label: 'Promotions & deals', desc: 'Sales, coupons, and offers' },
          { label: 'Review reminders', desc: 'Reminders to review purchases' },
        ].map(pref => (
          <div key={pref.label} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-body font-medium">{pref.label}</p>
              <p className="text-[10px] text-muted-foreground font-body">{pref.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5"><span className="text-[10px] text-muted-foreground">Email</span><Switch defaultChecked /></div>
              <div className="flex items-center gap-1.5"><span className="text-[10px] text-muted-foreground">In-app</span><Switch defaultChecked /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

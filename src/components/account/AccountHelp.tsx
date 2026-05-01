import { LifeBuoy, MessageCircle, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const AccountHelp = () => (
  <div className="space-y-6 max-w-lg">
    <h1 className="font-display text-2xl">Help & Support</h1>

    <div className="grid gap-4">
      {[
        { icon: MessageCircle, label: 'Live Chat', desc: 'Chat with our support team', action: 'Start Chat' },
        { icon: Mail, label: 'Email Support', desc: 'support@pebble.shop', action: 'Send Email' },
        { icon: FileText, label: 'FAQ', desc: 'Browse common questions', action: 'View FAQ' },
      ].map(item => (
        <div key={item.label} className="border rounded-xl p-4 bg-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <item.icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-body font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.info('Coming soon')}>{item.action}</Button>
        </div>
      ))}
    </div>
  </div>
);

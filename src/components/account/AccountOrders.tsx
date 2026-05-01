import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Check, Truck, Package as PackageIcon, ClipboardCheck, MapPin, X, RotateCcw, Download, FileText } from 'lucide-react';
import { mockOrders, type OrderStatus, type MockOrder } from '@/data/mockOrders';
import { ProductImage } from '@/components/ProductImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  processing: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  return_requested: 'bg-purple-100 text-purple-800',
};

const tabs = ['All', 'Active', 'Delivered', 'Cancelled', 'Returns'] as const;

const filterMap: Record<string, OrderStatus[]> = {
  All: [],
  Active: ['processing', 'confirmed', 'shipped', 'out_for_delivery'],
  Delivered: ['delivered'],
  Cancelled: ['cancelled'],
  Returns: ['return_requested'],
};

export const AccountOrders = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mockOrders.filter(o => {
    const f = filterMap[activeTab];
    if (f.length && !f.includes(o.status)) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q) || o.items.some(i => i.name.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">My Orders</h1>

      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${activeTab === tab ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by order number or product name" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <PackageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-body">No orders found</p>
            </motion.div>
          ) : (
            filtered.map(order => (
              <motion.div key={order.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Link to={`/account/orders/${order.id}`} className="block border rounded-xl p-4 bg-card hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-mono text-sm font-medium">{order.orderNumber}</span>
                      <span className="text-xs text-muted-foreground ml-2 font-body">{order.date}</span>
                    </div>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-body ${statusColors[order.status]}`}>
                      {order.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} className="w-12 h-12 rounded-lg overflow-hidden border-2 border-card">
                          <ProductImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs font-mono border-2 border-card">+{order.items.length - 3}</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body truncate">{order.items.map(i => i.name).join(', ')}</p>
                      <p className="text-xs text-muted-foreground font-body">{order.items.reduce((s, i) => s + i.qty, 0)} items</p>
                    </div>
                    <span className="font-mono font-medium text-sm">${order.total.toFixed(2)}</span>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Order Detail
const timelineSteps = ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'] as const;
const statusToStep: Record<OrderStatus, number> = {
  processing: 0, confirmed: 1, shipped: 2, out_for_delivery: 3, delivered: 4, cancelled: -1, return_requested: 4,
};

export const AccountOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = mockOrders.find(o => o.id === orderId);

  if (!order) return <div className="py-12 text-center text-muted-foreground font-body">Order not found</div>;

  const currentStep = statusToStep[order.status];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/account/orders')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-body transition-colors">
        <ArrowLeft className="w-4 h-4" /> My Orders
      </button>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="font-display text-xl">{order.orderNumber}</h1>
          <p className="text-xs text-muted-foreground font-body">Placed {order.date} · {order.paymentMethod}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-body ${statusColors[order.status]}`}>
          {order.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </span>
      </div>

      {/* Timeline */}
      {order.status !== 'cancelled' && (
        <div className="border rounded-xl p-5 bg-card">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
            <div className="absolute top-4 left-0 h-0.5 bg-accent transition-all" style={{ width: `${Math.max(0, currentStep) / 4 * 100}%` }} />
            {timelineSteps.map((step, i) => (
              <div key={step} className="relative flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                  i < currentStep ? 'bg-green-500 text-white' :
                  i === currentStep ? 'bg-accent text-accent-foreground animate-pulse' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {i < currentStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="text-[10px] text-muted-foreground font-body mt-1.5 text-center max-w-[70px]">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Items */}
        <div className="lg:col-span-3 space-y-4">
          <div className="border rounded-xl bg-card divide-y">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-3 p-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <ProductImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{item.variant} · Qty: {item.qty}</p>
                  <p className="text-sm font-mono mt-1">${item.price.toFixed(2)}</p>
                </div>
                {order.status === 'delivered' && !item.reviewed && (
                  <Button variant="outline" size="sm" className="self-center text-xs">Write Review</Button>
                )}
              </div>
            ))}
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="border rounded-xl p-4 bg-card">
              <h3 className="font-display text-sm mb-3">Tracking</h3>
              <p className="text-xs font-body text-muted-foreground mb-2">{order.carrier} · <span className="font-mono">{order.trackingNumber}</span></p>
              <div className="space-y-3 ml-2 border-l-2 border-muted pl-4">
                {order.trackingEvents.map((ev, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-accent' : 'bg-muted-foreground/30'}`} />
                    <p className="text-xs font-body font-medium">{ev.description}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{ev.location} · {ev.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border rounded-xl p-4 bg-card">
            <h3 className="font-display text-sm mb-3">Shipping Address</h3>
            <p className="text-xs font-body text-muted-foreground">{order.address}</p>
          </div>
          <div className="border rounded-xl p-4 bg-card">
            <h3 className="font-display text-sm mb-3">Order Summary</h3>
            <div className="space-y-1.5 text-xs font-body">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${order.tax.toFixed(2)}</span></div>
              <div className="border-t pt-1.5 flex justify-between font-medium text-sm"><span>Total</span><span className="font-mono">${order.total.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full text-xs gap-1.5" onClick={() => toast.success('Invoice download starting...')}>
              <Download className="w-3.5 h-3.5" /> Download Invoice
            </Button>
            {order.status === 'processing' && (
              <Button variant="destructive" size="sm" className="w-full text-xs" onClick={() => toast.info('Cancel order modal would appear')}>
                Cancel Order
              </Button>
            )}
            {order.status === 'delivered' && (
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5" onClick={() => toast.info('Return request modal would appear')}>
                <RotateCcw className="w-3.5 h-3.5" /> Return / Refund
              </Button>
            )}
            {order.status === 'cancelled' && (
              <Button size="sm" className="w-full text-xs" onClick={() => toast.success('Items added back to cart')}>
                Reorder
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

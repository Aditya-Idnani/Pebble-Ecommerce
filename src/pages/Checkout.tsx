import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Check, ChevronDown, Truck, Zap, Clock } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { ProductImage } from '@/components/ProductImage';

const steps = ['Contact', 'Shipping', 'Delivery', 'Payment'];

const mockServiceablePincodes = ['400001', '400002', '400003', '110001', '110002', '560001', '10001', '10002'];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, discount, shipping, total, appliedCoupon } = useCartStore();
  const user = useAuthStore(s => s.user);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Contact
  const [email, setEmail] = useState(user?.email || '');

  // Shipping
  const [shippingForm, setShippingForm] = useState({
    fullName: '', address1: '', address2: '', city: '', state: '', pincode: '', country: 'India', phone: '',
  });
  const [saveAddress, setSaveAddress] = useState(true);
  const [shippingErrors, setShippingErrors] = useState<Record<string, boolean>>({});

  // Delivery
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const sameDayAvailable = mockServiceablePincodes.includes(shippingForm.pincode);

  // Payment
  const [billingAddressSame, setBillingAddressSame] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const sub = subtotal();
  const disc = discount();
  const ship = deliveryOption === 'express' ? 5.99 : deliveryOption === 'sameday' ? 12.99 : (sub >= 50 ? 0 : 5.99);
  const taxEstimate = sub * 0.08;
  const orderTotal = Math.max(0, sub - disc + ship + taxEstimate);

  useEffect(() => {
    if (items.length === 0) navigate('/shop');
  }, [items.length, navigate]);

  const goNext = () => {
    if (step === 1) {
      const required = ['fullName', 'address1', 'city', 'state', 'pincode', 'phone'];
      const errors: Record<string, boolean> = {};
      required.forEach(f => { if (!shippingForm[f as keyof typeof shippingForm]) errors[f] = true; });
      if (Object.keys(errors).length > 0) { setShippingErrors(errors); return; }
    }
    setDirection(1);
    setStep(s => Math.min(s + 1, 3));
  };

  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  const handlePlaceOrder = () => {
    setProcessing(true);
    setPaymentError('');
    // TODO: replace mock with real backend API to create PaymentIntent
    setTimeout(() => {
      setProcessing(false);
      navigate('/order-confirmation');
    }, 1500);
  };

  const deliveryOptions = [
    { id: 'standard', label: 'Standard', price: sub >= 50 ? 'Free' : '$5.99', days: '5–7 business days', icon: Truck },
    { id: 'express', label: 'Express', price: '$5.99', days: '2–3 business days', icon: Zap },
    ...(sameDayAvailable ? [{ id: 'sameday', label: 'Same Day', price: '$12.99', days: 'Today by 9pm', icon: Clock }] : []),
  ];

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  const inputClass = (field?: string) =>
    `w-full bg-card border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors ${
      field && shippingErrors[field] ? 'border-destructive ring-destructive/20' : 'border-border'
    }`;

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <header className="border-b bg-card/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-display text-xl text-foreground">pebble</Link>
          <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
            <Lock className="w-4 h-4" /> Secure Checkout
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Link to="/shop" onClick={() => useCartStore.getState().open()} className="inline-flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </Link>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    backgroundColor: i < step ? 'hsl(var(--moss))' : i === step ? 'hsl(var(--accent))' : 'transparent',
                    borderColor: i <= step ? 'transparent' : 'hsl(var(--border))',
                  }}
                  className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-mono"
                >
                  {i < step ? (
                    <Check className="w-4 h-4 text-card" />
                  ) : (
                    <span className={i === step ? 'text-accent-foreground' : 'text-muted-foreground'}>{i + 1}</span>
                  )}
                </motion.div>
                <span className={`text-xs font-body mt-1.5 ${i === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 md:w-20 h-0.5 mx-2 mt-[-18px] ${i < step ? 'bg-moss' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Form area */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 0 && (
                <motion.div key="contact" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="font-display text-2xl text-foreground">Contact Information</h2>
                  {user ? (
                    <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-display text-sm">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-body text-foreground">{user.email}</p>
                        <button className="text-xs text-muted-foreground hover:text-foreground">Not you? Sign out</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm font-body text-muted-foreground">Have an account? <Link to="/login" className="text-accent hover:underline">Sign in to autofill</Link></p>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className={inputClass()} />
                    </div>
                  )}
                  <button onClick={goNext} disabled={!email} className="w-full bg-accent text-accent-foreground py-3.5 rounded-xl font-body font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                    Continue
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="shipping" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
                  <h2 className="font-display text-2xl text-foreground">Shipping Address</h2>
                  <input type="text" placeholder="Full name *" value={shippingForm.fullName} onChange={e => { setShippingForm(s => ({ ...s, fullName: e.target.value })); setShippingErrors(s => ({ ...s, fullName: false })); }} className={inputClass('fullName')} />
                  <input type="text" placeholder="Address line 1 *" value={shippingForm.address1} onChange={e => { setShippingForm(s => ({ ...s, address1: e.target.value })); setShippingErrors(s => ({ ...s, address1: false })); }} className={inputClass('address1')} />
                  <input type="text" placeholder="Address line 2 (optional)" value={shippingForm.address2} onChange={e => setShippingForm(s => ({ ...s, address2: e.target.value }))} className={inputClass()} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="City *" value={shippingForm.city} onChange={e => { setShippingForm(s => ({ ...s, city: e.target.value })); setShippingErrors(s => ({ ...s, city: false })); }} className={inputClass('city')} />
                    <input type="text" placeholder="State *" value={shippingForm.state} onChange={e => { setShippingForm(s => ({ ...s, state: e.target.value })); setShippingErrors(s => ({ ...s, state: false })); }} className={inputClass('state')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Pincode *" value={shippingForm.pincode} onChange={e => { setShippingForm(s => ({ ...s, pincode: e.target.value })); setShippingErrors(s => ({ ...s, pincode: false })); }} className={inputClass('pincode')} />
                    <input type="text" placeholder="Phone *" value={shippingForm.phone} onChange={e => { setShippingForm(s => ({ ...s, phone: e.target.value })); setShippingErrors(s => ({ ...s, phone: false })); }} className={inputClass('phone')} />
                  </div>
                  {user && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} className="rounded border-border" />
                      <span className="text-sm font-body text-foreground">Save this address</span>
                    </label>
                  )}
                  <div className="flex gap-3">
                    <button onClick={goBack} className="flex-1 border border-border text-foreground py-3.5 rounded-xl font-body font-medium hover:bg-secondary transition-colors">Back</button>
                    <button onClick={goNext} className="flex-1 bg-accent text-accent-foreground py-3.5 rounded-xl font-body font-semibold hover:opacity-90 transition-opacity">Continue</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="delivery" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
                  <h2 className="font-display text-2xl text-foreground">Delivery Options</h2>
                  <div className="space-y-3">
                    {deliveryOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setDeliveryOption(opt.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                          deliveryOption === opt.id ? 'border-accent bg-accent/5' : 'border-border hover:border-stone/30'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryOption === opt.id ? 'border-accent' : 'border-border'}`}>
                          {deliveryOption === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                        </div>
                        <opt.icon className="w-5 h-5 text-stone" />
                        <div className="flex-1">
                          <p className="font-body font-medium text-foreground text-sm">{opt.label}</p>
                          <p className="text-xs text-muted-foreground font-body">{opt.days}</p>
                        </div>
                        <span className="font-mono text-sm text-foreground">{opt.price}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={goBack} className="flex-1 border border-border text-foreground py-3.5 rounded-xl font-body font-medium hover:bg-secondary transition-colors">Back</button>
                    <button onClick={goNext} className="flex-1 bg-accent text-accent-foreground py-3.5 rounded-xl font-body font-semibold hover:opacity-90 transition-opacity">Continue</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="payment" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="font-display text-2xl text-foreground">Payment</h2>

                  {/* Mock card input styled to match theme */}
                  <div className="space-y-4">
                    <input type="text" placeholder="Card number" maxLength={19} className={inputClass()} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM / YY" maxLength={7} className={inputClass()} />
                      <input type="text" placeholder="CVC" maxLength={4} className={inputClass()} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                    <Lock className="w-3.5 h-3.5" />
                    Your payment is secured with encryption
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={billingAddressSame} onChange={e => setBillingAddressSame(e.target.checked)} className="rounded border-border" />
                    <span className="text-sm font-body text-foreground">Billing address same as shipping</span>
                  </label>

                  {/* Order summary inline */}
                  <div className="bg-secondary/50 rounded-xl p-5 space-y-2 text-sm font-body">
                    {items.map(item => (
                      <div key={item.product.id} className="flex justify-between">
                        <span className="text-foreground">{item.product.title} × {item.quantity}</span>
                        <span className="font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-2 space-y-1">
                      <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="font-mono">${sub.toFixed(2)}</span></div>
                      {disc > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-mono">-${disc.toFixed(2)}</span></div>}
                      <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="font-mono">{ship === 0 ? 'Free' : `$${ship.toFixed(2)}`}</span></div>
                      <div className="flex justify-between text-muted-foreground"><span>Tax (est.)</span><span className="font-mono">${taxEstimate.toFixed(2)}</span></div>
                      <div className="flex justify-between font-display text-lg text-foreground pt-2 border-t border-border">
                        <span>Total</span><span className="font-mono">${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {paymentError && <p className="text-sm text-destructive font-body">{paymentError}</p>}

                  <div className="flex gap-3">
                    <button onClick={goBack} className="flex-1 border border-border text-foreground py-3.5 rounded-xl font-body font-medium hover:bg-secondary transition-colors">Back</button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={processing}
                      className="flex-1 bg-accent text-accent-foreground py-3.5 rounded-xl font-body font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full" />
                          Processing...
                        </>
                      ) : (
                        'Place Order →'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar — desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 space-y-4">
              <h3 className="font-display text-lg text-foreground">Order Summary</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <ProductImage src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-card text-[10px] font-mono flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-foreground truncate">{item.product.title}</p>
                      <p className="text-xs text-muted-foreground font-body">{item.product.seller}</p>
                    </div>
                    <span className="font-mono text-sm text-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm font-body">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="font-mono">${sub.toFixed(2)}</span></div>
                {disc > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-mono">-${disc.toFixed(2)}</span></div>}
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="font-mono">{ship === 0 ? 'Free' : `$${ship.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Tax (est.)</span><span className="font-mono">${taxEstimate.toFixed(2)}</span></div>
                <div className="flex justify-between font-display text-lg text-foreground pt-2 border-t border-border">
                  <span>Total</span><span className="font-mono">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
              {appliedCoupon && (
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-body flex items-center gap-1.5">
                  🎟️ {appliedCoupon.code} applied
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

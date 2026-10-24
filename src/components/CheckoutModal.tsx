import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, Truck, CreditCard, Banknote, QrCode } from 'lucide-react';
import { CartItem, Coupon, Order, StoreSettings } from '../types/store';
import { User } from '../types/auth';
import { calculateOrderSummary, formatCurrency, isPincodeServiceable } from '../utils/cart-rules';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isExpress: boolean;
  selectedSlot: string;
  settings: StoreSettings;
  currentPincode: string;
  currentUser?: User | null;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  isExpress,
  selectedSlot,
  settings,
  currentPincode,
  currentUser,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const summary = calculateOrderSummary(items, appliedCoupon, isExpress, settings);

  const [name, setName] = useState(currentUser?.name || 'Basant M');
  const [phone, setPhone] = useState(currentUser?.phone || '9845012345');
  const [email, setEmail] = useState(currentUser?.email || 'basant@example.com');
  const [address, setAddress] = useState(
    currentUser?.savedAddresses?.[0] || 'Flat 402, Royal Residency, 12th Main Road, Sector 4'
  );
  const [pincode, setPincode] = useState(currentUser?.defaultPincode || currentPincode || '560034');
  const [city, setCity] = useState('Bengaluru');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [butcheryNotes, setButcheryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setEmail(currentUser.email);
      if (currentUser.savedAddresses?.[0]) {
        setAddress(currentUser.savedAddresses[0]);
      }
      if (currentUser.defaultPincode) {
        setPincode(currentUser.defaultPincode);
      }
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setFormError('Please enter a valid 10-digit mobile number for order delivery coordination');
      return;
    }
    if (!address.trim()) {
      setFormError('Please enter complete delivery house/street address');
      return;
    }
    if (!isPincodeServiceable(pincode, settings.serviceablePincodes)) {
      setFormError(`Pincode ${pincode} is outside express delivery range. Try 560034, 560001, or 110001.`);
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `FZ-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim(),
      deliveryAddress: address.trim(),
      pincode: pincode.trim(),
      city: city.trim(),
      items: [...items],
      subtotal: summary.subtotal,
      discount: summary.discount,
      couponCode: appliedCoupon?.code,
      deliveryFee: summary.deliveryFee,
      packagingFee: summary.packagingFee,
      total: summary.total,
      deliveryType: isExpress ? 'express' : 'scheduled',
      deliverySlot: isExpress ? 'Express 90 Mins' : selectedSlot,
      paymentMethod,
      status: 'pending',
      butcheryNotes: butcheryNotes.trim() || undefined,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-red-700 flex items-center justify-center font-bold text-sm">
              FZ
            </div>
            <div>
              <h2 className="text-base font-bold">FoodZunction Express Checkout</h2>
              <span className="text-[11px] text-stone-400">Order verification &amp; delivery details</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {formError}
            </div>
          )}

          {/* Section: Delivery Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              1. Delivery Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Basant M"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Mobile Number (for live delivery rider tracking) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Delivery Street Address &amp; Flat/House No. *
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door number, apartment name, street, landmarks"
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Order Butchery Notes / Gate Instructions
              </label>
              <input
                type="text"
                value={butcheryNotes}
                onChange={(e) => setButcheryNotes(e.target.value)}
                placeholder="e.g. Ring doorbell, separate curry cut bags, double chilled ice pack"
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-medium"
              />
            </div>
          </div>

          {/* Section: Payment Method */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                className={`p-3 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-red-600 bg-red-50/50 text-stone-900 ring-1 ring-red-600'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="sr-only"
                />
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold">Cash on Delivery</span>
                <span className="text-[10px] text-stone-500">Pay cash or UPI at your door</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-red-600 bg-red-50/50 text-stone-900 ring-1 ring-red-600'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="sr-only"
                />
                <QrCode className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold">Instant UPI / QR</span>
                <span className="text-[10px] text-stone-500">Google Pay, PhonePe, Paytm</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-red-600 bg-red-50/50 text-stone-900 ring-1 ring-red-600'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold">Card / NetBanking</span>
                <span className="text-[10px] text-stone-500">All major debit/credit cards</span>
              </label>
            </div>
          </div>

          {/* Section: Order Summary Recap */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>{items.length} items ({isExpress ? '90-min Express' : 'Scheduled'})</span>
              <span className="font-mono">{formatCurrency(summary.subtotal)}</span>
            </div>
            {summary.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon discount ({appliedCoupon?.code})</span>
                <span className="font-mono">-{formatCurrency(summary.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Cold chain packaging + delivery</span>
              <span className="font-mono">{formatCurrency(summary.deliveryFee + summary.packagingFee)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-950 text-sm">
              <span>Total Payable</span>
              <span className="font-mono text-base">{formatCurrency(summary.total)}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-red-700 hover:bg-red-800 disabled:bg-stone-400 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Confirming Butchery Order...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Place Order · {formatCurrency(summary.total)}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

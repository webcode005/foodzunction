import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, Clock, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { CartItem, Coupon, StoreSettings } from '../types/store';
import { calculateOrderSummary, formatCurrency, AVAILABLE_COUPONS } from '../utils/cart-rules';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  isExpress: boolean;
  onToggleExpress: (express: boolean) => void;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  settings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  isExpress,
  onToggleExpress,
  selectedSlot,
  onSelectSlot,
  settings,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  const summary = calculateOrderSummary(items, appliedCoupon, isExpress, settings);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const found = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (!found) {
      setCouponError(`Invalid coupon code "${code}". Try FRESH100 or MEATLOVE.`);
      return;
    }

    if (summary.subtotal < found.minOrderValue) {
      setCouponError(`Coupon requires minimum order of ₹${found.minOrderValue}`);
      return;
    }

    onApplyCoupon(found);
    setCouponInput('');
  };

  const deliverySlots = [
    { id: 'express', label: 'Express (within 90 mins)', time: 'Next available rider' },
    { id: 'morning', label: 'Morning Slot', time: '07:00 AM - 09:00 AM' },
    { id: 'afternoon', label: 'Afternoon Slot', time: '12:00 PM - 02:00 PM' },
    { id: 'evening', label: 'Evening Slot', time: '05:00 PM - 07:00 PM' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span>Your Fresh Cuts Basket</span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </h2>
            <p className="text-[11px] text-stone-500">Chilled to 0°C–4°C and vacuum sealed</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Goal Bar */}
        {items.length > 0 && (
          <div className="px-5 py-2.5 bg-amber-50/80 border-b border-amber-200 text-xs">
            {summary.isFreeDeliveryEligible ? (
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You unlocked FREE standard cold-chain delivery!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between font-medium text-amber-900 mb-1">
                  <span>Add {formatCurrency(summary.amountNeededForFreeDelivery)} more for FREE delivery</span>
                  <span className="font-mono text-[11px]">Threshold: Rs. {settings.freeDeliveryThreshold}</span>
                </div>
                <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (summary.subtotal / settings.freeDeliveryThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-3xl">
                🥩
              </div>
              <h3 className="text-base font-bold text-stone-800">Your basket is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our fresh tender chicken, rich goat mutton, and coastal fresh fish to begin your order.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Browse Fresh Cuts
              </button>
            </div>
          ) : (
            <>
              {/* Itemized List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-stone-900 leading-tight">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                          <span className="font-medium text-stone-700">{item.selectedCut.name}</span>
                          <span>·</span>
                          <span className="font-mono">{item.selectedWeight.label}</span>
                        </div>
                        {item.customButcheryNote && (
                          <p className="text-[10px] text-amber-800 italic mt-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block">
                            Note: {item.customButcheryNote}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-stone-900 block tabular-nums">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {formatCurrency(item.unitPrice)} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        aria-label={`Remove ${item.name} from basket`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center bg-white border border-stone-300 rounded-md">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-700 hover:bg-stone-100 rounded-l cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-700 hover:bg-stone-100 rounded-r cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Speed / Slot Selector */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-600" />
                    Delivery Speed &amp; Slot
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => onToggleExpress(true)}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        isExpress ? 'bg-amber-400 text-stone-950' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      90m Express
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleExpress(false)}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        !isExpress ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      Scheduled
                    </button>
                  </div>
                </div>

                {!isExpress && (
                  <select
                    value={selectedSlot}
                    onChange={(e) => onSelectSlot(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white font-medium cursor-pointer"
                  >
                    {deliverySlots.slice(1).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.time})
                      </option>
                    ))}
                  </select>
                )}
                {isExpress && (
                  <p className="text-[11px] text-amber-900 font-medium bg-amber-100/70 p-2 rounded-lg">
                    ⚡ Priority Butcher Rush: Prepared and dispatched within 90 mins at 0-4°C.
                  </p>
                )}
              </div>

              {/* Coupon Applicator */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-stone-600" />
                  Promo Coupons
                </span>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Coupon <strong>{appliedCoupon.code}</strong> applied ({formatCurrency(summary.discount)} off)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onApplyCoupon(null)}
                      className="text-stone-400 hover:text-red-700 font-bold ml-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter promo code (e.g. FRESH100)"
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                )}

                {/* Quick click suggestions */}
                {!appliedCoupon && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {AVAILABLE_COUPONS.map((cpn) => (
                      <button
                        key={cpn.code}
                        type="button"
                        onClick={() => onApplyCoupon(cpn)}
                        className="text-[10px] font-mono font-semibold bg-white border border-stone-300 hover:border-red-600 px-2 py-0.5 rounded text-stone-700 cursor-pointer"
                      >
                        {cpn.code} ({cpn.discountType === 'flat' ? `Rs. ${cpn.value}` : `${cpn.value}%`} off)
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Item Subtotal</span>
                  <span className="font-mono tabular-nums">{formatCurrency(summary.subtotal)}</span>
                </div>

                {summary.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span className="font-mono tabular-nums">-{formatCurrency(summary.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Cold-Chain Packaging</span>
                  <span className="font-mono tabular-nums">{formatCurrency(summary.packagingFee)}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Delivery Partner Fee</span>
                  {summary.deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                  ) : (
                    <span className="font-mono tabular-nums">{formatCurrency(summary.deliveryFee)}</span>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                  <span>To Pay</span>
                  <span className="font-mono text-base tabular-nums">{formatCurrency(summary.total)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-stone-500 block">Grand Total</span>
              <span className="text-xl font-extrabold text-stone-950 font-mono tabular-nums">
                {formatCurrency(summary.total)}
              </span>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

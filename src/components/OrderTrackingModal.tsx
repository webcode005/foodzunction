import React from 'react';
import { Check, CheckCircle2, Clock, MapPin, Printer, Snowflake, ShieldCheck, X } from 'lucide-react';
import { Order } from '../types/store';
import { formatCurrency } from '../utils/cart-rules';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const steps = [
    { title: 'Order Confirmed', time: 'Just now', desc: 'Received at Butcher Central Hub', completed: true },
    { title: 'Precision Cut & Sanitized', time: 'In progress', desc: 'Washed in ozonated water at 2°C', completed: true },
    { title: 'Cold-Chain Vacuum Sealed', time: 'Next', desc: 'Packed with food-grade dry ice pouches', completed: false },
    { title: 'Out for Express Delivery', time: 'Est. 45-60 min', desc: `Rider assigned for ${order.pincode}`, completed: false },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Order Placed Successfully</span>
          </div>

          <h2 className="text-2xl font-black font-mono tracking-tight">{order.id}</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Thank you, {order.customerName}! We have dispatched your cut request to our master butchers.
          </p>
        </div>

        {/* Live Timeline */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Live Cold-Chain Tracking
            </h3>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {steps.map((st, i) => (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] ${
                      st.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white border-stone-300 text-transparent'
                    }`}
                  >
                    {st.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className={`text-xs font-bold ${st.completed ? 'text-stone-900' : 'text-stone-500'}`}>
                      {st.title}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">{st.time}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details Card */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
            <div className="flex items-start gap-2 text-stone-700">
              <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900">Delivering to:</strong>
                <span>{order.deliveryAddress}, {order.city} - {order.pincode}</span>
                <span className="block text-stone-500 mt-0.5">Contact: {order.customerPhone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-stone-700 pt-2 border-t border-stone-200/60">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-stone-500">Slot: </span>
                <strong className="text-stone-900">{order.deliverySlot}</strong>
                <span className="text-stone-500"> · Mode: </span>
                <strong className="capitalize text-stone-900">{order.paymentMethod.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          {/* Order Itemized Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Items in this Shipment
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {order.items.map((it) => (
                <div key={it.id} className="flex justify-between items-center text-xs py-1 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-stone-400">{it.quantity}x</span>
                    <span className="font-medium text-stone-800">{it.name}</span>
                    <span className="text-[11px] text-stone-500">({it.selectedCut.name}, {it.selectedWeight.label})</span>
                  </div>
                  <span className="font-mono font-semibold text-stone-900">
                    {formatCurrency(it.unitPrice * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between font-bold text-sm text-stone-950">
              <span>Grand Total</span>
              <span className="font-mono">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

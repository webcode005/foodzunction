import React, { useState } from 'react';
import {
  User as UserIcon,
  ShoppingBag,
  AlertCircle,
  MapPin,
  Clock,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Printer,
  Sparkles,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { User, OrderIssue } from '../types/auth';
import { Order } from '../types/store';
import { formatCurrency } from '../utils/cart-rules';
import { getIssueTypeLabel } from '../utils/auth-rules';

interface MyAccountViewProps {
  user: User;
  orders: Order[];
  issues: OrderIssue[];
  onReturnToStore: () => void;
  onLogout: () => void;
  onTrackOrder: (order: Order) => void;
  onOpenReportIssue: (orderId?: string) => void;
  onUpdateUserAddress: (address: string, pincode: string) => void;
}

export const MyAccountView: React.FC<MyAccountViewProps> = ({
  user,
  orders,
  issues,
  onReturnToStore,
  onLogout,
  onTrackOrder,
  onOpenReportIssue,
  onUpdateUserAddress,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'issues' | 'addresses'>('orders');
  const [searchOrder, setSearchOrder] = useState('');
  
  // Address edit state
  const [newAddress, setNewAddress] = useState(user.savedAddresses?.[0] || '');
  const [newPincode, setNewPincode] = useState(user.defaultPincode || '560034');
  const [addressSavedNotice, setAddressSavedNotice] = useState(false);

  const customerOrders = orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === user.email.toLowerCase() ||
      o.customerPhone === user.phone
  );

  const filteredOrders = customerOrders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchOrder.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchOrder.toLowerCase()))
  );

  const customerIssues = issues.filter(
    (iss) =>
      iss.customerId === user.id ||
      iss.customerEmail.toLowerCase() === user.email.toLowerCase()
  );

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    onUpdateUserAddress(newAddress.trim(), newPincode.trim());
    setAddressSavedNotice(true);
    setTimeout(() => setAddressSavedNotice(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-stone-900 text-white px-4 sm:px-6 py-3.5 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToStore}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back to FoodZunction Store</span>
            </button>
            <span className="text-stone-600">|</span>
            <span className="text-xs text-stone-400 font-medium">Customer Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-300 hidden sm:inline">Signed in as <strong>{user.name}</strong></span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Account Shell */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        {/* Profile Card Banner */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900">{user.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Halal Club Member
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {user.email} · Phone: +91 {user.phone} · Delivering to Pin: {user.defaultPincode || '560034'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center min-w-28">
              <span className="text-[11px] text-stone-500 block">Total Orders</span>
              <strong className="text-lg font-black text-stone-900 font-mono">
                {customerOrders.length}
              </strong>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center min-w-28">
              <span className="text-[11px] text-stone-500 block">Reported Issues</span>
              <strong className="text-lg font-black text-stone-900 font-mono">
                {customerIssues.length}
              </strong>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 mb-6 bg-white rounded-xl p-1 shadow-sm border">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-red-700 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({customerOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'issues'
                ? 'bg-red-700 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Order Issues &amp; Helpdesk ({customerIssues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-red-700 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Delivery Address</span>
          </button>
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-stone-900">Your Fresh Meat Order History</h2>
                <p className="text-xs text-stone-500">Track delivery status, review cuts, and report cold-chain or butchery issues</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by Order ID or item..."
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-stone-300 bg-white"
                />
                <button
                  type="button"
                  onClick={() => onOpenReportIssue()}
                  className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                >
                  Report Order Issue
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-2xl">
                  🥩
                </div>
                <h3 className="text-sm font-bold text-stone-800">No matching orders found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {customerOrders.length === 0
                    ? "You haven't placed an order yet. Browse our farm fresh chicken, mutton, and fish!"
                    : "No orders match your search query."}
                </p>
                <button
                  type="button"
                  onClick={onReturnToStore}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Shop Fresh Cuts
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 text-sm">{o.id}</span>
                          <span className="text-xs text-stone-400">· Placed {o.createdAt}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              o.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : o.status === 'out_for_delivery'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {o.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Slot: {o.deliverySlot} · Payment: {o.paymentMethod.toUpperCase()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onTrackOrder(o)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Live Cold-Chain Tracking
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenReportIssue(o.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Report Issue</span>
                        </button>
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {o.items.map((it) => (
                        <div key={it.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs flex justify-between items-center">
                          <div>
                            <strong className="text-stone-900 block">{it.name}</strong>
                            <span className="text-[11px] text-stone-500">
                              {it.selectedCut.name} · {it.selectedWeight.label} x {it.quantity}
                            </span>
                            {it.customButcheryNote && (
                              <p className="text-[10px] text-amber-800 italic mt-0.5">Note: {it.customButcheryNote}</p>
                            )}
                          </div>
                          <span className="font-mono font-bold text-stone-900 ml-2">
                            {formatCurrency(it.unitPrice * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order summary footer */}
                    <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-600 gap-2">
                      <div>
                        <span>Delivered to: </span>
                        <strong className="text-stone-800">{o.deliveryAddress}, {o.city} - {o.pincode}</strong>
                      </div>
                      <div className="text-right">
                        <span>Total Paid: </span>
                        <strong className="text-stone-950 font-mono text-sm">{formatCurrency(o.total)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDER ISSUES & HELPDESK */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-stone-900">Quality &amp; Order Issue Tickets</h2>
                <p className="text-xs text-stone-500">
                  Track investigations by our Cold-Chain &amp; Master Butcher Resolution Team
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenReportIssue()}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>File New Order Issue</span>
              </button>
            </div>

            {customerIssues.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h3 className="text-sm font-bold text-stone-900">No active issues reported</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  All your past orders have met the 100% FoodZunction fresh butchery standard. If you ever experience temperature or cut issues, report it here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customerIssues.map((iss) => (
                  <div
                    key={iss.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 text-xs">{iss.id}</span>
                          <span className="text-stone-300">·</span>
                          <span className="font-mono text-xs text-stone-500">Order: {iss.orderId}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              iss.status === 'resolved' || iss.status === 'refund_issued'
                                ? 'bg-emerald-100 text-emerald-800'
                                : iss.status === 'under_review'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {iss.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 mt-1">{iss.subject}</h4>
                        <span className="text-[11px] text-red-700 font-semibold">
                          Category: {getIssueTypeLabel(iss.issueType)}
                        </span>
                      </div>

                      <span className="text-[11px] text-stone-400 font-mono self-start sm:self-auto">
                        Filed: {iss.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200/60 leading-relaxed">
                      "{iss.description}"
                    </p>

                    {iss.resolutionNotes && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                        <strong className="text-emerald-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          Head Butcher Desk Resolution:
                        </strong>
                        <p className="text-emerald-800 leading-relaxed">
                          {iss.resolutionNotes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED DELIVERY ADDRESS */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 max-w-lg shadow-sm">
            <div>
              <h2 className="text-base font-bold text-stone-900">Manage Delivery Address</h2>
              <p className="text-xs text-stone-500">Used for automatic 90-minute express courier delivery</p>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Default Delivery Address
                </label>
                <textarea
                  rows={3}
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Flat number, building, street, landmarks"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Default Pincode (6 digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Save Address
                </button>
                {addressSavedNotice && (
                  <span className="text-xs text-emerald-700 font-semibold">
                    ✓ Address saved successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

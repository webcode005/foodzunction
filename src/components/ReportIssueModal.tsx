import React, { useState } from 'react';
import { X, AlertCircle, ShieldAlert, Check, Snowflake, Scale, Clock, MessageSquare } from 'lucide-react';
import { Order } from '../types/store';
import { OrderIssue, OrderIssueType, User } from '../types/auth';
import { createOrderIssueTicket } from '../utils/auth-rules';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  orders: Order[];
  preselectedOrderId?: string;
  onTicketCreated: (ticket: OrderIssue) => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  preselectedOrderId,
  onTicketCreated,
}) => {
  if (!isOpen) return null;

  const [orderId, setOrderId] = useState<string>(preselectedOrderId || (orders[0]?.id || ''));
  const [issueType, setIssueType] = useState<OrderIssueType>('cold_chain_temp');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!orderId) {
      setError('Please select the order related to this issue.');
      return;
    }
    if (!subject.trim()) {
      setError('Please provide a short summary of the issue.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setError('Please describe what happened with your meat or delivery in detail (min 10 characters).');
      return;
    }

    const newTicket = createOrderIssueTicket({
      orderId,
      user,
      issueType,
      subject,
      description,
    });

    onTicketCreated(newTicket);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  const selectedOrderObj = orders.find((o) => o.id === orderId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-red-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Report Order Issue</h2>
              <p className="text-[11px] text-red-200">FoodZunction Quality Assurance &amp; Resolution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-950/50 hover:bg-red-950 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close report modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Issue Ticket Submitted!</h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
              Our Master Butcher Desk has received your inquiry. We review cold-chain sensor records and will update you via SMS and your account dashboard shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Select Order */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Select Order *
              </label>
              {orders.length === 0 ? (
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. FZ-918234"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 font-mono"
                />
              ) : (
                <select
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-medium cursor-pointer"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} · {o.createdAt} ({o.items.length} items, Rs. {o.total})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Items summary */}
            {selectedOrderObj && (
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <span className="font-semibold block text-stone-700">Items in this delivery:</span>
                <p className="truncate">
                  {selectedOrderObj.items.map((i) => `${i.name} (${i.selectedCut.name})`).join(', ')}
                </p>
              </div>
            )}

            {/* Issue Category */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Issue Category *
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as OrderIssueType)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white font-medium cursor-pointer"
              >
                <option value="cold_chain_temp">❄️ Temperature / Thawed Meat Concern</option>
                <option value="wrong_cut">🔪 Wrong Cut Delivered (e.g. Biryani vs Curry cut)</option>
                <option value="damaged_packaging">📦 Damaged / Torn Vacuum Packaging</option>
                <option value="quality_issue">🥩 Freshness, Fat or Bone Observation</option>
                <option value="delivery_delay">⏰ Delivery Delay / Rider Coordination</option>
                <option value="other">💬 Other Inquiry</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Brief Subject *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mutton pieces were cut too large for curry"
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Detailed Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please share what went wrong so our head butcher and cold-chain logistics team can investigate and issue replacement or credit."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 leading-relaxed"
              />
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                Submit Quality Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

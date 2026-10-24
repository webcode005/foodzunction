import React, { useState } from 'react';
import { X, MapPin, Check, AlertCircle } from 'lucide-react';
import { isPincodeServiceable } from '../utils/cart-rules';

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPincode: string;
  onSelectPincode: (pincode: string) => void;
  serviceablePincodes: string[];
}

export const PincodeModal: React.FC<PincodeModalProps> = ({
  isOpen,
  onClose,
  currentPincode,
  onSelectPincode,
  serviceablePincodes,
}) => {
  if (!isOpen) return null;

  const [inputPin, setInputPin] = useState(currentPincode || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const clean = inputPin.trim();
    if (!clean) return;

    if (isPincodeServiceable(clean, serviceablePincodes)) {
      onSelectPincode(clean);
      onClose();
    } else {
      setError(`Pincode ${clean} is outside our current express zone. Please choose one of the active hubs below.`);
    }
  };

  const popularHubs = [
    { city: 'Bengaluru - Koramangala', pin: '560034' },
    { city: 'Bengaluru - Indiranagar', pin: '560038' },
    { city: 'Bengaluru - HSR Layout', pin: '560102' },
    { city: 'Bengaluru - CBD / MG Road', pin: '560001' },
    { city: 'New Delhi - Connaught Place', pin: '110001' },
    { city: 'Mumbai - Bandra West', pin: '400050' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-stone-900">Select Delivery Location</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Enter your 6-digit Pincode:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder="e.g. 560034"
                  className="flex-1 text-xs p-2.5 rounded-lg border border-stone-300 font-mono font-bold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}
          </form>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 block mb-2">
              Popular Express Delivery Hubs:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {popularHubs.map((hub) => (
                <button
                  key={hub.pin}
                  type="button"
                  onClick={() => {
                    onSelectPincode(hub.pin);
                    onClose();
                  }}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                    currentPincode === hub.pin
                      ? 'border-red-600 bg-red-50 text-red-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div>{hub.city}</div>
                  <span className="font-mono text-stone-500 text-[11px]">Pin: {hub.pin}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

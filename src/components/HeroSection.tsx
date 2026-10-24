import React, { useState } from 'react';
import { Search, ShieldCheck, Clock, Snowflake, Sparkles, Check, ArrowRight } from 'lucide-react';
import { isPincodeServiceable } from '../utils/cart-rules';

interface HeroSectionProps {
  currentPincode: string;
  onSetPincode: (pin: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  serviceablePincodes: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentPincode,
  onSetPincode,
  selectedCategory,
  onSelectCategory,
  serviceablePincodes,
}) => {
  const [pinInput, setPinInput] = useState(currentPincode || '560034');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    const isAvailable = isPincodeServiceable(pinInput, serviceablePincodes);
    if (isAvailable) {
      onSetPincode(pinInput.trim());
      setPinFeedback(`Great news! Express 90-min cold-chain delivery is active in ${pinInput}.`);
    } else {
      setPinFeedback(`Pincode ${pinInput} is coming soon. Currently serving core Bengaluru, Mumbai & Delhi hubs (try 560034, 560001, 110001).`);
    }
  };

  const categories = [
    { id: 'all', label: 'All Cuts', count: '10 items', img: null, icon: '🥩' },
    { id: 'chicken', label: 'Raw Chicken', count: '4 cuts', img: '/images/foodzunction/cat_chicken.png', icon: '🍗' },
    { id: 'mutton', label: 'Rich Mutton', count: '4 cuts', img: '/images/foodzunction/cat_mutton.png', icon: '🍖' },
    { id: 'fish', label: 'Coastal Fish', count: '4 varieties', img: '/images/foodzunction/cat_fish.png', icon: '🐟' },
    { id: 'combos', label: 'Family Combos', count: 'Save Rs. 120', img: '/images/foodzunction/cat_ready.png', icon: '🥘' },
  ];

  return (
    <section className="bg-stone-900 text-stone-100 pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-stone-800 relative overflow-hidden">
      {/* Background ambient texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              100% Halal Certified · Zero Antibiotics · Cut to Order
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Farm-Fresh Mutton, Coastal Fish &amp; Tender Chicken.
            </h1>

            <p className="text-stone-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Never frozen. Sourced from humane farms and daily sea catch, expertly hand-cut by master butchers, and delivered ice-cold in temperature-controlled vacuum packs within 90 minutes.
            </p>

            {/* Pincode Quick-Checker Form */}
            <form onSubmit={handleCheckPincode} className="bg-stone-800/80 p-2 sm:p-2.5 rounded-xl border border-stone-700/80 max-w-lg shadow-xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-stone-900/90 rounded-lg border border-stone-700">
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter 6-digit Pincode (e.g. 560034)"
                    maxLength={6}
                    className="w-full bg-transparent text-sm text-white placeholder-stone-400 focus:outline-none font-mono"
                    aria-label="Delivery Pincode"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Check Express Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {pinFeedback && (
                <p className="mt-2 text-xs px-2 text-amber-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {pinFeedback}
                </p>
              )}
            </form>

            {/* 4 Trust Highlights Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Halal Verified</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>90-Min Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Snowflake className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>0°C - 4°C Cold Chain</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
                <span>Custom Precision Cuts</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5">
            <div className="bg-stone-800 rounded-2xl border border-stone-700 p-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-stone-700">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Today's Prime Batch</span>
                  <h3 className="text-lg font-bold text-white">Butcher Fresh Guarantee</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400">Inspected at</span>
                  <span className="block text-xs font-mono font-semibold text-emerald-400">06:00 AM Today</span>
                </div>
              </div>

              {/* Three category highlights mini-grid */}
              <div className="space-y-3 pt-4">
                <div
                  onClick={() => onSelectCategory('chicken')}
                  className="group flex items-center justify-between p-3 rounded-xl bg-stone-900/80 hover:bg-stone-900 border border-stone-700/60 cursor-pointer transition-all hover:border-red-600/60"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/foodzunction/cat_chicken.png"
                      alt="Chicken"
                      className="w-9 h-9 object-contain rounded-lg bg-stone-800 p-0.5"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">Tender Raw Chicken</h4>
                      <p className="text-xs text-stone-400">Curry Cut, Biryani Cut, Boneless Breast &amp; Keema</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-red-400">From Rs. 179</span>
                </div>

                <div
                  onClick={() => onSelectCategory('mutton')}
                  className="group flex items-center justify-between p-3 rounded-xl bg-stone-900/80 hover:bg-stone-900 border border-stone-700/60 cursor-pointer transition-all hover:border-red-600/60"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/foodzunction/cat_mutton.png"
                      alt="Mutton"
                      className="w-9 h-9 object-contain rounded-lg bg-stone-800 p-0.5"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">Pasture-Raised Mutton</h4>
                      <p className="text-xs text-stone-400">Tender Goat Curry &amp; Biryani Cut, Chops &amp; Ribs</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-red-400">From Rs. 479</span>
                </div>

                <div
                  onClick={() => onSelectCategory('fish')}
                  className="group flex items-center justify-between p-3 rounded-xl bg-stone-900/80 hover:bg-stone-900 border border-stone-700/60 cursor-pointer transition-all hover:border-red-600/60"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/foodzunction/cat_fish.png"
                      alt="Fish"
                      className="w-9 h-9 object-contain rounded-lg bg-stone-800 p-0.5"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">Fresh Coastal Fish</h4>
                      <p className="text-xs text-stone-400">Surmai Steaks, White Pomfret, Bengali Rohu, Prawns</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-red-400">From Rs. 249</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-700 flex items-center justify-between text-xs text-stone-400">
                <span>Free delivery on orders above Rs. 499</span>
                <span className="text-emerald-400 font-medium">● 32 Express Riders Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-10 pt-6 border-t border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Select Category</span>
            <span className="text-xs text-stone-400">Showing precision cuts</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                }`}
              >
                {cat.img ? (
                  <img src={cat.img} alt={cat.label} className="w-5 h-5 object-contain" />
                ) : (
                  <span>{cat.icon}</span>
                )}
                <span>{cat.label}</span>
                <span className={`text-[11px] font-normal ${selectedCategory === cat.id ? 'text-red-200' : 'text-stone-400'}`}>
                  ({cat.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

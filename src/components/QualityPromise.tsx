import React from 'react';
import { ShieldCheck, Snowflake, Award, Sparkles, Scale, RefreshCw } from 'lucide-react';

export const QualityPromise: React.FC = () => {
  return (
    <section className="py-14 bg-stone-100 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider text-red-700 font-bold">
            The FoodZunction Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Why Our Meats &amp; Fish Taste Better
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            We operate an unbroken cold-chain from pasture and coastal boats directly to your kitchen. Zero chemical preservatives, zero thawed meat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">100% Halal Certified</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Adheres strictly to authentic Halal slaughtering principles overseen by certified butchers with complete traceability.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              Verified Daily Audits
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-4">
              <Snowflake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">Unbroken 0°C–4°C Cold Chain</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Meat is never frozen solid and never left at room temperature. Chilled instantly to keep muscle fibers tender and juices intact.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              Multi-Layer Vacuum Insulation
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">Zero Antibiotics &amp; Hormones</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Our chickens and goats are pasture and grain-fed on dedicated bio-secure farms with zero chemical stimulants or synthetic growth promoters.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              100% Chemical-Free
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">Honest Net Weight Guarantee</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                You only pay for what you eat. We weigh after cleaning, descaling, and trimming unnecessary gristle and skin.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              Zero Deceptive Shrinkage
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

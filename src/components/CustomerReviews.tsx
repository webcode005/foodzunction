import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/store-extras';

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-red-700 font-bold">
              Verified Customers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Loved by Home Chefs &amp; Meat Lovers
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Read real reviews from households who rely on FoodZunction for their weekly mutton, fish, and chicken.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone-200 shadow-sm shrink-0">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-stone-900">4.9 / 5.0 Rating</span>
            <span className="text-[11px] text-stone-400">· 2,840+ Orders</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">{rev.date}</span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <strong className="text-xs font-bold text-stone-900 block">{rev.author}</strong>
                  <span className="text-[11px] text-stone-500">{rev.city}</span>
                </div>
                <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {rev.meatBought}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

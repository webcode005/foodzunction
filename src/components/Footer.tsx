import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onSelectCategory }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-800 text-xs">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/images/foodzunction/logo.png"
                alt="FoodZunction Logo"
                className="h-10 w-auto object-contain brightness-110"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-stone-400 leading-relaxed max-w-sm">
              FoodZunction is your premier online butcher shop for farm-fresh antibiotic-free chicken, tender pasture goat mutton, and fresh catch coastal fish. Delivered in unbroken cold-chain packaging within 90 minutes.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Halal Certified &amp; FSSAI Compliant</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">Fresh Cuts</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('chicken');
                    window.scrollTo({ top: 480, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Raw Tender Chicken
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('mutton');
                    window.scrollTo({ top: 480, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pasture Goat Mutton
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('fish');
                    window.scrollTo({ top: 480, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Fresh Coastal Fish &amp; Prawns
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('combos');
                    window.scrollTo({ top: 480, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Weekend Family Combos
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">Customer Care</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 98450 12345 (7 AM - 10 PM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>orders@foodzunction.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Central Processing Hub, Outer Ring Road, Bengaluru</span>
              </li>
            </ul>
          </div>

          {/* WordPress & WooCommerce Store Portal */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">Store Owner</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Manage live products, WooCommerce orders, inventory cuts, and coupons in the integrated WordPress dashboard.
            </p>
            <button
              onClick={onOpenAdmin}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg text-xs font-bold border border-stone-700 transition-colors cursor-pointer"
            >
              <span>Access WP Admin</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} FoodZunction (foodzunction.com). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Cold-Chain Refund Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

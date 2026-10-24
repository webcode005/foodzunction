import React, { useState } from 'react';
import { ShoppingBag, MapPin, ShieldCheck, Settings, Check, User as UserIcon, LogOut, ChevronDown, HelpCircle, AlertCircle } from 'lucide-react';
import { CartItem } from '../types/store';
import { User } from '../types/auth';
import { formatCurrency } from '../utils/cart-rules';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  currentPincode: string;
  onOpenPincodeModal: () => void;
  activeView: 'store' | 'admin' | 'account';
  onToggleView: (view: 'store' | 'admin' | 'account') => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAccount: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  currentPincode,
  onOpenPincodeModal,
  activeView,
  onToggleView,
  selectedCategory,
  onSelectCategory,
  currentUser,
  onOpenAuth,
  onOpenAccount,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 font-medium text-stone-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Halal Certified &amp; Antibiotic-Free
            </span>
            <span className="hidden md:inline text-stone-500">|</span>
            <span className="hidden md:inline text-stone-300">
              Chilled to 0°C–4°C Unbroken Cold Chain Delivery
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <button
              onClick={onOpenPincodeModal}
              className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Delivering to: <strong className="text-white underline">{currentPincode || 'Select Pin'}</strong></span>
            </button>
            <span className="text-stone-600">|</span>
            <span className="text-amber-400 font-medium">90 Min Express</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav Links) — Zone 3 (Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onToggleView('store')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            {/* Official FoodZunction Logo */}
            <div className="h-10 sm:h-12 flex items-center">
              <img
                src="/images/foodzunction/logo.png"
                alt="FoodZunction Logo"
                className="h-9 sm:h-11 w-auto object-contain"
                onError={(e) => {
                  // Fallback to text lockup if image blocked
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = document.getElementById('logo-text-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div id="logo-text-fallback" className="hidden items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold text-lg">
                  FZ
                </div>
                <div>
                  <span className="text-xl font-extrabold tracking-tight text-stone-950">FoodZunction</span>
                  <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-medium">Fresh Meat Butcher</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-700">
          <button
            onClick={() => {
              onToggleView('store');
              onSelectCategory('all');
              window.scrollTo({ top: 480, behavior: 'smooth' });
            }}
            className={`whitespace-nowrap transition-colors hover:text-red-700 cursor-pointer ${
              activeView === 'store' && selectedCategory === 'all' ? 'text-red-700' : ''
            }`}
          >
            All Cuts
          </button>
          <button
            onClick={() => {
              onToggleView('store');
              onSelectCategory('chicken');
              window.scrollTo({ top: 480, behavior: 'smooth' });
            }}
            className={`whitespace-nowrap transition-colors hover:text-red-700 cursor-pointer ${
              activeView === 'store' && selectedCategory === 'chicken' ? 'text-red-700' : ''
            }`}
          >
            Raw Chicken
          </button>
          <button
            onClick={() => {
              onToggleView('store');
              onSelectCategory('mutton');
              window.scrollTo({ top: 480, behavior: 'smooth' });
            }}
            className={`whitespace-nowrap transition-colors hover:text-red-700 cursor-pointer ${
              activeView === 'store' && selectedCategory === 'mutton' ? 'text-red-700' : ''
            }`}
          >
            Pasture Mutton
          </button>
          <button
            onClick={() => {
              onToggleView('store');
              onSelectCategory('fish');
              window.scrollTo({ top: 480, behavior: 'smooth' });
            }}
            className={`whitespace-nowrap transition-colors hover:text-red-700 cursor-pointer ${
              activeView === 'store' && selectedCategory === 'fish' ? 'text-red-700' : ''
            }`}
          >
            Fresh Coastal Fish
          </button>
          <button
            onClick={() => onOpenAccount()}
            className={`whitespace-nowrap transition-colors hover:text-red-700 cursor-pointer flex items-center gap-1 ${
              activeView === 'account' ? 'text-red-700 font-bold' : ''
            }`}
          >
            <span>My Account &amp; Orders</span>
            {currentUser && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            )}
          </button>
          <a
            href="#recipes"
            onClick={() => onToggleView('store')}
            className="whitespace-nowrap text-stone-600 hover:text-red-700 transition-colors"
          >
            Recipes &amp; Prep
          </a>
        </nav>

        {/* Zone 3: Account + WP Admin + Cart */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User Account / Auth Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 transition-all cursor-pointer"
                aria-expanded={isUserMenuOpen}
              >
                <div className="w-5 h-5 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-24 truncate hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-500 font-mono truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                      Role: {currentUser.role}
                    </span>
                  </div>

                  <button
                    onClick={onOpenAccount}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
                    <span>My Orders &amp; Invoices</span>
                  </button>

                  <button
                    onClick={onOpenAccount}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>Quality Issues &amp; Helpdesk</span>
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => onToggleView('admin')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-50/60 hover:bg-amber-100/80 flex items-center gap-2 cursor-pointer border-t border-amber-100"
                    >
                      <Settings className="w-3.5 h-3.5 text-amber-700" />
                      <span>Super Admin Desk</span>
                    </button>
                  )}

                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Register</span>
              </button>
            </div>
          )}

          {/* WP Admin Switcher */}
          <button
            onClick={() => onToggleView(activeView === 'admin' ? 'store' : 'admin')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'admin'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
            title="Manage Products, Orders, Customers & Issue Tickets"
          >
            <Settings className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">{activeView === 'admin' ? 'Back to Store' : 'Super Admin'}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg shadow-sm font-semibold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap active:scale-98"
            aria-label={`Shopping Cart with ${totalItemsCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <span>Cart</span>
            {cartSubtotal > 0 && (
              <span className="border-l border-red-500 pl-2 text-red-100 font-mono tabular-nums">
                {formatCurrency(cartSubtotal)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

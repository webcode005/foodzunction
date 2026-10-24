import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Lock, Mail, Phone, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { User } from '../types/auth';
import {
  authenticate,
  validateRegistrationInput,
  SUPER_ADMIN_CREDENTIALS,
  DEMO_CUSTOMER_CREDENTIALS,
} from '../utils/auth-rules';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
  customUsers: { user: User; pass: string }[];
  onRegisterUser: (user: User, pass: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  customUsers,
  onRegisterUser,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPincode, setRegPincode] = useState('560034');
  const [regAddress, setRegAddress] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = authenticate(loginIdentifier, loginPassword, customUsers);
    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateRegistrationInput({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
    });

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please fill all required registration fields.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      role: 'customer',
      savedAddresses: regAddress.trim() ? [regAddress.trim()] : [],
      defaultPincode: regPincode.trim() || '560034',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onRegisterUser(newUser, regPassword);
    onSuccess(newUser);
    onClose();
  };

  const fillSuperAdmin = () => {
    setMode('login');
    setLoginIdentifier(SUPER_ADMIN_CREDENTIALS.email);
    setLoginPassword(SUPER_ADMIN_CREDENTIALS.password);
    setErrorMessage(null);
  };

  const fillDemoCustomer = () => {
    setMode('login');
    setLoginIdentifier(DEMO_CUSTOMER_CREDENTIALS.email);
    setLoginPassword(DEMO_CUSTOMER_CREDENTIALS.password);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/foodzunction/favicon.png"
              alt="FoodZunction"
              className="w-8 h-8 rounded-full object-contain bg-white p-0.5"
            />
            <div>
              <h2 className="text-base font-bold text-white">FoodZunction Account</h2>
              <p className="text-[11px] text-stone-400">Order tracking, custom cuts &amp; store management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Credentials Demo Strip */}
        <div className="p-3 bg-amber-50/90 border-b border-amber-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block mb-1.5">
            Quick 1-Click Credentials (Test Mode):
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={fillSuperAdmin}
              className="flex-1 py-1.5 px-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Super Admin Credentials</span>
            </button>
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Customer Credentials</span>
            </button>
          </div>
          <div className="mt-1 text-[10px] text-stone-500 font-mono">
            Admin: admin@foodzunction.com / FoodZunction@2026
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-red-700 border-b-2 border-red-700 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign In / Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-red-700 border-b-2 border-red-700 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="admin@foodzunction.com or 9845012345"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer mt-2"
              >
                Sign In to FoodZunction
              </button>

              <p className="text-[11px] text-stone-500 text-center pt-2">
                New customer?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-red-700 font-bold hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Basant M"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Mobile (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="9845012345"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Create Password (min 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="House/Street, Locality"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={regPincode}
                    onChange={(e) => setRegPincode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer mt-2"
              >
                Register &amp; Start Ordering
              </button>

              <p className="text-[11px] text-stone-500 text-center pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-red-700 font-bold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Users,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { Product, Order, Coupon, StoreSettings } from '../types/store';
import { User, OrderIssue, OrderIssueStatus } from '../types/auth';
import { formatCurrency } from '../utils/cart-rules';
import { authenticate, SUPER_ADMIN_CREDENTIALS, getIssueTypeLabel } from '../utils/auth-rules';

interface WpAdminDashboardProps {
  currentUser: User | null;
  onAdminLogin: (user: User) => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  coupons: Coupon[];
  onUpdateCoupons: (coupons: Coupon[]) => void;
  settings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
  customers: User[];
  issues: OrderIssue[];
  onUpdateIssues: (issues: OrderIssue[]) => void;
  onReturnToStore: () => void;
  customUsers: { user: User; pass: string }[];
}

export const WpAdminDashboard: React.FC<WpAdminDashboardProps> = ({
  currentUser,
  onAdminLogin,
  products,
  onUpdateProducts,
  orders,
  onUpdateOrders,
  coupons,
  onUpdateCoupons,
  settings,
  onUpdateSettings,
  customers,
  issues,
  onUpdateIssues,
  onReturnToStore,
  customUsers,
}) => {
  // If not logged in as Admin, show the Super Admin Login screen
  const isAdminLoggedIn = currentUser && currentUser.role === 'admin';

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const res = authenticate(adminEmail, adminPassword, customUsers);
    if (res.success && res.user && res.user.role === 'admin') {
      onAdminLogin(res.user);
    } else {
      setLoginError('Invalid admin credentials. Use the Super Admin credentials provided below.');
    }
  };

  const fillAdminCredentials = () => {
    setAdminEmail(SUPER_ADMIN_CREDENTIALS.email);
    setAdminPassword(SUPER_ADMIN_CREDENTIALS.password);
    setLoginError(null);
  };

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'orders' | 'customers' | 'issues' | 'coupons' | 'settings'
  >('dashboard');

  // New Product Modal Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'chicken' | 'mutton' | 'fish'>('chicken');
  const [newPrice, setNewPrice] = useState(299);
  const [newOriginalPrice, setNewOriginalPrice] = useState(349);
  const [newTagline, setNewTagline] = useState('');
  const [newPieces, setNewPieces] = useState('10 - 14 pieces');

  // New Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(100);
  const [newCouponMin, setNewCouponMin] = useState(499);

  // Resolution Notes State
  const [activeIssueResolving, setActiveIssueResolving] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const inStockProductsCount = products.filter((p) => p.inStock).length;
  const openIssuesCount = issues.filter((i) => i.status === 'open' || i.status === 'under_review').length;

  // Stock toggle
  const handleToggleStock = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    );
    onUpdateProducts(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this cut from the store catalog?')) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: newTitle.trim(),
      category: newCategory,
      cutSubtitle: 'Fresh Butcher Cut',
      tagline: newTagline.trim() || 'Freshly cut to order by master butchers.',
      description: 'Hand-inspected, chilled to 0-4°C and vacuum sealed.',
      basePrice: Number(newPrice),
      originalPrice: Number(newOriginalPrice),
      defaultWeight: 500,
      defaultWeightLabel: '500g',
      netWeight: '480g - 500g net',
      grossWeight: '550g - 600g',
      pieces: newPieces.trim() || '8 - 12 pieces',
      serves: '2 - 3 people',
      inStock: true,
      stockCount: 20,
      isHalalCertified: true,
      antibioticFree: true,
      storageTemp: '0°C - 4°C',
      badgeText: 'New Cut',
      primaryTone:
        newCategory === 'chicken'
          ? 'from-amber-700 to-red-800'
          : newCategory === 'mutton'
          ? 'from-red-900 to-stone-900'
          : 'from-cyan-900 to-blue-950',
      accentTone: '#dc2626',
      cutOptions: [
        { id: 'custom-cut-std', name: 'Curry Cut', description: 'Standard bone-in curry cut', boneType: 'with-bone' },
      ],
      weightOptions: [
        { weightInGrams: 500, label: '500g pack', multiplier: 1, netWeightLabel: '500g net', serves: '2-3 serves' },
        { weightInGrams: 1000, label: '1kg pack', multiplier: 1.9, netWeightLabel: '1000g net', serves: '4-6 serves' },
      ],
      cookingTips: ['Cook fresh within 48 hours for best flavor.'],
    };

    onUpdateProducts([newProd, ...products]);
    setShowAddProductModal(false);
    setNewTitle('');
    setNewTagline('');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    onUpdateOrders(updated);
  };

  const handleUpdateIssueStatus = (issueId: string, newStatus: OrderIssueStatus) => {
    const updated = issues.map((i) =>
      i.id === issueId ? { ...i, status: newStatus } : i
    );
    onUpdateIssues(updated);
  };

  const handleSaveResolution = (issueId: string) => {
    if (!resolutionText.trim()) return;
    const updated = issues.map((i) =>
      i.id === issueId
        ? {
            ...i,
            resolutionNotes: resolutionText.trim(),
            status: 'resolved' as OrderIssueStatus,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        : i
    );
    onUpdateIssues(updated);
    setActiveIssueResolving(null);
    setResolutionText('');
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newCpn: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountType: 'flat',
      value: Number(newCouponValue),
      minOrderValue: Number(newCouponMin),
      description: `Flat Rs. ${newCouponValue} off on orders over Rs. ${newCouponMin}`,
      isActive: true,
    };

    onUpdateCoupons([...coupons, newCpn]);
    setNewCouponCode('');
  };

  const handleToggleCoupon = (code: string) => {
    const updated = coupons.map((c) =>
      c.code === code ? { ...c, isActive: !c.isActive } : c
    );
    onUpdateCoupons(updated);
  };

  // IF NOT LOGGED IN AS ADMIN: RENDER SUPER ADMIN LOGIN PORTAL
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 flex flex-col justify-center items-center p-4">
        <div className="bg-white text-stone-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-stone-700 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-stone-950 text-white p-6 text-center border-b border-stone-800">
            <img
              src="/images/foodzunction/logo.png"
              alt="FoodZunction Logo"
              className="h-12 w-auto mx-auto mb-3 object-contain"
            />
            <h1 className="text-xl font-bold">FoodZunction Super Admin</h1>
            <p className="text-xs text-stone-400 mt-0.5">
              WooCommerce Store, Inventory &amp; Order Management Portal
            </p>
          </div>

          {/* Credentials Display Box */}
          <div className="p-4 bg-amber-50 border-b border-amber-200 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Super Admin Credentials</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-amber-200 text-stone-800 font-mono text-xs space-y-1">
              <div>Email: <strong className="text-stone-950">admin@foodzunction.com</strong></div>
              <div>Password: <strong className="text-stone-950">FoodZunction@2026</strong></div>
            </div>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Fill Admin Credentials</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLoginSubmit} className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@foodzunction.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer"
            >
              Sign In to Super Admin Panel
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onReturnToStore}
                className="text-xs text-stone-500 hover:text-stone-900 font-semibold cursor-pointer"
              >
                ← Return to Storefront
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED-IN SUPER ADMIN VIEW
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top WordPress Admin Bar */}
      <header className="bg-stone-900 text-stone-200 h-11 px-4 flex items-center justify-between text-xs border-b border-stone-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="w-5 h-5 rounded-full bg-stone-700 flex items-center justify-center font-serif text-[10px] text-white">
              W
            </span>
            <span className="hidden sm:inline">FoodZunction WooCommerce Manager</span>
            <span className="sm:hidden font-mono text-red-400">WP Admin</span>
          </div>
          <span className="text-stone-600">|</span>
          <button
            onClick={onReturnToStore}
            className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Visit Storefront</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-stone-400 hidden md:inline">Logged in as Super Admin</span>
          <img
            src="/images/foodzunction/favicon.png"
            alt="FoodZunction"
            className="w-6 h-6 rounded-full object-contain bg-white p-0.5"
          />
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* WP Admin Sidebar */}
        <aside className="w-full md:w-60 bg-stone-900 text-stone-300 p-3 space-y-1 shrink-0">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-stone-500 font-bold">
            Store Management
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-red-700 text-white' : 'hover:bg-stone-800 text-stone-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-red-700 text-white' : 'hover:bg-stone-800 text-stone-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>WooCommerce Orders</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-amber-400 text-stone-950 rounded">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'issues' ? 'bg-red-700 text-white' : 'hover:bg-stone-800 text-stone-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Order Issues Desk</span>
            </div>
            {openIssuesCount > 0 && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-red-500 text-white rounded">
                {openIssuesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-red-700 text-white' : 'hover:bg-stone-800 text-stone-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Products &amp; Cuts</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-stone-800 rounded">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'customers' ? 'bg-red-700 text-white' : 'hover:bg-stone-800 text-stone-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Customer Accounts</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-stone-800 rounded">
              {customers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'coupons' ? 'bg-red-700 text-white' : 'hover:bg-stone-800 text-stone-300'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-red-700 text-white' : 'hover:bg-stone-800 text-stone-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Delivery Settings</span>
          </button>

          <div className="pt-4 border-t border-stone-800 mt-4">
            <button
              onClick={onReturnToStore}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-400 hover:text-amber-300 hover:bg-stone-800 rounded-lg cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                    FoodZunction Super Admin Dashboard
                  </h1>
                  <p className="text-xs text-stone-500">
                    Live butcher orders, customer accounts, cold-chain tickets &amp; inventory control
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    + Add New Cut
                  </button>
                </div>
              </div>

              {/* 5 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <span className="text-xs text-stone-500 block">Total Revenue</span>
                  <strong className="text-xl font-black text-stone-900 font-mono mt-1 block">
                    {formatCurrency(totalRevenue)}
                  </strong>
                  <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                    ● Real-time synced
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <span className="text-xs text-stone-500 block">Total Orders</span>
                  <strong className="text-xl font-black text-stone-900 font-mono mt-1 block">
                    {orders.length}
                  </strong>
                  <span className="text-[11px] text-amber-600 font-medium mt-1 block">
                    {pendingOrdersCount} orders processing
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <span className="text-xs text-stone-500 block">Open Order Issues</span>
                  <strong className="text-xl font-black text-stone-900 font-mono mt-1 block">
                    {openIssuesCount}
                  </strong>
                  <span className="text-[11px] text-red-600 font-medium mt-1 block">
                    Customer tickets
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <span className="text-xs text-stone-500 block">Registered Customers</span>
                  <strong className="text-xl font-black text-stone-900 font-mono mt-1 block">
                    {customers.length}
                  </strong>
                  <span className="text-[11px] text-emerald-600 mt-1 block">
                    Active customer accounts
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <span className="text-xs text-stone-500 block">Active Cuts in Store</span>
                  <strong className="text-xl font-black text-stone-900 font-mono mt-1 block">
                    {inStockProductsCount} / {products.length}
                  </strong>
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Chicken, Mutton, Fish
                  </span>
                </div>
              </div>

              {/* Recent Orders Stream */}
              <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-red-700 font-bold hover:underline cursor-pointer"
                  >
                    View All Orders ({orders.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 font-semibold">
                        <th className="pb-2">Order ID</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Items</th>
                        <th className="pb-2">Total</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-stone-50">
                          <td className="py-2.5 font-mono font-bold text-stone-900">{o.id}</td>
                          <td className="py-2.5">
                            <div>{o.customerName}</div>
                            <div className="text-[10px] text-stone-400">{o.pincode}</div>
                          </td>
                          <td className="py-2.5">{o.items.length} items</td>
                          <td className="py-2.5 font-mono font-bold">{formatCurrency(o.total)}</td>
                          <td className="py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                o.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : o.status === 'out_for_delivery'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {o.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <button
                              onClick={() => setActiveTab('orders')}
                              className="text-red-700 font-semibold hover:underline cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WOOCOMMERCE ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                  Manage Customer Orders
                </h1>
                <p className="text-xs text-stone-500">
                  Update cold-chain prep and rider dispatch status
                </p>
              </div>

              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black font-mono text-stone-900">{o.id}</span>
                          <span className="text-xs text-stone-400">· Placed {o.createdAt}</span>
                        </div>
                        <p className="text-xs text-stone-600 font-medium">
                          Customer: <strong>{o.customerName}</strong> ({o.customerPhone}) · {o.city} ({o.pincode})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">Butcher Status:</span>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as Order['status'])}
                          className="text-xs font-bold p-1.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-800 cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="cut_sanitized">Cut &amp; Sanitized (2°C)</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[11px] uppercase font-bold text-stone-400">Ordered Cuts:</span>
                      {o.items.map((it) => (
                        <div key={it.id} className="flex justify-between items-center bg-stone-50 p-2 rounded-lg">
                          <div>
                            <strong className="text-stone-900">{it.name}</strong>
                            <span className="text-stone-500 ml-1.5">
                              ({it.selectedCut.name}, {it.selectedWeight.label}) x {it.quantity}
                            </span>
                            {it.customButcheryNote && (
                              <p className="text-[10px] text-amber-800 italic">Butchery Note: {it.customButcheryNote}</p>
                            )}
                          </div>
                          <span className="font-mono font-bold">{formatCurrency(it.unitPrice * it.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-600 gap-2">
                      <div>
                        <span>Delivery Address: </span>
                        <span className="text-stone-800">{o.deliveryAddress}</span>
                      </div>
                      <div className="font-bold text-stone-900 text-sm">
                        Total Bill: <span className="font-mono">{formatCurrency(o.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ORDER ISSUES & HELPDESK */}
          {activeTab === 'issues' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                  Customer Order Issues &amp; Quality Desk
                </h1>
                <p className="text-xs text-stone-500">
                  Review customer cold-chain, wrong cut, or delivery delay tickets and provide resolution notes
                </p>
              </div>

              {issues.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-stone-200 text-xs text-stone-500">
                  No issues currently reported by customers.
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((iss) => (
                    <div
                      key={iss.id}
                      className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-900 text-sm">{iss.id}</span>
                            <span className="text-stone-300">·</span>
                            <span className="font-mono text-xs text-stone-600">Order: {iss.orderId}</span>
                            <span className="text-xs text-stone-400">· Filed {iss.createdAt}</span>
                          </div>
                          <h3 className="text-sm font-bold text-stone-900 mt-1">{iss.subject}</h3>
                          <p className="text-xs text-stone-500">
                            Customer: <strong>{iss.customerName}</strong> ({iss.customerPhone}) · {iss.customerEmail}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-500">Status:</span>
                          <select
                            value={iss.status}
                            onChange={(e) => handleUpdateIssueStatus(iss.id, e.target.value as OrderIssueStatus)}
                            className="text-xs font-bold p-1.5 rounded-lg border border-stone-300 bg-stone-50 cursor-pointer"
                          >
                            <option value="open">Open</option>
                            <option value="under_review">Under Review</option>
                            <option value="resolved">Resolved</option>
                            <option value="refund_issued">Refund Issued</option>
                          </select>
                        </div>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1">
                        <span className="text-[11px] font-bold uppercase text-red-700">
                          {getIssueTypeLabel(iss.issueType)}:
                        </span>
                        <p className="text-stone-700 leading-relaxed italic">
                          "{iss.description}"
                        </p>
                      </div>

                      {/* Resolution Notes Box */}
                      {iss.resolutionNotes ? (
                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-1">
                          <strong className="text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            Current Butcher Resolution to Customer:
                          </strong>
                          <p className="text-emerald-800">{iss.resolutionNotes}</p>
                        </div>
                      ) : activeIssueResolving === iss.id ? (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                          <label className="text-xs font-bold text-amber-900 block">
                            Write Resolution &amp; Send to Customer's "My Account":
                          </label>
                          <textarea
                            rows={2}
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            placeholder="e.g. We have reviewed the butcher cut log and credited Rs. 150 to your account with a fresh replacement cut."
                            className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveResolution(iss.id)}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold cursor-pointer"
                            >
                              Save &amp; Resolve Issue
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveIssueResolving(null)}
                              className="px-3 py-1.5 border border-stone-300 text-stone-700 rounded text-xs font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveIssueResolving(iss.id);
                            setResolutionText('');
                          }}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          + Add Head Butcher Resolution Note
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRODUCTS & CUTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                    Products &amp; Cuts Catalog
                  </h1>
                  <p className="text-xs text-stone-500">
                    Manage prices, stocks, and cut configurations for Mutton, Fish, and Chicken
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product Cut</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                      <tr>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Base Price (500g)</th>
                        <th className="p-3">Pieces / Net</th>
                        <th className="p-3">Stock Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="p-3">
                            <strong className="text-stone-900 block">{p.name}</strong>
                            <span className="text-[11px] text-stone-400">{p.cutSubtitle || p.tagline}</span>
                          </td>
                          <td className="p-3 capitalize font-medium text-stone-700">
                            {p.category}
                          </td>
                          <td className="p-3 font-mono font-bold text-stone-900">
                            {formatCurrency(p.basePrice)}
                          </td>
                          <td className="p-3 text-stone-600">
                            {p.pieces} <span className="text-stone-400">({p.netWeight})</span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleStock(p.id)}
                              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-stone-400 hover:text-red-700 p-1 cursor-pointer transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER ACCOUNTS */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                  Registered Customers ({customers.length})
                </h1>
                <p className="text-xs text-stone-500">
                  Manage customer profiles, contact numbers, order frequency, and default delivery hubs
                </p>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                      <tr>
                        <th className="p-3">Customer Name</th>
                        <th className="p-3">Email &amp; Phone</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Delivery Pincode</th>
                        <th className="p-3">Orders Placed</th>
                        <th className="p-3">Registered Since</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {customers.map((c) => {
                        const custOrders = orders.filter(
                          (o) =>
                            o.customerEmail.toLowerCase() === c.email.toLowerCase() ||
                            o.customerPhone === c.phone
                        );
                        return (
                          <tr key={c.id} className="hover:bg-stone-50">
                            <td className="p-3">
                              <strong className="text-stone-900 block">{c.name}</strong>
                              <span className="text-[10px] text-stone-400 font-mono">{c.id}</span>
                            </td>
                            <td className="p-3">
                              <div className="text-stone-800">{c.email}</div>
                              <div className="text-stone-400 font-mono text-[11px]">+91 {c.phone}</div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  c.role === 'admin'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {c.role}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-stone-700">
                              {c.defaultPincode || '560034'}
                            </td>
                            <td className="p-3 font-mono font-bold text-stone-900">
                              {custOrders.length} orders
                            </td>
                            <td className="p-3 text-stone-500 font-mono">
                              {c.createdAt}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                  Coupons &amp; Promotions
                </h1>
                <p className="text-xs text-stone-500">
                  Configure discount codes for fresh meat shoppers
                </p>
              </div>

              <form onSubmit={handleAddCoupon} className="bg-white p-5 rounded-xl border border-stone-200 space-y-3 max-w-lg shadow-sm">
                <h3 className="text-xs font-bold uppercase text-stone-500">Create New Coupon</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-500 block">Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BUTCHER50"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block">Flat Discount (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block">Min Order (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={newCouponMin}
                      onChange={(e) => setNewCouponMin(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Create Coupon
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.code} className="bg-white p-4 rounded-xl border border-stone-200 space-y-2 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-sm text-stone-900">{c.code}</span>
                      <button
                        onClick={() => handleToggleCoupon(c.code)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                          c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                    <p className="text-xs text-stone-600">{c.description}</p>
                    <span className="text-[11px] text-stone-400 block font-mono">
                      Min Order: Rs. {c.minOrderValue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                  Store Delivery &amp; Pincode Settings
                </h1>
                <p className="text-xs text-stone-500">
                  Control free delivery thresholds and service zones
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4 shadow-sm">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Free Delivery Threshold (Rs.)
                  </label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Standard Delivery Fee (Rs.)
                    </label>
                    <input
                      type="number"
                      value={settings.standardDeliveryFee}
                      onChange={(e) =>
                        onUpdateSettings({ ...settings, standardDeliveryFee: Number(e.target.value) })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Express 90-min Fee (Rs.)
                    </label>
                    <input
                      type="number"
                      value={settings.expressDeliveryFee}
                      onChange={(e) =>
                        onUpdateSettings({ ...settings, expressDeliveryFee: Number(e.target.value) })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Serviceable Pincodes (comma-separated)
                  </label>
                  <textarea
                    rows={3}
                    value={settings.serviceablePincodes.join(', ')}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        serviceablePincodes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 font-mono"
                  />
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                  ✓ Settings saved in live application state.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Cut Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-stone-900">Add New Meat / Fish Product Cut</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mutton Nalli Shank Cuts"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  >
                    <option value="chicken">Chicken</option>
                    <option value="mutton">Mutton</option>
                    <option value="fish">Fish &amp; Seafood</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Base Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Short Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Rich marrow shanks ideal for slow cooking"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Publish Cut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

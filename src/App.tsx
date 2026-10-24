import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ImageSlider } from './components/ImageSlider';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { QualityPromise } from './components/QualityPromise';
import { RecipesSection } from './components/RecipesSection';
import { CustomerReviews } from './components/CustomerReviews';
import { PincodeModal } from './components/PincodeModal';
import { Footer } from './components/Footer';
import { WpAdminDashboard } from './components/WpAdminDashboard';
import { AuthModal } from './components/AuthModal';
import { ReportIssueModal } from './components/ReportIssueModal';
import { MyAccountView } from './components/MyAccountView';

import { INITIAL_PRODUCTS } from './data/initial-products';
import { CartItem, Coupon, CutOption, Order, Product, WeightOption, StoreSettings } from './types/store';
import { User, OrderIssue } from './types/auth';
import { calculateItemUnitPrice, DEFAULT_STORE_SETTINGS, AVAILABLE_COUPONS } from './utils/cart-rules';
import { SUPER_ADMIN_CREDENTIALS, DEMO_CUSTOMER_CREDENTIALS } from './utils/auth-rules';
import { Search, SlidersHorizontal, Sparkles, UserCheck, ShieldCheck, ArrowLeft, LogIn } from 'lucide-react';

export default function App() {
  // Storefront, Account & Admin State
  const [activeView, setActiveView] = useState<'store' | 'admin' | 'account'>('store');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPincode, setCurrentPincode] = useState<string>('560034');
  
  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isExpress, setIsExpress] = useState<boolean>(true);
  const [selectedSlot, setSelectedSlot] = useState<string>('morning');

  // Modals State
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeOrderTracking, setActiveOrderTracking] = useState<Order | null>(null);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState<boolean>(false);

  // Auth & Customer Management State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customUsers, setCustomUsers] = useState<{ user: User; pass: string }[]>(() => {
    try {
      const saved = localStorage.getItem('fz_custom_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);
  const [selectedIssueOrderId, setSelectedIssueOrderId] = useState<string | undefined>(undefined);

  // Pre-seeded Customer Accounts
  const [customers, setCustomers] = useState<User[]>([
    {
      id: 'usr-demo-cust',
      name: DEMO_CUSTOMER_CREDENTIALS.name,
      email: DEMO_CUSTOMER_CREDENTIALS.email,
      phone: DEMO_CUSTOMER_CREDENTIALS.phone,
      role: 'customer',
      savedAddresses: ['Flat 402, Royal Residency, 12th Main Road, Sector 4, Bengaluru'],
      defaultPincode: '560034',
      createdAt: '2026-02-15',
    },
    {
      id: 'usr-aarav',
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      phone: '9845098765',
      role: 'customer',
      savedAddresses: ['304 Ferns Paradise, Outer Ring Road, Bengaluru'],
      defaultPincode: '560034',
      createdAt: '2026-03-01',
    },
    {
      id: 'usr-fatima',
      name: 'Fatima Sheikh',
      email: 'fatima@example.com',
      phone: '9820011223',
      role: 'customer',
      savedAddresses: ['B-12 Hilltop Enclave, Bandra West, Mumbai'],
      defaultPincode: '400050',
      createdAt: '2026-03-10',
    },
  ]);

  // Order Issues Tickets State (seeded with initial real quality ticket)
  const [issues, setIssues] = useState<OrderIssue[]>([
    {
      id: 'TKT-10821',
      orderId: 'FZ-781920',
      customerId: 'usr-fatima',
      customerName: 'Fatima Sheikh',
      customerPhone: '9820011223',
      customerEmail: 'fatima@example.com',
      issueType: 'wrong_cut',
      subject: 'Requested Biryani Cut pieces, but cuts were slightly small',
      description: 'The goat mutton was tender and fresh, but some pieces were cut into smaller curry sizes instead of large biryani cuts.',
      status: 'under_review',
      resolutionNotes: 'Head butcher verified batch cut log. A Rs. 100 meat credit has been approved for your next mutton order.',
      createdAt: '2026-03-28 09:15 AM',
      updatedAt: '2026-03-28 10:30 AM',
    },
  ]);

  // WooCommerce Seed Orders & Coupons
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'FZ-918234',
      createdAt: '08:30 AM Today',
      customerName: 'Aarav Sharma',
      customerPhone: '9845098765',
      customerEmail: 'aarav@example.com',
      deliveryAddress: '304 Ferns Paradise, Outer Ring Road',
      pincode: '560034',
      city: 'Bengaluru',
      items: [
        {
          id: 'item-seed-1',
          productId: 'chk-curry-cut',
          name: 'Fresh Chicken Curry Cut',
          category: 'chicken',
          selectedCut: INITIAL_PRODUCTS[0].cutOptions[0],
          selectedWeight: INITIAL_PRODUCTS[0].weightOptions[0],
          unitPrice: 179,
          quantity: 2,
        },
      ],
      subtotal: 358,
      discount: 0,
      deliveryFee: 59,
      packagingFee: 15,
      total: 432,
      deliveryType: 'express',
      deliverySlot: 'Express 90 Mins',
      paymentMethod: 'upi',
      status: 'out_for_delivery',
      butcheryNotes: 'Trim fat, deliver in cold ice bag',
    },
    {
      id: 'FZ-781920',
      createdAt: '07:15 AM Today',
      customerName: 'Fatima Sheikh',
      customerPhone: '9820011223',
      customerEmail: 'fatima@example.com',
      deliveryAddress: 'B-12 Hilltop Enclave, Bandra West',
      pincode: '400050',
      city: 'Mumbai',
      items: [
        {
          id: 'item-seed-2',
          productId: 'mut-biryani-cut',
          name: 'Royal Goat Biryani Cut',
          category: 'mutton',
          selectedCut: INITIAL_PRODUCTS[4].cutOptions[0],
          selectedWeight: INITIAL_PRODUCTS[4].weightOptions[1], // 1kg
          unitPrice: 996,
          quantity: 1,
        },
      ],
      subtotal: 996,
      discount: 100,
      couponCode: 'FRESH100',
      deliveryFee: 0,
      packagingFee: 15,
      total: 911,
      deliveryType: 'scheduled',
      deliverySlot: 'Morning Slot (07:00 AM - 09:00 AM)',
      paymentMethod: 'cod',
      status: 'delivered',
    },
  ]);

  const [coupons, setCoupons] = useState<Coupon[]>(AVAILABLE_COUPONS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  // User & Auth operations
  const handleRegisterUser = (newUser: User, pass: string) => {
    const updatedUsers = [...customUsers, { user: newUser, pass }];
    setCustomUsers(updatedUsers);
    try {
      localStorage.setItem('fz_custom_users', JSON.stringify(updatedUsers));
    } catch (e) {
      console.error(e);
    }
    setCustomers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (activeView === 'account' || activeView === 'admin') {
      setActiveView('store');
    }
  };

  const handleOpenAccount = () => {
    setActiveView('account');
  };

  const handleOpenReportIssue = (orderId?: string) => {
    setSelectedIssueOrderId(orderId);
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setIsReportIssueModalOpen(true);
  };

  const handleTicketCreated = (newTicket: OrderIssue) => {
    setIssues((prev) => [newTicket, ...prev]);
  };

  const handleUpdateUserAddress = (address: string, pincode: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      savedAddresses: [address],
      defaultPincode: pincode,
    };
    setCurrentUser(updated);
    setCustomers((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    cut: CutOption,
    weight: WeightOption,
    customButcheryNote?: string
  ) => {
    const compositeId = `${product.id}_${cut.id}_${weight.weightInGrams}`;
    const unitPrice = calculateItemUnitPrice(product.basePrice, cut, weight);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === compositeId);
      if (existing) {
        return prev.map((item) =>
          item.id === compositeId
            ? { ...item, quantity: item.quantity + 1, customButcheryNote: customButcheryNote || item.customButcheryNote }
            : item
        );
      }
      return [
        ...prev,
        {
          id: compositeId,
          productId: product.id,
          name: product.name,
          category: product.category,
          selectedCut: cut,
          selectedWeight: weight,
          unitPrice,
          quantity: 1,
          customButcheryNote,
        },
      ];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((it) => (it.id === cartItemId ? { ...it, quantity: newQty } : it))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCartItems([]);
    setAppliedCoupon(null);
    setActiveOrderTracking(newOrder);

    // If customer was logged in or placing an order, ensure their address and record is refreshed
    if (currentUser) {
      setCustomers((prev) => {
        const found = prev.find((c) => c.email.toLowerCase() === newOrder.customerEmail.toLowerCase());
        if (found) return prev;
        return [
          {
            id: `usr-${Date.now()}`,
            name: newOrder.customerName,
            email: newOrder.customerEmail,
            phone: newOrder.customerPhone,
            role: 'customer',
            savedAddresses: [newOrder.deliveryAddress],
            defaultPincode: newOrder.pincode,
            createdAt: new Date().toISOString().split('T')[0],
          },
          ...prev,
        ];
      });
    }
  };

  const handleSelectProductForRecipe = (productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (found) {
      setActiveDetailProduct(found);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.cutSubtitle && p.cutSubtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // If in WordPress Admin Mode, render the dedicated WP Admin Dashboard
  if (activeView === 'admin') {
    return (
      <WpAdminDashboard
        currentUser={currentUser}
        onAdminLogin={setCurrentUser}
        products={products}
        onUpdateProducts={setProducts}
        orders={orders}
        onUpdateOrders={setOrders}
        coupons={coupons}
        onUpdateCoupons={setCoupons}
        settings={storeSettings}
        onUpdateSettings={setStoreSettings}
        customers={customers}
        issues={issues}
        onUpdateIssues={setIssues}
        onReturnToStore={() => setActiveView('store')}
        customUsers={customUsers}
      />
    );
  }

  // If in My Account Mode and user is logged in, render the Customer Portal
  if (activeView === 'account' && currentUser) {
    return (
      <>
        <MyAccountView
          user={currentUser}
          orders={orders}
          issues={issues}
          onReturnToStore={() => setActiveView('store')}
          onLogout={handleLogout}
          onTrackOrder={(order) => setActiveOrderTracking(order)}
          onOpenReportIssue={handleOpenReportIssue}
          onUpdateUserAddress={handleUpdateUserAddress}
        />
        <OrderTrackingModal
          order={activeOrderTracking}
          onClose={() => setActiveOrderTracking(null)}
        />
        <ReportIssueModal
          isOpen={isReportIssueModalOpen}
          onClose={() => setIsReportIssueModalOpen(false)}
          user={currentUser}
          orders={orders.filter(
            (o) =>
              o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
              o.customerPhone === currentUser.phone
          )}
          preselectedOrderId={selectedIssueOrderId}
          onTicketCreated={handleTicketCreated}
        />
      </>
    );
  }

  // If in My Account Mode and NOT logged in, show customer access splash
  if (activeView === 'account' && !currentUser) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
        <header className="bg-stone-900 text-white px-4 sm:px-6 py-3.5 border-b border-stone-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setActiveView('store')}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back to FoodZunction Store</span>
            </button>
            <span className="text-xs text-stone-400">Customer Account Portal</span>
          </div>
        </header>

        <div className="max-w-xl mx-auto w-full px-4 py-16 flex-1 flex flex-col items-center justify-center">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xl text-center space-y-5 w-full">
            <div className="w-16 h-16 rounded-2xl bg-red-700 text-white flex items-center justify-center mx-auto shadow-md">
              <UserCheck className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-stone-900">Sign In to Your Account</h1>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Track your chilled deliveries, view past butcher cuts &amp; invoices, or file cold-chain quality issues.
              </p>
            </div>

            {/* Test Credentials banner */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                Test Accounts Available:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentUser({
                      id: 'usr-demo-cust',
                      name: DEMO_CUSTOMER_CREDENTIALS.name,
                      email: DEMO_CUSTOMER_CREDENTIALS.email,
                      phone: DEMO_CUSTOMER_CREDENTIALS.phone,
                      role: 'customer',
                      savedAddresses: ['Flat 402, Royal Residency, 12th Main Road, Sector 4, Bengaluru'],
                      defaultPincode: '560034',
                      createdAt: '2026-02-15',
                    });
                  }}
                  className="p-2.5 bg-white border border-amber-300 hover:border-amber-400 rounded-xl text-left cursor-pointer transition-all shadow-xs"
                >
                  <strong className="text-stone-900 block text-xs">Demo Customer</strong>
                  <span className="text-[10px] text-stone-500 font-mono block">customer@foodzunction.com</span>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">1-Click Sign In →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentUser({
                      id: 'usr-super-admin',
                      name: SUPER_ADMIN_CREDENTIALS.name,
                      email: SUPER_ADMIN_CREDENTIALS.email,
                      phone: SUPER_ADMIN_CREDENTIALS.phone,
                      role: 'admin',
                      defaultPincode: '560034',
                      createdAt: '2026-01-01',
                    });
                  }}
                  className="p-2.5 bg-stone-900 text-white rounded-xl text-left cursor-pointer transition-all shadow-xs hover:bg-stone-800"
                >
                  <strong className="text-white block text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Super Admin
                  </strong>
                  <span className="text-[10px] text-stone-400 font-mono block">admin@foodzunction.com</span>
                  <span className="text-[10px] text-amber-300 font-semibold mt-1 inline-block">1-Click Sign In →</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Enter Password</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleLoginSuccess}
          initialMode={authModalMode}
          customUsers={customUsers}
          onRegisterUser={handleRegisterUser}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        currentPincode={currentPincode}
        onOpenPincodeModal={() => setIsPincodeModalOpen(true)}
        activeView={activeView}
        onToggleView={setActiveView}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
        onOpenAccount={handleOpenAccount}
        onLogout={handleLogout}
      />

      {/* Hero Section with Pincode Checker and Meat Highlights */}
      <HeroSection
        currentPincode={currentPincode}
        onSetPincode={setCurrentPincode}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        serviceablePincodes={storeSettings.serviceablePincodes}
      />

      {/* Featured Promotional Banners Slider */}
      <ImageSlider onSelectCategory={setSelectedCategory} />

      {/* Main Storefront Product Catalog Section */}
      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Section Header with Live Search Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700">
              <Sparkles className="w-4 h-4" />
              <span>Chilled Butcher Counter · {currentPincode}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {selectedCategory === 'all' && 'All Fresh Meat & Fish Cuts'}
              {selectedCategory === 'chicken' && 'Farm-Raised Tender Chicken'}
              {selectedCategory === 'mutton' && 'Pasture-Raised Tender Goat Mutton'}
              {selectedCategory === 'fish' && 'Fresh Daily Catch Coastal Fish'}
              {selectedCategory === 'combos' && 'Curated Family Feast Combos'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Cut only after your order is confirmed. Washed in ozonated water and vacuum packed at 2°C.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chicken, mutton, surmai..."
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-600 shadow-sm"
              aria-label="Search meat cuts"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-bold text-stone-800">No cuts matched "{searchQuery}"</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try searching for "curry cut", "biryani", "mutton", "pomfret", or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((prod) => {
              // Check if any variant is currently in the cart
              const inCart = cartItems.find((it) => it.productId === prod.id);
              return (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  cartItem={inCart}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onOpenDetails={setActiveDetailProduct}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Quality Promise Trust Section */}
      <QualityPromise />

      {/* Master Butcher Recipes Section */}
      <RecipesSection
        products={products}
        onSelectProductForRecipe={handleSelectProductForRecipe}
      />

      {/* Customer Reviews Section */}
      <CustomerReviews />

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setActiveView('admin')}
        onSelectCategory={setSelectedCategory}
      />

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={activeDetailProduct}
        onClose={() => setActiveDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        isExpress={isExpress}
        onToggleExpress={setIsExpress}
        selectedSlot={selectedSlot}
        onSelectSlot={setSelectedSlot}
        settings={storeSettings}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedCoupon={appliedCoupon}
        isExpress={isExpress}
        selectedSlot={selectedSlot}
        settings={storeSettings}
        currentPincode={currentPincode}
        currentUser={currentUser}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderTrackingModal
        order={activeOrderTracking}
        onClose={() => setActiveOrderTracking(null)}
      />

      <PincodeModal
        isOpen={isPincodeModalOpen}
        onClose={() => setIsPincodeModalOpen(false)}
        currentPincode={currentPincode}
        onSelectPincode={setCurrentPincode}
        serviceablePincodes={storeSettings.serviceablePincodes}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
        initialMode={authModalMode}
        customUsers={customUsers}
        onRegisterUser={handleRegisterUser}
      />

      {currentUser && (
        <ReportIssueModal
          isOpen={isReportIssueModalOpen}
          onClose={() => setIsReportIssueModalOpen(false)}
          user={currentUser}
          orders={orders.filter(
            (o) =>
              o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
              o.customerPhone === currentUser.phone
          )}
          preselectedOrderId={selectedIssueOrderId}
          onTicketCreated={handleTicketCreated}
        />
      )}
    </div>
  );
}

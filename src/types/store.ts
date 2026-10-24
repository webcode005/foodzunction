export type ProductCategory = 'all' | 'chicken' | 'mutton' | 'fish' | 'combos' | 'marinated';

export interface CutOption {
  id: string;
  name: string;
  description: string;
  boneType: 'with-bone' | 'boneless' | 'skin-on' | 'skinless' | 'steaks' | 'whole';
  priceDelta?: number; // additional price if any
}

export interface WeightOption {
  weightInGrams: number;
  label: string;
  multiplier: number; // e.g. 1 for 500g, 1.95 for 1kg (slight volume perk)
  netWeightLabel: string;
  serves: string;
}

export interface Product {
  id: string;
  name: string;
  cutSubtitle?: string;
  category: 'chicken' | 'mutton' | 'fish' | 'combos' | 'marinated';
  tagline: string;
  description: string;
  basePrice: number; // price for default weight
  originalPrice: number;
  defaultWeight: number; // in grams (e.g. 500)
  defaultWeightLabel: string;
  netWeight: string; // "480g - 500g after precision cut"
  grossWeight: string; // "550g - 600g"
  pieces: string; // "14 - 18 pcs"
  serves: string; // "2 - 3 people"
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isHalalCertified: boolean;
  antibioticFree: boolean;
  storageTemp: string; // "0°C - 4°C"
  badgeText?: string;
  cutOptions: CutOption[];
  weightOptions: WeightOption[];
  primaryTone: string; // for rich card art fallback
  accentTone: string;
  cookingTips: string[];
}

export interface CartItem {
  id: string; // composite: product_id + cut_id + weight
  productId: string;
  name: string;
  category: ProductCategory;
  selectedCut: CutOption;
  selectedWeight: WeightOption;
  unitPrice: number;
  quantity: number;
  customButcheryNote?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number; // e.g. 100 for flat 100 or 15 for 15%
  minOrderValue: number;
  description: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  pincode: string;
  city: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  packagingFee: number;
  total: number;
  deliveryType: 'express' | 'scheduled';
  deliverySlot: string;
  paymentMethod: 'cod' | 'upi' | 'card';
  status: 'pending' | 'processing' | 'cut_sanitized' | 'out_for_delivery' | 'delivered';
  butcheryNotes?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  packagingFee: number;
  serviceablePincodes: string[];
}

import { CartItem, Coupon, CutOption, StoreSettings, WeightOption } from '../types/store';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'FoodZunction',
  tagline: 'Fresh Mutton, Fish & Raw Chicken Butcher',
  supportPhone: '+91 98450 12345',
  supportEmail: 'orders@foodzunction.com',
  freeDeliveryThreshold: 499,
  standardDeliveryFee: 39,
  expressDeliveryFee: 59,
  packagingFee: 15,
  serviceablePincodes: [
    '560001', '560002', '560003', '560004', '560008',
    '560025', '560034', '560038', '560047', '560068',
    '560076', '560095', '560102', '560103', '110001',
    '110016', '110020', '400001', '400050', '500001'
  ],
};

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'FRESH100',
    discountType: 'flat',
    value: 100,
    minOrderValue: 599,
    description: 'Flat ₹100 OFF on orders above ₹599',
    isActive: true,
  },
  {
    code: 'MEATLOVE',
    discountType: 'percentage',
    value: 15, // 15%
    minOrderValue: 499,
    description: '15% OFF up to ₹150 on your fresh cuts',
    isActive: true,
  },
  {
    code: 'FIRSTORDER',
    discountType: 'flat',
    value: 50,
    minOrderValue: 299,
    description: 'Flat ₹50 OFF for all new FoodZunction customers',
    isActive: true,
  },
];

/**
 * Calculates unit price based on base price, cut delta, and weight multiplier
 */
export function calculateItemUnitPrice(
  basePrice: number,
  cut: CutOption,
  weight: WeightOption
): number {
  const cutDelta = cut.priceDelta || 0;
  const singlePackPrice = basePrice + cutDelta;
  return Math.round(singlePackPrice * weight.multiplier);
}

/**
 * Calculates the subtotal of all items in the cart
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
}

/**
 * Calculates delivery fee based on subtotal, delivery speed, and store settings
 */
export function calculateDeliveryFee(
  subtotal: number,
  isExpress: boolean,
  settings: StoreSettings = DEFAULT_STORE_SETTINGS
): number {
  if (subtotal === 0) return 0;
  
  if (subtotal >= settings.freeDeliveryThreshold) {
    // If order qualifies for free delivery: standard is ₹0, express is discounted
    return isExpress ? Math.max(0, settings.expressDeliveryFee - settings.standardDeliveryFee) : 0;
  }

  return isExpress ? settings.expressDeliveryFee : settings.standardDeliveryFee;
}

/**
 * Validates and applies coupon discount
 */
export function applyCouponDiscount(
  subtotal: number,
  coupon: Coupon | null
): { discount: number; error?: string } {
  if (!coupon || !coupon.isActive) {
    return { discount: 0 };
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      discount: 0,
      error: `Coupon ${coupon.code} requires a minimum order of ₹${coupon.minOrderValue}`,
    };
  }

  if (coupon.discountType === 'flat') {
    const discount = Math.min(coupon.value, subtotal);
    return { discount };
  }

  if (coupon.discountType === 'percentage') {
    const rawDiscount = Math.round((subtotal * coupon.value) / 100);
    // Cap percentage discount at ₹150 to prevent abuse
    const cappedDiscount = Math.min(rawDiscount, 150);
    return { discount: cappedDiscount };
  }

  return { discount: 0 };
}

/**
 * Validates pincode against store's serviceable delivery locations
 */
export function isPincodeServiceable(
  pincode: string,
  serviceablePincodes: string[] = DEFAULT_STORE_SETTINGS.serviceablePincodes
): boolean {
  const clean = pincode.trim();
  if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
    return false;
  }
  return serviceablePincodes.includes(clean);
}

/**
 * Formats amount into Indian Rupee format (Rs.)
 */
export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

/**
 * Calculates total order bill with all line items
 */
export function calculateOrderSummary(
  items: CartItem[],
  coupon: Coupon | null,
  isExpress: boolean,
  settings: StoreSettings = DEFAULT_STORE_SETTINGS
) {
  const subtotal = calculateSubtotal(items);
  const couponResult = applyCouponDiscount(subtotal, coupon);
  const discount = couponResult.discount;
  const deliveryFee = calculateDeliveryFee(subtotal, isExpress, settings);
  const packagingFee = subtotal > 0 ? settings.packagingFee : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee + packagingFee);

  const amountNeededForFreeDelivery = Math.max(
    0,
    settings.freeDeliveryThreshold - subtotal
  );

  return {
    subtotal,
    discount,
    couponError: couponResult.error,
    deliveryFee,
    packagingFee,
    total,
    amountNeededForFreeDelivery,
    isFreeDeliveryEligible: subtotal >= settings.freeDeliveryThreshold,
  };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemUnitPrice,
  calculateSubtotal,
  calculateDeliveryFee,
  applyCouponDiscount,
  isPincodeServiceable,
  calculateOrderSummary,
  DEFAULT_STORE_SETTINGS,
} from './cart-rules';
import { CartItem, Coupon, CutOption, WeightOption } from '../types/store';

const mockCut: CutOption = {
  id: 'curry-medium',
  name: 'Curry Cut (Medium)',
  description: 'Even bone-in pieces ideal for rich gravies',
  boneType: 'with-bone',
  priceDelta: 0,
};

const mockPremiumCut: CutOption = {
  id: 'boneless-breast',
  name: 'Boneless Breast Fillets',
  description: 'Tender 100% lean boneless cuts',
  boneType: 'boneless',
  priceDelta: 40,
};

const mockWeight500g: WeightOption = {
  weightInGrams: 500,
  label: '500g',
  multiplier: 1,
  netWeightLabel: '480g - 500g',
  serves: '2-3',
};

const mockWeight1kg: WeightOption = {
  weightInGrams: 1000,
  label: '1kg',
  multiplier: 1.95,
  netWeightLabel: '980g - 1000g',
  serves: '4-6',
};

test('calculateItemUnitPrice handles standard and premium cuts with weight multipliers', () => {
  const basePrice = 180;
  // 500g standard cut
  const price500 = calculateItemUnitPrice(basePrice, mockCut, mockWeight500g);
  assert.equal(price500, 180);

  // 1kg standard cut with bulk incentive (1.95x)
  const price1kg = calculateItemUnitPrice(basePrice, mockCut, mockWeight1kg);
  assert.equal(price1kg, Math.round(180 * 1.95)); // 351

  // 500g premium boneless cut (+40 price delta)
  const priceBoneless = calculateItemUnitPrice(basePrice, mockPremiumCut, mockWeight500g);
  assert.equal(priceBoneless, 220);
});

test('calculateSubtotal sums up all items correctly', () => {
  const items: CartItem[] = [
    {
      id: 'chicken-1',
      productId: 'p1',
      name: 'Fresh Chicken Curry Cut',
      category: 'chicken',
      selectedCut: mockCut,
      selectedWeight: mockWeight500g,
      unitPrice: 180,
      quantity: 2,
    },
    {
      id: 'mutton-1',
      productId: 'p2',
      name: 'Goat Mutton Biryani Cut',
      category: 'mutton',
      selectedCut: mockCut,
      selectedWeight: mockWeight500g,
      unitPrice: 460,
      quantity: 1,
    },
  ];

  const subtotal = calculateSubtotal(items);
  // (180 * 2) + 460 = 820
  assert.equal(subtotal, 820);
});

test('calculateDeliveryFee applies free delivery over threshold and calculates express charge', () => {
  // Below threshold (subtotal 300 < 499)
  assert.equal(calculateDeliveryFee(300, false, DEFAULT_STORE_SETTINGS), 39);
  assert.equal(calculateDeliveryFee(300, true, DEFAULT_STORE_SETTINGS), 59);

  // Over threshold (subtotal 600 >= 499)
  assert.equal(calculateDeliveryFee(600, false, DEFAULT_STORE_SETTINGS), 0);
  // Express delivery gets discounted when above free threshold (59 - 39 = 20)
  assert.equal(calculateDeliveryFee(600, true, DEFAULT_STORE_SETTINGS), 20);

  // Empty cart
  assert.equal(calculateDeliveryFee(0, false, DEFAULT_STORE_SETTINGS), 0);
});

test('applyCouponDiscount applies flat and percentage discounts with threshold validation', () => {
  const flatCoupon: Coupon = {
    code: 'FRESH100',
    discountType: 'flat',
    value: 100,
    minOrderValue: 599,
    description: 'Flat ₹100 off on ₹599+',
    isActive: true,
  };

  // Subtotal too low
  const lowOrder = applyCouponDiscount(500, flatCoupon);
  assert.equal(lowOrder.discount, 0);
  assert.match(lowOrder.error || '', /minimum order/);

  // Subtotal eligible
  const eligibleOrder = applyCouponDiscount(700, flatCoupon);
  assert.equal(eligibleOrder.discount, 100);
  assert.equal(eligibleOrder.error, undefined);

  // Percentage coupon
  const percentCoupon: Coupon = {
    code: 'MEATLOVE',
    discountType: 'percentage',
    value: 15,
    minOrderValue: 499,
    description: '15% off',
    isActive: true,
  };

  const percentOrder = applyCouponDiscount(600, percentCoupon);
  // 15% of 600 = 90
  assert.equal(percentOrder.discount, 90);
});

test('isPincodeServiceable validates 6-digit Indian postal codes', () => {
  assert.equal(isPincodeServiceable('560034'), true);
  assert.equal(isPincodeServiceable('560001'), true);
  assert.equal(isPincodeServiceable('999999'), false);
  assert.equal(isPincodeServiceable('abc'), false);
  assert.equal(isPincodeServiceable('5600'), false);
});

test('calculateOrderSummary gives full breakdown of charges', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      productId: 'p1',
      name: 'Fresh Chicken',
      category: 'chicken',
      selectedCut: mockCut,
      selectedWeight: mockWeight500g,
      unitPrice: 300,
      quantity: 2, // 600
    },
  ];

  const flatCoupon: Coupon = {
    code: 'FRESH100',
    discountType: 'flat',
    value: 100,
    minOrderValue: 599,
    description: 'Flat ₹100 off',
    isActive: true,
  };

  const summary = calculateOrderSummary(items, flatCoupon, false, DEFAULT_STORE_SETTINGS);

  assert.equal(summary.subtotal, 600);
  assert.equal(summary.discount, 100);
  assert.equal(summary.deliveryFee, 0); // qualified for free delivery (> 499)
  assert.equal(summary.packagingFee, 15);
  // 600 - 100 + 0 + 15 = 515
  assert.equal(summary.total, 515);
  assert.equal(summary.isFreeDeliveryEligible, true);
});

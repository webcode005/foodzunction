import React, { useState } from 'react';
import { Plus, Minus, Info, Check, Shield } from 'lucide-react';
import { Product, CutOption, WeightOption, CartItem } from '../types/store';
import { calculateItemUnitPrice, formatCurrency } from '../utils/cart-rules';

interface ProductCardProps {
  product: Product;
  cartItem?: CartItem;
  onAddToCart: (product: Product, cut: CutOption, weight: WeightOption) => void;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartItem,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
}) => {
  const [selectedCut, setSelectedCut] = useState<CutOption>(product.cutOptions[0]);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(product.weightOptions[0]);

  const currentPrice = calculateItemUnitPrice(product.basePrice, selectedCut, selectedWeight);
  const originalPackPrice = Math.round(product.originalPrice * selectedWeight.multiplier);
  const discountPercent = Math.round(((originalPackPrice - currentPrice) / originalPackPrice) * 100);

  // Category visual iconography & badges
  const categoryEmoji = {
    chicken: '🍗',
    mutton: '🍖',
    fish: '🐟',
    combos: '🥘',
    marinated: '🌶️',
  }[product.category] || '🥩';

  return (
    <article className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-200 group">
      {/* Visual Product Header / Card Art */}
      <div className={`relative h-48 bg-gradient-to-br ${product.primaryTone} p-4 flex flex-col justify-between overflow-hidden text-white`}>
        {/* Decorative background grid and pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-200">
            <span className="text-sm">{categoryEmoji}</span>
            <span className="capitalize">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.pieces}</span>
          </div>

          {product.badgeText && (
            <span className="text-[11px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
              {product.badgeText}
            </span>
          )}
        </div>

        {/* Center Artwork / Motif */}
        <div className="relative z-10 my-auto text-center py-2">
          <span className="text-4xl drop-shadow-md select-none transform group-hover:scale-105 transition-transform inline-block">
            {categoryEmoji}
          </span>
          <div className="mt-1 text-[11px] font-medium tracking-wide text-stone-200 uppercase">
            {product.isHalalCertified ? '100% Halal Certified' : 'Fresh Cleaned'}
          </div>
        </div>

        {/* Bottom Card Bar: Net weight & Quick info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-stone-200 pt-1 border-t border-white/10">
          <span className="font-mono">{selectedWeight.netWeightLabel}</span>
          <button
            type="button"
            onClick={() => onOpenDetails(product)}
            className="flex items-center gap-1 text-white hover:text-amber-300 transition-colors text-xs font-medium cursor-pointer"
            aria-label={`View butchery specs for ${product.name}`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Cut Guide</span>
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Unboxed Metadata Line (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Serves {selectedWeight.serves}</span>
            <span aria-hidden="true">·</span>
            <span>{product.storageTemp}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Antibiotic-Free</span>
          </div>

          <h3 className="text-base font-bold text-stone-900 group-hover:text-red-700 transition-colors leading-snug">
            {product.name}
          </h3>
          {product.cutSubtitle && (
            <span className="text-xs text-stone-500 block font-normal">
              {product.cutSubtitle}
            </span>
          )}

          <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Cut Selector Dropdown (Interactive Control) */}
        {product.cutOptions.length > 1 && (
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
              Choose Cut Option:
            </label>
            <select
              value={selectedCut.id}
              onChange={(e) => {
                const found = product.cutOptions.find((c) => c.id === e.target.value);
                if (found) setSelectedCut(found);
              }}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-red-600 cursor-pointer"
            >
              {product.cutOptions.map((cut) => (
                <option key={cut.id} value={cut.id}>
                  {cut.name} {cut.priceDelta ? `(+Rs. ${cut.priceDelta})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Weight Options Segmented Selector */}
        {product.weightOptions.length > 1 && (
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
            {product.weightOptions.map((w) => (
              <button
                key={w.weightInGrams}
                type="button"
                onClick={() => setSelectedWeight(w)}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  selectedWeight.weightInGrams === w.weightInGrams
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        )}

        {/* Price & Add to Cart Module */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-stone-950 font-mono tabular-nums">
                {formatCurrency(currentPrice)}
              </span>
              {originalPackPrice > currentPrice && (
                <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  {formatCurrency(originalPackPrice)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] text-emerald-700 font-semibold block">
                {discountPercent}% OFF · Net {selectedWeight.netWeightLabel}
              </span>
            )}
          </div>

          {/* Working Add / Stepper Control */}
          {cartItem ? (
            <div className="flex items-center bg-red-700 text-white rounded-lg p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-red-800 rounded text-sm transition-colors cursor-pointer"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-mono font-bold text-xs tabular-nums">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-red-800 rounded text-sm transition-colors cursor-pointer"
                aria-label={`Increase quantity of ${product.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product, selectedCut, selectedWeight)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

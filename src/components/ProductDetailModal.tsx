import React, { useState } from 'react';
import { X, ShieldCheck, Check, Snowflake, Scale, Flame, ShoppingBag, Plus } from 'lucide-react';
import { Product, CutOption, WeightOption } from '../types/store';
import { calculateItemUnitPrice, formatCurrency } from '../utils/cart-rules';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, cut: CutOption, weight: WeightOption, customNote?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedCut, setSelectedCut] = useState<CutOption>(product.cutOptions[0]);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(product.weightOptions[0]);
  const [customNote, setCustomNote] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  const price = calculateItemUnitPrice(product.basePrice, selectedCut, selectedWeight);
  const originalPackPrice = Math.round(product.originalPrice * selectedWeight.multiplier);

  const handleAdd = () => {
    onAddToCart(product, selectedCut, selectedWeight, customNote.trim() || undefined);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className={`p-6 bg-gradient-to-r ${product.primaryTone} text-white flex items-center justify-between`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>{product.category} · Master Butcher Cut</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold mt-1">{product.name}</h2>
            {product.cutSubtitle && (
              <p className="text-xs text-stone-200">{product.cutSubtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Transparency Weight & Spec Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block text-[11px]">Net Clean Weight</span>
              <strong className="text-stone-900 font-mono text-sm">{selectedWeight.netWeightLabel}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">Gross Weight</span>
              <strong className="text-stone-900 font-mono text-sm">{product.grossWeight}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">Piece Count</span>
              <strong className="text-stone-900 text-sm">{product.pieces}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">Ideal Servings</span>
              <strong className="text-stone-900 text-sm">{selectedWeight.serves}</strong>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
              About This Cut
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Cut Option Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Choose Butchery Cut:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.cutOptions.map((cut) => (
                <button
                  key={cut.id}
                  type="button"
                  onClick={() => setSelectedCut(cut)}
                  className={`p-3 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    selectedCut.id === cut.id
                      ? 'border-red-600 bg-red-50 text-stone-950 ring-1 ring-red-600'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{cut.name}</span>
                    {cut.priceDelta ? (
                      <span className="text-red-700 font-mono">+Rs. {cut.priceDelta}</span>
                    ) : null}
                  </div>
                  <p className="text-stone-500 text-[11px] mt-1">{cut.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Weight Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Package Size:
            </label>
            <div className="flex items-center gap-2">
              {product.weightOptions.map((w) => (
                <button
                  key={w.weightInGrams}
                  type="button"
                  onClick={() => setSelectedWeight(w)}
                  className={`flex-1 p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    selectedWeight.weightInGrams === w.weightInGrams
                      ? 'border-red-600 bg-red-600 text-white shadow-sm'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div>{w.label}</div>
                  <span className={`text-[10px] font-normal ${selectedWeight.weightInGrams === w.weightInGrams ? 'text-red-100' : 'text-stone-500'}`}>
                    {w.netWeightLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Butchery Instruction Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Special Instructions for the Butcher (Optional):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Trim extra fat, leave bone marrow untouched, slice slightly thicker"
              className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-red-600 font-medium"
            />
          </div>

          {/* Cooking Tips */}
          {product.cookingTips && product.cookingTips.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 space-y-1.5 text-xs text-amber-950">
              <span className="font-bold flex items-center gap-1.5 text-amber-900">
                <Flame className="w-4 h-4 text-amber-700" />
                Master Chef Recommendations:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-stone-700">
                {product.cookingTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer / Add to Cart Bar */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-stone-500 block font-medium">Total Pack Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-stone-950 font-mono tabular-nums">
                {formatCurrency(price)}
              </span>
              {originalPackPrice > price && (
                <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  {formatCurrency(originalPackPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
          >
            {addedNotice ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Cut to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

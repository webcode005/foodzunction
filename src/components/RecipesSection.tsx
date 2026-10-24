import React, { useState } from 'react';
import { ChefHat, Clock, Flame, Utensils, ArrowRight, Check } from 'lucide-react';
import { BUTCHER_RECIPES, Recipe } from '../data/store-extras';
import { Product } from '../types/store';

interface RecipesSectionProps {
  products: Product[];
  onSelectProductForRecipe: (productId: string) => void;
}

export const RecipesSection: React.FC<RecipesSectionProps> = ({
  products,
  onSelectProductForRecipe,
}) => {
  const [activeRecipe, setActiveRecipe] = useState<Recipe>(BUTCHER_RECIPES[0]);

  return (
    <section id="recipes" className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded">
              <ChefHat className="w-4 h-4" />
              <span>Butcher Kitchen &amp; Cookery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
              Authentic Recipes Crafted for Our Cuts
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Fresh meat cooks differently than supermarket thawed meat. Follow our master butcher recipes for tender curries, juicy tikkas, and crispy fish fry.
            </p>
          </div>

          {/* Recipe Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto">
            {BUTCHER_RECIPES.map((rec) => (
              <button
                key={rec.id}
                type="button"
                onClick={() => setActiveRecipe(rec)}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeRecipe.id === rec.id
                    ? 'bg-white text-stone-950 shadow-sm'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {rec.title.split(' ')[0]} {rec.category === 'mutton' ? 'Mutton' : rec.category === 'chicken' ? 'Chicken' : 'Fish'}
              </button>
            ))}
          </div>
        </div>

        {/* Active Recipe Card Display */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Recipe Meta and Ingredients */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <span>{activeRecipe.prepTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeRecipe.servings}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-amber-800">{activeRecipe.difficulty}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                  {activeRecipe.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {activeRecipe.summary}
                </p>
              </div>

              {/* Recommended Meat CTA Banner */}
              <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] uppercase font-bold text-red-800 block">Recommended Cut</span>
                  <strong className="text-xs text-stone-900 block">{activeRecipe.recommendedMeatName}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectProductForRecipe(activeRecipe.recommendedMeatProductId)}
                  className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Order Cut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  Key Ingredients:
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {activeRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-700 font-bold">·</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Step-by-Step Instructions */}
            <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-stone-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 pb-2 border-b border-stone-100">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                Preparation &amp; Cooking Steps:
              </h4>

              <div className="space-y-4">
                {activeRecipe.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Cooking tip: Allow cooked meat to rest 5 mins before serving</span>
                <span className="text-emerald-700 font-semibold">Verified Butcher Recipe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

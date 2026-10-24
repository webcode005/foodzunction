export interface Recipe {
  id: string;
  title: string;
  category: 'mutton' | 'chicken' | 'fish';
  timeMinutes: number;
  prepTime: string;
  difficulty: 'Easy' | 'Intermediate' | 'Master Butcher';
  servings: string;
  recommendedMeatProductId: string;
  recommendedMeatName: string;
  summary: string;
  ingredients: string[];
  steps: string[];
}

export const BUTCHER_RECIPES: Recipe[] = [
  {
    id: 'recipe-mutton-rogan-josh',
    title: 'Kashmiri Mutton Rogan Josh',
    category: 'mutton',
    timeMinutes: 55,
    prepTime: '20 min prep · 50 min slow simmer',
    difficulty: 'Intermediate',
    servings: '4 servings',
    recommendedMeatProductId: 'mut-curry-cut',
    recommendedMeatName: 'Rich Goat Mutton Curry Cut (500g)',
    summary: 'Aromatic Kashmiri delicacy flavored with whole fennel, mawa/curd, and vibrant Kashmiri deggi mirch without tomatoes or onions.',
    ingredients: [
      '500g FoodZunction Goat Mutton Curry Cut',
      '4 tbsp Mustard Oil (or pure Desi Ghee)',
      '1 cup Whisked Fresh Curd',
      '2 tsp Kashmiri Chili Powder (Deggi Mirch)',
      '1 tsp Fennel Powder (Saunf)',
      '1 tsp Dry Ginger Powder (Sonth)',
      'Whole spices: 2 Black Cardamoms, 4 Green Cardamoms, 4 Cloves, 1 stick Cinnamon',
      '1/2 tsp Hing (Asafoetida) dissolved in 2 tbsp warm water',
      'Rock salt to taste',
    ],
    steps: [
      'Heat mustard oil in a heavy-bottomed handi until it smokes lightly, then let it cool slightly.',
      'Add whole spices and hing water. Add FoodZunction goat mutton pieces and sear on medium-high heat for 8 minutes until light golden.',
      'Lower flame. Whisk curd with Kashmiri chili, ginger powder, and fennel powder. Pour into the meat while stirring continuously to prevent curdling.',
      'Cover tightly and cook on low dum heat for 45 minutes (or 4 whistles in pressure cooker) until mutton is fork-tender and aromatic oil floats on top.',
    ],
  },
  {
    id: 'recipe-chicken-ghee-roast',
    title: 'Kundapur Chicken Ghee Roast',
    category: 'chicken',
    timeMinutes: 35,
    prepTime: '15 min prep · 25 min roast',
    difficulty: 'Easy',
    servings: '3-4 servings',
    recommendedMeatProductId: 'chk-curry-cut',
    recommendedMeatName: 'Fresh Chicken Curry Cut (500g)',
    summary: 'Iconic coastal Karnataka dish boasting fiery whole roasted spices and generous clarified butter (desi ghee).',
    ingredients: [
      '500g FoodZunction Chicken Curry Cut (bone-in)',
      '4 tbsp Pure Cow Ghee',
      '1 tbsp Tamarind pulp',
      '1 tbsp Jaggery powder',
      'Special Roast Masala: 6 Byadagi chilies, 1 tsp Coriander seeds, 1/2 tsp Cumin, 1/2 tsp Black pepper, 4 Cloves, 1/4 tsp Fenugreek seeds dry roasted and ground smooth',
      '2 tbsp Ginger-Garlic paste',
      'Fresh curry leaves',
    ],
    steps: [
      'Marinate FoodZunction chicken with curd, turmeric, lemon juice, and salt for 20 minutes.',
      'Melt 2 tbsp ghee in a wide iron pan, sear the marinated chicken until 70% cooked. Set aside.',
      'In the same pan, add remaining ghee, curry leaves, and the ground roasted spice paste with tamarind pulp. Fry until ghee separates.',
      'Toss chicken back into the masala, add jaggery, and roast on medium-high flame until thick fragrant masala clings to every piece.',
    ],
  },
  {
    id: 'recipe-surmai-rava-fry',
    title: 'Malvani Surmai (Kingfish) Rava Fry',
    category: 'fish',
    timeMinutes: 20,
    prepTime: '10 min prep · 8 min pan fry',
    difficulty: 'Easy',
    servings: '2-3 servings',
    recommendedMeatProductId: 'fish-surmai-steaks',
    recommendedMeatName: 'Fresh Surmai Steaks (500g)',
    summary: 'Crisp golden crust outside with moist, flaky fish inside. A coastal staple served with sliced red onion and lemon.',
    ingredients: [
      '500g FoodZunction Surmai Steaks',
      '2 tbsp Fresh Kokum or Tamarind extract',
      '2 tsp Malvani / Red chili powder',
      '1 tsp Turmeric powder',
      '1 tbsp Ginger-garlic-green chili paste',
      'Coating: 1/2 cup Fine Rava (Semolina) mixed with 2 tbsp Rice flour and pinch of salt',
      'Coconut or refined oil for shallow frying',
    ],
    steps: [
      'Wash FoodZunction Surmai steaks with cold water and pat completely dry with paper towel.',
      'Rub with kokum extract, ginger-garlic paste, red chili powder, turmeric, and sea salt. Rest for 10 minutes.',
      'Dredge each steak evenly in the rava-rice flour mixture, pressing lightly so it sticks.',
      'Shallow fry on medium flame for 3-4 minutes on each side until crust is crunchy golden brown.',
    ],
  },
];

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  meatBought: string;
  comment: string;
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Khurram Siddiqui',
    city: 'Bengaluru (Indiranagar)',
    rating: 5,
    date: 'Yesterday',
    meatBought: 'Goat Mutton Biryani Cut (1kg)',
    comment: 'The quality of mutton from FoodZunction is unmatched. Zero bad smell, clean cuts with the exact bone-to-meat ratio I requested, and bone marrow was completely intact. The biryani was restaurant quality.',
  },
  {
    id: 'rev-2',
    author: 'Meera Nambiar',
    city: 'Bengaluru (Koramangala)',
    rating: 5,
    date: '3 days ago',
    meatBought: 'Surmai Steaks & Cleaned Prawns',
    comment: 'Ordered fish for Sunday lunch. Reached in 45 minutes ice-cold at 2°C with dry ice packs. The surmai was shining silver and prawns were deveined thoroughly. Saved me 30 minutes in kitchen prep!',
  },
  {
    id: 'rev-3',
    author: 'Dr. Ankit Verma',
    city: 'Bengaluru (HSR Layout)',
    rating: 5,
    date: '5 days ago',
    meatBought: 'Boneless Chicken Breast & Curry Cut',
    comment: 'I test chicken for antibiotic residues in my fitness routine. FoodZunction meat is genuinely antibiotic-free, tender without that rubbery texture you get from local markets. 10/10.',
  },
];

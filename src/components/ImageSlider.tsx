import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

interface Slide {
  id: string;
  image: string;
  fallbackGradient: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  categoryTarget: 'chicken' | 'mutton' | 'fish' | 'all';
}

interface ImageSliderProps {
  onSelectCategory: (category: string) => void;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ onSelectCategory }) => {
  const slides: Slide[] = [
    {
      id: 'slide-1',
      image: '/images/foodzunction/banner_oct.jpg',
      fallbackGradient: 'from-amber-900 via-stone-900 to-red-950',
      tag: 'Festive Meat Special',
      title: 'Farm Fresh Mutton & Chicken Cut to Order',
      subtitle: '100% Halal Certified, 0% Antibiotics. Cleaned and chilled to 2°C with 90-min express delivery.',
      ctaText: 'Shop Fresh Chicken',
      categoryTarget: 'chicken',
    },
    {
      id: 'slide-2',
      image: '/images/foodzunction/banner_fish.jpg',
      fallbackGradient: 'from-blue-950 via-slate-900 to-cyan-950',
      tag: 'Fresh Coastal Catch',
      title: 'Daily Sea Surmai Steaks & Pomfret',
      subtitle: 'Descaled, gutted, and cut into uniform curry & fry steaks on crushed ice.',
      ctaText: 'Explore Fresh Fish',
      categoryTarget: 'fish',
    },
    {
      id: 'slide-3',
      image: '/images/foodzunction/banner_main.jpg',
      fallbackGradient: 'from-red-950 via-stone-900 to-amber-950',
      tag: 'Royal Goat Mutton',
      title: 'Pasture-Raised Tender Goat Curry & Biryani Cuts',
      subtitle: 'Young goat meat with bone marrow shanks, washed in ozonated water and vacuum packed.',
      ctaText: 'Shop Pasture Mutton',
      categoryTarget: 'mutton',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleCtaClick = (category: string) => {
    onSelectCategory(category);
    const catalogElem = document.getElementById('catalog-section');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="FoodZunction Featured Banners"
    >
      <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-950">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              {/* Background Image with Fallback gradient */}
              <div className="absolute inset-0 bg-stone-900">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    // Fallback to stylized dark backdrop if image blocked
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {/* Contrast gradient overlay scrim ensuring text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/65 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />
              </div>

              {/* Text Content Overlay */}
              <div className="relative z-20 h-full flex flex-col justify-center px-12 sm:px-16 md:px-20 max-w-2xl space-y-2.5 sm:space-y-4">
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 backdrop-blur-sm px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-400/30 w-fit">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{slide.tag}</span>
                </div>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
                  {slide.title}
                </h2>

                <p className="text-stone-300 text-[11px] sm:text-sm line-clamp-2 leading-relaxed max-w-lg">
                  {slide.subtitle}
                </p>

                <div className="pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => handleCtaClick(slide.categoryTarget)}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-red-700 hover:bg-red-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-transform active:scale-98 cursor-pointer"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all cursor-pointer hover:scale-105"
          aria-label="Previous banner slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all cursor-pointer hover:scale-105"
          aria-label="Next banner slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-stone-950/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === i ? 'w-6 bg-red-600' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

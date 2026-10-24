import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const HeroBanner: React.FC = () => {
  const { navigate, setShopFilters } = useShop();

  const handleShop = (gender?: string) => {
    if (gender) {
      setShopFilters((prev) => ({ ...prev, gender, category: 'all' }));
    }
    navigate('shop');
  };

  return (
    <section className="relative w-full overflow-hidden border-b border-[#E8E2D6] bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#3D4E41]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autumn / Winter Atelier 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold text-[#181818] tracking-tight leading-[1.08] [text-wrap:balance]">
              Style That Feels Like You.
            </h1>

            <p className="text-base sm:text-lg text-[#555047] font-normal leading-relaxed max-w-xl">
              Discover timeless essentials and contemporary styles, thoughtfully curated for every occasion. Crafted with pure French flax, organic Supima cotton, and handloom silks across India.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleShop('men')}
                className="px-6 py-3.5 bg-[#181818] text-[#FAF8F5] text-sm font-medium rounded hover:bg-[#2F2E2C] transition-colors whitespace-nowrap shadow-sm flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Men</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleShop('women')}
                className="px-6 py-3.5 bg-white text-[#181818] border border-[#D5CBB9] text-sm font-medium rounded hover:bg-[#F3EFE8] transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              >
                Shop Women
              </button>

              <button
                onClick={() => handleShop()}
                className="px-5 py-3.5 text-[#3D4E41] hover:text-[#181818] text-sm font-medium hover:underline whitespace-nowrap cursor-pointer"
              >
                Explore Collection &rarr;
              </button>
            </div>

            {/* Subtle Brand Trust Micro-Strip */}
            <div className="pt-6 border-t border-[#E8E2D6] grid grid-cols-3 gap-4 text-xs text-[#635E54]">
              <div>
                <p className="font-semibold text-[#181818]">100% Natural</p>
                <p className="text-[11px] text-[#7A746B] mt-0.5">Normandy flax & silks</p>
              </div>
              <div>
                <p className="font-semibold text-[#181818]">Tailored Cut</p>
                <p className="text-[11px] text-[#7A746B] mt-0.5">Engineered Indian fits</p>
              </div>
              <div>
                <p className="font-semibold text-[#181818]">Complimentary</p>
                <p className="text-[11px] text-[#7A746B] mt-0.5">Pan-India delivery ₹1,499+</p>
              </div>
            </div>
          </div>

          {/* Right Editorial Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden bg-[#E2DACB] shadow-lg border border-[#DDD4C5]">
              <img
                src="/src/assets/images/hero_fashion_editorial_1792179895668.jpg"
                alt="StitchwellLane contemporary fashion collection for men and women"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#FAF8F5]/90 backdrop-blur-md p-3.5 rounded border border-white/40 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-[#181818]">The Minimalist Autumn Wardrobe</span>
                  <span className="block text-[11px] text-[#6E685C]">Tailored double-breasted linen & fluid drapery</span>
                </div>
                <span className="font-semibold text-[#3D4E41] tabular-nums">From ₹3,499</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pillar Strip */}
      <div className="bg-[#F3EFE8] border-t border-[#E8E2D6] py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs text-[#524E47]">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#3D4E41]" />
            <span>Fast Shipping with Delhivery & Blue Dart</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#3D4E41]" />
            <span>7-Day Easy Doorstep Exchanges</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3D4E41]" />
            <span>Safe INR Payments via Razorpay UPI & Cards</span>
          </div>
        </div>
      </div>
    </section>
  );
};

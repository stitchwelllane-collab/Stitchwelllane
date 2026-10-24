import React from 'react';
import { Sparkles, Heart, ShieldCheck, Compass, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutUs: React.FC = () => {
  const { navigate } = useShop();

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Hero Banner */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
          Our Atelier Story
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold text-[#181818] leading-tight">
          Where Craftsmanship Meets Contemporary Poise.
        </h1>
        <p className="text-base sm:text-lg text-[#555047] font-normal leading-relaxed max-w-2xl mx-auto">
          StitchwellLane was founded on a simple conviction: clothing should feel like an extension of who you are — enduring, unforced, and meticulously tailored.
        </p>
      </section>

      {/* Main Editorial Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-[#E0D8CB] bg-[#EFE9DF]">
            <img
              src="/src/assets/images/editorial_craftsmanship_fabric_1792179896569.jpg"
              alt="Artisan sewing and handloom textiles at StitchwellLane"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6 text-sm text-[#524E47] leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#181818]">
              The Antidote to Fast Fashion
            </h2>
            <p>
              In an era dominated by fleeting digital micro-trends and petroleum-based synthetic fabrics, StitchwellLane champions slow fashion. We design modular wardrobes for men and women who appreciate clean lines, balanced proportions, and authentic handfeel.
            </p>
            <p>
              Our tailoring atelier partners with master weavers in Tamil Nadu, raw silk artisans in Bhagalpur, and heritage spinning mills across India. Every fabric batch is tested for tensile strength, breathability in humid tropical weather, and color retention before reaching our cutting tables.
            </p>
            <div className="p-4 bg-[#F3EFE8] rounded-lg border border-[#E0D8CB] text-xs space-y-1">
              <strong className="text-[#181818] block font-semibold">The Stitchwell Promise:</strong>
              <p>Zero polyester shortcuts. Single and double-needle lockstitching. Natural horn and shell buttons. Generous hem allowances so garments can be altered to your exact personal frame.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of StitchwellLane */}
      <section className="bg-[#F3EFE8] py-16 sm:py-20 border-y border-[#E8E2D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
              Core Principles
            </span>
            <h2 className="text-3xl font-editorial font-bold text-[#181818] mt-1">
              Values That Define Our Garments
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] space-y-3">
              <Sparkles className="w-6 h-6 text-[#3D4E41]" />
              <h3 className="font-editorial text-lg font-bold text-[#181818]">Natural Fiber Purity</h3>
              <p className="text-xs text-[#666056] leading-relaxed">
                We work strictly with breathable French flax linen, 260 GSM Supima cotton, modal, and pure Indian mulberry silks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] space-y-3">
              <Compass className="w-6 h-6 text-[#3D4E41]" />
              <h3 className="font-editorial text-lg font-bold text-[#181818]">Engineered Fit</h3>
              <p className="text-xs text-[#666056] leading-relaxed">
                Patterns sculpted through countless fittings on diverse Indian builds, balancing modern ease with sharp drape.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#3D4E41]" />
              <h3 className="font-editorial text-lg font-bold text-[#181818]">Fair Artisanal Wages</h3>
              <p className="text-xs text-[#666056] leading-relaxed">
                We work directly with certified textile clusters, ensuring equitable pricing and safe workshop conditions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] space-y-3">
              <Heart className="w-6 h-6 text-[#3D4E41]" />
              <h3 className="font-editorial text-lg font-bold text-[#181818]">Lifelong Care</h3>
              <p className="text-xs text-[#666056] leading-relaxed">
                Hassle-free 7-day doorstep size swaps, repair guidance, and dedicated support for every patron.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center px-4 max-w-xl mx-auto space-y-4">
        <h2 className="text-3xl font-editorial font-bold text-[#181818]">
          Find Your Fit. Define Your Style.
        </h2>
        <p className="text-xs sm:text-sm text-[#5C574F]">
          Explore our collection of contemporary essentials, designed for quiet confidence.
        </p>
        <button
          onClick={() => navigate('shop')}
          className="px-8 py-3.5 bg-[#181818] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2C2C2C] transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <span>Explore The Wardrobe</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};

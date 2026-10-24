import React from 'react';
import { BrandLogo } from './BrandLogo';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, setShopFilters } = useShop();

  const handleCategoryClick = (category: string, gender?: string) => {
    setShopFilters((prev) => ({
      ...prev,
      category,
      gender: gender || 'all',
      occasion: 'all',
      isBestSeller: false,
      isNewArrival: false,
    }));
    navigate('shop');
  };

  const handlePolicyClick = (tab: string) => {
    navigate('policies', { tab });
  };

  return (
    <footer className="bg-[#181818] text-[#FAF8F5] pt-16 pb-12 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2C2C2C]">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo light size="lg" />
            <p className="text-xs text-[#A8A196] leading-relaxed max-w-sm mt-3">
              StitchwellLane is an Indian contemporary fashion atelier. We craft enduring apparel with handloom linen, long-staple Supima cotton, and pure silk — designed for timeless elegance and effortless modern living.
            </p>
            <div className="pt-2 text-xs text-[#C5BBAA] space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#889B8C] shrink-0" />
                <span>Atelier: Bandra West, Mumbai & Indiranagar, Bengaluru</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#889B8C] shrink-0" />
                <span>care@stitchwelllane.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#889B8C] shrink-0" />
                <span>+91 (022) 4892-9100 (Mon–Sat, 10 AM – 7 PM IST)</span>
              </p>
            </div>
          </div>

          {/* Col 2: Shopping Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8A196]">
              <li>
                <button
                  onClick={() => handleCategoryClick('shirts', 'men')}
                  className="hover:text-white transition-colors"
                >
                  Men's Linen Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('trousers', 'men')}
                  className="hover:text-white transition-colors"
                >
                  Pleated Trousers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('dresses', 'women')}
                  className="hover:text-white transition-colors"
                >
                  Women's Drape Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('ethnic')}
                  className="hover:text-white transition-colors"
                >
                  Festive Raw Silk Kurtas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('tshirts')}
                  className="hover:text-white transition-colors"
                >
                  Supima Cotton T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('jackets')}
                  className="hover:text-white transition-colors"
                >
                  Tailored Blazers & Coats
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service & Help */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8A196]">
              <li>
                <button
                  onClick={() => navigate('tracking')}
                  className="hover:text-white transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyClick('shipping')}
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyClick('returns')}
                  className="hover:text-white transition-colors"
                >
                  Returns & Exchanges (7-Day)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Support / WhatsApp
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('account')}
                  className="hover:text-white transition-colors"
                >
                  My Account & Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Legal & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8A196]">
              <li>
                <button
                  onClick={() => handlePolicyClick('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy (DPDP 2023)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyClick('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyClick('refund')}
                  className="hover:text-white transition-colors"
                >
                  Refund & Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePolicyClick('payment')}
                  className="hover:text-white transition-colors"
                >
                  Payment & Security Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Brand Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('admin')}
                  className="text-[#889B8C] hover:text-white font-medium transition-colors"
                >
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Indian E-Commerce Trust Badges */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#2C2C2C]">
          <div className="flex items-center gap-3 text-xs text-[#A8A196]">
            <ShieldCheck className="w-4 h-4 text-[#889B8C]" />
            <span>100% Secure INR Processing via Razorpay. All amounts in Indian Rupees (₹).</span>
          </div>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-[#262626] border border-[#3A3A3A] rounded text-[11px] font-mono text-[#D5CEBF]">
              UPI / GPay / PhonePe
            </span>
            <span className="px-2.5 py-1 bg-[#262626] border border-[#3A3A3A] rounded text-[11px] font-mono text-[#D5CEBF]">
              RuPay
            </span>
            <span className="px-2.5 py-1 bg-[#262626] border border-[#3A3A3A] rounded text-[11px] font-mono text-[#D5CEBF]">
              Visa
            </span>
            <span className="px-2.5 py-1 bg-[#262626] border border-[#3A3A3A] rounded text-[11px] font-mono text-[#D5CEBF]">
              Mastercard
            </span>
            <span className="px-2.5 py-1 bg-[#262626] border border-[#3A3A3A] rounded text-[11px] font-mono text-[#D5CEBF]">
              Net Banking (50+ Banks)
            </span>
            <span className="px-2.5 py-1 bg-[#262626] border border-[#3A3A3A] rounded text-[11px] font-mono text-[#D5CEBF]">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>

        {/* Bottom Copyright & Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A746B]">
          <p>© 2026 StitchwellLane Apparel Private Limited. All rights reserved.</p>
          <p className="font-editorial text-sm italic text-[#C5BBAA]">
            &ldquo;Find Your Fit. Define Your Style.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
};

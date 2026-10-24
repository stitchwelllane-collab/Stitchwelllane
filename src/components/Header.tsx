import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useShop } from '../context/ShopContext';

export const Header: React.FC = () => {
  const {
    navigate,
    currentRoute,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    setShopFilters,
    activeUser,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const handleNavClick = (route: any, filterUpdates?: Record<string, any>) => {
    if (filterUpdates) {
      setShopFilters((prev) => ({ ...prev, ...filterUpdates }));
    }
    navigate(route);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div onClick={() => handleNavClick('home')}>
          <BrandLogo />
        </div>

        {/* Zone 2: Navigation Links (Single-line, whitespace-nowrap, hover subtle underlines) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#2C2B29]">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors hover:text-[#181818] py-1 ${
              currentRoute === 'home' ? 'text-[#181818] border-b-2 border-[#3D4E41]' : 'text-[#5C574F]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('shop', { gender: 'men', category: 'all' })}
            className={`whitespace-nowrap transition-colors hover:text-[#181818] py-1 ${
              currentRoute === 'shop' && !megaMenuOpen ? 'text-[#181818]' : 'text-[#5C574F]'
            }`}
          >
            Men
          </button>

          <button
            onClick={() => handleNavClick('shop', { gender: 'women', category: 'all' })}
            className="whitespace-nowrap text-[#5C574F] hover:text-[#181818] transition-colors py-1"
          >
            Women
          </button>

          {/* Mega-menu hover trigger for Collections */}
          <div
            className="relative"
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
          >
            <button
              onClick={() => handleNavClick('shop', { category: 'all' })}
              className="flex items-center gap-1 whitespace-nowrap text-[#5C574F] hover:text-[#181818] transition-colors py-1"
            >
              Collections
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {megaMenuOpen && (
              <div className="absolute top-full -left-12 w-[520px] bg-white border border-[#E8E2D6] shadow-xl p-6 mt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-[#888073] mb-3">
                      Men's Apparel
                    </p>
                    <ul className="space-y-2 text-xs">
                      <li>
                        <button
                          onClick={() => handleNavClick('shop', { gender: 'men', category: 'shirts' })}
                          className="text-[#2C2B29] hover:text-[#3D4E41] hover:underline"
                        >
                          Linen & Poplin Shirts
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('shop', { gender: 'men', category: 'trousers' })}
                          className="text-[#2C2B29] hover:text-[#3D4E41] hover:underline"
                        >
                          Pleated & Wool Trousers
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('shop', { gender: 'men', category: 'jackets' })}
                          className="text-[#2C2B29] hover:text-[#3D4E41] hover:underline"
                        >
                          Tailored Blazers & Safari Jackets
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('shop', { gender: 'men', category: 'ethnic' })}
                          className="text-[#2C2B29] hover:text-[#3D4E41] hover:underline"
                        >
                          Raw Silk Festive Kurtas
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-[#888073] mb-3">
                      Women's Apparel
                    </p>
                    <ul className="space-y-2 text-xs">
                      <li>
                        <button
                          onClick={() => handleNavClick('shop', { gender: 'women', category: 'dresses' })}
                          className="text-[#2C2B29] hover:text-[#3D4E41] hover:underline"
                        >
                          Draped Midi & Evening Dresses
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('shop', { gender: 'women', category: 'trousers' })}
                          className="text-[#2C2B29] hover:text-[#3D4E41] hover:underline"
                        >
                          High-Waist Wide-Leg Pants
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('shop', { category: 'tshirts' })}
                          className="text-[#2C2B29] hover:text-[#3D4E41] hover:underline"
                        >
                          Heavyweight Supima Essentials
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('shop', { occasion: 'festive' })}
                          className="text-[#2C2B29] hover:text-[#3D4E41] hover:underline"
                        >
                          Celebration & Festive Edit
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-[#5C574F]">
                  <span>Crafted with 100% natural fibers</span>
                  <button
                    onClick={() => handleNavClick('shop', { category: 'all' })}
                    className="font-semibold text-[#3D4E41] hover:underline"
                  >
                    View All Products &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('shop', { isNewArrival: true })}
            className="whitespace-nowrap text-[#5C574F] hover:text-[#181818] transition-colors py-1"
          >
            New Arrivals
          </button>

          <button
            onClick={() => handleNavClick('shop', { isBestSeller: true })}
            className="whitespace-nowrap text-[#5C574F] hover:text-[#181818] transition-colors py-1"
          >
            Best Sellers
          </button>

          <button
            onClick={() => handleNavClick('shop', { occasion: 'festive' })}
            className="whitespace-nowrap text-[#B85338] font-medium hover:text-[#963F28] transition-colors py-1"
          >
            Sale
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap transition-colors hover:text-[#181818] py-1 ${
              currentRoute === 'about' ? 'text-[#181818] border-b-2 border-[#3D4E41]' : 'text-[#5C574F]'
            }`}
          >
            About Us
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`whitespace-nowrap transition-colors hover:text-[#181818] py-1 ${
              currentRoute === 'contact' ? 'text-[#181818] border-b-2 border-[#3D4E41]' : 'text-[#5C574F]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Actions Cluster */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-[#4A4742] hover:text-[#181818] transition-colors rounded-full hover:bg-[#EFE9DF]"
            title="Search collection"
            aria-label="Search collection"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Icon with count */}
          <button
            onClick={() => handleNavClick('account', { tab: 'wishlist' })}
            className="p-2 text-[#4A4742] hover:text-[#181818] transition-colors rounded-full hover:bg-[#EFE9DF] relative"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 bg-[#B85338] text-white text-[10px] font-semibold flex items-center justify-center rounded-full tabular-nums">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Account Icon */}
          <button
            onClick={() => handleNavClick('account', { tab: 'profile' })}
            className="p-2 text-[#4A4742] hover:text-[#181818] transition-colors rounded-full hover:bg-[#EFE9DF] hidden sm:flex items-center gap-1.5"
            title="My Account"
            aria-label="My Account"
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium text-[#2C2B29] max-w-[80px] truncate hidden md:inline">
              {activeUser.name.split(' ')[0]}
            </span>
          </button>

          {/* Shopping Bag with dynamic item counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#181818] text-[#FAF8F5] rounded-md hover:bg-[#2C2C2C] transition-colors shadow-sm"
            title="Shopping Bag"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-medium tabular-nums">{cartCount}</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#2C2B29] lg:hidden hover:bg-[#EFE9DF] rounded-md transition-colors"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E8E2D6] px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 text-base font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2 text-[#181818] border-b border-[#EFE9DF]"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop', { gender: 'men' })}
              className="text-left py-2 text-[#4A4742] hover:text-[#181818] border-b border-[#EFE9DF]"
            >
              Men's Clothing
            </button>
            <button
              onClick={() => handleNavClick('shop', { gender: 'women' })}
              className="text-left py-2 text-[#4A4742] hover:text-[#181818] border-b border-[#EFE9DF]"
            >
              Women's Clothing
            </button>
            <button
              onClick={() => handleNavClick('shop', { isNewArrival: true })}
              className="text-left py-2 text-[#4A4742] hover:text-[#181818] border-b border-[#EFE9DF]"
            >
              New Arrivals
            </button>
            <button
              onClick={() => handleNavClick('shop', { isBestSeller: true })}
              className="text-left py-2 text-[#4A4742] hover:text-[#181818] border-b border-[#EFE9DF]"
            >
              Best Sellers
            </button>
            <button
              onClick={() => handleNavClick('shop', { occasion: 'festive' })}
              className="text-left py-2 text-[#B85338] font-semibold border-b border-[#EFE9DF]"
            >
              Festive Sale
            </button>
            <button
              onClick={() => handleNavClick('tracking')}
              className="text-left py-2 text-[#4A4742] hover:text-[#181818] border-b border-[#EFE9DF]"
            >
              Track Order
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2 text-[#4A4742] hover:text-[#181818] border-b border-[#EFE9DF]"
            >
              About StitchwellLane
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-2 text-[#4A4742] hover:text-[#181818] border-b border-[#EFE9DF]"
            >
              Contact Support
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left py-2 text-[#3D4E41] flex items-center gap-1.5 font-semibold"
            >
              <ShieldCheck className="w-4 h-4" />
              Store Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

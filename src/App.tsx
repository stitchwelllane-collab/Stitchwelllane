/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ShopByCategory } from './components/ShopByCategory';
import {
  NewArrivalsSection,
  BestSellersSection,
  ShopByOccasionSection,
  FeaturedEditorialSection,
  SpecialOffersBanner,
  WhyChooseUsSection,
  CustomerReviewsSection,
  InstagramGallerySection,
  NewsletterSection,
} from './components/HomeSections';
import { ProductListing } from './components/ProductListing';
import { ProductDetails } from './components/ProductDetails';
import { Checkout } from './components/Checkout';
import { AccountView } from './components/AccountView';
import { OrderTracking } from './components/OrderTracking';
import { AboutUs } from './components/AboutUs';
import { ContactUs } from './components/ContactUs';
import { PoliciesView } from './components/PoliciesView';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentRoute } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#181818] antialiased">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Top Navigation Bar */}
      <Header />

      {/* 3. Main Views */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <>
            <HeroBanner />
            <ShopByCategory />
            <NewArrivalsSection />
            <BestSellersSection />
            <ShopByOccasionSection />
            <FeaturedEditorialSection />
            <SpecialOffersBanner />
            <WhyChooseUsSection />
            <CustomerReviewsSection />
            <InstagramGallerySection />
            <NewsletterSection />
          </>
        )}

        {currentRoute === 'shop' && <ProductListing />}
        {currentRoute === 'product' && <ProductDetails />}
        {currentRoute === 'checkout' && <Checkout />}
        {currentRoute === 'account' && <AccountView />}
        {currentRoute === 'tracking' && <OrderTracking />}
        {currentRoute === 'about' && <AboutUs />}
        {currentRoute === 'contact' && <ContactUs />}
        {currentRoute === 'policies' && <PoliciesView />}
        {currentRoute === 'admin' && <AdminDashboard />}
      </main>

      {/* 4. Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />

      {/* 5. Complete Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

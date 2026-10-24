import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, FileText, Truck, RefreshCw, CreditCard, Cookie } from 'lucide-react';

export const PoliciesView: React.FC = () => {
  const { routeParams } = useShop();
  const [activeTab, setActiveTab] = useState<string>(routeParams.tab || 'shipping');

  useEffect(() => {
    if (routeParams.tab) {
      setActiveTab(routeParams.tab);
    }
  }, [routeParams.tab]);

  const tabs = [
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'returns', label: 'Returns & Exchanges', icon: RefreshCw },
    { id: 'refund', label: 'Cancellation & Refund', icon: FileText },
    { id: 'payment', label: 'Payment & Security', icon: CreditCard },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
          Transparency & Legal Terms
        </span>
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818] mt-1">
          Store Policies & Guarantees
        </h1>
        <p className="text-xs sm:text-sm text-[#666056] mt-2">
          Compliant with the Indian Consumer Protection (E-Commerce) Rules and Digital Personal Data Protection (DPDP) Act.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-1 bg-white p-3 rounded-lg border border-[#E8E2D6] h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 p-3 rounded text-xs font-semibold transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-[#181818] text-white'
                    : 'text-[#524E47] hover:bg-[#F3EFE8] hover:text-[#181818]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Box */}
        <main className="lg:col-span-3 bg-white p-6 sm:p-10 rounded-xl border border-[#E8E2D6] shadow-sm text-xs text-[#524E47] leading-relaxed space-y-6">
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#181818]">
                Shipping & Delivery Policy
              </h2>
              <p>
                StitchwellLane provides reliable delivery across 19,000+ Indian PIN codes through contracted tier-1 express logistics partners, including Blue Dart Express, Delhivery, and Bluedart Air.
              </p>
              <h3 className="font-semibold text-sm text-[#181818] pt-2">1. Dispatch Timelines</h3>
              <p>
                All ready-to-ship garments are inspected, hand-steamed, and handed to the courier hub within 24 hours of order confirmation. For orders placed prior to 2:00 PM IST on working days, dispatch is initiated the same day.
              </p>
              <h3 className="font-semibold text-sm text-[#181818] pt-2">2. Transit Times</h3>
              <p>
                • <strong>Metro Cities</strong> (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune): 2 to 3 business days.
                <br />
                • <strong>Rest of India</strong>: 3 to 5 business days.
                <br />
                • <strong>Priority Express Air</strong> (available at checkout for ₹149): Guaranteed 24–48 hours delivery in eligible metro PIN codes.
              </p>
              <h3 className="font-semibold text-sm text-[#181818] pt-2">3. Shipping Fees</h3>
              <p>
                We offer <strong>Complimentary Standard Shipping</strong> on all domestic orders of ₹1,499 or higher. For orders below ₹1,499, a flat nominal delivery fee of ₹99 is charged to cover handling.
              </p>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#181818]">
                Returns & Exchange Policy
              </h2>
              <p>
                We stand behind the craftsmanship and fit of every garment. If you are not completely pleased with the size or drape, we offer a <strong>7-Day Doorstep Reverse Pickup</strong> service across India.
              </p>
              <h3 className="font-semibold text-sm text-[#181818] pt-2">1. Eligibility Criteria</h3>
              <p>
                • Garment must be unworn, unwashed, and undamaged.
                <br />
                • Original swing tags and organic cotton storage pouches must remain intact.
                <br />
                • Return request must be submitted within 7 calendar days from the date of confirmed delivery.
              </p>
              <h3 className="font-semibold text-sm text-[#181818] pt-2">2. How to Initiate a Return</h3>
              <p>
                Log into your Account &rarr; Order History, select the corresponding order, and tap &ldquo;Exchange / Return&rdquo;. Alternatively, email care@stitchwelllane.com with your Order ID. Our logistics partner will execute reverse pickup from your doorstep at zero charge.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#181818]">
                Cancellation & Refund Policy
              </h2>
              <h3 className="font-semibold text-sm text-[#181818] pt-2">1. Order Cancellation</h3>
              <p>
                You may cancel your order at any time before dispatch by visiting the Order Details page or contacting support. Once an order is handed to our courier hub, it must proceed to delivery and be returned via our standard 7-day pickup.
              </p>
              <h3 className="font-semibold text-sm text-[#181818] pt-2">2. Refund Processing</h3>
              <p>
                Upon receipt of the returned garment at our Mumbai atelier and quality inspection (within 24–48 hours):
                <br />
                • <strong>Online Prepaid (Razorpay UPI / Cards)</strong>: Refund is credited directly to the original bank account or card within 5 to 7 banking days.
                <br />
                • <strong>Cash on Delivery (COD)</strong>: Refund is disbursed instantly via UPI transfer to the customer&apos;s verified VPA or Indian bank NEFT upon request.
              </p>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#181818]">
                Payment & Security Policy
              </h2>
              <p>
                StitchwellLane utilizes <strong>Razorpay</strong>, India&apos;s leading RBI-authorized payment aggregator, to process all transactions in Indian Rupees (INR ₹).
              </p>
              <p>
                We do not store, log, or have access to your raw credit/debit card numbers, CVVs, or bank net banking credentials. All payment data is tokenized using 256-bit AES encryption compliant with global PCI-DSS Level 1 standards.
              </p>
              <p>
                Supported methods: UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, Mastercard, American Express, Net Banking across 50+ banks, and Cash on Delivery.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#181818]">
                Privacy Policy (DPDP Act 2023)
              </h2>
              <p>
                StitchwellLane Apparel Private Limited is committed to respecting your digital privacy. This policy outlines how we collect and safeguard your personal details in compliance with India&apos;s Digital Personal Data Protection Act (DPDP Act 2023).
              </p>
              <h3 className="font-semibold text-sm text-[#181818] pt-2">Data We Collect</h3>
              <p>
                We collect your name, email, phone number, and delivery address solely for the purpose of order fulfillment, shipping notifications, and tax compliance under the Indian GST regime.
              </p>
              <p>
                We never sell, rent, or lease customer data to third-party advertisers. You may request data erasure or export at any time by contacting privacy@stitchwelllane.com.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#181818]">
                Terms & Conditions
              </h2>
              <p>
                By accessing or placing an order on StitchwellLane, you agree to these Terms and Conditions. All prices displayed on our website are in Indian Rupees (INR ₹) inclusive of applicable goods and services tax (GST).
              </p>
              <p>
                We reserve the right to decline or cancel orders in cases of pricing typographical errors, stock unavailability, or suspected fraudulent activity. In such circumstances, a full 100% refund will be issued immediately.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#181818]">
                Cookie Policy
              </h2>
              <p>
                We use strictly necessary functional cookies and local browser storage to preserve your active shopping bag items, coupon codes, and wishlist across page reloads. We do not deploy invasive third-party cross-site trackers.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Check, HelpCircle, ChevronDown, Send } from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product / Fit Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does delivery take across India?',
      a: 'Standard orders are dispatched within 24 hours and delivered within 2–4 business days across major Indian metros (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata). Non-metro locations typically take 3–5 business days. We provide real-time Blue Dart and Delhivery tracking numbers upon dispatch.',
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer a complimentary 7-day doorstep return and size exchange policy. If an item doesn’t fit or suit you, request an exchange through your Account or by reaching out to care@stitchwelllane.com. Our courier will pick up the package directly from your home.',
    },
    {
      q: 'How does the Razorpay payment system work?',
      a: 'All transactions on StitchwellLane are processed securely through Razorpay in Indian Rupees (INR ₹). We support UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, Mastercard, Net Banking for over 50+ Indian banks, and Cash on Delivery (COD). We never store raw card numbers.',
    },
    {
      q: 'Are your fabrics genuinely natural?',
      a: 'Yes. We work exclusively with 100% natural European flax linen, 260 GSM extra-long staple Supima cotton, pure Bhagalpur raw silk, and Australian Merino wool blends. We do not use polyester microfibers or acrylic substitutes.',
    },
    {
      q: 'Can I request custom alterations or tailored sizing?',
      a: 'Our garments include generous seam allowances for easy local tailoring. For bespoke inquiries or corporate orders, contact our Mumbai studio directly at +91 (022) 4892-9100.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setErrorMsg(data.error || 'Failed to submit inquiry');
      }
    } catch {
      setErrorMsg('Network error. Please try again or reach out on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
          At Your Service
        </span>
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818] mt-1">
          Contact Customer Care
        </h1>
        <p className="text-xs sm:text-sm text-[#666056] mt-2">
          Have a question regarding fits, fabric care, orders, or styling guidance? Our Mumbai atelier team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Direct Info & WhatsApp */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E8E2D6] space-y-5">
            <h3 className="font-editorial text-xl font-bold text-[#181818]">
              Atelier Support Concierge
            </h3>

            <div className="space-y-4 text-xs text-[#524E47]">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#3D4E41] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#181818] block">Email Support</strong>
                  <span>care@stitchwelllane.com</span>
                  <p className="text-[11px] text-[#888073]">Typical response within 2 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#3D4E41] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#181818] block">Telephone Helpline</strong>
                  <span>+91 (022) 4892-9100</span>
                  <p className="text-[11px] text-[#888073]">Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#3D4E41] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#181818] block">Registered Design Studio</strong>
                  <p>14, Perry Cross Road, Bandra West, Mumbai, Maharashtra 400050</p>
                  <p className="mt-1">Indiranagar 100ft Road, Bengaluru, Karnataka 560038</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Integration Button */}
            <div className="pt-2">
              <a
                href="https://wa.me/919820154321?text=Hello%20StitchwellLane,%20I%20have%20an%20inquiry%20regarding%20my%20apparel%20order."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Business Timings */}
          <div className="p-5 bg-[#F3EFE8] rounded-xl border border-[#E0D8CB] text-xs text-[#524E47] space-y-1">
            <span className="font-semibold text-[#181818] block">Dispatch & Delivery Timelines:</span>
            <p>Orders confirmed before 2:00 PM IST are handed to our courier hubs the same day.</p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D6] shadow-sm space-y-5">
            <h3 className="font-editorial text-xl font-bold text-[#181818]">
              Send Us a Message
            </h3>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2 text-xs text-emerald-800">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Inquiry Received Successfully</p>
                <p>
                  Thank you for reaching out. One of our wardrobe consultants will reply to your email within 2–4 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 bg-[#181818] text-white rounded font-medium text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <p className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded">
                    {errorMsg}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#524E47] block mb-1 font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Sengupta"
                      className="w-full px-3 py-2.5 border border-[#D5CBB9] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div>
                    <label className="text-[#524E47] block mb-1 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. vikram@example.com"
                      className="w-full px-3 py-2.5 border border-[#D5CBB9] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#181818]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#524E47] block mb-1 font-medium">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98201 12345"
                      className="w-full px-3 py-2.5 border border-[#D5CBB9] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div>
                    <label className="text-[#524E47] block mb-1 font-medium">Topic / Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#D5CBB9] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#181818]"
                    >
                      <option value="Product / Fit Inquiry">Product & Size Fitting Inquiry</option>
                      <option value="Order Tracking">Order & Shipping Status</option>
                      <option value="Return / Exchange">7-Day Doorstep Exchange</option>
                      <option value="Payment Inquiry">Razorpay / COD Payment Support</option>
                      <option value="Corporate / Bulk Order">Corporate & Celebration Gifting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[#524E47] block mb-1 font-medium">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-3 py-2.5 border border-[#D5CBB9] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#181818]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#181818] text-white font-semibold uppercase tracking-wider rounded hover:bg-[#2C2C2C] disabled:bg-slate-400 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {submitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Inquiry to Atelier</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQs Accordion Section */}
      <div className="mt-20 pt-12 border-t border-[#E8E2D6] max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#181818] mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-[#E8E2D6] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-[#181818] hover:bg-[#FAF8F5] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#888073] transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-[#524E47] leading-relaxed border-t border-[#F0ECE1]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

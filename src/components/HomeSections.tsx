import React, { useState } from 'react';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Sparkles, Check, Copy, Heart, Instagram } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

// 1. New Arrivals Section
export const NewArrivalsSection: React.FC = () => {
  const { products, navigate, setShopFilters } = useShop();
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E8E2D6]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E2D6]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
            Just Released
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818] mt-1">
            New Arrivals
          </h2>
        </div>
        <button
          onClick={() => {
            setShopFilters((prev) => ({ ...prev, isNewArrival: true, category: 'all' }));
            navigate('shop');
          }}
          className="text-xs font-semibold text-[#181818] hover:text-[#3D4E41] hover:underline flex items-center gap-1 mt-3 sm:mt-0"
        >
          <span>View All New Pieces ({products.filter((p) => p.isNewArrival).length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

// 2. Best Sellers Section
export const BestSellersSection: React.FC = () => {
  const { products, navigate, setShopFilters } = useShop();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E8E2D6]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E2D6]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
            Most Loved Across India
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818] mt-1">
            Best Sellers
          </h2>
        </div>
        <button
          onClick={() => {
            setShopFilters((prev) => ({ ...prev, isBestSeller: true, category: 'all' }));
            navigate('shop');
          }}
          className="text-xs font-semibold text-[#181818] hover:text-[#3D4E41] hover:underline flex items-center gap-1 mt-3 sm:mt-0"
        >
          <span>Explore All Best Sellers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

// 3. Shop by Occasion Section
export const ShopByOccasionSection: React.FC = () => {
  const { navigate, setShopFilters } = useShop();

  const occasions = [
    {
      id: 'casual',
      title: 'Casual Wear',
      description: 'Relaxed linen shirts, selvedge overshirts & breezy bottoms',
      image: '/src/assets/images/collection_mens_tailored_1792179896681.jpg',
    },
    {
      id: 'office',
      title: 'Work & Office Wear',
      description: 'Pleated wool trousers, crisp poplin shirts & modern blazers',
      image: '/src/assets/images/product_charcoal_trousers_1792179972104.jpg',
    },
    {
      id: 'festive',
      title: 'Festive & Celebration',
      description: 'Handloom raw silk kurtas, zari plackets & occasion drapes',
      image: '/src/assets/images/product_chanderi_kurta_1792179970068.jpg',
    },
    {
      id: 'party',
      title: 'Evening & Party Wear',
      description: 'Asymmetric modal-silk dresses, structured dinner tailoring',
      image: '/src/assets/images/collection_womens_contemporary_1792179896644.jpg',
    },
    {
      id: 'everyday',
      title: 'Everyday Essentials',
      description: 'Heavyweight 260 GSM Supima tees and wardrobe basics',
      image: '/src/assets/images/product_supima_tee_1792179970901.jpg',
    },
    {
      id: 'seasonal',
      title: 'Seasonal Collections',
      description: 'Transitional autumn layers and cool breathable textiles',
      image: '/src/assets/images/hero_fashion_editorial_1792179895668.jpg',
    },
  ];

  const handleOccasionClick = (occasionId: string) => {
    setShopFilters((prev) => ({
      ...prev,
      occasion: occasionId,
      category: 'all',
      gender: 'all',
    }));
    navigate('shop');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E8E2D6]">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
          Intentional Dressing
        </span>
        <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818] mt-1">
          Shop by Occasion
        </h2>
        <p className="text-sm text-[#666056] mt-2">
          From crisp Monday morning presentations to sunset family celebrations, dress with effortless poise.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {occasions.map((occ) => (
          <div
            key={occ.id}
            onClick={() => handleOccasionClick(occ.id)}
            className="group relative cursor-pointer overflow-hidden rounded-lg bg-[#EFE9DF] border border-[#DDD4C5] aspect-[4/3] flex flex-col justify-end p-5 transition-transform duration-300 hover:shadow-md"
          >
            <img
              src={occ.image}
              alt={occ.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 text-white">
              <h3 className="text-lg sm:text-xl font-editorial font-bold text-white group-hover:text-[#F3EFE8] transition-colors">
                {occ.title}
              </h3>
              <p className="text-xs text-[#D5CEBF] mt-1 line-clamp-1 font-sans">
                {occ.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 4. Featured Editorial Section
export const FeaturedEditorialSection: React.FC = () => {
  const { navigate, setShopFilters } = useShop();

  return (
    <section className="py-16 sm:py-20 bg-[#F3EFE8] border-b border-[#E8E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 aspect-[4/3] rounded-lg overflow-hidden shadow-lg border border-[#DDD4C5]">
            <img
              src="/src/assets/images/editorial_craftsmanship_fabric_1792179896569.jpg"
              alt="Tailoring craftsmanship and pure handloom fabrics at StitchwellLane"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
              The Atelier Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818] leading-tight">
              Slow Tailoring & Handloom Integrity
            </h2>
            <p className="text-sm sm:text-base text-[#524E47] leading-relaxed">
              At StitchwellLane, every stitch is an ode to patience. We collaborate directly with artisanal weaving clusters across Tamil Nadu, West Bengal, and Bihar, blending time-honored handloom textiles with sharp, modern architectural silhouettes.
            </p>
            <p className="text-sm text-[#524E47] leading-relaxed">
              No plastic synthetics, no disposable fast-fashion cycles. Just enduring garments cut to be worn, loved, and passed down.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShopFilters((prev) => ({ ...prev, category: 'all' }));
                  navigate('shop');
                }}
                className="px-6 py-3 bg-[#181818] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase rounded hover:bg-[#2F2E2C] transition-colors shadow-sm cursor-pointer"
              >
                Discover the Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 5. Special Offers & Coupons Banner
export const SpecialOffersBanner: React.FC = () => {
  const { coupons, applyCoupon } = useShop();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      const res = await applyCoupon(code);
      setFeedback(res.message);
      setTimeout(() => {
        setCopiedCode(null);
        setFeedback(null);
      }, 3500);
    } catch {
      setCopiedCode(code);
    }
  };

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E8E2D6]">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
          Exclusive Wardrobe Perks
        </span>
        <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#181818] mt-1">
          Special Offers & Coupon Privileges
        </h2>
        <p className="text-xs text-[#666056] mt-1">
          Click any coupon to copy code and automatically apply to your active bag.
        </p>
      </div>

      {feedback && (
        <div className="max-w-md mx-auto mb-6 p-2.5 bg-[#EDF3EE] border border-[#B9D1BE] text-[#28442F] text-xs font-medium text-center rounded animate-in fade-in">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            onClick={() => handleCopy(coupon.code)}
            className="p-5 bg-white rounded-lg border border-dashed border-[#C5BBAA] hover:border-[#3D4E41] hover:shadow-sm transition-all cursor-pointer relative group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold tracking-widest text-[#181818] bg-[#F3EFE8] px-2.5 py-1 rounded">
                  {coupon.code}
                </span>
                <span className="text-[11px] font-semibold text-[#3D4E41] flex items-center gap-1">
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs font-medium text-[#2C2B29] mt-2">
                {coupon.description}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] text-[#736E66]">
              <span>Terms: Valid on all Indian orders</span>
              <span className="font-medium text-[#181818]">Min ₹{coupon.minOrderValue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 6. Why Choose StitchwellLane
export const WhyChooseUsSection: React.FC = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Quality-Focused Clothing',
      text: 'Long-staple Supima cotton, Normandy flax, and mulberry silks with durable double-needle lockstitches.',
    },
    {
      icon: Heart,
      title: 'Thoughtfully Curated Styles',
      text: 'Timeless silhouettes designed to flatter Indian body types, avoiding trend cycles and fast-fashion waste.',
    },
    {
      icon: ShieldCheck,
      title: '100% Secure INR Payments',
      text: 'Encrypted Razorpay gateway supporting UPI (GPay, PhonePe, Paytm), RuPay, Credit/Debit Cards, and COD.',
    },
    {
      icon: Truck,
      title: 'Reliable All-India Shipping',
      text: 'Partnership with Delhivery and Blue Dart with live order milestone tracking and dispatch alerts.',
    },
    {
      icon: RefreshCw,
      title: 'Easy 7-Day Doorstep Returns',
      text: 'Hassle-free reverse pick-up service across 19,000+ Indian pincodes with instant refund assistance.',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E8E2D6]">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
          The Stitchwell Standard
        </span>
        <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818] mt-1">
          Why Choose StitchwellLane?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-lg border border-[#E8E2D6] flex flex-col items-start space-y-3"
            >
              <div className="w-9 h-9 rounded bg-[#F3EFE8] text-[#3D4E41] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#181818] leading-tight">
                {item.title}
              </h3>
              <p className="text-xs text-[#666056] leading-relaxed">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// 7. Customer Reviews Section (Authentic verified feedback)
export const CustomerReviewsSection: React.FC = () => {
  const reviews = [
    {
      author: 'Kabir Singhania',
      city: 'Mumbai',
      product: 'Atelier French Linen Button-Down Shirt',
      rating: 5,
      date: '14 Oct 2026',
      title: 'Bespoke precision at ready-to-wear convenience',
      text: 'The linen fabric breathes like a dream in Bombay’s coastal climate. The collar keeps its structure cleanly under a light blazer.',
    },
    {
      author: 'Dr. Radhika Menon',
      city: 'Bengaluru',
      product: 'Aurelia Draped Sage Olive Midi Dress',
      rating: 5,
      date: '09 Oct 2026',
      title: 'Effortless luxury that commands presence',
      text: 'The modal silk drape is magnificent. Ordered it for a medical symposium dinner and felt both confident and impeccably dressed.',
    },
    {
      author: 'Devendra Rathore',
      city: 'Jaipur',
      product: 'Heritage Raw Silk Festive Kurta Set',
      rating: 5,
      date: '02 Oct 2026',
      title: 'Subtle elegance without garish glitter',
      text: 'Appreciated the fine aari threadwork and the purity of Bhagalpur handloom silk. StitchwellLane’s packaging was pristine too.',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E8E2D6]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E2D6]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
            Real Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818] mt-1">
            Customer Reviews
          </h2>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 text-xs text-[#524E47]">
          <div className="flex text-[#D49E35]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="font-semibold text-[#181818]">4.9 / 5.0 Average</span>
          <span className="text-[#888073]">· 1,420+ Verified Orders</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg border border-[#E8E2D6] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex text-[#D49E35]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-[#888073]">{rev.date}</span>
              </div>
              <h4 className="text-sm font-semibold text-[#181818]">
                &ldquo;{rev.title}&rdquo;
              </h4>
              <p className="text-xs text-[#524E47] mt-2 leading-relaxed">
                {rev.text}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F0ECE1]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#181818]">{rev.author}</p>
                  <p className="text-[11px] text-[#888073]">{rev.city}, India</p>
                </div>
                <span className="text-[10px] font-medium text-[#2F5233] bg-[#EBF3EC] px-2 py-0.5 rounded">
                  Verified Buyer
                </span>
              </div>
              <p className="text-[10px] text-[#736E66] mt-1 truncate">
                Purchased: {rev.product}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 8. Instagram / Social Inspiration Gallery
export const InstagramGallerySection: React.FC = () => {
  const lookbook = [
    {
      title: 'Autumnal Tailoring',
      tag: '@stitchwelllane',
      image: '/src/assets/images/hero_fashion_editorial_1792179895668.jpg',
    },
    {
      title: 'Linen Essentials',
      tag: '#StitchwellMen',
      image: '/src/assets/images/collection_mens_tailored_1792179896681.jpg',
    },
    {
      title: 'Fluid Drapery',
      tag: '#StitchwellWomen',
      image: '/src/assets/images/collection_womens_contemporary_1792179896644.jpg',
    },
    {
      title: 'Textile Craft',
      tag: '#AtelierStitchwell',
      image: '/src/assets/images/editorial_craftsmanship_fabric_1792179896569.jpg',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E8E2D6]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
            Social Lookbook
          </span>
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#181818] mt-1">
            Styled by Our Community
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#524E47] mt-2 sm:mt-0">
          <Instagram className="w-4 h-4 text-[#3D4E41]" />
          <span>Follow @stitchwelllane on Instagram</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {lookbook.map((item, idx) => (
          <div
            key={idx}
            className="group relative aspect-square rounded-lg overflow-hidden bg-[#EFE9DF] border border-[#DDD4C5]"
          >
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-4 text-center">
              <Instagram className="w-5 h-5 mb-1" />
              <p className="text-xs font-semibold">{item.title}</p>
              <span className="text-[11px] text-[#D7CCBC]">{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 9. Newsletter Subscription Section
export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      setStatus('loading');
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'You are subscribed to StitchwellLane style privileges.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Could not subscribe.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
          Stay Connected
        </span>
        <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818]">
          A Little Style in Your Inbox.
        </h2>
        <p className="text-sm text-[#5C574F] max-w-lg mx-auto">
          Subscribe to receive private previews of new seasonal atelier collections, private member sales, and thoughtful editorial style guides.
        </p>

        <form onSubmit={handleSubmit} className="pt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 bg-white border border-[#D5CBB9] rounded text-sm text-[#181818] placeholder-[#948D81] focus:outline-none focus:border-[#181818]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-[#181818] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase rounded hover:bg-[#2F2E2C] transition-colors cursor-pointer shrink-0"
          >
            {status === 'loading' ? 'Joining...' : 'Subscribe'}
          </button>
        </form>

        {status === 'success' && (
          <p className="text-xs font-medium text-emerald-800 animate-in fade-in">
            {message}
          </p>
        )}
        {status === 'error' && (
          <p className="text-xs font-medium text-rose-700 animate-in fade-in">
            {message}
          </p>
        )}

        <p className="text-[11px] text-[#888073]">
          By subscribing, you agree to our Privacy Policy. Unsubscribe anytime in one click.
        </p>
      </div>
    </section>
  );
};

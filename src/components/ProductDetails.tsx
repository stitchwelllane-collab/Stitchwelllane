import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Ruler,
  Check,
  Share2,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { PINCODE_DELIVERY_DATA } from '../data/initialProducts';

export const ProductDetails: React.FC = () => {
  const {
    products,
    routeParams,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
    refreshProducts,
  } = useShop();

  const productId = routeParams.productId;
  const product = products.find((p) => p.id === productId || p.slug === productId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping' | 'reviews'>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [unitMode, setUnitMode] = useState<'inches' | 'cm'>('inches');
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{ city: string; state: string; days: number; date: string } | null>(null);
  const [pincodeError, setPincodeError] = useState('');
  const [zoomed, setZoomed] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review submission state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colors[0]?.name || 'Standard');
      const firstInStockSize = product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size || '';
      setSelectedSize(firstInStockSize);
      setQuantity(1);
      setPincodeResult(null);
      setPincodeError('');
      setAddedNotice(false);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="text-base text-[#666056]">Product not found.</p>
        <button
          onClick={() => navigate('shop')}
          className="mt-4 px-6 py-2.5 bg-[#181818] text-white text-xs uppercase tracking-wider rounded"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const isOutOfStock = !selectedSizeObj || selectedSizeObj.stock <= 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (directToCheckout = false) => {
    if (isOutOfStock || !selectedSize) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
    if (directToCheckout) {
      navigate('checkout');
    }
  };

  // Check Indian PIN Code delivery
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError('');
    setPincodeResult(null);

    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    // Lookup known or estimate standard
    let info = PINCODE_DELIVERY_DATA[cleanPin];
    if (!info) {
      // General Indian estimation
      info = {
        city: 'Serviceable via Express Courier',
        state: 'India',
        days: 3,
      };
    }

    const deliveryDate = new Date(Date.now() + info.days * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });

    setPincodeResult({
      city: info.city,
      state: info.state,
      days: info.days,
      date: deliveryDate,
    });
  };

  // Submit Review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;

    try {
      setReviewSubmitting(true);
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: reviewAuthor,
          city: reviewCity || 'India',
          rating: reviewRating,
          comment: reviewComment,
          sizePurchased: selectedSize,
          colorPurchased: selectedColor,
        }),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setReviewAuthor('');
        setReviewCity('');
        setReviewComment('');
        await refreshProducts();
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch {
      //
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 4);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#736E66] mb-8 font-medium">
        <button onClick={() => navigate('home')} className="hover:text-[#181818]">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => navigate('shop')} className="hover:text-[#181818]">Shop</button>
        <ChevronRight className="w-3 h-3" />
        <span className="capitalize">{product.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#181818] font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main PDP Grid: Gallery Left, Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-16 border-b border-[#E8E2D6]">
        {/* Left Column: Image Gallery with Zoom */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-20 sm:w-20 sm:h-24 rounded overflow-hidden border-2 transition-all shrink-0 bg-[#F3EFE8] ${
                  activeImageIndex === idx ? 'border-[#181818]' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Hero Image with Zoom Preview */}
          <div
            className="flex-1 relative aspect-[3/4] rounded-lg overflow-hidden bg-[#F3EFE8] border border-[#E0D8CB] cursor-zoom-in"
            onClick={() => setZoomed(!zoomed)}
          >
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-300 ${
                zoomed ? 'scale-150' : 'scale-100'
              }`}
            />
            {zoomed && (
              <div className="absolute top-3 left-3 bg-[#181818]/80 text-white text-[10px] px-2.5 py-1 rounded backdrop-blur-sm">
                Click again to zoom out
              </div>
            )}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[#181818] text-[11px] px-2.5 py-1 rounded shadow-xs flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#3D4E41]" />
              <span>Studio Shot</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-xs text-[#736E66] uppercase tracking-wider font-medium">
              <span>{product.gender} · {product.category}</span>
              <span className="font-mono text-[11px]">SKU: {product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-[#181818] mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-2 mt-2.5 text-xs text-[#524E47]">
              <div className="flex text-[#D49E35]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-[#181818] tabular-nums">{product.rating}</span>
              <span className="text-[#888073]">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price Block */}
            <div className="mt-4 pt-4 border-t border-[#E8E2D6] flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#181818] tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base text-[#948D81] line-through tabular-nums">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-[#B85338] bg-[#FDF1EE] px-2 py-0.5 rounded">
                    Save {product.discountPercent}% (₹{(product.originalPrice - product.price).toLocaleString('en-IN')})
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[#736E66] mt-1">
              Inclusive of all taxes. Free shipping on orders above ₹1,499.
            </p>
          </div>

          {/* Color Selection */}
          <div className="pt-4 border-t border-[#E8E2D6]">
            <span className="text-xs font-semibold text-[#181818] block mb-2">
              Color Tone: <strong className="text-[#3D4E41]">{selectedColor}</strong>
            </span>
            <div className="flex items-center gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform relative ${
                    selectedColor === c.name
                      ? 'border-[#181818] scale-110 shadow-sm'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.name && (
                    <span className="absolute inset-0 flex items-center justify-center text-white/90 text-xs">
                      •
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection & Size Guide */}
          <div className="pt-4 border-t border-[#E8E2D6]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#181818]">
                Select Size: <strong className="text-[#3D4E41]">{selectedSize}</strong>
              </span>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-[#3D4E41] hover:underline flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const inStock = s.stock > 0;
                const isSelected = selectedSize === s.size;
                return (
                  <button
                    key={s.size}
                    disabled={!inStock}
                    onClick={() => setSelectedSize(s.size)}
                    className={`min-w-[48px] py-2 px-3 text-xs font-medium rounded border transition-all ${
                      isSelected
                        ? 'bg-[#181818] text-white border-[#181818]'
                        : inStock
                        ? 'bg-white text-[#181818] border-[#D5CBB9] hover:border-[#181818]'
                        : 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>

            {/* Live Stock Notification */}
            {selectedSizeObj && selectedSizeObj.stock > 0 && selectedSizeObj.stock < 6 && (
              <p className="text-[11px] text-[#B85338] font-medium mt-2 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Hurry! Only {selectedSizeObj.stock} items remaining in this size.</span>
              </p>
            )}
            {isOutOfStock && (
              <p className="text-[11px] text-[#B85338] font-semibold mt-2">
                This size is currently out of stock. Please select another size.
              </p>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="pt-4 border-t border-[#E8E2D6] space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-[#181818]">Quantity:</span>
              <div className="flex items-center border border-[#D5CBB9] rounded bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs text-[#524E47] hover:bg-[#F3EFE8]"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-semibold tabular-nums">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      selectedSizeObj ? Math.min(selectedSizeObj.stock, q + 1) : q + 1
                    )
                  }
                  className="px-3 py-1.5 text-xs text-[#524E47] hover:bg-[#F3EFE8]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons: Add to Bag, Buy Now, Wishlist */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  addedNotice
                    ? 'bg-emerald-700 text-white'
                    : isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#181818] text-white hover:bg-[#2C2C2C]'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                  isOutOfStock
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'bg-white text-[#181818] border-[#181818] hover:bg-[#F3EFE8]'
                }`}
              >
                Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded border transition-colors ${
                  inWishlist
                    ? 'bg-[#B85338] text-white border-[#B85338]'
                    : 'bg-white text-[#2C2B29] border-[#D5CBB9] hover:border-[#181818]'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Real-time Indian PIN Code Delivery Checker */}
          <div className="p-4 bg-[#F3EFE8] rounded-lg border border-[#E0D8CB] space-y-2">
            <span className="text-xs font-semibold text-[#181818] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#3D4E41]" />
              Check Delivery Timeline Across India
            </span>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit PIN code (e.g. 400001)"
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="flex-1 px-3 py-2 bg-white border border-[#D5CBB9] rounded text-xs text-[#181818] placeholder-[#948D81] focus:outline-none focus:border-[#181818]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#181818] text-white text-xs font-semibold rounded hover:bg-[#2C2C2C] shrink-0"
              >
                Check
              </button>
            </form>

            {pincodeError && (
              <p className="text-[11px] text-rose-700 font-medium">{pincodeError}</p>
            )}

            {pincodeResult && (
              <div className="pt-2 text-xs text-[#28442F] bg-white/70 p-2.5 rounded border border-[#C5D5C8] space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Deliverable to {pincodeResult.city}, {pincodeResult.state}</span>
                </p>
                <p className="text-[11px] text-[#524E47] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#3D4E41]" />
                  <span>Estimated Arrival: <strong>{pincodeResult.date}</strong> ({pincodeResult.days} business days)</span>
                </p>
                <p className="text-[11px] text-[#524E47]">
                  Dispatched via Express Courier with live tracking link.
                </p>
              </div>
            )}
          </div>

          {/* Assurances */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#524E47]">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#3D4E41] shrink-0" />
              <span>7-Day Hassle-Free Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3D4E41] shrink-0" />
              <span>100% Genuine Handcrafted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Fabric & Care, Shipping & Returns, Customer Reviews */}
      <div className="py-12 border-b border-[#E8E2D6]">
        {/* Tab Headers */}
        <div className="flex items-center gap-6 border-b border-[#E8E2D6] pb-3 overflow-x-auto">
          {[
            { id: 'details', label: 'Product Details' },
            { id: 'fabric', label: 'Fabric Composition & Care' },
            { id: 'shipping', label: 'Shipping & Exchanges' },
            { id: 'reviews', label: `Reviews (${product.reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap text-xs font-semibold uppercase tracking-wider py-1 transition-colors ${
                activeTab === tab.id
                  ? 'text-[#181818] border-b-2 border-[#181818]'
                  : 'text-[#888073] hover:text-[#181818]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-3xl text-sm text-[#524E47] leading-relaxed">
              <p>{product.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-xs">
                <div>
                  <span className="text-[#888073] block uppercase tracking-wider text-[10px]">Occasion</span>
                  <strong className="text-[#181818] capitalize">{product.occasion} Wear</strong>
                </div>
                <div>
                  <span className="text-[#888073] block uppercase tracking-wider text-[10px]">Fit</span>
                  <strong className="text-[#181818]">Tailored Contemporary Fit</strong>
                </div>
                <div>
                  <span className="text-[#888073] block uppercase tracking-wider text-[10px]">Country of Origin</span>
                  <strong className="text-[#181818]">India (Crafted in Mumbai)</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fabric' && (
            <div className="space-y-4 max-w-3xl text-sm text-[#524E47]">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#181818] mb-1">
                  Textile Composition
                </h4>
                <p>{product.fabricComposition}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#181818] mb-2">
                  Care Instructions
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {product.careInstructions.map((inst, idx) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3 max-w-3xl text-xs text-[#524E47] leading-relaxed">
              <p>
                <strong>Delivery Timelines:</strong> Standard shipping is 2–4 business days across metro cities in India. Express delivery (next-day or 48 hours) is available at checkout for ₹149.
              </p>
              <p>
                <strong>Shipping Charges:</strong> Free shipping is automatically applied to all orders above ₹1,499. Orders below ₹1,499 incur a flat ₹99 shipping fee.
              </p>
              <p>
                <strong>7-Day Returns & Exchanges:</strong> If the fit is not ideal, you can initiate a return or size exchange within 7 days of delivery through your Account or our Support team. Doorstep reverse pickup is arranged at no extra charge.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-4xl">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-white rounded-lg border border-[#E8E2D6] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#181818]">{rev.author}</span>
                          <span className="text-[11px] text-[#888073]">({rev.city})</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#888073]">{rev.date}</span>
                      </div>
                      <div className="flex text-[#D49E35]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <h5 className="text-xs font-semibold text-[#181818]">{rev.title}</h5>
                      <p className="text-xs text-[#524E47]">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#736E66]">Be the first to review this garment.</p>
                )}
              </div>

              {/* Review Submission Form */}
              <div className="p-6 bg-white rounded-lg border border-[#E8E2D6] space-y-4">
                <h4 className="text-sm font-semibold text-[#181818]">
                  Write a Verified Product Review
                </h4>

                {reviewSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200">
                    Thank you! Your feedback has been verified and posted.
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      required
                      className="px-3 py-2 text-xs border border-[#D5CBB9] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#181818]"
                    />
                    <input
                      type="text"
                      placeholder="City (e.g. Mumbai, Delhi, Bengaluru)"
                      value={reviewCity}
                      onChange={(e) => setReviewCity(e.target.value)}
                      className="px-3 py-2 text-xs border border-[#D5CBB9] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#524E47]">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`p-1 ${star <= reviewRating ? 'text-[#D49E35]' : 'text-slate-300'}`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Share details about the fabric feel, drape, fit, and stitching quality..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-[#D5CBB9] rounded bg-[#FAF8F5] focus:outline-none focus:border-[#181818]"
                  />

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-5 py-2.5 bg-[#181818] text-white text-xs font-semibold rounded hover:bg-[#2C2C2C] disabled:bg-slate-300"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products: You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="py-16">
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E8E2D6]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
                Recommended
              </span>
              <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#181818] mt-1">
                You May Also Like
              </h2>
            </div>
            <button
              onClick={() => navigate('shop')}
              className="text-xs font-semibold text-[#181818] hover:underline"
            >
              Browse All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Interactive Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#E8E2D6] w-full max-w-2xl rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
              <div>
                <h3 className="text-lg font-editorial font-bold text-[#181818]">
                  StitchwellLane Size Measurement Guide
                </h3>
                <p className="text-xs text-[#736E66]">
                  Standard tailored Indian body measurements.
                </p>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="p-1 text-[#181818] hover:bg-[#EFE9DF] rounded"
              >
                ✕
              </button>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center justify-end gap-2 my-4">
              <span className="text-xs text-[#666056]">Units:</span>
              <div className="flex border border-[#D5CBB9] rounded bg-white p-0.5 text-xs">
                <button
                  onClick={() => setUnitMode('inches')}
                  className={`px-3 py-1 rounded transition-colors ${
                    unitMode === 'inches' ? 'bg-[#181818] text-white' : 'text-[#524E47]'
                  }`}
                >
                  Inches (&quot;)
                </button>
                <button
                  onClick={() => setUnitMode('cm')}
                  className={`px-3 py-1 rounded transition-colors ${
                    unitMode === 'cm' ? 'bg-[#181818] text-white' : 'text-[#524E47]'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            {/* Size Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F3EFE8] text-[#181818] uppercase tracking-wider border-b border-[#E0D8CB]">
                  <tr>
                    <th className="py-2.5 px-3">Size Tag</th>
                    <th className="py-2.5 px-3">Chest / Bust</th>
                    <th className="py-2.5 px-3">Waist</th>
                    <th className="py-2.5 px-3">Shoulder</th>
                    <th className="py-2.5 px-3">Garment Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DF]">
                  {[
                    { tag: 'XS', chest: [36, 91], waist: [28, 71], shoulder: [16.5, 42], len: [27, 68] },
                    { tag: 'S', chest: [38, 96], waist: [30, 76], shoulder: [17.0, 43], len: [28, 71] },
                    { tag: 'M', chest: [40, 101], waist: [32, 81], shoulder: [17.5, 44.5], len: [29, 73] },
                    { tag: 'L', chest: [42, 106], waist: [34, 86], shoulder: [18.0, 46], len: [30, 76] },
                    { tag: 'XL', chest: [44, 112], waist: [36, 91], shoulder: [18.5, 47], len: [31, 79] },
                    { tag: 'XXL', chest: [46, 117], waist: [38, 96], shoulder: [19.0, 48], len: [31.5, 80] },
                  ].map((row) => (
                    <tr key={row.tag} className="hover:bg-white">
                      <td className="py-2.5 px-3 font-bold text-[#181818]">{row.tag}</td>
                      <td className="py-2.5 px-3 tabular-nums">
                        {unitMode === 'inches' ? `${row.chest[0]}"` : `${row.chest[1]} cm`}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums">
                        {unitMode === 'inches' ? `${row.waist[0]}"` : `${row.waist[1]} cm`}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums">
                        {unitMode === 'inches' ? `${row.shoulder[0]}"` : `${row.shoulder[1]} cm`}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums">
                        {unitMode === 'inches' ? `${row.len[0]}"` : `${row.len[1]} cm`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8E2D6] text-[11px] text-[#736E66]">
              <p>💡 Tip: For relaxed / oversized fits, order your standard true size. For tailored evening fits, refer to the chest and shoulder width.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

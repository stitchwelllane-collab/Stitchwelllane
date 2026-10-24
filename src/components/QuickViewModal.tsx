import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, navigate } = useShop();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      const firstAvailableSize = quickViewProduct.sizes.find((s) => s.stock > 0)?.size || quickViewProduct.sizes[0]?.size || '';
      setSelectedSize(firstAvailableSize);
      setSelectedColor(quickViewProduct.colors[0]?.name || 'Standard');
      setQuantity(1);
      setActiveImageIndex(0);
      setAdded(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  const handleGoToPDP = () => {
    const id = quickViewProduct.id;
    setQuickViewProduct(null);
    navigate('product', { productId: id });
  };

  const selectedSizeObj = quickViewProduct.sizes.find((s) => s.size === selectedSize);
  const isOutOfStock = !selectedSizeObj || selectedSizeObj.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#E8E2D6] w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#181818] flex items-center justify-center transition-colors shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Product Images */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-[#F3EFE8] border-b md:border-b-0 md:border-r border-[#E8E2D6]">
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white shadow-xs">
            <img
              src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-16 rounded overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-[#181818]' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#736E66] uppercase tracking-wider font-medium">
              <span>{quickViewProduct.category}</span>
              <span className="font-mono text-[11px]">{quickViewProduct.sku}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-editorial font-bold text-[#181818] mt-1 leading-tight">
              {quickViewProduct.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[#524E47]">
              <div className="flex items-center text-[#D49E35]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold tabular-nums">{quickViewProduct.rating}</span>
              <span className="text-[#888073]">({quickViewProduct.reviewCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-3 pb-3 border-b border-[#E8E2D6]">
              <span className="text-2xl font-bold text-[#181818] tabular-nums">
                ₹{quickViewProduct.price.toLocaleString('en-IN')}
              </span>
              {quickViewProduct.originalPrice > quickViewProduct.price && (
                <>
                  <span className="text-sm text-[#948D81] line-through tabular-nums">
                    ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-[#B85338]">
                    Save {quickViewProduct.discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-[#524E47] mt-3 leading-relaxed line-clamp-3">
              {quickViewProduct.description}
            </p>

            {/* Colors */}
            <div className="mt-4">
              <span className="text-xs font-medium text-[#181818] block mb-1.5">
                Color: <strong className="text-[#3D4E41]">{selectedColor}</strong>
              </span>
              <div className="flex items-center gap-2">
                {quickViewProduct.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      selectedColor === c.name
                        ? 'border-[#181818] scale-110 shadow-xs'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#181818]">
                  Size: <strong className="text-[#3D4E41]">{selectedSize}</strong>
                </span>
                {selectedSizeObj && selectedSizeObj.stock < 5 && selectedSizeObj.stock > 0 && (
                  <span className="text-[11px] font-medium text-[#B85338]">
                    Only {selectedSizeObj.stock} left in stock!
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.sizes.map((s) => {
                  const inStock = s.stock > 0;
                  const isSelected = selectedSize === s.size;
                  return (
                    <button
                      key={s.size}
                      disabled={!inStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-3 py-1.5 text-xs font-medium rounded border transition-all ${
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
            </div>

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-medium text-[#181818]">Quantity:</span>
              <div className="flex items-center border border-[#D5CBB9] rounded bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-xs text-[#524E47] hover:bg-[#F3EFE8]"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold tabular-nums">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      selectedSizeObj ? Math.min(selectedSizeObj.stock, q + 1) : q + 1
                    )
                  }
                  className="px-2.5 py-1 text-xs text-[#524E47] hover:bg-[#F3EFE8]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-3 border-t border-[#E8E2D6]">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                added
                  ? 'bg-emerald-700 text-white'
                  : isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#181818] text-white hover:bg-[#2C2C2C]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : isOutOfStock ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag · ₹{(quickViewProduct.price * quantity).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            <button
              onClick={handleGoToPDP}
              className="w-full py-2 text-xs font-medium text-[#3D4E41] hover:text-[#181818] hover:underline flex items-center justify-center gap-1"
            >
              <span>View Full Product Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

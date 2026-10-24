import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const hasSecondaryImage = product.images.length > 1;

  const handleQuickAdd = (size: string, color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, size, color, 1);
    setShowSizePicker(false);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleCardClick = () => {
    navigate('product', { productId: product.id });
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizePicker(false);
      }}
      className="group flex flex-col bg-white rounded-lg border border-[#E8E2D6] overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
    >
      {/* Visual Slot */}
      <div className="relative aspect-[3/4] bg-[#F3EFE8] overflow-hidden">
        <img
          src={isHovered && hasSecondaryImage ? product.images[1] : product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Tags */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.isNewArrival && (
            <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#181818] text-white px-2 py-0.5 rounded">
              New In
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#3D4E41] text-white px-2 py-0.5 rounded">
              Best Seller
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#B85338] text-white px-2 py-0.5 rounded">
              {product.discountPercent}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-xs ${
            inWishlist
              ? 'bg-[#B85338] text-white'
              : 'bg-white/80 hover:bg-white text-[#2C2B29] hover:scale-110'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button (hover reveal) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 px-3 py-1.5 bg-white/95 text-[#181818] text-xs font-medium rounded shadow-md hover:bg-white flex items-center gap-1.5 whitespace-nowrap z-10"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>

        {/* Quick Add Bar / Size Picker Trigger */}
        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
          {!showSizePicker ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSizePicker(true);
              }}
              className="w-full py-2 bg-white/95 hover:bg-white text-[#181818] text-xs font-semibold rounded shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              {addedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-2.5 rounded shadow-lg animate-in fade-in duration-150"
            >
              <p className="text-[10px] font-semibold text-[#666056] uppercase tracking-wider mb-1.5 text-center">
                Select Size:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {product.sizes.map((s) => {
                  const inStock = s.stock > 0;
                  return (
                    <button
                      key={s.size}
                      disabled={!inStock}
                      onClick={(e) => handleQuickAdd(s.size, product.colors[0]?.name || 'Standard', e)}
                      className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                        inStock
                          ? 'border-[#D5CBB9] text-[#181818] hover:bg-[#181818] hover:text-white'
                          : 'border-slate-200 text-slate-300 line-through cursor-not-allowed'
                      }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Slot */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata: Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#736E66] uppercase tracking-wider mb-1 font-medium">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 normal-case text-[#2C2B29]">
              <Star className="w-3 h-3 fill-[#D49E35] text-[#D49E35]" />
              <span className="font-semibold tabular-nums">{product.rating}</span>
              <span className="text-[#8C8578]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-[#181818] group-hover:text-[#3D4E41] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#736E66] mt-0.5 line-clamp-1">
            {product.fabricComposition}
          </p>
        </div>

        {/* Color Swatches and Price */}
        <div className="mt-3 pt-2.5 border-t border-[#F0ECE1] flex items-center justify-between">
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* INR Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-[#181818] tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-[#948D81] line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

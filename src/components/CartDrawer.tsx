import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    navigate,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 1499;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const shippingFee = isFreeShipping || cartSubtotal === 0 ? 0 : 99;
  const estimatedTaxes = Math.round((cartSubtotal - discountAmount) * 0.05); // 5% GST
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + estimatedTaxes);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const res = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
    setTimeout(() => setCouponFeedback(null), 3500);
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E8E2D6] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#E8E2D6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#3D4E41]" />
              <h2 className="font-editorial text-xl font-bold text-[#181818]">
                Shopping Bag
              </h2>
              <span className="text-xs text-[#888073] font-sans tabular-nums">
                ({cart.reduce((a, b) => a + b.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#524E47] hover:text-[#181818] rounded-full hover:bg-[#EFE9DF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Strip */}
          <div className="bg-[#F3EFE8] px-5 py-3 border-b border-[#E8E2D6]">
            <div className="flex items-center justify-between text-xs text-[#524E47] mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#3D4E41]" />
                {isFreeShipping ? (
                  <strong className="text-[#2F5233]">You have unlocked Free Shipping!</strong>
                ) : (
                  <span>
                    Add <strong className="text-[#181818]">₹{amountNeededForFree.toLocaleString('en-IN')}</strong> for Free Shipping
                  </span>
                )}
              </span>
              <span className="tabular-nums font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E0D8CB] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3D4E41] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#EFE9DF]">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-22 object-cover rounded bg-[#F3EFE8] border border-[#E0D8CB] shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-[#181818] line-clamp-1 pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#9E988D] hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#736E66] mt-0.5">
                        Size: <strong className="text-[#181818]">{item.size}</strong> · Color:{' '}
                        <strong className="text-[#181818]">{item.color}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#D5CBB9] rounded bg-white text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-[#524E47] hover:bg-[#F3EFE8]"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-[#524E47] hover:bg-[#F3EFE8]"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Price in INR */}
                      <span className="text-xs font-bold text-[#181818] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-[#C5BBAA] mx-auto" />
                <p className="text-sm font-semibold text-[#181818]">Your shopping bag is empty</p>
                <p className="text-xs text-[#736E66] max-w-xs mx-auto">
                  Explore our modern linen shirts, tailored trousers, and draped festive wear.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('shop');
                  }}
                  className="px-5 py-2.5 bg-[#181818] text-white text-xs uppercase tracking-wider rounded font-medium"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E8E2D6] space-y-4">
              {/* Coupon Form */}
              <div>
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-[#888073] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. STITCH10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs border border-[#D5CBB9] rounded uppercase placeholder:normal-case focus:outline-none focus:border-[#181818]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-3.5 py-2 bg-[#F3EFE8] border border-[#D5CBB9] text-xs font-semibold text-[#181818] rounded hover:bg-[#E2DACB] disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-[#EDF3EE] border border-[#C2DBC7] rounded text-xs text-[#28442F]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{appliedCoupon.code} Applied (-₹{discountAmount.toLocaleString('en-IN')})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-700 hover:underline text-[11px] font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] mt-1.5 font-medium ${
                      couponFeedback.success ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#524E47] pt-2 border-t border-[#F0ECE1]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#181818] tabular-nums">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#B85338]">
                    <span>Coupon Discount</span>
                    <span className="font-semibold tabular-nums">
                      -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="tabular-nums">
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-700 font-medium">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Taxes (GST 5%)</span>
                  <span className="tabular-nums">₹{estimatedTaxes.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#181818] pt-2 border-t border-[#E8E2D6]">
                  <span>Total Amount</span>
                  <span className="text-base tabular-nums">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleProceedCheckout}
                  className="w-full py-3.5 bg-[#181818] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2F2E2C] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 text-xs text-[#736E66] hover:text-[#181818] hover:underline text-center"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

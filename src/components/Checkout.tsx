import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Printer,
  Package,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { INDIAN_STATES } from '../data/initialProducts';
import { RazorpayModal } from './RazorpayModal';
import { Order } from '../types';

export const Checkout: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    clearCart,
    navigate,
    activeUser,
    lastPlacedOrder,
    setLastPlacedOrder,
  } = useShop();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields
  const [customerName, setCustomerName] = useState(activeUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(activeUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(activeUser?.phone || '+91 ');

  const defaultAddr = activeUser?.savedAddresses?.[0];
  const [street, setStreet] = useState(defaultAddr?.street || '');
  const [apartment, setApartment] = useState(defaultAddr?.apartment || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [state, setState] = useState(defaultAddr?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '');

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  // Razorpay Gateway Flow State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayServerOrderId, setRazorpayServerOrderId] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculations
  const FREE_SHIPPING_THRESHOLD = 1499;
  const isFreeStandard = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const standardShippingFee = isFreeStandard ? 0 : 99;
  const shippingFee = deliveryMethod === 'express' ? 149 : standardShippingFee;
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const taxes = Math.round(taxableAmount * 0.05); // 5% GST
  const finalTotal = taxableAmount + shippingFee + taxes;

  // Validation
  const validateStep1 = () => {
    if (!customerName.trim() || !customerEmail.includes('@') || customerPhone.length < 10) {
      setErrorMessage('Please provide a valid full name, email, and 10-digit Indian mobile number');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep2 = () => {
    if (!street.trim() || !city.trim() || !/^\d{6}$/.test(pincode.trim())) {
      setErrorMessage('Please provide a complete street address, city, and valid 6-digit Indian PIN code');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => (Math.min(5, prev + 1) as any));
  };

  // Place Order handler
  const handleInitiateOrder = async () => {
    setErrorMessage('');
    setIsPlacingOrder(true);

    if (paymentMethod === 'razorpay') {
      try {
        // Request backend server-side Razorpay order
        const res = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            currency: 'INR',
            notes: {
              customer_name: customerName,
              customer_email: customerEmail,
            },
          }),
        });

        const orderData = await res.json();
        if (res.ok && orderData.id) {
          setRazorpayServerOrderId(orderData.id);
          setShowRazorpayModal(true);
          setIsPlacingOrder(false);
        } else {
          setErrorMessage(orderData.error || 'Failed to initialize Razorpay payment');
          setIsPlacingOrder(false);
        }
      } catch {
        setErrorMessage('Could not connect to payment gateway service');
        setIsPlacingOrder(false);
      }
    } else {
      // Cash on Delivery
      await submitOrderToBackend('pending');
    }
  };

  // Submit final order payload to backend
  const submitOrderToBackend = async (
    paymentStatus: 'paid' | 'pending',
    paymentId?: string,
    razorpayOrderId?: string
  ) => {
    try {
      const payload = {
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        shippingAddress: {
          fullName: customerName,
          email: customerEmail,
          phone: customerPhone,
          street,
          apartment,
          city,
          state,
          pincode,
        },
        items: cart.map((item) => ({
          product: item.product,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        subtotal: cartSubtotal,
        discount: discountAmount,
        couponApplied: appliedCoupon?.code,
        deliveryMethod,
        shippingFee,
        taxes,
        total: finalTotal,
        paymentMethod,
        paymentStatus,
        razorpayPaymentId: paymentId,
        razorpayOrderId,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const savedOrder = await res.json();
      if (res.ok) {
        clearCart();
        setLastPlacedOrder(savedOrder);
      } else {
        setErrorMessage(savedOrder.error || 'Order placement failed');
      }
    } catch {
      setErrorMessage('Failed to record order. Please reach out to customer care.');
    } finally {
      setIsPlacingOrder(false);
      setShowRazorpayModal(false);
    }
  };

  const handleRazorpaySuccess = async (paymentId: string, orderId: string) => {
    await submitOrderToBackend('paid', paymentId, orderId);
  };

  // Confirmation view if order placed
  if (lastPlacedOrder) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white border border-[#E8E2D6] rounded-xl shadow-lg p-6 sm:p-10 space-y-8 animate-in zoom-in-95 duration-200">
          {/* Top Status */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
              Order Confirmed & Logged
            </span>
            <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818]">
              Thank You, {lastPlacedOrder.customer.name.split(' ')[0]}!
            </h1>
            <p className="text-xs text-[#666056] max-w-md mx-auto">
              Your garments are now registered in our atelier system. A confirmation receipt has been sent to{' '}
              <strong className="text-[#181818]">{lastPlacedOrder.customer.email}</strong>.
            </p>
          </div>

          {/* Key Order Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#F3EFE8] rounded-lg border border-[#E0D8CB] text-xs">
            <div>
              <span className="text-[#888073] block uppercase tracking-wider text-[10px]">Order Number</span>
              <strong className="text-sm font-mono font-bold text-[#181818]">{lastPlacedOrder.id}</strong>
            </div>
            <div>
              <span className="text-[#888073] block uppercase tracking-wider text-[10px]">Payment Status</span>
              <strong className="text-sm font-semibold capitalize text-[#2F5233]">
                {lastPlacedOrder.paymentMethod === 'razorpay' ? 'Razorpay Verified (Paid)' : 'Cash on Delivery (Pending)'}
              </strong>
            </div>
            <div>
              <span className="text-[#888073] block uppercase tracking-wider text-[10px]">Estimated Delivery</span>
              <strong className="text-sm font-semibold text-[#181818]">{lastPlacedOrder.estimatedDeliveryDate}</strong>
            </div>
          </div>

          {/* Itemized Order Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#181818] uppercase tracking-wider">
              Garments in This Order
            </h3>
            <div className="divide-y divide-[#EFE9DF] border-y border-[#E8E2D6]">
              {lastPlacedOrder.items.map((it, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.product.images[0]}
                      alt={it.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 object-cover rounded bg-[#F3EFE8] border border-[#DDD4C5]"
                    />
                    <div>
                      <p className="font-semibold text-[#181818]">{it.product.name}</p>
                      <p className="text-[11px] text-[#736E66]">
                        Size: {it.size} · Color: {it.color} · Qty: {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#181818] tabular-nums">
                    ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-[#524E47] pt-2 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold tabular-nums">₹{lastPlacedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {lastPlacedOrder.discount > 0 && (
                <div className="flex justify-between text-[#B85338]">
                  <span>Discount ({lastPlacedOrder.couponApplied}):</span>
                  <span className="font-semibold tabular-nums">-₹{lastPlacedOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({lastPlacedOrder.deliveryMethod}):</span>
                <span className="tabular-nums">{lastPlacedOrder.shippingFee === 0 ? 'FREE' : `₹${lastPlacedOrder.shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span className="tabular-nums">₹{lastPlacedOrder.taxes.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#181818] pt-2 border-t border-[#E8E2D6]">
                <span>Total Paid:</span>
                <span className="tabular-nums">₹{lastPlacedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D6] rounded-lg text-xs space-y-1">
            <span className="font-semibold text-[#181818] block uppercase tracking-wider text-[10px]">
              Shipping To:
            </span>
            <p className="font-semibold text-[#181818]">{lastPlacedOrder.shippingAddress.fullName}</p>
            <p className="text-[#524E47]">
              {lastPlacedOrder.shippingAddress.street}, {lastPlacedOrder.shippingAddress.apartment}
            </p>
            <p className="text-[#524E47]">
              {lastPlacedOrder.shippingAddress.city}, {lastPlacedOrder.shippingAddress.state} - {lastPlacedOrder.shippingAddress.pincode}
            </p>
            <p className="text-[#524E47]">Mobile: {lastPlacedOrder.shippingAddress.phone}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E8E2D6]">
            <button
              onClick={() => {
                navigate('tracking', { orderId: lastPlacedOrder.id, contact: lastPlacedOrder.customer.email });
                setLastPlacedOrder(null);
              }}
              className="flex-1 py-3 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2C2C2C] text-center"
            >
              Track Live Order Status &rarr;
            </button>

            <button
              onClick={() => window.print()}
              className="px-5 py-3 border border-[#D5CBB9] text-[#181818] text-xs font-semibold rounded hover:bg-[#F3EFE8] flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>

            <button
              onClick={() => {
                setLastPlacedOrder(null);
                navigate('home');
              }}
              className="px-5 py-3 border border-[#D5CBB9] text-[#524E47] text-xs font-semibold rounded hover:bg-[#F3EFE8] text-center"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no order confirmed
  if (cart.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <ShoppingBag className="w-12 h-12 text-[#C5BBAA] mx-auto mb-3" />
        <h2 className="text-xl font-editorial font-bold text-[#181818]">Your Bag is Empty</h2>
        <p className="text-xs text-[#666056] mt-1 mb-6">
          Add tailored linen shirts, trousers or drape dresses before checking out.
        </p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-3 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Return to Bag */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E8E2D6] mb-8">
        <button
          onClick={() => navigate('shop')}
          className="text-xs text-[#666056] hover:text-[#181818] flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
        <div className="flex items-center gap-1 text-xs text-[#3D4E41] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Encrypted Indian Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: 5 Checkout Steps */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6] text-xs">
            {[
              { num: 1, label: 'Customer' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Delivery' },
              { num: 4, label: 'Payment' },
              { num: 5, label: 'Review' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num as any)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  currentStep === s.num
                    ? 'text-[#181818] font-bold'
                    : currentStep > s.num
                    ? 'text-[#3D4E41]'
                    : 'text-[#A8A196]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    currentStep === s.num
                      ? 'bg-[#181818] text-white'
                      : currentStep > s.num
                      ? 'bg-[#3D4E41] text-white'
                      : 'bg-[#E8E2D6] text-[#736E66]'
                  }`}
                >
                  {currentStep > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Customer Details */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#181818]">
                  Step 1: Contact Information
                </h3>
                <span className="text-[11px] text-[#888073]">Guest or Registered</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#524E47] block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Aanya Sharma"
                    className="w-full px-3 py-2 text-xs border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#524E47] block mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. aanya@example.com"
                      className="w-full px-3 py-2 text-xs border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#524E47] block mb-1">Mobile Phone (+91) *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2C2C2C] mt-2"
              >
                Continue to Shipping Address &rarr;
              </button>
            </div>
          )}

          {/* STEP 2: Shipping Address */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] space-y-4">
              <h3 className="text-base font-semibold text-[#181818]">
                Step 2: Indian Shipping Address
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#524E47] block mb-1">Street Address, Colony / Area *</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 42, 100ft Road, Indiranagar"
                    className="w-full px-3 py-2 text-xs border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#524E47] block mb-1">Flat, House No., Apartment, Landmark</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="e.g. Flat 304, Green Palms"
                    className="w-full px-3 py-2 text-xs border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-[#524E47] block mb-1">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3 py-2 text-xs border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#524E47] block mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D5CBB9] rounded bg-white focus:outline-none focus:border-[#181818]"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#524E47] block mb-1">6-Digit PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 560038"
                      className="w-full px-3 py-2 text-xs border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-3 border border-[#D5CBB9] text-[#524E47] text-xs font-semibold rounded hover:bg-[#F3EFE8]"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2C2C2C]"
                >
                  Continue to Delivery Method &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Delivery Method */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] space-y-4">
              <h3 className="text-base font-semibold text-[#181818]">
                Step 3: Select Delivery Speed
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setDeliveryMethod('standard')}
                  className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryMethod === 'standard'
                      ? 'border-[#181818] bg-[#FAF8F5]'
                      : 'border-[#E8E2D6] hover:border-[#D5CBB9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="accent-[#3D4E41]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#181818] block">
                        Standard Express (Blue Dart / Delhivery)
                      </span>
                      <span className="text-[11px] text-[#666056]">
                        Delivered in 2–4 business days with live milestone tracking.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#181818] tabular-nums">
                    {standardShippingFee === 0 ? 'FREE' : `₹${standardShippingFee}`}
                  </span>
                </label>

                <label
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryMethod === 'express'
                      ? 'border-[#181818] bg-[#FAF8F5]'
                      : 'border-[#E8E2D6] hover:border-[#D5CBB9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="accent-[#3D4E41]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#181818] block">
                        Priority Air Courier (Next Day / 48 Hours)
                      </span>
                      <span className="text-[11px] text-[#666056]">
                        Dispatched within 6 hours. Guaranteed expedited transit.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#181818] tabular-nums">₹149</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-3 border border-[#D5CBB9] text-[#524E47] text-xs font-semibold rounded hover:bg-[#F3EFE8]"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2C2C2C]"
                >
                  Continue to Payment &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Method Selection */}
          {currentStep === 4 && (
            <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] space-y-4">
              <h3 className="text-base font-semibold text-[#181818]">
                Step 4: Choose Payment Method
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 border rounded-lg flex items-start justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#181818] bg-[#FAF8F5]'
                      : 'border-[#E8E2D6] hover:border-[#D5CBB9]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="mt-0.5 accent-[#3D4E41]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#181818] block">
                        Razorpay Online Gateway (Instant UPI / Cards / Net Banking)
                      </span>
                      <p className="text-[11px] text-[#666056] mt-0.5">
                        Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard, Net Banking. 100% encrypted in INR (₹).
                      </p>
                      <span className="inline-block mt-2 text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        Recommended · Instant Confirmation
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#3D4E41] shrink-0" />
                </label>

                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border rounded-lg flex items-start justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#181818] bg-[#FAF8F5]'
                      : 'border-[#E8E2D6] hover:border-[#D5CBB9]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-0.5 accent-[#3D4E41]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#181818] block">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-[#666056] mt-0.5">
                        Pay in cash or via courier UPI QR upon doorstep delivery.
                      </p>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-[#666056] shrink-0" />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-3 border border-[#D5CBB9] text-[#524E47] text-xs font-semibold rounded hover:bg-[#F3EFE8]"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2C2C2C]"
                >
                  Review Order Details &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Final Review & Order Placement */}
          {currentStep === 5 && (
            <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] space-y-6">
              <h3 className="text-base font-semibold text-[#181818]">
                Step 5: Final Order Review & Placement
              </h3>

              {/* Review summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D6] rounded">
                  <span className="text-[#888073] block uppercase tracking-wider text-[10px]">Contact</span>
                  <p className="font-semibold text-[#181818] mt-0.5">{customerName}</p>
                  <p className="text-[#524E47]">{customerEmail}</p>
                  <p className="text-[#524E47]">{customerPhone}</p>
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D6] rounded">
                  <span className="text-[#888073] block uppercase tracking-wider text-[10px]">Delivery To</span>
                  <p className="font-semibold text-[#181818] mt-0.5">{street}, {apartment}</p>
                  <p className="text-[#524E47]">{city}, {state} - {pincode}</p>
                  <p className="text-[#3D4E41] font-medium capitalize mt-1">Method: {deliveryMethod} shipping</p>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D6] rounded text-xs flex items-center justify-between">
                <div>
                  <span className="text-[#888073] block uppercase tracking-wider text-[10px]">Payment Method</span>
                  <p className="font-semibold text-[#181818]">
                    {paymentMethod === 'razorpay' ? 'Razorpay Online (UPI/Cards/Netbanking)' : 'Cash on Delivery (COD)'}
                  </p>
                </div>
                <span className="font-mono text-base font-bold text-[#181818] tabular-nums">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-3.5 border border-[#D5CBB9] text-[#524E47] text-xs font-semibold rounded hover:bg-[#F3EFE8]"
                >
                  Back
                </button>
                <button
                  onClick={handleInitiateOrder}
                  disabled={isPlacingOrder}
                  className="flex-1 py-3.5 bg-[#181818] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#2C2C2C] disabled:bg-slate-400 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : paymentMethod === 'razorpay' ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Proceed to Razorpay (₹{finalTotal.toLocaleString('en-IN')})</span>
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4" />
                      <span>Confirm Cash on Delivery Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] shadow-sm sticky top-28 space-y-4">
            <h3 className="font-editorial text-lg font-bold text-[#181818] pb-3 border-b border-[#E8E2D6]">
              Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
            </h3>

            {/* Cart preview */}
            <div className="max-h-60 overflow-y-auto divide-y divide-[#EFE9DF] pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-12 object-cover rounded bg-[#F3EFE8] border border-[#DDD4C5]"
                    />
                    <div>
                      <p className="font-semibold text-[#181818] line-clamp-1">{item.product.name}</p>
                      <p className="text-[11px] text-[#736E66]">
                        {item.size} · {item.color} · Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#181818] tabular-nums">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-[#524E47] pt-3 border-t border-[#E8E2D6]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#181818] tabular-nums">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#B85338]">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-semibold tabular-nums">
                    -₹{discountAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({deliveryMethod})</span>
                <span className="tabular-nums">
                  {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxes (GST 5%)</span>
                <span className="tabular-nums">₹{taxes.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#181818] pt-3 border-t border-[#E8E2D6]">
                <span>Order Total</span>
                <span className="text-lg tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded border border-[#E8E2D6] text-[11px] text-[#666056] space-y-1">
              <p className="font-semibold text-[#181818]">StitchwellLane Guarantee:</p>
              <p>• Complimentary 7-day doorstep size exchange or return</p>
              <p>• All transactions verified in Indian Rupees (INR ₹)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Gateway Modal */}
      {showRazorpayModal && (
        <RazorpayModal
          orderAmount={finalTotal}
          razorpayOrderId={razorpayServerOrderId}
          customerName={customerName}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          onPaymentSuccess={handleRazorpaySuccess}
          onPaymentDismiss={() => setShowRazorpayModal(false)}
        />
      )}
    </div>
  );
};

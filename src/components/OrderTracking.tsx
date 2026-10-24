import React, { useState, useEffect } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const OrderTracking: React.FC = () => {
  const { routeParams } = useShop();
  const [orderId, setOrderId] = useState(routeParams.orderId || 'SWL-2026-98124');
  const [contact, setContact] = useState(routeParams.contact || 'kabir.s@example.com');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrack = async (targetId: string, targetContact: string) => {
    if (!targetId || !targetContact) return;
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: targetId, contact: targetContact }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setOrder(data);
      } else {
        setError(data.error || 'No matching order found');
        setOrder(null);
      }
    } catch {
      setError('Could not retrieve order details. Please check network.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeParams.orderId && routeParams.contact) {
      fetchTrack(routeParams.orderId, routeParams.contact);
    } else {
      // Preload the demo order so user can see it in action immediately
      fetchTrack('SWL-2026-98124', 'kabir.s@example.com');
    }
  }, [routeParams.orderId, routeParams.contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrack(orderId, contact);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
          Live Logistics Status
        </span>
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818] mt-1">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-[#666056] mt-2">
          Enter your unique StitchwellLane Order ID (e.g. SWL-2026-98124) and the email or mobile phone used during checkout.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white p-6 rounded-xl border border-[#E8E2D6] shadow-sm max-w-2xl mx-auto mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#524E47] block mb-1">
                Order ID *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="SWL-2026-XXXXX"
                className="w-full px-3.5 py-2.5 text-xs border border-[#D5CBB9] rounded font-mono uppercase focus:outline-none focus:border-[#181818]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#524E47] block mb-1">
                Email or Mobile Number *
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="email@example.com or phone"
                className="w-full px-3.5 py-2.5 text-xs border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2C2C2C] disabled:bg-slate-400 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {loading ? (
              <span>Locating Shipment...</span>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Track Shipment</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Active Order Details & Timeline */}
      {order && (
        <div className="bg-white rounded-xl border border-[#E8E2D6] shadow-sm overflow-hidden animate-in fade-in duration-200">
          {/* Header Summary */}
          <div className="p-6 bg-[#F3EFE8] border-b border-[#E0D8CB] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#736E66]">
                Shipment Status
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="font-mono text-xl font-bold text-[#181818]">{order.id}</h2>
                <span className="px-2.5 py-0.5 bg-[#3D4E41] text-white text-xs rounded font-medium">
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-[#524E47] mt-1">
                Carrier: <strong>{order.courierName || 'Blue Dart Express'}</strong> · AWB Tracking:{' '}
                <strong className="font-mono">{order.trackingNumber || 'BD83910283'}</strong>
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#736E66]">
                Estimated Delivery
              </span>
              <p className="text-base font-bold text-[#181818] mt-0.5">
                {order.estimatedDeliveryDate}
              </p>
              <span className="text-[11px] text-[#2F5233] font-medium">
                {order.paymentMethod === 'razorpay' ? 'Prepaid (Razorpay)' : 'Cash on Delivery (₹' + order.total.toLocaleString('en-IN') + ')'}
              </span>
            </div>
          </div>

          {/* 6-Stage Interactive Stepper */}
          <div className="p-6 sm:p-10 border-b border-[#E8E2D6]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#181818] mb-8">
              Shipment Milestones
            </h3>

            <div className="relative">
              {/* Stepper Grid */}
              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-6 gap-2 relative">
                {order.trackingTimeline.map((step, idx) => {
                  return (
                    <div key={idx} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center relative">
                      {/* Circle Indicator */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                          step.completed
                            ? 'bg-[#3D4E41] text-white shadow-xs'
                            : 'bg-[#E8E2D6] text-[#888073]'
                        }`}
                      >
                        {step.completed ? '✓' : idx + 1}
                      </div>

                      {/* Text */}
                      <div className="ml-4 sm:ml-0 sm:mt-3">
                        <h4
                          className={`text-xs font-bold ${
                            step.completed ? 'text-[#181818]' : 'text-[#888073]'
                          }`}
                        >
                          {step.status}
                        </h4>
                        <p className="text-[10px] text-[#666056] mt-0.5">
                          {step.date}
                        </p>
                        <p className="text-[10px] text-[#888073] mt-1 leading-snug hidden sm:block max-w-[120px]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details Bottom Row */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF8F5] text-xs">
            {/* Shipping Address */}
            <div className="p-4 bg-white rounded-lg border border-[#E8E2D6] space-y-1.5">
              <span className="font-semibold text-[#181818] block uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#3D4E41]" />
                Destination Address
              </span>
              <p className="font-semibold text-[#181818]">{order.shippingAddress.fullName}</p>
              <p className="text-[#524E47]">{order.shippingAddress.street}, {order.shippingAddress.apartment}</p>
              <p className="text-[#524E47]">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="text-[#736E66]">Contact: {order.shippingAddress.phone}</p>
            </div>

            {/* Package Contents */}
            <div className="p-4 bg-white rounded-lg border border-[#E8E2D6] space-y-2">
              <span className="font-semibold text-[#181818] block uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#3D4E41]" />
                Garments ({order.items.length})
              </span>
              <div className="divide-y divide-[#F0ECE1] max-h-36 overflow-y-auto pr-1">
                {order.items.map((it, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between items-center text-[11px]">
                    <span className="truncate pr-2 font-medium text-[#181818]">
                      {it.quantity}x {it.product.name} ({it.size})
                    </span>
                    <span className="font-mono text-[#524E47] tabular-nums">
                      ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#F0ECE1] flex justify-between font-bold text-[#181818]">
                <span>Total Value:</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

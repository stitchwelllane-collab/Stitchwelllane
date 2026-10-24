import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
  ShoppingBag,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, ShippingAddress } from '../types';
import { INDIAN_STATES } from '../data/initialProducts';

export const AccountView: React.FC = () => {
  const {
    activeUser,
    setActiveUser,
    wishlist,
    toggleWishlist,
    products,
    addToCart,
    navigate,
    routeParams,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>(
    (routeParams.tab as any) || 'orders'
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Maharashtra');
  const [newPincode, setNewPincode] = useState('');

  // Return modal state
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('Need a different size');
  const [returnSuccess, setReturnSuccess] = useState(false);

  useEffect(() => {
    if (routeParams.tab) {
      setActiveTab(routeParams.tab);
    }
  }, [routeParams.tab]);

  // Fetch orders for customer
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch(`/api/orders?email=${encodeURIComponent(activeUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      //
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeUser.email]);

  // Add Address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode) return;

    const newAddr: ShippingAddress = {
      fullName: activeUser.name,
      email: activeUser.email,
      phone: activeUser.phone,
      street: newStreet,
      apartment: newApartment,
      city: newCity,
      state: newState,
      pincode: newPincode,
      isDefault: activeUser.savedAddresses.length === 0,
    };

    setActiveUser((prev) => ({
      ...prev,
      savedAddresses: [...prev.savedAddresses, newAddr],
    }));

    setShowAddressModal(false);
    setNewStreet('');
    setNewApartment('');
    setNewCity('');
    setNewPincode('');
  };

  const handleDeleteAddress = (index: number) => {
    setActiveUser((prev) => ({
      ...prev,
      savedAddresses: prev.savedAddresses.filter((_, i) => i !== index),
    }));
  };

  // Submit Return request
  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId) return;
    try {
      const res = await fetch(`/api/orders/${returnOrderId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: returnReason }),
      });
      if (res.ok) {
        setReturnSuccess(true);
        await fetchOrders();
        setTimeout(() => {
          setReturnSuccess(false);
          setReturnOrderId(null);
        }, 3000);
      }
    } catch {
      //
    }
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-[#E8E2D6] mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
            Member Atelier
          </span>
          <h1 className="text-3xl font-editorial font-bold text-[#181818] mt-1">
            Welcome, {activeUser.name}
          </h1>
          <p className="text-xs text-[#666056] mt-0.5">{activeUser.email} · {activeUser.phone}</p>
        </div>

        <button
          onClick={() => navigate('home')}
          className="px-4 py-2 bg-white border border-[#D5CBB9] text-xs font-semibold text-[#181818] rounded hover:bg-[#F3EFE8] self-start sm:self-auto"
        >
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-1 bg-white p-3 rounded-lg border border-[#E8E2D6] h-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 rounded text-xs font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#181818] text-white'
                : 'text-[#524E47] hover:bg-[#F3EFE8] hover:text-[#181818]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </div>
            <span className="tabular-nums font-mono text-[11px]">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between p-3 rounded text-xs font-semibold transition-colors ${
              activeTab === 'wishlist'
                ? 'bg-[#181818] text-white'
                : 'text-[#524E47] hover:bg-[#F3EFE8] hover:text-[#181818]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>My Wishlist</span>
            </div>
            <span className="tabular-nums font-mono text-[11px]">{wishlist.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-2 p-3 rounded text-xs font-semibold transition-colors ${
              activeTab === 'addresses'
                ? 'bg-[#181818] text-white'
                : 'text-[#524E47] hover:bg-[#F3EFE8] hover:text-[#181818]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2 p-3 rounded text-xs font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#181818] text-white'
                : 'text-[#524E47] hover:bg-[#F3EFE8] hover:text-[#181818]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          <div className="pt-3 border-t border-[#F0ECE1]">
            <button
              onClick={() => {
                setActiveUser((prev) => ({
                  ...prev,
                  name: 'Guest Shopper',
                  email: 'guest@stitchwelllane.com',
                }));
              }}
              className="w-full flex items-center gap-2 p-2.5 text-xs text-[#888073] hover:text-[#181818] hover:bg-[#F3EFE8] rounded"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Guest Mode</span>
            </button>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="lg:col-span-3">
          {/* TAB 1: Order History */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
                <h3 className="font-editorial text-xl font-bold text-[#181818]">
                  Past Purchases & Tracked Orders
                </h3>
                <span className="text-xs text-[#888073]">Showing {orders.length} orders</span>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-[#666056]">Loading orders...</div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white p-5 rounded-lg border border-[#E8E2D6] shadow-xs space-y-4"
                    >
                      {/* Top Order Strip */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0ECE1] gap-2 text-xs">
                        <div>
                          <span className="text-[#888073] block text-[10px] uppercase tracking-wider">
                            Order ID
                          </span>
                          <span className="font-mono font-bold text-sm text-[#181818]">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-[#888073] block text-[10px] uppercase tracking-wider">
                            Placed On
                          </span>
                          <span className="font-medium text-[#181818]">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#888073] block text-[10px] uppercase tracking-wider">
                            Total
                          </span>
                          <span className="font-bold text-[#181818] tabular-nums">
                            ₹{order.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-[#F3EFE8] text-[#181818]'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-[#F0ECE1]">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={it.product.images[0]}
                                alt={it.product.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-14 object-cover rounded bg-[#F3EFE8] border border-[#DDD4C5]"
                              />
                              <div>
                                <h4 className="font-semibold text-[#181818]">{it.product.name}</h4>
                                <p className="text-[11px] text-[#736E66]">
                                  Size: {it.size} · Color: {it.color} · Qty: {it.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold tabular-nums text-[#181818]">
                              ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="text-[#666056] text-[11px]">
                          Delivery partner: <strong>{order.courierName || 'Blue Dart Express'}</strong>
                          {order.trackingNumber && ` (AWB: ${order.trackingNumber})`}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate('tracking', {
                                orderId: order.id,
                                contact: order.customer.email,
                              })
                            }
                            className="px-3 py-1.5 bg-[#181818] text-white text-xs rounded hover:bg-[#2C2C2C] flex items-center gap-1"
                          >
                            <span>Track Package</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          {!order.returnRequested ? (
                            <button
                              onClick={() => setReturnOrderId(order.id)}
                              className="px-3 py-1.5 border border-[#D5CBB9] text-[#524E47] hover:text-[#181818] hover:bg-[#F3EFE8] text-xs rounded flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Exchange / Return</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                              Return Requested ({order.returnReason})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 text-center rounded-lg border border-[#E8E2D6] space-y-3">
                  <Package className="w-10 h-10 text-[#C5BBAA] mx-auto" />
                  <h4 className="text-base font-semibold text-[#181818]">No orders found</h4>
                  <p className="text-xs text-[#666056]">
                    You haven’t placed an order under this email yet.
                  </p>
                  <button
                    onClick={() => navigate('shop')}
                    className="px-5 py-2.5 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
                <h3 className="font-editorial text-xl font-bold text-[#181818]">
                  Saved Wishlist ({wishlistProducts.length})
                </h3>
              </div>

              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-lg border border-[#E8E2D6] overflow-hidden flex flex-col justify-between"
                    >
                      <div className="aspect-[3/4] bg-[#F3EFE8] relative overflow-hidden">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-rose-600 hover:scale-110 shadow-xs"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <span className="text-[10px] text-[#888073] uppercase tracking-wider block">
                            {p.category}
                          </span>
                          <h4 className="text-xs font-semibold text-[#181818] line-clamp-1">{p.name}</h4>
                          <span className="text-sm font-bold text-[#181818] tabular-nums mt-1 block">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            addToCart(p, p.sizes[0]?.size || 'M', p.colors[0]?.name || 'Standard', 1);
                          }}
                          className="w-full py-2 bg-[#181818] text-white text-xs font-semibold rounded hover:bg-[#2C2C2C] flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Bag</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 text-center rounded-lg border border-[#E8E2D6] space-y-3">
                  <Heart className="w-10 h-10 text-[#C5BBAA] mx-auto" />
                  <h4 className="text-base font-semibold text-[#181818]">Your wishlist is empty</h4>
                  <p className="text-xs text-[#666056]">
                    Tap the heart icon on any garment to save it here for later.
                  </p>
                  <button
                    onClick={() => navigate('shop')}
                    className="px-5 py-2.5 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded"
                  >
                    Browse Collections
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
                <h3 className="font-editorial text-xl font-bold text-[#181818]">
                  Saved Shipping Addresses
                </h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-3.5 py-2 bg-[#181818] text-white text-xs font-semibold rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeUser.savedAddresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-lg border border-[#E8E2D6] flex flex-col justify-between space-y-3 relative"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-[#181818]">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-[#EDF3EE] text-[#28442F] px-2 py-0.5 rounded font-medium">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#524E47] leading-relaxed">
                        {addr.street}, {addr.apartment && `${addr.apartment}, `}
                        <br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs text-[#736E66] mt-2">Mobile: {addr.phone}</p>
                    </div>

                    <div className="flex items-center justify-end pt-3 border-t border-[#F0ECE1]">
                      <button
                        onClick={() => handleDeleteAddress(idx)}
                        className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] space-y-6 max-w-xl">
              <h3 className="font-editorial text-xl font-bold text-[#181818]">
                Personal Profile & Contact
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[#524E47] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={activeUser.name}
                    onChange={(e) => setActiveUser((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
                  />
                </div>

                <div>
                  <label className="text-[#524E47] block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={activeUser.email}
                    onChange={(e) => setActiveUser((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
                  />
                </div>

                <div>
                  <label className="text-[#524E47] block mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={activeUser.phone}
                    onChange={(e) => setActiveUser((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => alert('Profile details updated successfully.')}
                    className="px-5 py-2.5 bg-[#181818] text-white text-xs font-semibold rounded hover:bg-[#2C2C2C]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#E8E2D6] w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D6]">
              <h3 className="font-editorial text-lg font-bold text-[#181818]">Add Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-[#181818]">✕</button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 text-[#524E47]">Street Address *</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Street and Area"
                  className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-[#524E47]">Apartment, Flat No.</label>
                <input
                  type="text"
                  value={newApartment}
                  onChange={(e) => setNewApartment(e.target.value)}
                  placeholder="e.g. Flat 101"
                  className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-[#524E47]">City *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[#524E47]">State *</label>
                  <select
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[#524E47]">6-Digit PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="PIN code"
                  className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#181818] text-white text-xs font-semibold rounded uppercase tracking-wider mt-2"
              >
                Save Delivery Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {returnOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#E8E2D6] w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D6]">
              <h3 className="font-editorial text-lg font-bold text-[#181818]">
                Request 7-Day Doorstep Return / Exchange
              </h3>
              <button onClick={() => setReturnOrderId(null)} className="text-[#181818]">✕</button>
            </div>

            {returnSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200 text-center space-y-1">
                <p className="font-semibold">Return request approved!</p>
                <p>Our courier partner will arrange doorstep pickup within 2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReturn} className="space-y-3 text-xs">
                <p className="text-[#666056]">
                  Order: <strong className="text-[#181818]">{returnOrderId}</strong>
                </p>

                <div>
                  <label className="block mb-1 text-[#524E47]">Reason for Return or Exchange</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  >
                    <option value="Need a different size">Need a different size</option>
                    <option value="Fit is too loose / tight">Fit is too loose / tight</option>
                    <option value="Fabric / color differed from screen">Fabric / color differed from expectations</option>
                    <option value="Defective or damaged in transit">Defective or damaged in transit</option>
                  </select>
                </div>

                <p className="text-[11px] text-[#888073]">
                  Please ensure garments are unworn with original tags attached in the provided cloth dust bag.
                </p>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#181818] text-white text-xs font-semibold rounded uppercase tracking-wider"
                >
                  Confirm Return Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

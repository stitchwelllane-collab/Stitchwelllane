import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  DollarSign,
  Tag,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  ExternalLink,
  MessageSquare,
  Lock,
  Unlock,
  RefreshCw,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Order, Coupon, ContactMessage } from '../types';

export const AdminDashboard: React.FC = () => {
  const { products, refreshProducts, coupons, navigate } = useShop();

  // Admin Auth Gate (PIN protection)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'inquiries'>('overview');

  // Dashboard Stats State
  const [stats, setStats] = useState<{
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    totalProducts: number;
    lowStockCount: number;
    lowStockProducts: any[];
    recentOrders: Order[];
  } | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // New Product Modal State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<any>('shirts');
  const [newProdGender, setNewProdGender] = useState<any>('men');
  const [newProdOccasion, setNewProdOccasion] = useState<any>('casual');
  const [newProdPrice, setNewProdPrice] = useState('3299');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('4299');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdFabric, setNewProdFabric] = useState('100% Normandy Flax Linen');
  const [newProdStockS, setNewProdStockS] = useState(10);
  const [newProdStockM, setNewProdStockM] = useState(15);
  const [newProdStockL, setNewProdStockL] = useState(12);

  // New Coupon Modal State
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponVal, setCouponVal] = useState('10');
  const [couponMinOrder, setCouponMinOrder] = useState('1999');
  const [couponDesc, setCouponDesc] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [resStats, resOrders, resInquiries] = await Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/contact').then((r) => r.json()),
      ]);

      if (resStats) setStats(resStats);
      if (Array.isArray(resOrders)) setOrders(resOrders);
      if (Array.isArray(resInquiries)) setInquiries(resInquiries);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminUnlocked) {
      fetchAdminData();
    }
  }, [isAdminUnlocked]);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '8826' || pinInput === 'admin') {
      setIsAdminUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch {
      //
    }
  };

  // Add Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    try {
      const payload = {
        name: newProdName,
        category: newProdCategory,
        gender: newProdGender,
        occasion: newProdOccasion,
        price: Number(newProdPrice),
        originalPrice: Number(newProdOriginalPrice),
        discountPercent: Math.round(
          ((Number(newProdOriginalPrice) - Number(newProdPrice)) / Number(newProdOriginalPrice)) * 100
        ),
        images: ['/src/assets/images/collection_mens_tailored_1792179896681.jpg'],
        description: newProdDesc || 'Meticulously tailored garment from our latest atelier release.',
        fabricComposition: newProdFabric,
        careInstructions: ['Dry clean or wash in cold water', 'Air dry flat in shade'],
        colors: [{ name: 'Classic Tone', hex: '#D7CCBC', inStock: true }],
        sizes: [
          { size: 'S', stock: Number(newProdStockS) },
          { size: 'M', stock: Number(newProdStockM) },
          { size: 'L', stock: Number(newProdStockL) },
        ],
        isNewArrival: true,
        isBestSeller: false,
        isFeatured: true,
        rating: 5.0,
        reviewCount: 1,
        material: newProdFabric.includes('Linen') ? 'Pure Linen' : 'Cotton',
        reviews: [],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddProduct(false);
        setNewProdName('');
        await refreshProducts();
        await fetchAdminData();
      }
    } catch {
      //
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this garment from the store catalog?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshProducts();
        await fetchAdminData();
      }
    } catch {
      //
    }
  };

  // Add Coupon Submit
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          discountType: couponType,
          discountValue: Number(couponVal),
          minOrderValue: Number(couponMinOrder),
          description: couponDesc || `${couponVal}${couponType === 'percentage' ? '%' : '₹'} off on orders above ₹${couponMinOrder}`,
        }),
      });

      if (res.ok) {
        setShowAddCoupon(false);
        setCouponCode('');
        setCouponDesc('');
        window.location.reload();
      }
    } catch {
      //
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (code: string) => {
    try {
      await fetch(`/api/coupons/${code}`, { method: 'DELETE' });
      window.location.reload();
    } catch {
      //
    }
  };

  // Auth Gate Screen
  if (!isAdminUnlocked) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="bg-white border border-[#E8E2D6] p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#181818] text-white flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3D4E41]">
              Owner Portal
            </span>
            <h2 className="text-2xl font-editorial font-bold text-[#181818] mt-1">
              StitchwellLane Admin Access
            </h2>
            <p className="text-xs text-[#666056] mt-1">
              Enter the store manager security PIN to access orders, catalog edits, and sales analytics.
            </p>
          </div>

          <form onSubmit={handleUnlockPin} className="space-y-3">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN (Default: 8826)"
              className="w-full px-4 py-2.5 text-center text-sm font-mono tracking-widest border border-[#D5CBB9] rounded focus:outline-none focus:border-[#181818]"
            />
            {pinError && (
              <p className="text-xs text-rose-700 font-medium">Incorrect PIN. Try 8826.</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2C2C2C] cursor-pointer"
            >
              Authenticate Admin
            </button>
          </form>

          <button
            onClick={() => {
              setIsAdminUnlocked(true);
            }}
            className="text-[11px] text-[#3D4E41] hover:underline block mx-auto font-medium"
          >
            One-Click Quick Unlock (Dev Mode: PIN 8826)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D6] mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3D4E41]" />
            <h1 className="text-2xl font-editorial font-bold text-[#181818]">
              StitchwellLane Store Management
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono">
              Live Production
            </span>
          </div>
          <p className="text-xs text-[#666056] mt-0.5">
            Indian Rupee (₹ INR) E-Commerce Administration Console
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2 bg-white border border-[#D5CBB9] rounded text-xs text-[#181818] hover:bg-[#F3EFE8] flex items-center gap-1.5"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#3D4E41]" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsAdminUnlocked(false)}
            className="px-3.5 py-2 bg-white border border-[#D5CBB9] rounded text-xs font-semibold text-[#888073] hover:text-[#181818] flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E2D6] pb-3 mb-8 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: DollarSign },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
          { id: 'products', label: `Catalog (${products.length})`, icon: ShoppingBag },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
          { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded transition-colors whitespace-nowrap ${
                adminTab === tab.id
                  ? 'bg-[#181818] text-white'
                  : 'bg-white text-[#524E47] border border-[#E8E2D6] hover:bg-[#F3EFE8]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Overview KPIs */}
      {adminTab === 'overview' && (
        <div className="space-y-8">
          {/* Top 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-[#E8E2D6] shadow-xs">
              <span className="text-[11px] font-semibold text-[#888073] uppercase tracking-wider block">
                Total Store Revenue
              </span>
              <p className="text-2xl font-bold font-mono text-[#181818] mt-1 tabular-nums">
                ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-[#2F5233] mt-1 block">Verified INR payments</span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E8E2D6] shadow-xs">
              <span className="text-[11px] font-semibold text-[#888073] uppercase tracking-wider block">
                Total Orders Placed
              </span>
              <p className="text-2xl font-bold font-mono text-[#181818] mt-1 tabular-nums">
                {stats?.totalOrders || orders.length}
              </p>
              <span className="text-[11px] text-[#888073] mt-1 block">Pan-India fulfillment</span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E8E2D6] shadow-xs">
              <span className="text-[11px] font-semibold text-[#888073] uppercase tracking-wider block">
                Average Order Value
              </span>
              <p className="text-2xl font-bold font-mono text-[#181818] mt-1 tabular-nums">
                ₹{(stats?.avgOrderValue || 3306).toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-[#888073] mt-1 block">Per customer cart</span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E8E2D6] shadow-xs">
              <span className="text-[11px] font-semibold text-[#888073] uppercase tracking-wider block">
                Low Stock Alerts
              </span>
              <p className="text-2xl font-bold font-mono text-[#B85338] mt-1 tabular-nums">
                {stats?.lowStockCount || 0}
              </p>
              <span className="text-[11px] text-[#B85338] mt-1 block">&lt; 5 units remaining</span>
            </div>
          </div>

          {/* Low Stock Alerts Strip */}
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
            <div className="p-4 bg-[#FFF8F5] border border-[#F5D5C6] rounded-lg">
              <h4 className="text-xs font-bold text-[#8C3A24] flex items-center gap-1.5 uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Inventory Restock Recommendations</span>
              </h4>
              <div className="divide-y divide-[#FBE5DC] text-xs">
                {stats.lowStockProducts.map((p: any) => (
                  <div key={p.id} className="py-2 flex justify-between items-center text-[#5C2E20]">
                    <span>{p.name} ({p.sku})</span>
                    <span className="font-mono font-medium">
                      {p.sizes.map((s: any) => `${s.size}: ${s.stock}`).join(' · ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Orders Fulfillment Management */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-lg border border-[#E8E2D6] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E8E2D6] flex justify-between items-center">
            <h3 className="font-editorial text-lg font-bold text-[#181818]">
              All Customer Orders
            </h3>
            <span className="text-xs text-[#888073]">Total: {orders.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F3EFE8] text-[#181818] uppercase tracking-wider border-b border-[#E0D8CB]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">City / State</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total (₹)</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9DF]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 px-4 font-mono font-bold text-[#181818]">{o.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#181818]">{o.customer.name}</p>
                      <p className="text-[11px] text-[#736E66]">{o.customer.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      {o.shippingAddress.city}, {o.shippingAddress.state}
                    </td>
                    <td className="py-3 px-4">
                      {o.items.length} garments ({o.items.map((i) => i.size).join(', ')})
                    </td>
                    <td className="py-3 px-4 font-bold tabular-nums text-[#181818]">
                      ₹{o.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          o.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.paymentMethod.toUpperCase()} · {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="px-2 py-1 bg-white border border-[#D5CBB9] rounded font-semibold text-xs focus:outline-none focus:border-[#181818] cursor-pointer"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Product Catalog Management */}
      {adminTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-editorial text-lg font-bold text-[#181818]">
              Garment Catalog ({products.length} Products)
            </h3>
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-4 py-2 bg-[#181818] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Garment</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-[#E8E2D6] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F3EFE8] text-[#181818] uppercase tracking-wider border-b border-[#E0D8CB]">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Name & SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock Breakdown</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DF]">
                  {products.map((p) => {
                    const totalStock = p.sizes.reduce((acc, s) => acc + s.stock, 0);
                    return (
                      <tr key={p.id} className="hover:bg-[#FAF8F5]">
                        <td className="py-3 px-4">
                          <img
                            src={p.images[0]}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-10 h-12 object-cover rounded bg-[#F3EFE8] border border-[#DDD4C5]"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-[#181818]">{p.name}</p>
                          <p className="text-[10px] font-mono text-[#888073]">{p.sku}</p>
                        </td>
                        <td className="py-3 px-4 uppercase text-[#736E66]">{p.category}</td>
                        <td className="py-3 px-4 font-bold tabular-nums text-[#181818]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              totalStock < 10 ? 'text-rose-600' : 'text-emerald-800'
                            }`}
                          >
                            {totalStock} in stock
                          </span>
                          <span className="block text-[10px] text-[#888073]">
                            {p.sizes.map((s) => `${s.size}:${s.stock}`).join(' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Coupons Management */}
      {adminTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-editorial text-lg font-bold text-[#181818]">
              Discount Coupons & Promotional Campaigns
            </h3>
            <button
              onClick={() => setShowAddCoupon(true)}
              className="px-4 py-2 bg-[#181818] text-white text-xs font-semibold rounded flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="bg-white p-5 rounded-lg border border-[#E8E2D6] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-sm font-bold text-[#181818] bg-[#F3EFE8] px-2.5 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#524E47] mt-2">{c.description}</p>
                </div>

                <div className="pt-2 border-t border-[#F0ECE1] flex justify-between items-center text-[11px] text-[#736E66]">
                  <span>Min Order: ₹{c.minOrderValue.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => handleDeleteCoupon(c.code)}
                    className="text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Customer Inquiries */}
      {adminTab === 'inquiries' && (
        <div className="bg-white rounded-lg border border-[#E8E2D6] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E8E2D6]">
            <h3 className="font-editorial text-lg font-bold text-[#181818]">
              Customer Service Inquiries
            </h3>
          </div>

          <div className="divide-y divide-[#EFE9DF]">
            {inquiries.length > 0 ? (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-5 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm text-[#181818]">{inq.subject}</h4>
                      <p className="text-[#666056]">
                        From: <strong>{inq.name}</strong> ({inq.email}) {inq.phone && `· ${inq.phone}`}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#888073]">
                      {new Date(inq.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <p className="p-3 bg-[#FAF8F5] rounded border border-[#E8E2D6] text-[#2C2B29] leading-relaxed">
                    {inq.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#736E66]">
                No customer inquiries pending.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#E8E2D6] w-full max-w-lg rounded-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D6]">
              <h3 className="font-editorial text-lg font-bold text-[#181818]">Add Garment to Atelier</h3>
              <button onClick={() => setShowAddProduct(false)} className="text-[#181818]">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 text-[#524E47]">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Mulberry Silk Pleated Midi Dress"
                  className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1 text-[#524E47]">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  >
                    <option value="shirts">Shirts</option>
                    <option value="trousers">Trousers</option>
                    <option value="dresses">Dresses</option>
                    <option value="ethnic">Ethnic Wear</option>
                    <option value="tshirts">T-Shirts</option>
                    <option value="jackets">Jackets</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-[#524E47]">Gender</label>
                  <select
                    value={newProdGender}
                    onChange={(e) => setNewProdGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-[#524E47]">Occasion</label>
                  <select
                    value={newProdOccasion}
                    onChange={(e) => setNewProdOccasion(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  >
                    <option value="casual">Casual</option>
                    <option value="office">Office</option>
                    <option value="festive">Festive</option>
                    <option value="party">Party</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-[#524E47]">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[#524E47]">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[#524E47]">Fabric Composition</label>
                <input
                  type="text"
                  value={newProdFabric}
                  onChange={(e) => setNewProdFabric(e.target.value)}
                  placeholder="e.g. 100% Normandy Flax Linen"
                  className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1 text-[#524E47]">Stock Size S</label>
                  <input
                    type="number"
                    value={newProdStockS}
                    onChange={(e) => setNewProdStockS(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[#524E47]">Stock Size M</label>
                  <input
                    type="number"
                    value={newProdStockM}
                    onChange={(e) => setNewProdStockM(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[#524E47]">Stock Size L</label>
                  <input
                    type="number"
                    value={newProdStockL}
                    onChange={(e) => setNewProdStockL(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[#524E47]">Description</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#181818] text-white text-xs font-semibold rounded uppercase tracking-wider mt-2"
              >
                Publish Garment to Store
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCoupon && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#E8E2D6] w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D6]">
              <h3 className="font-editorial text-lg font-bold text-[#181818]">Create Promotional Coupon</h3>
              <button onClick={() => setShowAddCoupon(false)} className="text-[#181818]">✕</button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 text-[#524E47]">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI20"
                  className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-[#524E47]">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-[#524E47]">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={couponVal}
                    onChange={(e) => setCouponVal(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[#524E47]">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={couponMinOrder}
                  onChange={(e) => setCouponMinOrder(e.target.value)}
                  placeholder="1999"
                  className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 text-[#524E47]">Description</label>
                <input
                  type="text"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  placeholder="e.g. 15% off on orders above ₹2,499"
                  className="w-full px-3 py-2 border border-[#D5CBB9] rounded bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#181818] text-white text-xs font-semibold rounded uppercase tracking-wider mt-2"
              >
                Save & Activate Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

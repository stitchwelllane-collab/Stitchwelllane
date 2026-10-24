export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  sizePurchased?: string;
  colorPurchased?: string;
}

export interface ProductVariantColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface ProductVariantSize {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: 'mens' | 'womens' | 'tshirts' | 'shirts' | 'trousers' | 'dresses' | 'ethnic' | 'jackets' | 'accessories';
  gender: 'men' | 'women' | 'unisex';
  occasion: 'casual' | 'office' | 'festive' | 'party' | 'everyday' | 'seasonal';
  price: number; // in INR ₹
  originalPrice: number; // in INR ₹
  discountPercent: number;
  images: string[];
  description: string;
  fabricComposition: string;
  careInstructions: string[];
  colors: ProductVariantColor[];
  sizes: ProductVariantSize[];
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  material: string;
}

export interface CartItem {
  id: string; // composite key: `${product.id}-${size}-${color}`
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface TrackingStep {
  status: 'Placed' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  date: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. "SWL-2026-84912"
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: ShippingAddress;
  items: {
    product: Product;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  discount: number;
  couponApplied?: string;
  deliveryMethod: 'standard' | 'express';
  shippingFee: number;
  taxes: number; // GST 5% or 12%
  total: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'Placed' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  trackingTimeline: TrackingStep[];
  estimatedDeliveryDate: string;
  courierName?: string;
  trackingNumber?: string;
  createdAt: string;
  returnRequested?: boolean;
  returnReason?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  description: string;
  active: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses: ShippingAddress[];
  wishlist: string[]; // product IDs
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

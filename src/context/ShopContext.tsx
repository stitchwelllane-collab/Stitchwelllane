import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Coupon, UserProfile, ShippingAddress } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data/initialProducts';

export type RouteType = 
  | 'home' 
  | 'shop' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'account' 
  | 'tracking' 
  | 'about' 
  | 'contact' 
  | 'policies' 
  | 'admin';

export interface ShopFilterState {
  category?: string;
  gender?: string;
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  searchQuery?: string;
  sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
}

interface ShopContextType {
  products: Product[];
  loadingProducts: boolean;
  currentRoute: RouteType;
  routeParams: Record<string, any>;
  navigate: (route: RouteType, params?: Record<string, any>) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  activeUser: UserProfile;
  setActiveUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  shopFilters: ShopFilterState;
  setShopFilters: React.Dispatch<React.SetStateAction<ShopFilterState>>;
  refreshProducts: () => Promise<void>;
  coupons: Coupon[];
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 'usr-demo-01',
  name: 'Aanya Sharma',
  email: 'aanya.sharma@example.com',
  phone: '+91 98765 43210',
  role: 'customer',
  savedAddresses: [
    {
      fullName: 'Aanya Sharma',
      email: 'aanya.sharma@example.com',
      phone: '+91 98765 43210',
      street: '42, Indiranagar, 100ft Road',
      apartment: 'Apt 304, Green Palms',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true,
    },
  ],
  wishlist: ['prod-01', 'prod-02'],
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteType>('home');
  const [routeParams, setRouteParams] = useState<Record<string, any>>({});
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('swl_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('swl_wishlist');
      return saved ? JSON.parse(saved) : ['prod-01', 'prod-02'];
    } catch {
      return ['prod-01', 'prod-02'];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserProfile>(DEMO_USER);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [shopFilters, setShopFilters] = useState<ShopFilterState>({
    category: 'all',
    gender: 'all',
    occasion: 'all',
    sort: 'featured',
  });

  // Fetch live products from backend
  const refreshProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch {
      // Keep initial products fallback
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
    // Load coupons
    fetch('/api/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCoupons(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('swl_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('swl_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Handle route change and window scroll to top
  const navigate = (route: RouteType, params: Record<string, any> = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    const itemId = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, size, color, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Re-verify coupon discount when subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      if (cartSubtotal < appliedCoupon.minOrderValue) {
        setAppliedCoupon(null);
        setDiscountAmount(0);
      } else {
        const discount =
          appliedCoupon.discountType === 'percentage'
            ? Math.round((cartSubtotal * appliedCoupon.discountValue) / 100)
            : appliedCoupon.discountValue;
        setDiscountAmount(Math.min(discount, cartSubtotal));
      }
    } else {
      setDiscountAmount(0);
    }
  }, [cartSubtotal, appliedCoupon]);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
        return { success: true, message: `Coupon ${data.coupon.code} applied! Saved ₹${data.discountAmount.toLocaleString('en-IN')}` };
      }
      return { success: false, message: data.error || 'Failed to apply coupon' };
    } catch {
      return { success: false, message: 'Could not validate coupon at this time' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <ShopContext.Provider
      value={{
        products,
        loadingProducts,
        currentRoute,
        routeParams,
        navigate,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        wishlist,
        toggleWishlist,
        isInWishlist,
        activeUser,
        setActiveUser,
        isSearchOpen,
        setIsSearchOpen,
        shopFilters,
        setShopFilters,
        refreshProducts,
        coupons,
        lastPlacedOrder,
        setLastPlacedOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from './src/data/initialProducts.ts';
import { Product, Order, Coupon, ContactMessage } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

// Data directory & persistent store
const DATA_DIR = path.join(__dirname, '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface AppStore {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  contacts: ContactMessage[];
  newsletterSubscribers: string[];
}

function loadStore(): AppStore {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      // Fallback
    }
  }

  const initialStore: AppStore = {
    products: INITIAL_PRODUCTS,
    orders: [
      {
        id: 'SWL-2026-98124',
        customer: {
          name: 'Kabir Singhania',
          email: 'kabir.s@example.com',
          phone: '+91 98201 54321',
        },
        shippingAddress: {
          fullName: 'Kabir Singhania',
          email: 'kabir.s@example.com',
          phone: '+91 98201 54321',
          street: '14, Bandra West, Perry Cross Road',
          apartment: 'Flat 402, Sea Breeze Apts',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
        },
        items: [
          {
            product: INITIAL_PRODUCTS[0],
            size: 'M',
            color: 'Oatmeal Beige',
            quantity: 1,
            unitPrice: 3499,
          },
        ],
        subtotal: 3499,
        discount: 350,
        couponApplied: 'STITCH10',
        deliveryMethod: 'standard',
        shippingFee: 0,
        taxes: 157,
        total: 3306,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        razorpayPaymentId: 'pay_MockStitchwell98124',
        status: 'Shipped',
        trackingTimeline: [
          { status: 'Placed', date: '14 Oct 2026, 11:20 AM', description: 'Order received and logged in system', completed: true },
          { status: 'Confirmed', date: '14 Oct 2026, 11:25 AM', description: 'Payment verified via Razorpay ₹3,306', completed: true },
          { status: 'Processing', date: '14 Oct 2026, 04:15 PM', description: 'Garment steamed, inspected and packaged in signature cloth bag', completed: true },
          { status: 'Shipped', date: '15 Oct 2026, 09:30 AM', description: 'Handed over to Blue Dart Express (AWB: BD83910283)', completed: true },
          { status: 'Out for Delivery', date: 'Expected 17 Oct 2026', description: 'Dispatched with Mumbai delivery courier', completed: false },
          { status: 'Delivered', date: 'Expected 17 Oct 2026', description: 'Delivered to recipient address', completed: false },
        ],
        estimatedDeliveryDate: '17 Oct 2026',
        courierName: 'Blue Dart Express',
        trackingNumber: 'BD83910283',
        createdAt: '2026-10-14T05:50:00.000Z',
      },
    ],
    coupons: INITIAL_COUPONS,
    contacts: [],
    newsletterSubscribers: ['client.style@gmail.com'],
  };

  saveStore(initialStore);
  return initialStore;
}

function saveStore(store: AppStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write store:', err);
  }
}

let store = loadStore();

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  // 1. Products
  app.get('/api/products', (req, res) => {
    let list = [...store.products];
    const { category, gender, occasion, sort, search, isBestSeller, isNewArrival } = req.query;

    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }
    if (gender && gender !== 'all') {
      list = list.filter((p) => p.gender === gender || p.gender === 'unisex');
    }
    if (occasion && occasion !== 'all') {
      list = list.filter((p) => p.occasion === occasion);
    }
    if (isBestSeller === 'true') {
      list = list.filter((p) => p.isBestSeller);
    }
    if (isNewArrival === 'true') {
      list = list.filter((p) => p.isNewArrival);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabricComposition.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    res.json(list);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = store.products.find(
      (p) => p.id === req.params.id || p.slug === req.params.id
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: `prod-${Date.now()}`,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: req.body.sku || `SWL-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: req.body.rating || 5.0,
      reviewCount: req.body.reviewCount || 0,
      reviews: req.body.reviews || [],
    };
    store.products.unshift(newProduct);
    saveStore(store);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const index = store.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    store.products[index] = { ...store.products[index], ...req.body };
    saveStore(store);
    res.json(store.products[index]);
  });

  app.delete('/api/products/:id', (req, res) => {
    const index = store.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    store.products.splice(index, 1);
    saveStore(store);
    res.json({ success: true });
  });

  // Customer Reviews
  app.post('/api/products/:id/reviews', (req, res) => {
    const product = store.products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const { author, city, rating, title, comment, sizePurchased, colorPurchased } = req.body;
    if (!author || !rating || !comment) {
      return res.status(400).json({ error: 'Author, rating, and review comment are required' });
    }
    const newReview = {
      id: `rev-${Date.now()}`,
      author,
      city: city || 'India',
      rating: Number(rating),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: title || 'Verified Purchase Feedback',
      comment,
      verifiedPurchase: true,
      sizePurchased,
      colorPurchased,
    };
    product.reviews.unshift(newReview);
    product.reviewCount = product.reviews.length;
    const avg = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    product.rating = Number(avg.toFixed(1));

    saveStore(store);
    res.status(201).json(newReview);
  });

  // 2. Coupons
  app.get('/api/coupons', (_req, res) => {
    res.json(store.coupons);
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, error: 'Please enter a coupon code' });
    }
    const coupon = store.coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
    );
    if (!coupon) {
      return res.status(404).json({ valid: false, error: 'Invalid or expired coupon code' });
    }
    if (subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        valid: false,
        error: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for ${coupon.code}`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon,
      discountAmount: Math.min(discountAmount, subtotal),
    });
  });

  app.post('/api/coupons', (req, res) => {
    const { code, discountType, discountValue, minOrderValue, description } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ error: 'Code and discount value are required' });
    }
    const newCoupon: Coupon = {
      code: code.trim().toUpperCase(),
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      description: description || '',
      active: true,
    };
    store.coupons.push(newCoupon);
    saveStore(store);
    res.status(201).json(newCoupon);
  });

  app.delete('/api/coupons/:code', (req, res) => {
    const idx = store.coupons.findIndex((c) => c.code === req.params.code.toUpperCase());
    if (idx !== -1) {
      store.coupons.splice(idx, 1);
      saveStore(store);
    }
    res.json({ success: true });
  });

  // 3. Indian Rupee Payment Gateway (Razorpay)
  app.post('/api/razorpay/create-order', (req, res) => {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid order amount is required' });
    }

    // Amount must be in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_StitchwellLane';
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Generate unique server order id
    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    res.json({
      success: true,
      id: orderId,
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      keyId: razorpayKeyId,
      isLiveConfigured: Boolean(process.env.RAZORPAY_KEY_ID && razorpayKeySecret),
      notes: notes || { brand: 'StitchwellLane' },
    });
  });

  app.post('/api/razorpay/verify', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // If live credentials exist in server environment:
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (razorpayKeySecret && razorpay_signature) {
      const generated_signature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ verified: false, error: 'Signature verification failed' });
      }
    }

    res.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      message: 'Payment verified successfully by StitchwellLane payment system',
    });
  });

  // 4. Orders
  app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    if (!orderData.items || !orderData.items.length || !orderData.customer || !orderData.shippingAddress) {
      return res.status(400).json({ error: 'Incomplete order payload' });
    }

    // Deduct stock
    orderData.items.forEach((item: { product: { id: string }; size: string; quantity: number }) => {
      const prod = store.products.find((p) => p.id === item.product.id);
      if (prod) {
        const sizeObj = prod.sizes.find((s) => s.size === item.size);
        if (sizeObj) {
          sizeObj.stock = Math.max(0, sizeObj.stock - item.quantity);
        }
      }
    });

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `SWL-2026-${randomSuffix}`;

    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Delivery calculation
    const isExpress = orderData.deliveryMethod === 'express';
    const deliveryDays = isExpress ? 2 : 4;
    const estDate = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const isPaid = orderData.paymentMethod === 'razorpay';

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: isPaid ? 'Confirmed' : 'Placed',
      paymentStatus: isPaid ? 'paid' : 'pending',
      estimatedDeliveryDate: estDate,
      courierName: 'Delhivery Express',
      trackingNumber: `DL${randomSuffix}IN`,
      createdAt: new Date().toISOString(),
      trackingTimeline: [
        {
          status: 'Placed',
          date: `${dateStr}, ${timeStr}`,
          description: 'Order placed securely on StitchwellLane',
          completed: true,
        },
        {
          status: 'Confirmed',
          date: isPaid ? `${dateStr}, ${timeStr}` : 'Pending verification',
          description: isPaid
            ? `Online INR payment confirmed via Razorpay (ID: ${orderData.razorpayPaymentId || 'verified'})`
            : 'Cash on Delivery selected — phone confirmation may apply',
          completed: isPaid,
        },
        {
          status: 'Processing',
          date: 'Expected within 24 hours',
          description: 'Garments carefully tailored, ironed, and packaged in organic cotton pouches',
          completed: false,
        },
        {
          status: 'Shipped',
          date: 'Pending dispatch',
          description: 'Handed over to courier hub',
          completed: false,
        },
        {
          status: 'Out for Delivery',
          date: `Expected ${estDate}`,
          description: 'Assigned to local courier for doorstep delivery',
          completed: false,
        },
        {
          status: 'Delivered',
          date: `Expected ${estDate}`,
          description: 'Delivered with proof of delivery',
          completed: false,
        },
      ],
    };

    store.orders.unshift(newOrder);
    saveStore(store);
    res.status(201).json(newOrder);
  });

  app.get('/api/orders', (req, res) => {
    const { email } = req.query;
    if (email && typeof email === 'string') {
      const filtered = store.orders.filter(
        (o) => o.customer.email.toLowerCase() === email.toLowerCase()
      );
      return res.json(filtered);
    }
    res.json(store.orders);
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = store.orders.find((o) => o.id.toUpperCase() === req.params.id.toUpperCase());
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  app.post('/api/orders/track', (req, res) => {
    const { orderId, contact } = req.body;
    if (!orderId || !contact) {
      return res.status(400).json({ error: 'Order ID and email or mobile number are required' });
    }

    const cleanId = orderId.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase().replace(/[\s-]/g, '');

    const order = store.orders.find((o) => {
      const matchId = o.id.toUpperCase() === cleanId;
      const orderEmail = o.customer.email.toLowerCase();
      const orderPhone = o.customer.phone.replace(/[\s-]/g, '');
      const matchContact =
        orderEmail === cleanContact ||
        orderPhone.includes(cleanContact) ||
        cleanContact.includes(orderPhone);
      return matchId && matchContact;
    });

    if (!order) {
      return res.status(404).json({
        error: 'No order matched that Order ID and contact detail. Please check the spelling or format.',
      });
    }

    res.json(order);
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { status, trackingNumber, courierName } = req.body;
    const order = store.orders.find((o) => o.id.toUpperCase() === req.params.id.toUpperCase());
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierName) order.courierName = courierName;

    // Update tracking steps
    const orderStatusSeq = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const targetIdx = orderStatusSeq.indexOf(status);

    if (targetIdx !== -1) {
      const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      order.trackingTimeline.forEach((step, idx) => {
        if (idx <= targetIdx) {
          step.completed = true;
          if (!step.date.includes('AM') && !step.date.includes('PM')) {
            step.date = nowStr;
          }
        } else {
          step.completed = false;
        }
      });
    }

    if (status === 'Delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }

    saveStore(store);
    res.json(order);
  });

  app.post('/api/orders/:id/return', (req, res) => {
    const { reason } = req.body;
    const order = store.orders.find((o) => o.id.toUpperCase() === req.params.id.toUpperCase());
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.returnRequested = true;
    order.returnReason = reason || 'Customer requested exchange/return';
    saveStore(store);
    res.json({ success: true, order });
  });

  // 5. Contact & Support
  app.post('/api/contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    store.contacts.unshift(newMessage);
    saveStore(store);
    res.status(201).json({ success: true, messageId: newMessage.id });
  });

  app.get('/api/contact', (_req, res) => {
    res.json(store.contacts);
  });

  // 6. Newsletter
  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!store.newsletterSubscribers.includes(email.toLowerCase())) {
      store.newsletterSubscribers.push(email.toLowerCase());
      saveStore(store);
    }
    res.json({ success: true, message: 'Welcome to StitchwellLane style privileges.' });
  });

  // 7. Admin Dashboard Analytics
  app.get('/api/admin/stats', (_req, res) => {
    const totalOrders = store.orders.length;
    const totalRevenue = store.orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((acc, o) => acc + o.total, 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const lowStockProducts = store.products.filter((p) =>
      p.sizes.some((s) => s.stock < 5)
    );

    res.json({
      totalOrders,
      totalRevenue,
      avgOrderValue,
      totalProducts: store.products.length,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        sizes: p.sizes,
      })),
      recentOrders: store.orders.slice(0, 5),
    });
  });

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StitchwellLane backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start StitchwellLane server:', err);
  process.exit(1);
});

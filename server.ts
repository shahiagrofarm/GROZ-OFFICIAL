import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS } from './src/data/products';
import { BUSINESS_CONFIG } from './src/config/business';
import { Product, Order, OrderStatus, PaymentStatus } from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Increase payload limits for image upload and base64 assets
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure data directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Initialize persistent products file if absent
function getStoredProducts(): Product[] {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
      return INITIAL_PRODUCTS;
    }
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading products.json, falling back to initial data:', err);
    return INITIAL_PRODUCTS;
  }
}

function saveStoredProducts(products: Product[]): void {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

function getStoredOrders(): Order[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading orders.json:', err);
    return [];
  }
}

function saveStoredOrders(orders: Order[]): void {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

// In-memory active session tokens for administrator
const adminSessions = new Map<string, { username: string; expiresAt: number }>();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'groz@atelier2026';

// Middleware for Admin Authorization
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token.' });
  }

  const token = authHeader.substring(7);
  const session = adminSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) adminSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Admin session expired or invalid.' });
  }

  // Refresh session expiry (24 hours)
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  next();
}

// ============================================================================
// PUBLIC API ROUTES
// ============================================================================

// 1. Business Config
app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    brandName: BUSINESS_CONFIG.brandName,
    locationEn: BUSINESS_CONFIG.locationEn,
    locationBn: BUSINESS_CONFIG.locationBn,
    phone: BUSINESS_CONFIG.phone,
    phoneFormatted: BUSINESS_CONFIG.phoneFormatted,
    phoneTel: BUSINESS_CONFIG.phoneTel,
    whatsappNumber: BUSINESS_CONFIG.whatsappNumber,
    whatsappBaseUrl: BUSINESS_CONFIG.whatsappBaseUrl,
    facebookUrl: BUSINESS_CONFIG.facebookUrl,
    instagramUrl: BUSINESS_CONFIG.instagramUrl,
    delivery: BUSINESS_CONFIG.delivery,
    paymentMethods: BUSINESS_CONFIG.paymentMethods,
  });
});

// 2. Products List
app.get('/api/products', (req: Request, res: Response) => {
  const products = getStoredProducts();
  const showAll = req.query.all === 'true';

  // If ?all=true, verify admin auth token
  if (showAll) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const session = adminSessions.get(token);
      if (session && session.expiresAt >= Date.now()) {
        return res.json(products);
      }
    }
  }

  // Otherwise return only published products
  const published = products.filter((p) => p.isPublished !== false);
  res.json(published);
});

// 3. Single Product
app.get('/api/products/:id', (req: Request, res: Response) => {
  const products = getStoredProducts();
  const product = products.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Specimen not found in archive.' });
  }
  res.json(product);
});

// 4. Cart & Checkout Price/Stock Server-side Validation
app.post('/api/checkout/validate', (req: Request, res: Response) => {
  const { items, deliveryArea } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart items are required for validation.' });
  }

  const products = getStoredProducts();
  const validatedItems: any[] = [];
  let subtotal = 0;
  const issues: string[] = [];

  for (const item of items) {
    const p = products.find((prod) => prod.id === item.productId);
    if (!p) {
      issues.push(`Product with ID "${item.productId}" is no longer available.`);
      continue;
    }
    if (p.isPublished === false) {
      issues.push(`Product "${p.nameEn}" is currently unlisted.`);
      continue;
    }
    if (p.stockStatus === 'out_of_stock' || p.stockQuantity <= 0) {
      issues.push(`Product "${p.nameEn}" is currently out of stock.`);
      continue;
    }

    const price = typeof p.salePriceBDT === 'number' && p.salePriceBDT > 0 ? p.salePriceBDT : p.priceBDT;
    const qty = Math.min(Math.max(1, Math.floor(Number(item.quantity) || 1)), p.stockQuantity);
    const lineTotal = price * qty;
    subtotal += lineTotal;

    validatedItems.push({
      productId: p.id,
      productName: p.nameEn,
      productNameBn: p.nameBn,
      priceBDT: price,
      quantity: qty,
      color: item.color || p.colors?.[0] || 'Standard',
      size: item.size || p.sizes?.[0] || 'Standard',
      image: p.image,
      lineTotalBDT: lineTotal,
    });
  }

  const deliveryChargeBDT =
    deliveryArea === 'inside_noakhali'
      ? BUSINESS_CONFIG.delivery.insideNoakhaliBDT
      : BUSINESS_CONFIG.delivery.outsideNoakhaliBDT;

  const totalBDT = subtotal + deliveryChargeBDT;

  res.json({
    isValid: issues.length === 0,
    issues,
    items: validatedItems,
    subtotalBDT: subtotal,
    deliveryChargeBDT,
    totalBDT,
  });
});

// 5. Submit Order
app.post('/api/orders', (req: Request, res: Response) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    deliveryArea,
    items,
    paymentMethod,
    transactionId,
    customerNotes,
  } = req.body;

  if (!customerName || !customerPhone || !deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required order fields (name, phone, address, items).' });
  }

  const products = getStoredProducts();
  const orderItems: any[] = [];
  let subtotal = 0;

  for (const item of items) {
    const p = products.find((prod) => prod.id === item.productId);
    const price = p ? (typeof p.salePriceBDT === 'number' ? p.salePriceBDT : p.priceBDT) : Number(item.priceBDT) || 0;
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    subtotal += price * qty;

    orderItems.push({
      productId: item.productId,
      productName: p?.nameEn || item.productName || 'GROZ Specimen',
      priceBDT: price,
      quantity: qty,
      color: item.color,
      size: item.size,
      image: p?.image || item.image || '/assets/aistudio/FB_IMG_1792947438632_9dd0b6b3.jpg',
    });
  }

  const deliveryCharge =
    deliveryArea === 'inside_noakhali'
      ? BUSINESS_CONFIG.delivery.insideNoakhaliBDT
      : BUSINESS_CONFIG.delivery.outsideNoakhaliBDT;

  const total = subtotal + deliveryCharge;

  // Find payment info
  const payConfig = BUSINESS_CONFIG.paymentMethods.find((pm) => pm.id === paymentMethod);
  const paymentNumber = payConfig ? payConfig.number : '01604985164';

  const orderId = `GROZ-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: Order = {
    id: orderId,
    customerName: String(customerName).trim(),
    customerPhone: String(customerPhone).trim(),
    customerEmail: customerEmail ? String(customerEmail).trim() : undefined,
    deliveryAddress: String(deliveryAddress).trim(),
    deliveryArea: deliveryArea === 'inside_noakhali' ? 'inside_noakhali' : 'outside_noakhali',
    deliveryChargeBDT: deliveryCharge,
    items: orderItems,
    subtotalBDT: subtotal,
    totalBDT: total,
    paymentMethod: paymentMethod || 'bkash',
    paymentNumber,
    transactionId: transactionId ? String(transactionId).trim() : undefined,
    customerNotes: customerNotes ? String(customerNotes).trim() : undefined,
    orderStatus: 'Pending',
    paymentStatus: 'Unverified',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const orders = getStoredOrders();
  orders.unshift(newOrder);
  saveStoredOrders(orders);

  res.status(201).json({
    success: true,
    message: 'Order created in GROZ atelier dispatch archive.',
    order: newOrder,
  });
});

// ============================================================================
// ADMIN AUTHENTICATION & MANAGEMENT ROUTES
// ============================================================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    adminSessions.set(token, { username, expiresAt });

    return res.json({
      success: true,
      token,
      user: { username, role: 'admin' },
    });
  }

  res.status(401).json({ error: 'Invalid administrator credentials.' });
});

// Admin Me / Verify Session
app.get('/api/admin/me', requireAdminAuth, (req: Request, res: Response) => {
  const token = req.headers.authorization!.substring(7);
  const session = adminSessions.get(token);
  res.json({
    authenticated: true,
    user: { username: session?.username || 'admin', role: 'admin' },
  });
});

// Admin Logout
app.post('/api/admin/logout', requireAdminAuth, (req: Request, res: Response) => {
  const token = req.headers.authorization!.substring(7);
  adminSessions.delete(token);
  res.json({ success: true, message: 'Admin logged out successfully.' });
});

// Admin Upload Product Image
app.post('/api/admin/upload', requireAdminAuth, (req: Request, res: Response) => {
  const { dataUrl, filename } = req.body;

  if (!dataUrl || typeof dataUrl !== 'string') {
    return res.status(400).json({ error: 'Image data URL is required.' });
  }

  // Handle base64 data URLs
  const matches = dataUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    // If it's already an external HTTP URL or relative path, return as is
    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/')) {
      return res.json({ url: dataUrl });
    }
    return res.status(400).json({ error: 'Invalid image format. Provide base64 or valid image URL.' });
  }

  const extension = matches[1].replace('jpeg', 'jpg');
  const buffer = Buffer.from(matches[2], 'base64');

  // Max 5MB limit
  if (buffer.length > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
  }

  const safeName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, safeName);

  fs.writeFileSync(filePath, buffer);
  const publicUrl = `/uploads/${safeName}`;

  res.json({
    success: true,
    url: publicUrl,
    filename: safeName,
    sizeBytes: buffer.length,
  });
});

// Admin Create Product
app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  const productData = req.body;

  if (!productData.nameEn || !productData.priceBDT) {
    return res.status(400).json({ error: 'Product name and price are required.' });
  }

  const products = getStoredProducts();
  const id = productData.id || `groz-specimen-${Date.now().toString().slice(-4)}`;
  const slug = productData.slug || productData.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const newProduct: Product = {
    id,
    slug,
    nameEn: String(productData.nameEn).trim(),
    nameBn: productData.nameBn ? String(productData.nameBn).trim() : String(productData.nameEn).trim(),
    subtitleEn: productData.subtitleEn ? String(productData.subtitleEn).trim() : 'Maijdee Court Specimen',
    subtitleBn: productData.subtitleBn ? String(productData.subtitleBn).trim() : 'মাইজদী কোর্ট স্পেসিমেন',
    category: productData.category || 'outerwear',
    priceBDT: Math.max(0, Number(productData.priceBDT) || 0),
    salePriceBDT: productData.salePriceBDT ? Math.max(0, Number(productData.salePriceBDT)) : undefined,
    image: productData.image || '/assets/aistudio/FB_IMG_1792947438632_9dd0b6b3.jpg',
    gallery: Array.isArray(productData.gallery) && productData.gallery.length > 0
      ? productData.gallery
      : [productData.image || '/assets/aistudio/FB_IMG_1792947438632_9dd0b6b3.jpg'],
    descriptionEn: productData.descriptionEn || '',
    descriptionBn: productData.descriptionBn || '',
    specifications: Array.isArray(productData.specifications) ? productData.specifications : [],
    materialsStatusEn: productData.materialsStatusEn || 'Verified specification pending release.',
    materialsStatusBn: productData.materialsStatusBn || 'যাচাইকৃত স্পেসিফিকেশন প্রকাশের অপেক্ষায়।',
    dimensionsEn: productData.dimensionsEn || 'Architectural envelope pending measurement (TBC)',
    dimensionsBn: productData.dimensionsBn || 'পরিমাপ নিশ্চিতকরণাধীন (TBC)',
    colors: Array.isArray(productData.colors) && productData.colors.length > 0 ? productData.colors : ['Obsidian Noir'],
    sizes: Array.isArray(productData.sizes) && productData.sizes.length > 0 ? productData.sizes : ['Standard'],
    stockStatus: productData.stockStatus || 'in_stock',
    stockQuantity: typeof productData.stockQuantity === 'number' ? productData.stockQuantity : 10,
    isFeatured: Boolean(productData.isFeatured),
    isNewArrival: Boolean(productData.isNewArrival),
    isSale: Boolean(productData.isSale),
    isPublished: productData.isPublished !== false,
    imageAlt: productData.imageAlt || productData.nameEn,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.unshift(newProduct);
  saveStoredProducts(products);

  res.status(201).json({
    success: true,
    product: newProduct,
  });
});

// Admin Update Product
app.put('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const existing = products[index];
  const update = req.body;

  const updatedProduct: Product = {
    ...existing,
    ...update,
    id: existing.id, // Immutable ID
    priceBDT: typeof update.priceBDT !== 'undefined' ? Math.max(0, Number(update.priceBDT)) : existing.priceBDT,
    salePriceBDT: typeof update.salePriceBDT !== 'undefined' ? (update.salePriceBDT ? Math.max(0, Number(update.salePriceBDT)) : undefined) : existing.salePriceBDT,
    stockQuantity: typeof update.stockQuantity !== 'undefined' ? Number(update.stockQuantity) : existing.stockQuantity,
    isPublished: typeof update.isPublished !== 'undefined' ? Boolean(update.isPublished) : existing.isPublished,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  saveStoredProducts(products);

  res.json({
    success: true,
    product: updatedProduct,
  });
});

// Admin Delete Product
app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const products = getStoredProducts();
  const target = products.find((p) => p.id === req.params.id);

  if (!target) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const remaining = products.filter((p) => p.id !== req.params.id);
  saveStoredProducts(remaining);

  res.json({
    success: true,
    deletedId: req.params.id,
    deletedName: target.nameEn,
  });
});

// Admin List Orders
app.get('/api/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
  const orders = getStoredOrders();
  const statusFilter = req.query.status as string;

  if (statusFilter && statusFilter !== 'all') {
    return res.json(orders.filter((o) => o.orderStatus.toLowerCase() === statusFilter.toLowerCase()));
  }

  res.json(orders);
});

// Admin Update Order Status and Payment Status
app.patch('/api/admin/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { orderStatus, paymentStatus } = req.body;
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  if (orderStatus) {
    orders[index].orderStatus = orderStatus as OrderStatus;
  }
  if (paymentStatus) {
    orders[index].paymentStatus = paymentStatus as PaymentStatus;
  }

  orders[index].updatedAt = new Date().toISOString();
  saveStoredOrders(orders);

  res.json({
    success: true,
    order: orders[index],
  });
});

// ============================================================================
// SERVER LAUNCH & VITE INTEGRATION
// ============================================================================

async function startServer() {
  if (!isProd) {
    // Development: mount Vite middlewares
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static client files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use(express.static(path.resolve(process.cwd(), 'public')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[GROZ ATELIER] Server operational on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[GROZ ATELIER] Server startup failure:', err);
  process.exit(1);
});

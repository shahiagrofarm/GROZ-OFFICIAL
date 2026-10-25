import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, OrderStatus, PaymentStatus } from '../types';
import {
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Upload,
  Search,
  AlertCircle,
  Package,
  Layers,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { adminUser, adminLogin, adminLogout, formatMoney, t, language, products, refreshProducts } = useApp();

  // Auth form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Tab: 'products' | 'orders'
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // Product Management States
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [productFormError, setProductFormError] = useState('');
  const [adminNotice, setAdminNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Order Management States
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);
    const res = await adminLogin(usernameInput.trim(), passwordInput.trim());
    setIsAuthenticating(false);
    if (!res.success) {
      setAuthError(res.error || 'Authentication failed. Verify credentials.');
    } else {
      setPasswordInput('');
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    if (!adminUser?.token) return;
    setLoadingOrders(true);
    try {
      const url = orderStatusFilter === 'all'
        ? '/api/admin/orders'
        : `/api/admin/orders?status=${orderStatusFilter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      if (activeTab === 'orders') {
        fetchOrders();
      }
    }
  }, [adminUser, activeTab, orderStatusFilter]);

  // Handle Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !adminUser?.token) return;

    if (file.size > 5 * 1024 * 1024) {
      setAdminNotice({ text: 'Selected image exceeds maximum 5MB limit.', type: 'error' });
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminUser.token}`,
          },
          body: JSON.stringify({ dataUrl, filename: file.name }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setEditingProduct((prev) => ({
            ...prev,
            image: data.url,
            gallery: prev?.gallery ? [...prev.gallery, data.url] : [data.url],
          }));
          setAdminNotice({ text: 'Image uploaded successfully.', type: 'success' });
          setTimeout(() => setAdminNotice(null), 3000);
        } else {
          setAdminNotice({ text: data.error || 'Failed to upload image.', type: 'error' });
        }
      } catch (err: any) {
        setAdminNotice({ text: 'Upload failed: ' + err.message, type: 'error' });
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser?.token || !editingProduct) return;
    setProductFormError('');

    if (!editingProduct.nameEn || !editingProduct.priceBDT) {
      setProductFormError('Product Name (EN) and Price (BDT) are mandatory.');
      return;
    }

    setIsSavingProduct(true);
    try {
      const url = isNewProduct ? '/api/admin/products' : `/api/admin/products/${editingProduct.id}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminUser.token}`,
        },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshProducts();
        setEditingProduct(null);
        setIsNewProduct(false);
      } else {
        setProductFormError(data.error || 'Failed to persist product alterations.');
      }
    } catch (err: any) {
      setProductFormError('Network communication error: ' + err.message);
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleConfirmDelete = async () => {
    if (!adminUser?.token || !deleteCandidate) return;

    try {
      const res = await fetch(`/api/admin/products/${deleteCandidate.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      if (res.ok) {
        await refreshProducts();
        setDeleteCandidate(null);
        setAdminNotice({ text: 'Specimen deleted from catalog archive.', type: 'success' });
        setTimeout(() => setAdminNotice(null), 3000);
      } else {
        const data = await res.json();
        setAdminNotice({ text: data.error || 'Failed to delete specimen.', type: 'error' });
      }
    } catch (err: any) {
      setAdminNotice({ text: 'Delete failed: ' + err.message, type: 'error' });
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, orderStatus?: OrderStatus, paymentStatus?: PaymentStatus) => {
    if (!adminUser?.token) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminUser.token}`,
        },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (activeOrderModal?.id === orderId) {
          setActiveOrderModal(data.order);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.nameEn.toLowerCase().includes(q) ||
      p.nameBn.includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  // If Not Authenticated, show Login Form
  if (!adminUser) {
    return (
      <div className="w-full bg-groz-main text-groz-main min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        <div className="border border-groz bg-groz-main p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-neutral-900 border border-groz mx-auto flex items-center justify-center text-groz-red">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-serif-editorial text-2xl font-bold uppercase tracking-tight text-groz-main">
              {t('adminLoginTitle')}
            </h1>
            <p className="font-serif-editorial text-xs text-groz-muted leading-relaxed">
              {t('adminLoginPrompt')}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/40 border border-groz-red text-xs font-mono-editorial text-red-400">
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                {t('adminUsername')}
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                required
                className="w-full p-3 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                {t('adminPassword')}
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full p-3 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
            >
              {isAuthenticating ? 'Authenticating...' : t('adminSignIn')}
            </button>

            <div className="text-[11px] font-mono-editorial text-groz-muted text-center pt-2">
              Default Atelier Dev: admin / groz@atelier2026
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-groz-main text-groz-main min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors">
      {/* Top Header Bar */}
      <div className="pb-8 border-b border-groz flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em]">
            <span className="w-1.5 h-1.5 bg-groz-red" />
            <span>Owner Control Portal &bull; Maijdee Court</span>
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold uppercase tracking-tight text-groz-main mt-1">
            {t('adminTitle')}
          </h1>
          <p className="font-serif-editorial text-sm text-groz-muted">
            {t('adminSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-editorial text-groz-muted">
            Logged in as <strong className="text-groz-main">{adminUser.username}</strong>
          </span>
          <button
            onClick={adminLogout}
            className="px-3 py-1.5 border border-groz hover:border-groz-red text-xs font-mono-editorial uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-groz-red" />
            <span>{t('adminSignOut')}</span>
          </button>
        </div>
      </div>

      {/* Global Admin Feedback Notice */}
      {adminNotice && (
        <div
          className={`my-4 p-3 border text-xs font-mono-editorial flex items-center justify-between ${
            adminNotice.type === 'success'
              ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/30 border-red-500/50 text-red-300'
          }`}
        >
          <span>{adminNotice.text}</span>
          <button
            onClick={() => setAdminNotice(null)}
            className="text-xs uppercase hover:underline ml-4 text-groz-muted"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs: Products vs Orders */}
      <div className="py-6 border-b border-groz flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 text-xs font-mono-editorial uppercase tracking-wider border transition-colors flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-groz-red text-white border-groz-red font-semibold'
                : 'border-groz text-groz-main hover:border-groz-red'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t('adminTabProducts')} ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 text-xs font-mono-editorial uppercase tracking-wider border transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-groz-red text-white border-groz-red font-semibold'
                : 'border-groz text-groz-main hover:border-groz-red'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('adminTabOrders')}</span>
          </button>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={() => {
              setIsNewProduct(true);
              setEditingProduct({
                id: `groz-specimen-${Date.now().toString().slice(-4)}`,
                nameEn: '',
                nameBn: '',
                subtitleEn: '',
                subtitleBn: '',
                category: 'outerwear',
                priceBDT: 3500,
                salePriceBDT: undefined,
                image: '/assets/aistudio/FB_IMG_1792947438632_9dd0b6b3.jpg',
                gallery: ['/assets/aistudio/FB_IMG_1792947438632_9dd0b6b3.jpg'],
                descriptionEn: '',
                descriptionBn: '',
                specifications: [],
                materialsStatusEn: 'Textile composition pending inaugural batch certification.',
                materialsStatusBn: 'টেক্সটাইল স্পেসিফিকেশন ল্যাবরেটরি পরীক্ষারত (TBC)।',
                dimensionsEn: 'Pattern dimensions pending release (TBC)',
                dimensionsBn: 'পরিমাপ নিশ্চিতকরণাধীন (TBC)',
                colors: ['Obsidian Noir'],
                sizes: ['Standard'],
                stockStatus: 'in_stock',
                stockQuantity: 10,
                isFeatured: false,
                isNewArrival: true,
                isSale: false,
                isPublished: true,
                imageAlt: 'GROZ Specimen',
              });
            }}
            className="px-4 py-2.5 bg-groz-red hover:bg-red-700 text-white text-xs font-mono-editorial uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('adminAddProduct')}</span>
          </button>
        )}
      </div>

      {/* =====================================================================
          TAB 1: PRODUCT MANAGEMENT
          ===================================================================== */}
      {activeTab === 'products' && (
        <div className="py-6 space-y-6">
          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-groz-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, ID or category..."
                className="w-full pl-9 pr-3 py-2 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
              />
            </div>
            <span className="text-xs font-mono-editorial text-groz-muted">
              Displaying {filteredProducts.length} items
            </span>
          </div>

          {/* Products Table */}
          <div className="border border-groz bg-groz-main overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono-editorial">
              <thead>
                <tr className="border-b border-groz bg-groz-surface text-groz-muted uppercase tracking-wider">
                  <th className="p-3">Specimen</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Flags</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-groz">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-groz-surface/50 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-10 h-12 bg-neutral-950 border border-groz shrink-0 p-1 flex items-center justify-center">
                        <img src={p.image} alt={p.nameEn} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="font-bold text-groz-main font-serif-editorial text-sm block">
                          {p.nameEn}
                        </span>
                        <span className="text-[10px] text-groz-muted block">{p.id}</span>
                      </div>
                    </td>
                    <td className="p-3 uppercase text-groz-muted">{p.category}</td>
                    <td className="p-3">
                      {p.salePriceBDT ? (
                        <div>
                          <span className="text-groz-red font-bold">{formatMoney(p.salePriceBDT)}</span>
                          <span className="line-through text-groz-muted block text-[10px]">{formatMoney(p.priceBDT)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-groz-main">{formatMoney(p.priceBDT)}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 text-[10px] uppercase font-semibold ${
                        p.stockStatus === 'in_stock' ? 'bg-green-950/40 text-green-400 border border-green-800' :
                        p.stockStatus === 'low_stock' ? 'bg-amber-950/40 text-amber-400 border border-amber-800' :
                        'bg-red-950/40 text-red-400 border border-red-800'
                      }`}>
                        {p.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 text-[10px] uppercase ${
                        p.isPublished !== false ? 'text-groz-main border border-groz' : 'text-neutral-500 border border-neutral-800'
                      }`}>
                        {p.isPublished !== false ? t('adminPublish') : t('adminDraft')}
                      </span>
                    </td>
                    <td className="p-3 space-x-1">
                      {p.isFeatured && <span className="text-[9px] bg-red-600 text-white px-1">FEAT</span>}
                      {p.isNewArrival && <span className="text-[9px] bg-neutral-800 text-neutral-300 px-1">NEW</span>}
                      {p.isSale && <span className="text-[9px] bg-amber-600 text-white px-1">SALE</span>}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setIsNewProduct(false);
                          setEditingProduct({ ...p });
                        }}
                        className="p-1.5 border border-groz hover:border-groz-red text-groz-main transition-colors"
                        title="Edit Specimen"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(p)}
                        className="p-1.5 border border-groz hover:border-red-600 text-groz-muted hover:text-red-500 transition-colors"
                        title="Delete Specimen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: ORDER MANAGEMENT
          ===================================================================== */}
      {activeTab === 'orders' && (
        <div className="py-6 space-y-6">
          {/* Status filter bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-editorial uppercase text-groz-muted">Filter by Status:</span>
            {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setOrderStatusFilter(status)}
                className={`px-3 py-1 text-xs font-mono-editorial uppercase tracking-wider border transition-colors ${
                  orderStatusFilter.toLowerCase() === status.toLowerCase()
                    ? 'border-groz-red text-groz-red font-bold bg-groz-surface'
                    : 'border-groz text-groz-muted hover:text-groz-main'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loadingOrders ? (
            <div className="py-12 text-center text-xs font-mono-editorial text-groz-muted">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 border border-groz text-center space-y-2 text-groz-muted font-mono-editorial text-xs">
              <ShoppingBag className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p>{t('adminOrdersEmpty')}</p>
            </div>
          ) : (
            <div className="border border-groz bg-groz-main overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono-editorial">
                <thead>
                  <tr className="border-b border-groz bg-groz-surface text-groz-muted uppercase tracking-wider">
                    <th className="p-3">Order Ref</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Order Status</th>
                    <th className="p-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-groz">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-groz-surface/50 transition-colors">
                      <td className="p-3 font-bold text-groz-red">{order.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-groz-main">{order.customerName}</div>
                        <div className="text-[10px] text-groz-muted">{order.customerPhone}</div>
                      </td>
                      <td className="p-3 text-groz-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span className="uppercase font-semibold">{order.paymentMethod}</span>
                        <div className="text-[10px] text-groz-muted">TrxID: {order.transactionId || 'None'}</div>
                        <span className={`inline-block px-1 py-0.2 text-[9px] uppercase mt-0.5 ${
                          order.paymentStatus === 'Verified' ? 'bg-green-900/40 text-green-400' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-groz-main">{formatMoney(order.totalBDT)}</td>
                      <td className="p-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-groz-main border border-groz px-2 py-1 text-[11px] font-mono-editorial text-groz-main uppercase cursor-pointer focus:outline-none focus:border-groz-red"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setActiveOrderModal(order)}
                          className="px-2.5 py-1 border border-groz hover:border-groz-red text-[11px] font-mono-editorial uppercase transition-colors"
                        >
                          View Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD / EDIT PRODUCT
          ===================================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-groz-main border border-groz max-w-4xl w-full my-auto overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-groz flex justify-between items-center bg-groz-surface">
              <h2 className="text-xs uppercase font-mono-editorial tracking-[0.25em] font-bold text-groz-main">
                {isNewProduct ? t('adminAddProduct') : t('adminEditProduct')} &bull; {editingProduct.id}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 border border-groz hover:border-groz-red text-groz-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {productFormError && (
              <div className="p-3 bg-red-950/40 border-b border-groz-red text-xs font-mono-editorial text-red-400">
                {productFormError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.nameEn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                    required
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    Product Name (Bangla)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.nameBn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameBn: e.target.value })}
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    Category
                  </label>
                  <select
                    value={editingProduct.category || 'outerwear'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main uppercase focus:outline-none focus:border-groz-red cursor-pointer"
                  >
                    <option value="outerwear">Outerwear & Apparel</option>
                    <option value="leather">Bags & Leather</option>
                    <option value="accessories">Signature Accents</option>
                    <option value="timepieces">Timepieces & Eyewear</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    Regular Price (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    value={editingProduct.priceBDT || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceBDT: Number(e.target.value) })}
                    required
                    min={0}
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    Optional Sale Price (BDT ৳)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.salePriceBDT || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePriceBDT: e.target.value ? Number(e.target.value) : undefined })}
                    min={0}
                    placeholder="Leave empty if not on sale"
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />
                </div>
              </div>

              {/* Image URL & File Upload */}
              <div className="space-y-3 p-4 border border-groz bg-groz-surface">
                <label className="text-xs font-mono-editorial uppercase text-groz-main block font-semibold">
                  {t('adminImageLabel')}
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="text"
                    value={editingProduct.image || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="/assets/aistudio/... or https://..."
                    className="flex-1 p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />

                  <label className="px-4 py-2.5 bg-groz-red hover:bg-red-700 text-white text-xs font-mono-editorial uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-2 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : t('adminUploadBtn')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {editingProduct.image && (
                  <div className="flex items-center gap-4 pt-2">
                    <div className="w-16 h-20 bg-neutral-950 border border-groz p-1 flex items-center justify-center">
                      <img src={editingProduct.image} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] font-mono-editorial text-groz-muted">
                      Preview: Current main product image
                    </span>
                  </div>
                )}
              </div>

              {/* Inventory & Stock Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    {t('adminStockQuantity')}
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stockQuantity || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                    min={0}
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    {t('adminStockStatus')}
                  </label>
                  <select
                    value={editingProduct.stockStatus || 'in_stock'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main uppercase focus:outline-none focus:border-groz-red cursor-pointer"
                  >
                    <option value="in_stock">{t('inStock')}</option>
                    <option value="low_stock">{t('lowStock')}</option>
                    <option value="out_of_stock">{t('outOfStock')}</option>
                  </select>
                </div>
              </div>

              {/* Variants: Colors & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    Colors (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(editingProduct.colors) ? editingProduct.colors.join(', ') : ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      colors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })}
                    placeholder="Obsidian Black, Brushed Chrome, Crimson Edge"
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    Sizes / Dimensions (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(editingProduct.sizes) ? editingProduct.sizes.join(', ') : ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })}
                    placeholder="S, M, L, XL or Standard"
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.descriptionEn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descriptionEn: e.target.value })}
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-muted block">
                    Description (Bangla)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.descriptionBn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descriptionBn: e.target.value })}
                    className="w-full p-2.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />
                </div>
              </div>

              {/* Flags: Published, Featured, New, Sale */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-groz text-xs font-mono-editorial">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPublished !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isPublished: e.target.checked })}
                    className="accent-red-600"
                  />
                  <span>Publish to Online Store</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isFeatured)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="accent-red-600"
                  />
                  <span>Featured on Home Page</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isNewArrival)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                    className="accent-red-600"
                  />
                  <span>Mark as New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isSale)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isSale: e.target.checked })}
                    className="accent-red-600"
                  />
                  <span>Mark as Sale Specimen</span>
                </label>
              </div>

              {/* Submit / Cancel */}
              <div className="pt-4 border-t border-groz flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 border border-groz text-xs font-mono-editorial uppercase tracking-wider"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 bg-groz-red hover:bg-red-700 text-white text-xs font-mono-editorial uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {isSavingProduct ? 'Persisting...' : 'Save & Publish Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CONFIRM PRODUCT DELETION
          ===================================================================== */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-groz-main border border-groz max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="font-serif-editorial text-2xl font-bold uppercase text-groz-red">
                {t('adminDeleteProduct')}
              </h3>
              <p className="font-serif-editorial text-sm text-groz-muted">
                {t('adminDeleteConfirm')}
              </p>
              <div className="p-3 border border-groz bg-groz-surface font-mono-editorial text-xs">
                <strong>{deleteCandidate.nameEn}</strong> ({deleteCandidate.id})
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 border border-groz text-xs font-mono-editorial uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono-editorial uppercase font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: VIEW ORDER DOSSIER
          ===================================================================== */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-groz-main border border-groz max-w-2xl w-full my-auto overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-groz flex justify-between items-center bg-groz-surface">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-groz-red" />
                <h2 className="text-xs uppercase font-mono-editorial tracking-[0.25em] font-bold text-groz-main">
                  Order Dossier &bull; {activeOrderModal.id}
                </h2>
              </div>
              <button
                onClick={() => setActiveOrderModal(null)}
                className="p-1 border border-groz hover:border-groz-red text-groz-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto font-mono-editorial text-xs">
              {/* Customer summary */}
              <div className="p-4 border border-groz bg-groz-surface space-y-2">
                <div className="flex justify-between">
                  <span className="text-groz-muted">Client Name:</span>
                  <span className="font-bold text-groz-main">{activeOrderModal.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-groz-muted">Phone:</span>
                  <span className="font-bold text-groz-main">{activeOrderModal.customerPhone}</span>
                </div>
                {activeOrderModal.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-groz-muted">Email:</span>
                    <span>{activeOrderModal.customerEmail}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-groz-muted">Delivery Address:</span>
                  <span className="text-right max-w-xs text-groz-main">{activeOrderModal.deliveryAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-groz-muted">Destination:</span>
                  <span className="uppercase">{activeOrderModal.deliveryArea} (৳{activeOrderModal.deliveryChargeBDT})</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <span className="text-groz-muted uppercase tracking-wider block">Ordered Specimens:</span>
                <div className="border border-groz divide-y divide-groz">
                  {activeOrderModal.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center">
                      <div>
                        <div className="font-bold font-serif-editorial text-sm text-groz-main">{item.productName}</div>
                        <div className="text-[10px] text-groz-muted">
                          {item.color} / {item.size} &bull; Qty: {item.quantity} × {formatMoney(item.priceBDT)}
                        </div>
                      </div>
                      <div className="font-bold text-groz-main">
                        {formatMoney(item.priceBDT * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 border border-groz space-y-2">
                <div className="flex justify-between">
                  <span className="text-groz-muted">Subtotal:</span>
                  <span>{formatMoney(activeOrderModal.subtotalBDT)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-groz-muted">Delivery Charge:</span>
                  <span>{formatMoney(activeOrderModal.deliveryChargeBDT)}</span>
                </div>
                <div className="pt-2 border-t border-groz flex justify-between text-sm font-bold text-groz-main">
                  <span>Total Amount:</span>
                  <span className="text-groz-red">{formatMoney(activeOrderModal.totalBDT)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-4 border border-groz bg-groz-surface space-y-2">
                <div className="flex justify-between">
                  <span className="text-groz-muted">Method:</span>
                  <span className="font-bold uppercase">{activeOrderModal.paymentMethod} ({activeOrderModal.paymentNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-groz-muted">Reported TrxID:</span>
                  <span className="font-bold text-groz-red tracking-wider">{activeOrderModal.transactionId || 'None'}</span>
                </div>
                {activeOrderModal.customerNotes && (
                  <div className="pt-2 border-t border-groz">
                    <span className="text-groz-muted block mb-1">Customer Note:</span>
                    <p className="text-groz-main italic">{activeOrderModal.customerNotes}</p>
                  </div>
                )}
              </div>

              {/* Status Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-groz-muted block font-semibold">
                    {t('adminOrderStatus')}:
                  </label>
                  <select
                    value={activeOrderModal.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(activeOrderModal.id, e.target.value as OrderStatus)}
                    className="w-full p-2 bg-groz-main border border-groz text-xs font-mono-editorial uppercase cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-groz-muted block font-semibold">
                    {t('adminPaymentStatus')}:
                  </label>
                  <select
                    value={activeOrderModal.paymentStatus}
                    onChange={(e) => handleUpdateOrderStatus(activeOrderModal.id, undefined, e.target.value as PaymentStatus)}
                    className="w-full p-2 bg-groz-main border border-groz text-xs font-mono-editorial uppercase cursor-pointer"
                  >
                    <option value="Unverified">Unverified</option>
                    <option value="Verified">Verified</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

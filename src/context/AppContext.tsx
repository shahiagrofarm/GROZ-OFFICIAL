import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, Theme, NavRoute, Product, CartItem, AdminUser, Order } from '../types';
import { translations, TranslationKey, t as translateFn } from '../translations';
import { sanitizeCartStorage, clampQuantity, formatBDT, calculateCartSubtotal } from '../utils/cart';
import { applyRouteSEO } from '../utils/seo';
import { INITIAL_PRODUCTS } from '../data/products';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: Theme;
  setTheme: (th: Theme) => void;
  toggleTheme: () => void;
  route: NavRoute;
  setRoute: (r: NavRoute) => void;
  products: Product[];
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  buyNow: (product: Product, quantity?: number, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  adjustQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  lastRemovedItem: CartItem | null;
  undoRemove: () => void;
  cartCount: number;
  cartSubtotal: number;
  t: (key: TranslationKey) => string;
  formatMoney: (amount: number) => string;
  activeProductId: string | null;
  setActiveProductId: (id: string | null) => void;
  adminUser: AdminUser | null;
  adminLogin: (u: string, p: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'groz_theme';
const LANG_STORAGE_KEY = 'groz_lang';
const CART_STORAGE_KEY = 'groz_cart';
const ADMIN_STORAGE_KEY = 'groz_admin_session';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'bright' || saved === 'dark') return saved;
    } catch {
      // fallback
    }
    return 'dark';
  });

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'bn' || saved === 'en') return saved;
    } catch {
      // fallback
    }
    return 'en';
  });

  // Route state
  const getRouteFromHash = (): NavRoute => {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hash === 'shop') return 'shop';
    if (hash === 'cart') return 'cart';
    if (hash === 'checkout') return 'checkout';
    if (hash === 'about') return 'about';
    if (hash === 'contact') return 'contact';
    if (hash === 'admin') return 'admin';
    return 'home';
  };

  const [route, setRouteState] = useState<NavRoute>(getRouteFromHash);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Products state (seeded initially, dynamic from API)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Admin user state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return sanitizeCartStorage(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null);

  // Fetch products from server
  const refreshProducts = useCallback(async () => {
    try {
      const headers: Record<string, string> = {};
      if (adminUser?.token) {
        headers['Authorization'] = `Bearer ${adminUser.token}`;
      }
      const url = adminUser ? '/api/products?all=true' : '/api/products';
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (err) {
      console.warn('Could not fetch products from server, utilizing local dataset:', err);
    }
  }, [adminUser]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Sync theme
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'bright' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('bright');
    } else {
      root.classList.remove('dark');
      root.classList.add('bright');
    }
  }, [theme]);

  // Sync language
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  }, [language, setLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Sync route with URL Hash
  const setRoute = useCallback((newRoute: NavRoute) => {
    setRouteState(newRoute);
    window.location.hash = newRoute === 'home' ? '' : `#${newRoute}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setRouteState(getRouteFromHash());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Dynamic SEO meta tags (title, description, canonical, OpenGraph, JSON-LD)
  useEffect(() => {
    applyRouteSEO(route, language);
  }, [route, language]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Cart actions
  const addToCart = useCallback((product: Product, quantity = 1, color?: string, size?: string) => {
    const chosenColor = color || product.colors?.[0] || 'Standard';
    const chosenSize = size || product.sizes?.[0] || 'Standard';

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedColor === chosenColor && i.selectedSize === chosenSize
      );
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = clampQuantity(next[existingIndex].quantity + quantity);
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity: clampQuantity(quantity),
          selectedColor: chosenColor,
          selectedSize: chosenSize,
        },
      ];
    });
  }, []);

  const buyNow = useCallback((product: Product, quantity = 1, color?: string, size?: string) => {
    addToCart(product, quantity, color, size);
    setRoute('checkout');
  }, [addToCart, setRoute]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: clampQuantity(quantity) }
          : item
      )
    );
  }, []);

  const adjustQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: clampQuantity(item.quantity + delta) }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const target = prev.find((i) => i.product.id === productId);
      if (target) {
        setLastRemovedItem(target);
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  }, []);

  const undoRemove = useCallback(() => {
    if (lastRemovedItem) {
      setCart((prev) => [...prev, lastRemovedItem]);
      setLastRemovedItem(null);
    }
  }, [lastRemovedItem]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Admin Actions
  const adminLogin = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        const user: AdminUser = { username: data.user.username, role: 'admin', token: data.token };
        setAdminUser(user);
        try {
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
        } catch {
          // ignore
        }
        await refreshProducts();
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  }, [refreshProducts]);

  const adminLogout = useCallback(async () => {
    if (adminUser?.token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminUser.token}` },
        });
      } catch {
        // ignore
      }
    }
    setAdminUser(null);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {
      // ignore
    }
    await refreshProducts();
  }, [adminUser, refreshProducts]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = calculateCartSubtotal(cart);

  const t = useCallback(
    (key: TranslationKey) => translateFn(key, language),
    [language]
  );

  const formatMoney = useCallback(
    (amount: number) => formatBDT(amount, language),
    [language]
  );

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
        route,
        setRoute,
        products,
        refreshProducts,
        cart,
        addToCart,
        buyNow,
        updateQuantity,
        adjustQuantity,
        removeFromCart,
        clearCart,
        lastRemovedItem,
        undoRemove,
        cartCount,
        cartSubtotal,
        t,
        formatMoney,
        activeProductId,
        setActiveProductId,
        adminUser,
        adminLogin,
        adminLogout,
        searchQuery,
        setSearchQuery,
        clearSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

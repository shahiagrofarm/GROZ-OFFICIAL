import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NavRoute } from '../types';
import { Menu, X, ShoppingBag, Sun, Moon, ShieldCheck, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    route,
    setRoute,
    cartCount,
    t,
    searchQuery,
    setSearchQuery,
    clearSearch,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navItems: { id: NavRoute; label: string }[] = [
    { id: 'home', label: t('navHome') },
    { id: 'shop', label: t('navShop') },
    { id: 'cart', label: `${t('navCart')}${cartCount > 0 ? ` (${cartCount})` : ''}` },
    { id: 'checkout', label: t('navCheckout') },
    { id: 'about', label: t('navAbout') },
    { id: 'contact', label: t('navContact') },
  ];

  const handleNavClick = (target: NavRoute) => {
    setRoute(target);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    // Real-time synchronization: switch to catalog route so user immediately views filtered catalog
    if (route !== 'shop') {
      setRoute('shop');
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() && route !== 'shop') {
      setRoute('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-groz-main/90 backdrop-blur-md border-b border-groz transition-colors">
      {/* Top micro ticker showing confirmed atelier coordinates */}
      <div className="w-full border-b border-groz-subtle text-[11px] tracking-widest uppercase font-mono-editorial px-4 py-1.5 flex justify-between items-center text-groz-muted">
        <span className="truncate">
          {t('brandLocation')} &bull; Tel: <a href="tel:+8801604985164" className="hover:text-groz-red transition-colors">01604985164</a>
        </span>
        <span className="hidden sm:inline-block text-groz-red font-medium">
          {t('demoNotice')}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Wordmark & Official Emblem */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group shrink-0 focus:outline-none focus:ring-1 focus:ring-groz-red"
          aria-label="GROZ Home"
        >
          <div className="w-8 h-8 bg-neutral-900 border border-groz flex items-center justify-center overflow-hidden">
            <img
              src="/assets/aistudio/FB_IMG_1792947438632_9dd0b6b3.jpg"
              alt="GROZ Seahorse Hallmark"
              className="w-full h-full object-contain filter brightness-110 contrast-125"
            />
          </div>
          <div>
            <span className="font-serif-editorial text-2xl tracking-[0.3em] font-semibold text-groz-main uppercase group-hover:text-groz-red transition-colors">
              GROZ
            </span>
            <span className="hidden xl:block text-[9px] uppercase tracking-[0.25em] font-mono-editorial text-groz-muted -mt-1">
              Maijdee Court &bull; Noakhali
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 shrink-0" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = route === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs uppercase font-mono-editorial tracking-[0.18em] transition-colors relative py-1 focus:outline-none ${
                  isActive
                    ? 'text-groz-red font-semibold'
                    : 'text-groz-main hover:text-groz-red'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-groz-red" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Global Real-Time Search Bar */}
        <div className="hidden md:flex items-center relative flex-1 max-w-[190px] lg:max-w-[260px] xl:max-w-xs mx-1">
          <label htmlFor="header-global-search" className="sr-only">
            {t('headerSearchAriaLabel')}
          </label>
          <Search className="w-3.5 h-3.5 text-groz-muted absolute left-2.5 pointer-events-none" />
          <input
            id="header-global-search"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder={t('headerSearchPlaceholder')}
            className="w-full pl-8 pr-7 py-1.5 bg-groz-surface border border-groz focus:border-groz-red text-xs font-mono-editorial text-groz-main placeholder:text-groz-muted focus:outline-none focus:ring-1 focus:ring-groz-red transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 text-groz-muted hover:text-groz-red transition-colors p-0.5"
              aria-label={t('headerSearchClear')}
              title={t('headerSearchClear')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls: Language, Theme, Cart, Admin, Mobile Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle Icon */}
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
              if (mobileMenuOpen) setMobileMenuOpen(false);
            }}
            className={`md:hidden p-1.5 border transition-colors focus:outline-none focus:ring-1 focus:ring-groz-red ${
              mobileSearchOpen || searchQuery
                ? 'border-groz-red text-groz-red bg-red-950/20'
                : 'border-groz hover:border-groz-red text-groz-main'
            }`}
            aria-label={t('headerSearchAriaLabel')}
            title={t('headerSearchToggle')}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Toggle: English / Bangla */}
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 text-xs font-mono-editorial tracking-wider border border-groz hover:border-groz-red transition-colors focus:outline-none focus:ring-1 focus:ring-groz-red"
            aria-label={t('selectLanguage')}
            title="Toggle English / Bangla"
          >
            <span className={language === 'en' ? 'font-bold text-groz-red' : 'text-groz-muted'}>
              EN
            </span>
            <span className="mx-1 text-groz-muted">/</span>
            <span className={language === 'bn' ? 'font-bold text-groz-red font-sans-editorial' : 'text-groz-muted font-sans-editorial'}>
              বাং
            </span>
          </button>

          {/* Theme Switch: Dark / Bright */}
          <button
            onClick={toggleTheme}
            className="p-1.5 border border-groz hover:border-groz-red text-groz-main transition-colors focus:outline-none focus:ring-1 focus:ring-groz-red"
            aria-label={t('toggleTheme')}
            title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-800" />
            )}
          </button>

          {/* Cart Icon & Count */}
          <button
            onClick={() => handleNavClick('cart')}
            className={`p-1.5 border transition-colors relative flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-groz-red ${
              route === 'cart'
                ? 'border-groz-red text-groz-red'
                : 'border-groz hover:border-groz-red text-groz-main'
            }`}
            aria-label={`${t('navCart')} (${cartCount} items)`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-mono-editorial font-semibold px-1 min-w-[16px] text-center bg-groz-surface">
              {cartCount}
            </span>
          </button>

          {/* Admin Atelier Portal Access */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`p-1.5 border transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-groz-red ${
              route === 'admin'
                ? 'border-groz-red text-groz-red bg-red-950/20'
                : 'border-groz hover:border-groz-red text-groz-main'
            }`}
            aria-label={t('navAdmin')}
            title={t('navAdmin')}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden lg:inline text-[10px] font-mono-editorial uppercase tracking-wider">
              {t('navAdmin')}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              if (mobileSearchOpen) setMobileSearchOpen(false);
            }}
            className="md:hidden p-1.5 border border-groz hover:border-groz-red text-groz-main transition-colors focus:outline-none focus:ring-1 focus:ring-groz-red"
            aria-label={mobileMenuOpen ? t('menuClose') : t('menuOpen')}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Search Bar Strip */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-groz bg-groz-surface px-4 py-2.5 transition-colors">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-groz-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('headerSearchPlaceholder')}
              className="w-full pl-8 pr-8 py-2 bg-groz-main border border-groz focus:border-groz-red text-xs font-mono-editorial text-groz-main placeholder:text-groz-muted focus:outline-none focus:ring-1 focus:ring-groz-red"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 text-groz-muted hover:text-groz-red p-1"
                aria-label={t('headerSearchClear')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-2.5 text-groz-muted hover:text-groz-main p-1 text-[11px] font-mono-editorial"
                aria-label="Close search bar"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery.trim() && (
            <div className="mt-1.5 text-[10px] font-mono-editorial text-groz-muted flex justify-between items-center">
              <span>{t('searchResultsFor')}: "{searchQuery}"</span>
              <button
                onClick={() => handleNavClick('shop')}
                className="text-groz-red font-semibold hover:underline uppercase"
              >
                {t('navShop')} &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-groz bg-groz-main px-4 py-6 space-y-4 shadow-xl">
          {/* Mobile Drawer Real-time Search Input */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-groz-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                handleSearchChange(e);
                setMobileMenuOpen(false);
              }}
              placeholder={t('headerSearchPlaceholder')}
              className="w-full pl-8 pr-8 py-2 bg-groz-surface border border-groz focus:border-groz-red text-xs font-mono-editorial text-groz-main placeholder:text-groz-muted focus:outline-none focus:ring-1 focus:ring-groz-red"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 text-groz-muted hover:text-groz-red p-1"
                aria-label={t('headerSearchClear')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left py-2 px-3 border-b border-groz-subtle text-sm uppercase font-mono-editorial tracking-[0.2em] flex justify-between items-center ${
                  route === item.id ? 'text-groz-red font-bold' : 'text-groz-main'
                }`}
              >
                <span>{item.label}</span>
                {route === item.id && <span className="w-2 h-2 bg-groz-red" />}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('admin')}
              className={`text-left py-2 px-3 border-b border-groz-subtle text-sm uppercase font-mono-editorial tracking-[0.2em] flex justify-between items-center ${
                route === 'admin' ? 'text-groz-red font-bold' : 'text-groz-muted'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-groz-red" />
                {t('navAdmin')}
              </span>
              {route === 'admin' && <span className="w-2 h-2 bg-groz-red" />}
            </button>
          </div>

          <div className="pt-4 border-t border-groz flex justify-between items-center text-xs font-mono-editorial text-groz-muted">
            <span>{t('brandLocation')}</span>
            <a href="tel:+8801604985164" className="text-groz-red font-semibold">
              01604985164
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

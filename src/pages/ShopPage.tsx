import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { filterProductsByQuery } from '../utils/search';
import { Plus, Minus, ShoppingBag, X, Check, Eye, AlertCircle, Search, Zap } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    t,
    language,
    formatMoney,
    addToCart,
    buyNow,
    products,
    searchQuery,
    setSearchQuery,
    clearSearch,
  } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  // Filter & sort logic matching against names, descriptions, and metadata
  const filteredProducts = useMemo(() => {
    // 1. Filter published and category
    const categoryFiltered = products.filter((item) => {
      if (item.isPublished === false) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      return true;
    });

    // 2. Real-time matching against names and descriptions
    const queryMatched = filterProductsByQuery(categoryFiltered, searchQuery);

    // 3. Sort
    return [...queryMatched].sort((a, b) => {
      const priceA = typeof a.salePriceBDT === 'number' && a.salePriceBDT > 0 ? a.salePriceBDT : a.priceBDT;
      const priceB = typeof b.salePriceBDT === 'number' && b.salePriceBDT > 0 ? b.salePriceBDT : b.priceBDT;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') {
        const nameA = language === 'bn' ? a.nameBn : a.nameEn;
        const nameB = language === 'bn' ? b.nameBn : b.nameEn;
        return nameA.localeCompare(nameB);
      }
      return 0; // featured maintains sequence
    });
  }, [products, selectedCategory, sortBy, searchQuery, language]);

  const handleOpenModal = (product: Product) => {
    setActiveModalProduct(product);
    setModalQuantity(1);
    setSelectedColor(product.colors?.[0] || 'Standard');
    setSelectedSize(product.sizes?.[0] || 'Standard');
    setActiveGalleryIndex(0);
  };

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1, product.colors?.[0], product.sizes?.[0]);
    setAddedNoticeId(product.id);
    setTimeout(() => setAddedNoticeId(null), 2000);
  };

  const handleModalAddToCart = () => {
    if (activeModalProduct) {
      addToCart(activeModalProduct, modalQuantity, selectedColor, selectedSize);
      setAddedNoticeId(activeModalProduct.id);
      setActiveModalProduct(null);
      setTimeout(() => setAddedNoticeId(null), 2000);
    }
  };

  const handleModalBuyNow = () => {
    if (activeModalProduct) {
      buyNow(activeModalProduct, modalQuantity, selectedColor, selectedSize);
      setActiveModalProduct(null);
    }
  };

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: t('catAll') },
    { id: 'outerwear', label: t('catOuterwear') },
    { id: 'leather', label: t('catLeather') },
    { id: 'accessories', label: t('catAccessories') },
    { id: 'timepieces', label: t('catTimepieces') },
  ];

  return (
    <div className="w-full bg-groz-main text-groz-main min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors">
      {/* Page Header */}
      <div className="pb-8 border-b border-groz space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 bg-groz-red" />
          <span>Maijdee Court Atelier Catalog</span>
        </div>
        <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold uppercase tracking-tight text-groz-main">
          {t('shopCatalogTitle')}
        </h1>
        <p className="font-serif-editorial text-lg text-groz-muted max-w-2xl">
          {t('shopCatalogSubtitle')}
        </p>

        {/* Demo Notice Badge */}
        <div className="p-3 bg-groz-surface border border-groz text-xs font-mono-editorial text-groz-muted flex items-start sm:items-center gap-2">
          <AlertCircle className="w-4 h-4 text-groz-red shrink-0 mt-0.5 sm:mt-0" />
          <span>{t('demoPriceNotice')}</span>
        </div>
      </div>

      {/* Control Bar: Categories, Search, and Sorting */}
      <div className="py-6 border-b border-groz flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Product Categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-mono-editorial uppercase tracking-wider transition-colors border focus:outline-none focus:ring-1 focus:ring-groz-red ${
                selectedCategory === cat.id
                  ? 'bg-groz-red text-white border-groz-red font-semibold'
                  : 'bg-groz-main text-groz-main border-groz hover:border-groz-red'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Keyword Search */}
          <div className="relative flex items-center min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-groz-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'অনুসন্ধান করুন...' : 'Search specimens...'}
              className="w-full pl-8 pr-3 py-1.5 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main placeholder:text-groz-muted focus:outline-none focus:border-groz-red"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-groz-muted hover:text-groz-main"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-mono-editorial text-groz-muted uppercase shrink-0">
              {t('sortLabel')}:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-groz-main border border-groz px-3 py-1.5 text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red uppercase cursor-pointer"
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="price-asc">{t('sortPriceAsc')}</option>
              <option value="price-desc">{t('sortPriceDesc')}</option>
              <option value="name">{t('sortName')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Search Filter Banner */}
      {searchQuery.trim() && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 border border-groz bg-groz-surface text-xs font-mono-editorial text-groz-main transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-groz-red inline-block" />
            <span className="text-groz-muted uppercase tracking-wider">{t('searchResultsFor')}:</span>
            <span className="text-groz-red font-bold">"{searchQuery.trim()}"</span>
            <span className="text-groz-muted">
              ({filteredProducts.length} {t('searchResultsCount')})
            </span>
          </div>
          <button
            onClick={clearSearch}
            className="text-xs uppercase tracking-wider text-groz-muted hover:text-groz-red flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-groz-red px-2 py-0.5 border border-groz"
          >
            <X className="w-3 h-3" />
            <span>{t('clearSearchFilter')}</span>
          </button>
        </div>
      )}

      {/* Catalog Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center space-y-4 border-b border-groz">
          <p className="font-serif-editorial text-2xl text-groz-muted">
            {searchQuery.trim() ? t('noSearchMatches') : t('noProductsFound')}
          </p>
          <div className="flex items-center justify-center gap-3">
            {searchQuery.trim() && (
              <button
                onClick={clearSearch}
                className="px-6 py-2.5 bg-groz-red text-white hover:bg-red-700 text-xs font-mono-editorial uppercase tracking-wider transition-colors"
              >
                {t('clearSearchFilter')}
              </button>
            )}
            <button
              onClick={() => {
                setSelectedCategory('all');
                clearSearch();
              }}
              className="px-6 py-2.5 border border-groz hover:border-groz-red text-xs font-mono-editorial uppercase tracking-wider transition-colors"
            >
              {t('filterReset')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {filteredProducts.map((product) => {
            const name = language === 'bn' ? product.nameBn : product.nameEn;
            const subtitle = language === 'bn' ? product.subtitleBn : product.subtitleEn;
            const isJustAdded = addedNoticeId === product.id;
            const effectivePrice = typeof product.salePriceBDT === 'number' && product.salePriceBDT > 0 ? product.salePriceBDT : product.priceBDT;

            return (
              <article
                key={product.id}
                className="border border-groz bg-groz-main flex flex-col justify-between group hover:border-groz-red transition-all"
              >
                {/* Visual Stage */}
                <div className="p-6 bg-neutral-950 flex flex-col justify-between min-h-[290px] relative overflow-hidden border-b border-groz">
                  <div className="flex justify-between items-start z-10">
                    <span className="text-[10px] font-mono-editorial text-neutral-400 uppercase tracking-widest bg-neutral-900/80 px-2 py-0.5 border border-neutral-800">
                      SPECIMEN &bull; {product.id.split('-').pop()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {product.isSale && (
                        <span className="text-[9px] font-mono-editorial uppercase px-1.5 py-0.5 bg-amber-600 text-white font-bold">
                          {t('sale')}
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span className="text-[9px] font-mono-editorial uppercase px-1.5 py-0.5 bg-neutral-800 text-neutral-200 border border-neutral-700">
                          {t('newArrival')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Centered Image */}
                  <div className="my-auto py-6 flex items-center justify-center">
                    <div className="w-28 h-36 relative flex items-center justify-center cursor-pointer" onClick={() => handleOpenModal(product)}>
                      <img
                        src={product.image}
                        alt={product.imageAlt || name}
                        className="w-full h-full object-contain filter brightness-110 contrast-125 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Quick Inspection Action & Stock Indicator */}
                  <div className="flex justify-between items-center z-10 pt-2 border-t border-neutral-800/60">
                    <span className={`text-[10px] font-mono-editorial uppercase ${
                      product.stockStatus === 'out_of_stock' ? 'text-red-500 font-bold' :
                      product.stockStatus === 'low_stock' ? 'text-amber-400' : 'text-neutral-400'
                    }`}>
                      {product.stockStatus === 'out_of_stock' ? t('outOfStock') :
                       product.stockStatus === 'low_stock' ? t('lowStock') : t('inStock')}
                    </span>
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="text-[11px] font-mono-editorial text-white hover:text-red-400 flex items-center gap-1 focus:outline-none"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('viewDetails')}</span>
                    </button>
                  </div>
                </div>

                {/* Content Dossier */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3
                        onClick={() => handleOpenModal(product)}
                        className="font-serif-editorial text-xl font-bold uppercase tracking-tight text-groz-main cursor-pointer hover:text-groz-red transition-colors"
                      >
                        {name}
                      </h3>
                      <div className="text-right shrink-0">
                        {product.salePriceBDT ? (
                          <div>
                            <span className="font-mono-editorial text-sm font-semibold text-groz-red block">
                              {formatMoney(product.salePriceBDT)}
                            </span>
                            <span className="font-mono-editorial text-[10px] text-groz-muted line-through block">
                              {formatMoney(product.priceBDT)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-mono-editorial text-sm font-semibold text-groz-red">
                            {formatMoney(product.priceBDT)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-serif-editorial text-groz-muted italic">
                      {subtitle}
                    </p>

                    <p className="text-xs font-serif-editorial text-groz-main line-clamp-2 leading-relaxed pt-1">
                      {language === 'bn' ? product.descriptionBn : product.descriptionEn}
                    </p>
                  </div>

                  {/* Action Buttons: Add to Cart & Buy Now */}
                  <div className="pt-4 border-t border-groz-subtle flex items-center gap-2">
                    <button
                      onClick={() => handleQuickAdd(product)}
                      aria-label={`${t('addToCart')} ${name}`}
                      disabled={product.stockStatus === 'out_of_stock'}
                      className={`flex-1 py-2.5 px-3 text-xs font-mono-editorial uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 focus:outline-none disabled:opacity-40 ${
                        isJustAdded
                          ? 'bg-neutral-800 text-white'
                          : 'bg-groz-main border border-groz hover:border-groz-red text-groz-main hover:text-groz-red'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-500" />
                          <span>{t('addedToCart')}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{t('addToCart')}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => buyNow(product, 1, product.colors?.[0], product.sizes?.[0])}
                      disabled={product.stockStatus === 'out_of_stock'}
                      className="py-2.5 px-3 bg-groz-red hover:bg-red-700 text-white text-xs font-mono-editorial uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{t('buyNow')}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          PRODUCT DETAIL MODAL / SPECIMEN INSPECTOR
          ========================================================================= */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-groz-main border border-groz max-w-4xl w-full my-auto overflow-hidden shadow-2xl relative">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-groz flex justify-between items-center bg-groz-surface">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-groz-red" />
                <span className="text-xs font-mono-editorial uppercase tracking-[0.25em] text-groz-main font-semibold">
                  {t('productDetailHeading')} &bull; {activeModalProduct.id}
                </span>
              </div>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="p-1 border border-groz hover:border-groz-red text-groz-main transition-colors focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[75vh] overflow-y-auto">
              {/* Product Visual Gallery */}
              <div className="md:col-span-5 flex flex-col justify-between items-center text-center">
                <div className="w-full bg-neutral-950 p-6 border border-groz flex flex-col items-center">
                  <div className="text-[10px] font-mono-editorial text-neutral-400 uppercase tracking-widest mb-4">
                    MAIJDEE COURT SPECIMEN
                  </div>
                  <div className="w-40 h-52 flex items-center justify-center">
                    <img
                      src={activeModalProduct.gallery?.[activeGalleryIndex] || activeModalProduct.image}
                      alt={language === 'bn' ? activeModalProduct.nameBn : activeModalProduct.nameEn}
                      className="w-full h-full object-contain filter brightness-110 contrast-125"
                    />
                  </div>
                  <div className="text-[10px] font-mono-editorial text-red-500 uppercase tracking-wider mt-4">
                    {activeModalProduct.stockStatus === 'out_of_stock' ? t('outOfStock') :
                     activeModalProduct.stockStatus === 'low_stock' ? t('lowStock') : t('inStock')}
                  </div>
                </div>

                {/* Gallery Thumbnails */}
                {Array.isArray(activeModalProduct.gallery) && activeModalProduct.gallery.length > 1 && (
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto w-full">
                    {activeModalProduct.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveGalleryIndex(idx)}
                        className={`w-12 h-14 border p-1 bg-neutral-950 shrink-0 ${
                          activeGalleryIndex === idx ? 'border-groz-red' : 'border-groz'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Specifications */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-groz-main">
                    {language === 'bn' ? activeModalProduct.nameBn : activeModalProduct.nameEn}
                  </h2>
                  <p className="font-serif-editorial text-sm text-groz-muted italic mt-1">
                    {language === 'bn' ? activeModalProduct.subtitleBn : activeModalProduct.subtitleEn}
                  </p>

                  <div className="mt-3 flex items-baseline gap-3">
                    {activeModalProduct.salePriceBDT ? (
                      <>
                        <span className="font-mono-editorial text-2xl font-bold text-groz-red">
                          {formatMoney(activeModalProduct.salePriceBDT)}
                        </span>
                        <span className="font-mono-editorial text-sm text-groz-muted line-through">
                          {formatMoney(activeModalProduct.priceBDT)}
                        </span>
                      </>
                    ) : (
                      <span className="font-mono-editorial text-2xl font-bold text-groz-red">
                        {formatMoney(activeModalProduct.priceBDT)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-serif-editorial text-sm text-groz-main leading-relaxed">
                  {language === 'bn' ? activeModalProduct.descriptionBn : activeModalProduct.descriptionEn}
                </p>

                {/* Variants: Color selection */}
                {Array.isArray(activeModalProduct.colors) && activeModalProduct.colors.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-mono-editorial uppercase text-groz-muted block font-semibold">
                      {t('colorLabel')}: <span className="text-groz-main font-bold">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeModalProduct.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1.5 text-xs font-mono-editorial border transition-colors ${
                            selectedColor === c
                              ? 'border-groz-red bg-groz-surface text-groz-red font-bold'
                              : 'border-groz text-groz-main hover:border-groz-red/60'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variants: Size selection */}
                {Array.isArray(activeModalProduct.sizes) && activeModalProduct.sizes.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-mono-editorial uppercase text-groz-muted block font-semibold">
                      {t('sizeLabel')}: <span className="text-groz-main font-bold">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeModalProduct.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1.5 text-xs font-mono-editorial border transition-colors ${
                            selectedSize === s
                              ? 'border-groz-red bg-groz-surface text-groz-red font-bold'
                              : 'border-groz text-groz-main hover:border-groz-red/60'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specs Table */}
                {Array.isArray(activeModalProduct.specifications) && activeModalProduct.specifications.length > 0 && (
                  <div className="border border-groz divide-y divide-groz text-xs font-mono-editorial">
                    {activeModalProduct.specifications.map((spec, idx) => (
                      <div key={idx} className="p-2.5 flex justify-between items-center">
                        <span className="text-groz-muted">
                          {language === 'bn' ? spec.labelBn : spec.labelEn}
                        </span>
                        <span className="text-groz-main font-medium">
                          {language === 'bn' ? spec.valueBn : spec.valueEn}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Material Transparency Note */}
                <div className="p-3 bg-groz-surface border border-groz text-xs font-mono-editorial text-groz-muted">
                  <span className="text-groz-red font-semibold uppercase block mb-1">Material Integrity Note:</span>
                  {language === 'bn' ? activeModalProduct.materialsStatusBn : activeModalProduct.materialsStatusEn}
                </div>

                {/* Quantity Controls & Dual Action Buttons */}
                <div className="pt-4 border-t border-groz space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-mono-editorial tracking-wider text-groz-muted">
                      {t('quantity')}:
                    </span>
                    <div className="flex items-center border border-groz">
                      <button
                        onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                        className="px-3 py-1.5 hover:bg-groz-surface text-groz-main transition-colors focus:outline-none"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 py-1.5 text-xs font-mono-editorial font-bold text-groz-main border-x border-groz min-w-[36px] text-center">
                        {modalQuantity}
                      </span>
                      <button
                        onClick={() => setModalQuantity(Math.min(99, modalQuantity + 1))}
                        className="px-3 py-1.5 hover:bg-groz-surface text-groz-main transition-colors focus:outline-none"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleModalAddToCart}
                      disabled={activeModalProduct.stockStatus === 'out_of_stock'}
                      className="w-full py-3 px-4 border border-groz hover:border-groz-red text-groz-main font-mono-editorial text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t('addToCart')}</span>
                    </button>

                    <button
                      onClick={handleModalBuyNow}
                      disabled={activeModalProduct.stockStatus === 'out_of_stock'}
                      className="w-full py-3 px-4 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-40 shadow-lg"
                    >
                      <Zap className="w-4 h-4" />
                      <span>{t('buyNow')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

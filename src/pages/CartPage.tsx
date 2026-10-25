import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateCartSubtotal, generateWhatsAppOrderURL } from '../utils/cart';
import { Trash2, Plus, Minus, ArrowRight, MessageCircle, Phone, ShoppingBag, RotateCcw, AlertTriangle } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    adjustQuantity,
    removeFromCart,
    clearCart,
    lastRemovedItem,
    undoRemove,
    t,
    language,
    formatMoney,
    setRoute,
  } = useApp();

  const [customerNote, setCustomerNote] = useState('');
  const subtotal = calculateCartSubtotal(cart);

  const handleWhatsAppCheckout = () => {
    const url = generateWhatsAppOrderURL(
      cart,
      language,
      customerNote.trim() ? { customerNotes: customerNote.trim() } : undefined
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-groz-main text-groz-main min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors">
      {/* Page Header */}
      <div className="pb-8 border-b border-groz space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 bg-groz-red" />
          <span>Atelier Order Inquiry Protocol</span>
        </div>
        <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold uppercase tracking-tight text-groz-main">
          {t('cartTitle')}
        </h1>
        <p className="font-serif-editorial text-lg text-groz-muted max-w-2xl">
          {t('cartSubtitle')}
        </p>
      </div>

      {/* Undo Item Removal Banner */}
      {lastRemovedItem && (
        <div className="my-6 p-4 bg-groz-surface border border-groz-red/40 flex items-center justify-between text-xs font-mono-editorial">
          <div className="flex items-center gap-2 text-groz-main">
            <span className="text-groz-red font-semibold">&bull;</span>
            <span>
              {t('itemRemovedMsg')} (
              {language === 'bn' ? lastRemovedItem.product.nameBn : lastRemovedItem.product.nameEn})
            </span>
          </div>
          <button
            onClick={undoRemove}
            className="flex items-center gap-1.5 text-groz-red hover:underline font-semibold uppercase focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('undoRemoval')}</span>
          </button>
        </div>
      )}

      {/* Cart Content: Empty State vs Active List */}
      {cart.length === 0 ? (
        <div className="py-24 border-b border-groz text-center space-y-6">
          <div className="w-16 h-16 mx-auto border border-groz bg-groz-surface flex items-center justify-center text-groz-muted">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-editorial text-3xl font-bold uppercase text-groz-main">
              {t('cartEmpty')}
            </h2>
            <p className="font-serif-editorial text-base text-groz-muted">
              {t('cartEmptyPrompt')}
            </p>
          </div>
          <button
            onClick={() => setRoute('shop')}
            className="px-8 py-3.5 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-[0.2em] font-semibold transition-colors inline-flex items-center gap-2 focus:outline-none"
          >
            <span>{t('backToShop')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Items Dossier */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-groz divide-y divide-groz bg-groz-main">
              {cart.map((item) => {
                const name = language === 'bn' ? item.product.nameBn : item.product.nameEn;
                const subtitle = language === 'bn' ? item.product.subtitleBn : item.product.subtitleEn;
                const lineTotal = item.product.priceBDT * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    {/* Thumbnail & Product Details */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-24 bg-neutral-950 border border-groz shrink-0 p-2 flex items-center justify-center">
                        <img
                          src={item.product.image}
                          alt={name}
                          className="w-full h-full object-contain filter brightness-110 contrast-125"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono-editorial text-groz-muted uppercase tracking-widest block">
                          SPECIMEN &bull; {item.product.id}
                        </span>
                        <h3 className="font-serif-editorial text-lg sm:text-xl font-bold uppercase text-groz-main">
                          {name}
                        </h3>
                        <p className="text-xs font-serif-editorial text-groz-muted italic">
                          {subtitle}
                        </p>
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="text-[11px] font-mono-editorial text-groz-main">
                            <span className="text-groz-muted">Variant: </span>
                            {[item.selectedColor, item.selectedSize].filter(Boolean).join(' • ')}
                          </div>
                        )}
                        <div className="text-xs font-mono-editorial text-groz-muted pt-1">
                          {t('unitPrice')}: {formatMoney(item.product.salePriceBDT || item.product.priceBDT)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Optional ±10 adjustments */}
                    <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                      <div className="flex items-center gap-1 border border-groz bg-groz-main">
                        {/* Step -10 */}
                        <button
                          onClick={() => adjustQuantity(item.product.id, -10)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 text-[10px] font-mono-editorial text-groz-muted hover:text-groz-main disabled:opacity-30 border-r border-groz"
                          title="Decrease by 10"
                        >
                          -10
                        </button>

                        {/* Step -1 */}
                        <button
                          onClick={() => adjustQuantity(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1.5 text-groz-main hover:bg-groz-surface disabled:opacity-30"
                          aria-label={`Decrease ${name} quantity`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="px-3 py-1 text-xs font-mono-editorial font-bold text-groz-main min-w-[32px] text-center border-x border-groz">
                          {item.quantity}
                        </span>

                        {/* Step +1 */}
                        <button
                          onClick={() => adjustQuantity(item.product.id, 1)}
                          disabled={item.quantity >= 99}
                          className="p-1.5 text-groz-main hover:bg-groz-surface disabled:opacity-30"
                          aria-label={`Increase ${name} quantity`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        {/* Step +10 */}
                        <button
                          onClick={() => adjustQuantity(item.product.id, 10)}
                          disabled={item.quantity >= 99}
                          className="px-2 py-1 text-[10px] font-mono-editorial text-groz-muted hover:text-groz-main disabled:opacity-30 border-l border-groz"
                          title="Increase by 10"
                        >
                          +10
                        </button>
                      </div>

                      {/* Line Total & Remove button */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full">
                        <div className="text-sm font-mono-editorial font-bold text-groz-main">
                          {formatMoney((item.product.salePriceBDT || item.product.priceBDT) * item.quantity)}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-groz-muted hover:text-groz-red transition-colors focus:outline-none"
                          aria-label={`Remove ${name} from dossier`}
                          title={t('remove')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <button
                onClick={() => setRoute('shop')}
                className="text-xs font-mono-editorial uppercase tracking-wider text-groz-muted hover:text-groz-main flex items-center gap-1.5"
              >
                &larr; {t('backToShop')}
              </button>

              <button
                onClick={clearCart}
                className="text-xs font-mono-editorial uppercase tracking-wider text-groz-muted hover:text-groz-red"
              >
                {t('clearCart')}
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Pay & Buy CTA */}
          <div className="lg:col-span-4 border border-groz bg-groz-main p-6 sm:p-8 space-y-6">
            <h2 className="text-xs uppercase font-mono-editorial tracking-[0.25em] text-groz-main font-bold border-b border-groz pb-3">
              {t('orderSummary')}
            </h2>

            <div className="space-y-3 text-xs font-mono-editorial">
              <div className="flex justify-between items-center text-groz-muted">
                <span>{t('subtotal')}:</span>
                <span className="font-semibold text-groz-main">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-groz-muted">
                <span>Delivery:</span>
                <span className="text-groz-muted">Calculated at Pay & Buy (৳60 / ৳120)</span>
              </div>
              <div className="pt-3 border-t border-groz flex justify-between items-baseline text-sm font-bold text-groz-main">
                <span>{t('subtotal')}:</span>
                <span className="text-xl text-groz-red">{formatMoney(subtotal)}</span>
              </div>
            </div>

            {/* Primary Action: Go to Pay & Buy */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setRoute('checkout')}
                className="w-full py-4 px-6 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-3 focus:outline-none shadow-lg"
              >
                <span>{t('proceedToPay')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-3 px-6 border border-groz hover:border-groz-red text-groz-main font-mono-editorial text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5 text-groz-red" />
                <span>Quick WhatsApp Inquiry</span>
              </button>
            </div>

            {/* Transparent E-Commerce Disclaimer */}
            <div className="p-3 bg-groz-surface border border-groz text-[11px] font-mono-editorial text-groz-muted flex items-start gap-2 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-groz-red shrink-0 mt-0.5" />
              <span>{t('checkoutNotice')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

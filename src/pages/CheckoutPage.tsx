import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import { BUSINESS_CONFIG } from '../config/business';
import { validateBangladeshiPhone, generateWhatsAppOrderURL } from '../utils/cart';
import {
  Copy,
  Check,
  MessageCircle,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CreditCard,
  Send,
  Phone,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, formatMoney, t, language, setRoute, clearCart } = useApp();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'inside_noakhali' | 'outside_noakhali'>('inside_noakhali');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // UI status
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  const deliveryCharge =
    deliveryArea === 'inside_noakhali'
      ? BUSINESS_CONFIG.delivery.insideNoakhaliBDT
      : BUSINESS_CONFIG.delivery.outsideNoakhaliBDT;

  const orderTotal = cartSubtotal + deliveryCharge;

  const activePaymentConfig = BUSINESS_CONFIG.paymentMethods.find((p) => p.id === paymentMethod)!;

  const handleCopyNumber = () => {
    const textToCopy = activePaymentConfig.number;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(textToCopy).then(
          () => {
            setCopiedNumber(true);
            setTimeout(() => setCopiedNumber(false), 2000);
          },
          () => {
            fallbackCopy(textToCopy);
          }
        );
      } else {
        fallbackCopy(textToCopy);
      }
    } catch {
      fallbackCopy(textToCopy);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    } catch {
      // In constrained environments where clipboard is blocked, show copied indicator
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) {
      errs.name = t('formErrorRequired');
    }
    if (!customerPhone.trim()) {
      errs.phone = t('formErrorRequired');
    } else if (!validateBangladeshiPhone(customerPhone)) {
      errs.phone = t('formErrorPhone');
    }
    if (!deliveryAddress.trim()) {
      errs.address = t('formErrorRequired');
    }
    if (!transactionId.trim()) {
      errs.trxId = t('formErrorRequired');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 1. Direct WhatsApp Ordering
  const handlePlaceOrderWhatsApp = () => {
    if (!validate()) return;

    const url = generateWhatsAppOrderURL(cart, language, {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      deliveryArea,
      paymentMethod,
      transactionId: transactionId.trim(),
      customerNotes: customerNotes.trim() || undefined,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 2. Submit order to atelier server database & generate reference
  const handleSubmitOrderToDatabase = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryAddress: deliveryAddress.trim(),
        deliveryArea,
        paymentMethod,
        transactionId: transactionId.trim(),
        customerNotes: customerNotes.trim() || undefined,
        items: cart.map((i) => ({
          productId: i.product.id,
          productName: language === 'bn' ? i.product.nameBn : i.product.nameEn,
          priceBDT: typeof i.product.salePriceBDT === 'number' && i.product.salePriceBDT > 0 ? i.product.salePriceBDT : i.product.priceBDT,
          quantity: i.quantity,
          color: i.selectedColor,
          size: i.selectedSize,
          image: i.product.image,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setConfirmedOrder(data.order);
        clearCart();
      } else {
        setSubmissionError(data.error || 'Failed to register order with atelier.');
      }
    } catch (err: any) {
      setSubmissionError('Network error while registering order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedOrder) {
    const whatsappUrl = generateWhatsAppOrderURL(
      confirmedOrder.items.map((item: any) => ({
        product: {
          id: item.productId,
          slug: item.productId,
          nameEn: item.productName,
          nameBn: item.productName,
          subtitleEn: '',
          subtitleBn: '',
          category: 'outerwear',
          priceBDT: item.priceBDT,
          image: item.image,
          gallery: [item.image],
          descriptionEn: '',
          descriptionBn: '',
          specifications: [],
          materialsStatusEn: '',
          materialsStatusBn: '',
          dimensionsEn: '',
          dimensionsBn: '',
          colors: [item.color || 'Standard'],
          sizes: [item.size || 'Standard'],
          stockStatus: 'in_stock',
          stockQuantity: 10,
          isFeatured: false,
          isNewArrival: false,
          isSale: false,
          isPublished: true,
          imageAlt: item.productName,
          createdAt: '',
          updatedAt: '',
        },
        quantity: item.quantity,
        selectedColor: item.color,
        selectedSize: item.size,
      })),
      language,
      {
        orderRef: confirmedOrder.id,
        customerName: confirmedOrder.customerName,
        customerPhone: confirmedOrder.customerPhone,
        deliveryAddress: confirmedOrder.deliveryAddress,
        deliveryArea: confirmedOrder.deliveryArea,
        paymentMethod: confirmedOrder.paymentMethod,
        transactionId: confirmedOrder.transactionId,
        customerNotes: confirmedOrder.customerNotes,
      }
    );

    return (
      <div className="w-full bg-groz-main text-groz-main min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border border-groz bg-groz-main p-8 sm:p-12 space-y-8 shadow-2xl relative">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-red-600/10 border border-groz-red mx-auto flex items-center justify-center text-groz-red">
              <Check className="w-8 h-8" />
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold uppercase text-groz-main">
              {t('orderConfirmedTitle')}
            </h1>
            <p className="font-serif-editorial text-base text-groz-muted">
              {t('orderRecordedMsg')}
            </p>
          </div>

          <div className="p-6 border border-groz bg-groz-surface space-y-4 font-mono-editorial text-xs">
            <div className="flex justify-between items-center border-b border-groz pb-2">
              <span className="text-groz-muted uppercase">{t('orderRefLabel')}:</span>
              <span className="text-sm font-bold text-groz-red tracking-wider">{confirmedOrder.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-groz-muted">Customer:</span>
              <span className="font-medium text-groz-main">{confirmedOrder.customerName} ({confirmedOrder.customerPhone})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-groz-muted">Delivery Address:</span>
              <span className="font-medium text-groz-main text-right">{confirmedOrder.deliveryAddress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-groz-muted">Payment Channel:</span>
              <span className="font-medium text-groz-main uppercase">{confirmedOrder.paymentMethod} &bull; TrxID: {confirmedOrder.transactionId}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-groz text-sm font-bold text-groz-main">
              <span>Total Payable:</span>
              <span className="text-groz-red">{formatMoney(confirmedOrder.totalBDT)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-3 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('forwardWhatsAppAction')}</span>
            </a>

            <button
              onClick={() => setRoute('shop')}
              className="w-full py-3 px-6 border border-groz hover:border-groz-red text-groz-main font-mono-editorial text-xs uppercase tracking-[0.2em] transition-colors"
            >
              {t('continueShopping')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="w-full bg-groz-main text-groz-main min-h-screen py-24 px-4 max-w-3xl mx-auto text-center space-y-6">
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
          className="px-8 py-3.5 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-[0.2em] font-semibold transition-colors inline-flex items-center gap-2"
        >
          <span>{t('backToShop')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-groz-main text-groz-main min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors">
      {/* Header */}
      <div className="pb-8 border-b border-groz space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 bg-groz-red" />
          <span>Section 01 &bull; Direct Checkout Protocol</span>
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-5xl font-bold uppercase tracking-tight text-groz-main">
          {t('checkoutTitle')}
        </h1>
        <p className="font-serif-editorial text-base sm:text-lg text-groz-muted max-w-2xl">
          {t('checkoutSubtitle')}
        </p>
      </div>

      <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form Stage (Steps 1 & 2) */}
        <div className="lg:col-span-7 space-y-10">
          {/* STEP 1: Customer & Destination */}
          <div className="border border-groz bg-groz-main p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-groz pb-3">
              <MapPin className="w-4 h-4 text-groz-red" />
              <h2 className="text-xs uppercase font-mono-editorial tracking-[0.25em] font-bold text-groz-main">
                {t('stepCustomer')}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                  {t('fullNameLabel')}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t('fullNamePlaceholder')}
                  className={`w-full p-3 bg-groz-main border text-xs font-mono-editorial text-groz-main focus:outline-none ${
                    errors.name ? 'border-groz-red' : 'border-groz focus:border-groz-red'
                  }`}
                />
                {errors.name && <p className="text-[11px] font-mono-editorial text-groz-red">{errors.name}</p>}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                    {t('phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    className={`w-full p-3 bg-groz-main border text-xs font-mono-editorial text-groz-main focus:outline-none ${
                      errors.phone ? 'border-groz-red' : 'border-groz focus:border-groz-red'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] font-mono-editorial text-groz-red">{errors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                    {t('emailLabel')}
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="w-full p-3 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <label className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                  {t('addressLabel')}
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder={t('addressPlaceholder')}
                  className={`w-full p-3 bg-groz-main border text-xs font-mono-editorial text-groz-main focus:outline-none ${
                    errors.address ? 'border-groz-red' : 'border-groz focus:border-groz-red'
                  }`}
                />
                {errors.address && <p className="text-[11px] font-mono-editorial text-groz-red">{errors.address}</p>}
              </div>

              {/* Delivery Destination Region */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                  {t('deliveryAreaLabel')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('inside_noakhali')}
                    className={`p-3 text-left border text-xs font-mono-editorial transition-all ${
                      deliveryArea === 'inside_noakhali'
                        ? 'border-groz-red bg-groz-surface text-groz-red font-semibold'
                        : 'border-groz text-groz-muted hover:border-groz-red/60'
                    }`}
                  >
                    <div className="font-semibold text-groz-main">{t('insideNoakhali')}</div>
                    <div className="text-[10px] text-groz-muted mt-1">{BUSINESS_CONFIG.delivery.estimatedDaysInside}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryArea('outside_noakhali')}
                    className={`p-3 text-left border text-xs font-mono-editorial transition-all ${
                      deliveryArea === 'outside_noakhali'
                        ? 'border-groz-red bg-groz-surface text-groz-red font-semibold'
                        : 'border-groz text-groz-muted hover:border-groz-red/60'
                    }`}
                  >
                    <div className="font-semibold text-groz-main">{t('outsideNoakhali')}</div>
                    <div className="text-[10px] text-groz-muted mt-1">{BUSINESS_CONFIG.delivery.estimatedDaysOutside}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Bangladeshi Mobile Payment Methods */}
          <div className="border border-groz bg-groz-main p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-groz pb-3">
              <CreditCard className="w-4 h-4 text-groz-red" />
              <h2 className="text-xs uppercase font-mono-editorial tracking-[0.25em] font-bold text-groz-main">
                {t('stepPayment')}
              </h2>
            </div>

            {/* Payment Method Cards */}
            <div className="space-y-3">
              <label className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                {t('selectPaymentMethod')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BUSINESS_CONFIG.paymentMethods.map((pm) => {
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3 border flex flex-col items-center justify-center gap-2 transition-all text-center ${
                        isSelected
                          ? 'border-groz-red bg-groz-surface shadow-sm'
                          : 'border-groz bg-groz-main hover:border-groz-red/50'
                      }`}
                    >
                      <span
                        className="text-xs font-mono-editorial font-bold px-2 py-0.5"
                        style={{ color: pm.brandColor }}
                      >
                        {pm.name}
                      </span>
                      <span className="text-[10px] font-mono-editorial text-groz-muted uppercase">
                        {pm.accountType}
                      </span>
                      {isSelected && <span className="w-1.5 h-1.5 bg-groz-red mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Payment Number Display & Copy Number Action */}
            <div className="p-4 border border-groz bg-groz-surface/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono-editorial uppercase tracking-wider text-groz-muted block">
                    {activePaymentConfig.name} ({activePaymentConfig.accountType}) Mobile Number:
                  </span>
                  <span className="text-xl font-mono-editorial font-bold text-groz-main tracking-wider">
                    {activePaymentConfig.number}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-4 py-2 border border-groz hover:border-groz-red text-xs font-mono-editorial uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 bg-groz-main shrink-0"
                >
                  {copiedNumber ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-500">{t('copiedNumber')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-groz-red" />
                      <span>{t('copyNumber')}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs font-serif-editorial text-groz-muted italic border-t border-groz-subtle pt-2">
                {language === 'bn' ? activePaymentConfig.instructionBn : activePaymentConfig.instructionEn}
              </p>
            </div>

            {/* Transaction ID & Notes */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                  {t('trxIdLabel')}
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder={t('trxIdPlaceholder')}
                  className={`w-full p-3 bg-groz-main border text-xs font-mono-editorial text-groz-main uppercase tracking-widest focus:outline-none ${
                    errors.trxId ? 'border-groz-red' : 'border-groz focus:border-groz-red'
                  }`}
                />
                {errors.trxId && <p className="text-[11px] font-mono-editorial text-groz-red">{errors.trxId}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                  {t('orderNotesLabel')}
                </label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder={t('orderNotesPlaceholder')}
                  className="w-full p-3 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
                />
              </div>
            </div>

            {/* Notice regarding manual vs API verification */}
            <div className="p-3 bg-groz-surface border border-groz text-[11px] font-mono-editorial text-groz-muted flex items-start gap-2 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-groz-red shrink-0 mt-0.5" />
              <span>{t('paymentNoticeManual')}</span>
            </div>
          </div>
        </div>

        {/* Right Stage: Order Summary & Place Order (Step 3) */}
        <div className="lg:col-span-5 border border-groz bg-groz-main p-6 sm:p-8 space-y-6 sticky top-24">
          <div className="flex items-center gap-3 border-b border-groz pb-3">
            <ShoppingBag className="w-4 h-4 text-groz-red" />
            <h2 className="text-xs uppercase font-mono-editorial tracking-[0.25em] font-bold text-groz-main">
              {t('stepSummary')}
            </h2>
          </div>

          {/* Itemized Specimens in Cart */}
          <div className="divide-y divide-groz-subtle border-b border-groz pb-4 max-h-72 overflow-y-auto space-y-3">
            {cart.map((item, idx) => {
              const name = language === 'bn' ? item.product.nameBn : item.product.nameEn;
              const unitPrice = typeof item.product.salePriceBDT === 'number' && item.product.salePriceBDT > 0
                ? item.product.salePriceBDT
                : item.product.priceBDT;
              const lineTotal = unitPrice * item.quantity;
              const variantText = [item.selectedColor, item.selectedSize].filter(Boolean).join(' • ');

              return (
                <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs font-mono-editorial">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-groz-main block font-serif-editorial text-sm">
                      {name}
                    </span>
                    {variantText && <span className="text-[10px] text-groz-muted block">{variantText}</span>}
                    <span className="text-groz-muted block">
                      {item.quantity} × {formatMoney(unitPrice)}
                    </span>
                  </div>
                  <span className="font-bold text-groz-main shrink-0">
                    {formatMoney(lineTotal)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing Math */}
          <div className="space-y-2 text-xs font-mono-editorial">
            <div className="flex justify-between items-center text-groz-muted">
              <span>{t('subtotal')}:</span>
              <span className="font-medium text-groz-main">{formatMoney(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-groz-muted">
              <span>{t('deliveryCharge')} ({deliveryArea === 'inside_noakhali' ? 'Maijdee Express' : 'Curated Courier'}):</span>
              <span className="font-medium text-groz-main">{formatMoney(deliveryCharge)}</span>
            </div>
            <div className="pt-3 border-t border-groz flex justify-between items-baseline text-base font-bold text-groz-main">
              <span>{t('total')}:</span>
              <span className="text-xl text-groz-red">{formatMoney(orderTotal)}</span>
            </div>
          </div>

          {/* Prominent Action Buttons */}
          <div className="space-y-3 pt-2">
            {submissionError && (
              <div className="p-3 bg-red-950/40 border border-groz-red text-xs font-mono-editorial text-red-300">
                {submissionError}
              </div>
            )}
            {/* Primary Action 1: Place Order on WhatsApp */}
            <button
              type="button"
              onClick={handlePlaceOrderWhatsApp}
              className="w-full py-4 px-6 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-3 shadow-lg focus:outline-none"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('placeOrderWhatsApp')}</span>
            </button>

            {/* Primary Action 2: Confirm in Atelier Database Registry */}
            <button
              type="button"
              onClick={handleSubmitOrderToDatabase}
              disabled={isSubmitting}
              className="w-full py-3 px-6 border border-groz hover:border-groz-red text-groz-main font-mono-editorial text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 bg-groz-main disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-groz-red" />
              <span>{isSubmitting ? 'Registering...' : t('submitOrderAtelier')}</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => setRoute('cart')}
              className="text-xs font-mono-editorial text-groz-muted hover:text-groz-main transition-colors uppercase tracking-wider"
            >
              &larr; Return to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

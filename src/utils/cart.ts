import { CartItem, Product, Language, PaymentMethod } from '../types';
import { BUSINESS_CONFIG } from '../config/business';

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

/**
 * Calculates line total for a single product entry (considering sale price if available)
 */
export function calculateLineTotal(product: Product, quantity: number): number {
  const safeQty = Math.max(0, Math.floor(quantity));
  const effectivePrice = typeof product.salePriceBDT === 'number' && product.salePriceBDT > 0
    ? product.salePriceBDT
    : product.priceBDT;
  return effectivePrice * safeQty;
}

/**
 * Calculates cumulative cart subtotal
 */
export function calculateCartSubtotal(items: CartItem[]): number {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    if (!item?.product || typeof item.product.priceBDT !== 'number') return sum;
    return sum + calculateLineTotal(item.product, item.quantity);
  }, 0);
}

/**
 * Counts total quantity of all items
 */
export function calculateTotalItemsCount(items: CartItem[]): number {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);
}

/**
 * Clamps quantity within supported bounds [1, 99]
 */
export function clampQuantity(qty: number, min = MIN_QUANTITY, max = MAX_QUANTITY): number {
  if (isNaN(qty) || !Number.isFinite(qty)) return min;
  const intVal = Math.floor(qty);
  if (intVal < min) return min;
  if (intVal > max) return max;
  return intVal;
}

/**
 * Adjusts quantity by a step (e.g. +1, -1, +10, -10)
 */
export function adjustQuantityByStep(current: number, delta: number): number {
  return clampQuantity(current + delta);
}

/**
 * Converts English digits to Bengali digits
 */
export function toBengaliNumerals(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}

/**
 * Formats price in BDT with proper Bengali / English numerals
 */
export function formatBDT(amount: number, lang: Language = 'en'): string {
  const safeAmount = Math.max(0, Math.round(amount));
  const formatted = safeAmount.toLocaleString('en-US');
  if (lang === 'bn') {
    return `৳${toBengaliNumerals(formatted)}`;
  }
  return `৳${formatted}`;
}

/**
 * Validates a Bangladeshi mobile phone number (e.g. 01XXXXXXXXX or +8801XXXXXXXXX)
 */
export function validateBangladeshiPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const clean = phone.replace(/[\s-]/g, '');
  const bdPattern = /^(?:\+?880|0)1[3-9]\d{8}$/;
  return bdPattern.test(clean);
}

export interface CheckoutDetails {
  orderRef?: string;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  deliveryArea?: 'inside_noakhali' | 'outside_noakhali';
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  customerNotes?: string;
  whatsappNumber?: string;
}

/**
 * Generates comprehensive, readable, and safely encoded WhatsApp order message
 */
export function generateWhatsAppOrderURL(
  items: CartItem[],
  lang: Language = 'en',
  details?: CheckoutDetails
): string {
  const targetPhone = details?.whatsappNumber || BUSINESS_CONFIG.whatsappNumber;
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
  const baseUrl = `https://wa.me/${cleanPhone}`;

  if (!items || items.length === 0) {
    const defaultMsg = lang === 'bn' 
      ? 'হ্যালো GROZ স্টুডিও (মাইজদী কোর্ট), আমি আপনার সংগ্রহ সম্পর্কে বিস্তারিত জানতে আগ্রহী।'
      : 'Hello GROZ Atelier (Maijdee Court), I would like to inquire about your collection.';
    return `${baseUrl}?text=${encodeURIComponent(defaultMsg)}`;
  }

  const subtotal = calculateCartSubtotal(items);
  const deliveryCharge = details?.deliveryArea === 'inside_noakhali'
    ? BUSINESS_CONFIG.delivery.insideNoakhaliBDT
    : BUSINESS_CONFIG.delivery.outsideNoakhaliBDT;
  const total = subtotal + deliveryCharge;

  const paymentConfig = BUSINESS_CONFIG.paymentMethods.find((p) => p.id === details?.paymentMethod);
  const paymentName = paymentConfig ? paymentConfig.name : (details?.paymentMethod || 'bKash').toUpperCase();
  const paymentNumber = paymentConfig ? paymentConfig.number : '01604985164';

  const lines: string[] = [];
  const isBn = lang === 'bn';

  if (isBn) {
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push('✦ GROZ ফ্যাশন ও এক্সেসরিজ ✦');
    lines.push('অর্ডার রেফারেন্স: ' + (details?.orderRef || `GROZ-TBC-${Math.floor(1000 + Math.random() * 9000)}`));
    lines.push('মাইজদী কোর্ট, নোয়াখালী স্টুডিও');
    lines.push('━━━━━━━━━━━━━━━━━━━━\n');

    if (details?.customerName) {
      lines.push('【 গ্রাহকের তথ্য 】');
      lines.push(`নাম: ${details.customerName}`);
      lines.push(`মোবাইল: ${details.customerPhone}`);
      lines.push(`ঠিকানা: ${details.deliveryAddress}`);
      lines.push(`অঞ্চল: ${details.deliveryArea === 'inside_noakhali' ? 'নোয়াখালীর ভিতরে' : 'নোয়াখালীর বাইরে'}\n`);
    }

    lines.push('【 অর্ডারকৃত পণ্যসমূহ 】');
    items.forEach((item, idx) => {
      const price = typeof item.product.salePriceBDT === 'number' && item.product.salePriceBDT > 0
        ? item.product.salePriceBDT
        : item.product.priceBDT;
      const variantStr = [item.selectedColor, item.selectedSize].filter(Boolean).join(' / ');
      const variantSuffix = variantStr ? ` [${variantStr}]` : '';
      lines.push(`${idx + 1}. ${item.product.nameBn}${variantSuffix}`);
      lines.push(`   পরিমাণ: ${toBengaliNumerals(item.quantity)} × ৳${toBengaliNumerals(price.toLocaleString())} = ৳${toBengaliNumerals((price * item.quantity).toLocaleString())}`);
    });

    lines.push('\n【 হিসাব ও পেমেন্ট 】');
    lines.push(`উপমোট: ৳${toBengaliNumerals(subtotal.toLocaleString())}`);
    lines.push(`ডেলিভারি চার্জ: ৳${toBengaliNumerals(deliveryCharge.toLocaleString())}`);
    lines.push(`সর্বমোট প্রদেয়: ৳${toBengaliNumerals(total.toLocaleString())}`);
    lines.push(`পেমেন্ট মাধ্যম: ${paymentName} (${paymentNumber})`);
    if (details?.transactionId) {
      lines.push(`ট্রানজ্যাকশন আইডি (TrxID): ${details.transactionId}`);
    } else {
      lines.push(`ট্রানজ্যাকশন আইডি: (হোয়াটসঅ্যাপে আলোচনার মাধ্যমে প্রদান করা হবে)`);
    }

    if (details?.customerNotes) {
      lines.push(`\nগ্রাহক নোট: ${details.customerNotes}`);
    }

    lines.push('\nঅনুগ্রহ করে অর্ডার ও প্রাপ্যতা নিশ্চিত করে ডেলিভারি প্রক্রিয়া শুরু করুন। ধন্যবাদ!');
  } else {
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push('✦ GROZ ATELIER ORDER DOSSIER ✦');
    lines.push('Order Reference: ' + (details?.orderRef || `GROZ-TBC-${Math.floor(1000 + Math.random() * 9000)}`));
    lines.push('Maijdee Court, Noakhali, Bangladesh');
    lines.push('━━━━━━━━━━━━━━━━━━━━\n');

    if (details?.customerName) {
      lines.push('【 CLIENT & DESTINATION 】');
      lines.push(`Name: ${details.customerName}`);
      lines.push(`Phone: ${details.customerPhone}`);
      lines.push(`Delivery Address: ${details.deliveryAddress}`);
      lines.push(`Region: ${details.deliveryArea === 'inside_noakhali' ? 'Inside Noakhali' : 'Outside Noakhali (National)'}\n`);
    }

    lines.push('【 SELECTED SPECIMENS 】');
    items.forEach((item, idx) => {
      const price = typeof item.product.salePriceBDT === 'number' && item.product.salePriceBDT > 0
        ? item.product.salePriceBDT
        : item.product.priceBDT;
      const variantStr = [item.selectedColor, item.selectedSize].filter(Boolean).join(' / ');
      const variantSuffix = variantStr ? ` [${variantStr}]` : '';
      lines.push(`${idx + 1}. ${item.product.nameEn}${variantSuffix}`);
      lines.push(`   Qty: ${item.quantity} × ৳${price.toLocaleString()} = ৳${(price * item.quantity).toLocaleString()}`);
    });

    lines.push('\n【 FINANCIAL BREAKDOWN 】');
    lines.push(`Subtotal: ৳${subtotal.toLocaleString()}`);
    lines.push(`Delivery Fee: ৳${deliveryCharge.toLocaleString()}`);
    lines.push(`Total Amount: ৳${total.toLocaleString()}`);
    lines.push(`Payment Method: ${paymentName} (${paymentNumber})`);
    if (details?.transactionId) {
      lines.push(`Payment TrxID: ${details.transactionId}`);
    } else {
      lines.push(`Payment TrxID: (To be settled via chat)`);
    }

    if (details?.customerNotes) {
      lines.push(`\nCustomer Note: ${details.customerNotes}`);
    }

    lines.push('\nPlease confirm specimen availability and dispatch schedule from Maijdee Court atelier.');
  }

  return `${baseUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Validates local storage JSON payload with safe fallback against corruption
 */
export function sanitizeCartStorage(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const valid: CartItem[] = [];

  for (const item of raw) {
    if (
      item &&
      typeof item === 'object' &&
      item.product &&
      typeof item.product.id === 'string' &&
      typeof item.product.priceBDT === 'number' &&
      item.product.priceBDT >= 0
    ) {
      const qty = clampQuantity(Number(item.quantity) || 1);
      valid.push({
        product: item.product as Product,
        quantity: qty,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      });
    }
  }

  return valid;
}

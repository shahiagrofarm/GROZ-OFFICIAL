import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLineTotal,
  calculateCartSubtotal,
  calculateTotalItemsCount,
  clampQuantity,
  adjustQuantityByStep,
  formatBDT,
  toBengaliNumerals,
  validateBangladeshiPhone,
  sanitizeCartStorage,
  generateWhatsAppOrderURL,
} from './cart';
import { Product, CartItem } from '../types';

const mockProduct: Product = {
  id: 'test-01',
  slug: 'test-bag',
  nameEn: 'Monolith Courier Bag',
  nameBn: 'মনোলিথ কুরিয়ার ব্যাগ',
  subtitleEn: 'Test Subtitle',
  subtitleBn: 'টেস্ট সাবটাইটেল',
  category: 'leather',
  priceBDT: 5000,
  image: '/test.png',
  gallery: ['/test.png'],
  descriptionEn: 'Test description',
  descriptionBn: 'টেস্ট বর্ণনা',
  specifications: [],
  materialsStatusEn: 'TBC',
  materialsStatusBn: 'TBC',
  dimensionsEn: 'TBC',
  dimensionsBn: 'TBC',
  colors: ['Obsidian Black'],
  sizes: ['Standard'],
  stockStatus: 'in_stock',
  stockQuantity: 10,
  isFeatured: true,
  isNewArrival: false,
  isSale: false,
  isPublished: true,
  imageAlt: 'Test Bag',
  createdAt: '2026-10-01',
  updatedAt: '2026-10-01',
};

test('calculateLineTotal handles standard and sale prices', () => {
  assert.equal(calculateLineTotal(mockProduct, 2), 10000);
  assert.equal(calculateLineTotal(mockProduct, 0), 0);
  assert.equal(calculateLineTotal({ ...mockProduct, salePriceBDT: 4500 }, 2), 9000);
});

test('calculateCartSubtotal computes accurate sum for multi-item cart', () => {
  const items: CartItem[] = [
    { product: mockProduct, quantity: 2 }, // 10000
    { product: { ...mockProduct, id: 'test-02', priceBDT: 2400 }, quantity: 3 }, // 7200
  ];
  assert.equal(calculateCartSubtotal(items), 17200);
  assert.equal(calculateCartSubtotal([]), 0);
});

test('calculateTotalItemsCount sums item quantities correctly', () => {
  const items: CartItem[] = [
    { product: mockProduct, quantity: 4 },
    { product: { ...mockProduct, id: 'test-02' }, quantity: 10 },
  ];
  assert.equal(calculateTotalItemsCount(items), 14);
});

test('clampQuantity maintains bounds between 1 and 99', () => {
  assert.equal(clampQuantity(0), 1);
  assert.equal(clampQuantity(-10), 1);
  assert.equal(clampQuantity(5), 5);
  assert.equal(clampQuantity(99), 99);
  assert.equal(clampQuantity(150), 99);
  assert.equal(clampQuantity(NaN), 1);
});

test('adjustQuantityByStep supports ±1 and ±10 increments', () => {
  assert.equal(adjustQuantityByStep(1, 1), 2);
  assert.equal(adjustQuantityByStep(2, -1), 1);
  assert.equal(adjustQuantityByStep(1, -1), 1);
  assert.equal(adjustQuantityByStep(1, 10), 11);
  assert.equal(adjustQuantityByStep(95, 10), 99);
});

test('toBengaliNumerals converts ASCII digits to Bengali characters', () => {
  assert.equal(toBengaliNumerals('1234567890'), '১২৩৪৫৬৭৮৯০');
  assert.equal(toBengaliNumerals(5200), '৫২০০');
});

test('formatBDT formats English and Bengali currency representations', () => {
  assert.equal(formatBDT(5200, 'en'), '৳5,200');
  assert.equal(formatBDT(5200, 'bn'), '৳৫,২০০');
});

test('validateBangladeshiPhone strictly identifies valid Bangladeshi cellular numbers', () => {
  assert.equal(validateBangladeshiPhone('01604985164'), true);
  assert.equal(validateBangladeshiPhone('+8801604985164'), true);
  assert.equal(validateBangladeshiPhone('01712345678'), true);
  assert.equal(validateBangladeshiPhone('01814026318'), true);
  assert.equal(validateBangladeshiPhone('01604-985164'), true);
  // Invalid
  assert.equal(validateBangladeshiPhone('12345'), false);
  assert.equal(validateBangladeshiPhone('01012345678'), false);
  assert.equal(validateBangladeshiPhone(''), false);
});

test('sanitizeCartStorage safely extracts valid items and preserves variants', () => {
  const rawData = [
    null,
    { invalid: true },
    {
      product: { id: 'p1', priceBDT: 1500 },
      quantity: 2,
      selectedColor: 'Obsidian',
      selectedSize: 'M',
    },
  ];
  const sanitized = sanitizeCartStorage(rawData);
  assert.equal(sanitized.length, 1);
  assert.equal(sanitized[0].product.id, 'p1');
  assert.equal(sanitized[0].quantity, 2);
  assert.equal(sanitized[0].selectedColor, 'Obsidian');
  assert.equal(sanitized[0].selectedSize, 'M');
});

test('generateWhatsAppOrderURL includes customer, order ref, delivery and payment details', () => {
  const items: CartItem[] = [{
    product: mockProduct,
    quantity: 1,
    selectedColor: 'Obsidian Black',
    selectedSize: 'Standard',
  }];

  const urlEn = generateWhatsAppOrderURL(items, 'en', {
    orderRef: 'GROZ-26-9012',
    customerName: 'S. M. Rahman',
    customerPhone: '01604985164',
    deliveryAddress: 'Maijdee Court, Noakhali',
    deliveryArea: 'inside_noakhali',
    paymentMethod: 'bkash',
    transactionId: '9K72AX44',
  });

  assert.ok(urlEn.includes('https://wa.me/8801604985164?text='));
  assert.ok(urlEn.includes(encodeURIComponent('GROZ-26-9012')));
  assert.ok(urlEn.includes(encodeURIComponent('S. M. Rahman')));
  assert.ok(urlEn.includes(encodeURIComponent('9K72AX44')));
  assert.ok(urlEn.includes(encodeURIComponent('bKash')));
});

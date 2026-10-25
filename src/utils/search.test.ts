import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterProductsByQuery, normalizeSearchTerm } from './search';
import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'groz-kimono-01',
    slug: 'groz-kimono-jacket',
    nameEn: 'Atelier Kimono Jacket',
    nameBn: 'অ্যাটেলিয়ার কিমোনো জ্যাকেট',
    subtitleEn: 'Heavyweight obsidian wool trench',
    subtitleBn: 'হেভিওয়েট অবসিডিয়ান উল ট্রেঞ্চ',
    category: 'outerwear',
    priceBDT: 14500,
    image: '/assets/sample.jpg',
    gallery: [],
    descriptionEn: 'Structured kimono cut tailored with structured Japanese collar and hidden horn buttons.',
    descriptionBn: 'স্ট্রাকচার্ড জাপানি কলার এবং লুকানো বোতাম সহ বিশেষ কিমোনো কাট পোশাক।',
    specifications: [],
    materialsStatusEn: 'Obsidian Wool',
    materialsStatusBn: 'অবসিডিয়ান উল',
    dimensionsEn: 'Standard fit',
    dimensionsBn: 'স্ট্যান্ডার্ড ফিট',
    colors: ['Obsidian Black', 'Slate Grey'],
    sizes: ['M', 'L', 'XL'],
    stockStatus: 'in_stock',
    stockQuantity: 12,
    isFeatured: true,
    isNewArrival: true,
    isSale: false,
    isPublished: true,
    imageAlt: 'Kimono jacket preview',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'groz-trench-02',
    slug: 'groz-sculpted-trench',
    nameEn: 'Sculpted Monolith Trench',
    nameBn: 'স্কাল্পটেড মনোলিথ ট্রেঞ্চ কোট',
    subtitleEn: 'Double-breasted storm flap overcoat',
    subtitleBn: 'ডাবল ব্রেস্টেড স্টর্ম ফ্ল্যাপ ওভারকোট',
    category: 'outerwear',
    priceBDT: 18500,
    image: '/assets/sample2.jpg',
    gallery: [],
    descriptionEn: 'Architectural silhouette engineered from waterproof gabardine with matte gunmetal buckles.',
    descriptionBn: 'ম্যাট গানমেটাল বাকল সহ ওয়াটারপ্রুফ গ্যাবার্ডিন কাপড়ে তৈরি মনোলিথ কোট।',
    specifications: [],
    materialsStatusEn: 'Cotton Gabardine',
    materialsStatusBn: 'কটন গ্যাবার্ডিন',
    dimensionsEn: 'Oversized',
    dimensionsBn: 'ওভারসাইজড',
    colors: ['Black', 'Deep Crimson'],
    sizes: ['S', 'M', 'L'],
    stockStatus: 'in_stock',
    stockQuantity: 8,
    isFeatured: true,
    isNewArrival: false,
    isSale: false,
    isPublished: true,
    imageAlt: 'Trench coat preview',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'groz-tote-03',
    slug: 'groz-geometric-tote',
    nameEn: 'Geometric Chassis Tote',
    nameBn: 'জিওমেট্রিক চেসিস টোট ব্যাগ',
    subtitleEn: 'Rigid vegetable-tanned full-grain leather carrier',
    subtitleBn: 'ভেজিটেবল ট্যানড চামড়ার প্রিমিয়াম ব্যাগ',
    category: 'leather',
    priceBDT: 9800,
    image: '/assets/sample3.jpg',
    gallery: [],
    descriptionEn: 'Laser-cut perimeter with hand-burnished edges, internal laptop slot, and magnetic closure.',
    descriptionBn: 'লেজার কাট পেরিমিটার এবং হাতে পালিশ করা কিনারা সহ সুরক্ষিত ম্যাগনেটিক ক্লোজার।',
    specifications: [],
    materialsStatusEn: 'Vegetable Tanned Leather',
    materialsStatusBn: 'ভেজিটেবল ট্যানড লেদার',
    dimensionsEn: '400mm x 320mm',
    dimensionsBn: '৪০০ মিমি x ৩২০ মিমি',
    colors: ['Jet Black', 'Raw Tan'],
    sizes: ['One Size'],
    stockStatus: 'in_stock',
    stockQuantity: 15,
    isFeatured: false,
    isNewArrival: true,
    isSale: false,
    isPublished: true,
    imageAlt: 'Tote bag preview',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

test('filterProductsByQuery returns all products when query is empty or whitespace', () => {
  assert.equal(filterProductsByQuery(MOCK_PRODUCTS, '').length, 3);
  assert.equal(filterProductsByQuery(MOCK_PRODUCTS, '   ').length, 3);
});

test('filterProductsByQuery matches against English product name', () => {
  const results = filterProductsByQuery(MOCK_PRODUCTS, 'kimono');
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'groz-kimono-01');
});

test('filterProductsByQuery matches against English description', () => {
  // "gabardine" is only in descriptionEn of groz-trench-02
  const results = filterProductsByQuery(MOCK_PRODUCTS, 'gabardine');
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'groz-trench-02');
});

test('filterProductsByQuery matches against Bengali product name', () => {
  const results = filterProductsByQuery(MOCK_PRODUCTS, 'কিমোনো');
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'groz-kimono-01');
});

test('filterProductsByQuery matches against Bengali description', () => {
  // "ম্যাগনেটিক" is in descriptionBn of groz-tote-03
  const results = filterProductsByQuery(MOCK_PRODUCTS, 'ম্যাগনেটিক');
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'groz-tote-03');
});

test('filterProductsByQuery matches multi-word queries across name and description', () => {
  // "monolith waterproof" matches groz-trench-02 (name has Monolith, description has waterproof)
  const results = filterProductsByQuery(MOCK_PRODUCTS, 'monolith waterproof');
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'groz-trench-02');
});

test('filterProductsByQuery matches category and colors', () => {
  const leatherResults = filterProductsByQuery(MOCK_PRODUCTS, 'leather');
  assert.equal(leatherResults.length, 1);
  assert.equal(leatherResults[0].id, 'groz-tote-03');

  const crimsonResults = filterProductsByQuery(MOCK_PRODUCTS, 'crimson');
  assert.equal(crimsonResults.length, 1);
  assert.equal(crimsonResults[0].id, 'groz-trench-02');
});

test('filterProductsByQuery returns empty array when no product matches', () => {
  const results = filterProductsByQuery(MOCK_PRODUCTS, 'nonexistentxyz123');
  assert.equal(results.length, 0);
});

test('normalizeSearchTerm trims and lowercases input', () => {
  assert.equal(normalizeSearchTerm('  Trench COAT  '), 'trench coat');
});

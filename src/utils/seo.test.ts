import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCanonicalURL,
  generateSchemaOrgJSONLD,
  SEO_DICTIONARY,
} from './seo';
import { NavRoute, Language } from '../types';

test('buildCanonicalURL formats home and subpage canonical links', () => {
  const origin = 'https://groz-fashion.com';
  const pathname = '/';
  assert.equal(buildCanonicalURL(origin, pathname, 'home'), 'https://groz-fashion.com/');
  assert.equal(buildCanonicalURL(origin, pathname, 'shop'), 'https://groz-fashion.com/#shop');
  assert.equal(buildCanonicalURL(origin, pathname, 'cart'), 'https://groz-fashion.com/#cart');
  assert.equal(buildCanonicalURL(origin, pathname, 'about'), 'https://groz-fashion.com/#about');
  assert.equal(buildCanonicalURL(origin, pathname, 'contact'), 'https://groz-fashion.com/#contact');
});

test('SEO_DICTIONARY provides complete entries for all routes in en and bn', () => {
  const routes: NavRoute[] = ['home', 'shop', 'cart', 'checkout', 'about', 'contact', 'admin'];
  const languages: Language[] = ['en', 'bn'];

  for (const route of routes) {
    for (const lang of languages) {
      const entry = SEO_DICTIONARY[route][lang];
      assert.ok(entry, `Missing SEO entry for route ${route} in language ${lang}`);
      assert.ok(entry.title.length > 15, `Title too short for ${route} in ${lang}`);
      assert.ok(entry.title.includes('GROZ'), `Title must include brand GROZ for ${route} in ${lang}`);
      assert.ok(entry.description.length > 50, `Description too short for ${route} in ${lang}`);
      assert.ok(entry.keywords.length >= 3, `Keywords missing for ${route} in ${lang}`);
    }
  }
});

test('generateSchemaOrgJSONLD produces valid structured data for different route contexts', () => {
  const origin = 'https://groz-fashion.com';
  const logo = `${origin}/assets/aistudio/FB_IMG_1792947438632_9dd0b6b3.jpg`;

  // Home
  const homeData = generateSchemaOrgJSONLD('home', 'en', origin, logo) as any;
  assert.equal(homeData['@type'], 'ClothingStore');
  assert.equal(homeData.name, 'GROZ');
  assert.equal(homeData.telephone, '+8801604985164');
  assert.equal(homeData.address.addressLocality, 'Noakhali');

  // Shop
  const shopData = generateSchemaOrgJSONLD('shop', 'en', `${origin}/#shop`, logo) as any;
  assert.equal(shopData['@type'], 'CollectionPage');
  assert.equal(shopData.publisher['@type'], 'ClothingStore');

  // Contact
  const contactData = generateSchemaOrgJSONLD('contact', 'en', `${origin}/#contact`, logo) as any;
  assert.equal(contactData['@type'], 'ContactPage');
  assert.equal(contactData.mainEntity.contactPoint.telephone, '+8801604985164');
});

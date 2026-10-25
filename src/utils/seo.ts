import { NavRoute, Language } from '../types';

export interface RouteSEOMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  ogType: 'website' | 'article' | 'product';
  keywords: string[];
}

export const SEO_DICTIONARY: Record<NavRoute, Record<Language, RouteSEOMetadata>> = {
  home: {
    en: {
      title: 'GROZ — Contemporary Fashion & Accessories | Maijdee Court, Noakhali',
      description: 'An editorial fashion and accessories atelier situated in Maijdee Court, Noakhali, Bangladesh. Defined by deliberate architecture, uncompromised geometry, and quiet authority.',
      canonicalPath: '',
      ogType: 'website',
      keywords: ['GROZ', 'Fashion Bangladesh', 'Maijdee Court', 'Noakhali', 'Editorial Fashion', 'Minimalist Clothing', 'Designer Accessories'],
    },
    bn: {
      title: 'GROZ — সমকালীন ফ্যাশন ও আনুষঙ্গিক | মাইজদী কোর্ট, নোয়াখালী',
      description: 'নোয়াখালীর মাইজদী কোর্টে অবস্থিত একটি অভিজাত ফ্যাশন ও আনুষঙ্গিক ব্র্যান্ড। স্থাপত্যসুলভ জ্যামিতি এবং আপসহীন নকশার সমন্বয়ে নির্মিত।',
      canonicalPath: '',
      ogType: 'website',
      keywords: ['GROZ', 'ফ্যাশন বাংলাদেশ', 'মাইজদী কোর্ট', 'নোয়াখালী', 'লাক্সারি ফ্যাশন', 'ডিজাইনার এক্সেসরিজ'],
    },
  },
  shop: {
    en: {
      title: 'Collection Archive — GROZ Premium Catalog | Maijdee Court',
      description: 'Explore sample outerwear, architectural courier bags, sculptural eyewear, and hallmark accessories from the GROZ studio in Maijdee Court.',
      canonicalPath: '#shop',
      ogType: 'website',
      keywords: ['GROZ Shop', 'Fashion Collection', 'Outerwear', 'Leather Bags', 'Eyewear', 'Maijdee Court Studio'],
    },
    bn: {
      title: 'সংগ্রহ ও আর্কাইভ — GROZ প্রিমিয়াম ক্যাটালগ | মাইজদী কোর্ট',
      description: 'মাইজদী কোর্ট স্টুডিওর নমুনা পোশাক, স্থাপত্যসুলভ কুরিয়ার ব্যাগ, ভাস্কর্যসুলভ সানগ্লাস ও সিগনেচার এক্সেসরিজ সংগ্রহ অন্বেষণ করুন।',
      canonicalPath: '#shop',
      ogType: 'website',
      keywords: ['GROZ শপ', 'পোশাক কালেকশন', 'লেদার ব্যাগ', 'সানগ্লাস', 'মাইজদী কোর্ট'],
    },
  },
  cart: {
    en: {
      title: 'Order Inquiry Dossier — GROZ Studio | Maijdee Court',
      description: 'Review your selected specimens and compile a formal inquiry dossier for direct atelier dispatch in Maijdee Court, Noakhali.',
      canonicalPath: '#cart',
      ogType: 'website',
      keywords: ['GROZ Order', 'Cart Dossier', 'Atelier Inquiry', 'Maijdee Court'],
    },
    bn: {
      title: 'অর্ডার অনুসন্ধান ডসিয়ার — GROZ স্টুডিও | মাইজদী কোর্ট',
      description: 'আপনার নির্বাচিত পণ্যগুলো পর্যালোচনা করুন এবং মাইজদী কোর্ট স্টুডিওতে সরাসরি অর্ডার ডসিয়ার প্রেরণ করুন।',
      canonicalPath: '#cart',
      ogType: 'website',
      keywords: ['GROZ অর্ডার', 'কার্ট ডসিয়ার', 'স্টুডিও অনুসন্ধান'],
    },
  },
  about: {
    en: {
      title: 'About GROZ — The Atelier in Maijdee Court, Noakhali',
      description: 'The origin, design discipline, and authentic craft narrative behind GROZ, operating from Maijdee Court, Noakhali, Bangladesh.',
      canonicalPath: '#about',
      ogType: 'article',
      keywords: ['About GROZ', 'Maijdee Court Brand', 'Noakhali Design', 'Fashion Philosophy'],
    },
    bn: {
      title: 'আমাদের কথা — GROZ মাইজদী কোর্ট, নোয়াখালী',
      description: 'বাংলাদেশের নোয়াখালী জেলার মাইজদী কোর্ট থেকে পরিচালিত স্বতন্ত্র ফ্যাশন উদ্যোগ GROZ-এর প্রেক্ষাপট ও নকশার শৃঙ্খলা।',
      canonicalPath: '#about',
      ogType: 'article',
      keywords: ['GROZ সম্পর্কিত তথ্য', 'মাইজদী কোর্ট ফ্যাশন', 'ডিজাইন ঐতিহ্য'],
    },
  },
  contact: {
    en: {
      title: 'Contact Atelier — GROZ | Maijdee Court, Noakhali, Bangladesh',
      description: 'Connect with GROZ directly in Maijdee Court, Noakhali via phone (01604985164), WhatsApp, Facebook, or client inquiry form.',
      canonicalPath: '#contact',
      ogType: 'website',
      keywords: ['Contact GROZ', '01604985164', 'Maijdee Court Noakhali Phone', 'WhatsApp GROZ'],
    },
    bn: {
      title: 'যোগাযোগ ও স্টুডিও — GROZ | মাইজদী কোর্ট, নোয়াখালী',
      description: 'ফোন (০১৬০৪৯৮৫১৬৪), হোয়াটসঅ্যাপ বা ইনকোয়ারি ফর্মের মাধ্যমে সরাসরি নোয়াখালীর মাইজদী কোর্টে GROZ স্টুডিওর সাথে যোগাযোগ করুন।',
      canonicalPath: '#contact',
      ogType: 'website',
      keywords: ['GROZ যোগাযোগ', '০১৬০৪৯৮৫১৬৪', 'মাইজদী কোর্ট নোয়াখালী ফোন'],
    },
  },
  checkout: {
    en: {
      title: 'Pay & Buy — Mobile Payment Checkout | GROZ Atelier',
      description: 'Secure mobile payment with bKash, Nagad, Upay, and Rocket. Direct order dispatch with WhatsApp confirmation from Maijdee Court.',
      canonicalPath: '#checkout',
      ogType: 'website',
      keywords: ['GROZ Checkout', 'bKash Payment', 'Nagad Payment', 'Rocket', 'Upay', 'Pay & Buy Bangladesh'],
    },
    bn: {
      title: 'পে অ্যান্ড বাই — মোবাইল পেমেন্ট চেকআউট | GROZ স্টুডিও',
      description: 'বিকাশ, নগদ, উপায় ও রকেটের মাধ্যমে পেমেন্ট করে সরাসরি হোয়াটসঅ্যাপে অর্ডার নিশ্চিত করুন। মাইজদী কোর্ট স্টুডিও এক্সপ্রেস ডেলিভারি।',
      canonicalPath: '#checkout',
      ogType: 'website',
      keywords: ['GROZ চেকআউট', 'বিকাশ পেমেন্ট', 'নগদ পেমেন্ট', 'রকেট', 'উপায়'],
    },
  },
  admin: {
    en: {
      title: 'Owner Admin Dashboard — GROZ Atelier Registry',
      description: 'Authorized administrative control panel for GROZ specimen catalog, image management, pricing, and customer order fulfillment.',
      canonicalPath: '#admin',
      ogType: 'website',
      keywords: ['GROZ Admin', 'Atelier Dashboard', 'Inventory Control'],
    },
    bn: {
      title: 'স্টুডিও অ্যাডমিন ড্যাশবোর্ড — GROZ রেজিস্ট্রেশন',
      description: 'GROZ পণ্য ক্যাটালগ, ছবি, স্টক ও কাস্টমার অর্ডার ব্যবস্থাপনার জন্য অনুমোদিত অ্যাডমিন কন্ট্রোল প্যানেল।',
      canonicalPath: '#admin',
      ogType: 'website',
      keywords: ['GROZ অ্যাডমিন', 'স্টক ব্যবস্থাপনা', 'অর্ডার কন্ট্রোল'],
    },
  },
};

/**
 * Returns canonical absolute URL for the route
 */
export function buildCanonicalURL(origin: string, pathname: string, route: NavRoute): string {
  const base = `${origin}${pathname}`;
  if (route === 'home') {
    return base;
  }
  return `${base}#${route}`;
}

/**
 * Generates Schema.org JSON-LD structured data for the active route
 */
export function generateSchemaOrgJSONLD(
  route: NavRoute,
  lang: Language,
  canonicalUrl: string,
  logoUrl: string
): object {
  const isBn = lang === 'bn';

  const baseOrganization = {
    '@type': 'ClothingStore',
    name: 'GROZ',
    legalName: 'GROZ Fashion & Accessories',
    url: canonicalUrl,
    logo: logoUrl,
    image: logoUrl,
    description: isBn
      ? 'নোয়াখালীর মাইজদী কোর্টে অবস্থিত একটি অভিজাত ফ্যাশন ও আনুষঙ্গিক ব্র্যান্ড।'
      : 'An editorial fashion and accessories atelier in Maijdee Court, Noakhali, Bangladesh.',
    telephone: '+8801604985164',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Maijdee Court',
      addressLocality: 'Noakhali',
      addressRegion: 'Chittagong Division',
      postalCode: '3800',
      addressCountry: 'BD',
    },
    sameAs: [
      'https://wa.me/8801604985164',
      'https://www.facebook.com/share/1FCKwXKCGo/',
      'https://www.instagram.com/grozofficial?stkn=bzB4NHc2YzhkZnEx',
    ],
    priceRange: '৳৳',
  };

  if (route === 'contact') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: isBn ? 'GROZ যোগাযোগ' : 'GROZ Atelier Contact',
      url: canonicalUrl,
      mainEntity: {
        ...baseOrganization,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+8801604985164',
          contactType: 'customer service',
          areaServed: 'BD',
          availableLanguage: ['en', 'bn'],
        },
      },
    };
  }

  if (route === 'about') {
    return {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: isBn ? 'GROZ সম্পর্কিত তথ্য' : 'About GROZ',
      url: canonicalUrl,
      mainEntity: baseOrganization,
    };
  }

  if (route === 'shop') {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: isBn ? 'GROZ সংগ্রহ ও আর্কাইভ' : 'GROZ Collection Archive',
      url: canonicalUrl,
      publisher: baseOrganization,
    };
  }

  return {
    '@context': 'https://schema.org',
    ...baseOrganization,
  };
}

/**
 * Updates DOM head tags dynamically for client-side SEO
 */
export function applyRouteSEO(route: NavRoute, lang: Language): void {
  if (typeof document === 'undefined') return;

  const meta = SEO_DICTIONARY[route]?.[lang] || SEO_DICTIONARY.home.en;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const canonicalUrl = buildCanonicalURL(origin, pathname, route);
  const logoUrl = `${origin}/assets/aistudio/FB_IMG_1792947438632_9dd0b6b3.jpg`;

  // 1. Title
  document.title = meta.title;

  // 2. Meta description
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement('meta');
    descTag.setAttribute('name', 'description');
    document.head.appendChild(descTag);
  }
  descTag.setAttribute('content', meta.description);

  // 3. Meta keywords
  let keywordsTag = document.querySelector('meta[name="keywords"]');
  if (!keywordsTag) {
    keywordsTag = document.createElement('meta');
    keywordsTag.setAttribute('name', 'keywords');
    document.head.appendChild(keywordsTag);
  }
  keywordsTag.setAttribute('content', meta.keywords.join(', '));

  // 4. Canonical URL
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalTag);
  }
  canonicalTag.setAttribute('href', canonicalUrl);

  // 5. OpenGraph Tags
  const setMetaProperty = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaProperty('og:title', meta.title);
  setMetaProperty('og:description', meta.description);
  setMetaProperty('og:url', canonicalUrl);
  setMetaProperty('og:type', meta.ogType);
  setMetaProperty('og:site_name', 'GROZ');
  setMetaProperty('og:locale', lang === 'bn' ? 'bn_BD' : 'en_US');
  setMetaProperty('og:image', logoUrl);

  // 6. Twitter Card Tags
  const setTwitterName = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setTwitterName('twitter:card', 'summary_large_image');
  setTwitterName('twitter:title', meta.title);
  setTwitterName('twitter:description', meta.description);
  setTwitterName('twitter:image', logoUrl);

  // 7. Schema.org JSON-LD
  let jsonLdScript = document.getElementById('groz-jsonld') as HTMLScriptElement | null;
  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.id = 'groz-jsonld';
    jsonLdScript.type = 'application/ld+json';
    document.head.appendChild(jsonLdScript);
  }
  const jsonLdData = generateSchemaOrgJSONLD(route, lang, canonicalUrl, logoUrl);
  jsonLdScript.textContent = JSON.stringify(jsonLdData, null, 2);
}

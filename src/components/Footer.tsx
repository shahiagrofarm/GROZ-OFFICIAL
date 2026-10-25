import React from 'react';
import { useApp } from '../context/AppContext';
import { NavRoute } from '../types';
import { Phone, MessageCircle, ExternalLink, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setRoute, language, setLanguage } = useApp();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { id: NavRoute; label: string }[] = [
    { id: 'home', label: t('navHome') },
    { id: 'shop', label: t('navShop') },
    { id: 'cart', label: t('navCart') },
    { id: 'checkout', label: t('navCheckout') },
    { id: 'about', label: t('navAbout') },
    { id: 'contact', label: t('navContact') },
    { id: 'admin', label: t('navAdmin') },
  ];

  return (
    <footer className="w-full bg-groz-main border-t border-groz text-groz-main pt-16 pb-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-groz">
          {/* Brand Manifesto & Location */}
          <div className="md:col-span-2 space-y-4 pr-0 md:pr-8">
            <div className="flex items-center gap-3">
              <span className="font-serif-editorial text-3xl tracking-[0.25em] font-bold uppercase text-groz-main">
                GROZ
              </span>
              <span className="w-2 h-2 bg-groz-red" />
              <span className="text-xs uppercase font-mono-editorial tracking-widest text-groz-muted">
                {t('brandTagline')}
              </span>
            </div>
            <p className="text-sm font-serif-editorial text-groz-muted max-w-md leading-relaxed">
              {t('heroIntro')}
            </p>
            <div className="pt-2 text-xs font-mono-editorial text-groz-muted space-y-1">
              <div><strong className="text-groz-main font-semibold">Location:</strong> Maijdee Court, Noakhali, Bangladesh</div>
              <div><strong className="text-groz-main font-semibold">Telephone:</strong> <a href="tel:+8801604985164" className="hover:text-groz-red transition-colors">01604985164</a></div>
            </div>
          </div>

          {/* Symmetrical Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono-editorial tracking-[0.25em] text-groz-muted border-b border-groz-subtle pb-2">
              Sitemap Archive
            </h4>
            <ul className="space-y-2 text-sm font-mono-editorial">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setRoute(link.id);
                      scrollToTop();
                    }}
                    className="hover:text-groz-red transition-colors text-left focus:outline-none"
                  >
                    &rarr; {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified External Channels */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono-editorial tracking-[0.25em] text-groz-muted border-b border-groz-subtle pb-2">
              Atelier Dispatches
            </h4>
            <ul className="space-y-3 text-xs font-mono-editorial">
              <li>
                <a
                  href="https://wa.me/8801604985164"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group p-2 border border-groz hover:border-groz-red transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-groz-red" />
                    WhatsApp Atelier
                  </span>
                  <ExternalLink className="w-3 h-3 text-groz-muted group-hover:text-groz-red" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1FCKwXKCGo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group p-2 border border-groz hover:border-groz-red transition-colors"
                >
                  <span className="flex items-center gap-2">
                    Facebook Presence
                  </span>
                  <ExternalLink className="w-3 h-3 text-groz-muted group-hover:text-groz-red" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/grozofficial?stkn=bzB4NHc2YzhkZnEx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group p-2 border border-groz hover:border-groz-red transition-colors"
                >
                  <span className="flex items-center gap-2">
                    Instagram Official
                  </span>
                  <ExternalLink className="w-3 h-3 text-groz-muted group-hover:text-groz-red" />
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801604985164"
                  className="flex items-center justify-between group p-2 border border-groz hover:border-groz-red transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-groz-red" />
                    +880 1604 985164
                  </span>
                  <span className="text-[10px] text-groz-red uppercase font-semibold">Voice</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-mono-editorial text-groz-muted gap-4">
          <div>
            &copy; {currentYear} GROZ. {t('footerEditorialNote')} {t('footerRights')}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="uppercase text-[10px] tracking-widest text-groz-muted">Language:</span>
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 border ${language === 'en' ? 'border-groz-red text-groz-red font-bold' : 'border-groz text-groz-muted'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-1.5 py-0.5 border ${language === 'bn' ? 'border-groz-red text-groz-red font-bold' : 'border-groz text-groz-muted'}`}
              >
                বাংলা
              </button>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-groz-red transition-colors focus:outline-none"
            >
              <span>{t('footerBackToTop')}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Massive cropped editorial wordmark running across the background */}
      <div 
        aria-hidden="true" 
        className="w-full select-none pointer-events-none mt-8 -mb-10 text-center opacity-5 dark:opacity-10 overflow-hidden"
      >
        <span className="font-serif-editorial text-[18vw] leading-none tracking-[0.35em] font-bold block whitespace-nowrap text-groz-main">
          GROZ
        </span>
      </div>
    </footer>
  );
};

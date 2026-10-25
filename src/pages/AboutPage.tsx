import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, MapPin, Compass, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, setRoute } = useApp();

  return (
    <div className="w-full bg-groz-main text-groz-main min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors">
      {/* Editorial Header */}
      <div className="pb-10 border-b border-groz space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 bg-groz-red" />
          <span>Brand Manifesto & Practice</span>
        </div>
        <h1 className="font-serif-editorial text-4xl sm:text-6xl font-bold uppercase tracking-tight text-groz-main">
          {t('aboutTitle')}
        </h1>
        <p className="font-serif-editorial text-xl text-groz-muted max-w-2xl italic">
          {t('aboutSubtitle')}
        </p>
      </div>

      {/* Main Two-Column Editorial Narrative */}
      <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-groz items-start">
        {/* Left Column: Visual Asset and Location Mark */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 bg-neutral-950 border border-groz text-center relative overflow-hidden">
            <div className="w-48 h-64 mx-auto flex items-center justify-center">
              <img
                src="/assets/aistudio/FB_IMG_1792947438632_9dd0b6b3.jpg"
                alt="GROZ Seahorse Hallmarking"
                className="w-full h-full object-contain filter brightness-110 contrast-125"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-800 text-[10px] font-mono-editorial text-neutral-400 uppercase tracking-widest flex justify-between">
              <span>REGISTERED HALLMARK</span>
              <span className="text-red-500 font-semibold">NOAKHALI, BD</span>
            </div>
          </div>

          <div className="p-6 border border-groz bg-groz-surface space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-wider font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Studio Location Coordinates</span>
            </div>
            <p className="font-serif-editorial text-base text-groz-main">
              Maijdee Court, Noakhali, Bangladesh
            </p>
            <p className="text-xs font-mono-editorial text-groz-muted">
              Direct Telephone: <a href="tel:+8801604985164" className="text-groz-main hover:text-groz-red font-semibold">01604985164</a>
            </p>
          </div>
        </div>

        {/* Right Column: Three Grounded Statements separated by fine rules */}
        <div className="lg:col-span-7 divide-y divide-groz space-y-8">
          {/* Section 1 */}
          <div className="space-y-3 pb-8">
            <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-widest">
              01 &bull; Geography & Vantage
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-groz-main">
              {t('aboutSection1Heading')}
            </h2>
            <p className="font-serif-editorial text-base sm:text-lg text-groz-muted leading-relaxed">
              {t('aboutSection1Text')}
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-8 pb-8">
            <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-widest">
              02 &bull; Visual Identity
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-groz-main">
              {t('aboutSection2Heading')}
            </h2>
            <p className="font-serif-editorial text-base sm:text-lg text-groz-muted leading-relaxed">
              {t('aboutSection2Text')}
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-8">
            <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-widest">
              03 &bull; Honest Narrative
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-groz-main">
              {t('aboutSection3Heading')}
            </h2>
            <p className="font-serif-editorial text-base sm:text-lg text-groz-muted leading-relaxed">
              {t('aboutSection3Text')}
            </p>
          </div>
        </div>
      </div>

      {/* Epilogue CTA Strip */}
      <div className="py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-serif-editorial text-2xl font-bold uppercase text-groz-main">
            Explore the Inaugural Prototypes
          </h3>
          <p className="text-xs font-mono-editorial text-groz-muted">
            Inspect our sample garments and accessory specimens in the collection catalog.
          </p>
        </div>

        <button
          onClick={() => setRoute('shop')}
          className="px-8 py-3.5 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center gap-3 shrink-0 focus:outline-none"
        >
          <span>{t('shopNow')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

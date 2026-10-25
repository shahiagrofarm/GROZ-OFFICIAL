import React from 'react';
import { useApp } from '../context/AppContext';
import { TravellingProduct } from '../components/TravellingProduct';
import { InteractiveDemonstration } from '../components/InteractiveDemonstration';
import { ArrowRight, ChevronRight, ExternalLink, ShieldAlert, Compass } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, setRoute, language } = useApp();

  return (
    <div className="w-full relative overflow-hidden bg-groz-main text-groz-main transition-colors">
      {/* Travelling Product Cutout bound to scroll */}
      <TravellingProduct />

      {/* =========================================================================
          SECTION 1: HERO
          ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-12 pb-8 border-b border-groz px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Top Micro Eyebrow */}
        <div className="flex items-center justify-between border-b border-groz pb-3">
          <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-[0.3em]">
            <span className="w-2 h-2 bg-groz-red inline-block" />
            <span>Atelier Registry &bull; Maijdee Court</span>
          </div>
          <div className="text-xs font-mono-editorial text-groz-muted">
            01604985164
          </div>
        </div>

        {/* Hero Central Editorial Composition */}
        <div className="my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.05] text-groz-main">
              {t('heroHeadline')}
            </h1>

            <p className="font-serif-editorial text-lg sm:text-xl text-groz-muted max-w-2xl leading-relaxed italic">
              {t('heroIntro')}
            </p>

            {/* Two Clear Primary CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setRoute('shop')}
                className="px-8 py-4 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-[0.25em] font-semibold transition-colors flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-groz-red"
              >
                <span>{t('shopNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setRoute('about')}
                className="px-8 py-4 border border-groz hover:border-groz-red text-groz-main font-mono-editorial text-xs uppercase tracking-[0.25em] transition-colors flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-groz-red"
              >
                <span>{t('discoverGroz')}</span>
                <ChevronRight className="w-4 h-4 text-groz-red" />
              </button>
            </div>
          </div>

          {/* Reserved space on the right for the floating travelling product cutout */}
          <div className="hidden lg:block lg:col-span-4 h-72" aria-hidden="true" />
        </div>

        {/* Thin Ruled Strip showing Confirmed Brand Information */}
        <div className="pt-4 border-t border-groz grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-editorial text-groz-muted">
          <div className="flex items-center gap-2">
            <span className="text-groz-red font-semibold">LOCATION:</span>
            <span>Maijdee Court, Noakhali, Bangladesh</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-groz-red font-semibold">CONTACT:</span>
            <a href="tel:+8801604985164" className="hover:text-groz-red transition-colors">
              +880 1604 985164
            </a>
          </div>
          <div className="flex items-center justify-start md:justify-end gap-2 text-groz-muted">
            <span className="text-groz-red">&bull;</span>
            <span>{t('heroScrollPrompt')}</span>
          </div>
        </div>

        {/* Oversized GROZ Wordmark spanning the bottom of the viewport */}
        <div 
          aria-hidden="true" 
          className="w-full select-none pointer-events-none mt-6 -mb-4 text-center overflow-hidden border-t border-groz-subtle pt-2"
        >
          <span className="font-serif-editorial text-[14vw] leading-none tracking-[0.3em] font-bold block whitespace-nowrap opacity-10 dark:opacity-20 text-groz-main">
            GROZ
          </span>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE ARGUMENT
          ========================================================================= */}
      <section className="py-24 border-b border-groz px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-groz-red" />
          <span>Section 02 &bull; Editorial Position</span>
        </div>

        {/* Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Strong Headline & Ethos */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight uppercase text-groz-main leading-tight">
              {t('argumentHeadline')}
            </h2>
            <p className="font-serif-editorial text-lg text-groz-muted italic">
              {t('argumentSubtitle')}
            </p>
            <div className="pt-6">
              <div className="inline-block p-4 border border-groz bg-groz-surface text-xs font-mono-editorial text-groz-muted">
                <span className="text-groz-red font-semibold uppercase block mb-1">Authenticity Standard:</span>
                GROZ does not manufacture fictitious histories, false production milestones, or unverified claims.
              </div>
            </div>
          </div>

          {/* Right Column: Concise Supporting Statements separated by fine horizontal rules */}
          <div className="lg:col-span-7 divide-y divide-groz">
            {/* Statement 1 */}
            <div className="pb-8 space-y-2">
              <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-widest">
                Position 01
              </div>
              <h3 className="font-serif-editorial text-2xl font-semibold text-groz-main">
                {t('argumentStatement1Title')}
              </h3>
              <p className="font-serif-editorial text-base text-groz-muted leading-relaxed">
                {t('argumentStatement1Body')}
              </p>
            </div>

            {/* Statement 2 */}
            <div className="py-8 space-y-2">
              <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-widest">
                Position 02
              </div>
              <h3 className="font-serif-editorial text-2xl font-semibold text-groz-main">
                {t('argumentStatement2Title')}
              </h3>
              <p className="font-serif-editorial text-base text-groz-muted leading-relaxed">
                {t('argumentStatement2Body')}
              </p>
            </div>

            {/* Statement 3 */}
            <div className="pt-8 space-y-2">
              <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-widest">
                Position 03
              </div>
              <h3 className="font-serif-editorial text-2xl font-semibold text-groz-main">
                {t('argumentStatement3Title')}
              </h3>
              <p className="font-serif-editorial text-base text-groz-muted leading-relaxed">
                {t('argumentStatement3Body')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INTERACTIVE DEMONSTRATION
          ========================================================================= */}
      <InteractiveDemonstration />

      {/* =========================================================================
          SECTION 4: MATERIALS
          ========================================================================= */}
      <section className="py-24 border-t border-groz bg-groz-surface/40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-groz gap-4">
          <div>
            <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-groz-red" />
              <span>Section 04 &bull; Sourcing Protocol</span>
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight uppercase text-groz-main">
              {t('materialsTitle')}
            </h2>
          </div>
          <p className="text-sm font-serif-editorial text-groz-muted max-w-md">
            {t('materialsSubtitle')}
          </p>
        </div>

        {/* Editorial statement and editable placeholder for unconfirmed physical formulation */}
        <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <p className="font-serif-editorial text-lg text-groz-main leading-relaxed">
              {t('materialsStatement')}
            </p>

            <ul className="space-y-3 pt-2 text-sm font-mono-editorial text-groz-muted">
              <li className="flex items-start gap-2">
                <span className="text-groz-red">&mdash;</span>
                <span>{t('materialsPoint1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-groz-red">&mdash;</span>
                <span>{t('materialsPoint2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-groz-red">&mdash;</span>
                <span>{t('materialsPoint3')}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 p-6 border border-dashed border-groz bg-groz-main space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>{t('materialsPlaceholderBadge')}</span>
            </div>
            <p className="text-xs font-mono-editorial text-groz-muted leading-relaxed">
              As mandated by the GROZ design constitution, we display this verified placeholder pending laboratory material assay reports. No synthetic or natural fabric claims will be published without physical certification.
            </p>
            <div className="text-[11px] font-mono-editorial text-groz-muted border-t border-groz pt-2">
              STATUS: CURATION IN PROGRESS &bull; MAIJDEE COURT ARCHIVE
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: MEASUREMENTS
          ========================================================================= */}
      <section className="py-24 border-t border-groz px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-groz gap-4">
          <div>
            <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-groz-red" />
              <span>Section 05 &bull; Architectural Bounds</span>
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight uppercase text-groz-main">
              {t('measurementsTitle')}
            </h2>
          </div>
          <p className="text-sm font-serif-editorial text-groz-muted max-w-md">
            {t('measurementsSubtitle')}
          </p>
        </div>

        {/* Single Column of Ruled Rows: Label, Short Explanation, Right-Aligned Value */}
        <div className="divide-y divide-groz border-b border-groz mt-6">
          {/* Row 1 */}
          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-base font-serif-editorial font-semibold text-groz-main block">
                {t('dimEnvelope')}
              </span>
              <span className="text-xs font-mono-editorial text-groz-muted">
                {t('dimEnvelopeDesc')}
              </span>
            </div>
            <div className="text-sm font-mono-editorial text-groz-red font-medium text-left sm:text-right">
              {t('dimEnvelopeVal')}
            </div>
          </div>

          {/* Row 2 */}
          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-base font-serif-editorial font-semibold text-groz-main block">
                {t('dimDepth')}
              </span>
              <span className="text-xs font-mono-editorial text-groz-muted">
                {t('dimDepthDesc')}
              </span>
            </div>
            <div className="text-sm font-mono-editorial text-groz-red font-medium text-left sm:text-right">
              {t('dimDepthVal')}
            </div>
          </div>

          {/* Row 3 */}
          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-base font-serif-editorial font-semibold text-groz-main block">
                {t('dimWeight')}
              </span>
              <span className="text-xs font-mono-editorial text-groz-muted">
                {t('dimWeightDesc')}
              </span>
            </div>
            <div className="text-sm font-mono-editorial text-groz-muted text-left sm:text-right">
              {t('dimWeightVal')}
            </div>
          </div>

          {/* Row 4 */}
          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-base font-serif-editorial font-semibold text-groz-main block">
                {t('dimHardware')}
              </span>
              <span className="text-xs font-mono-editorial text-groz-muted">
                {t('dimHardwareDesc')}
              </span>
            </div>
            <div className="text-sm font-mono-editorial text-groz-muted text-left sm:text-right">
              {t('dimHardwareVal')}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CLOSING
          ========================================================================= */}
      <section className="py-24 border-t border-groz bg-groz-surface/20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl space-y-6">
          <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-groz-red" />
            <span>Section 06 &bull; Epilogue</span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-groz-main">
            {t('closingHeadline')}
          </h2>

          <p className="font-serif-editorial text-lg text-groz-muted leading-relaxed max-w-2xl">
            {t('closingSubtext')}
          </p>

          {/* Two Calls to Action */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setRoute('shop')}
              className="px-8 py-4 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-[0.25em] font-semibold transition-colors flex items-center gap-3 focus:outline-none"
            >
              <span>{t('shopNow')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/8801604985164"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-groz hover:border-groz-red text-groz-main font-mono-editorial text-xs uppercase tracking-[0.25em] transition-colors flex items-center gap-2 focus:outline-none"
            >
              <span>{t('orderViaWhatsApp')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-groz-red" />
            </a>
          </div>

          <div className="pt-8 border-t border-groz text-xs font-mono-editorial text-groz-muted space-y-2">
            <div className="text-groz-main uppercase tracking-wider">{t('closingFollow')}</div>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="https://www.facebook.com/share/1FCKwXKCGo/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-groz-red transition-colors"
              >
                &rarr; Facebook Official
              </a>
              <a
                href="https://www.instagram.com/grozofficial?stkn=bzB4NHc2YzhkZnEx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-groz-red transition-colors"
              >
                &rarr; Instagram Official
              </a>
              <a
                href="tel:+8801604985164"
                className="hover:text-groz-red transition-colors"
              >
                &rarr; Phone: 01604985164
              </a>
            </div>
          </div>
        </div>

        {/* Cropped GROZ Wordmark */}
        <div 
          aria-hidden="true" 
          className="w-full select-none pointer-events-none mt-16 -mb-6 text-center overflow-hidden"
        >
          <span className="font-serif-editorial text-[16vw] leading-none tracking-[0.3em] font-bold block whitespace-nowrap opacity-10 dark:opacity-20 text-groz-main">
            GROZ
          </span>
        </div>
      </section>
    </div>
  );
};

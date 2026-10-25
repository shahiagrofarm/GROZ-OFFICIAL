import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface VariantData {
  id: string;
  nameKey: 'demoVariantNoir' | 'demoVariantCrimson' | 'demoVariantAtelier';
  accentColor: string;
  fillOpacity: string;
  fact1En: string;
  fact1Bn: string;
  fact2En: string;
  fact2Bn: string;
  fact3En: string;
  fact3Bn: string;
  envelopeEn: string;
  envelopeBn: string;
}

const VARIANTS: VariantData[] = [
  {
    id: 'noir',
    nameKey: 'demoVariantNoir',
    accentColor: '#1a1a1a',
    fillOpacity: '0.9',
    fact1En: 'Estimated 420g dry weight (Details to be confirmed).',
    fact1Bn: 'আনুমানিক ৪২০ গ্রাম শুষ্ক ওজন (বিবরণ নিশ্চিত করা বাকি)।',
    fact2En: 'Vapor-deposited matte carbon passivation (Details to be confirmed).',
    fact2Bn: 'ভ্যাপার ডিপোজিটেড ম্যাট কার্বন প্রলেপ (বিবরণ নিশ্চিত করা বাকি)।',
    fact3En: 'Dual-pin tensioned shear bolt (Details to be confirmed).',
    fact3Bn: 'ডুয়াল-পিন টেনশন শেয়ার বোল্ট (বিবরণ নিশ্চিত করা বাকি)।',
    envelopeEn: 'Envelope: 280 × 195 × 65 mm (TBC)',
    envelopeBn: 'পরিমাপ: ২৮০ × ১৯৫ × ৬৫ মিমি (নিশ্চিতকরণাধীন)',
  },
  {
    id: 'crimson',
    nameKey: 'demoVariantCrimson',
    accentColor: '#d92626',
    fillOpacity: '0.95',
    fact1En: 'Estimated 445g with reinforced perimeter seal (Details to be confirmed).',
    fact1Bn: 'রিইনফোর্সড পেরিমিটার সিলসহ আনুমানিক ৪৪৫ গ্রাম (বিবরণ নিশ্চিত করা বাকি)।',
    fact2En: 'Oxidized GROZ red perimeter edge lacquer (Details to be confirmed).',
    fact2Bn: 'অক্সিডাইজড GROZ রেড পেরিমিটার লেকার (বিবরণ নিশ্চিত করা বাকি)।',
    fact3En: 'Magnetic latch cavity with lock tolerance (Details to be confirmed).',
    fact3Bn: 'ম্যাগনেটিক ল্যাচ ক্যাভিটি সহ লক টলারেন্স (বিবরণ নিশ্চিত করা বাকি)।',
    envelopeEn: 'Envelope: 285 × 198 × 68 mm (TBC)',
    envelopeBn: 'পরিমাপ: ২৮৫ × ১৯৮ × ৬৮ মিমি (নিশ্চিতকরণাধীন)',
  },
  {
    id: 'atelier',
    nameKey: 'demoVariantAtelier',
    accentColor: '#4a4947',
    fillOpacity: '0.85',
    fact1En: 'Estimated 395g raw prototype milling (Details to be confirmed).',
    fact1Bn: 'আনুমানিক ৩৯৫ গ্রাম র প্রোটোটাইপ মিলিং (বিবরণ নিশ্চিত করা বাকি)।',
    fact2En: 'Unsealed brush-textured industrial alloy (Details to be confirmed).',
    fact2Bn: 'আনসিলড ব্রাশড টেক্সচার্ড ইন্ডাস্ট্রিয়াল অ্যালয় (বিবরণ নিশ্চিত করা বাকি)।',
    fact3En: 'Exposed atelier fastener anchors (Details to be confirmed).',
    fact3Bn: 'এক্সপোজড স্টুডিও ফাস্টেনার নোঙর (বিবরণ নিশ্চিত করা বাকি)।',
    envelopeEn: 'Envelope: 278 × 190 × 60 mm (TBC)',
    envelopeBn: 'পরিমাপ: ২৭৮ × ১৯০ × ৬০ মিমি (নিশ্চিতকরণাধীন)',
  },
];

export const InteractiveDemonstration: React.FC = () => {
  const { t, language } = useApp();
  const [selectedVariant, setSelectedVariant] = useState<VariantData>(VARIANTS[0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // SVG Drawing Animation via getTotalLength(), strokeDasharray, and strokeDashoffset
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated && svgRef.current) {
            setHasAnimated(true);
            const paths = svgRef.current.querySelectorAll<SVGPathElement>('.anim-path');
            paths.forEach((path) => {
              const length = path.getTotalLength();
              path.style.strokeDasharray = `${length}`;
              path.style.strokeDashoffset = `${length}`;
              path.getBoundingClientRect(); // trigger layout reflow
              path.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(0.16, 1, 0.3, 1)';
              path.style.strokeDashoffset = '0';
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="py-24 border-t border-groz bg-groz-main transition-colors"
      aria-labelledby="specimen-demo-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-groz gap-4">
          <div>
            <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-groz-red" />
              <span>Section 03 &bull; Presentation Specimen</span>
            </div>
            <h2
              id="specimen-demo-heading"
              className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight uppercase text-groz-main"
            >
              {t('demoSectionTitle')}
            </h2>
          </div>
          <p className="text-sm font-serif-editorial text-groz-muted max-w-md">
            {t('demoSectionSubtitle')}
          </p>
        </div>

        {/* Concept disclaimer banner */}
        <div className="my-6 p-3 bg-groz-surface border border-groz text-xs font-mono-editorial text-groz-muted flex items-center justify-between">
          <span>&bull; {t('demoConceptNotice')}</span>
          <span className="text-groz-red uppercase font-semibold">{t('detailsTBC')}</span>
        </div>

        {/* Main Interactive Stage: 2-column editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          {/* Left Column: Architectural SVG Drawing */}
          <div className="lg:col-span-7 bg-neutral-950 p-6 sm:p-10 border border-groz relative flex flex-col justify-between overflow-hidden min-h-[420px]">
            {/* Architectural Grid Lines */}
            <div 
              aria-hidden="true" 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Specimen Header Coordinates */}
            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono-editorial text-neutral-400 tracking-widest uppercase">
              <span className="text-red-500 font-semibold">GROZ SPECIMEN VECTOR ENGINE</span>
              <span>{selectedVariant.envelopeEn}</span>
            </div>

            {/* SVG Wireframe Illustration */}
            <div className="relative z-10 my-8 flex items-center justify-center">
              <svg
                ref={svgRef}
                viewBox="0 0 600 360"
                className="w-full h-auto max-h-[300px] stroke-white"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Structural Outer Silhouette */}
                <path
                  className="anim-path"
                  d="M80 80 L520 80 L480 280 L120 280 Z"
                  stroke={selectedVariant.id === 'crimson' ? '#e52b2b' : '#f5f4f0'}
                  strokeWidth="2"
                  strokeLinecap="square"
                  fill="none"
                />

                {/* Internal Gusset Planes */}
                <path
                  className="anim-path"
                  d="M120 80 L150 280 M480 80 L450 280"
                  stroke="#888888"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />

                {/* Central Closure Flap with GROZ Angled Cut */}
                <path
                  className="anim-path"
                  d="M190 80 L190 190 L300 230 L410 190 L410 80"
                  stroke={selectedVariant.id === 'crimson' ? '#e52b2b' : '#ffffff'}
                  strokeWidth="2"
                  strokeLinecap="square"
                  fill="none"
                />

                {/* Hardware Tension Anchor Point */}
                <path
                  className="anim-path"
                  d="M280 215 L320 215 L320 250 L280 250 Z"
                  stroke="#e52b2b"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                />

                {/* Seahorse Emblem Hallmark Outline (Stylized) */}
                <path
                  className="anim-path"
                  d="M290 130 C290 120 310 115 315 125 C320 135 305 145 300 155 C295 165 305 180 300 190 C296 198 285 205 285 195"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="square"
                  fill="none"
                />

                {/* Technical Dimension Callout Lines */}
                <line x1="60" y1="80" x2="60" y2="280" stroke="#555555" strokeWidth="1" />
                <line x1="50" y1="80" x2="70" y2="80" stroke="#555555" strokeWidth="1" />
                <line x1="50" y1="280" x2="70" y2="280" stroke="#555555" strokeWidth="1" />
                <text x="35" y="185" fill="#888888" fontSize="10" fontFamily="monospace" transform="rotate(-90 40 185)">
                  195mm (TBC)
                </text>

                <line x1="80" y1="310" x2="520" y2="310" stroke="#555555" strokeWidth="1" />
                <line x1="80" y1="300" x2="80" y2="320" stroke="#555555" strokeWidth="1" />
                <line x1="520" y1="300" x2="520" y2="320" stroke="#555555" strokeWidth="1" />
                <text x="270" y="330" fill="#888888" fontSize="10" fontFamily="monospace">
                  280mm (TBC)
                </text>
              </svg>
            </div>

            {/* Bottom Status Ticker */}
            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono-editorial text-neutral-500 pt-4 border-t border-neutral-800">
              <span>STATUS: VECTOR DRAWING RENDERED</span>
              <span className="text-red-500 uppercase">INSPECTION ACTIVE</span>
            </div>
          </div>

          {/* Right Column: Accessible Variant Selectors & Updating Facts */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xs uppercase font-mono-editorial tracking-[0.25em] text-groz-muted mb-4 pb-2 border-b border-groz">
                Select Architectural Variant
              </h3>

              {/* Accessible Variant Buttons */}
              <div className="space-y-3" role="radiogroup" aria-label="Specimen Variants">
                {VARIANTS.map((variant) => {
                  const isSelected = selectedVariant.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full text-left p-4 border transition-all focus:outline-none focus:ring-1 focus:ring-groz-red ${
                        isSelected
                          ? 'border-groz-red bg-groz-surface shadow-sm'
                          : 'border-groz bg-groz-main hover:border-groz-red/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-mono-editorial font-medium ${isSelected ? 'text-groz-red' : 'text-groz-main'}`}>
                          {t(variant.nameKey)}
                        </span>
                        <div
                          className="w-3.5 h-3.5 border border-groz"
                          style={{ backgroundColor: variant.accentColor }}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-1 text-xs font-serif-editorial text-groz-muted">
                        {language === 'bn' ? variant.envelopeBn : variant.envelopeEn}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Three Facts that Update Dynamically */}
            <div className="border border-groz bg-groz-main p-6 space-y-4">
              <h4 className="text-xs uppercase font-mono-editorial tracking-[0.25em] text-groz-red border-b border-groz-subtle pb-2 flex items-center justify-between">
                <span>Specimen Parameters</span>
                <span className="text-groz-muted">{selectedVariant.id.toUpperCase()}</span>
              </h4>

              {/* Fact 1 */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono-editorial uppercase tracking-wider text-groz-muted">
                  01 &bull; {t('demoFact1Label')}
                </div>
                <div className="text-sm font-serif-editorial text-groz-main">
                  {language === 'bn' ? selectedVariant.fact1Bn : selectedVariant.fact1En}
                </div>
              </div>

              <div className="border-t border-groz-subtle" />

              {/* Fact 2 */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono-editorial uppercase tracking-wider text-groz-muted">
                  02 &bull; {t('demoFact2Label')}
                </div>
                <div className="text-sm font-serif-editorial text-groz-main">
                  {language === 'bn' ? selectedVariant.fact2Bn : selectedVariant.fact2En}
                </div>
              </div>

              <div className="border-t border-groz-subtle" />

              {/* Fact 3 */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono-editorial uppercase tracking-wider text-groz-muted">
                  03 &bull; {t('demoFact3Label')}
                </div>
                <div className="text-sm font-serif-editorial text-groz-main">
                  {language === 'bn' ? selectedVariant.fact3Bn : selectedVariant.fact3En}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

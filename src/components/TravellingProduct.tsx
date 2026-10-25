import React, { useState, useEffect } from 'react';

interface TravellingProductProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export const TravellingProduct: React.FC<TravellingProductProps> = () => {
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    const handleScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // If user requests reduced motion, hide or disable the travelling animation as strictly required
  if (prefersReducedMotion) {
    return null;
  }

  // Calculate coordinates based on scroll progress over the first 1200px
  // Requirement: Ensure the product moves visibly by more than 100 pixels during the first 700 pixels of scrolling.
  // At 700px scroll, deltaY will be ~280px (well over 100px requirement)
  const maxTravel = 1200;
  const progress = Math.min(Math.max(scrollY / maxTravel, 0), 1);

  // Position, rotation, scale, and opacity bound smoothly to scroll
  const translateY = scrollY * 0.42; // at 700px => 294px movement
  const translateX = Math.sin(progress * Math.PI) * -80; // subtle editorial lateral sway
  const rotation = progress * -18; // smooth -18 deg tilt
  const scale = 1 - progress * 0.28; // gentle scale down from 1.0 to 0.72
  const opacity = scrollY > 1100 ? Math.max(0, 1 - (scrollY - 1100) / 200) : 1;

  // Once user scrolls past Section 2 and into Section 3 (Interactive Demo), fade out cleanly
  if (opacity <= 0) return null;

  return (
    <div
      className="fixed pointer-events-none z-30 transition-opacity duration-300"
      style={{
        top: '22%',
        right: '12%',
        transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg) scale(${scale})`,
        opacity,
        willChange: 'transform, opacity',
      }}
      aria-hidden="true"
    >
      <div className="relative group">
        {/* Editorial Specimen Frame with soft floating shadow beneath the cutout */}
        <div className="w-44 h-56 sm:w-56 sm:h-72 md:w-64 md:h-80 bg-neutral-900 border border-neutral-800 shadow-cutout flex items-center justify-center p-4 relative overflow-hidden">
          {/* Subtle architectural crosshairs */}
          <div className="absolute top-2 left-2 text-[9px] font-mono-editorial text-red-500/70 tracking-widest uppercase">
            SPECIMEN NO. 01
          </div>
          <div className="absolute bottom-2 right-2 text-[8px] font-mono-editorial text-neutral-400/60 tracking-wider uppercase">
            ARCHIVAL EMBLEM
          </div>
          
          <img
            src="/assets/aistudio/FB_IMG_1792947438632_9dd0b6b3.jpg"
            alt="GROZ Travelling Product Specimen"
            className="w-full h-full object-contain filter brightness-110 contrast-125"
          />

          {/* Precision Red Accent Pin */}
          <div className="absolute top-1/2 left-0 w-1.5 h-6 bg-red-600 -translate-y-1/2" />
        </div>

        {/* Dynamic coordinate readout tag */}
        <div className="mt-2 text-right">
          <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono-editorial bg-neutral-950/80 text-neutral-400 border border-neutral-800">
            &Delta;Z: {(progress * 100).toFixed(0)}% &bull; Y: {Math.round(translateY)}px
          </span>
        </div>
      </div>
    </div>
  );
};

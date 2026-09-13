import React, { useState, useEffect } from 'react';
import HeroSearch from './HeroSearch';

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=85',
    alt: 'Modern sunlit living room and high-rise apartment interior',
    label: 'Modern 2BHK Living'
  },
  {
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=85',
    alt: 'Sunlit designer studio flat with large windows and wooden flooring',
    label: 'Studio Apartment'
  },
  {
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=85',
    alt: 'Cozy fully furnished private bedroom with work desk',
    label: 'Furnished Private Room'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
    alt: 'Contemporary luxury apartment with panoramic city views',
    label: 'Luxury Gated Society'
  },
  {
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85',
    alt: 'Aesthetic minimalist loft apartment with warm ambient lighting',
    label: 'Premium Co-living Loft'
  }
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Smooth cross-fade transition every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[580px] lg:min-h-[660px] w-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 overflow-hidden py-16">
      
      {/* 1. IMMERSIVE HERO BACKGROUND WITH SMOOTH CROSS-FADE TRANSITIONS */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        {HERO_IMAGES.map((image, index) => {
          const isActive = index === currentImageIndex;
          return (
            <div
              key={image.url}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out will-change-transform ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Atmospheric gradient overlay for maximum typography & search bar contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/30 z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent h-28 bottom-0 top-auto z-20" />
      </div>

      {/* 2. HERO CONTENT */}
      <div className="relative z-30 max-w-7xl mx-auto w-full">
        
        <div className="max-w-2xl text-left space-y-4">
          
          {/* Eyebrow */}
          <p className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-slate-900 uppercase">
            VERIFIED ROOMS, FLATS & HOMES TO RENT OR BUY
          </p>

          {/* Main Headline with Serif Italic Accent */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
            Find your next <br />
            <span className="font-serif italic font-extrabold text-[#FE424D] tracking-normal">
              room or home
            </span>
          </h1>

          {/* Subtitle tailored to room rental & buying */}
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-lg pt-1">
            Discover verified single rooms, shared flats, studio apartments, and family homes to rent or buy directly from owners — with zero hidden brokerage.
          </p>

        </div>

        {/* 3. FLOATING SEARCH CAPSULE */}
        <div className="mt-8 sm:mt-12">
          <HeroSearch />
        </div>

        {/* 4. SUBTLE IMAGE SLIDE INDICATORS (Bottom-Right) */}
        <div className="hidden sm:flex items-center gap-2 mt-6">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              aria-label={`Switch to background slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentImageIndex
                  ? 'w-8 bg-slate-900'
                  : 'w-2 bg-slate-400/60 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Henrik Sandberg',
    role: 'Tech Lead',
    location: 'Bangalore, India',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    headline: 'Found a furnished 2BHK in 48 hours without brokers.',
    quote: 'Relocating to Bangalore for work was daunting until I discovered RoomWati. Zero broker commission, direct contact with a verified landlord, and I moved in that same weekend.',
    rating: 5,
    property: '2BHK Indiranagar, Bangalore'
  },
  {
    id: 2,
    name: 'Aditi Sharma',
    role: 'University Student',
    location: 'Delhi NCR, India',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    headline: 'Found verified student flatmates and a safe private room.',
    quote: 'Found two wonderful flatmates studying at the same university. High-speed Wi-Fi, attached bathroom, and a landlord who respects our privacy. Saved my entire first month budget on brokerage!',
    rating: 5,
    property: 'Private Room near North Campus'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'UI Designer',
    location: 'Pune, India',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    headline: 'Transparent deposits and 15-minute digital agreements.',
    quote: 'No surprise maintenance fees or unfair deductions. The rental agreement was signed digitally and all bills were clearly documented. The cleanest rental experience I have had.',
    rating: 5,
    property: 'Studio Flat, Viman Nagar'
  },
  {
    id: 4,
    name: 'Rohan Malhotra',
    role: 'Property Owner',
    location: 'Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    headline: 'Listed my flat for free and found verified tenants in 3 days.',
    quote: 'RoomWati tenant background checks gave me absolute confidence. Both my 1BHK and 2BHK apartments were rented to responsible working professionals within the first week.',
    rating: 5,
    property: 'Verified Landlord, Mumbai'
  },
  {
    id: 5,
    name: 'Maya Lin',
    role: 'Marketing Lead',
    location: 'Hyderabad, India',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    headline: 'Direct property buying saved us over ₹1.5 Lakhs in agent fees.',
    quote: 'We connected directly with the builder and owner in Gachibowli. Transparent pricing, verified title checks, and zero middlemen pressure. Highly recommend for home buyers!',
    rating: 5,
    property: '3BHK Gachibowli, Hyderabad'
  }
];

export default function TestimonialBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  const total = TESTIMONIALS.length;

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Continuous uninterrupted loop (changes every 2.2 seconds endlessly)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 2200);

    return () => clearInterval(interval);
  }, [total]);

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      nextTestimonial();
    } else if (diff < -50) {
      prevTestimonial();
    }
    touchStartX.current = null;
  };

  // Helper to calculate relative visual offset (-2 to +2)
  const getCardOffset = (index) => {
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]/90 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-6xl mx-auto">

        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FE424D]">
            REAL STORIES FROM REAL TENANTS & OWNERS
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by 50,000+ Renters & Landlords
          </h2>
        </div>

        {/* 1. TESTIMONIAL MOTION: 3D FAN / ARC DECK OF PORTRAITS */}
        <div className="relative h-[360px] sm:h-[400px] flex items-center justify-center select-none">
          {TESTIMONIALS.map((item, index) => {
            const offset = getCardOffset(index);
            const isCenter = offset === 0;

            // Positioning styles based on relative offset
            let style = {};
            let isVisible = Math.abs(offset) <= 2;

            if (offset === 0) {
              // ACTIVE CENTER
              style = {
                transform: 'translateX(0%) scale(1.18) rotate(0deg)',
                zIndex: 30,
                opacity: 1,
              };
            } else if (offset === -1) {
              // LEFT 1
              style = {
                transform: 'translateX(-90%) scale(0.92) rotate(-5deg) translateY(12px)',
                zIndex: 20,
                opacity: 0.82,
              };
            } else if (offset === 1) {
              // RIGHT 1
              style = {
                transform: 'translateX(90%) scale(0.92) rotate(5deg) translateY(12px)',
                zIndex: 20,
                opacity: 0.82,
              };
            } else if (offset === -2) {
              // FAR LEFT
              style = {
                transform: 'translateX(-175%) scale(0.78) rotate(-9deg) translateY(24px)',
                zIndex: 10,
                opacity: 0.45,
              };
            } else if (offset === 2) {
              // FAR RIGHT
              style = {
                transform: 'translateX(175%) scale(0.78) rotate(9deg) translateY(24px)',
                zIndex: 10,
                opacity: 0.45,
              };
            } else {
              style = {
                transform: 'scale(0.5)',
                zIndex: 0,
                opacity: 0,
                pointerEvents: 'none'
              };
            }

            if (!isVisible) return null;

            return (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                style={style}
                className="absolute w-52 sm:w-60 h-72 sm:h-80 rounded-3xl overflow-visible cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              >
                {/* Main Card Body */}
                <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-2xl border-2 border-white bg-slate-900 group">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  {/* Text Over Card */}
                  <div className="absolute bottom-4 left-4 right-4 text-center text-white space-y-1">
                    <div className="flex items-center justify-center gap-0.5 mb-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="font-extrabold text-sm sm:text-base leading-tight drop-shadow-sm">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-white/80 font-medium">
                      {item.role}
                    </p>
                    <p className="text-[10px] text-white/60 tracking-wider">
                      {item.location}
                    </p>
                  </div>
                </div>

                {/* Floating Quote Badge (On active center card) */}
                {isCenter && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-800 z-40 animate-fade-in">
                    <Quote className="w-4 h-4 text-slate-800 fill-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 2. EDITORIAL NARRATIVE STATEMENT & REVIEW BODY */}
        <div
          key={current.id}
          className="mt-8 text-center max-w-2xl mx-auto space-y-3 px-4 min-h-[120px] flex flex-col justify-center animate-fade-in transition-all duration-300"
        >
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
            “{current.headline}”
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            {current.quote}
          </p>
        </div>

        {/* 3. CONTROLS: PREV ARROW, EXPANDING PILL DOTS, NEXT ARROW */}
        <div className="mt-8 flex items-center justify-center gap-4">

          {/* Previous Button */}
          <button
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
            className="w-9 h-9 rounded-full bg-white border border-slate-200/90 hover:border-slate-400 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-1.5 px-2">
            {TESTIMONIALS.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setCurrentIndex(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${currentIndex === dotIndex
                  ? 'w-6 bg-slate-900'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextTestimonial}
            aria-label="Next testimonial"
            className="w-9 h-9 rounded-full bg-white border border-slate-200/90 hover:border-slate-400 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </section>
  );
}

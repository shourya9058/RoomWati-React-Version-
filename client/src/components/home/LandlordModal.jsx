import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  PlusCircle, 
  ArrowRight, 
  Zap, 
  Users, 
  MessageSquare, 
  ShieldCheck 
} from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    tag: 'Living',
    caption: 'List Host Connect Belong',
  },
  {
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85',
    tag: 'Studio',
    caption: 'Warm Furnished Spaces',
  },
  {
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
    tag: 'Balcony Flat',
    caption: 'Zero Deposit • Zero Brokerage',
  },
  {
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
    tag: 'PG & Rooms',
    caption: 'Verified Working Tenants',
  },
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    tag: 'Apartments',
    caption: 'Direct Landlord Deals',
  },
];

export default function LandlordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Check if user already dismissed in this session
    const hasDismissed = sessionStorage.getItem('roomwati_landlord_modal_dismissed');
    if (hasDismissed) return;

    // Trigger modal 2.8 seconds after landing on the homepage
    const timer = setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => setIsVisible(true), 50);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // Automatic smooth slideshow progression
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem('roomwati_landlord_modal_dismissed', 'true');
    }, 350);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ${
        isVisible ? 'opacity-100 backdrop-blur-md bg-black/60' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Card - 2-Column Split */}
      <div 
        className={`relative w-full max-w-4xl rounded-3xl overflow-hidden bg-white shadow-2xl transition-all duration-500 ease-out transform ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-6 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Clean White Form / Benefits & Actions                       */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between text-left space-y-6 bg-white">
            
            {/* Header */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#FE424D]">
                FOR ROOM OWNERS & LANDLORDS
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Have a room or flat <br />
                to rent out?
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed pt-1">
                List your room, PG, studio or flat for free. Get verified tenant leads, zero brokerage, and direct chat with tenants.
              </p>
            </div>

            {/* 4 Feature Items */}
            <div className="space-y-3.5">
              
              {/* Item 1 */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-[#FE424D] shrink-0">
                  <Zap className="w-4 h-4 fill-[#FE424D]/20" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">100% Free Listing</h4>
                  <p className="text-[11px] text-slate-500">No hidden charges or commissions.</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-[#FE424D] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Verified Tenant Leads</h4>
                  <p className="text-[11px] text-slate-500">Connect with genuine, interested tenants.</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-[#FE424D] shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Direct Chat</h4>
                  <p className="text-[11px] text-slate-500">Talk directly, no middlemen.</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-[#FE424D] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Safe & Secure</h4>
                  <p className="text-[11px] text-slate-500">Your data and listings are always protected.</p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <Link
                to="/listings/new"
                onClick={handleClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Free Property Ad</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 transition-colors"
              >
                Explore Rentals
              </button>
            </div>

            {/* Social Proof with 3 Avatars */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Landlord"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Landlord"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Landlord"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                />
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">
                Join <span className="font-bold text-slate-800">25,000+ happy landlords</span> across India.
              </p>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Automatic Smooth Cross-Fade Slideshow                      */}
          {/* ========================================================================= */}
          <div className="relative hidden md:block min-h-[480px] w-full overflow-hidden bg-slate-900">
            
            {/* Cross-Fading Images */}
            {SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.caption}
                  className={`w-full h-full object-cover object-center transition-transform duration-[4000ms] ease-out ${
                    idx === currentSlide ? 'scale-105' : 'scale-100'
                  }`}
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
              </div>
            ))}

            {/* Dynamic Poster Art Tag Overlay */}
            <div className="absolute top-16 right-10 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white/60 text-slate-800 shadow-md max-w-[140px] text-center hidden lg:block z-10 transition-all duration-500">
              <p className="text-[10px] font-bold tracking-wider uppercase text-[#FE424D]">
                {SLIDES[currentSlide].tag}
              </p>
              <p className="font-serif italic font-semibold text-xs text-slate-900 leading-tight pt-0.5">
                {SLIDES[currentSlide].caption}
              </p>
            </div>

            {/* Bottom Section: Interactive Dots & Cursive Tag */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              
              {/* Interactive Carousel Dots */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Slideshow pagination">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full focus:outline-none ${
                      idx === currentSlide
                        ? 'w-6 h-1.5 bg-white shadow-sm'
                        : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/90'
                    }`}
                  />
                ))}
              </div>

              {/* Handwritten Script Signature */}
              <div className="text-right">
                <p className="font-script text-xl font-bold text-white leading-none tracking-wide drop-shadow-md">
                  Spaces <br />
                  <span className="text-slate-100">create stories</span>
                </p>
                <div className="w-10 h-0.5 bg-[#FE424D] rounded-full ml-auto mt-1" />
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

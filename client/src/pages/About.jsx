import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  ShieldCheck, 
  Heart, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';

import AnimatedCounter from '../components/common/AnimatedCounter';

export default function About() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: "OUR STORY - A more human way to find a home."          */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden border-b border-slate-100">
        
        {/* Panoramic Background Image: Sunlit Room with Desk & City Skyline */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85"
            alt="Warm sunlit bedroom with work desk and city view"
            className="w-full h-full object-cover object-[center_30%]"
          />
          {/* Soft white gradient on the left for maximum contrast & crisp readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent md:via-white/90 md:to-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:hidden" />
        </div>

        {/* Framed Wall Poster Overlay on the Right (matches screenshot) */}
        <div className="absolute top-12 right-12 lg:right-24 z-10 hidden md:block bg-white/75 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-md text-center max-w-[140px]">
          <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Living</p>
          <p className="font-serif italic font-bold text-xs text-slate-900 leading-snug pt-1">
            Good People <br />
            Better Homes
          </p>
        </div>

        {/* Cursive Tag in Bottom Right of Hero Image */}
        <div className="absolute bottom-8 right-12 z-10 hidden md:block text-right">
          <p className="font-script text-2xl font-bold text-slate-800 leading-none tracking-wide drop-shadow-sm">
            Spaces <br />
            <span className="text-[#FE424D]">for real people</span>
          </p>
          <div className="w-12 h-0.5 bg-[#FE424D] rounded-full ml-auto mt-1" />
        </div>

        {/* Hero Content on the Left */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-20 w-full">
          <div className="max-w-xl space-y-6 text-left">
            
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FE424D]">
              OUR STORY
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
              A more human <br />
              way to <span className="text-[#FE424D]">find a home.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              RoomWati was built to make renting simpler, safer, and more transparent — for everyone. Whether you're a student finding your first room, a professional relocating, or a property owner listing a space, we're here to make the experience better.
            </p>

            <div className="pt-2">
              <Link
                to="/listings"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Explore Listings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. STATS BAR: 4-Column Metric Counter with Vertical Dividers              */}
      {/* ========================================================================= */}
      <section className="w-full bg-white border-b border-slate-100 py-10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
            
            {/* Metric 1 */}
            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                <AnimatedCounter target={25000} suffix="+" duration={2000} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Verified Rooms & Flats</p>
            </div>

            {/* Metric 2 */}
            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                <AnimatedCounter target={100000} suffix="+" duration={2200} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Happy Tenants Housed</p>
            </div>

            {/* Metric 3 */}
            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#FE424D] tracking-tight">
                <AnimatedCounter target={0} prefix="₹" duration={1000} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Brokerage Charged</p>
            </div>

            {/* Metric 4 */}
            <div className="text-center px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                <AnimatedCounter target={15} suffix="+" duration={1800} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Major Indian Metros</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "WHY WE EXIST" & 4 PILLARS (2-Column Grid)                             */}
      {/* ========================================================================= */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-12 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Col: Why We Exist Headline (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FE424D]">
                WHY WE EXIST
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Renting should feel simple, not stressful.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                We started RoomWati with a simple idea — to remove the unnecessary complexity from the rental journey. No fake listings, no hidden fees, no middlemen. Just real people, real spaces, and real opportunities.
              </p>
            </div>

            {/* Right Col: 2x2 Feature Grid (7 Cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Item 1: For Tenants */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#FE424D] flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">For Tenants</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Find verified rooms and flats that fit your needs and budget.
                  </p>
                </div>
              </div>

              {/* Item 2: For Property Owners */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#FE424D] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">For Property Owners</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    List your property for free and connect directly with tenants.
                  </p>
                </div>
              </div>

              {/* Item 3: Built on Trust */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#FE424D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Built on Trust</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Every listing is verified to ensure a safer, more reliable experience.
                  </p>
                </div>
              </div>

              {/* Item 4: A Growing Community */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#FE424D] flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-[#FE424D]/10" />
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">A Growing Community</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    From students to working professionals, we're building a rental community across India.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. "OUR MISSION: Better living. Brighter futures." (2-Column Split)        */}
      {/* ========================================================================= */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Col: Photo of Team Collaborating with Framed Poster (6 Cols) */}
            <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-xl border border-slate-100 aspect-[4/3] bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85"
                alt="RoomWati team members collaborating in sunlit modern space"
                className="w-full h-full object-cover"
              />
              
              {/* Framed Wall Art in top-right of the image */}
              <div className="absolute top-6 right-6 bg-white/85 backdrop-blur-md p-3.5 rounded-xl border border-white/60 shadow-md text-center max-w-[130px] hidden sm:block">
                <p className="font-serif italic font-bold text-xs text-slate-900 leading-snug">
                  Better Stays <br />
                  Brighter Futures
                </p>
              </div>
            </div>

            {/* Right Col: Mission Content & CTA (6 Cols) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FE424D]">
                OUR MISSION
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Better living. <br />
                Brighter futures.
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                <p>
                  We believe that where you live shapes how you live. A safe, comfortable, and affordable home gives you the freedom to focus on what truly matters — your education, your work, your dreams.
                </p>
                <p>
                  Our mission is to make quality rental housing accessible to everyone, across every city in India.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/listings"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Join Our Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

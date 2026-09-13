import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircle } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-20 px-4 sm:px-6 lg:px-8">
      
      {/* Background panoramic architectural apartment photo with dark slate tint */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85"
          alt="Modern residential building and apartments"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/65" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="space-y-3 text-center md:text-left max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#FE424D]">
            FOR ROOM OWNERS & LANDLORDS
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-serif">
            Have a room or flat to rent out?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            List your room, PG, studio or flat for free. Get verified tenant leads, zero brokerage, and direct chat with tenants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 shrink-0">
          <Link
            to="/listings/new"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#FE424D]/30 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Post Free Property Ad</span>
          </Link>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all"
          >
            <span>Explore Rentals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </section>
  );
}

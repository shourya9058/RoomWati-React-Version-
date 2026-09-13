import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, IndianRupee, Users, FileCheck, ArrowRight } from 'lucide-react';

const BENEFITS = [
  {
    icon: IndianRupee,
    title: 'Zero Brokerage Fees',
    description: 'Connect directly with verified room owners and flatmates without paying hefty broker commissions.',
  },
  {
    icon: ShieldCheck,
    title: '100% Verified Properties',
    description: 'Real photos, transparent security deposit terms, and verified landlord identities for complete peace of mind.',
  },
  {
    icon: Users,
    title: 'Find Compatible Flatmates',
    description: 'Match with like-minded students or working professionals based on habits, food preferences, and routines.',
  },
  {
    icon: FileCheck,
    title: 'Instant Online Agreements',
    description: 'Generate legally vetted digital rental agreements and complete your move-in without tedious paperwork.',
  },
];

export default function WhyRoomWati() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* 1. LEFT COLUMN: IMAGE WITH POLAROID BADGE */}
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-xl relative bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=85"
              alt="Stylish modern furnished room and living area"
              className="w-full h-full object-cover"
            />
            
            {/* Angled Polaroid Badge in Bottom-Left */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-floating border border-slate-100/80 -rotate-3 hover:rotate-0 transition-transform duration-300 max-w-[210px]">
              <p className="font-script text-xl font-bold leading-tight text-slate-800">
                <span className="text-[#FE424D]">Zero</span> Brokerage <br />
                Direct Landlords
              </p>
              <div className="w-16 h-1 bg-[#FE424D] rounded-full mt-1.5" />
            </div>
          </div>
        </div>

        {/* 2. RIGHT COLUMN: COPY, 2x2 BENEFITS GRID & ACTION */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="space-y-3">
            <p className="text-[11px] font-black tracking-[0.2em] text-[#FE424D] uppercase">
              WHY RENT & BUY WITH ROOMWATI
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-serif leading-tight">
              Renting made simple, transparent & broker-free
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Finding a comfortable room or buying your first home shouldn't be stressful. RoomWati gives you direct owner contacts, clear deposit policies, and verified roommate matching.
            </p>
          </div>

          {/* 2x2 Grid with Red Line Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {BENEFITS.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full border-2 border-[#FE424D]/30 bg-rose-50/50 text-[#FE424D] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-sm shadow-md shadow-[#FE424D]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Browse Available Rooms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/listings/new"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all"
            >
              <span>List Your Property Free</span>
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}

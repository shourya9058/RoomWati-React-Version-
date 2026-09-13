import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Heart, UserCheck, Lock } from 'lucide-react';

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#FE424D] text-xs font-bold uppercase tracking-wider">
            Trust, Respect & Safety
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            RoomWati Community Guidelines
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Our guidelines ensure every room seeker and property owner enjoys a respectful, transparent, and secure rental experience.
          </p>
        </div>

        {/* Guidelines List */}
        <div className="space-y-6">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Truthful & Accurate Listings</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-12">
              All photos, rental pricing, security deposit amounts, and amenity descriptions must be real, recent, and accurate. Misleading pictures or bait-and-switch pricing is strictly prohibited and leads to immediate account deactivation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-50 text-[#FE424D] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Zero Discrimination Policy</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-12">
              RoomWati is open to everyone. Discrimination based on religion, gender, state of origin, sexual orientation, caste, or marital status is not tolerated in listing descriptions or chat conversations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Safe Transactions & Scam Prevention</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-12">
              Never transfer advance booking fees or token money before physically visiting the property and verifying ownership. RoomWati does not charge any brokerage fees or asking-price commission.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">4. Respect & Timely Communication</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-12">
              Both landlords and tenants are expected to communicate courteously, arrive on time for scheduled property visits, and provide advance notice if plans change.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

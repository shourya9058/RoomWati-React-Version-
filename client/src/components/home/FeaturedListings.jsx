import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home as HomeIcon } from 'lucide-react';
import ListingCard from '../listings/ListingCard';
import ListingCardSkeleton from '../listings/ListingCardSkeleton';

export default function FeaturedListings({ listings, loading, error, onRetry }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-black tracking-[0.2em] text-[#FE424D] uppercase mb-1">
            VERIFIED RENTALS & PROPERTIES
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-serif">
            Featured rooms & flats
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Explore handpicked single rooms, studio apartments, and shared flats with verified landlords and zero brokerage.
          </p>
        </div>

        <Link
          to="/listings"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FE424D] hover:text-[#e0333e] transition-colors group shrink-0"
        >
          <span>View all listings</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 2. LISTINGS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto shadow-sm">
          <p className="text-rose-500 font-bold text-sm mb-2">{error}</p>
          <p className="text-xs text-slate-500 mb-5">We couldn't load stays right now.</p>
          <button
            onClick={onRetry}
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            Try Again
          </button>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-10 max-w-md mx-auto shadow-sm">
          <HomeIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No stays found</h3>
          <p className="text-xs text-slate-500 mb-4">Try selecting another category or exploring all listings.</p>
          <Link
            to="/listings"
            className="inline-block px-5 py-2.5 rounded-full bg-[#FE424D] text-white text-xs font-bold hover:bg-[#e0333e]"
          >
            Explore all listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.slice(0, 4).map((listing) => (
            <ListingCard key={listing._id || listing.id} listing={listing} />
          ))}
        </div>
      )}

    </section>
  );
}

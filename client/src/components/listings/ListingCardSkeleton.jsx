import React from 'react';

export default function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-3 sm:p-3.5 border border-slate-200/80 shadow-sm animate-pulse space-y-3">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full bg-slate-200 rounded-2xl" />
      
      {/* Title & Rating */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-4 bg-slate-200 rounded w-12" />
      </div>

      {/* Location */}
      <div className="h-3 bg-slate-200 rounded w-1/2" />

      {/* Tags */}
      <div className="flex items-center gap-1.5 pt-1">
        <div className="h-5 bg-slate-100 rounded-full w-16" />
        <div className="h-5 bg-slate-100 rounded-full w-16" />
      </div>

      {/* Price */}
      <div className="h-5 bg-slate-200 rounded w-24 pt-1" />
    </div>
  );
}

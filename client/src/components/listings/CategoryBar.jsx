import React from 'react';
import { 
  Bed, 
  Home, 
  Bath, 
  Users, 
  Sparkles, 
  Flame, 
  Building, 
  Compass, 
  SlidersHorizontal,
  Waves,
  Mountain,
  Palmtree
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Stays', icon: Compass },
  { id: 'single', label: 'Single Room', icon: Bed },
  { id: 'ensuite', label: 'Ensuite Room', icon: Bath },
  { id: 'studio', label: 'Studio Flat', icon: Home },
  { id: 'shared', label: 'Shared Flat', icon: Users },
  { id: 'popular', label: 'Trending', icon: Flame, isSort: true },
];

export default function CategoryBar({ selectedCategory, onSelectCategory, onOpenFilters, activeFilterCount = 0 }) {
  return (
    <div className="w-full bg-white border-b border-slate-200/80 sticky top-20 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth flex-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id, cat.isSort)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Toggle Button */}
        <div className="shrink-0 flex items-center gap-2 border-l border-slate-200 pl-4">
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:border-slate-400 text-xs sm:text-sm font-semibold text-slate-800 transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-500" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[11px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

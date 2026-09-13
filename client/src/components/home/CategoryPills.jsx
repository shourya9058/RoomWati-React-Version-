import React from 'react';
import { 
  Home, 
  Bed, 
  Users, 
  Building, 
  Building2, 
  Armchair, 
  Key, 
  Sparkles 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Properties', icon: Home },
  { id: 'single', label: 'Single Rooms', icon: Bed },
  { id: 'shared', label: 'Shared / PG', icon: Users },
  { id: 'studio', label: 'Studio Flats', icon: Building },
  { id: 'entire_apartment', label: '1 & 2 BHK Flats', icon: Building2 },
  { id: 'furnished', label: 'Fully Furnished', icon: Armchair },
  { id: 'buy', label: 'Buy Homes', icon: Key },
  { id: 'budget', label: 'Zero Deposit', icon: Sparkles },
];

export default function CategoryPills({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full bg-white border-b border-slate-200/80 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 pb-2 transition-all duration-200 shrink-0 relative group ${
                  isSelected
                    ? 'text-[#FE424D] font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                <div className={`p-1 transition-transform group-hover:scale-110 ${
                  isSelected ? 'text-[#FE424D]' : 'text-slate-700'
                }`}>
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
                <span className="text-xs">{cat.label}</span>
                
                {/* Active Underline Indicator */}
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FE424D] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

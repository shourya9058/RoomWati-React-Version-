import React, { useState, useEffect } from 'react';
import { X, Check, Wifi, Wind, Bath, UtensilsCrossed, Car, Shirt, Zap, RotateCcw } from 'lucide-react';

export default function FilterModal({ isOpen, onClose, filters, onApplyFilters, onResetFilters }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setLocalFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      minPrice: '',
      maxPrice: '',
      roomType: 'all',
      genderPreference: 'any',
      immediateAvailability: false,
      wifi: false,
      ac: false,
      attachedBathroom: false,
      kitchenAccess: false,
      parking: false,
      laundry: false,
      sort: '',
    };
    setLocalFilters(emptyFilters);
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-slate-900">Filters</h2>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* 1. Price Range */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Price Range (Monthly)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Minimum (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleChange('minPrice', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Maximum (₹)</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleChange('maxPrice', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* 2. Room Type */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Room Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'single', label: 'Single' },
                { id: 'ensuite', label: 'Ensuite' },
                { id: 'studio', label: 'Studio' },
                { id: 'shared', label: 'Shared' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleChange('roomType', t.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    (localFilters.roomType || 'all') === t.id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* 3. Gender Preference */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Tenant / Gender Preference</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'any', label: 'Any' },
                { id: 'male', label: 'Male Only' },
                { id: 'female', label: 'Female Only' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleChange('genderPreference', g.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    (localFilters.genderPreference || 'any') === g.id
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* 4. Instant Move-in Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Instant Availability</p>
              <p className="text-xs text-slate-500">Only show rooms ready for immediate move-in</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('immediateAvailability')}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                localFilters.immediateAvailability ? 'bg-brand-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  localFilters.immediateAvailability ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-slate-100" />

          {/* 5. Amenities Checkboxes */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Amenities & Facilities</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'wifi', label: 'High-speed Wi-Fi', icon: Wifi },
                { key: 'ac', label: 'Air Conditioning (AC)', icon: Wind },
                { key: 'attachedBathroom', label: 'Attached Bathroom', icon: Bath },
                { key: 'kitchenAccess', label: 'Kitchen Access', icon: UtensilsCrossed },
                { key: 'parking', label: 'Vehicle Parking', icon: Car },
                { key: 'laundry', label: 'Laundry / Washing', icon: Shirt },
              ].map((amenity) => {
                const Icon = amenity.icon;
                const checked = Boolean(localFilters[amenity.key]);

                return (
                  <button
                    key={amenity.key}
                    type="button"
                    onClick={() => handleToggle(amenity.key)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                      checked
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${checked ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span className="flex-1">{amenity.label}</span>
                    {checked && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* 6. Sorting */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Sort By</h3>
            <select
              value={localFilters.sort || ''}
              onChange={(e) => handleChange('sort', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="">Default (Newest first)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Favorited</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleReset}
            className="text-sm font-bold text-slate-600 hover:text-slate-900 underline"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Show Results
          </button>
        </div>

      </div>
    </div>
  );
}

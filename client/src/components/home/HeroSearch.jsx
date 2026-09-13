import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Home, 
  IndianRupee, 
  Users, 
  Minus, 
  Plus, 
  X,
  Compass,
  Check,
  Building,
  Key
} from 'lucide-react';

const POPULAR_RENTAL_CITIES = [
  { name: 'Bangalore', state: 'Koramangala, HSR, Indiranagar', icon: '🏙️' },
  { name: 'Delhi NCR', state: 'Gurgaon, Noida, South Delhi', icon: '🏛️' },
  { name: 'Mumbai', state: 'Bandra, Andheri, Powai', icon: '🌊' },
  { name: 'Pune', state: 'Hinjawadi, Viman Nagar, Kothrud', icon: '🎓' },
  { name: 'Hyderabad', state: 'Gachibowli, Hitec City, Madhapur', icon: '💻' },
  { name: 'Chennai', state: 'OMR, Velachery, Adyar', icon: '🌴' }
];

const ROOM_TYPES = [
  { id: '', label: 'All Types', desc: 'Any room or property' },
  { id: 'single', label: 'Single Private Room', desc: 'Private room in shared flat' },
  { id: 'shared', label: 'Shared Room / PG', desc: 'Twin/triple sharing for students' },
  { id: 'studio', label: 'Studio Apartment', desc: '1RK / Compact self-contained flat' },
  { id: 'entire_apartment', label: '1 & 2 BHK Flat', desc: 'Full apartment for family/friends' },
  { id: 'ensuite', label: 'Master Bedroom', desc: 'Attached private bathroom & balcony' }
];

const BUDGET_RANGES = [
  { label: 'Any Budget', maxPrice: '' },
  { label: 'Under ₹10,000/mo', maxPrice: '10000' },
  { label: '₹10,000 – ₹20,000/mo', maxPrice: '20000' },
  { label: '₹20,000 – ₹35,000/mo', maxPrice: '35000' },
  { label: '₹35,000 – ₹60,000/mo', maxPrice: '60000' },
  { label: '₹60,000+/mo', maxPrice: '100000' }
];

export default function HeroSearch() {
  const navigate = useNavigate();

  // Search parameters
  const [purpose, setPurpose] = useState('rent'); // 'rent' | 'buy'
  const [location, setLocation] = useState('');
  const [roomType, setRoomType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBudgetLabel, setSelectedBudgetLabel] = useState('');

  // Active popover: null | 'location' | 'roomType' | 'budget'
  const [activeTab, setActiveTab] = useState(null);

  const containerRef = useRef(null);
  const locationInputRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = new URLSearchParams();
    if (location.trim()) query.append('q', location.trim());
    if (roomType) query.append('roomType', roomType);
    if (maxPrice) query.append('maxPrice', maxPrice);
    if (purpose) query.append('purpose', purpose);

    setActiveTab(null);
    navigate(`/listings?${query.toString()}`);
  };

  const currentTypeLabel = ROOM_TYPES.find(t => t.id === roomType)?.label || 'All Types';

  return (
    <div ref={containerRef} className="w-full max-w-4xl relative">
      
      {/* RENT / BUY PURPOSE TOGGLE PILL */}
      <div className="flex items-center gap-1 bg-slate-900/10 backdrop-blur-md p-1 rounded-full w-fit mb-3 border border-white/40">
        <button
          type="button"
          onClick={() => setPurpose('rent')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            purpose === 'rent'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-800 hover:text-slate-900 font-semibold'
          }`}
        >
          Rent a Room / Flat
        </button>
        <button
          type="button"
          onClick={() => setPurpose('buy')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            purpose === 'buy'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-800 hover:text-slate-900 font-semibold'
          }`}
        >
          Buy Property
        </button>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP / TABLET: LUXURY CONTINUOUS FLOATING CAPSULE BAR (hidden on mobile) */}
      {/* ========================================================================= */}
      <div className="hidden md:flex items-center bg-white rounded-full p-2 pl-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-200/90 hover:border-slate-300 transition-all duration-300 relative z-30">
        
        {/* 1. LOCATION / CITY / LOCALITY */}
        <div 
          onClick={() => {
            setActiveTab(activeTab === 'location' ? null : 'location');
            locationInputRef.current?.focus();
          }}
          className={`flex-[1.4] flex items-center gap-3.5 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-200 ${
            activeTab === 'location' ? 'bg-slate-100/90 shadow-inner' : 'hover:bg-slate-50'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
            <MapPin className="w-4 h-4 text-[#FE424D]" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Location</span>
            <input
              ref={locationInputRef}
              type="text"
              placeholder="City, locality or tech park..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setActiveTab('location')}
              className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none truncate"
            />
          </div>
          {location && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLocation('');
              }}
              className="text-slate-300 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200 shrink-0" />

        {/* 2. ROOM / PROPERTY TYPE */}
        <div 
          onClick={() => setActiveTab(activeTab === 'roomType' ? null : 'roomType')}
          className={`flex-[1.2] flex items-center gap-3 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-200 relative ${
            activeTab === 'roomType' ? 'bg-slate-100/90 shadow-inner' : 'hover:bg-slate-50'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
            <Building className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Property Type</span>
            <p className="text-sm font-semibold truncate text-slate-900">
              {currentTypeLabel}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200 shrink-0" />

        {/* 3. BUDGET / PRICE RANGE */}
        <div 
          onClick={() => setActiveTab(activeTab === 'budget' ? null : 'budget')}
          className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-200 relative ${
            activeTab === 'budget' ? 'bg-slate-100/90 shadow-inner' : 'hover:bg-slate-50'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
            <IndianRupee className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Budget</span>
            <p className="text-sm font-semibold truncate text-slate-900">
              {selectedBudgetLabel || 'Any Budget'}
            </p>
          </div>
        </div>

        {/* 4. SEARCH BUTTON */}
        <div className="shrink-0 pl-1 pr-0.5">
          <button
            type="button"
            onClick={handleSearch}
            className="h-12 px-7 rounded-full bg-gradient-to-r from-[#FE424D] to-[#FF5A5F] hover:from-[#e0333e] hover:to-[#eb4349] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#FE424D]/35 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span className="tracking-wide">Search</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MOBILE VERTICAL CARD SEARCH (Clean, Stacked & Touch Friendly)            */}
      {/* ========================================================================= */}
      <div className="md:hidden bg-white rounded-3xl p-4 shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-slate-200/90 space-y-3 relative z-30">
        
        {/* Location Input */}
        <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200/60">
          <MapPin className="w-4 h-4 text-[#FE424D] shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Where?</span>
            <input
              type="text"
              placeholder="Search city or locality..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
          </div>
          {location && (
            <button type="button" onClick={() => setLocation('')} className="p-1 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Room Type & Budget Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'roomType' ? null : 'roomType')}
            className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200/60 text-left"
          >
            <Building className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</span>
              <p className="text-xs font-semibold text-slate-900 truncate">
                {currentTypeLabel}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'budget' ? null : 'budget')}
            className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200/60 text-left"
          >
            <IndianRupee className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Budget</span>
              <p className="text-xs font-semibold text-slate-900 truncate">
                {selectedBudgetLabel || 'Any'}
              </p>
            </div>
          </button>
        </div>

        {/* Search Submit */}
        <button
          type="button"
          onClick={handleSearch}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FE424D] to-[#FF5A5F] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#FE424D]/30"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span>Find Available Rooms & Flats</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE POPOVERS                                                      */}
      {/* ========================================================================= */}

      {/* 1. POPULAR CITIES POPOVER */}
      {activeTab === 'location' && (
        <div className="absolute left-0 top-full mt-3 w-full md:w-[440px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-200/90 p-5 z-50 animate-fade-in text-left">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
            <Compass className="w-4 h-4 text-[#FE424D]" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Rental Hubs</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {POPULAR_RENTAL_CITIES.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => {
                  setLocation(city.name);
                  setActiveTab('roomType');
                }}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left group"
              >
                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{city.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#FE424D] transition-colors">{city.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{city.state}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. ROOM & PROPERTY TYPE POPOVER */}
      {activeTab === 'roomType' && (
        <div className="absolute left-1/4 top-full mt-3 w-80 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-200/90 p-4 z-50 animate-fade-in text-left space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Select Property Type</p>
          {ROOM_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                setRoomType(type.id);
                setActiveTab('budget');
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all text-left ${
                roomType === type.id ? 'bg-rose-50 text-[#FE424D] font-bold' : 'hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div>
                <p className="text-xs font-bold">{type.label}</p>
                <p className="text-[10px] text-slate-400">{type.desc}</p>
              </div>
              {roomType === type.id && <Check className="w-4 h-4 text-[#FE424D]" />}
            </button>
          ))}
        </div>
      )}

      {/* 3. BUDGET RANGE POPOVER */}
      {activeTab === 'budget' && (
        <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-200/90 p-4 z-50 animate-fade-in text-left space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Monthly Budget</p>
          {BUDGET_RANGES.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => {
                setMaxPrice(b.maxPrice);
                setSelectedBudgetLabel(b.label === 'Any Budget' ? '' : b.label);
                setActiveTab(null);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-semibold transition-all ${
                selectedBudgetLabel === b.label || (b.label === 'Any Budget' && !selectedBudgetLabel)
                  ? 'bg-rose-50 text-[#FE424D] font-bold'
                  : 'hover:bg-slate-50 text-slate-800'
              }`}
            >
              <span>{b.label}</span>
              {(selectedBudgetLabel === b.label || (b.label === 'Any Budget' && !selectedBudgetLabel)) && (
                <Check className="w-4 h-4 text-[#FE424D]" />
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}

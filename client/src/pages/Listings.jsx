import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Home as HomeIcon, 
  MapPin, 
  Sparkles, 
  X, 
  LayoutGrid, 
  Bed, 
  Key, 
  Building2, 
  Users, 
  Building, 
  Home, 
  Flame, 
  Calendar, 
  Plus, 
  Minus, 
  Map as MapIcon,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/listings/ListingCard';

const CATEGORIES = [
  { id: 'all', label: 'All Stays', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'single', label: 'Single Room', icon: <Bed className="w-4 h-4" /> },
  { id: 'ensuite', label: 'Ensuite Room', icon: <Key className="w-4 h-4" /> },
  { id: 'studio', label: 'Studio Flat', icon: <Building2 className="w-4 h-4" /> },
  { id: 'shared', label: 'Shared Flat', icon: <Users className="w-4 h-4" /> },
  { id: 'pg', label: 'PG / Hostel', icon: <Building className="w-4 h-4" /> },
  { id: 'flat', label: 'Family Home', icon: <Home className="w-4 h-4" /> },
];

const CITY_OPTIONS = [
  'All Cities',
  'Bengaluru',
  'Delhi NCR',
  'Mumbai',
  'Pune',
  'Hyderabad',
  'Jaipur',
  'Chennai'
];

const LOCALITY_SUGGESTIONS = [
  'All Localities',
  'Indiranagar',
  'Koramangala',
  'Whitefield',
  'HSR Layout',
  'Saket',
  'South Extension',
  'Sector 62, Noida',
  'Cyber City, Gurugram',
  'Andheri West',
  'Powai',
  'Bandra',
  'Viman Nagar',
  'Hinjawadi',
  'C-Scheme',
  'OMR'
];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('roomType') || 'all');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All Cities');
  const [selectedLocality, setSelectedLocality] = useState(searchParams.get('locality') || 'All Localities');
  const [selectedTypes, setSelectedTypes] = useState({
    single: false,
    ensuite: false,
    studio: false,
    shared: false,
    pg: false,
    flat: false,
  });
  const [maxBudget, setMaxBudget] = useState(Number(searchParams.get('maxPrice')) || 100000);
  const [moveInDate, setMoveInDate] = useState(searchParams.get('moveInDate') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [isTrending, setIsTrending] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    fetchListings();
  }, [searchParams, selectedCategory, sortBy, selectedCity, selectedLocality, maxBudget, isTrending]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedCity, selectedLocality, selectedTypes, maxBudget, sortBy, isTrending]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        q: searchQuery || undefined,
        sort: sortBy || undefined,
        maxPrice: maxBudget < 100000 ? maxBudget : undefined,
      };

      if (selectedCity && selectedCity !== 'All Cities') {
        params.city = selectedCity;
      }

      if (selectedLocality && selectedLocality !== 'All Localities') {
        params.locality = selectedLocality;
      }

      if (selectedCategory && selectedCategory !== 'all') {
        params.roomType = selectedCategory;
      }

      if (isTrending) {
        params.sort = 'popular';
      }

      const res = await api.getListings(params);
      let fetched = res.listings || [];

      // Filter by checked types if any is selected
      const activeCheckedTypes = Object.keys(selectedTypes).filter(k => selectedTypes[k]);
      if (activeCheckedTypes.length > 0) {
        fetched = fetched.filter(item => activeCheckedTypes.includes(item.roomType?.toLowerCase()));
      }

      setListings(fetched);
    } catch (err) {
      console.error('Failed to load listings:', err);
      setError('Could not load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setIsTrending(false);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('roomType');
    } else {
      newParams.set('roomType', catId);
    }
    setSearchParams(newParams);
  };

  const handleToggleTrending = () => {
    const nextTrending = !isTrending;
    setIsTrending(nextTrending);
    if (nextTrending) {
      setSelectedCategory('all');
    }
  };

  const handleTypeCheckbox = (typeKey) => {
    setSelectedTypes(prev => ({
      ...prev,
      [typeKey]: !prev[typeKey]
    }));
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCity('All Cities');
    setSelectedLocality('All Localities');
    setSelectedTypes({
      single: false,
      ensuite: false,
      studio: false,
      shared: false,
      pg: false,
      flat: false,
    });
    setMaxBudget(100000);
    setMoveInDate('');
    setSearchQuery('');
    setSortBy('');
    setIsTrending(false);
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('q', searchQuery);
    if (selectedCategory && selectedCategory !== 'all') newParams.set('roomType', selectedCategory);
    if (selectedCity && selectedCity !== 'All Cities') newParams.set('city', selectedCity);
    if (selectedLocality && selectedLocality !== 'All Localities') newParams.set('locality', selectedLocality);
    if (maxBudget < 100000) newParams.set('maxPrice', maxBudget);
    if (moveInDate) newParams.set('moveInDate', moveInDate);
    if (sortBy) newParams.set('sort', sortBy);
    setSearchParams(newParams);
    fetchListings();
  };

  // Pagination Slicing
  const totalPages = Math.ceil(listings.length / itemsPerPage) || 1;
  const paginatedListings = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return listings.slice(startIdx, startIdx + itemsPerPage);
  }, [listings, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafafc] pb-24 text-slate-900 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & SEARCH BAR SECTION                                        */}
      {/* ========================================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-6 text-left">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Title & Subtitle */}
          <div className="space-y-1.5 max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-tight">
              Find your perfect stay
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Rooms, flats, and homes for students, working professionals, and everyone in between.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="relative w-full lg:max-w-xl flex items-center bg-white rounded-2xl border border-slate-200/90 shadow-sm p-1.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search by city, area, property name or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1.5 text-slate-400 hover:text-slate-600 mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 transition-all shrink-0 active:scale-95"
            >
              Search
            </button>
          </form>

        </div>

        {/* ========================================================================= */}
        {/* 2. CATEGORY TABS ROW                                                      */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-3 pt-6 overflow-x-auto no-scrollbar pb-2">
          
          {/* Main Category Pills */}
          <div className="flex items-center gap-2 shrink-0">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id && !isTrending;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-xs'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Trending Button on Right */}
          <button
            onClick={handleToggleTrending}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              isTrending
                ? 'bg-[#FE424D] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-xs'
            }`}
          >
            <Flame className={`w-4 h-4 ${isTrending ? 'text-white' : 'text-[#FE424D]'}`} />
            <span>Trending</span>
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT: 2-COLUMN LAYOUT (SIDEBAR + LISTINGS GRID)                */}
      {/* ========================================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: FILTERS & MAP SIDEBAR (3.5 / 12 Cols)                   */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6 text-left">
            
            {/* Interactive Map Card Preview */}
            <div className="relative w-full h-44 rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100 group">
              {/* Map Illustration Background */}
              <div className="absolute inset-0 bg-[#e5e3df]">
                <svg className="w-full h-full opacity-60" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                  {/* Road Grid Lines */}
                  <path d="M0,40 Q150,60 400,20" stroke="#cbd5e1" strokeWidth="8" fill="none" />
                  <path d="M0,120 Q200,90 400,140" stroke="#cbd5e1" strokeWidth="10" fill="none" />
                  <path d="M80,0 Q100,100 70,200" stroke="#cbd5e1" strokeWidth="6" fill="none" />
                  <path d="M220,0 Q240,110 260,200" stroke="#cbd5e1" strokeWidth="8" fill="none" />
                  <path d="M320,0 Q300,100 340,200" stroke="#cbd5e1" strokeWidth="6" fill="none" />
                  
                  {/* Metro Water Body */}
                  <path d="M120,0 C140,80 170,120 190,200" stroke="#93c5fd" strokeWidth="14" fill="none" />
                </svg>
              </div>

              {/* City Landmarks Labels */}
              <div className="absolute inset-0 pointer-events-none p-3 text-[10px] font-bold text-slate-500">
                <span className="absolute top-6 left-6 text-slate-600">Janakpuri</span>
                <span className="absolute top-14 left-8 text-slate-600">Dwarka</span>
                <span className="absolute top-8 left-28 text-slate-900 font-extrabold text-xs">Delhi</span>
                <span className="absolute top-14 right-16 text-slate-900 font-extrabold text-xs">Noida</span>
                <span className="absolute top-4 right-8 text-slate-600">Ghaziabad</span>
                <span className="absolute top-10 right-28 text-slate-500">Indirapuram</span>
                <span className="absolute bottom-4 right-8 text-slate-600">Greater Noida</span>
              </div>

              {/* Red Location Pins */}
              <div className="absolute top-8 left-36 w-3.5 h-3.5 rounded-full bg-[#FE424D] border-2 border-white shadow-md animate-bounce" />
              <div className="absolute top-14 left-16 w-3 h-3 rounded-full bg-[#FE424D] border-2 border-white shadow-md" />
              <div className="absolute top-20 left-28 w-3 h-3 rounded-full bg-[#FE424D] border-2 border-white shadow-md" />
              <div className="absolute top-16 right-20 w-3.5 h-3.5 rounded-full bg-[#FE424D] border-2 border-white shadow-md" />
              <div className="absolute top-24 right-32 w-3 h-3 rounded-full bg-[#FE424D] border-2 border-white shadow-md" />
              <div className="absolute top-10 right-10 w-3 h-3 rounded-full bg-[#FE424D] border-2 border-white shadow-md" />
              <div className="absolute bottom-8 right-24 w-3 h-3 rounded-full bg-[#FE424D] border-2 border-white shadow-md" />

              {/* Top Floating Pill: "Search in Map" */}
              <button 
                onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-md hover:bg-white transition-all border border-slate-200/80"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FE424D]" />
                <span>Search in Map</span>
              </button>

              {/* Map Zoom Controls */}
              <div className="absolute right-3 bottom-3 z-10 flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 overflow-hidden text-slate-700">
                <button className="p-1.5 hover:bg-slate-100 transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
                <div className="h-[1px] bg-slate-200" />
                <button className="p-1.5 hover:bg-slate-100 transition-colors">
                  <Minus className="w-3 h-3" />
                </button>
              </div>

            </div>

            {/* Main Filters Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              
              {/* Header with Reset */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Filters</h2>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-slate-400 hover:text-[#FE424D] transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* 1. City Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                >
                  {CITY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* 2. Area / Locality Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Area / Locality</label>
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                >
                  {LOCALITY_SUGGESTIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* 3. Property Type Checkboxes (2 columns) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Property Type</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'single', label: 'Single Room' },
                    { key: 'ensuite', label: 'Ensuite Room' },
                    { key: 'studio', label: 'Studio Flat' },
                    { key: 'shared', label: 'Shared Flat' },
                    { key: 'pg', label: 'PG / Hostel' },
                    { key: 'flat', label: 'Family Home' },
                  ].map((type) => {
                    const isChecked = selectedTypes[type.key];
                    return (
                      <label
                        key={type.key}
                        onClick={() => handleTypeCheckbox(type.key)}
                        className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900"
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked 
                            ? 'bg-[#FE424D] border-[#FE424D] text-white' 
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-[12px] font-medium">{type.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Budget (per month) Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Budget (per month)</label>
                  <span className="text-xs font-bold text-[#FE424D]">
                    ₹{maxBudget >= 100000 ? '1,00,000+' : maxBudget.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-[#FE424D] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>₹0</span>
                  <span>₹1,00,000+</span>
                </div>
              </div>

              {/* 5. Move-in Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Move-in Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                type="button"
                onClick={handleApplyFilters}
                className="w-full py-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Apply Filters
              </button>

            </div>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: LISTINGS GRID OR MAP VIEW (8.5 / 12 Cols)              */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            
            {/* Results Top Bar: Places Found, Grid/Map Toggle & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              
              <div className="text-xs sm:text-sm font-bold text-slate-600">
                {listings.length} {listings.length === 1 ? 'place' : 'places'} found
                {listings.length > itemsPerPage && (
                  <span className="text-slate-400 font-normal text-xs ml-1.5">
                    (Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, listings.length)})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                
                {/* View Mode Switcher Pills */}
                <div className="bg-slate-200/80 p-1 rounded-xl inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'map'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Map</span>
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none text-xs font-bold text-slate-800 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 pr-8 shadow-xs focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="">Sort: Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                    <option value="views">Most Viewed</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

              </div>

            </div>

            {/* Main Listings Display */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-3.5 border border-slate-200/80 animate-pulse space-y-3">
                    <div className="aspect-[4/3] bg-slate-200 rounded-2xl" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">
                <p className="text-rose-500 font-bold mb-3">{error}</p>
                <button
                  onClick={fetchListings}
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Try Again
                </button>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-10 max-w-lg mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <HomeIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">No exact matches found</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                  We couldn't find any rooms matching your selected city or filters. Try loosening your criteria or resetting filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 rounded-2xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  Clear All Filters & Reset
                </button>
              </div>
            ) : viewMode === 'map' ? (
              /* Interactive Map View with Pin Cards */
              <div className="w-full h-[650px] rounded-3xl bg-slate-100 border border-slate-200/90 shadow-sm relative overflow-hidden">
                <iframe
                  title="Listings Map View"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=77.10,28.45,77.35,28.70&layer=mapnik"
                  className="w-full h-full border-0"
                />
                
                {/* Floating Bottom Card Preview on Map */}
                <div className="absolute bottom-4 left-4 right-4 max-w-sm z-10">
                  {listings[0] && (
                    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-white shadow-xl flex items-center gap-3 text-left">
                      <img
                        src={listings[0].image?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                        alt={listings[0].title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{listings[0].title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{listings[0].location}</p>
                        <p className="text-xs font-black text-[#FE424D]">₹{listings[0].price?.toLocaleString('en-IN')}/mo</p>
                      </div>
                      <Link
                        to={`/listings/${listings[0]._id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold shrink-0 hover:bg-[#FE424D] transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Standard 4-Column Responsive Grid with Paginated Items */
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {paginatedListings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
                </div>

                {/* ========================================================================= */}
                {/* 4. PAGINATION BAR                                                         */}
                {/* ========================================================================= */}
                <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Showing Count Information & Items per page */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                    <p>
                      Showing <span className="font-bold text-slate-800">{listings.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                      <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, listings.length)}</span> of{' '}
                      <span className="font-bold text-slate-800">{listings.length}</span> verified places
                    </p>

                    <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                      <span>Per page:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FE424D] cursor-pointer"
                      >
                        <option value={4}>4</option>
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                        <option value={16}>16</option>
                        <option value={24}>24</option>
                      </select>
                    </div>
                  </div>

                  {/* Pagination Buttons & Page Pills */}
                  <div className="flex items-center gap-1.5">
                    
                    {/* Previous Page Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        currentPage === 1
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    {/* Numbered Page Buttons */}
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        const isCurrent = currentPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-[#FE424D] text-white shadow-md shadow-rose-500/20 font-black scale-105'
                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Page Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        currentPage === totalPages
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Globe, 
  ChevronDown, 
  ArrowRight, 
  CheckCircle, 
  Heart 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const toast = useToast();
  const { addNotification } = useNotifications();
  const location = useLocation();

  // Hide footer on full-screen chat, auth routes, and form wizard pages
  const hiddenRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/verify-otp',
    '/reset-password',
    '/messages'
  ];

  const shouldHide = hiddenRoutes.some((route) => 
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  if (shouldHide) {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      toast.success('Subscribed! ✉️', `You are subscribed to RoomWati room alerts & deals at ${email}.`);
      
      addNotification({
        type: 'welcome',
        title: 'Subscribed to RoomWati Newsletter',
        message: `Weekly digests and new zero-brokerage listings will be sent to ${email}.`,
        link: '/blog',
        category: 'activity',
        badge: 'Newsletter',
      });

      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3500);
    }
  };


  return (
    <footer className="relative w-full text-slate-200 overflow-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP PANORAMIC SUNSET MOUNTAIN & WARM CABIN BACKDROP                   */}
      {/* ========================================================================= */}
      <div className="relative min-h-[380px] lg:min-h-[420px] w-full flex items-end px-4 sm:px-6 lg:px-12 pt-20 pb-12">
        
        {/* Background Panoramic Landscape with Sunset Mountains & Warm Lighted Cabin */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=2600&q=85"
            alt="Warm sunset over mountain ridges with glowing cabin"
            className="w-full h-full object-cover object-[center_35%]"
          />
          {/* Subtle gradient: preserves warm sunset sky and glowing cabin while ensuring text contrast on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a111a]/85 via-[#0a111a]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a111a] via-[#0a111a]/40 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
            
            {/* Col 1: Brand Info & Socials (3.5 Cols) */}
            <div className="lg:col-span-3 space-y-3.5 text-left">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-full bg-[#FE424D] flex items-center justify-center text-white shadow-lg shadow-[#FE424D]/40 group-hover:scale-105 transition-transform">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5 text-white"
                  >
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" fill="white" />
                  </svg>
                </div>
                <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                  Room<span className="text-[#FE424D]">Wati</span>
                </span>
              </Link>
              
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-xs drop-shadow-sm">
                Find places that feel like home, wherever you go.
              </p>

              {/* Red Accent Dash */}
              <div className="w-8 h-0.5 bg-[#FE424D] rounded-full" />

              {/* Circular Social Buttons */}
              <div className="flex items-center gap-2.5 pt-0.5">
                {/* Instagram */}
                <a href="#" className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#FE424D] text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110" aria-label="Instagram">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Twitter */}
                <a href="#" className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#FE424D] text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110" aria-label="Twitter">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a href="#" className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#FE424D] text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110" aria-label="Facebook">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a href="#" className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#FE424D] text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110" aria-label="LinkedIn">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Explore (2 Cols) */}
            <div className="lg:col-span-2 space-y-3 text-left">
              <h4 className="text-sm font-bold text-white tracking-wide drop-shadow-sm">Explore</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200 font-medium">
                <li><Link to="/listings" className="hover:text-white transition-colors">All Listings</Link></li>
                <li><Link to="/listings?roomType=single" className="hover:text-white transition-colors">Rooms</Link></li>
                <li><Link to="/listings?roomType=entire_apartment" className="hover:text-white transition-colors">Apartments</Link></li>
                <li><Link to="/listings?roomType=studio" className="hover:text-white transition-colors">Villas</Link></li>
                <li><Link to="/listings?sort=popular" className="hover:text-white transition-colors">Trending Destinations</Link></li>
              </ul>
            </div>

            {/* Col 3: For Hosts (2 Cols) */}
            <div className="lg:col-span-2 space-y-3 text-left">
              <h4 className="text-sm font-bold text-white tracking-wide drop-shadow-sm">For Hosts</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200 font-medium">
                <li><Link to="/listings/new" className="hover:text-white transition-colors">List Your Property</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Host Dashboard</Link></li>
                <li><Link to="/host-resources" className="hover:text-white transition-colors">Host Resources</Link></li>
                <li><Link to="/guidelines" className="hover:text-white transition-colors">Community Guidelines</Link></li>
              </ul>
            </div>

            {/* Col 4: Company (2 Cols) */}
            <div className="lg:col-span-2 space-y-3 text-left">
              <h4 className="text-sm font-bold text-white tracking-wide drop-shadow-sm">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200 font-medium">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>

            {/* Col 5: STAY IN THE LOOP Newsletter (3 Cols) */}
            <div className="lg:col-span-3 space-y-3 text-left lg:pl-5 lg:border-l lg:border-white/15">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
                STAY IN THE LOOP
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-md">
                Get travel inspiration <br />
                in your inbox.
              </h3>
              <p className="text-xs text-slate-200 font-normal leading-relaxed pb-1 drop-shadow-sm">
                New stays, travel tips and stories, straight to your email.
              </p>

              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#18202d]/90 text-xs sm:text-sm text-white placeholder:text-slate-400 pl-4 pr-12 py-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#FE424D] shadow-inner"
                  required
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 bottom-1.5 w-9 h-9 rounded-lg bg-[#FE424D] hover:bg-[#e0333e] text-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {subscribed ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-300 font-semibold pt-1 drop-shadow-sm">
                  ✓ You're in the loop!
                </p>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. BOTTOM SOLID BAR WITH COPYRIGHT, LINKS & HANDWRITTEN SCRIPT SIGNATURE */}
      {/* ========================================================================= */}
      <div className="bg-[#0b131e] border-t border-slate-800/80 px-4 sm:px-6 lg:px-12 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Copyright & Made with Heart */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
            <p>© 2026 RoomWati. All rights reserved.</p>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-[#FE424D] fill-[#FE424D]" />
              <span>for better stays</span>
            </div>
          </div>

          {/* Center/Right: Language, Help, Sitemap */}
          <div className="flex items-center gap-6 text-slate-400">
            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <Globe className="w-3.5 h-3.5" />
              <span>English (IN)</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <span>|</span>
            <Link to="/help" className="hover:text-white transition-colors">Help</Link>
            <span>|</span>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>

          {/* Far Right: Handwritten Script Signature */}
          <div className="text-right">
            <p className="font-script text-xl font-bold text-slate-100 leading-none tracking-wide">
              Stay Curious <br />
              <span className="text-white">Stay RoomWati</span>
            </p>
            <div className="w-14 h-0.5 bg-[#FE424D] rounded-full ml-auto mt-1" />
          </div>

        </div>
      </div>

    </footer>
  );
}

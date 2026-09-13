import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Home, Building, User, FileText, HelpCircle, Shield } from 'lucide-react';

export default function SitemapPage() {
  const sections = [
    {
      title: 'Explore Properties & Rooms',
      icon: <Home className="w-5 h-5 text-[#FE424D]" />,
      links: [
        { label: 'All Verified Listings', to: '/listings' },
        { label: 'Single Private Rooms', to: '/listings?roomType=single' },
        { label: 'Shared Rooms & Student PGs', to: '/listings?roomType=shared' },
        { label: 'Studio Apartments', to: '/listings?roomType=studio' },
        { label: 'Entire 1 & 2 BHK Apartments', to: '/listings?roomType=entire_apartment' },
        { label: 'Fully Furnished Homes', to: '/listings?furnished=furnished' },
        { label: 'Properties for Sale / Buy', to: '/listings?q=apartment' },
      ],
    },
    {
      title: 'Top Indian Metro Cities',
      icon: <Building className="w-5 h-5 text-sky-600" />,
      links: [
        { label: 'Rooms in Bangalore', to: '/listings?location=Bangalore' },
        { label: 'Rooms in Mumbai', to: '/listings?location=Mumbai' },
        { label: 'Rooms in Delhi NCR / Gurgaon', to: '/listings?location=Delhi' },
        { label: 'Rooms in Pune', to: '/listings?location=Pune' },
        { label: 'Rooms in Hyderabad', to: '/listings?location=Hyderabad' },
        { label: 'Rooms in Chennai', to: '/listings?location=Chennai' },
        { label: 'Rooms in Jaipur', to: '/listings?location=Jaipur' },
      ],
    },
    {
      title: 'For Hosts & Landlords',
      icon: <User className="w-5 h-5 text-emerald-600" />,
      links: [
        { label: 'Post Free Property Listing', to: '/listings/new' },
        { label: 'Host Dashboard & My Listings', to: '/profile' },
        { label: 'Host Resource Hub', to: '/host-resources' },
        { label: 'Rental Agreement Guidance', to: '/host-resources' },
      ],
    },
    {
      title: 'Company & Resources',
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      links: [
        { label: 'About RoomWati', to: '/about' },
        { label: 'Contact Us', to: '/contact' },
        { label: 'Careers & Openings', to: '/careers' },
        { label: 'Blog & City Guides', to: '/blog' },
      ],
    },
    {
      title: 'Legal & Safety',
      icon: <Shield className="w-5 h-5 text-amber-600" />,
      links: [
        { label: 'Community Guidelines', to: '/guidelines' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Help Center & FAQs', to: '/help' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#FE424D] text-xs font-bold uppercase tracking-wider">
            Site Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            RoomWati Sitemap
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            A comprehensive directory of all pages, rental categories, and city hubs on RoomWati.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-slate-50">{sec.icon}</div>
                <h2 className="text-base font-bold text-slate-900">{sec.title}</h2>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                {sec.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      to={link.to}
                      className="hover:text-[#FE424D] hover:translate-x-0.5 inline-block transition-transform"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

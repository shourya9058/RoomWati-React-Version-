import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    title: 'Top 7 Neighborhoods in Bangalore for Techies & Students (2026 Guide)',
    category: 'City Guides',
    date: 'Sep 02, 2026',
    readTime: '5 min read',
    author: 'RoomWati Editorial',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    excerpt: 'From Indiranagar and Koramangala to HSR Layout and Whitefield: rental costs, connectivity, and room options analyzed.',
  },
  {
    id: 2,
    title: 'How Landlords Can Rent Rooms 3x Faster with Zero Brokerage',
    category: 'Landlord Tips',
    date: 'Aug 28, 2026',
    readTime: '4 min read',
    author: 'Ananya Deshmukh',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Simple listing tweaks, daytime photography tips, and tenant communication strategies that guarantee fast occupancy.',
  },
  {
    id: 3,
    title: 'The Ultimate Tenant Checklist: 10 Things to Check Before Signing a Lease',
    category: 'Tenant Advice',
    date: 'Aug 19, 2026',
    readTime: '6 min read',
    author: 'Karan Mehra',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Security deposit clauses, electricity meter readings, water pressure, and landlord verification tricks you should know.',
  },
  {
    id: 4,
    title: 'PG vs Independent 1BHK Flat: Which Rental is Right for You?',
    category: 'Housing Comparisons',
    date: 'Aug 12, 2026',
    readTime: '4 min read',
    author: 'RoomWati Editorial',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Comparing monthly costs, food expenses, freedom, maintenance headaches, and security deposits across Indian metros.',
  },
];

export default function Blog() {
  const [selectedCat, setSelectedCat] = useState('All');
  const categories = ['All', 'City Guides', 'Landlord Tips', 'Tenant Advice', 'Housing Comparisons'];

  const filtered = selectedCat === 'All' 
    ? ARTICLES 
    : ARTICLES.filter(a => a.category === selectedCat);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#FE424D] text-xs font-bold uppercase tracking-wider">
            RoomWati Insights
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Stories, City Guides & Rental Tips
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Expert advice on room renting, landlord tips, tenant rights, and discovering your next neighborhood.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCat === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-[#FE424D] transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FE424D] group-hover:underline">
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}

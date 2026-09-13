import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Search, Mail, MessageCircle, ShieldCheck, PlusCircle } from 'lucide-react';

const FAQS = [
  {
    category: 'For Tenants',
    q: 'How does RoomWati ensure zero brokerage?',
    a: 'RoomWati connects you directly to verified room owners, landlords, and flatmates. We do not employ brokers or charge any brokerage fees on listings.',
  },
  {
    category: 'For Tenants',
    q: 'How do I schedule a room visit?',
    a: 'Simply click on any listing card to open its detail page, where you can view the verified host contact number or click direct contact to coordinate visit timings.',
  },
  {
    category: 'For Landlords',
    q: 'Is posting a property listing really free?',
    a: 'Yes, posting your room, PG, studio flat, or entire apartment on RoomWati is 100% free with no hidden commissions or lead unlock fees.',
  },
  {
    category: 'For Landlords',
    q: 'How long does it take for my listing to go live?',
    a: 'Listings are published instantly! Our automated safety checks verify image quality and description within minutes.',
  },
  {
    category: 'Safety & Security',
    q: 'What should I do if I suspect a fake listing?',
    a: 'You can report any suspicious listing directly from the listing page or contact our 24/7 safety team at support@roomwati.com.',
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#FE424D] text-xs font-bold uppercase tracking-wider">
            Help Center & FAQ
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Find instant answers to frequently asked questions about room renting, tenant safety, and host tools.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search help articles, topics, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm shadow-sm focus:outline-none focus:border-[#FE424D] focus:ring-1 focus:ring-[#FE424D]"
            />
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-100 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FE424D]">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {faq.q}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FE424D]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-8">
                No matching answers found for "{searchQuery}". Try searching for another topic or contact our support team.
              </p>
            )}
          </div>
        </div>

        {/* Still need help CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold">Still have questions?</h3>
            <p className="text-xs sm:text-sm text-slate-400">Our customer care team is available 24/7 to assist you.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shrink-0 transition-colors"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}

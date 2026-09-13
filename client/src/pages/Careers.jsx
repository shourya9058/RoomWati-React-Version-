import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  Zap, 
  DollarSign, 
  ShieldCheck, 
  BookOpen, 
  Coffee, 
  Laptop, 
  X, 
  UploadCloud, 
  Send,
  ExternalLink
} from 'lucide-react';
import AnimatedCounter from '../components/common/AnimatedCounter';

const ROLES = [
  {
    id: 1,
    title: 'Senior Full Stack Engineer (MERN)',
    dept: 'Engineering',
    location: 'Bengaluru, India (Hybrid)',
    type: 'Full-time',
    experience: '3 - 6 Years',
    tags: ['React 19', 'Node.js', 'MongoDB', 'Tailwind', 'Redis'],
    desc: 'Scale our core room-matching engine, real-time landlord-tenant chat, and geo-spatial search infrastructure handling millions of monthly searches.',
  },
  {
    id: 2,
    title: 'Backend Systems & API Architect',
    dept: 'Engineering',
    location: 'Bengaluru / Remote',
    type: 'Full-time',
    experience: '4 - 8 Years',
    tags: ['Node.js', 'Express', 'System Design', 'PostgreSQL', 'AWS'],
    desc: 'Architect high-throughput listing ingestion pipelines, fraud detection services, and lightning-fast search indexing APIs across Indian metros.',
  },
  {
    id: 3,
    title: 'Frontend React & Mobile Engineer',
    dept: 'Engineering',
    location: 'Delhi NCR / Remote',
    type: 'Full-time',
    experience: '2 - 5 Years',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'PWA', 'Framer Motion'],
    desc: 'Craft silky-smooth, animated web and mobile experiences with sub-second page loads and dynamic search capsules for room hunters.',
  },
  {
    id: 4,
    title: 'Lead Product Designer (UI/UX)',
    dept: 'Product & Design',
    location: 'Bengaluru, India',
    type: 'Full-time',
    experience: '4 - 7 Years',
    tags: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
    desc: 'Define the future visual identity of RoomWati. Turn complex tenant verification, listing flows, and rental discovery into delightful user journeys.',
  },
  {
    id: 5,
    title: 'Product Manager — Growth & Rentals',
    dept: 'Product & Design',
    location: 'Mumbai / Hybrid',
    type: 'Full-time',
    experience: '3 - 6 Years',
    tags: ['Product Strategy', 'A/B Testing', 'Growth Loops', 'Analytics'],
    desc: 'Drive landlord onboarding velocity, improve tenant match conversion rates, and build seamless zero-brokerage rental agreements.',
  },
  {
    id: 6,
    title: 'City Expansion & Community Lead',
    dept: 'Growth & Community',
    location: 'Mumbai / Pune',
    type: 'Full-time',
    experience: '2 - 5 Years',
    tags: ['Campus Partnerships', 'Landlord Acquisition', 'Community'],
    desc: 'Spearhead our on-ground campus student housing outreach, verified landlord onboarding, and local community rental chapters in western India.',
  },
  {
    id: 7,
    title: 'Performance Marketing & SEO Manager',
    dept: 'Growth & Community',
    location: 'Delhi NCR / Remote',
    type: 'Full-time',
    experience: '3 - 6 Years',
    tags: ['SEO', 'SEM', 'Content Strategy', 'Organic Growth'],
    desc: 'Scale high-intent organic traffic for student housing, shared flats, and PGs across top 15 Indian metropolitan search keywords.',
  },
  {
    id: 8,
    title: 'Trust & Safety Operations Associate',
    dept: 'Trust & Safety',
    location: 'Bengaluru, India',
    type: 'Full-time',
    experience: '1 - 3 Years',
    tags: ['Listing Verification', 'Fraud Prevention', 'Quality Audit'],
    desc: 'Review property listings for authentic photography, verify landlord identity documents, and ensure a safe, scam-free rental ecosystem.',
  },
];

const PERKS = [
  {
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    bg: 'bg-amber-50',
    title: 'High Impact & Autonomy',
    desc: 'Own major features end-to-end. Every line of code directly saves thousands of students and families from unfair brokerage fees.',
  },
  {
    icon: <Laptop className="w-5 h-5 text-sky-500" />,
    bg: 'bg-sky-50',
    title: 'Flexible & Hybrid Culture',
    desc: 'Work from our Bengaluru, Mumbai, or Delhi NCR hubs, or work remotely with home office setup allowances.',
  },
  {
    icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
    bg: 'bg-emerald-50',
    title: 'Top Compensation & ESOPs',
    desc: 'Competitive salaries benchmarked to top 10% tech companies, paired with generous stock option grants for long-term ownership.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-purple-500" />,
    bg: 'bg-purple-50',
    title: 'Comprehensive Health & Care',
    desc: '100% premium-covered medical insurance for you and your family, wellness leave, and mental health counseling support.',
  },
  {
    icon: <BookOpen className="w-5 h-5 text-rose-500" />,
    bg: 'bg-rose-50',
    title: '₹50,000 Learning Budget',
    desc: 'Annual stipend for books, conferences, specialized certifications, and online courses to accelerate your professional mastery.',
  },
  {
    icon: <Coffee className="w-5 h-5 text-indigo-500" />,
    bg: 'bg-indigo-50',
    title: 'Quarterly Offsites & Retreats',
    desc: 'All-hands team offsites in Goa, Himachal, and Rajasthan, hackathon weekends, and collaborative creative sprints.',
  },
];

import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

export default function Careers() {
  const toast = useToast();
  const { addNotification } = useNotifications();

  const [selectedDept, setSelectedDept] = useState('All');
  const [applyingRole, setApplyingRole] = useState(null);
  const [appForm, setAppForm] = useState({ name: '', email: '', phone: '', linkedin: '', resume: '', note: '' });
  const [submitted, setSubmitted] = useState(false);

  const departments = ['All', 'Engineering', 'Product & Design', 'Growth & Community', 'Trust & Safety'];

  const filteredRoles = selectedDept === 'All'
    ? ROLES
    : ROLES.filter((r) => r.dept === selectedDept);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    toast.success(
      'Application Submitted! 🚀',
      `Thank you ${appForm.name || 'there'}! Your application for "${applyingRole?.title || 'Open Role'}" has been received by our hiring team.`
    );

    addNotification({
      type: 'welcome',
      title: `Application Received: ${applyingRole?.title}`,
      message: `Your resume has been forwarded to the ${applyingRole?.dept || 'Engineering'} hiring manager. We will follow up via ${appForm.email || 'email'}.`,
      link: '/careers',
      category: 'activity',
      badge: 'Job Application',
    });

    setTimeout(() => {
      setSubmitted(false);
      setApplyingRole(null);
      setAppForm({ name: '', email: '', phone: '', linkedin: '', resume: '', note: '' });
    }, 3500);
  };


  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: "Shape how India finds a home."                         */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-white border-b border-slate-100 py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        
        {/* Modern Workspace Background Photo on Right */}
        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-1/2 z-0 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85"
            alt="RoomWati engineering and design team collaboration"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        </div>

        {/* Floating Framed Poster Badge on Right */}
        <div className="absolute top-12 right-12 lg:right-24 z-10 hidden lg:block bg-white/85 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-md text-center max-w-[140px]">
          <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Culture</p>
          <p className="font-serif italic font-bold text-xs text-slate-900 leading-snug pt-1">
            Create <br />
            Culture <br />
            Belong
          </p>
        </div>

        {/* Live Hiring Badge */}
        <div className="absolute bottom-8 right-12 z-10 hidden lg:flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold">8 Open Roles Across India</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full text-left">
          <div className="max-w-2xl space-y-6">
            
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE424D]">
              CAREERS AT ROOMWATI
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Shape how India <br />
              <span className="text-[#FE424D]">finds a home.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              We are on a relentless mission to eliminate rental middlemen, eradicate fake listings, and build India's most loved zero-brokerage housing community.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#open-roles"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Explore Open Roles</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#perks"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
              >
                <span>Why Join Us</span>
              </a>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. STATS / CULTURE COUNTER BAR                                            */}
      {/* ========================================================================= */}
      <section className="w-full bg-white border-b border-slate-100 py-10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
            
            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                <AnimatedCounter target={100000} suffix="+" duration={2200} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Renters Impacted</p>
            </div>

            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                <AnimatedCounter target={15} suffix="+" duration={1800} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Metro Cities Active</p>
            </div>

            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#FE424D] tracking-tight">
                <AnimatedCounter target={4.9} decimals={1} suffix=" ★" duration={1500} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Glassdoor Team Rating</p>
            </div>

            <div className="text-center px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                <AnimatedCounter target={100} suffix="%" duration={1600} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Zero-Brokerage Mission</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CULTURE & PERKS (3x2 Grid)                                             */}
      {/* ========================================================================= */}
      <section id="perks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 text-left">
        <div className="space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE424D]">
              OUR CULTURE & VALUES
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Built for people who care about doing work that matters.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              We foster a fast-paced, high-trust environment where you are given the autonomy and resources to do the best work of your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map((perk, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-3.5"
              >
                <div className={`w-11 h-11 rounded-2xl ${perk.bg} flex items-center justify-center`}>
                  {perk.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">{perk.title}</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. OPEN POSITIONS WITH INTERACTIVE FILTERING & APPLY MODAL                 */}
      {/* ========================================================================= */}
      <section id="open-roles" className="w-full bg-slate-50/60 border-y border-slate-100 py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-10 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE424D]">
                JOIN THE TEAM
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Open Positions ({filteredRoles.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Find your next role across engineering, product design, community, and operations.
              </p>
            </div>

            {/* Department Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedDept === dept
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Roles Grid */}
          <div className="space-y-4">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:border-[#FE424D]/40 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-red-50 text-[#FE424D] text-[11px] font-bold">
                      {role.dept}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {role.location}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-emerald-600">{role.type}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{role.experience}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{role.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{role.desc}</p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {role.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-row lg:flex-col items-center gap-3 shrink-0">
                  <button
                    onClick={() => setApplyingRole(role)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-[#FE424D] text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
                  >
                    <span>Apply for Role</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TEAM SPOTLIGHT / LIFE AT ROOMWATI                                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 text-left">
        <div className="bg-[#0f172a] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                Life at RoomWati
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug font-serif italic">
                "Building RoomWati is the most fulfilling engineering challenge of my career. Every single feature we ship saves thousands of students and families from paying unfair brokerage fees."
              </h3>
              <div className="pt-2">
                <p className="font-bold text-white text-sm">Ananya Deshmukh</p>
                <p className="text-xs text-slate-400">Lead Product Engineer • Bengaluru HQ</p>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&h=500&q=80"
                alt="RoomWati engineer portrait"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-white/10 shadow-2xl"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. "DON'T SEE YOUR ROLE?" BANNER                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900">Don't see a role that fits your exact background?</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              We are always excited to meet exceptional builders, researchers, and creators. Send your resume and portfolio directly to our founding team.
            </p>
          </div>

          <a
            href="mailto:careers@roomwati.com?subject=Open Application: General Talent Pool"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-[#FE424D] text-white font-bold text-xs sm:text-sm shrink-0 transition-colors"
          >
            <span>Send Open Application</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. INTERACTIVE APPLICATION MODAL                                         */}
      {/* ========================================================================= */}
      {applyingRole && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setApplyingRole(null)}
        >
          <div 
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setApplyingRole(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pr-8">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FE424D]">
                Applying For
              </span>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">{applyingRole.title}</h3>
              <p className="text-xs text-slate-500">{applyingRole.dept} • {applyingRole.location}</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950">Application Received!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you for applying. Our talent team will review your background and reach out within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={appForm.name}
                    onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FE424D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={appForm.email}
                      onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                      placeholder="priya@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FE424D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={appForm.phone}
                      onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FE424D]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">LinkedIn / GitHub Profile URL *</label>
                  <input
                    type="url"
                    required
                    value={appForm.linkedin}
                    onChange={(e) => setAppForm({ ...appForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FE424D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Portfolio / Resume Link (Google Drive / Notion) *</label>
                  <input
                    type="url"
                    required
                    value={appForm.resume}
                    onChange={(e) => setAppForm({ ...appForm, resume: e.target.value })}
                    placeholder="https://drive.google.com/your-resume"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FE424D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Why are you excited about RoomWati? (Optional)</label>
                  <textarea
                    rows={2}
                    value={appForm.note}
                    onChange={(e) => setAppForm({ ...appForm, note: e.target.value })}
                    placeholder="Tell us what motivates you..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FE424D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

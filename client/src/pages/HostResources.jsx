import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Camera, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  PlusCircle, 
  Download, 
  HelpCircle, 
  ChevronDown, 
  Calculator, 
  Zap, 
  Copy, 
  X, 
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Printer,
  Check,
  Building2,
  Lock,
  PhoneCall,
  Search
} from 'lucide-react';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

const HOST_STORIES = [
  {
    name: 'Rajesh & Sunita Sharma',
    location: 'Indiranagar, Bengaluru',
    property: '2 BHK Independent Floor',
    rent: '₹34,000/mo',
    turnaround: 'Rented in 3 days',
    saved: '₹34,000 Brokerage Saved',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    quote: 'We avoided paying 1 full month of rent to brokers. RoomWati connected us directly with verified software engineers from Embassy Golf Links.',
  },
  {
    name: 'Vikram Mehta',
    location: 'Powai, Mumbai',
    property: '1 BHK Studio Flat',
    rent: '₹28,500/mo',
    turnaround: 'Rented in 48 hours',
    saved: '₹28,500 Brokerage Saved',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    quote: 'The tenant screening badge gave me immense peace of mind. Zero spam calls, only genuine working professionals.',
  },
  {
    name: 'Ananya Deshmukh',
    location: 'Cyber City, Gurugram',
    property: 'Private Room in 3 BHK',
    rent: '₹14,000/mo',
    turnaround: 'Rented in 2 days',
    saved: '₹14,000 Brokerage Saved',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    quote: 'Listing a single room inside my occupied flat was so simple. Found an amazing flatmate within 48 hours without any middleman hassle.',
  },
];

const FAQS_CATEGORIZED = [
  {
    category: 'Listing & Pricing',
    items: [
      {
        q: 'How is listing on RoomWati 100% free with zero brokerage?',
        a: 'Unlike traditional property portals or local agents who charge 15 to 30 days of rent as brokerage, RoomWati connects property owners and flatmates directly with verified tenants at ₹0 cost.',
      },
      {
        q: 'Can I list a single private room inside an occupied flat or PG?',
        a: 'Yes! RoomWati specializes in single private rooms, shared rooms for flatmates, student PGs, studio apartments, and full family flats.',
      },
      {
        q: 'How do I price my room competitively for fast occupancy?',
        a: 'Use our Rental Yield Calculator above. As a rule of thumb, single rooms near metro stations and IT hubs (within 2 km) fetch 15–20% higher rent and rent out in under 3 days.',
      },
    ],
  },
  {
    category: 'Tenant Screening & Safety',
    items: [
      {
        q: 'How does RoomWati verify tenants before they contact me?',
        a: 'Tenants verify their phone number, work/college email ID, and can submit Aadhaar verification badges to ensure genuine inquiries from working professionals and students.',
      },
      {
        q: 'Is police verification mandatory for tenants in India?',
        a: 'Yes, most municipal police jurisdictions (Delhi NCR, Mumbai, Bengaluru, Pune) require landlords to submit tenant verification forms at the local police station or via their online police portal.',
      },
      {
        q: 'Can I set specific house rules for my property?',
        a: 'Absolutely. You can specify preferences like non-smoking, pet-friendly, vegetarian-preferred, gate timings, or quiet hours directly in your listing description.',
      },
    ],
  },
  {
    category: 'Agreements & Deposits',
    items: [
      {
        q: 'Why is an 11-month lease agreement standard in India?',
        a: 'Under the Registration Act 1908, leases under 11 months do not require mandatory sub-registrar registration, saving heavy stamp duty while remaining legally binding when executed on non-judicial stamp paper.',
      },
      {
        q: 'What is the standard security deposit in Indian metros?',
        a: 'Standard practices: Bengaluru typically charges 2–4 months of rent, Mumbai charges 2–3 months, and Delhi NCR / Pune / Hyderabad typically charge 1–2 months.',
      },
    ],
  },
];

export default function HostResources() {
  const toast = useToast();
  const { addNotification } = useNotifications();

  // Rental Estimator State
  const [city, setCity] = useState('bengaluru');
  const [spaceType, setSpaceType] = useState('single');
  const [furnishing, setFurnishing] = useState('furnished');

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState({
    photos: true,
    pricing: true,
    furnish: false,
    rules: true,
    aadhaar: false,
    workProof: false,
    agreement: false,
    deposit: false,
  });

  // FAQ Category Filter
  const [faqCategory, setFaqCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState('0-0');

  // Agreement Generator Modal State
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementData, setAgreementData] = useState({
    landlordName: 'Rajesh Kumar',
    tenantName: 'Rahul Verma',
    city: 'Bengaluru',
    address: 'Flat 402, Sunshine Heights, Indiranagar',
    monthlyRent: '18000',
    securityDeposit: '36000',
    commenceDate: new Date().toISOString().split('T')[0],
  });
  const [copied, setCopied] = useState(false);

  // Dynamic Rent Calculation
  const baseRentRates = {
    bengaluru: { single: 13500, shared: 8500, studio: 21000, flat1: 24000, flat2: 36000 },
    mumbai: { single: 18000, shared: 11000, studio: 28000, flat1: 34000, flat2: 52000 },
    delhi: { single: 12500, shared: 7500, studio: 19500, flat1: 22000, flat2: 33000 },
    pune: { single: 9500, shared: 6000, studio: 15000, flat1: 17500, flat2: 26000 },
    hyderabad: { single: 10000, shared: 6500, studio: 16000, flat1: 18500, flat2: 28000 },
  };

  const furnishingMultipliers = {
    furnished: 1.15,
    semifurnished: 1.0,
    unfurnished: 0.88,
  };

  const basePrice = (baseRentRates[city] || baseRentRates.bengaluru)[spaceType] || 12000;
  const estimatedRent = Math.round(basePrice * (furnishingMultipliers[furnishing] || 1));
  const annualIncome = estimatedRent * 12;
  const brokerageSaved = estimatedRent; // 1 month rent saved

  const toggleCheck = (id) => {
    setCheckedItems(prev => {
      const next = { ...prev, [id]: !prev[id] };
      const count = Object.values(next).filter(Boolean).length;
      if (count === Object.keys(next).length && !prev[id]) {
        toast.success('Landlord Ready! 🏆', 'All 8 checklist items completed. Your property is 100% prepared for tenant move-in.');
        addNotification({
          type: 'agreement',
          title: 'Landlord Checklist 100% Complete',
          message: 'All verification documents, pricing, and tenancy rules are ready for move-in.',
          link: '/host-resources',
          category: 'activity',
          badge: 'Ready to Host',
        });
      }
      return next;
    });
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / Object.keys(checkedItems).length) * 100);

  const fullAgreementText = `RENTAL LEASE AGREEMENT (11 MONTHS)
Executed on: ${agreementData.commenceDate} at ${agreementData.city}, India

BETWEEN:
LESSOR / LANDLORD: ${agreementData.landlordName || '____________________'}
Residential Address: ${agreementData.address || '____________________'}

AND
LESSEE / TENANT: ${agreementData.tenantName || '____________________'}

PROPERTY DETAILS:
Premises situated at: ${agreementData.address || '____________________'}, ${agreementData.city}

TERMS AND CONDITIONS:
1. TENANCY TERM: The tenancy is for a fixed term of 11 consecutive months commencing from ${agreementData.commenceDate}.
2. RENT: The Lessee agrees to pay a monthly rent of Rs. ${Number(agreementData.monthlyRent || estimatedRent).toLocaleString('en-IN')}/- on or before the 5th of every English calendar month.
3. SECURITY DEPOSIT: The Lessee has deposited an interest-free refundable Security Deposit of Rs. ${Number(agreementData.securityDeposit || estimatedRent * 2).toLocaleString('en-IN')}/- with the Lessor.
4. ZERO BROKERAGE: Both parties confirm that this transaction was facilitated directly via RoomWati with zero brokerage commission.
5. UTILITIES: Electricity, water, and broadband charges shall be borne by the Lessee as per actual meter readings.
6. TERMINATION & NOTICE: Either party may terminate this agreement by providing a 30-day prior written notice.

IN WITNESS WHEREOF the parties have set their hands:

____________________                       ____________________
LESSOR (LANDLORD)                          LESSEE (TENANT)`;

  const handleCopyAgreement = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullAgreementText);
    }
    setCopied(true);
    toast.success('Agreement Copied! 📄', '11-Month rental lease agreement copied to clipboard.');
    
    addNotification({
      type: 'agreement',
      title: `Agreement Drafted: ${agreementData.tenantName || 'Tenant'}`,
      message: `11-Month agreement for ${agreementData.address || 'Premises'} (₹${Number(agreementData.monthlyRent || 18000).toLocaleString('en-IN')}/mo) ready for execution.`,
      link: '/host-resources',
      category: 'activity',
      badge: 'Agreement',
    });

    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintAgreement = () => {
    toast.info('Preparing Document 🖨️', 'Opening agreement in print layout.');
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`<pre style="font-family: monospace; padding: 30px; font-size: 13px; line-height: 1.6;">${fullAgreementText}</pre>`);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredFaqs = FAQS_CATEGORIZED.filter(cat => 
    faqCategory === 'All' ? true : cat.category === faqCategory
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Elevated Architectural Visuals + Direct Value            */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-white border-b border-slate-100 py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        
        {/* Warm Architectural Bedroom & Sunlit Living Space Photo on Right */}
        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-1/2 z-0 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85"
            alt="Warm modern apartment living space"
            className="w-full h-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        </div>

        {/* Framed Wall Poster Overlay on Right */}
        <div className="absolute top-12 right-12 lg:right-24 z-10 hidden lg:block bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-xl text-center max-w-[150px]">
          <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Landlords Hub</p>
          <p className="font-serif italic font-bold text-xs text-slate-900 leading-snug pt-1">
            Host With <br />
            Confidence
          </p>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[10px] text-emerald-600 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified Portal</span>
          </div>
        </div>

        {/* Floating 100% Free Badge */}
        <div className="absolute bottom-8 right-12 z-10 hidden lg:flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold">100% Free Forever • ₹0 Brokerage</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full text-left">
          <div className="max-w-2xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#FE424D] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Host Resource & Toolkit Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Rent out faster. <br />
              <span className="text-[#FE424D]">Zero brokerage forever.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              Equipping Indian landlords and flatmates with pricing calculators, customizable 11-month lease agreements, tenant screening checklists, and high-occupancy playbooks.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/listings/new"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Free Property Ad</span>
              </Link>

              <a
                href="#estimator"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
              >
                <Calculator className="w-4 h-4 text-slate-600" />
                <span>Calculate Rental Yield</span>
              </a>

              <button
                onClick={() => setShowAgreementModal(true)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs sm:text-sm transition-all"
              >
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Agreement Generator</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. STATS BAR: 4-Column Metric Counter with Dividers                       */}
      {/* ========================================================================= */}
      <section className="w-full bg-white border-b border-slate-100 py-10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
            
            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#FE424D] tracking-tight">
                <AnimatedCounter target={0} prefix="₹" duration={1000} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Commission Charged</p>
            </div>

            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                <AnimatedCounter target={3.2} decimals={1} suffix=" Days" duration={1800} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Avg. Time to Rent Out</p>
            </div>

            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                <AnimatedCounter target={98.4} decimals={1} suffix="%" duration={2000} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Host Satisfaction</p>
            </div>

            <div className="text-center px-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                <AnimatedCounter target={25000} suffix="+" duration={2200} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Active Property Hosts</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE RENTAL ESTIMATOR & BROKERAGE SAVINGS CALCULATOR            */}
      {/* ========================================================================= */}
      <section id="estimator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 text-left">
        <div className="bg-[#0f172a] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FE424D]/20 text-[#FE424D] text-xs font-bold uppercase tracking-wider">
              Interactive Tool
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Estimate Your Monthly Rent & Brokerage Savings
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Benchmark your room or apartment against live market demand across Indian metro hubs and discover your direct savings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            
            {/* Left 7 Cols: Selectors */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* City Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Metro City</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'bengaluru', label: 'Bengaluru' },
                    { id: 'mumbai', label: 'Mumbai' },
                    { id: 'delhi', label: 'Delhi NCR' },
                    { id: 'pune', label: 'Pune' },
                    { id: 'hyderabad', label: 'Hyderabad' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCity(c.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        city === c.id
                          ? 'bg-[#FE424D] text-white shadow-md'
                          : 'bg-white/10 hover:bg-white/15 text-slate-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Space Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Space Configuration</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'single', label: 'Single Private Room' },
                    { id: 'shared', label: 'Shared Room / PG' },
                    { id: 'studio', label: 'Studio Apartment' },
                    { id: 'flat1', label: '1 BHK Flat' },
                    { id: 'flat2', label: '2 BHK Apartment' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSpaceType(s.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        spaceType === s.id
                          ? 'bg-white text-slate-900 shadow-md font-black'
                          : 'bg-white/10 hover:bg-white/15 text-slate-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Furnishing Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Furnishing Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'furnished', label: 'Fully Furnished' },
                    { id: 'semifurnished', label: 'Semi-Furnished' },
                    { id: 'unfurnished', label: 'Unfurnished' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFurnishing(f.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        furnishing === f.id
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-white/10 hover:bg-white/15 text-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 5 Cols: Calculated Outcome Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 space-y-6 text-center">
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Monthly Rent</p>
                <p className="text-4xl sm:text-5xl font-black text-white">
                  ₹{estimatedRent.toLocaleString('en-IN')}{' '}
                  <span className="text-xs sm:text-sm text-slate-400 font-medium">/ month</span>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700 grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">Annual Yield</p>
                  <p className="text-lg font-bold text-white">₹{(annualIncome / 100000).toFixed(2)} Lakh/yr</p>
                </div>
                <div>
                  <p className="text-[11px] text-emerald-400 font-semibold">Brokerage Saved</p>
                  <p className="text-lg font-bold text-emerald-400">₹{brokerageSaved.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/listings/new"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>List at This Price Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-slate-400">
                  ⚡ Takes less than 2 minutes to post
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. 4 CORE HOST TOOLKITS & PLAYBOOKS                                      */}
      {/* ========================================================================= */}
      <section className="w-full bg-slate-50/60 border-y border-slate-100 py-20 px-4 sm:px-6 lg:px-12 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE424D]">
              HOST GUIDES & PLAYBOOKS
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Master the Art of Smart Renting
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Battle-tested advice from top property hosts in Bengaluru, Mumbai, and Delhi NCR to minimize vacancies and safeguard your space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Guide 1 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#FE424D] flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Optimal Pricing Guide</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learn how to benchmark nearby tech parks, metro walking distances, and seasonal IT joining cycles to maintain 100% occupancy.
              </p>
            </div>

            {/* Guide 2 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Smartphone Photography</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take bright, natural wide-angle shots without professional gear. Ads with 5+ daytime photos receive 3x more direct chat inquiries.
              </p>
            </div>

            {/* Guide 3 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Tenant Screening Protocol</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A simple 3-step checklist to verify work email IDs, LinkedIn profiles, and previous landlord references with complete confidence.
              </p>
            </div>

            {/* Guide 4: Agreement */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">11-Month Lease Generator</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate, preview, and copy standard legal lease terms with clauses for deposits, maintenance, and 30-day notice.
                </p>
              </div>

              <button
                onClick={() => setShowAgreementModal(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors"
              >
                <span>Customize & Generate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE HOST ONBOARDING CHECKLIST                                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE424D]">
                LANDLORD READINESS CHECKLIST
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Are You Ready to Host?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Check off key essentials to ensure your space gets verified quickly, attracts top-tier tenants, and maintains zero vacancy.
              </p>
            </div>

            {/* Progress Meter */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Listing Readiness Score</span>
                <span className="text-sm font-black text-[#FE424D]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#FE424D] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {completedCount} of 8 steps completed. {progressPercent === 100 ? '🎉 Ready for high-demand listing!' : 'Complete remaining checks for best results.'}
              </p>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'photos', label: 'Take 4-5 bright daytime photos' },
              { id: 'pricing', label: 'Calculate fair market rent' },
              { id: 'furnish', label: 'List all furniture & appliances' },
              { id: 'rules', label: 'Define clear house rules & timings' },
              { id: 'aadhaar', label: 'Collect tenant Aadhaar / ID proof' },
              { id: 'workProof', label: 'Verify corporate email or college ID' },
              { id: 'agreement', label: 'Sign 11-month lease agreement' },
              { id: 'deposit', label: 'Collect security deposit via UPI/NEFT' },
            ].map((item) => {
              const isChecked = checkedItems[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isChecked 
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-900' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked ? 'bg-emerald-500 text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-semibold ${isChecked ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. REAL HOST SUCCESS STORIES                                              */}
      {/* ========================================================================= */}
      <section className="w-full bg-slate-50/60 border-y border-slate-100 py-20 px-4 sm:px-6 lg:px-12 text-left">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE424D]">
              COMMUNITY TESTIMONIALS
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Stories from Indian Landlords
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              See how everyday homeowners and flatmates save thousands in brokerage while securing trustworthy tenants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOST_STORIES.map((story, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{story.name}</h4>
                      <p className="text-[11px] text-slate-500">{story.location}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {story.saved}
                  </span>
                  <span className="text-slate-400 font-medium">{story.turnaround}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. 4-STEP LANDLORD ROADMAP                                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 text-left">
        <div className="space-y-10">
          
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE424D]">
              HOW IT WORKS
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Your 4-Step Landlord Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              From snapping photos to handing over keys with complete peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</div>
              <h3 className="text-base font-bold text-slate-900">Prep & Photograph</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean your room, turn on warm lighting, and snap 4-5 wide daytime photos of bedroom, bathroom, and amenities.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">2</div>
              <h3 className="text-base font-bold text-slate-900">Post Free in 2 Mins</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add monthly rent, security deposit, and house rules. Your verified ad goes live instantly across India.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">3</div>
              <h3 className="text-base font-bold text-slate-900">Chat with Tenants</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Screen interested tenants directly through WhatsApp or in-app chat. Schedule in-person or video visits.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[#FE424D] text-white flex items-center justify-center text-xs font-bold">4</div>
              <h3 className="text-base font-bold text-slate-900">Sign & Collect Rent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Execute the standard 11-month agreement, collect the deposit, and hand over keys without losing a single rupee to brokers!
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CATEGORIZED HOST FAQ ACCORDION                                         */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900">Landlord FAQ Hub</h3>
            <p className="text-xs text-slate-500">Everything you need to know about pricing, legalities, and zero brokerage hosting.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {['All', 'Listing & Pricing', 'Tenant Screening & Safety', 'Agreements & Deposits'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFaqCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  faqCategory === cat 
                    ? 'bg-[#FE424D] text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            {filteredFaqs.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-3">
                {cat.items.map((faq, itemIdx) => {
                  const faqId = `${catIdx}-${itemIdx}`;
                  const isOpen = openFaq === faqId;
                  return (
                    <div key={itemIdx} className="rounded-2xl border border-slate-100 overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : faqId)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#FE424D]' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. BOTTOM CTA: Ready to List Banner                                       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to find verified tenants?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Join 25,000+ landlords across India renting rooms, studios, and flats 100% free with zero brokerage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/listings/new"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Free Property Ad</span>
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Host WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. INTERACTIVE MODAL: 11-MONTH RENTAL LEASE GENERATOR                    */}
      {/* ========================================================================= */}
      {showAgreementModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowAgreementModal(false)}
        >
          <div 
            className="relative w-full max-w-3xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAgreementModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pr-8">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FE424D]">Legal Agreement Tool</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">Customizable 11-Month Rental Agreement</h3>
              <p className="text-xs text-slate-500">Fill in details to preview, copy, or print a standard Indian lease agreement format.</p>
            </div>

            {/* Quick Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Landlord Name</label>
                <input
                  type="text"
                  value={agreementData.landlordName}
                  onChange={(e) => setAgreementData({ ...agreementData, landlordName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tenant Name</label>
                <input
                  type="text"
                  value={agreementData.tenantName}
                  onChange={(e) => setAgreementData({ ...agreementData, tenantName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={agreementData.monthlyRent}
                  onChange={(e) => setAgreementData({ ...agreementData, monthlyRent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={agreementData.securityDeposit}
                  onChange={(e) => setAgreementData({ ...agreementData, securityDeposit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Premises Address</label>
                <input
                  type="text"
                  value={agreementData.address}
                  onChange={(e) => setAgreementData({ ...agreementData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium"
                />
              </div>
            </div>

            {/* Agreement Preview */}
            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-[11px] font-mono whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed border border-slate-800">
              {fullAgreementText}
            </pre>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAgreement}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? '✓ Copied to Clipboard' : 'Copy Agreement Text'}</span>
                </button>

                <button
                  onClick={handlePrintAgreement}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
              </div>

              <button
                onClick={() => setShowAgreementModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Download, 
  Printer, 
  Sparkles, 
  AlertCircle, 
  UserCheck, 
  EyeOff, 
  KeyRound, 
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Mail,
  Building2,
  Trash2,
  X,
  Copy
} from 'lucide-react';

import AnimatedCounter from '../components/common/AnimatedCounter';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

export default function PrivacyTerms() {
  const location = useLocation();
  const toast = useToast();
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState('privacy');
  const [showDataModal, setShowDataModal] = useState(false);
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [dataRequestEmail, setDataRequestEmail] = useState('');
  const [dataRequestType, setDataRequestType] = useState('download');
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (location.pathname.includes('terms')) {
      setActiveTab('terms');
    } else {
      setActiveTab('privacy');
    }
  }, [location.pathname]);

  const handlePrint = () => {
    toast.info('Printing Document 🖨️', 'Opening document in print view.');
    window.print();
  };

  const handleDataRequestSubmit = (e) => {
    e.preventDefault();
    if (!dataRequestEmail) return;
    setDataSubmitted(true);
    
    const isErasure = dataRequestType === 'erasure';
    toast.success(
      isErasure ? 'Erasure Request Submitted' : 'Data Export Requested 📦',
      `Your request under DPDP Act 2023 for ${dataRequestEmail} has been logged.`
    );

    addNotification({
      type: 'security',
      title: isErasure ? 'Data Erasure Request Logged' : 'Data Export Requested',
      message: `DPDP 2023 compliance ticket for ${dataRequestEmail} generated. Our Grievance Officer will process it within 72 hours.`,
      link: '/privacy',
      category: 'system',
      badge: 'Privacy Rights',
    });

    setTimeout(() => {
      setDataSubmitted(false);
      setShowDataModal(false);
      setDataRequestEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Elevated Privacy & Trust Visuals                         */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-white border-b border-slate-100 py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
        
        {/* Subtle Background Accent on Right */}
        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-1/2 z-0 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=85"
            alt="Secure digital encryption privacy protection"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent" />
        </div>

        {/* Framed Security Badge Overlay on Right */}
        <div className="absolute top-12 right-12 lg:right-24 z-10 hidden lg:block bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-xl text-center max-w-[160px]">
          <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Trust & Security</p>
          <p className="font-serif italic font-bold text-xs text-slate-900 leading-snug pt-1">
            DPDP Act 2023 <br />
            Compliant
          </p>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[10px] text-emerald-600 font-bold">
            <Shield className="w-3 h-3" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full text-left">
          <div className="max-w-2xl space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Legal, Privacy & User Rights</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Your Privacy. <br />
              <span className="text-[#FE424D]">Guaranteed & Protected.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              We never sell your phone number to telemarketers or brokers. Learn how RoomWati encrypts your data, enforces zero-brokerage rules, and protects your tenant rights.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setShowDataModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Manage My Data / Rights</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Policy</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. STATS BAR: 4-Column Privacy Metric Counter                             */}
      {/* ========================================================================= */}
      <section className="w-full bg-white border-b border-slate-100 py-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
            
            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                <AnimatedCounter target={0} suffix="%" duration={1000} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Data Sold to Telemarketers</p>
            </div>

            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                <AnimatedCounter target={256} suffix="-Bit" duration={1800} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">End-to-End SSL Encryption</p>
            </div>

            <div className="text-center md:border-r md:border-slate-200/80 px-4 space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">DPDP 2023</p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Indian Data Act Compliant</p>
            </div>

            <div className="text-center px-4 space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-[#FE424D] tracking-tight">
                <AnimatedCounter target={0} prefix="₹" suffix=" Fee" duration={1000} />
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-slate-500">Zero Brokerage Guarantee</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TAB CONTROLLER & CONTENT AREA                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 text-left">
        
        {/* Navigation Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 inline-flex shadow-inner">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'privacy'
                  ? 'bg-white text-slate-900 shadow-md font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-4 h-4 text-[#FE424D]" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'terms'
                  ? 'bg-white text-slate-900 shadow-md font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Terms of Service</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Navigation Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {activeTab === 'privacy' ? 'Privacy Sections' : 'Terms Outline'}
              </h3>
              
              <nav className="space-y-1.5 text-xs font-semibold">
                {activeTab === 'privacy' ? (
                  <>
                    <a href="#info-collect" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      1. Information We Collect
                    </a>
                    <a href="#how-we-use" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      2. How We Use Your Data
                    </a>
                    <a href="#zero-resell" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      3. Zero Data Reselling Guarantee
                    </a>
                    <a href="#security" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      4. Security & Encryption Standards
                    </a>
                    <a href="#user-rights" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      5. Your Rights & Data Erasure
                    </a>
                    <a href="#grievance" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      6. Grievance Officer Details
                    </a>
                  </>
                ) : (
                  <>
                    <a href="#zero-brokerage-term" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      1. Strict Zero Brokerage Policy
                    </a>
                    <a href="#listing-accuracy" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      2. Accuracy of Room & Flat Ads
                    </a>
                    <a href="#code-of-conduct" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      3. Tenant & Host Code of Conduct
                    </a>
                    <a href="#lease-agreements" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      4. 11-Month Lease Legal Disclaimer
                    </a>
                    <a href="#dispute-resolution" className="block p-2 rounded-xl text-slate-700 hover:bg-white hover:text-[#FE424D] transition-colors">
                      5. Dispute Resolution & Jurisdiction
                    </a>
                  </>
                )}
              </nav>
            </div>

            {/* Quick Support Callout */}
            <div className="bg-[#0f172a] text-white p-6 rounded-3xl space-y-3 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold">Need Legal Clarification?</h4>
              <p className="text-xs text-slate-300">
                Our compliance and grievance team is available for any questions regarding your account or data.
              </p>
              <a
                href="mailto:legal@roomwati.com"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FE424D] hover:underline pt-1"
              >
                <span>legal@roomwati.com</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Detailed Document Body */}
          <div className="lg:col-span-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-10 leading-relaxed text-left">
            
            {/* Last Updated Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100 text-xs text-slate-500">
              <span className="font-semibold">RoomWati Technologies Pvt. Ltd. (CIN: U72900DL2024PTC123456)</span>
              <span className="bg-slate-100 px-3 py-1 rounded-full font-medium">Effective: September 01, 2026</span>
            </div>

            {activeTab === 'privacy' ? (
              <div className="space-y-10 text-sm text-slate-700">
                
                {/* Section 1 */}
                <div id="info-collect" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-red-50 text-[#FE424D] flex items-center justify-center text-xs font-bold">1</span>
                    <h2 className="text-xl font-black text-slate-900">Information We Collect</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    When you use RoomWati to search for rooms, list properties, or message tenants/landlords, we collect certain personal information to deliver a secure and verified experience:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <p className="font-bold text-slate-900 text-xs">Account Credentials</p>
                      <p className="text-xs text-slate-500">Name, mobile phone number, email address, password hash, and optional profile avatar.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <p className="font-bold text-slate-900 text-xs">Listing & Property Details</p>
                      <p className="text-xs text-slate-500">Room images, rental pricing, security deposit terms, geolocation, and amenities.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <p className="font-bold text-slate-900 text-xs">Verification Metadata</p>
                      <p className="text-xs text-slate-500">Corporate work email domain, student college ID badge, or Aadhaar identity confirmation.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <p className="font-bold text-slate-900 text-xs">Direct Communications</p>
                      <p className="text-xs text-slate-500">Inquiry messages sent between verified landlords and tenants to prevent fraud.</p>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div id="how-we-use" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-red-50 text-[#FE424D] flex items-center justify-center text-xs font-bold">2</span>
                    <h2 className="text-xl font-black text-slate-900">How We Use Your Data</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We use your data solely for lawful purposes directly connected to fulfilling your rental discovery requests:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Connecting verified flatmates and room seekers directly without middlemen.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Verifying property authenticity and detecting counterfeit or fraudulent listings.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Generating customized 11-month rental agreement drafts upon user request.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Complying with municipal safety regulations and local Indian law enforcement directives.</span>
                    </li>
                  </ul>
                </div>

                {/* Section 3: Highlight Callout */}
                <div id="zero-resell" className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span>3. Zero Data Reselling Guarantee</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                    <strong>We respect your peace of mind.</strong> Unlike legacy real estate portals that monetize your phone number by selling leads to third-party telemarketers, loan agents, and brokers, RoomWati maintains an unconditional guarantee: <em>we will never sell, rent, or trade your contact info to any external marketing agency.</em>
                  </p>
                </div>

                {/* Section 4 */}
                <div id="security" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-red-50 text-[#FE424D] flex items-center justify-center text-xs font-bold">4</span>
                    <h2 className="text-xl font-black text-slate-900">Security & Encryption Standards</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We adopt rigorous technical safeguards to secure your private data:
                  </p>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                    <p>• <strong>Bcrypt Salted Password Hashing:</strong> Your raw passwords are never saved in plain text.</p>
                    <p>• <strong>256-Bit SSL/TLS Transport Security:</strong> All API requests between your browser and our cloud servers are encrypted.</p>
                    <p>• <strong>Access Control:</strong> Administrative data access is governed by strict role-based access control (RBAC) with audit logs.</p>
                  </div>
                </div>

                {/* Section 5 */}
                <div id="user-rights" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-red-50 text-[#FE424D] flex items-center justify-center text-xs font-bold">5</span>
                    <h2 className="text-xl font-black text-slate-900">Your Rights & Data Erasure</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Under India's Digital Personal Data Protection (DPDP) Act 2023, you have full ownership over your information:
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => setShowDataModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-[#FE424D] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Request Complete Account Deletion</span>
                    </button>
                    <button
                      onClick={() => setShowDataModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Archive of My Data</span>
                    </button>
                  </div>
                </div>

                {/* Section 6 */}
                <div id="grievance" className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-red-50 text-[#FE424D] flex items-center justify-center text-xs font-bold">6</span>
                    <h2 className="text-xl font-black text-slate-900">Grievance Redressal Officer</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    In accordance with Information Technology Act 2000 and the Rules made thereunder, the contact details of the Grievance Officer are published below:
                  </p>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">Mr. Amitesh Sengupta (Chief Grievance Officer)</p>
                    <p>RoomWati Technologies Pvt. Ltd.</p>
                    <p>Office: Plot 44, Okhla Phase III, Near Saket PVR Complex, New Delhi 110020, India</p>
                    <p>Email: <a href="mailto:grievance@roomwati.com" className="text-[#FE424D] font-bold">grievance@roomwati.com</a></p>
                    <p className="text-[11px] text-slate-500 pt-1">Response time: Within 48 business hours as per Indian statutory requirements.</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-10 text-sm text-slate-700">
                
                {/* Terms Section 1 */}
                <div id="zero-brokerage-term" className="p-6 rounded-3xl bg-red-50 border border-red-200 space-y-3">
                  <div className="flex items-center gap-2 text-red-800 font-black text-base">
                    <Shield className="w-5 h-5 text-[#FE424D]" />
                    <span>1. Strict Zero Brokerage Policy</span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-950 leading-relaxed">
                    RoomWati is built specifically to eradicate commission extortion in India's rental housing market. Users are strictly prohibited from demanding brokerage, commission, or middleman finder fees from other tenants or flatmates. Any account attempting broker solicitations will be permanently terminated with no possibility of reinstatement.
                  </p>
                </div>

                {/* Terms Section 2 */}
                <div id="listing-accuracy" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">2</span>
                    <h2 className="text-xl font-black text-slate-900">Accuracy of Room & Flat Ads</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    By listing a room, PG, or flat on RoomWati, hosts agree that all stated particulars—including monthly rent, security deposit amount, furnishing status, photos, and house rules—are genuine and truthful. Misleading pricing (e.g., bait-and-switch rents) violates our community terms.
                  </p>
                </div>

                {/* Terms Section 3 */}
                <div id="code-of-conduct" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">3</span>
                    <h2 className="text-xl font-black text-slate-900">Tenant & Host Code of Conduct</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    All users must treat each other with dignity. RoomWati upholds a zero-tolerance policy against discrimination based on religion, caste, gender, sexual orientation, food habits, or regional background.
                  </p>
                </div>

                {/* Terms Section 4 */}
                <div id="lease-agreements" className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">4</span>
                    <h2 className="text-xl font-black text-slate-900">11-Month Lease Legal Disclaimer</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    The standard 11-month lease agreement generator provided on RoomWati is for facilitation purposes. Users are advised to review local state stamp duty requirements (e.g., Karnataka, Maharashtra, Delhi NCT) and execute agreements on valid non-judicial stamp paper.
                  </p>
                </div>

                {/* Terms Section 5 */}
                <div id="dispute-resolution" className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">5</span>
                    <h2 className="text-xl font-black text-slate-900">Dispute Resolution & Jurisdiction</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    These Terms of Service are governed by the laws of India. Any legal proceedings or disputes arising out of the use of this website shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
                  </p>
                </div>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. DATA RIGHTS & ERASURE MODAL                                            */}
      {/* ========================================================================= */}
      {showDataModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowDataModal(false)}
        >
          <div 
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDataModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pr-8">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FE424D]">User Privacy Control</span>
              <h3 className="text-xl font-bold text-slate-900">Data Rights & Privacy Request</h3>
              <p className="text-xs text-slate-500">Exercise your DPDP Act 2023 rights to download or permanently delete your account data.</p>
            </div>

            {dataSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Request Dispatched</h4>
                <p className="text-xs text-emerald-700">
                  We have received your privacy request for <strong>{dataRequestEmail}</strong>. Our security team will process it within 24–48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDataRequestSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Select Action</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDataRequestType('download')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                        dataRequestType === 'download'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Archive</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDataRequestType('delete')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                        dataRequestType === 'delete'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Erase My Account</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={dataRequestEmail}
                    onChange={(e) => setDataRequestEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#FE424D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs transition-colors shadow-md"
                >
                  Submit Privacy Request
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Encrypted via 256-Bit SSL</span>
              <button
                type="button"
                onClick={() => setShowDataModal(false)}
                className="font-semibold text-slate-700 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


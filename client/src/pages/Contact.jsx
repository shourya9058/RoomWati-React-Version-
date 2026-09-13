import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  Send, 
  Headphones, 
  ShieldCheck, 
  Heart, 
  User, 
  Building, 
  Settings, 
  Briefcase, 
  ChevronRight, 
  MapPin, 
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

export default function Contact() {
  const toast = useToast();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    toast.success('Message Received! 📨', `Thank you ${formData.name || 'there'}. Our priority support team will respond within 2 hours.`);

    addNotification({
      type: 'welcome',
      title: 'Support Inquiry Submitted',
      message: `Your message regarding "${formData.subject || 'General Inquiry'}" was received. Ticket #${Math.floor(100000 + Math.random() * 900000)} generated.`,
      link: '/help',
      category: 'activity',
      badge: 'Support Ticket',
    });

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };


  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER                                                            */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-white border-b border-slate-100 py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        
        {/* Soft Background Visual on Right */}
        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-1/2 z-0 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1400&q=85"
            alt="Customer care workspace"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        </div>

        {/* Live Support Online Badge */}
        <div className="absolute top-12 right-12 lg:right-24 z-10 hidden lg:flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-900">Support Desk Live</p>
            <p className="text-[10px] text-slate-500">Replies in &lt; 15 mins</p>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full text-left">
          <div className="max-w-2xl space-y-6">
            
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FE424D]">
              WE'RE HERE TO HELP
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Let's talk. <br />
              We're just a message away.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              Have a question about a listing, need help with your account, or want to list your property? Our team is here to assist you.
            </p>

            {/* 3 Value Badges in Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#FE424D] flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Quick Response</h4>
                  <p className="text-[11px] text-slate-500">Usually within 15 minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#FE424D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Real Support</h4>
                  <p className="text-[11px] text-slate-500">Talk to actual people</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#FE424D] flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 fill-[#FE424D]/10" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Here for Everyone</h4>
                  <p className="text-[11px] text-slate-500">Tenants & Landlords</p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN SECTION: CARDS & FORM (Airy, Spacious Grid)               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT COLUMN: Contact Information & Quick Help Links (5 Cols)            */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Dark Contact Card */}
            <div className="bg-[#0f172a] text-white p-8 rounded-3xl shadow-xl space-y-6 text-left relative overflow-hidden">
              <h3 className="text-lg font-bold text-white tracking-tight">Contact Information</h3>

              <div className="space-y-6 text-sm">
                
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#FE424D] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">Email Us</p>
                    <a href="mailto:support@roomwati.com" className="text-slate-300 hover:text-white transition-colors block">
                      support@roomwati.com
                    </a>
                    <p className="text-xs text-slate-400">We typically reply within 15 minutes</p>
                  </div>
                </div>

                {/* Call Us */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#FE424D] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">Call Us</p>
                    <p className="text-slate-200 font-semibold">+91 800 123 7666</p>
                    <p className="text-xs text-slate-400">Mon – Sat, 9 AM – 8 PM (IST)</p>
                  </div>
                </div>

                {/* WhatsApp Support */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">WhatsApp Support</p>
                    <p className="text-emerald-300 font-semibold">+91 98765 43210</p>
                    <p className="text-xs text-slate-400">Instant help on WhatsApp</p>
                  </div>
                </div>

              </div>

              {/* Footnote */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Average response time: &lt; 15 minutes</span>
              </div>
            </div>

            {/* Quick Help Links Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 text-left">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                Quick Help links
              </h3>

              <div className="space-y-3">
                
                <Link
                  to="/help"
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FE424D] transition-colors">I'm a Tenant</p>
                      <p className="text-xs text-slate-500">Help with bookings, payments, or issues</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/host-resources"
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#FE424D] flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FE424D] transition-colors">I'm a Property Owner</p>
                      <p className="text-xs text-slate-500">List a property, manage listings, or payouts</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/help"
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FE424D] transition-colors">Account & Technical Support</p>
                      <p className="text-xs text-slate-500">Login, verification, or technical issues</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/contact"
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FE424D] transition-colors">Partnership / Business Enquiries</p>
                      <p className="text-xs text-slate-500">Collaboration, media, or bulk housing</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

              </div>
            </div>

          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: Send us a Message Form & WhatsApp Box (7 Cols)           */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Form Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-left">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Send us a Message</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Fill in the details and we'll get back to you as soon as possible.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-950">Thank you for reaching out!</h4>
                  <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                    Your message has been sent to our priority support desk. We will respond within 15 minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Your Full Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Verma"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FE424D] focus:ring-1 focus:ring-[#FE424D]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FE424D] focus:ring-1 focus:ring-[#FE424D]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Inquiry Topic Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Phone Number (Optional)</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FE424D] focus:ring-1 focus:ring-[#FE424D]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Inquiry Topic *</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#FE424D] focus:ring-1 focus:ring-[#FE424D]"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="tenant">Tenant Booking & Visit Assistance</option>
                        <option value="landlord">List Your Room / Property Help</option>
                        <option value="verification">Verification & Safety Concern</option>
                        <option value="business">Partnership & Media</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Your Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help you..."
                      className="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FE424D] focus:ring-1 focus:ring-[#FE424D]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 transition-all hover:scale-[1.01] active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>

                  <p className="text-[11px] text-slate-500 text-center pt-1">
                    By submitting this form, you agree to our{' '}
                    <Link to="/privacy" className="text-[#FE424D] hover:underline">Privacy Policy</Link>{' '}
                    and{' '}
                    <Link to="/terms" className="text-[#FE424D] hover:underline">Terms of Service</Link>.
                  </p>

                </form>
              )}

            </div>

            {/* Prefer to Chat on WhatsApp Box */}
            <div className="p-6 rounded-3xl bg-rose-50/60 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#FE424D]">
                    PREFER TO CHAT?
                  </p>
                  <h4 className="text-base font-bold text-slate-900">Chat with us on WhatsApp</h4>
                  <p className="text-xs text-slate-600">
                    Get quick answers, share documents, and track your requests right on WhatsApp.
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-xs font-bold shrink-0 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat Now</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "OUR OFFICE LOCATIONS" (4-Card Row with Delhi PVR Hub & Live Map Card) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 text-left">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Office Locations</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Visit us at one of our offices or get in touch online.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Card 1: Bengaluru */}
            <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#FE424D]">
                  <MapPin className="w-4 h-4" />
                  <h4 className="font-bold text-slate-900 text-sm">Bengaluru (HQ)</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Indiranagar 100ft Road, Bengaluru, KA 560038
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=100ft+Road+Indiranagar+Bengaluru"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#FE424D] hover:underline pt-4"
              >
                <span>Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2: Mumbai */}
            <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#FE424D]">
                  <MapPin className="w-4 h-4" />
                  <h4 className="font-bold text-slate-900 text-sm">Mumbai</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bandra Kurla Complex (BKC), Mumbai, MH 400051
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Bandra+Kurla+Complex+Mumbai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#FE424D] hover:underline pt-4"
              >
                <span>Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 3: Delhi NCR (Next to PVR Cinemas Saket) */}
            <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#FE424D]">
                  <MapPin className="w-4 h-4" />
                  <h4 className="font-bold text-slate-900 text-sm">Delhi NCR</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Next to PVR Cinemas, Saket Community Centre, New Delhi DL 110017
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=PVR+Saket+New+Delhi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#FE424D] hover:underline pt-4"
              >
                <span>Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 4: Location Map Graphic Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[160px]">
              
              <div className="absolute inset-0 z-0 opacity-40">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                  alt="India location hubs"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
              </div>

              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>3 Active Hubs</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Delhi (PVR) • Mumbai • Bengaluru
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <Building className="w-4 h-4 text-[#FE424D]" />
                  <span>Building better communities</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. "STILL HAVE QUESTIONS?" BANNER                                         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6">
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-900">Still have questions?</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Check out our Help Center for quick answers to common questions.
            </p>
          </div>

          <Link
            to="/help"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm border border-slate-200 transition-all hover:scale-105"
          >
            <span>Visit Help Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}

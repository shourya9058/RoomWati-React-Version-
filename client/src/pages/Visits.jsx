import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Navigation,
  ShieldCheck,
  User,
  Plus,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  Home,
  Mail,
  UserCheck,
  Eye,
  ChevronRight,
  Info
} from 'lucide-react';
import { useVisits } from '../context/VisitContext';
import { useChat } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';

export default function Visits() {
  const { visits, upcomingVisits, updateVisitStatus, rescheduleVisit, cancelVisit } = useVisits();
  const { startConversationWithHost } = useChat();
  const toast = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlTab = searchParams.get('tab');
  const tenantVisits = visits.filter((v) => !v.isOwnerView && v.status !== 'cancelled' && v.status !== 'completed');
  const ownerVisits = visits.filter((v) => v.isOwnerView && v.status !== 'cancelled' && v.status !== 'completed');
  const pastVisits = visits.filter((v) => v.status === 'completed' || v.status === 'cancelled');

  // Default tab based on user's current data
  const activeTab = urlTab || (ownerVisits.length > 0 && tenantVisits.length === 0 ? 'owner' : 'upcoming');

  const [rescheduleModalVisit, setRescheduleModalVisit] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('11:00 AM');

  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM'
  ];

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!newDate || !rescheduleModalVisit) {
      toast.error('Please select a date', 'Choose your desired date for the visit.');
      return;
    }
    rescheduleVisit(rescheduleModalVisit.id, newDate, newSlot);
    setRescheduleModalVisit(null);
    setNewDate('');
  };

  const handleStartChatFromVisit = (visit) => {
    const isOwner = visit.isOwnerView;
    const initialMsg = isOwner
      ? `Hi ${visit.tenantName || 'there'}, I received your visit request for "${visit.listingTitle}" scheduled on ${visit.visitDate} at ${visit.visitSlot}. Looking forward to connecting!`
      : `Hi ${visit.hostName || 'Host'}, I am following up on our scheduled room visit for "${visit.listingTitle}" on ${visit.visitDate} at ${visit.visitSlot}.`;

    const threadId = startConversationWithHost({
      listing: {
        _id: visit.listingId,
        id: visit.listingId,
        title: visit.listingTitle,
        price: visit.listingPrice,
        location: visit.listingLocation,
        image: { url: visit.listingImage },
        owner: {
          _id: visit.host?.id || visit.hostId,
          id: visit.host?.id || visit.hostId,
          username: visit.hostName,
          email: visit.hostEmail,
          phone: visit.hostPhone,
        }
      },
      initialMessage: initialMsg
    });
    navigate(`/messages?id=${threadId}`);
  };

  // Filter visits based on active tab
  const filteredVisits = visits.filter((v) => {
    if (activeTab === 'upcoming') {
      return !v.isOwnerView && (v.status === 'confirmed' || v.status === 'pending');
    }
    if (activeTab === 'owner') {
      return v.isOwnerView && (v.status === 'confirmed' || v.status === 'pending');
    }
    if (activeTab === 'all') {
      return v.status === 'confirmed' || v.status === 'pending';
    }
    if (activeTab === 'past') {
      return v.status === 'completed' || v.status === 'cancelled';
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Visit Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Awaiting Host Confirmation
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
            <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FE424D] uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>In-Person Viewing & Inquiries Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Scheduled Visits & Appointments
              {upcomingVisits.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                  {upcomingVisits.length} Active
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/messages"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300"
            >
              <MessageSquare className="w-4 h-4 text-[#FE424D]" />
              <span>In-App Messages</span>
            </Link>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FE424D] hover:bg-[#E0323D] text-white font-bold text-sm rounded-xl shadow-sm transition-all hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Explore More Rooms</span>
            </Link>
          </div>
        </div>

        {/* Dual Role Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto no-scrollbar">
          {/* 1. Places I'm Visiting */}
          <button
            onClick={() => setSearchParams({ tab: 'upcoming' })}
            className={`px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'upcoming'
                ? 'bg-[#FE424D] text-white shadow-md shadow-[#FE424D]/20'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Places I'm Visiting</span>
            {tenantVisits.length > 0 && (
              <span className={`px-2 py-0.2 rounded-full text-xs font-black ${
                activeTab === 'upcoming' ? 'bg-white text-[#FE424D]' : 'bg-rose-100 text-[#FE424D]'
              }`}>
                {tenantVisits.length}
              </span>
            )}
          </button>

          {/* 2. Visitors to My Properties */}
          <button
            onClick={() => setSearchParams({ tab: 'owner' })}
            className={`px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'owner'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Visitors to My Properties</span>
            {ownerVisits.length > 0 && (
              <span className={`px-2 py-0.2 rounded-full text-xs font-black ${
                activeTab === 'owner' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {ownerVisits.length}
              </span>
            )}
          </button>

          {/* 3. All Unified Activity */}
          <button
            onClick={() => setSearchParams({ tab: 'all' })}
            className={`px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#FE424D] text-white shadow-md'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>All Visits ({visits.filter((v) => v.status !== 'cancelled' && v.status !== 'completed').length})</span>
          </button>

          {/* 4. Past & Cancelled */}
          <button
            onClick={() => setSearchParams({ tab: 'past' })}
            className={`px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'past'
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Past & Cancelled ({pastVisits.length})</span>
          </button>
        </div>

        {/* Visits Feed List */}
        {filteredVisits.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-[#FE424D] flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              {activeTab === 'owner'
                ? 'No visitor inquiries for your properties yet'
                : activeTab === 'upcoming'
                ? "You haven't scheduled any visits yet"
                : 'No visits in this category'}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              {activeTab === 'owner'
                ? 'When tenants and seekers book a free visit on your listed rooms, their contact details and timing will appear right here.'
                : 'Ready to find your next home? Schedule a free zero-brokerage visit directly from any room listing.'}
            </p>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FE424D] hover:bg-[#E0323D] text-white font-extrabold text-sm rounded-2xl shadow-sm transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Browse Verified Listings</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVisits.map((visit) => {
              const isOwner = visit.isOwnerView;

              return (
                <div
                  key={visit.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-md shadow-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-slate-300 transition-all duration-300 group animate-fade-in"
                >
                  <div>
                    {/* Top Property Info Banner */}
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      {visit.listingImage ? (
                        <img
                          src={visit.listingImage}
                          alt={visit.listingTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-800 flex items-center justify-center">
                          <Home className="w-12 h-12 text-slate-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                      {/* Role & Status Badges */}
                      <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5">
                        {isOwner ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-900/90 backdrop-blur-sm text-emerald-400 border border-emerald-500/30 shadow-sm">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            Owner: Incoming Visitor
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-600/90 backdrop-blur-sm text-white shadow-sm">
                            <User className="w-3 h-3" />
                            My Scheduled Viewing
                          </span>
                        )}
                        {getStatusBadge(visit.status)}
                      </div>

                      {/* Rent Price */}
                      <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-slate-900 shadow-sm">
                        ₹{visit.listingPrice?.toLocaleString()}/mo
                      </div>

                      {/* Title & Location */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="text-base font-black truncate">{visit.listingTitle}</h3>
                        <p className="text-xs text-slate-200 flex items-center gap-1 truncate mt-0.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                          <span>{visit.listingLocation}</span>
                        </p>
                      </div>
                    </div>

                    {/* Schedule & Contact Info Box */}
                    <div className="p-5 space-y-4">
                      {/* Schedule Highlight */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#FE424D] flex items-center justify-center font-bold">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                              Visit Date & Time Slot
                            </span>
                            <span className="text-sm font-black text-slate-900">
                              {visit.visitDate} • {visit.visitSlot || visit.visitTime || '11:00 AM'}
                            </span>
                          </div>
                        </div>

                        <span className="text-[11px] font-black px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                          100% Free
                        </span>
                      </div>

                      {/* Detailed Counterpart Profile Box */}
                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                          <span>{isOwner ? '👤 Visitor Information' : '🏠 Host / Property Contact'}</span>
                          {isOwner && (
                            <span className="text-emerald-600 font-extrabold text-[10px] lowercase tracking-normal">
                              ● Prospective Tenant
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar
                              name={isOwner ? visit.tenantName || 'Visitor' : visit.hostName || 'Host'}
                              size="sm"
                              shape="rounded-xl"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-slate-900 truncate">
                                {isOwner ? visit.tenantName || 'Interested Visitor' : visit.hostName || 'Property Host'}
                              </h4>
                              <p className="text-[11px] text-slate-500 truncate font-medium">
                                {isOwner ? visit.tenantEmail || 'seeker@roomwati.com' : visit.hostEmail || 'host@roomwati.com'}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-slate-700 font-mono block">
                              {isOwner ? visit.tenantPhone || '+91 98765 00000' : visit.hostPhone || '+91 98765 43210'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Notes / Special Requests */}
                      {visit.notes && (
                        <p className="text-xs text-slate-600 font-medium bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>Note: {visit.notes}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Chat Button */}
                      <button
                        onClick={() => handleStartChatFromVisit(visit)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all"
                        title={isOwner ? 'Chat with visitor' : 'Chat with host'}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#FE424D]" />
                        <span>{isOwner ? 'Chat Visitor' : 'Chat Host'}</span>
                      </button>

                      {/* Direct Phone Call */}
                      <a
                        href={`tel:${isOwner ? visit.tenantPhone : visit.hostPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Call</span>
                      </a>

                      {/* Email Link */}
                      <a
                        href={`mailto:${isOwner ? visit.tenantEmail : visit.hostEmail}`}
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all"
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        <span>Email</span>
                      </a>

                      {/* Map Directions */}
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(visit.listingLocation)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-500" />
                        <span>Map</span>
                      </a>
                    </div>

                    {visit.status === 'confirmed' || visit.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        {isOwner && visit.status === 'pending' ? (
                          <button
                            onClick={() => updateVisitStatus(visit.id, 'confirmed')}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
                          >
                            Accept Visit
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setRescheduleModalVisit(visit);
                              setNewDate(visit.visitDate);
                              setNewSlot(visit.visitSlot || '11:00 AM');
                            }}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all"
                          >
                            Reschedule
                          </button>
                        )}

                        <button
                          onClick={() => cancelVisit(visit.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Cancel Visit"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">Archived</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reschedule Visit Modal */}
        {rescheduleModalVisit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-modal-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#FE424D] font-black text-base">
                  <Calendar className="w-5 h-5" />
                  <span>Reschedule Visit</span>
                </div>
                <button
                  onClick={() => setRescheduleModalVisit(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Select a new preferred date & time for{' '}
                <span className="font-bold text-slate-800">
                  "{rescheduleModalVisit.listingTitle}"
                </span>
                . Both parties will receive an instant notification.
              </p>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#FE424D] focus:ring-2 focus:ring-[#FE424D]/20 text-sm outline-none font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setNewSlot(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          newSlot === slot
                            ? 'bg-[#FE424D] text-white border-[#FE424D] shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRescheduleModalVisit(null)}
                    className="px-4 py-2 text-slate-600 text-xs font-bold hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FE424D] hover:bg-[#E0323D] text-white text-xs font-black rounded-xl shadow-sm transition-all"
                  >
                    Save New Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

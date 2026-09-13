import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Star, 
  MapPin, 
  Share2, 
  ShieldCheck, 
  Zap, 
  Bed, 
  Bath, 
  Wind, 
  Wifi, 
  UtensilsCrossed, 
  Car, 
  Shirt, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit3, 
  ArrowLeft,
  Mail,
  User as UserIcon,
  AlertCircle,
  Phone,
  MessageCircle,
  X
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { useChat } from '../context/ChatContext';
import { useVisits } from '../context/VisitContext';
import Avatar from '../components/common/Avatar';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isFavorite, toggleFavorite } = useAuth();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const { startConversationWithHost } = useChat();
  const { scheduleVisit } = useVisits();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  // Favorite & Delete state
  const [favLoading, setFavLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Visit Scheduling Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [visitSlot, setVisitSlot] = useState('11:00 AM');
  const [visitName, setVisitName] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitSubmitting, setVisitSubmitting] = useState(false);

  useEffect(() => {
    fetchListing();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getListingById(id);
      setListing(res.listing);
    } catch (err) {
      console.error('Failed to load listing:', err);
      setError(err.message || 'Listing not found');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info('Sign in Required', 'Please log in to save spaces to your wishlist.');
      navigate(`/login?redirect=/listings/${id}`);
      return;
    }
    if (favLoading) return;

    try {
      setFavLoading(true);
      const wasFav = isFavorite(id);
      await toggleFavorite(id);
      const willBeFav = !wasFav;
      
      setListing(prev => {
        if (!prev) return prev;
        const newCount = willBeFav ? (prev.favoriteCount || 0) + 1 : Math.max(0, (prev.favoriteCount || 1) - 1);
        return { ...prev, favoriteCount: newCount };
      });

      toast.wishlist(willBeFav, listing?.title, {
        actionLabel: willBeFav ? 'View Wishlist' : undefined,
        onAction: willBeFav ? () => navigate('/profile?tab=favorites') : undefined,
      });

      if (willBeFav) {
        addNotification({
          type: 'wishlist',
          title: `Saved: ${listing?.title}`,
          message: `"${listing?.title}" in ${listing?.location} added to your saved wishlist.`,
          link: `/listings/${id}`,
          category: 'activity',
          badge: 'Wishlist',
        });
      }
    } catch (err) {
      console.error('Favorite error:', err);
      toast.error('Wishlist Error', 'Could not update your wishlist.');
    } finally {
      setFavLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    toast.success('Link Copied! 🔗', 'Listing link copied to clipboard. Share with friends and flatmates.');
  };

  const handleScheduleVisitSubmit = (e) => {
    e.preventDefault();
    setVisitSubmitting(true);

    try {
      const hostId = (listing.owner?._id || listing.owner?.id || (typeof listing.owner === 'string' ? listing.owner : ''))?.toString();
      const hostName = listing.owner?.username || 'Property Host';
      const hostEmail = listing.owner?.email || 'host@roomwati.com';
      const hostPhone = listing.owner?.phone || '+91 98765 43210';

      scheduleVisit({
        listingId: listing._id || id,
        listingTitle: listing.title,
        listingLocation: listing.location,
        listingPrice: listing.price,
        listingImage: listing.image?.url || (typeof listing.image === 'string' ? listing.image : null) || null,
        hostId,
        hostName,
        hostPhone,
        hostEmail,
        tenantName: visitName || user?.username || 'Tenant',
        tenantPhone: visitPhone || user?.phone || '+91 98765 00000',
        visitDate,
        visitSlot,
        notes: 'In-person free room visit booked via RoomWati',
      });
      setScheduleModalOpen(false);
    } catch (err) {
      console.error('Visit error:', err);
      toast.error('Schedule Error', 'Could not schedule visit. Please try again.');
    } finally {
      setVisitSubmitting(false);
    }
  };

  const handleChatWithHost = () => {
    if (!isAuthenticated) {
      toast.info('Sign in Required', 'Please log in to chat with the host.');
      navigate(`/login?redirect=/listings/${id}`);
      return;
    }

    const threadId = startConversationWithHost({
      listing,
      initialMessage: `Hi ${listing.owner?.username || 'Host'}, I am interested in "${listing.title}" and would like to ask a few questions!`,
    });
    navigate(`/messages?id=${threadId}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Sign in Required', 'Please log in to publish a review.');
      navigate(`/login?redirect=/listings/${id}`);
      return;
    }
    if (!comment.trim()) {
      setReviewError('Please enter a review comment');
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError(null);
      const res = await api.addReview(id, { rating, comment });
      
      // Update reviews locally
      setListing(prev => ({
        ...prev,
        reviews: [...(prev.reviews || []), res.review]
      }));
      setComment('');
      setRating(5);

      toast.success('Review Published! ⭐', 'Thank you! Your verified review helps prospective tenants.');
      
      addNotification({
        type: 'system',
        title: `Review Published on ${listing?.title}`,
        message: `Your ${rating}-star review is now live on RoomWati.`,
        link: `/listings/${id}`,
        category: 'activity',
        badge: 'Review Live',
      });
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
      toast.error('Review Failed', err.message || 'Could not post your review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.deleteReview(id, reviewId);
      setListing(prev => ({
        ...prev,
        reviews: prev.reviews.filter(r => (r._id || r.id) !== reviewId)
      }));
      toast.info('Review Deleted', 'Your review was removed from this listing.');
    } catch (err) {
      toast.error('Error', err.message || 'Failed to delete review');
    }
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      setDeleteLoading(true);
      await api.deleteListing(id);
      toast.success('Listing Removed', 'Your property was removed from RoomWati.');
      navigate('/listings');
    } catch (err) {
      toast.error('Error', err.message || 'Failed to delete listing');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="aspect-[16/9] md:aspect-[21/9] bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/4" />
              <div className="h-24 bg-slate-200 rounded" />
            </div>
            <div className="h-64 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Listing Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || "The accommodation you are looking for doesn't exist or has been removed."}</p>
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold text-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>
      </div>
    );
  }

  const currentUserId = (user?._id || user?.id || '')?.toString();
  const ownerId = (listing.owner?._id || listing.owner?.id || (typeof listing.owner === 'string' ? listing.owner : ''))?.toString();
  const isOwner = Boolean(currentUserId && ownerId && currentUserId === ownerId);

  const isFav = isFavorite(id);
  const imageUrl = listing.image?.url || (typeof listing.image === 'string' ? listing.image : null) || '';

  return (
    <div className="min-h-screen bg-[#fafafc] pb-20">
      
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-slate-700">Home</Link>
          <span>/</span>
          <Link to="/listings" className="hover:text-slate-700">Listings</Link>
          <span>/</span>
          <span className="text-slate-800 truncate max-w-xs">{listing.title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {listing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm font-semibold text-slate-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900">{listing.avgRating || 'New'}</span>
                {listing.reviews?.length > 0 && (
                  <span className="text-slate-400 font-normal">({listing.reviews.length} reviews)</span>
                )}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>{listing.location}, {listing.country}</span>
              </div>
            </div>
          </div>

          {/* Share & Wishlist Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold shadow-sm transition-all text-slate-700"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-brand-500 text-brand-500' : 'text-slate-600'}`} />
              <span>{isFav ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Hero Image Showcase */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-100 shadow-card aspect-[16/9] md:aspect-[21/9] max-h-[500px] mb-10">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold text-white uppercase tracking-wider">
              {listing.roomType} Room
            </span>
            {listing.immediateAvailability && (
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" /> Instant Move-in
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (Details, Amenities, Rules, Reviews) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Host & Accommodation Summary Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src={listing.owner?.image?.url || (typeof listing.owner?.image === 'string' ? listing.owner.image : null)}
                  name={listing.owner?.username || 'Host'}
                  size="xl"
                  shape="rounded-2xl"
                />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Hosted by {listing.owner?.username || 'Verified Host'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {listing.owner?.bio || 'Passionate about providing comfortable living spaces.'}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Host</span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Room Type</p>
                <p className="text-sm font-bold text-slate-900 capitalize mt-1">{listing.roomType}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Furnishing</p>
                <p className="text-sm font-bold text-slate-900 capitalize mt-1">{listing.furnished || 'Furnished'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Gender Pref</p>
                <p className="text-sm font-bold text-slate-900 capitalize mt-1">
                  {listing.genderPreference === 'any' ? 'All Genders' : `${listing.genderPreference} Only`}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Min Stay</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{listing.minStayMonths || 1} Month(s)</p>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-900">About this Space</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {listing.description || 'No description provided for this room.'}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">What this place offers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: 'wifi', label: 'High-speed Wi-Fi', icon: Wifi, value: listing.amenities?.wifi },
                  { key: 'ac', label: 'Air Conditioning', icon: Wind, value: listing.amenities?.ac },
                  { key: 'attachedBathroom', label: 'Attached Bathroom', icon: Bath, value: listing.amenities?.attachedBathroom },
                  { key: 'kitchenAccess', label: 'Kitchen Access', icon: UtensilsCrossed, value: listing.amenities?.kitchenAccess !== false },
                  { key: 'parking', label: 'Vehicle Parking', icon: Car, value: listing.amenities?.parking },
                  { key: 'laundry', label: 'Laundry Facility', icon: Shirt, value: listing.amenities?.laundry },
                ].map((item) => {
                  const Icon = item.icon;
                  const available = Boolean(item.value);

                  return (
                    <div
                      key={item.key}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-semibold ${
                        available 
                          ? 'border-slate-200 bg-slate-50/50 text-slate-800' 
                          : 'border-slate-100 bg-slate-50/20 text-slate-400 line-through opacity-60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${available ? 'text-brand-500' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rules & Utilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* House Rules */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900">House Policies</h3>
                <ul className="space-y-2.5 text-xs font-medium text-slate-600">
                  <li className="flex items-center gap-2">
                    {listing.rules?.smoking ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    <span>Smoking {listing.rules?.smoking ? 'Allowed' : 'Not Allowed'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {listing.rules?.pets ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    <span>Pets {listing.rules?.pets ? 'Allowed' : 'Not Allowed'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {listing.rules?.guests !== false ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    <span>Guests & Visitors {listing.rules?.guests !== false ? 'Allowed' : 'Not Allowed'}</span>
                  </li>
                  {listing.rules?.curfew && (
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>Curfew: {listing.rules?.curfewDetails || 'Late night entry restrictions apply'}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Utility Bills */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900">Bills & Utilities</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    listing.bills?.included 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {listing.bills?.included ? 'All Utilities Included' : 'Utilities Excluded'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {listing.bills?.details || 'Standard electricity and water meters apply as per usage.'}
                </p>
              </div>

            </div>

            {/* REVIEWS SECTION */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <h3 className="text-xl font-bold text-slate-900">
                    {listing.avgRating ? `${listing.avgRating} · ` : ''}{listing.reviews?.length || 0} Reviews
                  </h3>
                </div>
              </div>

              {/* Write Review Form */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Leave a Review & Rating</h4>
                
                {reviewError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                    {reviewError}
                  </div>
                )}


                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  {/* Star Rating Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Share your experience with this stay, room condition, host responsiveness..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                  >
                    {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              {listing.reviews?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews yet for this space. Be the first to leave one!</p>
              ) : (
                <div className="space-y-4 pt-2">
                  {listing.reviews.map((rev) => {
                    const reviewAuthorId = (rev.author?._id || rev.author?.id || (typeof rev.author === 'string' ? rev.author : ''))?.toString();
                    const canDelete = Boolean(user && currentUserId && reviewAuthorId && currentUserId === reviewAuthorId);

                    return (
                      <div key={rev._id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Avatar
                              src={rev.author?.image?.url || (typeof rev.author?.image === 'string' ? rev.author.image : null)}
                              name={rev.author?.username || 'Reviewer'}
                              size="sm"
                              shape="rounded-full"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900">@{rev.author?.username || 'User'}</p>
                              <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{rev.rating}/5</span>
                              </div>
                            </div>
                          </div>

                          {canDelete && (
                            <button
                              onClick={() => handleDeleteReview(rev._id)}
                              className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                              title="Delete your review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

          {/* Right Sticky Booking & Actions Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-floating space-y-6">
              
              {/* Pricing Header */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{(listing.price || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-medium text-slate-500"> / month</span>
                </div>
                {listing.securityDeposit > 0 && (
                  <span className="text-xs font-semibold text-slate-500">
                    Deposit: ₹{listing.securityDeposit.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="border-t border-slate-100" />

              {/* Host Inquiry / Contact Action */}
              <div className="space-y-3">
                
                {/* Schedule a Free Visit Button */}
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.info('Sign in Required', 'Please log in to schedule an in-person property visit.');
                      navigate(`/login?redirect=/listings/${id}`);
                      return;
                    }
                    setScheduleModalOpen(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-sm shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule a Free Visit</span>
                </button>

                <button
                  onClick={handleChatWithHost}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-rose-400" />
                  <span>Chat with Host ({listing.owner?.username || 'Host'})</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isFav
                        ? 'border-[#FE424D] bg-rose-50 text-[#FE424D]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#FE424D] text-[#FE424D]' : ''}`} />
                    <span>{isFav ? 'Saved' : 'Wishlist'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Share</span>
                  </button>
                </div>

              </div>

              {/* Owner Controls */}
              {isOwner && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Host Controls</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/listings/${id}/edit`}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit Room</span>
                    </Link>
                    <button
                      onClick={handleDeleteListing}
                      disabled={deleteLoading}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Guarantees */}
              <div className="pt-2 text-center text-xs text-slate-400 space-y-1">
                <p className="flex items-center justify-center gap-1 font-semibold text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> RoomWati Verified Property
                </p>
                <p>Transparent rentals · Zero Brokerage</p>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* Schedule Visit Interactive Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 relative space-y-5 animate-modal-in">

            
            <button
              onClick={() => setScheduleModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#FE424D] flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Schedule a Free Visit</h3>
                <p className="text-xs text-slate-500">Coordinate directly with host for physical tour</p>
              </div>
            </div>

            <form onSubmit={handleScheduleVisitSubmit} className="space-y-4 pt-1">
              
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="text-xs font-bold text-slate-900 truncate">{listing.title}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {listing.location} · ₹{(listing.price || 0).toLocaleString('en-IN')}/mo
                </p>
              </div>

              {/* Date Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Time Slots */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', '07:30 PM'].map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setVisitSlot(slot)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                        visitSlot === slot
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={visitName || user?.username || ''}
                    onChange={(e) => setVisitName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">WhatsApp Phone No</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={visitPhone}
                    onChange={(e) => setVisitPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={visitSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#FE424D] hover:bg-[#e0333e] text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {visitSubmitting ? 'Confirming with Host...' : 'Confirm Free Visit'}
              </button>

              <p className="text-[11px] text-center text-slate-400 font-medium">
                🔒 100% Free visit. No token money or advance booking fees required.
              </p>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}


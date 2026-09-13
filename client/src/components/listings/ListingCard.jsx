import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, CheckCircle2, Flame, Train, Sparkles, GraduationCap, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';

export default function ListingCard({ listing, onFavoriteChange, badgeType }) {
  const { isFavorite, toggleFavorite, isAuthenticated } = useAuth();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();

  const listingId = listing._id || listing.id;
  const isFav = isFavorite(listingId);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Sign in Required', 'Please log in to save spaces to your wishlist.');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (favoriteLoading) return;

    try {
      setFavoriteLoading(true);
      await toggleFavorite(listingId);
      const willBeFav = !isFav;
      
      toast.wishlist(willBeFav, listing.title, {
        actionLabel: willBeFav ? 'View Wishlist' : undefined,
        onAction: willBeFav ? () => navigate('/profile?tab=favorites') : undefined,
      });

      if (willBeFav) {
        addNotification({
          type: 'wishlist',
          title: `Saved: ${listing.title}`,
          message: `Saved "${listing.title}" in ${listing.location} to your wishlist for easy comparison.`,
          link: `/listings/${listingId}`,
          category: 'activity',
          badge: 'Wishlist',
        });
      }

      if (onFavoriteChange) {
        onFavoriteChange(listingId);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      toast.error('Wishlist Error', 'Could not update your wishlist. Please try again.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getImageUrl = () => {
    if (listing.image?.url) {
      return listing.image.url;
    }
    return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
  };

  const formatRoomType = (type) => {
    switch (type?.toLowerCase()) {
      case 'single': return 'Single Room';
      case 'studio': return 'Entire Apartment';
      case 'ensuite': return 'Ensuite Room';
      case 'shared': return 'Shared Flat';
      case 'pg': return 'PG / Hostel';
      case 'flat': return 'Entire Apartment';
      default: return type ? `${type}` : 'Entire Apartment';
    }
  };

  // Determine tag pills matching reference: [ Entire Apartment ] [ Furnished ] [ Wi-Fi ]
  const tags = [];
  tags.push(formatRoomType(listing.roomType));
  tags.push(listing.furnished ? (listing.furnished === 'furnished' ? 'Furnished' : listing.furnished) : 'Furnished');
  if (listing.amenities?.wifi) {
    tags.push('Wi-Fi');
  } else if (listing.amenities?.attachedBathroom) {
    tags.push('Attached Bath');
  } else {
    tags.push('Wi-Fi');
  }

  const ratingValue = listing.avgRating ? listing.avgRating : (listing.rating || 4.8);
  const reviewCount = listing.reviewsCount || listing.reviews?.length || (Math.floor((listing.price % 100) + 45));

  // Determine Badge based on listing attributes
  const getBadge = () => {
    if (badgeType) return badgeType;
    if (listing.isVerified || listing.verified) {
      return { label: 'Verified', icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />, style: 'bg-white/95 text-emerald-700 border-emerald-100' };
    }
    if (listing.views > 200 || listing.likesCount > 10) {
      return { label: 'Trending', icon: <Flame className="w-3 h-3 text-amber-500" />, style: 'bg-white/95 text-amber-700 border-amber-100' };
    }
    if (listing.nearMetro || listing.location?.toLowerCase().includes('saket') || listing.location?.toLowerCase().includes('metro')) {
      return { label: 'Near Metro', icon: <Train className="w-3 h-3 text-sky-500" />, style: 'bg-white/95 text-sky-700 border-sky-100' };
    }
    if (listing.price < 15000) {
      return { label: 'Best Value', icon: <Sparkles className="w-3 h-3 text-teal-600" />, style: 'bg-white/95 text-teal-700 border-teal-100' };
    }
    if (listing.studentFriendly || listing.roomType === 'pg' || listing.roomType === 'single') {
      return { label: 'Student Friendly', icon: <GraduationCap className="w-3 h-3 text-purple-600" />, style: 'bg-white/95 text-purple-700 border-purple-100' };
    }
    return { label: 'Popular', icon: <Flame className="w-3 h-3 text-[#FE424D]" />, style: 'bg-white/95 text-rose-600 border-rose-100' };
  };

  const badge = getBadge();

  return (
    <div className="listing-card group bg-white rounded-3xl p-3.5 border border-slate-200/80 hover:border-slate-300 hover:shadow-card transition-all duration-300 flex flex-col justify-between text-left">
      
      {/* 1. Image Container */}
      <Link to={`/listings/${listingId}`} className="listing-img-container aspect-[4/3] w-full bg-slate-100 rounded-2xl block relative overflow-hidden">
        <img
          src={getImageUrl()}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Top-Left Badge */}
        {badge && (
          <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md flex items-center gap-1.5 border ${badge.style}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        )}

        {/* Favorite Heart Button in dark transparent circle */}
        <button
          onClick={handleFavoriteClick}
          disabled={favoriteLoading}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/35 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all text-white hover:text-[#FE424D]"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-[#FE424D] text-[#FE424D]' : 'text-white stroke-[2]'
            }`}
          />
        </button>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-2.5 left-0 right-0 z-10 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </div>
      </Link>

      {/* 2. Content Info */}
      <div className="pt-3 px-1 space-y-2.5 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Title & Star Rating with Reviews Count */}
          <div className="flex items-start justify-between gap-2">
            <Link to={`/listings/${listingId}`} className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] leading-snug truncate group-hover:text-[#FE424D] transition-colors">
                {listing.title}
              </h3>
            </Link>

            <div className="flex items-center gap-1 text-xs font-bold text-slate-900 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{ratingValue}</span>
              <span className="text-slate-400 font-normal text-[11px]">({reviewCount})</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium truncate pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{listing.location}{listing.country ? `, ${listing.country}` : ''}</span>
          </div>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] sm:text-[11px] font-semibold text-slate-600 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>

        {/* 3. Price & View Details Footer */}
        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-slate-900">
              ₹{(listing.price || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ month</span>
          </div>

          <Link
            to={`/listings/${listingId}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-[#FE424D] transition-colors group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  MapPin, 
  Camera, 
  Edit3, 
  Home, 
  Calendar, 
  Heart, 
  Star, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Crown, 
  Users, 
  Tag, 
  BarChart3, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  ExternalLink,
  PlusCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { useVisits } from '../context/VisitContext';
import Avatar from '../components/common/Avatar';
import api from '../services/api';
import ListingCard from '../components/listings/ListingCard';

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'listings';
  const [activeTab, setActiveTab] = useState(initialTab);

  const { user, isAuthenticated, refreshUser } = useAuth();
  const { upcomingVisits } = useVisits();
  const toast = useToast();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const profileImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editInterests, setEditInterests] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  // Pagination States
  const [listingsPage, setListingsPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(4);
  const [wishlistPage, setWishlistPage] = useState(1);
  const [wishlistPerPage, setWishlistPerPage] = useState(4);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, user?._id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getProfile();
      setProfileData(res);
      if (res.user) {
        setEditName(res.user.name || res.user.username || '');
        setEditUsername(res.user.username || '');
        setEditEmail(res.user.email || '');
        setEditLocation(res.user.location || '');
        setEditBio(res.user.bio || '');
        setEditInterests(
          Array.isArray(res.user.interests) && res.user.interests.length > 0
            ? res.user.interests.join(', ')
            : ''
        );
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams);
  };

  // Quick file selection triggers
  const handleProfileImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfilePreviewUrl(URL.createObjectURL(file));
      handleQuickPhotoUpload(file, null);
    }
  };

  const handleCoverImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
      handleQuickPhotoUpload(null, file);
    }
  };

  const handleQuickPhotoUpload = async (pImg, cImg) => {
    try {
      const formData = new FormData();
      if (pImg) formData.append('profileImage', pImg);
      if (cImg) formData.append('coverImage', cImg);

      await api.updateProfile(formData);
      await refreshUser();
      await fetchProfile();
      toast.success('Photo Updated! 📸', 'Your photo has been saved to your profile.');
    } catch (err) {
      toast.error('Upload Error', err.message || 'Could not upload photo.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      setUpdateError(null);

      const formData = new FormData();
      formData.append('name', editName.trim());
      formData.append('username', editUsername.trim());
      formData.append('email', editEmail.trim());
      formData.append('location', editLocation.trim());
      formData.append('bio', editBio.trim());
      formData.append(
        'interests',
        editInterests
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .join(',')
      );

      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      }

      await api.updateProfile(formData);
      await refreshUser();
      await fetchProfile();

      toast.success('Profile Saved! 👤', 'Your profile details have been updated.');

      addNotification({
        type: 'welcome',
        title: 'Profile Updated',
        message: 'Your personal information was updated successfully.',
        link: '/profile',
        category: 'activity',
        badge: 'Account',
      });

      setUpdateSuccess('Profile updated successfully!');
      setTimeout(() => setUpdateSuccess(null), 3000);
      handleTabChange('listings');
    } catch (err) {
      const msg = err.message || 'Failed to update profile';
      setUpdateError(msg);
      toast.error('Update Failed', msg);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      await api.deleteListing(listingId);
      setProfileData((prev) => ({
        ...prev,
        userListings: prev.userListings.filter((l) => (l._id || l.id) !== listingId),
        stats: {
          ...prev.stats,
          totalListings: Math.max(0, (prev.stats?.totalListings || 1) - 1),
        },
      }));
      toast.success('Listing Removed', 'Property removed from your dashboard.');
    } catch (err) {
      toast.error('Error', err.message || 'Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-56 bg-slate-200 rounded-3xl" />
          <div className="h-36 bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-slate-200 rounded-3xl md:col-span-2" />
            <div className="h-64 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 text-center space-y-4 shadow-sm">
          <p className="text-rose-500 font-bold text-sm">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Retry Loading Profile
          </button>
        </div>
      </div>
    );
  }

  const currentUser = profileData?.user || user || {};
  const userListings = profileData?.userListings || [];
  const favoriteListings = profileData?.favoriteListings || [];
  const userReviews = profileData?.userReviews || [];
  const receivedReviews = profileData?.receivedReviews || [];
  const totalReviewsCount = userReviews.length + receivedReviews.length;
  const userVisits = upcomingVisits || [];

  // Derived Pagination Calculations
  const totalListingsPages = Math.ceil(userListings.length / listingsPerPage) || 1;
  const paginatedUserListings = userListings.slice(
    (listingsPage - 1) * listingsPerPage,
    listingsPage * listingsPerPage
  );

  const totalWishlistPages = Math.ceil(favoriteListings.length / wishlistPerPage) || 1;
  const paginatedFavoriteListings = favoriteListings.slice(
    (wishlistPage - 1) * wishlistPerPage,
    wishlistPage * wishlistPerPage
  );

  const displayName = currentUser.name || currentUser.username || 'User';
  const displayLocation = currentUser.location || '';
  const displayBio = currentUser.bio || '';
  
  const interestsList = Array.isArray(currentUser.interests) ? currentUser.interests.filter(Boolean) : [];

  const defaultAvatar = 'https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png';

  const avatarUrl =
    profilePreviewUrl ||
    currentUser.image?.url ||
    (typeof currentUser.image === 'string' && currentUser.image ? currentUser.image : null) ||
    defaultAvatar;

  const defaultCoverImage = '/images/default-cover.png';

  const coverUrl =
    coverPreviewUrl ||
    currentUser.coverImage?.url ||
    (typeof currentUser.coverImage === 'string' && currentUser.coverImage ? currentUser.coverImage : null) ||
    defaultCoverImage;

  // Accurate dynamic profile completion calculation
  const completionItems = [
    { label: 'Add profile photo', done: Boolean(avatarUrl) },
    { label: 'Add a short bio', done: Boolean(currentUser.bio && currentUser.bio.trim().length > 5) },
    { label: 'Verify your email', done: Boolean(currentUser.email) },
    { label: 'Add preferred location', done: Boolean(currentUser.location && currentUser.location.trim().length > 2) },
    { label: 'Post a listing', done: userListings.length > 0 },
  ];
  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-24 text-slate-800">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={profileImageInputRef}
        onChange={handleProfileImageSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={coverImageInputRef}
        onChange={handleCoverImageSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Main Profile Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* 1. TOP COVER PHOTO */}
        <div className="relative h-56 sm:h-64 lg:h-72 w-full rounded-3xl overflow-hidden shadow-sm bg-slate-900 group">
          <img
            src={coverUrl}
            alt="Cover"
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/20" />

          {/* Change Cover Photo Button */}
          <button
            onClick={() => coverImageInputRef.current?.click()}
            className="absolute top-4 right-4 bg-slate-950/75 hover:bg-slate-900 text-white backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] border border-white/10 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Change Cover Photo</span>
          </button>
        </div>

        {/* 2. OVERLAPPING USER PROFILE CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm -mt-16 sm:-mt-20 relative z-10 mx-2 sm:mx-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Info: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              
              {/* Avatar with Camera Overlay Button */}
              <div className="relative shrink-0">
                <Avatar
                  src={avatarUrl}
                  name={displayName}
                  size="2xl"
                  shape="rounded-full"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100"
                />
                <button
                  onClick={() => profileImageInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#FE424D] hover:bg-rose-50 transition-all cursor-pointer"
                  title="Upload profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* User Text Info */}
              <div className="space-y-1.5 min-w-0">
                
                {/* Name + Verified Badge */}
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {displayName}
                  </h1>
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shadow-2xs"
                    title="Verified RoomWati Member"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  {currentUser.username && currentUser.username !== displayName && (
                    <span className="text-xs font-semibold text-slate-400">
                      @{currentUser.username}
                    </span>
                  )}
                </div>

                {/* Email + Location */}
                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser.email || 'No email attached'}</span>
                  </span>
                  
                  {displayLocation ? (
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{displayLocation}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleTabChange('edit')}
                      className="flex items-center gap-1 text-slate-400 hover:text-[#FE424D] transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>+ Add Location</span>
                    </button>
                  )}
                </div>

                {/* Bio */}
                <p className="text-xs sm:text-[13px] text-slate-600 max-w-xl leading-relaxed pt-1 font-normal">
                  {displayBio || (
                    <span className="italic text-slate-400">
                      No bio added yet. Click "Edit Profile" to add an introduction.
                    </span>
                  )}
                </p>

                {/* Interest Pills */}
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-2 flex-wrap">
                  {interestsList.length > 0 ? (
                    interestsList.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-slate-100/90 text-slate-600 text-[11px] font-semibold border border-slate-200/60"
                      >
                        {idx === 0 && <span className="mr-1 text-slate-400">•</span>}
                        {tag}
                      </span>
                    ))
                  ) : (
                    <button
                      onClick={() => handleTabChange('edit')}
                      className="text-[11px] font-semibold text-slate-400 hover:text-[#FE424D] flex items-center gap-1 transition-colors"
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>Add interests & tags</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right Side: Edit Button & Stats Counter Box */}
            <div className="flex flex-col items-center lg:items-end gap-5 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
              
              {/* Edit Profile Button */}
              <button
                onClick={() => handleTabChange('edit')}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition-all flex items-center gap-2 hover:border-slate-300 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Profile</span>
              </button>

              {/* 3 Stats Counters Row */}
              <div className="flex items-center gap-4 sm:gap-6">
                
                {/* 1. Listings */}
                <button
                  onClick={() => handleTabChange('listings')}
                  className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-[#FE424D] flex items-center justify-center font-bold">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 block leading-none">
                      {userListings.length}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">Listings</span>
                  </div>
                </button>

                {/* 2. Upcoming Visits (links to dedicated Visits page) */}
                <Link
                  to="/visits"
                  className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity"
                  title="View your scheduled visits"
                >
                  <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 block leading-none">
                      {userVisits.length}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">Upcoming Visits</span>
                  </div>
                </Link>

                {/* 3. Saved Properties */}
                <button
                  onClick={() => handleTabChange('wishlist')}
                  className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-[#FE424D] flex items-center justify-center font-bold">
                    <Heart className="w-4 h-4 fill-rose-500/20" />
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 block leading-none">
                      {favoriteListings.length}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">Saved Properties</span>
                  </div>
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* 3. HORIZONTAL NAVIGATION TABS (Focused, Non-Redundant) */}
        <div className="mt-8 border-b border-slate-200 flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => handleTabChange('listings')}
            className={`pb-3 text-sm font-extrabold transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'listings' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>My Listings ({userListings.length})</span>
            {activeTab === 'listings' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FE424D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('wishlist')}
            className={`pb-3 text-sm font-extrabold transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'wishlist' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Saved Wishlist ({favoriteListings.length})</span>
            {activeTab === 'wishlist' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FE424D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('reviews')}
            className={`pb-3 text-sm font-extrabold transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Reviews ({totalReviewsCount})</span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FE424D] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('edit')}
            className={`pb-3 text-sm font-extrabold transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'edit' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Edit Profile</span>
            {activeTab === 'edit' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FE424D] rounded-full" />
            )}
          </button>

        </div>

        {/* 4. MAIN TWO-COLUMN BODY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* LEFT COLUMN: Tab Contents */}
          <div className="lg:col-span-8">
            
            {/* TAB 1: My Listings */}
            {activeTab === 'listings' && (
              <div>
                {userListings.length === 0 ? (
                  /* Empty State Card */
                  <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-between min-h-[460px]">
                    
                    <div className="max-w-md mx-auto space-y-4 pt-4">
                      {/* Stylized Pastel House Graphic */}
                      <div className="w-48 h-36 mx-auto relative flex items-center justify-center">
                        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <circle cx="100" cy="85" r="55" fill="#FFEAEB" />
                          <circle cx="55" cy="100" r="18" fill="#E2E8F0" />
                          <circle cx="145" cy="95" r="22" fill="#E2E8F0" />
                          <rect x="53" y="105" width="4" height="20" rx="2" fill="#CBD5E1" />
                          <rect x="143" y="100" width="4" height="25" rx="2" fill="#CBD5E1" />
                          <rect x="75" y="70" width="50" height="45" rx="4" fill="#FFFFFF" stroke="#FECDD3" strokeWidth="2.5" />
                          <rect x="110" y="52" width="8" height="16" rx="2" fill="#FDA4AF" />
                          <path d="M68 72L100 48L132 72H68Z" fill="#FDA4AF" />
                          <rect x="94" y="92" width="12" height="23" rx="2" fill="#FE424D" />
                          <rect x="82" y="78" width="10" height="10" rx="2" fill="#FFE4E6" />
                          <rect x="108" y="78" width="10" height="10" rx="2" fill="#FFE4E6" />
                        </svg>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        No rooms listed yet
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
                        Have a spare room or property to rent? Start hosting on RoomWati and connect with verified tenants today.
                      </p>

                      <div className="pt-2">
                        <Link
                          to="/listings/new"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FE424D] hover:bg-[#E0333E] text-white font-black text-xs sm:text-sm shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>Post Your First Space</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Bottom 3 Feature Pillars */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-10 border-t border-slate-100 mt-8">
                      <div className="flex flex-col items-center text-center space-y-1.5">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Reach verified tenants</span>
                      </div>

                      <div className="flex flex-col items-center text-center space-y-1.5">
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
                          <Tag className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">100% brokerage-free</span>
                      </div>

                      <div className="flex flex-col items-center text-center space-y-1.5">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
                          <BarChart3 className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Manage everything easily</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Listed Properties Grid */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900">Your Active Listings ({userListings.length})</h3>
                      <Link
                        to="/listings/new"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FE424D] hover:bg-[#E0333E] text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Listing</span>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {paginatedUserListings.map((listing) => (
                        <div
                          key={listing._id || listing.id}
                          className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 relative mb-3">
                              <img
                                src={listing.image?.url || (typeof listing.image === 'string' ? listing.image : '')}
                                alt={listing.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-black text-slate-900 shadow-sm">
                                ₹{listing.price?.toLocaleString('en-IN')}/mo
                              </div>
                            </div>

                            <h4 className="text-sm font-black text-slate-900 truncate mb-1">
                              {listing.title}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1 truncate mb-3">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{listing.location}</span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                            <Link
                              to={`/listings/${listing._id || listing.id}`}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex-1 text-center"
                            >
                              View
                            </Link>
                            <Link
                              to={`/listings/${listing._id || listing.id}/edit`}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex-1 text-center"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteListing(listing._id || listing.id)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#FE424D] transition-colors cursor-pointer"
                              title="Delete listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Bar for User Listings */}
                    <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                        <span>
                          Showing <span className="font-bold text-slate-800">{userListings.length === 0 ? 0 : ((listingsPage - 1) * listingsPerPage) + 1}</span> to{' '}
                          <span className="font-bold text-slate-800">{Math.min(listingsPage * listingsPerPage, userListings.length)}</span> of{' '}
                          <span className="font-bold text-slate-800">{userListings.length}</span>
                        </span>

                        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                          <span>Per page:</span>
                          <select
                            value={listingsPerPage}
                            onChange={(e) => {
                              setListingsPerPage(Number(e.target.value));
                              setListingsPage(1);
                            }}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FE424D] cursor-pointer"
                          >
                            <option value={2}>2</option>
                            <option value={4}>4</option>
                            <option value={6}>6</option>
                            <option value={8}>8</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setListingsPage((p) => Math.max(1, p - 1))}
                          disabled={listingsPage === 1}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            listingsPage === 1
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                          }`}
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Prev</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {[...Array(totalListingsPages)].map((_, idx) => {
                            const pageNum = idx + 1;
                            const isCurrent = listingsPage === pageNum;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setListingsPage(pageNum)}
                                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#FE424D] text-white font-black shadow-xs'
                                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setListingsPage((p) => Math.min(totalListingsPages, p + 1))}
                          disabled={listingsPage === totalListingsPages}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            listingsPage === totalListingsPages
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                          }`}
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Saved Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">
                    Saved Properties ({favoriteListings.length})
                  </h3>
                  <Link
                    to="/listings"
                    className="text-xs font-bold text-[#FE424D] hover:underline flex items-center gap-1"
                  >
                    <span>Browse more places</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {favoriteListings.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-sm text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-[#FE424D] flex items-center justify-center mx-auto">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Your wishlist is empty</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Save rooms and flats by clicking the heart icon on any listing card to compare them here.
                    </p>
                    <Link
                      to="/listings"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-sm"
                    >
                      Explore Verified Stays
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {paginatedFavoriteListings.map((fav) => (
                        <ListingCard key={fav._id || fav.id} listing={fav} />
                      ))}
                    </div>

                    {/* Pagination Bar for Wishlist */}
                    <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                        <span>
                          Showing <span className="font-bold text-slate-800">{favoriteListings.length === 0 ? 0 : ((wishlistPage - 1) * wishlistPerPage) + 1}</span> to{' '}
                          <span className="font-bold text-slate-800">{Math.min(wishlistPage * wishlistPerPage, favoriteListings.length)}</span> of{' '}
                          <span className="font-bold text-slate-800">{favoriteListings.length}</span>
                        </span>

                        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                          <span>Per page:</span>
                          <select
                            value={wishlistPerPage}
                            onChange={(e) => {
                              setWishlistPerPage(Number(e.target.value));
                              setWishlistPage(1);
                            }}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FE424D] cursor-pointer"
                          >
                            <option value={2}>2</option>
                            <option value={4}>4</option>
                            <option value={6}>6</option>
                            <option value={8}>8</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setWishlistPage((p) => Math.max(1, p - 1))}
                          disabled={wishlistPage === 1}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            wishlistPage === 1
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                          }`}
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Prev</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {[...Array(totalWishlistPages)].map((_, idx) => {
                            const pageNum = idx + 1;
                            const isCurrent = wishlistPage === pageNum;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setWishlistPage(pageNum)}
                                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#FE424D] text-white font-black shadow-xs'
                                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setWishlistPage((p) => Math.min(totalWishlistPages, p + 1))}
                          disabled={wishlistPage === totalWishlistPages}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            wishlistPage === totalWishlistPages
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                          }`}
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Reviews & Ratings</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Feedback received on your listings and reviews written by you.
                    </p>
                  </div>
                </div>

                {totalReviewsCount === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-50 text-center space-y-3">
                    <Star className="w-8 h-8 text-amber-400 mx-auto fill-amber-400" />
                    <h4 className="text-sm font-bold text-slate-900">No reviews yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Reviews appear here once you take visits and rate properties or when tenants leave feedback on your listings.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Received Reviews */}
                    {receivedReviews.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          Feedback on Your Properties ({receivedReviews.length})
                        </h4>
                        <div className="space-y-3">
                          {receivedReviews.map((rev) => (
                            <div key={rev._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar
                                    src={rev.author?.image?.url}
                                    name={rev.author?.username || 'Reviewer'}
                                    size="sm"
                                  />
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">@{rev.author?.username || 'Tenant'}</p>
                                    <p className="text-[11px] text-slate-400">For: {rev.listingTitle}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span>{rev.rating}/5</span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed font-normal">{rev.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Authored Reviews */}
                    {userReviews.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          Reviews You Wrote ({userReviews.length})
                        </h4>
                        <div className="space-y-3">
                          {userReviews.map((rev) => (
                            <div key={rev._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span>{rev.rating}/5 Stars</span>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  {new Date(rev.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed font-normal">{rev.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Edit Profile Settings */}
            {activeTab === 'edit' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Edit Profile Information</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Update your display name, email, location, bio, and interests tags.
                    </p>
                  </div>
                </div>

                {updateSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2 border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>{updateSuccess}</span>
                  </div>
                )}

                {updateError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold">
                    {updateError}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name / Display Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="e.g. Shourya Singh"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FE424D]/20 focus:border-[#FE424D]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FE424D]/20 focus:border-[#FE424D]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FE424D]/20 focus:border-[#FE424D]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Location / City
                      </label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="e.g. Bengaluru, Karnataka"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FE424D]/20 focus:border-[#FE424D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Bio / About You
                    </label>
                    <textarea
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Share a short intro with potential hosts or tenants..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FE424D]/20 focus:border-[#FE424D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Interests / Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editInterests}
                      onChange={(e) => setEditInterests(e.target.value)}
                      placeholder="Student, Tech Enthusiast, Travel Lover"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FE424D]/20 focus:border-[#FE424D]"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleTabChange('listings')}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-6 py-2.5 rounded-xl bg-[#FE424D] hover:bg-[#E0333E] text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    >
                      {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Sidebar Cards (Profile Completion, Status, Super Host Banner) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Profile Completion Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">Profile Completion</h3>
                <span className="text-sm font-black text-slate-900">{completionPercentage}%</span>
              </div>

              {/* Red Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#FE424D] rounded-full transition-all duration-700"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              {/* Checklist Items */}
              <div className="space-y-3 pt-1">
                {completionItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold">
                    {item.done ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <span className={item.done ? 'text-slate-700 font-bold' : 'text-slate-400'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Account Status Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900">Account Status</h3>
              
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-600 leading-snug">Verified User</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Your account is verified and active.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Become a Super Host Promo Banner */}
            <div className="bg-[#fff5f5] rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4 text-center sm:text-left relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white text-amber-500 shadow-sm flex items-center justify-center shrink-0 border border-rose-100">
                  <Crown className="w-6 h-6 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    Become a Super Host
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    List more properties and get priority visibility.
                  </p>
                </div>
              </div>

              <div className="pt-1 flex justify-center sm:justify-start">
                <Link
                  to="/listings/new"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#FE424D] font-black text-xs shadow-xs border border-rose-100/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

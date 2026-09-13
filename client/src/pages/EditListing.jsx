import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  IndianRupee, 
  Upload, 
  Wifi, 
  Wind, 
  Bath, 
  UtensilsCrossed, 
  Car, 
  Shirt, 
  Check, 
  AlertCircle, 
  ArrowLeft,
  Trash2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: 'India',
    roomType: 'single',
    furnished: 'furnished',
    genderPreference: 'any',
    preferredTenants: 'any',
    securityDeposit: '',
    minStayMonths: 1,
    immediateAvailability: true,
    availableFrom: new Date().toISOString().split('T')[0],
    amenities: {
      wifi: true,
      ac: false,
      attachedBathroom: true,
      kitchenAccess: true,
      parking: false,
      laundry: true,
    },
    rules: {
      smoking: false,
      pets: false,
      guests: true,
      curfew: false,
      curfewDetails: '',
    },
    bills: {
      included: true,
      details: '',
    }
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/listings/${id}/edit`);
      return;
    }
    fetchListing();
  }, [id, isAuthenticated]);

  const fetchListing = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const res = await api.getListingById(id);
      const l = res.listing;

      // Ownership check
      const isOwner = user && l.owner && (
        (l.owner._id && l.owner._id.toString() === user._id.toString()) ||
        (l.owner.id && l.owner.id.toString() === user.id.toString()) ||
        (l.owner.toString() === user._id.toString())
      );

      if (!isOwner) {
        setError('Only the property owner can edit this listing.');
        return;
      }

      setFormData({
        title: l.title || '',
        description: l.description || '',
        price: l.price || '',
        location: l.location || '',
        country: l.country || 'India',
        roomType: l.roomType || 'single',
        furnished: l.furnished || 'furnished',
        genderPreference: l.genderPreference || 'any',
        preferredTenants: l.preferredTenants || 'any',
        securityDeposit: l.securityDeposit || '',
        minStayMonths: l.minStayMonths || 1,
        immediateAvailability: l.immediateAvailability !== false,
        availableFrom: l.availableFrom ? new Date(l.availableFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        amenities: {
          wifi: Boolean(l.amenities?.wifi),
          ac: Boolean(l.amenities?.ac),
          attachedBathroom: Boolean(l.amenities?.attachedBathroom),
          kitchenAccess: l.amenities?.kitchenAccess !== false,
          parking: Boolean(l.amenities?.parking),
          laundry: Boolean(l.amenities?.laundry),
        },
        rules: {
          smoking: Boolean(l.rules?.smoking),
          pets: Boolean(l.rules?.pets),
          guests: l.rules?.guests !== false,
          curfew: Boolean(l.rules?.curfew),
          curfewDetails: l.rules?.curfewDetails || '',
        },
        bills: {
          included: Boolean(l.bills?.included),
          details: l.bills?.details || '',
        }
      });

      if (l.image?.url) {
        setImagePreview(l.image.url);
      }
    } catch (err) {
      setError(err.message || 'Failed to load listing for editing');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim() || !formData.price) {
      setError('Please fill in all required fields (Title, Location, and Price).');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const data = new FormData();
      data.append('listing', JSON.stringify({
        ...formData,
        ...(imageUrl && { image: { url: imageUrl, filename: 'web-image' } })
      }));

      if (imageFile) {
        data.append('image', imageFile);
      }

      await api.updateListing(id, data);

      toast.success('Listing Updated! ✨', `"${formData.title}" was saved successfully.`);

      addNotification({
        type: 'welcome',
        title: `Listing Updated: ${formData.title}`,
        message: `Your changes to "${formData.title}" in ${formData.location} are now active.`,
        link: `/listings/${id}`,
        category: 'activity',
        badge: 'Updated',
      });

      navigate(`/listings/${id}`);
    } catch (err) {
      const msg = err.message || 'Failed to update listing';
      setError(msg);
      toast.error('Update Failed', msg);
    } finally {
      setSaving(false);
    }
  };


  if (initialLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-6" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <Link to={`/listings/${id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Room Details
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Edit Listing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update room specifications, pricing, amenities, or upload new photography.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2 border border-rose-100">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">1</span>
              Property Overview
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Listing Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Location / City *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Section 2: Room Specs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">2</span>
              Room Specifications & Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Room Type</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => handleInputChange('roomType', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                >
                  <option value="single">Single Room</option>
                  <option value="ensuite">Ensuite Room (Private Bath)</option>
                  <option value="studio">Studio Flat</option>
                  <option value="shared">Shared Room</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Furnished Status</label>
                <select
                  value={formData.furnished}
                  onChange={(e) => handleInputChange('furnished', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                >
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender Preference</label>
                <select
                  value={formData.genderPreference}
                  onChange={(e) => handleInputChange('genderPreference', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                >
                  <option value="any">Any (All genders)</option>
                  <option value="male">Male Only</option>
                  <option value="female">Female Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Minimum Stay (Months)</label>
                <input
                  type="number"
                  min={1}
                  value={formData.minStayMonths}
                  onChange={(e) => handleInputChange('minStayMonths', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="immediateAvailability"
                  checked={formData.immediateAvailability}
                  onChange={(e) => handleInputChange('immediateAvailability', e.target.checked)}
                  className="w-5 h-5 rounded text-brand-500 focus:ring-brand-500 border-slate-300"
                />
                <label htmlFor="immediateAvailability" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Immediate Move-in Available
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Amenities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">3</span>
              Amenities & Facilities
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'wifi', label: 'Wi-Fi', icon: Wifi },
                { key: 'ac', label: 'Air Conditioning (AC)', icon: Wind },
                { key: 'attachedBathroom', label: 'Attached Bath', icon: Bath },
                { key: 'kitchenAccess', label: 'Kitchen Access', icon: UtensilsCrossed },
                { key: 'parking', label: 'Parking', icon: Car },
                { key: 'laundry', label: 'Laundry', icon: Shirt },
              ].map((amenity) => {
                const Icon = amenity.icon;
                const isChecked = Boolean(formData.amenities[amenity.key]);

                return (
                  <button
                    key={amenity.key}
                    type="button"
                    onClick={() => handleNestedChange('amenities', amenity.key, !isChecked)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      isChecked
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{amenity.label}</span>
                    {isChecked && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Photo */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">4</span>
              Property Photography
            </h2>

            {imagePreview && (
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-500 mb-2">Current Photo Preview:</p>
                <img
                  src={imagePreview}
                  alt="Listing"
                  className="max-h-64 rounded-2xl object-cover shadow-sm border border-slate-200"
                />
              </div>
            )}

            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-brand-500 transition-colors">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Upload replacement photo</p>
                  <p className="text-xs text-slate-400">PNG, JPG, or JPEG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full max-w-xs mx-auto text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              to={`/listings/${id}`}
              className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? 'Updating Listing...' : 'Save Changes'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

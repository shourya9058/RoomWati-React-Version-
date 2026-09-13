const express = require('express');
const router = express.Router();
const Listing = require('../../models/listing.js');
const User = require('../../models/user.js');
const wrapAsync = require('../../utils/wrapAsync.js');
const multer = require('multer');
const { storage } = require('../../cloudConfig.js');
const upload = multer({ storage });

// Helper: Check authentication for API
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
  }
  next();
};

// Helper: Check listing ownership for API
const requireOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    if (!listing.owner.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Permission denied. Only the owner can manage this listing.' });
    }
    req.listing = listing;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 1. GET /api/listings - List all listings with rich filtering, search & favorite status
router.get('/', wrapAsync(async (req, res) => {
  const {
    q,
    search,
    category,
    roomType,
    minPrice,
    maxPrice,
    genderPreference,
    immediateAvailability,
    wifi,
    ac,
    attachedBathroom,
    kitchenAccess,
    parking,
    laundry,
    sort
  } = req.query;

  const query = {};
  const searchTerm = (q || search || '').trim();

  if (searchTerm) {
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { title: regex },
      { location: regex },
      { country: regex },
      { description: regex },
      { roomType: regex }
    ];
  }

  // Room type filter
  const selectedType = roomType || category;
  if (selectedType && selectedType.toLowerCase() !== 'all') {
    query.roomType = new RegExp(`^${selectedType.trim()}$`, 'i');
  }

  // Price filtering
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Gender preference
  if (genderPreference && genderPreference !== 'any') {
    query.genderPreference = genderPreference;
  }

  // Immediate availability
  if (immediateAvailability === 'true' || immediateAvailability === true) {
    query.immediateAvailability = true;
  }

  // Amenities filters
  if (wifi === 'true' || wifi === true) query['amenities.wifi'] = true;
  if (ac === 'true' || ac === true) query['amenities.ac'] = true;
  if (attachedBathroom === 'true' || attachedBathroom === true) query['amenities.attachedBathroom'] = true;
  if (kitchenAccess === 'true' || kitchenAccess === true) query['amenities.kitchenAccess'] = true;
  if (parking === 'true' || parking === true) query['amenities.parking'] = true;
  if (laundry === 'true' || laundry === true) query['amenities.laundry'] = true;

  // Sorting
  let sortOption = { _id: -1 }; // newest default
  if (sort === 'price_asc') sortOption = { price: 1 };
  else if (sort === 'price_desc') sortOption = { price: -1 };
  else if (sort === 'views') sortOption = { viewCount: -1 };
  else if (sort === 'popular' || sort === 'favorites') sortOption = { favoriteCount: -1 };

  let listings = await Listing.find(query)
    .populate({
      path: 'owner',
      select: 'username email image'
    })
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
        select: 'username image'
      }
    })
    .sort(sortOption);

  // Check user favorites
  let favoriteIds = [];
  if (req.user) {
    const user = await User.findById(req.user._id).select('favorites');
    if (user && user.favorites) {
      favoriteIds = user.favorites.map(id => id.toString());
    }
  }

  const processedListings = listings.map(listing => {
    const obj = listing.toObject({ virtuals: true });
    const listingId = listing._id.toString();
    obj.isFavorite = favoriteIds.includes(listingId);
    obj.viewCount = Math.max(0, obj.viewCount || 0);
    obj.favoriteCount = Math.max(0, obj.favoriteCount || 0);
    
    // Compute average rating
    if (obj.reviews && obj.reviews.length > 0) {
      const sum = obj.reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
      obj.avgRating = Number((sum / obj.reviews.length).toFixed(1));
    } else {
      obj.avgRating = null;
    }

    return obj;
  });

  return res.status(200).json({
    success: true,
    count: processedListings.length,
    listings: processedListings
  });
}));

// 2. GET /api/listings/:id - Single listing details
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;

  const currentListing = await Listing.findById(id);
  if (!currentListing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  // Increment viewCount safely
  const updatedViewCount = Math.max(0, currentListing.viewCount || 0) + 1;
  const listing = await Listing.findByIdAndUpdate(
    id,
    {
      $set: {
        viewCount: updatedViewCount,
        favoriteCount: Math.max(0, currentListing.favoriteCount || 0)
      }
    },
    { new: true }
  )
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
        select: 'username email image'
      }
    })
    .populate('owner', 'username email image bio');

  let isFavorite = false;
  if (req.user) {
    const user = await User.findById(req.user._id).select('favorites');
    if (user && user.favorites) {
      isFavorite = user.favorites.some(favId => favId.toString() === id.toString());
    }
  }

  const listingObj = listing.toObject({ virtuals: true });
  listingObj.isFavorite = isFavorite;

  // Compute average rating
  if (listingObj.reviews && listingObj.reviews.length > 0) {
    const sum = listingObj.reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
    listingObj.avgRating = Number((sum / listingObj.reviews.length).toFixed(1));
  } else {
    listingObj.avgRating = null;
  }

  return res.status(200).json({
    success: true,
    listing: listingObj,
    isFavorite
  });
}));

// 3. POST /api/listings - Create new listing
router.post('/', requireAuth, upload.single('image'), wrapAsync(async (req, res) => {
  try {
    let payload = req.body;
    if (typeof payload.listing === 'string') {
      try { payload.listing = JSON.parse(payload.listing); } catch (e) {}
    }
    const data = payload.listing || payload;

    let url = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
    let filename = 'default-listing';

    if (req.file) {
      let imgPath = req.file.path;
      filename = req.file.filename;
      url = (!imgPath.startsWith('http://') && !imgPath.startsWith('https://')) ? `/uploads/${filename}` : imgPath;
    } else if (data.image && data.image.url) {
      url = data.image.url;
      filename = data.image.filename || 'custom-image';
    }

    const listingData = {
      title: data.title,
      description: data.description || '',
      price: Number(data.price) || 0,
      location: data.location || '',
      country: data.country || 'India',
      roomType: data.roomType || 'single',
      furnished: data.furnished || 'furnished',
      genderPreference: data.genderPreference || 'any',
      preferredTenants: data.preferredTenants || 'any',
      securityDeposit: Math.max(0, Number(data.securityDeposit) || 0),
      minStayMonths: Math.max(1, Number(data.minStayMonths) || 1),
      immediateAvailability: data.immediateAvailability === true || data.immediateAvailability === 'true' || data.immediateAvailability === 'on',
      availableFrom: data.availableFrom ? new Date(data.availableFrom) : new Date(),
      image: { url, filename },
      owner: req.user._id,
      amenities: {
        attachedBathroom: Boolean(data.amenities?.attachedBathroom),
        kitchenAccess: data.amenities?.kitchenAccess !== false,
        wifi: Boolean(data.amenities?.wifi),
        ac: Boolean(data.amenities?.ac),
        laundry: Boolean(data.amenities?.laundry),
        parking: Boolean(data.amenities?.parking)
      },
      rules: {
        smoking: Boolean(data.rules?.smoking),
        pets: Boolean(data.rules?.pets),
        guests: data.rules?.guests !== false,
        curfew: Boolean(data.rules?.curfew),
        curfewDetails: data.rules?.curfewDetails || ''
      },
      bills: {
        included: Boolean(data.bills?.included),
        details: data.bills?.details || ''
      }
    };

    const newListing = new Listing(listingData);
    await newListing.save();

    const populatedListing = await Listing.findById(newListing._id).populate('owner', 'username email image');
    return res.status(201).json({
      success: true,
      message: 'Listing created successfully!',
      listing: populatedListing
    });
  } catch (err) {
    console.error('[API-LISTINGS] Create error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Failed to create listing' });
  }
}));

// 4. PUT /api/listings/:id - Update listing
router.put('/:id', requireAuth, requireOwner, upload.single('image'), wrapAsync(async (req, res) => {
  try {
    const { id } = req.params;
    let payload = req.body;
    if (typeof payload.listing === 'string') {
      try { payload.listing = JSON.parse(payload.listing); } catch (e) {}
    }
    const data = payload.listing || payload;

    const updateData = {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: Number(data.price) }),
      ...(data.location && { location: data.location }),
      ...(data.country && { country: data.country }),
      ...(data.roomType && { roomType: data.roomType }),
      ...(data.furnished && { furnished: data.furnished }),
      ...(data.genderPreference && { genderPreference: data.genderPreference }),
      ...(data.preferredTenants && { preferredTenants: data.preferredTenants }),
      ...(data.securityDeposit !== undefined && { securityDeposit: Math.max(0, Number(data.securityDeposit)) }),
      ...(data.minStayMonths !== undefined && { minStayMonths: Math.max(1, Number(data.minStayMonths)) }),
      ...(data.immediateAvailability !== undefined && { 
        immediateAvailability: data.immediateAvailability === true || data.immediateAvailability === 'true' || data.immediateAvailability === 'on' 
      }),
      ...(data.availableFrom && { availableFrom: new Date(data.availableFrom) })
    };

    if (data.amenities) {
      updateData.amenities = {
        attachedBathroom: Boolean(data.amenities.attachedBathroom),
        kitchenAccess: data.amenities.kitchenAccess !== false,
        wifi: Boolean(data.amenities.wifi),
        ac: Boolean(data.amenities.ac),
        laundry: Boolean(data.amenities.laundry),
        parking: Boolean(data.amenities.parking)
      };
    }

    if (data.rules) {
      updateData.rules = {
        smoking: Boolean(data.rules.smoking),
        pets: Boolean(data.rules.pets),
        guests: data.rules.guests !== false,
        curfew: Boolean(data.rules.curfew),
        curfewDetails: data.rules.curfewDetails || ''
      };
    }

    if (data.bills) {
      updateData.bills = {
        included: Boolean(data.bills.included),
        details: data.bills.details || ''
      };
    }

    if (req.file) {
      let imgPath = req.file.path;
      let filename = req.file.filename;
      let url = (!imgPath.startsWith('http://') && !imgPath.startsWith('https://')) ? `/uploads/${filename}` : imgPath;
      updateData.image = { url, filename };
    } else if (data.image && data.image.url) {
      updateData.image = data.image;
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('owner', 'username email image')
      .populate({
        path: 'reviews',
        populate: { path: 'author', select: 'username image' }
      });

    return res.status(200).json({
      success: true,
      message: 'Listing updated successfully!',
      listing: updatedListing
    });
  } catch (err) {
    console.error('[API-LISTINGS] Update error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Failed to update listing' });
  }
}));

// 5. DELETE /api/listings/:id - Delete listing
router.delete('/:id', requireAuth, requireOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);
  // Also clean up from any user favorites
  await User.updateMany(
    { favorites: id },
    { $pull: { favorites: id } }
  );

  return res.status(200).json({
    success: true,
    message: 'Listing deleted successfully!'
  });
}));

module.exports = router;

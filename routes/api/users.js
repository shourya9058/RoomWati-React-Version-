const express = require('express');
const router = express.Router();
const User = require('../../models/user.js');
const Listing = require('../../models/listing.js');
const wrapAsync = require('../../utils/wrapAsync.js');
const multer = require('multer');
const { storage } = require('../../cloudConfig.js');
const upload = multer({ storage });

// Middleware: Require Login
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: 'Please login to continue' });
  }
  next();
};

// 1. GET /api/users/profile - Get profile data, user's listings, favorites and calculated stats
router.get('/profile', requireAuth, wrapAsync(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select('-hash -salt').populate('favorites');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Get listings created by user
  const userListings = await Listing.find({ owner: userId })
    .populate({
      path: 'reviews',
      populate: { path: 'author', select: 'username image' }
    })
    .sort({ _id: -1 });

  // Get favorite listings
  const favoriteIds = user.favorites ? user.favorites.map(f => (f._id ? f._id : f)) : [];
  const favoriteListings = await Listing.find({ _id: { $in: favoriteIds } })
    .populate('owner', 'username email image')
    .populate('reviews')
    .sort({ _id: -1 });

  // Compute stats
  let totalViews = 0;
  let totalFavorites = 0;
  userListings.forEach(l => {
    totalViews += Math.max(0, l.viewCount || 0);
    totalFavorites += Math.max(0, l.favoriteCount || 0);
  });

  const stats = {
    totalViews,
    totalFavorites,
    totalListings: userListings.length,
    totalFavorited: favoriteIds.length
  };

  // Get user reviews
  const Review = require('../../models/review.js');
  const userReviews = await Review.find({ author: userId }).sort({ createdAt: -1 });
  const receivedReviews = [];
  userListings.forEach(l => {
    (l.reviews || []).forEach(r => {
      receivedReviews.push({
        ...(r.toObject ? r.toObject() : r),
        listingTitle: l.title,
        listingId: l._id
      });
    });
  });

  return res.status(200).json({
    success: true,
    user: {
      id: user._id,
      _id: user._id,
      username: user.username,
      name: user.name || user.username,
      email: user.email,
      bio: user.bio || "",
      location: user.location || "",
      interests: Array.isArray(user.interests) ? user.interests : [],
      image: user.image,
      coverImage: user.coverImage,
      favorites: user.favorites
    },
    userListings: userListings.map(l => {
      const obj = l.toObject({ virtuals: true });
      obj.isFavorite = favoriteIds.some(favId => favId.toString() === l._id.toString());
      return obj;
    }),
    favoriteListings: favoriteListings.map(l => {
      const obj = l.toObject({ virtuals: true });
      obj.isFavorite = true;
      return obj;
    }),
    userReviews,
    receivedReviews,
    stats
  });
}));

// 2. PUT /api/users/profile - Update profile details and avatars
router.put('/profile', requireAuth, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), wrapAsync(async (req, res) => {
  const userId = req.user._id;
  const { username, name, email, bio, location, interests } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (username && username.trim()) user.username = username.trim();
  if (name !== undefined) user.name = name.trim();
  if (email && email.trim()) user.email = email.trim().toLowerCase();
  if (bio !== undefined) user.bio = bio.trim();
  if (location !== undefined) user.location = location.trim();
  if (interests !== undefined) {
    user.interests = Array.isArray(interests)
      ? interests
      : typeof interests === 'string'
      ? interests.split(',').map(s => s.trim()).filter(Boolean)
      : user.interests;
  }

  if (req.files) {
    if (req.files.profileImage && req.files.profileImage[0]) {
      const file = req.files.profileImage[0];
      let url = file.path;
      const filename = file.filename;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `/uploads/${filename}`;
      }
      user.image = { url, filename };
    }
    if (req.files.coverImage && req.files.coverImage[0]) {
      const file = req.files.coverImage[0];
      let url = file.path;
      const filename = file.filename;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `/uploads/${filename}`;
      }
      user.coverImage = { url, filename };
    }
  }

  // Also support direct string URLs if provided via JSON
  if (req.body.imageUrl) {
    user.image = { url: req.body.imageUrl, filename: 'custom-avatar' };
  }
  if (req.body.coverImageUrl) {
    user.coverImage = { url: req.body.coverImageUrl, filename: 'custom-cover' };
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully!',
    user: {
      id: user._id,
      _id: user._id,
      username: user.username,
      name: user.name || user.username,
      email: user.email,
      bio: user.bio,
      location: user.location || "Bengaluru, Karnataka",
      interests: user.interests,
      image: user.image,
      coverImage: user.coverImage,
      favorites: user.favorites
    }
  });
}));

// 3. POST /api/users/toggle-favorite/:listingId - Toggle favorite listing
router.post('/toggle-favorite/:listingId', requireAuth, wrapAsync(async (req, res) => {
  const { listingId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (!user.favorites) {
    user.favorites = [];
  }

  const favoriteIndex = user.favorites.findIndex(id => id.toString() === listingId.toString());
  let result;

  if (favoriteIndex === -1) {
    // Add to favorites
    user.favorites.push(listingId);
    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      {
        $inc: { favoriteCount: 1 },
        $addToSet: { favoritedBy: userId }
      },
      { new: true }
    );
    result = {
      success: true,
      status: 'added',
      isFavorite: true,
      message: 'Added to favorites',
      favoriteCount: updatedListing ? Math.max(0, updatedListing.favoriteCount || 0) : 1
    };
  } else {
    // Remove from favorites
    user.favorites.splice(favoriteIndex, 1);
    const listing = await Listing.findById(listingId);
    const currentCount = listing ? (listing.favoriteCount || 0) : 0;
    const newFavoriteCount = Math.max(0, currentCount - 1);
    const currentFavoritedBy = (listing && listing.favoritedBy) ? listing.favoritedBy : [];

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      {
        $set: {
          favoriteCount: newFavoriteCount,
          favoritedBy: currentFavoritedBy.filter(id => id && id.toString() !== userId.toString())
        }
      },
      { new: true }
    );

    result = {
      success: true,
      status: 'removed',
      isFavorite: false,
      message: 'Removed from favorites',
      favoriteCount: updatedListing ? Math.max(0, updatedListing.favoriteCount || 0) : 0
    };
  }

  await User.findByIdAndUpdate(userId, { favorites: user.favorites });
  if (req.user) {
    req.user.favorites = user.favorites;
  }

  return res.status(200).json({
    ...result,
    favorites: user.favorites
  });
}));

// 4. GET /api/users/favorites - List all favorites
router.get('/favorites', requireAuth, wrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('favorites');
  const favoriteIds = (user && user.favorites) ? user.favorites : [];

  const listings = await Listing.find({ _id: { $in: favoriteIds } })
    .populate('owner', 'username email image')
    .populate('reviews')
    .sort({ _id: -1 });

  const processedListings = listings.map(l => {
    const obj = l.toObject({ virtuals: true });
    obj.isFavorite = true;
    return obj;
  });

  return res.status(200).json({
    success: true,
    count: processedListings.length,
    listings: processedListings
  });
}));

module.exports = router;

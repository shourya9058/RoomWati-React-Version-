const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../../models/listing.js');
const Review = require('../../models/review.js');
const wrapAsync = require('../../utils/wrapAsync.js');

// Middleware: Require Login
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: 'Please login to submit a review' });
  }
  next();
};

// 1. POST /api/listings/:id/reviews - Create review
router.post('/', requireAuth, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body.review || req.body;

  if (!rating || !comment) {
    return res.status(400).json({ success: false, message: 'Rating and comment are required' });
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  const newReview = new Review({
    rating: numRating,
    comment: comment.trim(),
    author: req.user._id
  });

  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();

  const populatedReview = await Review.findById(newReview._id).populate('author', 'username email image');

  return res.status(201).json({
    success: true,
    message: 'Review added successfully!',
    review: populatedReview
  });
}));

// 2. DELETE /api/listings/:id/reviews/:reviewId - Delete review
router.delete('/:reviewId', requireAuth, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (!review.author.equals(req.user._id)) {
    return res.status(403).json({ success: false, message: 'You can only delete your own reviews' });
  }

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  return res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
}));

module.exports = router;

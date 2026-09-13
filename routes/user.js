const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

//signup
router.route("/signup")
  .get(userController.renderSignupform)
  .post(wrapAsync(userController.signup));

// Login routes
router.get('/login', userController.renderLoginform);

// Handle login form submission (supporting username OR email, JSON fetch and form post)
router.post('/login', saveRedirectUrl, wrapAsync(async (req, res, next) => {
    const identifier = (req.body.username || req.body.email || '').trim();
    const password = req.body.password;
    const isJson = req.xhr || req.headers['content-type']?.includes('application/json') || req.headers.accept?.includes('application/json');

    console.log(`[LOGIN] Attempt with identifier: '${identifier}', isJson: ${Boolean(isJson)}`);

    if (!identifier || !password) {
        if (isJson) {
            return res.status(400).json({ success: false, message: 'Please provide both username/email and password' });
        }
        req.flash('error', 'Please provide both username/email and password');
        return res.redirect('/login');
    }

    try {
        // Find user by either username or email (case-insensitive)
        const user = await User.findOne({
            $or: [
                { username: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                { email: identifier.toLowerCase() }
            ]
        });

        if (!user) {
            console.log(`[LOGIN] User not found for: '${identifier}'`);
            if (isJson) {
                return res.status(401).json({ success: false, message: 'Invalid username/email or password' });
            }
            req.flash('error', 'Invalid username/email or password');
            return res.redirect('/login');
        }

        // Authenticate with passport-local-mongoose
        const { user: authenticatedUser, error } = await user.authenticate(password);
        if (error || !authenticatedUser) {
            console.log(`[LOGIN] Password mismatch for user: '${user.username}'`);
            if (isJson) {
                return res.status(401).json({ success: false, message: 'Invalid username/email or password' });
            }
            req.flash('error', 'Invalid username/email or password');
            return res.redirect('/login');
        }

        // Log the user into session
        req.login(authenticatedUser, (err) => {
            if (err) {
                console.error('[LOGIN] Session login error:', err);
                if (isJson) {
                    return res.status(500).json({ success: false, message: 'Login failed due to a server error' });
                }
                return next(err);
            }

            let redirectUrl = res.locals.returnTo || req.session.returnTo || '/listings';
            if (!redirectUrl || redirectUrl.includes('toggle-favorite') || redirectUrl.includes('verify') || redirectUrl === '/login' || redirectUrl === '/signup' || redirectUrl.includes('auth')) {
                redirectUrl = '/listings';
            }
            delete req.session.returnTo;
            req.flash('success', `Welcome back, @${authenticatedUser.username}!`);

            if (isJson) {
                return res.status(200).json({ success: true, message: 'Login successful', redirectUrl });
            }
            return res.redirect(redirectUrl);
        });
    } catch (err) {
        console.error('[LOGIN] Error during authentication:', err);
        if (isJson) {
            return res.status(500).json({ success: false, message: 'Internal server error during login' });
        }
        req.flash('error', 'An error occurred during login. Please try again.');
        return res.redirect('/login');
    }
}));

//logout
router.get("/logout", userController.logout);

// Toggle favorite listing
router.post("/toggle-favorite/:listingId", isLoggedIn, wrapAsync(async (req, res) => {
    const { listingId } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
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
                status: "added", 
                message: "Added to favorites",
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
                status: "removed", 
                message: "Removed from favorites",
                favoriteCount: updatedListing ? Math.max(0, updatedListing.favoriteCount || 0) : 0
            };
        }

        await User.findByIdAndUpdate(userId, { favorites: user.favorites });
        if (req.user) {
            req.user.favorites = user.favorites;
        }

        console.log(`[FAVORITE] User ${userId} ${result.status} listing ${listingId}. New count: ${result.favoriteCount}`);
        res.json(result);
    } catch (error) {
        console.error("Error in toggle-favorite:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
}));

// Profile route
router.get("/profile", wrapAsync(async (req, res) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be logged in to view your profile");
        return res.redirect("/login");
    }

    // Get user with populated favorites
    const user = await User.findById(req.user._id).populate('favorites');
    
    // Get user's listings with view and favorite counts, and populate reviews
    const userListings = await Listing.find({ owner: req.user._id })
        .populate('reviews');
    
    // Ensure counts are not negative and calculate totals
    const stats = {
        totalViews: 0,
        totalFavorites: 0,
        totalListings: userListings.length,
        totalFavorited: user.favorites ? user.favorites.length : 0
    };
    
    // Update each listing to ensure counts are not negative
    for (let i = 0; i < userListings.length; i++) {
        const listing = userListings[i];
        
        // Ensure counts are not negative
        if (listing.viewCount < 0) {
            listing.viewCount = 0;
            await listing.save();
        }
        if (listing.favoriteCount < 0) {
            listing.favoriteCount = 0;
            await listing.save();
        }
        
        // Update totals with ensured non-negative values
        stats.totalViews += listing.viewCount || 0;
        stats.totalFavorites += listing.favoriteCount || 0;
    }

    // Get favorite listings with populated data
    const favoriteListings = await Listing.find({ _id: { $in: user.favorites || [] }})
        .populate('owner', 'username image')
        .populate('reviews');

    res.render("users/profile.ejs", { 
        user,
        userListings,
        favoriteListings,
        stats
    });
}));

// Edit Profile Form Route
router.get("/profile/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render("users/edit.ejs", { user });
}));

// Update Profile Route
router.put("/profile", isLoggedIn, upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), wrapAsync(async (req, res) => {
    const { username, email, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;

    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
        let imgPath = req.files.profileImage[0].path;
        let filename = req.files.profileImage[0].filename;
        let url = (!imgPath.startsWith('http://') && !imgPath.startsWith('https://')) ? `/uploads/${filename}` : imgPath;
        user.image = { url, filename };
    }

    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
        let coverPath = req.files.coverImage[0].path;
        let filename = req.files.coverImage[0].filename;
        let url = (!coverPath.startsWith('http://') && !coverPath.startsWith('https://')) ? `/uploads/${filename}` : coverPath;
        user.coverImage = { url, filename };
    }

    await user.save();
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
}));

module.exports = router;
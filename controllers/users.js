const User = require("../models/user.js");

module.exports.renderSignupform = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.renderLoginform = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, name, email, password, bio, location, interests, image } = req.body;
        const DEFAULT_PROFILE_IMAGE = {
            url: "https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
            filename: "default-avatar"
        };
        const parsedInterests = Array.isArray(interests) 
            ? interests 
            : typeof interests === 'string' && interests.trim() 
            ? interests.split(',').map(s => s.trim()).filter(Boolean) 
            : [];

        const userData = { 
            email, 
            username,
            name: (name && name.trim()) ? name.trim() : username,
            bio: (bio && bio.trim()) ? bio.trim() : "",
            location: (location && location.trim()) ? location.trim() : "",
            interests: parsedInterests,
            image: image || DEFAULT_PROFILE_IMAGE
        };

        const newUser = new User(userData);
        const registeredUser = await User.register(newUser, password);
        console.log("Registered new user:", registeredUser.username);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", `Welcome to RoomWati, @${registeredUser.username}!`);
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.login = (req, res) => {
    if (req.query.otp === 'true' && req.query.email) {
        return res.redirect(`/verify-otp?email=${encodeURIComponent(req.query.email)}`);
    }
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    console.log('Login successful, redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "You have been successfully logged out!");
        res.redirect("/listings");
    });
};
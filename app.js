if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const connectMongo = require("connect-mongo");
const MongoStore = connectMongo.default || connectMongo.MongoStore || connectMongo;

const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const initData = require("./init/data.js");
const cors = require("cors");

const isProduction = process.env.NODE_ENV === "production";

// Trust first proxy when running behind Nginx / AWS in production
if (isProduction) {
    app.set('trust proxy', 1);
}

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const authRouter = require("./routes/auth.js");

// API Routers for Modern React Frontend
const apiAuthRouter = require("./routes/api/auth.js");
const apiListingRouter = require("./routes/api/listings.js");
const apiReviewRouter = require("./routes/api/reviews.js");
const apiUserRouter = require("./routes/api/users.js");
const apiChatRouter = require("./routes/api/chats.js");
const apiVisitRouter = require("./routes/api/visits.js");

const port = process.env.PORT || 8080;
const dbUrl = process.env.ATLASDB_URL || process.env.MONGO_URL;

let mongoServer;

async function connectDB() {
    if (dbUrl) {
        try {
            console.log("Attempting connection to configured MongoDB...");
            await mongoose.connect(dbUrl);
            console.log("✅ Connected to MongoDB Atlas/External DB successfully!");
            return;
        } catch (err) {
            console.warn("⚠️ Configured MongoDB Atlas connection failed:", err.message);
            console.log("🔄 Starting local in-memory MongoDB fallback for development...");
        }
    } else {
        console.log("ℹ️ No ATLASDB_URL provided. Starting in-memory MongoDB for local development...");
    }

    try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log("✅ In-memory MongoDB started and connected successfully!");

        // Auto seed default data into in-memory DB if empty
        const count = await Listing.countDocuments();
        if (count === 0) {
            console.log("🌱 Auto-seeding sample listings into local database...");
            let defaultUser = await User.findOne({ email: "team@roomwati.com" });
            if (!defaultUser) {
                const newUser = new User({
                    email: "team@roomwati.com",
                    username: "Team Roomwati",
                    name: "Team Roomwati",
                    bio: "",
                    location: "",
                    interests: [],
                    image: {
                        url: "https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
                        filename: "default-avatar"
                    },
                    coverImage: {
                        url: "",
                        filename: "default-cover"
                    }
                });
                defaultUser = await User.register(newUser, "roomwati123");
            }
            const listings = initData.data.map((obj) => ({
                ...obj,
                owner: defaultUser._id
            }));
            await Listing.insertMany(listings);
            console.log(`✅ Auto-seeded ${listings.length} listings into local database.`);
        }
    } catch (err) {
        console.error("❌ Failed to start in-memory database fallback:", err);
    }
}

connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// Dynamic allowed origins for development and production
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/$/, '')] : []),
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim().replace(/\/$/, '')).filter(Boolean) : [])
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/$/, '');

        // Match explicitly configured origins or wildcard
        if (allowedOrigins.indexOf(normalizedOrigin) !== -1 || allowedOrigins.includes('*')) {
            return callback(null, true);
        }

        // Automatically match Vercel production & preview domains (*.vercel.app)
        try {
            const host = new URL(origin).hostname;
            if (host === 'vercel.app' || host.endsWith('.vercel.app')) {
                return callback(null, true);
            }
        } catch (_) {}

        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store = dbUrl ? MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET || 'roomwati_default_secret_key_987654321'
    },
    touchAfter: 24 * 3600
}) : undefined;

if (store) {
    store.on("error", (err) => {
        console.error("❌ ERROR in MONGO SESSION STORE:", err);
    });
}

const sessionOptions = {
    ...(store ? { store } : {}),
    secret: process.env.SECRET || 'roomwati_default_secret_key_987654321',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Expose current user & flash messages to all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    res.locals.currUser = req.user || null;
    res.locals.success = req.flash('success') || [];
    res.locals.error = req.flash('error') || [];
    
    if (req.session.welcomeMessage && req.session.welcomeMessageShown === false) {
        res.locals.welcomeMessage = req.session.welcomeMessage;
        res.locals.showWelcomeMessage = true;
        req.session.welcomeMessageShown = true;
        setTimeout(() => {
            delete req.session.welcomeMessage;
            delete req.session.welcomeMessageShown;
        }, 100);
    }
    next();
});

// Mount API routes for Modern React Frontend
app.use("/api/auth", apiAuthRouter);
app.use("/api/listings", apiListingRouter);
app.use("/api/listings/:id/reviews", apiReviewRouter);
app.use("/api/users", apiUserRouter);
app.use("/api/chats", apiChatRouter);
app.use("/api/visits", apiVisitRouter);

// Root route
app.get("/", (req, res) => {
    res.redirect("/listings/home");
});

// Mount legacy EJS routes (preserved for safety & backwards compatibility)
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/auth", authRouter);
app.use("/", userRouter);

// OTP Verification Page
app.get("/verify-otp", (req, res) => {
    const { email, reset } = req.query;
    if (!email) {
        req.flash("error", "Email is required for OTP verification");
        return res.redirect("/login");
    }
    res.render("users/verify-otp", { email, isPasswordReset: reset === "true" });
});

// Forgot Password Page
app.get("/forgot-password", (req, res) => {
    res.render("users/forgot-password");
});

// Reset Password Page
app.get("/reset-password", (req, res) => {
    const { token } = req.query;
    if (!token) {
        req.flash("error", "Invalid or expired reset link");
        return res.redirect("/forgot-password");
    }
    res.render("users/reset-password", { token });
});

// Create "Team Roomwati" user route
app.get("/create-roomwati-user", async (req, res) => {
    try {
        let existing = await User.findOne({ email: "team@roomwati.com" });
        if (existing) {
            return res.send(`✅ 'Team Roomwati' user already exists with ID: ${existing._id}`);
        }
        const newUser = new User({
            email: "team@roomwati.com",
            username: "Team Roomwati",
            bio: "We're the RoomWati team, powering seamless stays and unique spaces.",
            image: {
                url: "https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
                filename: "default-avatar"
            },
            coverImage: {
                url: "https://res.cloudinary.com/dxqjlxgsh/image/upload/v1703420360/RoomWati/default-cover_kxn8dr.jpg",
                filename: "default-cover"
            }
        });

        const registeredUser = await User.register(newUser, "roomwati123");
        res.send(`✅ Created user 'Team Roomwati' with ID: ${registeredUser._id}`);
    } catch (err) {
        console.error("❌ Error creating Team Roomwati user:", err);
        res.status(500).send("❌ Could not create Team Roomwati user.");
    }
});

// Seed route
app.get("/seed", async (req, res) => {
    try {
        let defaultUser = await User.findOne({ email: "team@roomwati.com" });
        if (!defaultUser) {
            const newUser = new User({
                email: "team@roomwati.com",
                username: "Team Roomwati",
                bio: "We're the RoomWati team, powering seamless stays and unique spaces.",
                image: {
                    url: "https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png",
                    filename: "default-avatar"
                },
                coverImage: {
                    url: "https://res.cloudinary.com/dxqjlxgsh/image/upload/v1703420360/RoomWati/default-cover_kxn8dr.jpg",
                    filename: "default-cover"
                }
            });
            defaultUser = await User.register(newUser, "roomwati123");
        }

        await Listing.deleteMany({});
        const listings = initData.data.map((obj) => ({
            ...obj,
            owner: defaultUser._id
        }));

        await Listing.insertMany(listings);
        res.send(`✅ Database seeded with ${listings.length} sample listings under owner ${defaultUser.username} (${defaultUser._id}).`);
    } catch (err) {
        console.error("❌ Error seeding database:", err);
        res.status(500).send("❌ Seeding failed.");
    }
});

// Delete seeded listings
app.get("/delete-seed", async (req, res) => {
    try {
        await Listing.deleteMany({});
        res.send("🗑️ All seeded listings deleted.");
    } catch (err) {
        console.error("❌ Error deleting listings:", err);
        res.status(500).send("❌ Failed to delete listings.");
    }
});

// Serve built React client assets if available
const fs = require("fs");
const clientDistPath = path.join(__dirname, "client", "dist");
if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get("*", (req, res, next) => {
        // Do not intercept API routes or EJS routes that need to render
        if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/uploads")) {
            return next();
        }
        if (req.accepts("html")) {
            return res.sendFile(path.join(clientDistPath, "index.html"));
        }
        next();
    });
}

// Handle 404 errors
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Middleware to handle server side errors
app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong!' } = err;
    if (req.xhr || req.headers['content-type']?.includes('application/json') || req.headers.accept?.includes('application/json')) {
        return res.status(statusCode).json({ success: false, message });
    }
    res.status(statusCode).render("error.ejs", { message });
});

const server = app.listen(port, () => {
    console.log(`🚀 RoomWati server listening at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    if (mongoServer) {
        await mongoServer.stop();
    }
    server.close(() => {
        process.exit(0);
    });
});
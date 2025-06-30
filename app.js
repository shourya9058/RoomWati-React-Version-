if(process.env.NODE_ENV != "production"){ //production env mein yeh wala data koi access na kr paaye isiliye (aage ka kaam h)
    require('dotenv').config();
}
// console.log(process.env.SECRET); .env ka data access krne ka tareeka
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); //views se ejs pages render krwane k liye
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //basically bhut saare templates/layouts create krne mein help krte h jo hrr page mein same rehte h like navBar ya footer
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const authRouter = require("./routes/auth.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const emailjs = require('emailjs-com');

// Initialize EmailJS
emailjs.init(process.env.EMAILJS_PUBLIC_KEY);



port = 8080;

let mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("DB working fine")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //Date.now() miliseconds mein time deta h isiliye humne next seven days ko miliseconds mein convert krke add kra so that cookie agle 7 din tk saved rahe
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //security k liye use krte h basically
    }
};


app.use(session(sessionOptions));
app.use(flash()); //hamesha routes se pehle likhna h yeh (except root).

// session k baad hi passport ko use krna h.
app.use(passport.initialize());
app.use(passport.session()); //A web application needs the ability to identify users as they browse from page to page. This series of requests and responses, each associated with the same user, is known as a session.
//This middleware enables us to keep the user logged in for a single session instead of requiring the user to login again and again.

passport.use(new LocalStrategy(User.authenticate())); //user ko authenticate krwaega through LocalStrategy using the authenticate function.

passport.serializeUser(User.serializeUser()); //user se related info store krana in a session
passport.deserializeUser(User.deserializeUser());//user se related info remove krana in a session (session khtm hone p)

// middle to pass listing to all routes so that navbar can access it and add user image
app.use(async (req, res, next) => {
    if (req.user) {
      // If user is logged in (through passport)
      res.locals.currentUser = req.user;
      // You don't need to use listing.owner, just use currentUser directly
    } else {
      res.locals.currentUser = null;
    }
    next();
  });


// Flash messages middleware - must be after session and before routes
app.use((req, res, next) => {
    // Initialize flash messages
    res.locals.success = [];
    res.locals.error = [];
    
    // Handle welcome message from session (one-time use)
    if (req.session.welcomeMessage && req.session.welcomeMessageShown === false) {
        res.locals.welcomeMessage = req.session.welcomeMessage;
        res.locals.showWelcomeMessage = true;
        req.session.welcomeMessageShown = true; // Mark as shown
        
        // Clear after first use
        setTimeout(() => {
            delete req.session.welcomeMessage;
            delete req.session.welcomeMessageShown;
        }, 100);
    }
    
    // Regular flash messages
    const successMsgs = req.flash('success');
    const errorMsgs = req.flash('error');
    
    if (successMsgs && successMsgs.length) {
        res.locals.success = Array.isArray(successMsgs) ? successMsgs : [successMsgs];
    }
    
    if (errorMsgs && errorMsgs.length) {
        res.locals.error = Array.isArray(errorMsgs) ? errorMsgs : [errorMsgs];
    }
    
    res.locals.currUser = req.user;
    next();
});


//Demo user for testing passport

// app.get("/demoUser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "shourya@gmail.com",
//         username: "singh07",
//     });

//    let registeredUser =  await User.register(fakeUser, "helloWorld"); //user ko register(with the password i.e., helloWorld) bhi krwaega plus ye bhi check krega ki kya wo user unique h ya nhi
//    res.send(registeredUser);
// })







// Model: Listing -> Places (apartment, villas, flat, house, etc)
// --> title - String
// --> description - String
// --> image (url, for beginner level) - String
// --> price - Number
// --> location - String
// --> country - String

// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.get("/", (req, res) => {
    res.redirect("/listings/home");
});

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Mount all user routes first
app.use(userRouter);

// Mount other routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("", userRouter);
app.use("/auth", authRouter);

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

// Handle 404 errors
app.all("*",(req,res,next)=>{ //agr upr kisi bhi listing se match nhi hua toh yha hoga (jo create hi nhi kiye unhe access krte time yeh kaam krega)
    next(new ExpressError(404,"Page not found!"));
})

// middleware to handle server side errors
app.use((err,req,res,next)=>{
    //res.send("Something went wrong!"); //normal way
    let {statusCode=500, message='Something went wrong!'} = err;
    // res.status(statusCode).send(message);  //using ExpressError class (custom error)

    res.status(statusCode).render("error.ejs", {message});
});



app.listen(port, ()=>{
    console.log(`Listening at port:  ${port}`);
});

//Express router basically whi h jo humne rotes folder bnake sb rotes ko unki functionality k basis p alg alg krke firr export krake use kiya,basically fucntionality yeh kuch add nhi krte but yeh code ko readable jarur bna dete h
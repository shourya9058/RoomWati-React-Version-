const express = require('express');
const router = express.Router();
const User = require('../../models/user.js');
const wrapAsync = require('../../utils/wrapAsync.js');
const { OTP_PURPOSES, normalizePurpose } = require('../../services/email/emailTypes.js');
const { sendOtpEmail } = require('../../services/email/emailService.js');
const {
  createOTP,
  verifyOTP,
  createResetToken,
  consumeResetToken,
  normalizeEmail,
} = require('../../services/otp/otpService.js');

// 1. Get Current Authenticated User
router.get('/current-user', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    const userObj = req.user.toObject ? req.user.toObject() : { ...req.user };
    delete userObj.salt;
    delete userObj.hash;
    return res.json({ success: true, isAuthenticated: true, user: userObj });
  }
  return res.json({ success: true, isAuthenticated: false, user: null });
});

// 2. Signup (Step 1: Create unverified account & send verification OTP)
router.post('/signup', wrapAsync(async (req, res) => {
  const { username, name, email, password, bio, location, interests, image } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Username, email, and password are required' });
  }

  const normEmail = normalizeEmail(email);
  const trimmedUsername = username.trim();

  // Check if active verified user already exists
  const existingEmailUser = await User.findOne({ email: normEmail });
  if (existingEmailUser) {
    if (existingEmailUser.emailVerified) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please log in.' });
    }
    // If account exists but was never verified, update details and allow re-verification
    await existingEmailUser.setPassword(password);
    existingEmailUser.username = trimmedUsername;
    existingEmailUser.name = (name && name.trim()) || trimmedUsername;
    existingEmailUser.bio = (bio && bio.trim()) || '';
    existingEmailUser.location = (location && location.trim()) || '';
    existingEmailUser.interests = Array.isArray(interests) ? interests : [];
    if (image) existingEmailUser.image = image;
    await existingEmailUser.save();
  } else {
    // Check username collision
    const existingUsername = await User.findOne({
      username: new RegExp(`^${trimmedUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
    });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'This username is already taken. Please choose another.' });
    }

    const DEFAULT_PROFILE_IMAGE = {
      url: 'https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png',
      filename: 'default-avatar',
    };

    const DEFAULT_COVER_IMAGE = {
      url: '/images/default-cover.png',
      filename: 'default-cover',
    };

    const parsedInterests = Array.isArray(interests)
      ? interests
      : typeof interests === 'string' && interests.trim()
      ? interests.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const newUser = new User({
      username: trimmedUsername,
      name: (name && name.trim()) ? name.trim() : trimmedUsername,
      email: normEmail,
      bio: (bio && bio.trim()) ? bio.trim() : '',
      location: (location && location.trim()) ? location.trim() : '',
      interests: parsedInterests,
      image: image || DEFAULT_PROFILE_IMAGE,
      coverImage: DEFAULT_COVER_IMAGE,
      emailVerified: false, // Unverified until OTP confirmation
    });

    await User.register(newUser, password);
  }

  // Generate OTP for SIGNUP_VERIFICATION
  const { otp } = createOTP(normEmail, OTP_PURPOSES.SIGNUP_VERIFICATION, { username: trimmedUsername });

  // Send universal RoomWati email
  await sendOtpEmail({
    to: normEmail,
    to_name: (name && name.trim()) || trimmedUsername,
    otp,
    purpose: OTP_PURPOSES.SIGNUP_VERIFICATION,
  });

  return res.status(200).json({
    success: true,
    requiresVerification: true,
    email: normEmail,
    message: 'Verification code sent to your email. Please verify to activate your account.',
  });
}));

// 3. Verify Signup OTP (Step 2: Confirm OTP, mark verified, establish session)
router.post('/verify-signup-otp', wrapAsync(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and verification code are required' });
  }

  const normEmail = normalizeEmail(email);
  const result = verifyOTP(normEmail, otp, OTP_PURPOSES.SIGNUP_VERIFICATION);

  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.message });
  }

  const user = await User.findOne({ email: normEmail });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User account not found' });
  }

  // Mark account verified
  user.emailVerified = true;
  await user.save();

  // Establish Passport session
  req.login(user, (err) => {
    if (err) {
      console.error('[AUTH-API] Session creation error post-verification:', err);
      return res.status(500).json({ success: false, message: 'Account verified, but login session failed' });
    }
    const userObj = user.toObject();
    delete userObj.salt;
    delete userObj.hash;
    return res.status(200).json({
      success: true,
      message: `Welcome to RoomWati, @${user.username}! Your account is now verified.`,
      user: userObj,
    });
  });
}));

// 4. Password Login
router.post('/login', wrapAsync(async (req, res) => {
  const identifier = (req.body.identifier || req.body.username || req.body.email || '').trim();
  const password = req.body.password;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both username/email and password' });
  }

  const user = await User.findOne({
    $or: [
      { username: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      { email: identifier.toLowerCase() },
    ],
  });

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid username/email or password' });
  }

  const { user: authenticatedUser, error } = await user.authenticate(password);
  if (error || !authenticatedUser) {
    return res.status(401).json({ success: false, message: 'Invalid username/email or password' });
  }

  // If user signed up but never verified email, initiate verification
  if (authenticatedUser.emailVerified === false) {
    try {
      const { otp } = createOTP(authenticatedUser.email, OTP_PURPOSES.SIGNUP_VERIFICATION);
      await sendOtpEmail({
        to: authenticatedUser.email,
        to_name: authenticatedUser.name || authenticatedUser.username,
        otp,
        purpose: OTP_PURPOSES.SIGNUP_VERIFICATION,
      });
    } catch (e) {
      // Cooldown or error sending
    }
    return res.status(403).json({
      success: false,
      requiresVerification: true,
      email: authenticatedUser.email,
      message: 'Please verify your email address to complete your account setup.',
    });
  }

  req.login(authenticatedUser, (err) => {
    if (err) {
      console.error('[AUTH-API] Login session error:', err);
      return res.status(500).json({ success: false, message: 'Login failed due to a server error' });
    }
    const userObj = authenticatedUser.toObject();
    delete userObj.salt;
    delete userObj.hash;
    return res.json({ success: true, message: `Welcome back, @${authenticatedUser.username}!`, user: userObj });
  });
}));

// 5. Logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.json({ success: true, message: 'Successfully logged out' });
    });
  });
});

// 6. Send OTP for Login (Passwordless)
router.post('/login-with-otp', wrapAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }
  const normEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normEmail });
  if (!user) {
    return res.status(404).json({ success: false, message: 'No RoomWati account found with this email' });
  }

  // If user is unverified, send signup verification OTP instead
  const purpose = user.emailVerified === false ? OTP_PURPOSES.SIGNUP_VERIFICATION : OTP_PURPOSES.LOGIN;

  try {
    const { otp } = createOTP(normEmail, purpose);
    await sendOtpEmail({
      to: normEmail,
      to_name: user.name || user.username,
      otp,
      purpose,
    });
    return res.status(200).json({
      success: true,
      purpose,
      message: 'Verification code sent to your email',
      email: normEmail,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
}));

// 7. Verify Login OTP
router.post('/verify-login-otp', wrapAsync(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
  }

  const normEmail = normalizeEmail(email);
  const verification = verifyOTP(normEmail, otp, OTP_PURPOSES.LOGIN);
  if (!verification.valid) {
    return res.status(400).json({ success: false, message: verification.message });
  }

  const user = await User.findOne({ email: normEmail });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User account not found' });
  }

  if (!user.emailVerified) {
    user.emailVerified = true;
    await user.save();
  }

  req.login(user, (err) => {
    if (err) {
      console.error('[AUTH-API] OTP login session error:', err);
      return res.status(500).json({ success: false, message: 'Login session failed' });
    }
    const userObj = user.toObject();
    delete userObj.salt;
    delete userObj.hash;
    return res.json({ success: true, message: `Welcome back, @${user.username}!`, user: userObj });
  });
}));

// 8. Forgot Password (Send Reset OTP)
router.post('/forgot-password', wrapAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }
  const normEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normEmail });
  if (!user) {
    return res.status(404).json({ success: false, message: 'No account found with that email address' });
  }

  try {
    const { otp } = createOTP(normEmail, OTP_PURPOSES.PASSWORD_RESET);
    await sendOtpEmail({
      to: normEmail,
      to_name: user.name || user.username,
      otp,
      purpose: OTP_PURPOSES.PASSWORD_RESET,
    });
    return res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email',
      email: normEmail,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
}));

// 9. Verify Reset OTP (Issues temporary single-use resetToken, does NOT login)
router.post('/verify-reset-otp', wrapAsync(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
  }

  const normEmail = normalizeEmail(email);
  const verification = verifyOTP(normEmail, otp, OTP_PURPOSES.PASSWORD_RESET);
  if (!verification.valid) {
    return res.status(400).json({ success: false, message: verification.message });
  }

  const resetToken = createResetToken(normEmail);
  return res.json({ success: true, message: 'OTP verified successfully', resetToken });
}));

// 10. Reset Password (Consumes resetToken)
router.post('/reset-password', wrapAsync(async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  const targetEmail = consumeResetToken(token);
  if (!targetEmail) {
    return res.status(400).json({ success: false, message: 'Invalid or expired password reset session. Please request a new code.' });
  }

  const user = await User.findOne({ email: targetEmail });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await user.setPassword(newPassword);
  user.emailVerified = true;
  await user.save();

  return res.json({ success: true, message: 'Password reset successful. You can now log in with your new password.' });
}));

// 11. Resend OTP
router.post('/resend-otp', wrapAsync(async (req, res) => {
  const { email, purpose } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  const normEmail = normalizeEmail(email);
  const resolvedPurpose = normalizePurpose(purpose);

  const user = await User.findOne({ email: normEmail });
  const recipientName = user ? (user.name || user.username) : 'there';

  try {
    const { otp } = createOTP(normEmail, resolvedPurpose);
    await sendOtpEmail({
      to: normEmail,
      to_name: recipientName,
      otp,
      purpose: resolvedPurpose,
    });
    return res.status(200).json({
      success: true,
      message: 'A new verification code has been sent to your email.',
      email: normEmail,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
}));

module.exports = router;

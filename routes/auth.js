const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const { OTP_PURPOSES, normalizePurpose } = require('../services/email/emailTypes.js');
const { sendOtpEmail } = require('../services/email/emailService.js');
const {
  createOTP,
  verifyOTP,
  createResetToken,
  consumeResetToken,
  normalizeEmail,
} = require('../services/otp/otpService.js');

// Send OTP helper for SSR routes
async function sendOTP(email, res, rawPurpose = 'login') {
  const normEmail = normalizeEmail(email);
  const purpose = normalizePurpose(rawPurpose);

  try {
    const user = await User.findOne({ email: normEmail });
    const recipientName = user ? (user.name || user.username) : 'there';
    const { otp } = createOTP(normEmail, purpose);

    await sendOtpEmail({
      to: normEmail,
      to_name: recipientName,
      otp,
      purpose,
    });

    return res.status(200).json({ success: true, message: 'OTP sent successfully', email: normEmail });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
}

// Forgot Password - Send OTP
router.post('/forgot-password', wrapAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const normEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normEmail });
  if (!user) {
    return res.status(404).json({ success: false, message: 'No account found with this email' });
  }

  return await sendOTP(normEmail, res, OTP_PURPOSES.PASSWORD_RESET);
}));

// Verify OTP and generate reset token
router.post('/verify-reset-otp', wrapAsync(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const normEmail = normalizeEmail(email);
  const result = verifyOTP(normEmail, otp, OTP_PURPOSES.PASSWORD_RESET);
  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.message });
  }

  const resetToken = createResetToken(normEmail);

  res.json({
    success: true,
    message: 'OTP verified successfully',
    resetToken,
  });
}));

// Reset password with token
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
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }

  const user = await User.findOne({ email: targetEmail });
  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  await user.setPassword(newPassword);
  user.emailVerified = true;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful. You can now login with your new password.',
    redirectTo: '/login',
  });
}));

// Handle OTP login request
router.post('/login-with-otp', wrapAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const normEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normEmail });
  if (!user) {
    return res.status(404).json({ success: false, message: 'No account found with this email' });
  }

  return await sendOTP(normEmail, res, OTP_PURPOSES.LOGIN);
}));

// Verify OTP for login
router.post('/verify-login-otp', wrapAsync(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const normEmail = normalizeEmail(email);
  const verification = verifyOTP(normEmail, otp, OTP_PURPOSES.LOGIN);
  if (!verification.valid) {
    return res.status(400).json({ success: false, message: verification.message });
  }

  const user = await User.findOne({ email: normEmail });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (!user.emailVerified) {
    user.emailVerified = true;
    await user.save();
  }

  req.login(user, (err) => {
    if (err) {
      console.error('Passport login error:', err);
      return res.status(500).json({ success: false, message: 'Login failed' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      redirectUrl: req.session.returnTo || '/listings',
    });
  });
}));

// Generic Send OTP
router.post('/send-otp', wrapAsync(async (req, res) => {
  const { email, purpose } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const normEmail = normalizeEmail(email);
  return await sendOTP(normEmail, res, purpose || OTP_PURPOSES.LOGIN);
}));

// Generic Verify OTP
router.post('/verify-otp', wrapAsync(async (req, res) => {
  const { email, otp, isPasswordReset } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const normEmail = normalizeEmail(email);
  const purpose = isPasswordReset ? OTP_PURPOSES.PASSWORD_RESET : OTP_PURPOSES.LOGIN;
  const result = verifyOTP(normEmail, otp, purpose);

  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.message });
  }

  if (isPasswordReset) {
    const resetToken = createResetToken(normEmail);
    return res.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken,
    });
  } else {
    const user = await User.findOne({ email: normEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Login failed' });
      }
      return res.json({
        success: true,
        message: 'Login successful',
        redirectTo: '/listings',
      });
    });
  }
}));

// Resend OTP
router.post('/resend-otp', wrapAsync(async (req, res) => {
  const { email, purpose } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  const normEmail = normalizeEmail(email);
  return await sendOTP(normEmail, res, purpose || OTP_PURPOSES.LOGIN);
}));

module.exports = router;

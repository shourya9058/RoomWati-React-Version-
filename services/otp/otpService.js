const crypto = require('crypto');
const { OTP_PURPOSES, normalizePurpose } = require('../email/emailTypes');

const OTP_EXPIRY_MS = 10 * 60 * 1000; // Strictly 10 minutes
const RESEND_COOLDOWN_MS = 45 * 1000;  // 45 seconds cooldown
const MAX_ATTEMPTS = 5;

// In-memory stores (can be backed by Redis in high-scale multi-instance deployments)
const otpStore = new Map();
const resetTokenStore = new Map();

/**
 * Generates a cryptographically strong 6-digit numeric OTP string.
 */
function generateSecureOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Normalizes email strings for consistent lookup.
 */
function normalizeEmail(email) {
  return (email || '').toString().trim().toLowerCase();
}

/**
 * Creates and stores a new OTP for a given email and purpose.
 * Invalidator: Any existing OTP for this email is immediately replaced and invalidated.
 */
function createOTP(email, rawPurpose, metadata = {}) {
  const normEmail = normalizeEmail(email);
  if (!normEmail) {
    throw new Error('Valid email address is required');
  }

  const purpose = normalizePurpose(rawPurpose);
  const existing = otpStore.get(normEmail);

  // Check resend cooldown
  if (existing && Date.now() - existing.createdAt < RESEND_COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.createdAt)) / 1000);
    const error = new Error(`Please wait ${remainingSeconds}s before requesting another verification code`);
    error.statusCode = 429;
    error.cooldownSeconds = remainingSeconds;
    throw error;
  }

  const otp = generateSecureOTP();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  otpStore.set(normEmail, {
    otp,
    purpose,
    expiresAt,
    createdAt: Date.now(),
    attempts: 0,
    metadata: metadata || {},
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[OTP-SERVICE] Generated 10m OTP for ${normEmail} [${purpose}] (Dev Only)`);
  }

  return {
    otp,
    purpose,
    expiresInMinutes: 10,
    expiresAt,
  };
}

/**
 * Verifies an OTP against stored state for a specific purpose.
 * Strictly checks expiry, purpose matching, attempt counts, and single-use invalidation.
 */
function verifyOTP(email, enteredOtp, expectedPurpose) {
  const normEmail = normalizeEmail(email);
  const purpose = normalizePurpose(expectedPurpose);
  const record = otpStore.get(normEmail);

  if (!normEmail || !enteredOtp) {
    return { valid: false, message: 'Email and verification code are required' };
  }

  if (!record) {
    return { valid: false, message: 'Verification code not found or expired. Please request a new code.' };
  }

  // Check expiration (Strict 10 minutes)
  if (record.expiresAt < Date.now()) {
    otpStore.delete(normEmail);
    return { valid: false, message: 'Verification code has expired. Please request a new code.' };
  }

  // Increment failed attempt counter
  record.attempts = (record.attempts || 0) + 1;

  if (record.attempts > MAX_ATTEMPTS) {
    otpStore.delete(normEmail);
    return { valid: false, message: 'Too many incorrect attempts. Please request a new code.' };
  }

  // Check purpose isolation
  if (record.purpose !== purpose) {
    return {
      valid: false,
      message: `This verification code cannot be used for this action. Please request a new code for ${purpose.toLowerCase().replace('_', ' ')}.`,
    };
  }

  // Check code equality
  const cleanEntered = enteredOtp.toString().trim();
  if (record.otp !== cleanEntered) {
    const remainingAttempts = MAX_ATTEMPTS - record.attempts;
    return {
      valid: false,
      message: remainingAttempts > 0 
        ? `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`
        : 'Invalid verification code. Maximum attempts reached.',
    };
  }

  // Verification successful! Invalidate immediately (Single-use)
  const metadata = record.metadata;
  otpStore.delete(normEmail);

  return {
    valid: true,
    email: normEmail,
    purpose: record.purpose,
    metadata,
  };
}

/**
 * Issues a temporary, single-use password reset token after OTP verification.
 */
function createResetToken(email) {
  const normEmail = normalizeEmail(email);
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes for entering new password

  resetTokenStore.set(token, {
    email: normEmail,
    expiresAt,
  });

  return token;
}

/**
 * Verifies and consumes a password reset token (Single-use).
 */
function consumeResetToken(token) {
  if (!token) return null;
  const data = resetTokenStore.get(token);
  if (!data) return null;

  if (data.expiresAt < Date.now()) {
    resetTokenStore.delete(token);
    return null;
  }

  resetTokenStore.delete(token); // Single-use consumption
  return data.email;
}

/**
 * Retrieves the currently active purpose for an email if one is pending.
 */
function getActiveOtpPurpose(email) {
  const normEmail = normalizeEmail(email);
  const record = otpStore.get(normEmail);
  if (record && record.expiresAt > Date.now()) {
    return record.purpose;
  }
  return null;
}

module.exports = {
  OTP_PURPOSES,
  createOTP,
  verifyOTP,
  createResetToken,
  consumeResetToken,
  getActiveOtpPurpose,
  normalizeEmail,
};

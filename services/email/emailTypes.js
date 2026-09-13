/**
 * OTP Purposes and Dynamic Email Copy Configurations for RoomWati.
 * Supports ONE universal EmailJS template ('roomwati_otp') adapting its copy dynamically.
 */

const OTP_PURPOSES = Object.freeze({
  SIGNUP_VERIFICATION: 'SIGNUP_VERIFICATION',
  LOGIN: 'LOGIN',
  PASSWORD_RESET: 'PASSWORD_RESET',
});

// Normalized helper to accept lowercase/alias query/body parameters
function normalizePurpose(input) {
  if (!input) return OTP_PURPOSES.LOGIN;
  const str = input.toString().trim().toUpperCase();
  if (str === 'SIGNUP' || str === 'SIGNUP_VERIFICATION' || str === 'SIGN_UP' || str === 'VERIFY_EMAIL') {
    return OTP_PURPOSES.SIGNUP_VERIFICATION;
  }
  if (str === 'PASSWORD_RESET' || str === 'RESET' || str === 'FORGOT_PASSWORD' || str === 'FORGOT') {
    return OTP_PURPOSES.PASSWORD_RESET;
  }
  if (str === 'LOGIN' || str === 'SIGNIN' || str === 'SIGN_IN' || str === 'OTP_LOGIN') {
    return OTP_PURPOSES.LOGIN;
  }
  return OTP_PURPOSES.LOGIN;
}

const EMAIL_COPY = Object.freeze({
  [OTP_PURPOSES.SIGNUP_VERIFICATION]: {
    email_title: 'Verify your email',
    eyebrow: 'SECURE CODE',
    eyebrow_text: 'ONE QUICK STEP',
    message: "You're almost ready to find places that feel like home. Verify your email to finish creating your RoomWati account.",
    code_label: 'YOUR VERIFICATION CODE',
    security_message: 'Never share this code with anyone. RoomWati will never ask for your verification code.',
    ignore_message: "Didn't try to create a RoomWati account? You can safely ignore this email.",
  },

  [OTP_PURPOSES.LOGIN]: {
    email_title: "You're almost in",
    eyebrow: 'SECURE LOGIN',
    eyebrow_text: "YOU'RE ALMOST IN",
    message: "One tiny step and you're back to discovering places that feel like home.",
    code_label: 'YOUR LOGIN CODE',
    security_message: 'Never share this code with anyone. RoomWati will never ask for your OTP.',
    ignore_message: "Didn't request this code? You can safely ignore this email.",
  },

  [OTP_PURPOSES.PASSWORD_RESET]: {
    email_title: "Let's get you back in",
    eyebrow: 'ACCOUNT SECURITY',
    eyebrow_text: 'NO WORRIES',
    message: 'Use the code below to reset your RoomWati password and get back into your account.',
    code_label: 'YOUR RESET CODE',
    security_message: "If you didn't request a password reset, don't share this code and consider changing your password.",
    ignore_message: "Didn't request a password reset? You can safely ignore this email.",
  },
});

module.exports = {
  OTP_PURPOSES,
  EMAIL_COPY,
  normalizePurpose,
};

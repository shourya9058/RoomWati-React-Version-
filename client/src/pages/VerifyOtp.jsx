import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, AlertCircle, CheckCircle, Home, RotateCcw } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const purposeParam = (searchParams.get('purpose') || '').toLowerCase();
  const isReset = searchParams.get('reset') === 'true' || purposeParam.includes('reset');
  const isSignup = purposeParam.includes('signup') || purposeParam.includes('verify');

  const purpose = isReset ? 'PASSWORD_RESET' : isSignup ? 'SIGNUP_VERIFICATION' : 'LOGIN';

  const navigate = useNavigate();
  const { loginWithOtp, verifySignupOtp } = useAuth();
  const toast = useToast();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [resendMsg, setResendMsg] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 6) {
      setError('Please enter the full 6-digit verification code');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isReset) {
        const res = await api.verifyResetOtp(email, otp.trim());
        toast.success('Code Verified', 'Please enter your new password.');
        navigate(`/reset-password?token=${res.resetToken}&email=${encodeURIComponent(email)}`);
      } else if (isSignup) {
        await verifySignupOtp(email, otp.trim());
        toast.success('Account Verified! 🎉', 'Welcome to RoomWati! Your account is active.');
        navigate('/');
      } else {
        await loginWithOtp(email, otp.trim());
        toast.success('Welcome Back! 👋', 'You have successfully signed in.');
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    try {
      setResending(true);
      setError(null);
      await api.resendOtp(email, purpose);
      setResendMsg('A fresh verification code has been sent to your email.');
      setCooldown(45); // 45s cooldown
      setTimeout(() => setResendMsg(null), 5000);
    } catch (err) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setResending(false);
    }
  };

  const getHeading = () => {
    if (isSignup) return 'Verify Your Email';
    if (isReset) return 'Verify Reset Code';
    return 'Enter Login Code';
  };

  const getSubheading = () => {
    if (isSignup) return 'Complete your signup by entering the 6-digit code sent to';
    if (isReset) return 'Enter the 6-digit code sent to your email to reset your password:';
    return 'Enter the 6-digit code sent to';
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#fafafc]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card animate-fade-in space-y-6">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Room<span className="text-brand-500">Wati</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{getHeading()}</h1>
          <p className="text-xs text-slate-500">
            {getSubheading()} <b className="text-slate-800">{email || 'your email'}</b>
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2 border border-rose-100">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {resendMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2 border border-emerald-100">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{resendMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-center tracking-[0.5em] text-2xl font-black focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Code expires in <span className="font-semibold text-slate-600">10 minutes</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Verifying Code...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs pt-2">
          <Link to="/login" className="inline-flex items-center gap-1 font-bold text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="inline-flex items-center gap-1 font-bold text-brand-600 hover:underline disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            {resending 
              ? 'Sending...' 
              : cooldown > 0 
              ? `Resend in ${cooldown}s` 
              : 'Resend Code'}
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, KeyRound, Home, ArrowRight, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { login, loginWithOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Mode: 'password' or 'otp'
  const [mode, setMode] = useState('password');

  // Standard Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // OTP Form State
  const [otpEmail, setOtpEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please provide both username/email and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(identifier.trim(), password);
      toast.success('Welcome Back!', `Signed in successfully. Enjoy zero-brokerage stays.`);
      navigate(redirectUrl);
    } catch (err) {
      const msg = err.message || 'Invalid username/email or password';
      if (err.data?.requiresVerification && err.data?.email) {
        toast.info('Email Verification Required', 'Please verify your email with the 6-digit code sent to you.');
        navigate(`/verify-otp?email=${encodeURIComponent(err.data.email)}&purpose=signup`);
        return;
      }
      setError(msg);
      toast.error('Sign In Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!otpEmail.trim()) {
      setError('Please enter your registered email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.sendLoginOtp(otpEmail.trim());
      setOtpSent(true);
      setSuccessMsg(res.message || 'Verification code sent to your email!');
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await loginWithOtp(otpEmail.trim(), otpCode.trim());
      toast.success('Welcome Back! 👋', 'Signed in successfully.');
      navigate(redirectUrl);
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#fafafc]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card animate-fade-in space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Room<span className="text-brand-500">Wati</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to manage your spaces, bookings, and wishlist</p>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200/60">
          <button
            type="button"
            onClick={() => { setMode('password'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'password' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Password Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('otp'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'otp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            OTP Code Sign In
          </button>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2 border border-rose-100">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2 border border-emerald-100">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Mode 1: Password */}
        {mode === 'password' && (
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Username or Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. team@roomwati.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Form Mode 2: OTP Email Sign In */}
        {mode === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending Code...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter 6-Digit OTP</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-center tracking-widest text-lg font-black focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Code sent to {otpEmail}</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Change Email Address
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-brand-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

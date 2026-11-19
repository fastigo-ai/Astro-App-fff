'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ShieldCheck, ArrowRight, KeyRound, Phone, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('9366128220');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtpNotice, setDevOtpNotice] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDevOtpNotice(null);

    const cleaned = phone.trim();
    if (!cleaned || cleaned.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      const res = await api.sendOtp(cleaned);
      if (res.devOtp) {
        setDevOtpNotice(`Development Mode OTP: ${res.devOtp}`);
        setOtp(res.devOtp);
      }
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedOtp = otp.trim();
    if (!cleanedOtp || cleanedOtp.length < 4) {
      setError('Please enter the 4-digit OTP code');
      return;
    }

    try {
      setLoading(true);
      const res = await api.verifyOtp(phone.trim(), cleanedOtp);
      const role = res?.data?.user?.role;

      if (role !== 'admin' && role !== 'super_admin') {
        api.clearAuth();
        setError(
          `Access Denied: This portal requires administrator privileges. Your current role is '${role || 'user'}'.`
        );
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 text-slate-100">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-saffron-600 to-amber-400 items-center justify-center shadow-lg shadow-saffron-900/50 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AstroBaby Admin & LMS</h1>
          <p className="text-sm text-amber-300/80 font-medium mt-1">
            Garbh Sanskar Management & Live Class Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Dev OTP Notice */}
        {devOtpNotice && (
          <div className="mb-6 p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs flex items-center justify-between">
            <span className="font-mono">{devOtpNotice}</span>
            <button
              type="button"
              onClick={() => setOtp(devOtpNotice.split(': ')[1] || '1234')}
              className="text-amber-400 hover:text-amber-200 underline font-semibold ml-2"
            >
              Fill OTP
            </button>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Administrator Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9366128220"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Root Super Admin bypass phone: <span className="font-mono text-amber-400">9366128220</span> (OTP: 1234)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white shadow-lg shadow-saffron-900/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Sending OTP...</span>
              ) : (
                <>
                  <span>Request Admin OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Enter 4-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-saffron-400 hover:text-saffron-300"
                >
                  Change phone
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="• • • •"
                  required
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-center text-2xl tracking-widest font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white shadow-lg shadow-saffron-900/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Verify & Enter Admin Console</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Footer Note */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 mr-1 text-emerald-400" />
            Protected by 3-Tier RBAC & JWT Security
          </p>
        </div>
      </div>
    </div>
  );
}

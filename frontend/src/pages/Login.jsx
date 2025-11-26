import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Email & password required');

    setLoading(true);
    try {
      await API.post('/auth/login', form);
      await onAuth();
      navigate('/myblogs');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
              <LogIn size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-slate-600 mt-2">Log in to continue to your blogs</p>
          </div>

          {/* Local Time Greeting (Surat) */}
          <p className="text-center text-xs text-slate-500 mb-6">
            {new Date().toLocaleTimeString('en-IN', { 
              timeZone: 'Asia/Kolkata', 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }).toLowerCase()} in Surat, Gujarat
          </p>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={change}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-800 font-medium"
                placeholder="you@example.com"
              />
              <label className="absolute left-12 -top-3 bg-white px-2 text-xs font-medium text-indigo-600 opacity-0 group-focus-within:opacity-100 transition-opacity">
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={change}
                required
                className="w-full pl-12 pr-12 py-4 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-800 font-medium"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <label className="absolute left-12 -top-3 bg-white px-2 text-xs font-medium text-indigo-600 opacity-0 group-focus-within:opacity-100 transition-opacity">
                Password
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-shake flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <LogIn size={20} />
                  Login to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              Forgot your password?
            </a>
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Sign up free
              </button>
            </p>
          </div>
        </div>

        {/* Surat Pride */}
        <p className="text-center mt-6 text-xs text-slate-500">
          Made with love in <span className="font-semibold text-indigo-600">Surat, Gujarat</span>
        </p>
      </div>
    </div>
  );
}
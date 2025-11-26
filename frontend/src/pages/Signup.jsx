import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function Signup({ onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const change = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Live validation
  const validate = () => {
    if (!form.name && touched.name) return 'Name is required';
    if (!form.email && touched.email) return 'Email is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email';
    if (!form.password && touched.password) return 'Password is required';
    if (form.password && form.password.length < 6) return 'Password must be 6+ characters';
    return '';
  };

  useEffect(() => {
    const err = validate();
    if (err && touched.name && touched.email && touched.password) {
      setError(err);
    } else if (!err && error) {
      setError('');
    }
  }, [form, touched]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ name: true, email: true, password: true });

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      await API.post('/auth/signup', form);
      await onAuth();
      navigate('/myblogs');
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const getStrength = () => {
    const len = form.password.length;
    if (len === 0) return { level: 0, color: '' };
    if (len < 6) return { level: 1, color: 'bg-red-500' };
    if (len < 8) return { level: 2, color: 'bg-yellow-500' };
    if (len < 12) return { level: 3, color: 'bg-emerald-500' };
    return { level: 4, color: 'bg-indigo-600' };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-slate-600 mt-2">Join the MERN Blog community</p>
          </div>

          {/* Surat Time */}
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
            {/* Name Field */}
            <div className="relative group">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                name="name"
                value={form.name}
                onChange={change}
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                className={`w-full pl-12 pr-4 py-4 bg-white/50 border ${touched.name && !form.name ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-800 font-medium`}
                placeholder="John Doe"
              />
              <label className={`absolute left-12 -top-3 bg-white px-2 text-xs font-medium text-indigo-600 transition-all ${touched.name ? 'opacity-100' : 'opacity-0'}`}>
                Full Name
              </label>
              {touched.name && form.name && (
                <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>

            {/* Email Field */}
            <div className="relative group">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={change}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                className={`w-full pl-12 pr-4 py-4 bg-white/50 border ${touched.email && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-800 font-medium`}
                placeholder="you@example.com"
              />
              <label className={`absolute left-12 -top-3 bg-white px-2 text-xs font-medium text-indigo-600 transition-all ${touched.email ? 'opacity-100' : 'opacity-0'}`}>
                Email Address
              </label>
              {touched.email && form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <div className="relative group">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={change}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  className={`w-full pl-12 pr-12 py-4 bg-white/50 border ${touched.password && form.password && form.password.length < 6 ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-800 font-medium`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <label className={`absolute left-12 -top-3 bg-white px-2 text-xs font-medium text-indigo-600 transition-all ${touched.password ? 'opacity-100' : 'opacity-0'}`}>
                  Password (6+ chars)
                </label>
              </div>

              {/* Password Strength */}
              {touched.password && form.password && (
                <div className="flex gap-1 h-1.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        i < strength.level ? strength.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-shake flex items-center gap-2">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !form.name || !form.email || form.password.length < 6}
              className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <User size={20} />
                  Create Free Account
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Log in
              </button>
            </p>
          </div>
        </div>

        {/* Surat Pride */}
        <p className="text-center mt-6 text-xs text-slate-500">
          Crafted with love in <span className="font-semibold text-indigo-600">Surat, Gujarat</span>
        </p>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Signup({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (formData.name.length < 2) {
      return setError('Name must be at least 2 characters');
    }
    if (!formData.email) return setError('Email is required');
    if (!formData.password) return setError('Password is required');
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      setError('');

      const res = await API.post('/auth/register', formData);

      // Save token if returned
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      // Save user ID
      localStorage.setItem('userId', res.data.userId._id);

      // Refresh navbar
      setIsLoggedIn(true);

      // Redirect
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (strength) => {
    switch(strength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#213448] via-[#213448] to-[#547792] p-4">
      <div className="w-full max-w-4xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Illustration/Info */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#213448] to-[#547792] p-12 flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-[#94B4C1]"></div>
              <span className="text-2xl font-bold text-[#EAE0CF]">Brand</span>
            </div>
            
            <h1 className="text-4xl font-bold text-[#EAE0CF] mb-6">
              Join Our Community
            </h1>
            
            <p className="text-[#94B4C1] text-lg mb-8">
              Create your account and unlock access to premium features designed to help you succeed.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#94B4C1]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[#EAE0CF]">Secure & encrypted data</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#94B4C1]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[#EAE0CF]">24/7 Customer support</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#94B4C1]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[#EAE0CF]">Free trial for new users</span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="md:hidden mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#213448]"></div>
              <span className="text-2xl font-bold text-[#213448]">Brand</span>
            </div>
            <h2 className="text-3xl font-bold text-center text-[#213448]">
              Create Account
            </h2>
          </div>

          <div className="hidden md:block mb-8">
            <h2 className="text-3xl font-bold text-[#213448]">Create Account</h2>
            <p className="text-[#547792] mt-2">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-[#213448] mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#547792]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#213448] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#547792]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#213448] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#547792]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-[#547792] mb-1">
                    <span>Password strength</span>
                    <span>{passwordStrength === 4 ? 'Strong' : passwordStrength >= 2 ? 'Medium' : 'Weak'}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs text-[#547792] mt-2 space-y-1">
                    <li className="flex items-center">
                      <span className={`inline-block w-1 h-1 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <span className={`inline-block w-1 h-1 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      One uppercase letter
                    </li>
                    <li className="flex items-center">
                      <span className={`inline-block w-1 h-1 rounded-full mr-2 ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      One number
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-[#213448] border-[#94B4C1] rounded focus:ring-[#213448]"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-[#547792]">
                I agree to the{' '}
                <a href="#" className="text-[#213448] font-medium hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#213448] font-medium hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#213448] to-[#547792] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#213448] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#94B4C1]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#547792]">Or continue with</span>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 border border-[#94B4C1] rounded-lg hover:bg-[#EAE0CF]/20 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-[#213448]">Google</span>
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 border border-[#94B4C1] rounded-lg hover:bg-[#EAE0CF]/20 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="#000000" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium text-[#213448]">GitHub</span>
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-[#547792]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#213448] font-semibold hover:text-[#547792] hover:underline transition-colors duration-200"
              >
                Sign in here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
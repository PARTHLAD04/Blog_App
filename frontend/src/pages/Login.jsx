import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      
      // ✅ Store auth data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.res._id);
      
      // ✅ Refresh navbar instantly
      setIsLoggedIn(true);
      
      // ✅ Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#213448] to-[#547792] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#EAE0CF] rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#213448] p-6 text-center">
            <h2 className="text-3xl font-bold text-[#EAE0CF]">Welcome Back</h2>
            <p className="text-[#94B4C1] mt-2">Sign in to your account</p>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-[#213448] font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#547792]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all duration-200 bg-white text-[#213448]"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[#213448] font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#547792]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all duration-200 bg-white text-[#213448]"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#213448] to-[#547792] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#213448] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Additional Links */}
              <div className="text-center pt-4 border-t border-[#94B4C1]">
                <p className="text-[#547792]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-[#213448] font-semibold hover:text-[#547792] transition-colors duration-200"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-[#EAE0CF] text-sm">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
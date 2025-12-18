import { useEffect, useState } from 'react';
import {
  getMyProfile,
  updateProfile,
  changePassword,
} from '../api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      const userData = res.data.res || res.data.user;
      setUser(userData);
      setName(userData.name);
      setEmail(userData.email);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Calculate password strength
  useEffect(() => {
    if (newPassword) {
      let strength = 0;
      if (newPassword.length >= 8) strength += 1;
      if (/[A-Z]/.test(newPassword)) strength += 1;
      if (/[0-9]/.test(newPassword)) strength += 1;
      if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [newPassword]);

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await updateProfile({ name, email });
      setMessage('Profile updated successfully!');
      setUser(res.data.user);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    try {
      await changePassword({ oldPassword, newPassword });
      setMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to change password');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EAE0CF]/10 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#94B4C1] border-t-[#213448]"></div>
          <p className="mt-4 text-[#547792] font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAE0CF]/10 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#213448] to-[#547792] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-[#94B4C1] mt-1">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="px-3 py-1.5 bg-white/10 rounded-full">
                <span className="font-medium">Member since</span>{' '}
                {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* User Card */}
              <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-lg p-6 mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[#213448] to-[#547792] flex items-center justify-center text-white text-3xl font-bold mb-4">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold text-[#213448]">{user?.name}</h2>
                  <p className="text-[#547792] mt-1">{user?.email}</p>
                  
                  <div className="mt-6 pt-6 border-t border-[#EAE0CF]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#547792]">Account ID</span>
                      <span className="font-mono text-[#213448]">#{user?._id?.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-[#547792]">Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-colors ${activeTab === 'profile' 
                    ? 'bg-[#213448] text-white' 
                    : 'hover:bg-[#EAE0CF]/20 text-[#213448]'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'profile' ? 'bg-white/20' : 'bg-[#EAE0CF]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Profile Information</div>
                    <div className="text-sm opacity-75">Update your personal details</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-colors ${activeTab === 'security' 
                    ? 'bg-[#213448] text-white' 
                    : 'hover:bg-[#EAE0CF]/20 text-[#213448]'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'security' ? 'bg-white/20' : 'bg-[#EAE0CF]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Security</div>
                    <div className="text-sm opacity-75">Change password & security</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* Messages */}
            {message && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-700 font-medium">{message}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Profile Update Form */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#EAE0CF] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#213448]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#213448]">Profile Information</h2>
                    <p className="text-sm text-[#547792]">Update your personal details</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EAE0CF]">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#213448] to-[#547792] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Update Profile
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password Form */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#EAE0CF] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#213448]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#213448]">Change Password</h2>
                    <p className="text-sm text-[#547792]">Update your password to keep your account secure</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#213448] mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-[#547792]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#213448] mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-[#547792]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {newPassword && (
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
                              <span className={`inline-block w-1 h-1 rounded-full mr-2 ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              At least 8 characters
                            </li>
                            <li className="flex items-center">
                              <span className={`inline-block w-1 h-1 rounded-full mr-2 ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              One uppercase letter
                            </li>
                            <li className="flex items-center">
                              <span className={`inline-block w-1 h-1 rounded-full mr-2 ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              One number
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#213448] mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-[#547792]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                            confirmPassword && newPassword !== confirmPassword
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-[#94B4C1] focus:ring-[#213448]'
                          }`}
                          required
                        />
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EAE0CF]">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#213448] to-[#547792] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Update Password
                      </span>
                    </button>
                  </div>
                </form>

                {/* Security Tips */}
                <div className="mt-8 pt-6 border-t border-[#EAE0CF]">
                  <h3 className="text-sm font-medium text-[#213448] mb-3">Security Tips</h3>
                  <ul className="space-y-2 text-sm text-[#547792]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#94B4C1] mt-0.5">•</span>
                      Use a unique password that you don't use elsewhere
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#94B4C1] mt-0.5">•</span>
                      Update your password regularly
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#94B4C1] mt-0.5">•</span>
                      Never share your password with anyone
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Account Info Card */}
            <div className="mt-8">
              <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#213448] mb-4">Account Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#EAE0CF]/20 rounded-lg">
                    <div className="text-sm text-[#547792]">Account Created</div>
                    <div className="font-medium text-[#213448]">
                      {new Date(user?.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="p-3 bg-[#EAE0CF]/20 rounded-lg">
                    <div className="text-sm text-[#547792]">Last Updated</div>
                    <div className="font-medium text-[#213448]">
                      {new Date(user?.updatedAt || user?.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
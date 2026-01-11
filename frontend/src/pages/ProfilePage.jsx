import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { User, Lock, Bookmark, Save, Loader, Mail, Shield, Settings, Key, BookOpen, Calendar, Award, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [bookmarks, setBookmarks] = useState([]);
    const [loadingBookmarks, setLoadingBookmarks] = useState(false);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Profile Form State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (activeTab === 'bookmarks') {
            fetchBookmarks();
        }
    }, [activeTab]);

    const fetchBookmarks = async () => {
        setLoadingBookmarks(true);
        try {
            const { data } = await api.get('/users/bookmarks');
            setBookmarks(data.bookmarks.map(b => b.blog).filter(Boolean) || []);
        } catch (error) {
            toast.error("Failed to load bookmarks");
        } finally {
            setLoadingBookmarks(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            const { data } = await api.put('/users/update', profileData);
            setUser(JSON.parse(JSON.stringify({ ...user, ...data.user })));
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        setChangingPassword(true);
        try {
            await api.put('/users/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password changed successfully!");
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                        <User className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Please login to view profile</h2>
                    <p className="text-gray-600 mb-6">Sign in to access your personal dashboard</p>
                    <a
                        href="/login"
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md hover:shadow-lg"
                    >
                        Sign In Now
                    </a>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile Info', icon: User },
        { id: 'password', label: 'Security', icon: Lock },
        { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    ];

    const memberSince = user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Recently';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Account</h1>
                    <p className="text-gray-600">Manage your profile, security, and saved content</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        {/* User Profile Card */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white mb-6 shadow-lg">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-full border border-white/30">
                                    <span className="text-2xl font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{user.name}</h3>
                                    <p className="text-emerald-100 text-sm">{user.email}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-emerald-100">Role</span>
                                    <span className="font-medium bg-white/20 px-3 py-1 rounded-full">
                                        {user.role === 'admin' ? 'Administrator' : 'Member'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-emerald-100">Member Since</span>
                                    <span className="font-medium">{memberSince}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-emerald-100">Status</span>
                                    <span className="font-medium text-emerald-300 flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" />
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-5 py-4 text-left transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-l-4 border-emerald-600'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Stats Card */}
                        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Award className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800">Your Stats</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Bookmarks</span>
                                    <span className="font-bold text-emerald-700">{bookmarks.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Posts Created</span>
                                    <span className="font-bold text-emerald-700">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Comments</span>
                                    <span className="font-bold text-emerald-700">0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {/* Profile Info Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                                        <User className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                                        <p className="text-gray-600">Update your profile details</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 outline-none"
                                                    placeholder="Your full name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 outline-none"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <button
                                            type="submit"
                                            disabled={updatingProfile}
                                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                                                updatingProfile
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                                                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg hover:shadow-xl'
                                            }`}
                                        >
                                            {updatingProfile ? (
                                                <>
                                                    <Loader className="w-5 h-5 animate-spin" />
                                                    <span>Updating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />
                                                    <span>Save Changes</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl">
                                        <Shield className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                                        <p className="text-gray-600">Secure your account with a new password</p>
                                    </div>
                                </div>

                                <form onSubmit={handlePasswordChange}>
                                    <div className="space-y-6 mb-8 max-w-2xl">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Key className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={passwordData.oldPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all duration-200 outline-none"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all duration-200 outline-none"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">Must be at least 8 characters long</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all duration-200 outline-none"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <button
                                            type="submit"
                                            disabled={changingPassword}
                                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                                                changingPassword
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                                                    : 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-500 hover:to-pink-500 shadow-lg hover:shadow-xl'
                                            }`}
                                        >
                                            {changingPassword ? (
                                                <>
                                                    <Loader className="w-5 h-5 animate-spin" />
                                                    <span>Updating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />
                                                    <span>Update Password</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Bookmarks Tab */}
                        {activeTab === 'bookmarks' && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl">
                                            <Bookmark className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">Your Bookmarks</h2>
                                            <p className="text-gray-600">All your saved posts in one place</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-full border border-amber-200">
                                        <span className="font-semibold text-amber-700">{bookmarks.length} Saved</span>
                                    </div>
                                </div>

                                {loadingBookmarks ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-3"></div>
                                            <span className="text-gray-600">Loading bookmarks...</span>
                                        </div>
                                    </div>
                                ) : bookmarks.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                                            <BookOpen className="w-10 h-10 text-amber-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookmarks yet</h3>
                                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                                            When you find interesting posts, click the bookmark icon to save them here.
                                        </p>
                                        <a
                                            href="/"
                                            className="inline-flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            <span>Explore Posts</span>
                                        </a>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {bookmarks.map((post) => (
                                            <PostCard key={post._id} post={post} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
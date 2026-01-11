import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, ArrowRight, Sparkles, Shield, CreditCard, Zap } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            toast.success("Registration successful!");
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="md:grid md:grid-cols-2">
                    {/* Left decorative panel */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-12 md:p-16 text-white">
                        <div className="h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <span className="text-lg font-semibold tracking-wide">Welcome</span>
                                </div>

                                <h1 className="text-4xl font-bold mb-6 leading-tight">
                                    Join Our <span className="text-yellow-300">Community</span>
                                </h1>
                                <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                                    Create your account and start your journey with us. Get access to exclusive features and personalized content.
                                </p>

                                <div className="space-y-6 mt-12">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/10 rounded-full">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Secure & encrypted</p>
                                            <p className="text-indigo-100 text-sm">Your data is protected with AES-256 encryption</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/10 rounded-full">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">No credit card required</p>
                                            <p className="text-indigo-100 text-sm">Start for free, upgrade anytime</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/10 rounded-full">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Free forever plan</p>
                                            <p className="text-indigo-100 text-sm">Essential features at no cost</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/20">
                                <p className="text-indigo-100 text-sm">
                                    Trusted by <span className="font-bold">10,000+</span> users worldwide
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right form panel */}
                    <div className="p-12 md:p-16">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Create Account
                            </h2>
                            <p className="text-gray-600">
                                Join thousands of users already registered
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 outline-none"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Must be at least 8 characters with letters and numbers
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                                <span>Create Account</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        {/* Terms and Login */}
                        <div className="mt-12 space-y-6">
                            

                            <div className="pt-6 border-t border-gray-200">
                                <p className="text-center text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 group"
                                    >
                                        Sign in
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Monitor, PenSquare, Home, ChevronDown, Sparkles } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-900 to-teal-800 shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link 
                            to="/" 
                            className="flex items-center space-x-3 group"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur group-hover:blur-md transition-all duration-300"></div>
                                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white tracking-tight">
                                    Blog<span className="text-emerald-300">App</span>
                                </span>
                                <span className="text-xs text-emerald-100/80">Thoughts • Ideas • Stories</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link 
                            to="/" 
                            className="flex items-center px-4 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Link>
                        
                        {user ? (
                            <>
                                <Link 
                                    to="/create-post" 
                                    className="flex items-center px-4 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                                >
                                    <PenSquare className="w-4 h-4 mr-2" />
                                    Write
                                </Link>
                                
                                {user.role === 'admin' && (
                                    <Link 
                                        to="/admin" 
                                        className="flex items-center px-4 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                                    >
                                        <Monitor className="w-4 h-4 mr-2" />
                                        Admin
                                    </Link>
                                )}
                                
                                <div className="w-px h-6 bg-emerald-700 mx-2"></div>
                                
                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={toggleProfileDropdown}
                                        className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
                                            <span className="text-white font-semibold text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-white font-medium text-sm">
                                                {user.name.split(' ')[0]}
                                            </span>
                                            <span className="text-emerald-200 text-xs">
                                                {user.role === 'admin' ? 'Administrator' : 'Member'}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-emerald-200 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-blue-800 to-teal-800 rounded-xl shadow-xl border border-emerald-700 overflow-hidden z-50">
                                            <div className="py-1">
                                                <Link 
                                                    to="/profile" 
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center px-4 py-3 text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
                                                >
                                                    <User className="w-4 h-4 mr-3" />
                                                    My Profile
                                                </Link>
                                                
                                                {user.role === 'admin' && (
                                                    <Link 
                                                        to="/admin" 
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center px-4 py-3 text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
                                                    >
                                                        <Monitor className="w-4 h-4 mr-3" />
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                
                                                <div className="border-t border-emerald-700 my-1"></div>
                                                
                                                <button
                                                    onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                                                    className="flex items-center w-full px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-900/20 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4 mr-3" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/login" 
                                    className="px-5 py-2 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 border border-emerald-700 hover:border-emerald-600"
                                >
                                    Sign in
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gradient-to-b from-blue-900 to-teal-800 border-t border-emerald-700 shadow-xl">
                    <div className="px-4 py-3 space-y-1">
                        <Link 
                            to="/" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-3 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Home className="w-5 h-5 mr-3" />
                            Home
                        </Link>
                        
                        {user ? (
                            <>
                                <Link 
                                    to="/create-post" 
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-4 py-3 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <PenSquare className="w-5 h-5 mr-3" />
                                    Write Article
                                </Link>
                                
                                <Link 
                                    to="/profile" 
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-4 py-3 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <User className="w-5 h-5 mr-3" />
                                    My Profile
                                </Link>
                                
                                {user.role === 'admin' && (
                                    <Link 
                                        to="/admin" 
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center px-4 py-3 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <Monitor className="w-5 h-5 mr-3" />
                                        Admin Dashboard
                                    </Link>
                                )}
                                
                                <div className="border-t border-emerald-700 my-2"></div>
                                
                                <div className="px-4 py-3">
                                    <div className="flex items-center mb-3">
                                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-3">
                                            <span className="text-white font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{user.name}</div>
                                            <div className="text-emerald-200 text-sm">{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-500 hover:to-pink-500 transition-all duration-200 mt-2"
                                >
                                    <LogOut className="w-5 h-5 mr-2" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center px-4 py-3 border border-emerald-700 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all duration-200"
                                >
                                    Create Account
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
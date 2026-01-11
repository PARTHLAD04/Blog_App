import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Heart, Mail, Github, Twitter, Linkedin, Sparkles, BookOpen, Users, Globe, Send, Newspaper, Shield, HelpCircle } from 'lucide-react';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
            <Navbar />
            
            <main className="flex-grow">
                <Outlet />
            </main>
            
            <footer className="bg-gradient-to-b from-blue-900 to-teal-800 text-white mt-16">
                {/* Main Footer */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {/* Brand Section */}
                        <div className="md:col-span-1">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Blog<span className="text-emerald-300">App</span></h2>
                                    <p className="text-emerald-200/80 text-sm">Thoughts • Ideas • Stories</p>
                                </div>
                            </div>
                            <p className="text-emerald-100/80 text-sm leading-relaxed mb-6">
                                A platform for sharing knowledge, experiences, and creative ideas with a global community of thinkers and creators.
                            </p>
                            <div className="flex items-center space-x-3">
                                <a 
                                    href="https://github.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 bg-emerald-800/50 hover:bg-emerald-700/50 rounded-lg transition-colors border border-emerald-700/50"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                                <a 
                                    href="https://twitter.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 bg-emerald-800/50 hover:bg-emerald-700/50 rounded-lg transition-colors border border-emerald-700/50"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a 
                                    href="https://linkedin.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 bg-emerald-800/50 hover:bg-emerald-700/50 rounded-lg transition-colors border border-emerald-700/50"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a 
                                    href="mailto:contact@blogapp.com" 
                                    className="p-2 bg-emerald-800/50 hover:bg-emerald-700/50 rounded-lg transition-colors border border-emerald-700/50"
                                >
                                    <Mail className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                                <Newspaper className="w-5 h-5 text-emerald-300" />
                                Quick Links
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <a 
                                        href="/" 
                                        className="text-emerald-100/80 hover:text-white transition-colors flex items-center space-x-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                        <span>Home</span>
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="/create-post" 
                                        className="text-emerald-100/80 hover:text-white transition-colors flex items-center space-x-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                        <span>Write a Post</span>
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="/about" 
                                        className="text-emerald-100/80 hover:text-white transition-colors flex items-center space-x-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                        <span>About Us</span>
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="/contact" 
                                        className="text-emerald-100/80 hover:text-white transition-colors flex items-center space-x-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                        <span>Contact</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-300" />
                                Resources
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <a 
                                        href="/privacy" 
                                        className="text-emerald-100/80 hover:text-white transition-colors flex items-center space-x-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                        <span>Privacy Policy</span>
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="/terms" 
                                        className="text-emerald-100/80 hover:text-white transition-colors flex items-center space-x-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                        <span>Terms of Service</span>
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="/guidelines" 
                                        className="text-emerald-100/80 hover:text-white transition-colors flex items-center space-x-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                        <span>Community Guidelines</span>
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="/help" 
                                        className="text-emerald-100/80 hover:text-white transition-colors flex items-center space-x-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                        <span>Help Center</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                                <Send className="w-5 h-5 text-emerald-300" />
                                Stay Updated
                            </h3>
                            <p className="text-emerald-100/80 text-sm mb-4">
                                Subscribe to our newsletter for the latest posts and updates.
                            </p>
                            <form className="space-y-3">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="w-full px-4 py-2 bg-emerald-800/30 border border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white outline-none placeholder-emerald-200/50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-emerald-700/50">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Users className="w-5 h-5 text-emerald-300" />
                                <div className="text-2xl font-bold">50K+</div>
                            </div>
                            <div className="text-emerald-100/80 text-sm">Community Members</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <BookOpen className="w-5 h-5 text-teal-300" />
                                <div className="text-2xl font-bold">1.2K+</div>
                            </div>
                            <div className="text-emerald-100/80 text-sm">Published Articles</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Globe className="w-5 h-5 text-cyan-300" />
                                <div className="text-2xl font-bold">120+</div>
                            </div>
                            <div className="text-emerald-100/80 text-sm">Countries Reached</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Heart className="w-5 h-5 text-pink-300" />
                                <div className="text-2xl font-bold">98%</div>
                            </div>
                            <div className="text-emerald-100/80 text-sm">User Satisfaction</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="bg-blue-900 py-6 border-t border-emerald-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="text-emerald-100/80 text-sm">
                                &copy; {new Date().getFullYear()} BlogApp. All rights reserved.
                            </div>
                            <div className="flex items-center space-x-6 text-emerald-100/80 text-sm">
                                <span className="flex items-center gap-1">
                                    Made with <Heart className="w-4 h-4 text-red-400" /> by BlogApp Team
                                </span>
                                <span className="hidden md:inline text-emerald-600">•</span>
                                <span>Open Source</span>
                                <span className="hidden md:inline text-emerald-600">•</span>
                                <span>v1.0.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
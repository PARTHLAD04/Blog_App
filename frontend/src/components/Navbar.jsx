import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName] = useState(() => localStorage.getItem('userName') || 'User');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const navLinks = isLoggedIn 
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/myblogs', label: 'My Blogs', icon: 'edit' },
        { path: '/profile', label: 'Profile', icon: 'user' },
      ]
    : [
        { path: '/', label: 'Home', icon: 'home' },
        { path: '/login', label: 'Login', icon: 'login' },
        { path: '/signup', label: 'Signup', icon: 'user-plus' },
      ];

  const getIcon = (iconName, isActive = false) => {
    const baseClasses = "w-4 h-4";
    const activeClasses = isActive ? "text-white" : "text-[#94B4C1] group-hover:text-white";
    
    switch(iconName) {
      case 'home':
        return (
          <svg className={`${baseClasses} ${activeClasses}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'dashboard':
        return (
          <svg className={`${baseClasses} ${activeClasses}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case 'edit':
        return (
          <svg className={`${baseClasses} ${activeClasses}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'user':
        return (
          <svg className={`${baseClasses} ${activeClasses}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'login':
        return (
          <svg className={`${baseClasses} ${activeClasses}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        );
      case 'user-plus':
        return (
          <svg className={`${baseClasses} ${activeClasses}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'logout':
        return (
          <svg className={`${baseClasses} ${activeClasses}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-[#213448] to-[#547792] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link
                to={isLoggedIn ? '/dashboard' : '/'}
                className="flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-[#EAE0CF] shadow-inner flex items-center justify-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#213448] to-[#547792] bg-clip-text text-transparent">
                    B
                  </span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-white tracking-tight">BlogSpace</h1>
                  <p className="text-xs text-[#94B4C1] -mt-1">Share Your Story</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 backdrop-blur-sm text-white shadow-inner'
                        : 'text-[#EAE0CF] hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {getIcon(link.icon, isActive)}
                      <span className="font-medium">{link.label}</span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* Logout Button (Logged in only) */}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 ml-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                >
                  {getIcon('logout')}
                  <span>Logout</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-white/10 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-[#213448] to-[#547792] shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 mx-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-[#EAE0CF] hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {getIcon(link.icon, isActive)}
                      <span className="font-medium">{link.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
              
              {isLoggedIn && (
                <div className="px-4 py-3 mx-2 border-t border-white/20">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-md transition-shadow"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Add padding for fixed navbar on mobile */}
      <div className="h-16 md:hidden"></div>
    </>
  );
};

export default Navbar;
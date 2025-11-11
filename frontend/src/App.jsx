import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyBlogs from './pages/MyBlogs';
import API from './api';
import { Menu, X } from 'lucide-react'; // Optional: install lucide-react for icons

export default function App() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 to detect current path

  const fetchMe = async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const logout = async () => {
    await API.post('/auth/logout');
    setUser(null);
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // 👇 hide navbar and footer on these pages
  const hideNavAndFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50">

      {/* ✅ Navbar only if not on login/signup */}
      {!hideNavAndFooter && (
        <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link 
                to="/" 
                className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all duration-300"
              >
                MERN Blog
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/dashboard">Discover</NavLink>
                
                {user ? (
                  <>
                    <NavLink to="/myblogs">My Blogs</NavLink>
                    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-700">Hi, {user.name.split(' ')[0]}</span>
                      </div>
                      <button
                        onClick={logout}
                        className="text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="text-sm px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md transform hover:scale-105 transition-all duration-200"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100">
              <div className="px-4 py-3 space-y-2">
                <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  Discover
                </MobileNavLink>

                {user ? (
                  <>
                    <MobileNavLink to="/myblogs" onClick={() => setMobileMenuOpen(false)}>
                      My Blogs
                    </MobileNavLink>
                    <div className="flex items-center gap-3 py-2 px-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-700">Hi, {user.name.split(' ')[0]}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full text-left text-sm px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </MobileNavLink>
                    <MobileNavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <span className="block w-full text-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all">
                        Sign up
                      </span>
                    </MobileNavLink>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/signup" element={<Signup onAuth={fetchMe} />} />
          <Route path="/login" element={<Login onAuth={fetchMe} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/myblogs" element={<MyBlogs user={user} />} />
        </Routes>
      </main>

      {/* ✅ Footer only if not on login/signup */}
      {!hideNavAndFooter && (
        <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-slate-600">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-indigo-600">MERN Blog</span>. Crafted with ❤️ in Surat.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

// Reusable NavLink Component
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-sm font-medium px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-all duration-200"
  >
    {children}
  </Link>
);

// Mobile NavLink
const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 rounded-lg transition-colors"
  >
    {children}
  </Link>
);

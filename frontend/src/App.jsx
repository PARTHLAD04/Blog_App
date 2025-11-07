import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyBlogs from './pages/MyBlogs';
import API from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold">MERN Blog</Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm px-3 py-1 rounded hover:bg-slate-100">Discover</Link>
            {user ? (
              <>
                <Link to="/myblogs" className="text-sm px-3 py-1 rounded hover:bg-slate-100">My Blogs</Link>
                <span className="text-sm text-slate-600">Hi, {user.name}</span>
                <button onClick={logout} className="text-sm px-3 py-1 border rounded">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm px-3 py-1 border rounded">Login</Link>
                <Link to="/signup" className="text-sm px-3 py-1 bg-indigo-600 text-white rounded">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto p-6 w-full">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/signup" element={<Signup onAuth={fetchMe} />} />
          <Route path="/login" element={<Login onAuth={fetchMe} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/myblogs" element={<MyBlogs user={user} />} />
        </Routes>
      </main>

      <footer className="text-center py-6 text-sm text-slate-500">
        &copy; {new Date().getFullYear()} MERN Blog
      </footer>
    </div>
  );
}

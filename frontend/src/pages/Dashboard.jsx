import React, { useEffect, useState } from 'react';
import API from '../api';
import BlogCard from '../components/BlogCard';
import { BookOpen, Clock, Heart, User } from 'lucide-react';

export default function Dashboard({ user }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/blogs/all');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleLike = async (id) => {
    if (!user) return alert('Please login to like posts');
    try {
      await API.post(`/likes/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-100 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-slate-200 rounded w-5/6 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          <div className="h-3 bg-slate-200 rounded w-20"></div>
        </div>
        <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Discover Blogs
          </h2>
          <p className="text-slate-600 mt-1">Explore stories from the community</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <BookOpen size={16} />
          <span>{blogs.length} {blogs.length === 1 ? 'blog' : 'blogs'} available</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Blogs Grid */}
      {!loading && blogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BlogCard blog={blog} onLike={handleLike} currentUser={user} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && blogs.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <BookOpen size={48} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No blogs yet</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Be the first to share your story! Write a blog and inspire the community.
          </p>
        </div>
      )}
    </div>
  );
}
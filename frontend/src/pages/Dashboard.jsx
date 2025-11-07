import React, { useEffect, useState } from 'react';
import API from '../api';
import BlogCard from '../components/BlogCard';

export default function Dashboard({ user }) {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await API.get('/blogs/all');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleLike = async (id) => {
    if (!user) return alert('Please login to like posts');
    try {
      await API.post(`/likes/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Discover</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map(b => <BlogCard key={b._id} blog={b} onLike={handleLike} currentUser={user} />)}
      </div>
    </div>
  );
}

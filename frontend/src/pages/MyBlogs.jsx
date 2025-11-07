import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api';
import BlogCard from '../components/BlogCard';

export default function MyBlogs({ user }) {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', image: '', tags: '' });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) fetchMyBlogs();
  }, [user]);

  const fetchMyBlogs = async () => {
    try {
      const res = await API.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  const startEdit = (blog) => {
    setEditing(blog);
    setForm({
      title: blog.title,
      content: blog.content,
      image: blog.image || '',
      tags: (blog.tags || []).join(', '),
    });
    setShowModal(true);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ title: '', content: '', image: '', tags: '' });
    setError('');
    setShowModal(false);
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this blog?')) return;
    try {
      await API.delete(`/blogs/${id}`);
      fetchMyBlogs();
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.content) return setError('Title and content required');

    try {
      if (editing) {
        await API.put(`/blogs/${editing._id}`, {
          title: form.title,
          content: form.content,
          image: form.image,
          tags: form.tags,
        });
      } else {
        await API.post('/blogs', {
          title: form.title,
          content: form.content,
          image: form.image,
          tags: form.tags,
        });
      }
      cancelEdit();
      fetchMyBlogs();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Blogs</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditing(null);
            setForm({ title: '', content: '', image: '', tags: '' });
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          + Create Blog
        </button>
      </div>

      {/* Blog List */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Your posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((b) => (
            <BlogCard
              key={b._id}
              blog={b}
              onEdit={startEdit}
              onDelete={() => onDelete(b._id)}
              onLike={() => {}}
              currentUser={{ id: user.id || user._id }}
            />
          ))}
        </div>
      </div>

      {/* Blurred Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg relative transform scale-100 animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={cancelEdit}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-3">
              {editing ? 'Edit Blog' : 'Create New Blog'}
            </h2>

            <form onSubmit={submit} className="space-y-3">
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Title"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <textarea
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your content..."
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <div className="flex gap-3 items-center">
                <input type="file" accept="image/*" onChange={handleImage} />
                {form.image && (
                  <img src={form.image} alt="preview" className="h-20 w-20 object-cover rounded" />
                )}
              </div>
              <input
                value={form.tags}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="Tags (comma separated)"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                  {editing ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

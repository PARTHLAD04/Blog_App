// frontend/src/pages/MyBlogs.jsx
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

  // AI states
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(''); // generated content
  const [aiError, setAiError] = useState('');

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

  // --- AI functions ---
  const openAiModal = () => {
    setAiTopic('');
    setAiGenerated('');
    setAiError('');
    setShowAiModal(true);
  };

  const generateWithAI = async () => {
    if (!aiTopic || aiTopic.trim().length < 3) {
      setAiError('Please enter a topic or title (3+ characters).');
      return;
    }
    setAiError('');
    setAiLoading(true);
    setAiGenerated('');

    try {
      const res = await API.post('/ai/generate', { title: aiTopic });
      const generated = res?.data?.generated;
      if (!generated) {
        setAiError('No content returned from AI.');
      } else {
        setAiGenerated(generated);
        // Fill form.title + content so user can click Save to publish
        setForm((prev) => ({ ...prev, title: aiTopic, content: generated }));
      }
    } catch (err) {
      console.error('AI generation error', err);
      setAiError(err?.response?.data?.message || 'AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const saveAiAsBlog = async () => {
    // uses same create API
    if (!form.title || !form.content) {
      setAiError('Title and content required to save.');
      return;
    }
    try {
      await API.post('/blogs', {
        title: form.title,
        content: form.content,
        image: form.image,
        tags: form.tags
      });
      // Reset and close AI modal
      setShowAiModal(false);
      setForm({ title: '', content: '', image: '', tags: '' });
      fetchMyBlogs();
    } catch (err) {
      console.error('Save AI blog error', err);
      setAiError(err?.response?.data?.message || 'Failed to save blog');
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Blogs</h2>

        <div className="flex items-center gap-3">
          {/* Create Blog */}
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

          {/* AI Blog FAB / Button */}
          <button
            onClick={openAiModal}
            title="Generate blog with AI"
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition flex items-center gap-2"
          >
            {/* simple icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5.5A2.5 2.5 0 014.5 3h11A2.5 2.5 0 0118 5.5V9a1 1 0 01-1 1h-1v5a2 2 0 01-2 2H6a2 2 0 01-2-2V10H3a1 1 0 01-1-1V5.5z" />
            </svg>
            AI Blog
          </button>
        </div>
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

      {/* Create/Edit Modal (existing) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg relative">
            <button onClick={cancelEdit} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl">✕</button>

            <h2 className="text-xl font-semibold mb-3">{editing ? 'Edit Blog' : 'Create New Blog'}</h2>

            <form onSubmit={submit} className="space-y-3">
              <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Title" className="w-full p-2 border rounded" />
              <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} placeholder="Write your content..." className="w-full p-2 border rounded h-32" />
              <div className="flex gap-3 items-center">
                <input type="file" accept="image/*" onChange={handleImage} />
                {form.image && <img src={form.image} alt="preview" className="h-20 w-20 object-cover rounded" />}
              </div>
              <input value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} placeholder="Tags (comma separated)" className="w-full p-2 border rounded" />
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex justify-end gap-3 mt-3">
                <button type="button" onClick={cancelEdit} className="px-4 py-2 border rounded">Cancel</button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded">{editing ? 'Update' : 'Publish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl relative">
            <button onClick={() => setShowAiModal(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl">✕</button>

            <h2 className="text-xl font-semibold mb-3">Generate Blog with AI</h2>

            {/* Topic input */}
            <div className="space-y-2">
              <label className="text-sm">Enter a blog title or topic</label>
              <input value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g., '5 Tips for Productive Remote Work'" className="w-full p-2 border rounded" />
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button onClick={generateWithAI} disabled={aiLoading} className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition flex items-center gap-2">
                {aiLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                    Generating...
                  </>
                ) : 'Generate'}
              </button>

              <button onClick={() => { setShowAiModal(false); }} className="px-4 py-2 border rounded">Close</button>
            </div>

            {/* AI error */}
            {aiError && <div className="text-sm text-red-600 mt-2">{aiError}</div>}

            {/* Generated preview / editor */}
            {aiGenerated ? (
              <div className="mt-4 space-y-3">
                <label className="text-sm">Preview (edit if you want)</label>
                <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Title" className="w-full p-2 border rounded" />
                <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} className="w-full p-2 border rounded h-64" />
                <div className="flex justify-end gap-3">
                  <button onClick={() => { setForm({ title: '', content: '', image: '', tags: '' }); setAiGenerated(''); }} className="px-4 py-2 border rounded">Discard</button>
                  <button onClick={saveAiAsBlog} className="px-4 py-2 bg-indigo-600 text-white rounded">Save as Blog</button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-slate-600">After generation completes the blog content will appear here for preview and editing.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

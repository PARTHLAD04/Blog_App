import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api';
import BlogCard from '../components/BlogCard';
import { Sparkles, Plus, Image, Tag, X, Loader2, Wand2, Clock, PenTool } from 'lucide-react';

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
  const [aiGenerated, setAiGenerated] = useState('');
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
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
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
    reader.onload = () => setForm(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.content) return setError('Title and content are required');

    try {
      if (editing) {
        await API.put(`/blogs/${editing._id}`, {
          title: form.title,
          content: form.content,
          image: form.image,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        });
      } else {
        await API.post('/blogs', {
          title: form.title,
          content: form.content,
          image: form.image,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        });
      }
      cancelEdit();
      fetchMyBlogs();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save blog');
    }
  };

  // --- AI Functions ---
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
        setForm(prev => ({ ...prev, title: aiTopic, content: generated }));
      }
    } catch (err) {
      setAiError(err?.response?.data?.message || 'AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const saveAiAsBlog = async () => {
    if (!form.title || !form.content) {
      setAiError('Title and content required to save.');
      return;
    }
    try {
      await API.post('/blogs', {
        title: form.title,
        content: form.content,
        image: form.image,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setShowAiModal(false);
      setForm({ title: '', content: '', image: '', tags: '' });
      setAiGenerated('');
      fetchMyBlogs();
    } catch (err) {
      setAiError(err?.response?.data?.message || 'Failed to save blog');
    }
  };

  return (
    <div className="min-h-screen from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Blogs
            </h2>
            <p className="text-slate-600 mt-1">Manage your stories and generate new ones with AI</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Create Blog */}
            <button
              onClick={() => {
                setShowModal(true);
                setEditing(null);
                setForm({ title: '', content: '', image: '', tags: '' });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus size={20} />
              Create Blog
            </button>

            {/* AI Blog */}
            <button
              onClick={openAiModal}
              className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Wand2 size={20} />
              AI Blog
            </button>
          </div>
        </div>

        {/* Surat Time */}
        <p className="text-sm text-slate-500 flex items-center gap-1">
          <Clock size={14} />
          {new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }).toLowerCase()} in Surat, Gujarat
        </p>

        {/* Blog Grid */}
        <div>
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <PenTool size={48} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No blogs yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Start writing your first blog or generate one with AI!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b, i) => (
                <div
                  key={b._id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <BlogCard
                    blog={b}
                    onEdit={startEdit}
                    onDelete={() => onDelete(b._id)}
                    onLike={() => { }}
                    currentUser={{ id: user.id || user._id }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
              <button
                onClick={cancelEdit}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl text-white">
                  {editing ? <PenTool size={28} /> : <Plus size={28} />}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editing ? 'Edit Blog' : 'Create New Blog'}
                </h2>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a catchy title..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your story..."
                    rows={8}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                  />

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Image</label>
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors">
                      <Image size={20} />
                      <span>{form.image ? 'Change Image' : 'Upload Image'}</span>
                      <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                    </label>
                    {form.image && (
                      <img src={form.image} alt="preview" className="mt-3 h-32 w-full object-cover rounded-xl shadow-md" />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                    <div className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl">
                      <Tag size={20} className="text-slate-400" />
                      <input
                        value={form.tags}
                        onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="tech, life, travel..."
                        className="flex-1 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {editing ? 'Update Blog' : 'Publish Blog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI Modal */}
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 relative">
              <button
                onClick={() => setShowAiModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl text-white">
                  <Sparkles size={28} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Generate Blog with AI</h2>
              </div>

              {/* Topic Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Blog Title or Topic</label>
                <input
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="e.g., '5 Tips for Productive Remote Work'"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={generateWithAI}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      Generate Content
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="px-6 py-3 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>

              {aiError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  {aiError}
                </div>
              )}

              {/* Generated Content */}
              {aiGenerated && (
                <div className="space-y-5 mt-6 p-6 bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles size={20} className="text-emerald-600" />
                    AI-Generated Blog
                  </h3>

                  <input
                    value={form.title}
                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Edit title..."
                    className="w-full px-4 py-3 border border-emerald-300 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  <textarea
                    value={form.content}
                    onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="w-full px-4 py-3 border border-emerald-300 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                    <div className="flex items-center gap-2 px-4 py-3 border border-emerald-300 rounded-xl bg-white/70">
                      <Tag size={20} className="text-emerald-400" />
                      <input
                        value={form.tags}
                        onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                        placeholder="ai, technology, writing..."
                        className="flex-1 outline-none bg-transparent"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Separate multiple tags with commas</p>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload Image</label>
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer hover:border-emerald-400 transition-colors">
                      <Image size={20} className="text-emerald-500" />
                      <span>{form.image ? 'Change Image' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () =>
                            setForm((prev) => ({ ...prev, image: reader.result }));
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                    </label>
                    {form.image && (
                      <img
                        src={form.image}
                        alt="Preview"
                        className="mt-3 h-40 w-full object-cover rounded-xl shadow-md border border-emerald-200"
                      />
                    )}
                  </div>


                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setForm({ title: '', content: '', image: '', tags: '' });
                        setAiGenerated('');
                      }}
                      className="px-5 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      onClick={saveAiAsBlog}
                      className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                      Save as Blog
                    </button>
                  </div>
                </div>
              )}

              {!aiGenerated && !aiLoading && (
                <p className="text-center text-slate-500 italic">
                  Enter a topic above and click "Generate" to create a blog with AI
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
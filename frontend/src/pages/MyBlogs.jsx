import { useEffect, useState } from 'react';
import API from '../api';

const MyBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my-posts'); // 'my-posts' or 'all-posts'

  // Create / Update states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);

  const userId = localStorage.getItem('userId');

  // 🔹 Fetch all posts (user + others)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/posts');
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🔹 Create blog
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await API.post('/posts', { title, content, tags: tagsArray });
      setTitle('');
      setContent('');
      setTags('');
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Update blog
  const handleUpdatePost = async (postId) => {
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await API.put(`/posts/${postId}`, { title, content, tags: tagsArray });
      setEditingPostId(null);
      setTitle('');
      setContent('');
      setTags('');
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Delete blog
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await API.delete(`/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Load post data into form for editing
  const startEdit = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setTags(post.tags?.join(', ') || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter posts based on active tab
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'my-posts') {
      return post.author?._id === userId;
    }
    return true; // Show all posts
  });

  const myPostsCount = posts.filter(post => post.author?._id === userId).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAE0CF]/10 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#213448] to-[#547792] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Blog Space</h1>
              <p className="text-[#94B4C1] mt-1">Create, edit, and manage your content</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="px-3 py-1.5 bg-white/10 rounded-full">
                <span className="font-medium">{myPostsCount}</span> posts created
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Create/Edit Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#213448] to-[#547792] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#213448]">
                      {editingPostId ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    <p className="text-sm text-[#547792]">
                      {editingPostId ? 'Update your existing post' : 'Share your thoughts with the world'}
                    </p>
                  </div>
                </div>

                <form onSubmit={editingPostId ? () => handleUpdatePost(editingPostId) : handleCreatePost}>
                  {/* Title Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#213448] mb-2">
                      Post Title
                    </label>
                    <input
                      type="text"
                      placeholder="What's on your mind?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Content Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#213448] mb-2">
                      Content
                    </label>
                    <textarea
                      placeholder="Write your story here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Tags Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#213448] mb-2">
                      Tags
                      <span className="text-xs font-normal text-[#547792] ml-1">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="technology, lifestyle, tips"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-[#547792] mt-2">Add relevant tags to help others discover your post</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#213448] to-[#547792] text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      {editingPostId ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Update Post
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Publish Post
                        </span>
                      )}
                    </button>

                    {editingPostId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPostId(null);
                          setTitle('');
                          setContent('');
                          setTags('');
                        }}
                        className="px-4 py-3 border border-[#94B4C1] text-[#547792] rounded-lg font-medium hover:bg-[#EAE0CF]/20 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Quick Tips */}
                  <div className="mt-6 pt-6 border-t border-[#EAE0CF]">
                    <h3 className="text-sm font-medium text-[#213448] mb-2">Quick Tips</h3>
                    <ul className="text-xs text-[#547792] space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-[#94B4C1] mt-0.5">•</span>
                        Keep titles clear and descriptive
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#94B4C1] mt-0.5">•</span>
                        Use tags to increase visibility
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#94B4C1] mt-0.5">•</span>
                        Add images when possible (coming soon)
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Posts List */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-lg mb-6 overflow-hidden">
              <div className="border-b border-[#EAE0CF]">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('my-posts')}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === 'my-posts' 
                      ? 'text-[#213448] border-b-2 border-[#213448]' 
                      : 'text-[#547792] hover:text-[#213448] hover:bg-[#EAE0CF]/10'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Posts
                      <span className="text-xs bg-[#EAE0CF] text-[#213448] px-2 py-0.5 rounded-full">
                        {myPostsCount}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('all-posts')}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === 'all-posts' 
                      ? 'text-[#213448] border-b-2 border-[#213448]' 
                      : 'text-[#547792] hover:text-[#213448] hover:bg-[#EAE0CF]/10'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      All Posts
                      <span className="text-xs bg-[#EAE0CF] text-[#213448] px-2 py-0.5 rounded-full">
                        {posts.length}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#94B4C1] border-t-[#213448]"></div>
                <p className="mt-4 text-[#547792] font-medium">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-lg p-12 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#EAE0CF] flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-[#547792]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#213448] mb-2">
                  {activeTab === 'my-posts' ? 'No posts yet' : 'No posts available'}
                </h3>
                <p className="text-[#547792] max-w-md mx-auto mb-6">
                  {activeTab === 'my-posts' 
                    ? 'Start by creating your first blog post! Share your thoughts, ideas, or experiences with the community.'
                    : 'There are no posts in the community yet. Be the first to share!'}
                </p>
                {activeTab === 'my-posts' && !editingPostId && (
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-gradient-to-r from-[#213448] to-[#547792] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                  >
                    Create Your First Post
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => {
                  const isMyPost = post.author?._id === userId;
                  return (
                    <div
                      key={post._id}
                      className="bg-white rounded-2xl border border-[#EAE0CF] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Post Header */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-[#213448] group-hover:text-[#547792] transition-colors">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isMyPost ? 'bg-green-500' : 'bg-[#94B4C1]'}`}></div>
                                <span className="text-sm font-medium text-[#547792]">
                                  {post.author?.name || 'Anonymous'}
                                </span>
                                {isMyPost && (
                                  <span className="text-xs bg-[#EAE0CF] text-[#213448] px-2 py-0.5 rounded-full">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-[#94B4C1]">•</span>
                              <span className="text-sm text-[#547792]">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          {isMyPost && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-[#EAE0CF] flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#213448]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content Preview */}
                        <p className="text-[#547792] mb-4 line-clamp-3">
                          {post.content}
                        </p>

                        {/* Tags */}
                        {post.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-[#EAE0CF] text-[#213448] rounded-full text-xs font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Post Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#EAE0CF]">
                          <div className="flex items-center gap-4 text-sm text-[#547792]">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              <span>{post.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>{post.comments?.length || 0}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {isMyPost && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => startEdit(post)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#EAE0CF] text-[#213448] rounded-lg font-medium hover:bg-[#EAE0CF]/80 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePost(post._id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Stats Footer */}
            <div className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-[#EAE0CF] text-center">
                  <div className="text-2xl font-bold text-[#213448]">{filteredPosts.length}</div>
                  <div className="text-sm text-[#547792]">{activeTab === 'my-posts' ? 'Your Posts' : 'Total Posts'}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#EAE0CF] text-center">
                  <div className="text-2xl font-bold text-[#213448]">
                    {posts.reduce((sum, post) => sum + (post.likes || 0), 0)}
                  </div>
                  <div className="text-sm text-[#547792]">Total Likes</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#EAE0CF] text-center">
                  <div className="text-2xl font-bold text-[#213448]">
                    {[...new Set(posts.map(p => p.author?._id))].length}
                  </div>
                  <div className="text-sm text-[#547792]">Active Authors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBlog;
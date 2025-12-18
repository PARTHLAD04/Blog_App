import { useEffect, useState } from 'react';
import API from '../api';
import PostCard from '../components/PostCard';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    trending: 0
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');

      let res;

      // 🔍 If search query exists → search API
      if (searchQuery.trim()) {
        res = await API.get(
          `/posts/search?q=${encodeURIComponent(searchQuery.trim())}`
        );
        setPosts(res.data.posts || []);
      } 
      // 📄 Else → fetch all posts
      else {
        res = await API.get('/posts');
        const allPosts = res.data.posts || [];
        setPosts(allPosts);
        
        // Calculate stats
        const published = allPosts.filter(p => p.status === 'published').length;
        const draft = allPosts.filter(p => p.status === 'draft').length;
        const trending = allPosts.filter(p => p.likes > 10).length;
        
        setStats({
          total: allPosts.length,
          published,
          draft,
          trending
        });
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'published') return post.status === 'published';
      if (activeFilter === 'draft') return post.status === 'draft';
      if (activeFilter === 'trending') return post.likes > 10;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
      return 0;
    });

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAE0CF]/10 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#213448] to-[#547792] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-[#94B4C1] mt-1">Manage and monitor your content</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchPosts}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#213448] rounded-lg font-semibold hover:bg-white/90 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-[#EAE0CF] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#547792] text-sm font-medium">Total Posts</p>
                <p className="text-3xl font-bold text-[#213448] mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#EAE0CF] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#213448]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#EAE0CF]">
              <span className="text-sm text-[#547792]">From all statuses</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#EAE0CF] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#547792] text-sm font-medium">Published</p>
                <p className="text-3xl font-bold text-[#213448] mt-2">{stats.published}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#EAE0CF]">
              <span className="text-sm text-green-600">Visible to public</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#EAE0CF] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#547792] text-sm font-medium">Drafts</p>
                <p className="text-3xl font-bold text-[#213448] mt-2">{stats.draft}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#EAE0CF]">
              <span className="text-sm text-yellow-600">Work in progress</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#EAE0CF] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#547792] text-sm font-medium">Trending</p>
                <p className="text-3xl font-bold text-[#213448] mt-2">{stats.trending}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#EAE0CF]">
              <span className="text-sm text-purple-600">10+ likes each</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-[#EAE0CF] shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#213448] mb-2">
                Search Posts
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by title, content, tags, or author..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-10 py-3 border border-[#94B4C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-[#547792] hover:text-[#213448]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-[#547792] mt-2">
                Press Enter to search or type to filter in real-time
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-[#213448] mb-2">
                  Filter by
                </label>
                <div className="flex gap-2">
                  {['all', 'published', 'draft', 'trending'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeFilter === filter 
                        ? 'bg-[#213448] text-white' 
                        : 'bg-[#EAE0CF] text-[#213448] hover:bg-[#EAE0CF]/80'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#213448] mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-[#94B4C1] rounded-lg bg-white text-[#213448] focus:outline-none focus:ring-2 focus:ring-[#213448]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="likes">Most Liked</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl border border-[#EAE0CF] shadow-sm overflow-hidden">
          {/* Header */}
          <div className="border-b border-[#EAE0CF] px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#213448]">
                  Your Posts
                  <span className="ml-2 text-sm font-normal text-[#547792] bg-[#EAE0CF] px-3 py-1 rounded-full">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                  </span>
                </h2>
                <p className="text-sm text-[#547792] mt-1">
                  Manage and organize your content collection
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#547792]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                Actions
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#94B4C1] border-t-[#213448]"></div>
              <p className="mt-4 text-[#547792] font-medium">Loading your posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#213448] mb-2">Unable to Load Posts</h3>
              <p className="text-[#547792] mb-6">{error}</p>
              <button
                onClick={fetchPosts}
                className="bg-gradient-to-r from-[#213448] to-[#547792] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-md transition-shadow"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredPosts.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#EAE0CF] flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-[#547792]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#213448] mb-2">No posts found</h3>
              <p className="text-[#547792] max-w-md mx-auto mb-6">
                {searchQuery 
                  ? `No posts match "${searchQuery}". Try a different search or clear the filters.`
                  : activeFilter !== 'all'
                  ? `You have no ${activeFilter} posts.`
                  : 'Start by creating your first post!'}
              </p>
              <div className="flex gap-3 justify-center">
                {(searchQuery || activeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                    className="px-6 py-2 bg-[#213448] text-white rounded-lg font-medium hover:bg-[#213448]/90 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
                <button className="px-6 py-2 bg-gradient-to-r from-[#213448] to-[#547792] text-white rounded-lg font-semibold hover:shadow-md transition-shadow">
                  Create New Post
                </button>
              </div>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && !error && filteredPosts.length > 0 && (
            <div className="divide-y divide-[#EAE0CF]">
              {filteredPosts.map((post) => (
                <div key={post._id} className="hover:bg-[#EAE0CF]/20 transition-colors">
                  <PostCard
                    post={post}
                    refreshPosts={fetchPosts}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {!loading && !error && filteredPosts.length > 0 && (
            <div className="border-t border-[#EAE0CF] px-6 py-4">
              <div className="flex items-center justify-between text-sm text-[#547792]">
                <div>
                  Showing <span className="font-medium text-[#213448]">{filteredPosts.length}</span> of{' '}
                  <span className="font-medium text-[#213448]">{posts.length}</span> posts
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 hover:text-[#213448] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <span className="text-[#213448] font-medium">1</span>
                  <button className="flex items-center gap-2 hover:text-[#213448] transition-colors">
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-[#213448] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-white border border-[#EAE0CF] rounded-xl hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#EAE0CF] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#213448]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-[#213448]">New Post</p>
                <p className="text-sm text-[#547792]">Start writing</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-white border border-[#EAE0CF] rounded-xl hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-[#213448]">Export Data</p>
                <p className="text-sm text-[#547792]">Download as CSV</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-white border border-[#EAE0CF] rounded-xl hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-[#213448]">Analytics</p>
                <p className="text-sm text-[#547792]">View insights</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
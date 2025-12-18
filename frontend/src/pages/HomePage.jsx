import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../api';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getAllPosts();
      setPosts(res.data.posts || []);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags
  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EAE0CF]/20 to-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-[#94B4C1] border-t-[#213448] rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-[#213448]">Loading Stories</h2>
        <p className="text-[#547792] mt-2">Fetching the latest posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EAE0CF]/20 to-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#213448] mb-2">Oops! Something went wrong</h2>
          <p className="text-[#547792] mb-6">{error}</p>
          <button
            onClick={fetchPosts}
            className="bg-gradient-to-r from-[#213448] to-[#547792] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAE0CF]/10 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#213448] to-[#547792] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Discover Stories & Ideas
            </h1>
            <p className="text-xl text-[#94B4C1] mb-8">
              Explore thoughts, experiences, and insights from our community of writers and thinkers.
            </p>
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search stories, authors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-[#94B4C1] focus:outline-none focus:ring-2 focus:ring-[#94B4C1] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#213448]">
              Featured Stories
              <span className="ml-2 text-sm font-normal text-[#547792] bg-[#EAE0CF] px-3 py-1 rounded-full">
                {filteredAndSortedPosts.length} {filteredAndSortedPosts.length === 1 ? 'story' : 'stories'}
              </span>
            </h2>
            <p className="text-[#547792] mt-1">Discover inspiring content from our community</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-[#94B4C1] rounded-lg bg-white text-[#213448] focus:outline-none focus:ring-2 focus:ring-[#213448]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-[#94B4C1] rounded-lg bg-white text-[#213448] focus:outline-none focus:ring-2 focus:ring-[#213448]"
            >
              <option value="">All Topics</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>

            <button
              onClick={fetchPosts}
              className="flex items-center gap-2 px-4 py-2 bg-[#EAE0CF] text-[#213448] rounded-lg font-medium hover:bg-[#EAE0CF]/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Tag Filters */}
        {allTags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#213448] mb-3">Browse by Topic</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedTag ? 'bg-[#213448] text-white' : 'bg-[#EAE0CF] text-[#213448] hover:bg-[#EAE0CF]/80'}`}
              >
                All
              </button>
              {allTags.slice(0, 8).map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTag === tag ? 'bg-[#547792] text-white' : 'bg-[#94B4C1]/20 text-[#213448] hover:bg-[#94B4C1]/30'}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#EAE0CF] flex items-center justify-center">
              <svg className="w-12 h-12 text-[#547792]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#213448] mb-2">No stories found</h3>
            <p className="text-[#547792] max-w-md mx-auto">
              {searchTerm || selectedTag 
                ? `No posts match "${searchTerm || selectedTag}". Try a different search or clear filters.`
                : 'Be the first to share your story!'}
            </p>
            {searchTerm || selectedTag ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
                }}
                className="mt-4 px-6 py-2 bg-[#213448] text-white rounded-lg font-medium hover:bg-[#213448]/90 transition-colors"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPosts.map((post) => (
              <article 
                key={post._id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#EAE0CF] hover:-translate-y-1"
              >
                {/* Post Image Placeholder */}
                <div className="h-48 bg-gradient-to-r from-[#213448]/20 to-[#547792]/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-16 h-16 text-[#213448]/30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 8h-4v-2h4v2zm3-6c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-3-2h-4v2h4V7z"/>
                    </svg>
                  </div>
                  {/* Author Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#213448] to-[#547792]"></div>
                      <span className="text-sm font-medium text-[#213448]">
                        {post.author?.name || 'Anonymous'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#547792] font-medium">
                      {formatDate(post.createdAt)}
                    </span>
                    <div className="flex items-center gap-1 text-[#94B4C1]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="text-xs">42</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-[#213448] mb-3 group-hover:text-[#547792] transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-[#547792] mb-4 line-clamp-3">
                    {post.content}
                  </p>

                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#EAE0CF] text-[#213448] rounded-full text-xs font-medium hover:bg-[#EAE0CF]/80 transition-colors cursor-pointer"
                          onClick={() => setSelectedTag(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-3 py-1 bg-[#94B4C1]/20 text-[#547792] rounded-full text-xs">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Read More Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-[#213448] to-[#213448] text-white rounded-lg font-semibold hover:from-[#547792] hover:to-[#547792] transition-all duration-300 group-hover:shadow-md">
                    Read Full Story
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-12 pt-8 border-t border-[#EAE0CF]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#213448] mb-2">{posts.length}</div>
              <div className="text-[#547792]">Total Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#213448] mb-2">{allTags.length}</div>
              <div className="text-[#547792]">Topics Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#213448] mb-2">
                {[...new Set(posts.map(p => p.author?._id))].length}
              </div>
              <div className="text-[#547792]">Active Writers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
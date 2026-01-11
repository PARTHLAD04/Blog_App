import { useState, useEffect } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import { Search, TrendingUp, Clock, Filter, Sparkles, Users, BookOpen, Zap } from 'lucide-react';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const fetchPosts = async (query = '') => {
        setLoading(true);
        try {
            let url = '/posts';
            if (query.trim()) {
                url = `/posts/search?q=${encodeURIComponent(query)}`;
            }

            const { data } = await api.get(url);
            setPosts(data.posts || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError("Failed to load posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPosts(searchQuery);
    };

    const filters = [
        { id: 'all', label: 'All Posts' },
        { id: 'trending', label: 'Trending' },
        { id: 'latest', label: 'Latest' },
        { id: 'popular', label: 'Most Popular' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero / Search Section */}
            <div className="relative bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-700">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                            <Sparkles className="w-4 h-4 text-emerald-300" />
                            <span className="text-white/90 text-sm font-medium">Welcome to Our Community</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Discover <span className="text-emerald-300">Knowledge</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Explore the latest articles, tutorials, and perspectives from our community of experts and creators.
                        </p>

                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search topics, authors, or keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-12 pr-24 py-4 text-lg rounded-2xl border-0 shadow-xl bg-white/95 focus:bg-white focus:ring-3 focus:ring-emerald-500 focus:ring-opacity-50 outline-none transition-all duration-200"
                                />
                                <button
                                    type="submit"
                                    className="absolute inset-y-1 right-1 px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all duration-200 flex items-center gap-2 shadow-lg"
                                >
                                    <Search className="w-5 h-5" />
                                    Search
                                </button>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 mt-6">
                                <span className="text-white/80 text-sm">Popular:</span>
                                {['Technology', 'Design', 'Business', 'Health', 'Science'].map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery(tag);
                                            fetchPosts(tag);
                                        }}
                                        className="px-4 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-colors border border-white/20"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="relative bg-gradient-to-t from-white/5 to-transparent">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center justify-center gap-4 text-white">
                                <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                                    <BookOpen className="w-6 h-6 text-emerald-300" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">1,200+</div>
                                    <div className="text-white/80">Active Articles</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-white">
                                <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                                    <Users className="w-6 h-6 text-blue-300" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">150+</div>
                                    <div className="text-white/80">Expert Authors</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-white">
                                <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                                    <Zap className="w-6 h-6 text-amber-300" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">24/7</div>
                                    <div className="text-white/80">Updated Content</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filter Section */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                Latest Articles
                                <span className="text-lg font-normal text-gray-600 ml-2">
                                    ({posts.length} {posts.length === 1 ? 'post' : 'posts'})
                                </span>
                            </h2>
                            <p className="text-gray-600 mt-2">Curated content from thought leaders</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                                <Filter className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">Filter by:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setSelectedFilter(filter.id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            selectedFilter === filter.id
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
                            <p className="text-gray-600 text-lg">Loading content...</p>
                            <p className="text-gray-500 mt-2">Fetching the latest articles for you</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button
                                onClick={() => fetchPosts()}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-colors shadow-md"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery.trim() 
                                    ? `No posts found matching "${searchQuery}"`
                                    : "No posts available at the moment"}
                            </p>
                            <p className="text-gray-500 text-sm mb-6">Try searching with different keywords</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    fetchPosts();
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-colors shadow-md"
                            >
                                View All Posts
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <div key={post._id} className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More Section */}
                {!loading && !error && posts.length > 0 && (
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-2 text-gray-500 mb-4">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                            <span className="px-4 text-sm font-medium">You've seen all posts</span>
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                        </div>
                        <p className="text-gray-600 mb-6">Check back soon for more content</p>
                        <button
                            onClick={() => fetchPosts()}
                            className="px-6 py-3 border-2 border-gray-300 hover:border-emerald-400 text-gray-700 hover:text-emerald-700 font-semibold rounded-lg transition-all duration-200 hover:bg-emerald-50"
                        >
                            Refresh Posts
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
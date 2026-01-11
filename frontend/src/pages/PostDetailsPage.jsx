import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import { Loader, Heart, Bookmark, User, Calendar, Edit, Trash, Eye, Clock, Share2, ChevronLeft, TrendingUp, MessageSquare, BookOpen, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const PostDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/posts/${id}`);
                setPost(data);
            } catch (err) {
                setError("Post not found or has been removed");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleLike = async () => {
        if (!user) {
            toast.error("Please login to like posts");
            return;
        }
        try {
            const { data } = await api.post(`/posts/${id}/like`);
            setPost(prev => ({ ...prev, likes: data.likes }));
            setIsLiked(!isLiked);
            if (isLiked) {
                toast.success("Like removed");
            } else {
                toast.success("Post liked!");
            }
        } catch (error) {
            if (error.response?.status === 401) toast.error("Please login to like");
            else toast.error("Failed to like post");
        }
    };

    const handleBookmark = async () => {
        if (!user) {
            toast.error("Please login to bookmark posts");
            return;
        }
        try {
            await api.post(`/posts/${id}/bookmark`);
            setIsBookmarked(!isBookmarked);
            toast.success(isBookmarked ? "Bookmark removed" : "Post bookmarked!");
        } catch (error) {
            if (error.response?.status === 401) toast.error("Please login to bookmark");
            else if (error.response?.status === 400) toast.info("Already bookmarked");
            else toast.error("Failed to bookmark");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
        try {
            await api.delete(`/posts/${id}`);
            toast.success("Post deleted successfully");
            navigate('/');
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading post...</p>
                    <p className="text-gray-400 mt-2">Fetching content for you</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">{error}</h1>
                    <p className="text-gray-600 mb-6">The post you're looking for might have been removed or doesn't exist.</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center space-x-2 px-5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors border border-gray-300"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Go Back</span>
                        </button>
                        <Link
                            to="/"
                            className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 font-medium transition-all"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Browse Posts</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) return null;

    const formattedDate = post.createdAt ? format(new Date(post.createdAt), 'MMMM d, yyyy') : '';
    const readTime = Math.ceil((post.content?.length || 0) / 1000);
    const isTrending = post.likes > 20;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Back Navigation */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group mb-6"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Posts</span>
                </button>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Header */}
                <header className="mb-10">
                    {/* Author & Meta Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">
                                    {post.author?.name || "Unknown Author"}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                                    <span className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formattedDate}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{readTime} min read</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{post.viewCount || 0} views</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {user && (user._id === post.author?._id || user._id === post.author) && (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => navigate(`/edit-post/${id}`)}
                                    className="flex items-center space-x-2 px-4 py-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                >
                                    <Trash className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag, i) => (
                                <span 
                                    key={i}
                                    className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:text-emerald-900 hover:from-emerald-100 hover:to-teal-100 text-sm font-medium rounded-full transition-colors cursor-pointer border border-emerald-100"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Post Stats */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-b border-gray-200 mb-8">
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all border ${
                                    isLiked 
                                        ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border-red-200' 
                                        : 'text-gray-600 hover:text-red-500 hover:bg-gray-50 border-gray-200 hover:border-red-200'
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                <span className="font-semibold">{post.likes || 0}</span>
                                <span>Likes</span>
                            </button>
                            <div className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-semibold">{post.commentCount || 0}</span>
                                <span>Comments</span>
                            </div>
                            {isTrending && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 rounded-full border border-amber-200">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-medium">Trending</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleBookmark}
                                className={`p-2 rounded-lg transition-all border ${
                                    isBookmarked 
                                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-500 border-amber-200' 
                                        : 'text-gray-400 hover:text-amber-500 hover:bg-gray-50 border-gray-200 hover:border-amber-200'
                                }`}
                                title={isBookmarked ? "Remove bookmark" : "Bookmark post"}
                            >
                                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-gray-200 hover:border-emerald-200"
                                title="Share post"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-12">
                    <div 
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                    />
                </div>

                {/* Final Action Bar */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-12 border border-emerald-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-center sm:text-left">
                            <h3 className="font-bold text-gray-800">Enjoyed this post?</h3>
                            <p className="text-gray-600 text-sm">Share your thoughts in the comments below</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-medium transition-all border ${
                                    isLiked 
                                        ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-600' 
                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300 hover:text-red-600'
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                <span>{isLiked ? 'Liked' : 'Like'} ({post.likes || 0})</span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md hover:shadow-lg"
                            >
                                <Share2 className="w-5 h-5" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mb-8">
                    <CommentSection postId={id} />
                </div>

                {/* Related Posts Section */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <BookOpen className="w-6 h-6 mr-2 text-emerald-600" />
                        Continue Reading
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link 
                            to="/"
                            className="block p-6 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-xl border border-emerald-100 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-emerald-600">Next Post</div>
                                <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Explore more content</h4>
                            <p className="text-gray-600 text-sm">Discover other interesting articles in our community</p>
                        </Link>
                        <Link 
                            to="/create-post"
                            className="block p-6 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl border border-blue-100 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-blue-600">Create Your Own</div>
                                <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Share your knowledge</h4>
                            <p className="text-gray-600 text-sm">Start writing and share your thoughts with the community</p>
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default PostDetailsPage;
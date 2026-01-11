import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Trash2, Send, MessageSquare, LogIn, Users, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchComments = async () => {
        try {
            const { data } = await api.get(`/comments/${postId}`);
            setComments(data.comments || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const { data } = await api.post(`/comments/${postId}`, { comment: newComment });
            setComments([data.comment, ...comments]);
            fetchComments();
            setNewComment('');
            toast.success("Comment added!");
        } catch (error) {
            toast.error("Failed to add comment");
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await api.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
            toast.success("Comment deleted");
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                        <MessageSquare className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">
                            Comments
                        </h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-500 text-sm">
                                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                            </span>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-500 text-sm">
                                Join the conversation
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="hidden md:block px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-100">
                    <span className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Community Discussion
                    </span>
                </div>
            </div>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-sm">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="mb-4">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share your thoughts on this post..."
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white transition-all duration-200 outline-none resize-none"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Press Enter to submit
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-semibold transition-all ${
                                        newComment.trim()
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-md hover:shadow-lg'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300'
                                    }`}
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Post Comment</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <LogIn className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-gray-700">
                                    Please <a href="/login" className="font-semibold text-emerald-600 hover:text-emerald-800">login</a> to join the discussion.
                                </p>
                            </div>
                        </div>
                        <a
                            href="/login"
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all shadow-sm hover:shadow"
                        >
                            Sign In
                        </a>
                    </div>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mx-auto mb-3"></div>
                            <span className="text-gray-600">Loading comments...</span>
                        </div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                            <MessageSquare className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">No comments yet</h4>
                        <p className="text-gray-600 max-w-md mx-auto mb-4">
                            Be the first to share your thoughts on this post.
                        </p>
                        {!user && (
                            <a
                                href="/login"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all"
                            >
                                <LogIn className="w-4 h-4" />
                                Sign in to comment
                            </a>
                        )}
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div 
                            key={comment._id} 
                            className="group p-5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 hover:border-emerald-100"
                        >
                            <div className="flex space-x-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-sm">
                                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </div>
                                
                                {/* Comment Content */}
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                                        <div>
                                            <h5 className="font-semibold text-gray-800">
                                                {comment.user?.name || 'Unknown User'}
                                            </h5>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                                <span>
                                                    {comment.createdAt ? 
                                                        formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) 
                                                        : ''}
                                                </span>
                                                {user?._id === comment.user?._id && (
                                                    <>
                                                        <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                                                        <span className="text-emerald-600 font-medium">You</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Delete Button */}
                                        {user && (user._id === comment.user?._id || user._id === comment.user) && (
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200 mt-2 sm:mt-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Delete</span>
                                            </button>
                                        )}
                                    </div>
                                    
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {comment.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
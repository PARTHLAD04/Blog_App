import { useEffect, useState } from 'react';
import API, { getComments, createComment, deleteComment } from '../api';

const PostCard = ({ post, refreshPosts }) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [localLikes, setLocalLikes] = useState(post.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const userId = localStorage.getItem('userId');
    const isAuthor = post.author?._id === userId;

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    // Fetch comments for this post
    const fetchComments = async () => {
        try {
            setIsLoadingComments(true);
            const res = await getComments(post._id);
            setComments(res.data.comments || []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [post._id, showComments]);

    // Like post
    const handleLike = async () => {
        try {
            const res = await API.post(`/posts/${post._id}/like`);
            if (res.data.likes !== undefined) {
                setLocalLikes(res.data.likes);
                setIsLiked(true);
                setTimeout(() => setIsLiked(false), 1000);
            }
            refreshPosts?.();
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    // Add comment
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            setIsSubmittingComment(true);
            await createComment(post._id, { comment: commentText });
            setCommentText('');
            fetchComments();
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // Delete comment
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await deleteComment(commentId);
            fetchComments();
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    return (
        // Added mb-8 for spacing between post cards
        <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group mb-8">
            {/* Post Header */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-[#213448] group-hover:text-[#547792] transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#213448] to-[#547792] flex items-center justify-center text-white text-sm font-bold">
                                    {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-[#213448]">
                                        {post.author?.name || 'Anonymous'}
                                    </div>
                                    <div className="text-xs text-[#547792]">
                                        {formatDate(post.createdAt)}
                                    </div>
                                </div>
                            </div>
                            {isAuthor && (
                                <span className="px-2 py-1 bg-[#EAE0CF] text-[#213448] rounded-full text-xs font-medium">
                                    Your Post
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                    <p className="text-[#547792] leading-relaxed line-clamp-3">
                        {post.content}
                    </p>
                </div>

                {/* Tags */}
                {post.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
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

                {/* Stats & Actions */}
                <div className="mt-6 pt-4 border-t border-[#EAE0CF] flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 group"
                        >
                            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${isLiked ? 'scale-110' : 'group-hover:scale-110'}`}>
                                <div className={`absolute inset-0 rounded-full transition-all ${isLiked ? 'bg-red-100 scale-100' : 'bg-[#EAE0CF] group-hover:bg-red-50 scale-0 group-hover:scale-100'}`}></div>
                                <svg className={`w-5 h-5 relative transition-all ${isLiked ? 'text-red-500 scale-125' : 'text-[#547792] group-hover:text-red-500'}`} 
                                     fill={isLiked ? "currentColor" : "none"} 
                                     stroke="currentColor" 
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-[#213448]">{localLikes}</div>
                                <div className="text-xs text-[#547792]">Likes</div>
                            </div>
                        </button>

                        {/* Comment Toggle */}
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-[#EAE0CF] transition-colors">
                                <svg className="w-5 h-5 text-[#547792] group-hover:text-[#213448]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-[#213448]">{comments.length}</div>
                                <div className="text-xs text-[#547792]">Comments</div>
                            </div>
                        </button>
                    </div>

                    <div className="text-sm text-[#547792]">
                        {post.createdAt !== post.updatedAt && (
                            <span className="text-xs italic">Edited</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="border-t border-[#EAE0CF] bg-[#EAE0CF]/10">
                    <div className="p-6">
                        {/* Add Comment Form */}
                        <form onSubmit={handleAddComment} className="mb-6">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            className="w-full pl-4 pr-12 py-3 border border-[#94B4C1] rounded-full focus:outline-none focus:ring-2 focus:ring-[#213448] focus:border-transparent transition-all"
                                            disabled={isSubmittingComment}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!commentText.trim() || isSubmittingComment}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-[#213448] to-[#547792] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
                                        >
                                            {isSubmittingComment ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {isLoadingComments ? (
                                <div className="text-center py-4">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#94B4C1] border-t-[#213448]"></div>
                                    <p className="text-sm text-[#547792] mt-2">Loading comments...</p>
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-4">
                                    <svg className="w-12 h-12 mx-auto text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-[#547792] mt-2">No comments yet. Be the first to comment!</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="bg-white rounded-xl p-4 border border-[#EAE0CF] group hover:border-[#94B4C1] transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#213448]/20 to-[#547792]/20 flex items-center justify-center text-[#213448] text-sm font-bold">
                                                    {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-[#213448]">
                                                            {comment.user?.name || 'Anonymous'}
                                                        </span>
                                                        <span className="text-xs text-[#547792]">
                                                            {formatDate(comment.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-[#547792] mt-1">{comment.comment || comment.text}</p>
                                                </div>
                                            </div>
                                            {comment.user?._id === userId && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                                                >
                                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
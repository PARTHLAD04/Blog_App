import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Bookmark, User, Clock, TrendingUp, Eye, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';

const PostCard = ({ post }) => {
    const { _id, title, content, author, likes, createdAt, tags, viewCount = 0 } = post;
    const [commentCount, setCommentCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchCommentCount = async () => {
            try {
                const { data } = await api.get(`/comments/${_id}`);
                if (isMounted) setCommentCount(data.count);
            } catch (error) {
                console.error("Error fetching comment count", error);
            }
        };
        fetchCommentCount();
        return () => { isMounted = false; };
    }, [_id]);

    // Create a plain text snippet from content
    const createSnippet = (htmlString) => {
        if (!htmlString) return '';
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        return doc.body.textContent || "";
    };

    const snippet = createSnippet(content).substring(0, 120) + '...';
    const formattedDate = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';

    return (
        <article className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col">
                {/* Top Gradient Bar */}
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                
                <div className="p-6 flex-1 flex flex-col">
                    {/* Author Info & Date */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full">
                                <User className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-800">
                                    {author?.name || 'Anonymous'}
                                </div>
                                <div className="flex items-center text-gray-500 text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formattedDate}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center text-gray-500 text-xs bg-gray-50 px-2 py-1 rounded-full border border-gray-200">
                                <Eye className="w-3 h-3 mr-1" />
                                <span>{viewCount}</span>
                            </div>
                            {likes > 10 && (
                                <div className="flex items-center text-xs bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    <span className="text-xs font-medium">Trending</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <Link to={`/posts/${_id}`} className="flex-1 flex flex-col group">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {title}
                        </h3>
                        <p className="text-gray-600 mb-4 flex-1 line-clamp-3 leading-relaxed">
                            {snippet}
                        </p>
                    </Link>

                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tags.slice(0, 3).map((tag, index) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-medium rounded-full hover:from-emerald-100 hover:to-teal-100 transition-colors border border-emerald-100"
                                >
                                    #{tag}
                                </span>
                            ))}
                            {tags.length > 3 && (
                                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                                    +{tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                                    isLiked 
                                        ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border border-red-100' 
                                        : 'text-gray-500 hover:text-red-500 hover:bg-gray-50 border border-gray-200 hover:border-red-200'
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                <span className="text-sm font-medium">{likes || 0}</span>
                            </button>
                            
                            <Link 
                                to={`/posts/${_id}`}
                                className="flex items-center space-x-1 px-3 py-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all border border-gray-200 hover:border-blue-200"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-medium">{commentCount}</span>
                            </Link>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`p-2 rounded-lg transition-all border ${
                                    isBookmarked 
                                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-500 border-amber-200' 
                                        : 'text-gray-400 hover:text-amber-500 hover:bg-gray-50 border-gray-200 hover:border-amber-200'
                                }`}
                            >
                                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                            
                            <Link
                                to={`/posts/${_id}`}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md hover:shadow-lg group/btn"
                            >
                                <span>Read More</span>
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PostCard;
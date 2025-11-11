import React, { useState } from 'react';
import { Heart, MessageCircle, Clock, Calendar, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogCard({ blog, onEdit, onDelete, onLike, currentUser }) {
  const [expanded, setExpanded] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const authorId = blog?.author?._id || blog?.author;
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwner = currentUserId && authorId && String(authorId) === String(currentUserId);

  const liked = currentUserId && Array.isArray(blog?.likes)
    ? blog.likes.some(l => String(l) === String(currentUserId))
    : false;

  const toggleExpand = () => setExpanded(!expanded);

  const shortContent = blog.content.slice(0, 280);
  const isLong = blog.content.length > 280;
  const readTime = Math.max(1, Math.ceil(blog.content.split(' ').length / 200));

  const handleLike = async () => {
    if (!currentUser) return alert('Please login to like');
    if (isLiking) return;
    setIsLiking(true);
    await onLike(blog._id);
    setTimeout(() => setIsLiking(false), 300);
  };

  return (
    <article className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:border-slate-200 transition-all duration-500 hover:-translate-y-1">
      {/* Image with overlay */}
      {blog.image ? (
        <div className="relative h-52 overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white drop-shadow-md line-clamp-2">
              {blog.title}
            </h3>
          </div>
        </div>
      ) : (
        <div className="h-52 bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-6">
          <h3 className="text-2xl font-bold text-center text-slate-700 line-clamp-3">
            {blog.title}
          </h3>
        </div>
      )}

      {/* Card Body */}
      <div className="p-6 space-y-4">
        {/* Author & Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {(blog.author?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{blog.author?.name || 'Unknown'}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar size={12} />
                {format(new Date(blog.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={14} />
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* Content */}
        <div className="text-slate-700 leading-relaxed">
          <p className={`transition-all duration-300 ${expanded ? '' : 'line-clamp-3'}`}>
            {expanded ? blog.content : shortContent}
            {isLong && !expanded && '...'}
          </p>

          {isLong && (
            <button
              onClick={toggleExpand}
              className="mt-2 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {expanded ? (
                <>Show Less <ChevronUp size={16} /></>
              ) : (
                <>Read More <ChevronDown size={16} /></>
              )}
            </button>
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full border border-indigo-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={handleLike}
            disabled={!currentUser || isLiking}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              liked
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart
              size={18}
              className={`transition-all duration-300 ${
                liked ? 'fill-red-600 scale-110' : 'fill-none'
              } ${isLiking ? 'animate-ping' : ''}`}
            />
            <span>{blog.likes?.length || 0}</span>
          </button>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(blog)}
                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(blog._id)}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
import React, { useState } from 'react';

export default function BlogCard({ blog, onEdit, onDelete, onLike, currentUser }) {
  const [expanded, setExpanded] = useState(false);

  const authorId = blog?.author?._id || blog?.author;
  const currentUserId = currentUser?.id || currentUser?._id;

  // Check if logged-in user owns this blog
  const isOwner = currentUserId && authorId && String(authorId) === String(currentUserId);

  // Check if the logged-in user has liked this blog
  const liked = currentUserId && Array.isArray(blog?.likes)
    ? blog.likes.some(l => String(l) === String(currentUserId))
    : false;

  const toggleExpand = () => setExpanded(!expanded);

  const shortContent = blog.content.slice(0, 250);
  const isLong = blog.content.length > 250;

  return (
    <article className="bg-white p-4 rounded-lg shadow">
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{blog.title}</h3>
          <div className="text-xs text-slate-500">
            by {blog.author?.name || 'Unknown'} · {new Date(blog.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onLike(blog._id)}
            className="text-sm px-2 py-1 border rounded"
          >
            {liked ? '♥' : '♡'} {blog.likes ? blog.likes.length : 0}
          </button>
          {isOwner && (
            <>
              <button
                onClick={() => onEdit(blog)}
                className="text-sm px-2 py-1 border rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(blog._id)}
                className="text-sm px-2 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-slate-700 mt-3">
        {expanded ? blog.content : shortContent}
        {isLong && (
          <button
            onClick={toggleExpand}
            className="text-blue-600 ml-2 hover:underline text-sm"
          >
            {expanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </p>

      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {blog.tags.map((t, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-slate-100 rounded"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

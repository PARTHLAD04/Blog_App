const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const Bookmark = require('../models/Bookmark');

const router = express.Router();

/**
 * GET /api/admin/stats
 * Get total users, posts, comments, bookmarks
 * Only authenticated users (Admin check optional)
 */
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalBookmarks = await Bookmark.countDocuments();

    res.status(200).json({
      totalUsers,
      totalPosts,
      totalComments,
      totalBookmarks
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const auth = require('../middleware/authMiddleware');
const Blog = require('../models/Blog');

const router = express.Router();

// Toggle like/unlike - protected
router.post('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Post not found' });

    const userId = String(req.user._id);
    const already = blog.likes.find(l => String(l) === userId);
    if (already) {
      blog.likes = blog.likes.filter(l => String(l) !== userId);
    } else {
      blog.likes.push(req.user._id);
    }
    await blog.save();
    res.json({ likesCount: blog.likes.length, liked: !already });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

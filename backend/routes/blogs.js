const express = require('express');
const auth = require('../middleware/authMiddleware');
const Blog = require('../models/Blog');
const mongoose = require('mongoose');

const router = express.Router();

// Create blog (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });

    const tagsArr = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);
    const blog = await Blog.create({ author: req.user._id, title, content, image: image || '', tags: tagsArr });
    return res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all blogs (public dashboard)
router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my blogs (protected)
router.get('/', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog (public if wanted)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) return res.status(404).json({ message: 'Not found' });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Not found' });
    if (String(blog.author) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    const { title, content, image, tags } = req.body;
    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    blog.image = image ?? blog.image;
    blog.tags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : blog.tags);

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid blog ID' });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Not found' });

    // Check ownership
    if (String(blog.author) !== String(req.user._id))
      return res.status(403).json({ message: 'Forbidden' });

    // Delete the blog
    await blog.deleteOne(); // ✅ replace remove()
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

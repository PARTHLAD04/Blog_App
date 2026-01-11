const express = require('express');
const Blog = require('../models/Blog');
const Bookmark = require('../models/Bookmark');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/* =======================
   CREATE POST
======================= */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        const post = await Blog.create({
            title,
            content,
            tags,
            author: req.user.id
        });

        res.status(201).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post' });
    }
});

/* =======================
   GET ALL POSTS
======================= */
router.get('/', async (req, res) => {
    try {
        const posts = await Blog.find({ isPublished: true })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ count: posts.length, posts });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
});



/* =======================
   UPDATE POST
======================= */
router.put('/:postId', authMiddleware, async (req, res) => {
    try {
        const post = await Blog.findOneAndUpdate(
            { _id: req.params.postId, author: req.user.id },
            req.body,
            { new: true }
        );

        if (!post) {
            return res.status(403).json({ message: 'Not authorized or post not found' });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post' });
    }
});

/* =======================
   DELETE POST
======================= */
router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        const post = await Blog.findOneAndDelete({
            _id: req.params.postId,
            author: req.user.id
        });

        if (!post) {
            return res.status(403).json({ message: 'Not authorized or post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete post' });
    }
});

/* =======================
   LIKE POST
======================= */
router.post('/:postId/like', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // from authMiddleware
        const post = await Blog.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const hasLiked = post.likedBy.includes(userId);

        if (hasLiked) {
            // UNLIKE
            post.likedBy.pull(userId);
            post.likes -= 1;
        } else {
            // LIKE
            post.likedBy.push(userId);
            post.likes += 1;
        }

        await post.save();

        res.status(200).json({
            likes: post.likes,
            liked: !hasLiked
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to like/unlike post' });
    }
});


/* =======================
   BOOKMARK POST
======================= */
router.post('/:postId/bookmark', authMiddleware, async (req, res) => {
    try {
        const alreadyBookmarked = await Bookmark.findOne({
            user: req.user.id,
            blog: req.params.postId
        });

        if (alreadyBookmarked) {
            return res.status(400).json({ message: 'Already bookmarked' });
        }

        await Bookmark.create({
            user: req.user.id,
            blog: req.params.postId
        });

        res.status(201).json({ message: 'Post bookmarked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to bookmark post' });
    }
});

router.get('/search', authMiddleware, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const query = q.trim();
        const isNumber = !isNaN(query);

        const filter = {
            isPublished: true,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        };

        if (isNumber) {
            filter.$or.push({ likes: Number(query) });
        }

        const posts = await Blog.find(filter)
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search posts'
        });
    }
});


/* =======================
   GET SINGLE POST
======================= */
router.get('/:postId', async (req, res) => {
    try {
        const post = await Blog.findById(req.params.postId)
            .populate('author', 'name email');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch post' });
    }
});


module.exports = router;

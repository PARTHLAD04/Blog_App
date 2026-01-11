const express = require('express');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/* =======================
   CREATE COMMENT
======================= */
router.post('/:postId', authMiddleware, async (req, res) => {
    try {
        const { comment } = req.body; // match schema field
        const postId = req.params.postId;

        // Check post exists
        const post = await Blog.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = await Comment.create({
            comment,         // <-- match schema
            blog: postId,    // <-- match schema
            user: req.user.id
        });

        res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ message: 'Failed to create comment', error: error.message });
    }
});


/* =======================
   GET COMMENTS BY POST
======================= */
router.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        const comments = await Comment.find({ blog: postId })
            .populate('user', 'name email')   // optional: get user info
            .sort({ createdAt: -1 });         // newest first

        res.status(200).json({
            count: comments.length,
            comments
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
});

/* =======================
   DELETE COMMENT
======================= */
router.delete('/:commentId', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({
            _id: req.params.commentId,
            user: req.user.id
        });

        if (!comment) {
            return res.status(403).json({
                message: 'Not authorized or comment not found'
            });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete comment' });
    }
});

module.exports = router;

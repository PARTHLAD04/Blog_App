const express = require('express');
const User = require('../models/User');
const { authMiddleware, signToken } = require('../middleware/authMiddleware');
const Bookmark = require('../models/Bookmark');

const router = express.Router();

/* ================= UPDATE PROFILE ================= */
router.put('/update', async (req, res) => {
    try {
        const { name, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            message: 'Profile updated',
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



/* ================= CHANGE PASSWORD ================= */
router.put('/change-password', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const isMatch = user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }

        user.password = newPassword; // auto-hashed by pre-save hook
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/bookmarks', async (req, res) => {
    try {
        const userId = req.user.id;

        const bookmarks = await Bookmark.find({ user: userId })
            .populate({
                path: 'blog',
                select: 'title content tags author',
                populate: { path: 'author', select: 'name email' }
            });

        res.status(200).json({ count: bookmarks.length, bookmarks });
    } catch (error) {
        console.error('Get bookmarks error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;
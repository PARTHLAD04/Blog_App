const express = require('express');
const Category = require('../models/Category');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/* =======================
   CREATE CATEGORY
======================= */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category' });
  }
});

/* =======================
   GET ALL CATEGORIES
======================= */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

module.exports = router;

// backend/routes/ai.js
const express = require('express');
const axios = require('axios');
const auth = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/generate', auth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Missing GEMINI_API_KEY in .env' });
    }

    // Gemini endpoint
    const aiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `
Write a complete, high-quality blog post about "${title}".
Requirements:
- Start with an engaging introduction (2–3 sentences).
- Include 3–5 relevant subheadings (use Markdown ## headings).
- Under each subheading, add 1–2 descriptive paragraphs.
- End with a concise and thoughtful conclusion.
Use a friendly, informative tone suitable for a tech blog.
`;

    const response = await axios.post(
      aiUrl,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 120000 }
    );

    const aiText =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'No AI content generated.';

    res.json({ generated: aiText });
  } catch (err) {
    console.error('AI generate error:', err?.response?.data || err.message);
    res.status(500).json({
      message: 'AI generation failed',
      error: err?.response?.data || err.message,
    });
  }
});

module.exports = router;

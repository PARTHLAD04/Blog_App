const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const axios =require('axios');
const router = express.Router();

router.post("/generate-blog",authMiddleware, async (req, res) => {
    try {
        const { topic, wordCount, tone } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Topic is required" });
        }

        const prompt = `
        Write a ${wordCount || 500}-word blog.
        Topic: ${topic}
        Tone: ${tone || "informative"}
        Include headings and conclusion.
        `;

        // 🔁 Call Python AI Server
        const aiResponse = await axios.post(
            "http://localhost:8001/generate-blog",
            { prompt }
        );

        res.status(200).json({
            success: true,
            content: aiResponse.data.content
        });

    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(503).json({ message: "AI service unavailable" });
    }
});

module.exports = router;

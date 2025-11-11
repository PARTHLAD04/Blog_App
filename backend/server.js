const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./utils/db');
require('dotenv').config();

const aiRoutes = require('./routes/ai'); 
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const likeRoutes = require('./routes/likes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json({ limit: '10mb' })); // allow base64 images
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.get('/', (req, res) => res.send('MERN Blog API'));

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/likes', likeRoutes); // like endpoint

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

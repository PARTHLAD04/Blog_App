const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT
const db = require('./utils/db')
const {authMiddleware} = require('./middleware/authMiddleware')
const authRoutes = require('./routes/auth') 
const userRoutes = require('./routes/user') 
const postRoutes = require('./routes/post')
const commentRoutes =require('./routes/commet');
const categoriesRoutes = require('./routes/category');
const aiRoutes = require('./routes/aiRoutes.js')

app.use(express.json())

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users',authMiddleware, userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/categories',categoriesRoutes );
app.use("/api/ai", aiRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

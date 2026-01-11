const express = require('express');
const User = require('../models/User');
const { authMiddleware, signToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const user = req.body;
    const newUser = new User(user);
    const result = await newUser.save();

    const payload = { id: result.id, email: result.email };
    const token = signToken(payload);

    console.log('Generated Token:', token);
    console.log('User registered');
    res.status(201).json({ message: 'User registered successfully', userId: result, token: token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error', err: error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email:email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const payload = {
      id: user.id,
      email: user.email
    };

    const token = signToken(payload);

    console.log('Generated Token:', token);

    res.status(200).json({
      message: 'User login successfully',
      res:user,
      token:token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userID = req.user.id;
   
    const result = await User.findById(userID);

    res.status(200).json({ res: result })
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

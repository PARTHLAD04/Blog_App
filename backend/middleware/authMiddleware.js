const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Get token from headers
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }
  catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const signToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET);
};

module.exports = { authMiddleware, signToken };

const mongoose = require('mongoose');
require('dotenv').config();

const mongose_url = 'mongodb://localhost:27017/blog_app';
mongoose.connect(mongose_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Mongoose connected to DB');
});
db.on('error', (err) => {
  console.error('Mongoose connection error:', err);
}); 
db.on('disconnected', () => {
  console.log('Mongoose disconnected from DB');
});

module.exports = db;


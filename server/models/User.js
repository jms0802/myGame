const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String },
  googleId: { type: String },
  nickname: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema); 
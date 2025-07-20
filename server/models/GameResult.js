const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: 'User',
  },
  score: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  gameBoard: {
    type: Array,
  }
});

module.exports = mongoose.model('GameResult', gameResultSchema); 
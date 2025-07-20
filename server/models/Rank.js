const mongoose = require('mongoose');
const { Schema } = mongoose;

const rankSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  nickname: { type: String },
  playCount: { type: Number },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Rank', rankSchema); 
const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameRecordSchema = new Schema({
  uid: { type: String, required: true },
  score: { type: Number },
  playDate: { type: Date },
  isPublic: { type: Boolean, default:false },
  stageData: { type: Object }
});

module.exports = mongoose.model('GameRecord', gameRecordSchema); 
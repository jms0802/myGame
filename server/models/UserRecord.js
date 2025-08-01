const mongoose = require("mongoose");
const { Schema } = mongoose;

const userRecordSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  gameCount: { type: Number },
  avgScore: { type: Number },
  maxScore: { type: Number },
  lastPlayedAt: { type: Date },
});

module.exports = mongoose.model("UserRecord", userRecordSchema);

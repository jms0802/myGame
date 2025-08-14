const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameRecordSchema = new Schema({
  uid: { type: String, required: true },
  score: { type: Number },
  playDate: { 
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    expires: 0
  },
  isPublic: { type: Boolean, default: false },
  stageData: { type: Object },
});

const TTL_DAYS = 15;
const TTL_MILLISECONDS = TTL_DAYS * 24 * 60 * 60 * 1000; // 15일

gameRecordSchema.pre("save", function(next) {
  if (this.isPublic) {
    this.expireAt = undefined; // 공개면 만료 없음
  } else {
    if (!this.expireAt) {
      this.expireAt = new Date(Date.now() + TTL_MILLISECONDS); // 비공개면 15일 뒤 만료
    }
  }
  next();
});

gameRecordSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate() || {};
  const $set = update.$set || {};
  const $unset = update.$unset || {};
  let isPublicVal;

  if (Object.prototype.hasOwnProperty.call(update, "isPublic")) {
    isPublicVal = update.isPublic;
    delete update.isPublic;
  } else if (Object.prototype.hasOwnProperty.call($set, "isPublic")) {
    isPublicVal = $set.isPublic;
  }

  if (typeof isPublicVal === "boolean") {
    if (isPublicVal === true) {
      $unset.expireAt = ""; // 공개 → 만료 제거
    } else {
      $set.expireAt = new Date(Date.now() + TTL_MILLISECONDS); // 비공개 → 15일 뒤 만료
    }
  }

  update.$set = $set;
  if (Object.keys($unset).length) update.$unset = $unset;
  this.setUpdate(update);
  next();
});

// Rank 업데이트
gameRecordSchema.post("save", async function (doc, next) {
  try {
    const uid = doc.uid;
    const Rank = mongoose.model("Rank");
    const User = mongoose.model("User");

    let rank = await Rank.findOne({ uid });
    if (rank) {
      rank.playCount = (typeof rank.playCount === "number" ? rank.playCount : 0) + 1;
      rank.updatedAt = new Date();
      await rank.save();
    } else {
      const user = await User.findOne({ uid });
      await Rank.create({
        uid,
        nickname: user ? user.nickname : undefined,
        playCount: 1,
      });
    }
    next();
  } catch (err) {
    console.error("[Rank][AutoUpdate] Error:", err);
    next(err);
  }
});

// UserRecord 업데이트
gameRecordSchema.post("save", async function (doc, next) {
  try {
    const UserRecord = mongoose.model("UserRecord");

    const uid = doc.uid;
    const playedAt = doc.playDate || new Date();
    const score = typeof doc.score === "number" ? doc.score : 0;

    const existing = await UserRecord.findOne({ uid });

    if (existing) {
      const prevCount = typeof existing.gameCount === "number" ? existing.gameCount : 0;
      const prevAvg = typeof existing.avgScore === "number" ? existing.avgScore : 0;
      const prevMax = existing.maxScore != null ? existing.maxScore : null;

      const newCount = prevCount + 1;
      const newAvg = Math.round(((prevAvg * prevCount + score) / newCount) * 100) / 100;
      const newMax = prevMax == null ? score : Math.max(prevMax, score);

      existing.gameCount = newCount;
      existing.avgScore = newAvg;
      existing.maxScore = newMax;
      if (!existing.lastPlayedAt || playedAt > existing.lastPlayedAt) {
        existing.lastPlayedAt = playedAt;
      }
      await existing.save();
    } else {
      await UserRecord.create({
        uid,
        gameCount: 1,
        avgScore: Math.round(score * 100) / 100,
        maxScore: score,
        lastPlayedAt: playedAt,
      });
    }

    next();
  } catch (err) {
    console.error("[UserRecord][AutoUpdate] Error:", err);
    next(err);
  }
});

module.exports = mongoose.model("GameRecord", gameRecordSchema);

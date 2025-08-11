const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameRecordSchema = new Schema({
  uid: { type: String, required: true },
  score: { type: Number },
  playDate: { type: Date },
  isPublic: { type: Boolean, default: false },
  stageData: { type: Object },
});

gameRecordSchema.post("save", async function (doc, next) {
  try {
    const uid = doc.uid;
    const Rank = mongoose.model("Rank");
    const User = mongoose.model("User");
    const GameRecord = mongoose.model("GameRecord");

    let rank = await Rank.findOne({ uid });
    if (rank) {
      // playCount는 해당 uid의 GameRecord 개수로 갱신
      const playCount = await GameRecord.countDocuments({ uid });
      rank.playCount = playCount;
      rank.updatedAt = new Date();
      await rank.save();
    } else {
      // User에서 nickname 가져와서 새 Rank 생성
      const user = await User.findOne({ uid });
      if (user) {
        const playCount = await GameRecord.countDocuments({ uid });
        await Rank.create({
          uid,
          nickname: user.nickname,
          playCount,
        });
      }
    }
    next();
  } catch (err) {
    console.error("[Rank][AutoUpdate] Error:", err);
    next(err);
  }
});

// GameRecord 저장 시 UserRecord 자동 갱신 (집계는 GameRecord에서 계산)
gameRecordSchema.post("save", async function (doc, next) {
  try {
    const UserRecord = mongoose.model("UserRecord");
    const GameRecord = mongoose.model("GameRecord");

    const uid = doc.uid;
    const playedAt = doc.playDate || new Date();

    // 해당 uid의 모든 게임 기록을 가져와서 집계
    const records = await GameRecord.find({ uid });

    const gameCount = records.length;
    let avgScore = 0;
    let maxScore = null;
    let lastPlayedAt = null;

    if (gameCount > 0) {
      const scores = records.map(r => typeof r.score === "number" ? r.score : 0);
      const playDates = records.map(r => r.playDate ? new Date(r.playDate) : null).filter(Boolean);

      avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / gameCount) * 100) / 100;
      maxScore = Math.max(...scores);
      lastPlayedAt = playDates.length > 0 ? new Date(Math.max(...playDates.map(d => d.getTime()))) : playedAt;
    }

    const existing = await UserRecord.findOne({ uid });
    if (existing) {
      existing.gameCount = gameCount;
      existing.avgScore = avgScore;
      existing.maxScore = maxScore;
      existing.lastPlayedAt = lastPlayedAt;
      await existing.save();
    } else {
      await UserRecord.create({
        uid,
        gameCount,
        avgScore,
        maxScore,
        lastPlayedAt,
      });
    }

    next();
  } catch (err) {
    console.error("[UserRecord][AutoUpdate] Error:", err);
    next(err);
  }
});

module.exports = mongoose.model("GameRecord", gameRecordSchema);

const User = require("../models/User");
const GameRecord = require("../models/GameRecord");
const asyncHandler = require("express-async-handler");

exports.saveGameRecord = asyncHandler(async (req, res) => {
  const user = req.user;
  const uid = user.uid;
  const { score, playDate, isPublic, stageData } = req.body;
  if (!score || !playDate || !stageData) {
    return res
      .status(400)
      .json({ success: false, message: "필수 필드가 누락되었습니다." });
  }

  const record = new GameRecord({
    uid,
    score,
    playDate: playDate || new Date(),
    isPublic,
    stageData,
  });

  await record.save();

  // [rank] 게임 기록 저장 시 랭크 갱신
  let rank = await require("../models/Rank").findOne({ uid });
  if (rank) {
    rank.playCount += 1;
    rank.updatedAt = new Date();
    await rank.save();
  } else {
    const user = await User.findOne({ uid });
    if (user) {
      await require("../models/Rank").create({
        uid,
        nickname: user.nickname,
        playCount: 1,
        updatedAt: new Date(),
      });
    }
  }
  res.status(201).json({ success: true, message: "게임 기록 저장 완료" });
});

exports.getGameRecord = asyncHandler(async (req, res) => {
  const user = req.user;

  const records = await GameRecord.find({ uid: user.uid }).sort({
    playDate: -1,
  });

  if (records < 1)
    return res
      .status(404)
      .json({ success: false, message: "게임 기록이 없습니다." });

  return res.json({
    success: true,
    records,
  });
});

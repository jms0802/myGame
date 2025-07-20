const User = require("../models/User");
const GameRecord = require("../models/GameRecord");
const asyncHandler = require("express-async-handler");

exports.saveGameRecord = asyncHandler(async (req, res) => {
  const { uid, score, playDate, isPublic, stageData } = req.body;
  if (!uid || !score || !playDate || !stageData) {
    return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
  }

  if(!(await isUser(uid))){
    return res.status(404).json({ message: "유저가 존재하지 않습니다. "});
  }

  const record = new GameRecord({
    uid,
    score,
    playDate: playDate || new Date(),
    isPublic,
    stageData,
  });

  await record.save();
  res.status(201).json({ message: "게임 기록 저장 완료", record });
});

exports.getGameRecord = asyncHandler(async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ message: "uid 쿼리 파라미터 필요" });

  if(!(await isUser(uid))){
    return res.status(404).json({ message: "유저가 존재하지 않습니다. "});
  }

  const records = await GameRecord.find({ uid }).sort({ playDate: -1 });

  if (records < 1)
    return res.status(404).json({ message: "게임 기록이 없습니다." });

  return res.json(records);
});

async function isUser(uid) {
  return await User.exists({ uid });
}

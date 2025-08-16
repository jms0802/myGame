const User = require("../models/User");
const Rank = require("../models/Rank");
const GameRecord = require("../models/GameRecord");
const UserRecord = require("../models/UserRecord");
const asyncHandler = require("express-async-handler");

//모든 게임 반환
exports.getGameRecords = asyncHandler(async (req, res) => {
  const user = req.user;

  const records = await GameRecord.find({ uid: user.uid }).sort({
    playDate: -1,
  });

  if (records.length < 1) {
    return res
      .status(404)
      .json({ message: "게임 기록이 없습니다." });
  }

  return res.status(200).json({
    records,
  });
});

//특정 게임 반환
exports.getGameStageData = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await GameRecord.findOne({ _id: id });
    if (!record) {
      return res
        .status(404)
        .json({ message: "해당 게임 기록을 찾을 수 없습니다." });
    }
    const stageData = record.stageData;
    return res.status(200).json({ stageData });
});

exports.saveGameRecord = asyncHandler(async (req, res) => {
  const user = req.user;
  const uid = user.uid;
  const { score, isPublic, stageData } = req.body;
  if (!score || !stageData) {
    return res
      .status(400)
      .json({ message: "필수 필드가 누락되었습니다." });
  }

  const record = new GameRecord({
    uid,
    score,
    playDate: new Date(),
    isPublic,
    stageData,
  });

  await record.save();

  res.status(201).json({ message: "게임 기록 저장 완료" });
});

exports.updateGameRecordPublic = asyncHandler(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { isPublic } = req.body;

  if (typeof isPublic !== "boolean") {
    return res.status(400).json({ message: "isPublic 값을 전달해 주세요." });
  }

  const updated = await GameRecord.findOneAndUpdate(
    { _id: id, uid: user.uid },
    { $set: { isPublic } },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "해당 게임 기록을 찾을 수 없습니다." });
  }

  return res.status(200).json({
    record: updated
  });
});

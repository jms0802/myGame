const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.getProfile = asyncHandler(async (req, res) => {
  const uid = req.query.uid;
  if (!uid) return res.status(400).json({ message: "uid is required" });

  const user = await User.findOne({ uid }).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    message: "유저 정보 확인",
    user,
  });
});

exports.initUser = asyncHandler(async (req, res) => {
  const { uid, nickname } = req.body;

  if (!uid || !nickname) {
    return res.status(400).json({
      message: "uid 또는 nickname이 필요합니다.",
    });
  }

  let user = await User.findOne({ uid });

  if (!user) {
    user = new User({ uid, nickname });
    await user.save();

    return res.status(200).json({
      message: "새로운 유저 정보 저장",
    });
  }

  return res.status(200).json({
    message: "기존 유저 정보 확인 완료",
  });
});

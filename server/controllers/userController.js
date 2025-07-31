const User = require("../models/User");
const Rank = require("../models/Rank");
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

exports.updateNickname = asyncHandler(async (req, res) => {
  const { uid, nickname, token } = req.body;

  if (!uid || !nickname) {
    return res.status(400).json({
      success: false,
      message: "uid와 nickname이 필요합니다.",
    });
  }

  // 닉네임 길이 검증
  if (nickname.length > 15) {
    return res.status(400).json({
      success: false,
      message: "닉네임은 15글자 이하로 입력해주세요.",
    });
  }

  const user = await User.findOne({ uid });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "사용자를 찾을 수 없습니다.",
    });
  }

  // 닉네임 업데이트
  user.nickname = nickname;
  await user.save();

  // Rank 테이블도 함께 업데이트
  await Rank.findOneAndUpdate(
    { uid },
    { nickname },
    { upsert: true }
  );

  return res.status(200).json({
    success: true,
    message: "닉네임이 성공적으로 변경되었습니다.",
    user: {
      uid: user.uid,
      nickname: user.nickname,
      googleId: user.googleId,
    },
  });
});

exports.checkNickname = asyncHandler(async (req, res) => {
  const { nickname, uid } = req.query;

  if (!nickname) {
    return res.status(400).json({
      success: false,
      message: "닉네임을 입력해주세요.",
    });
  }

  // 닉네임 길이 검증
  if (nickname.length > 15) {
    return res.status(400).json({
      success: false,
      message: "닉네임은 15글자 이하로 입력해주세요.",
    });
  }

  // 닉네임 중복 체크 (자신 제외)
  const query = { nickname };
  if (uid) {
    query.uid = { $ne: uid };
  }

  const existingUser = await User.findOne(query);
  
  return res.status(200).json({
    success: true,
    available: !existingUser,
    message: existingUser ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다.",
  });
});

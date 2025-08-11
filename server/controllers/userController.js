const User = require("../models/User");
const Rank = require("../models/Rank");
const asyncHandler = require("express-async-handler");

// 현재 사용자 정보 가져오기
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    user: {
      uid: user.uid,
      nickname: user.nickname,
      email: user.email,
      googleId: user.googleId,
      createdAt: user.createdAt,
    },
  });
});

exports.getProfile = asyncHandler(async (req, res) => {

  // TODO **사용자 정보, 게임 기록 한꺼번에
  
  const uid = req.query.uid;
  if (!uid) return res.status(400).json({ message: "uid is required" });

  const user = await User.findOne({ uid }).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    user,
  });
});

exports.updateNickname = asyncHandler(async (req, res) => {
  const { uid, nickname } = req.body;

  if (!uid || !nickname) {
    return res.status(400).json({
      message: "uid와 nickname이 필요합니다.",
    });
  }

  // 닉네임 길이 검증
  if (nickname.length > 15) {
    return res.status(400).json({
      message: "닉네임은 15글자 이하로 입력해주세요.",
    });
  }

  // 닉네임 중복 체크 (자신 제외)
  const existingUser = await User.findOne({ nickname, uid: { $ne: uid } });
  if (existingUser) {
    return res.status(409).json({
      message: "이미 사용 중인 닉네임입니다.",
    });
  }

  const user = await User.findOne({ uid });

  if (!user) {
    return res.status(404).json({
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
    message : "닉네임 변경 성공"
  });
});

exports.checkNickname = asyncHandler(async (req, res) => {
  const { nickname, uid } = req.query;

  if (!nickname) {
    return res.status(400).json({
      message: "닉네임을 입력해주세요.",
    });
  }

  // 닉네임 길이 검증
  if (nickname.length > 15) {
    return res.status(400).json({
      message: "닉네임은 15글자 이하로 입력해주세요.",
    });
  }

  // 닉네임 중복 체크 (자신 제외)
  const query = { nickname };
  if (uid) {
    query.uid = { $ne: uid };
  }

  const existingUser = await User.findOne(query);

  return res.status(existingUser ? 409 : 200).json({
    message: existingUser ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다.",
  });
});

// 사용자 삭제 (연관된 모든 데이터 포함)
exports.deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.body;
  
  if (!uid) {
    return res.status(400).json({
      message: "uid가 필요합니다."
    });
  }

  // 사용자 존재 여부 확인
  const user = await User.findOne({ uid });
  if (!user) {
    return res.status(404).json({
      message: "사용자를 찾을 수 없습니다."
    });
  }

  try {
    // 사용자 삭제 (pre 미들웨어가 자동으로 연관 데이터 삭제)
    await User.findOneAndDelete({ uid });
    
    console.log(`[User Deletion] User and all related data deleted successfully for uid: ${uid}`);
    
    return res.status(200).json({
      message: "사용자와 관련된 모든 데이터가 성공적으로 삭제되었습니다."
    });
  } catch (error) {
    console.error(`[User Deletion] Error deleting user ${uid}:`, error);
    return res.status(500).json({
      message: "사용자 삭제 중 오류가 발생했습니다."
    });
  }
});


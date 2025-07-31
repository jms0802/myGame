const asyncHandler = require("express-async-handler");
const passport = require("passport");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// 구글 로그인
exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// 구글 로그인 콜백
exports.googleCallback = [
  passport.authenticate("google", {
    failureRedirect: "/auth/google",
    session: false,
  }),
  async (req, res) => {
    const user = await User.findOne({ googleId: req.user.googleId });

    const token = jwt.sign(
      { id: req.user._id, googleId: req.user.googleId },
      jwtSecret
    );

    const nickname = req.user.displayName || req.user.nickname;

    const ClientUrl = process.env.CLIENT_URL;

    res.send(`
      <script>
        window.opener.postMessage({ nickname: "${nickname}", existUser: ${!!user}, token: "${token}" }, "${ClientUrl}");
        window.close();
      </script>
    `);
  },
];

// 게스트 유저 저장
exports.registerGuest = asyncHandler(async (req, res) => {
  const { uid, nickname } = req.body;

  // 이미 존재하는 사용자인지 확인
  const existingUser = await User.findOne({ uid });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "이미 존재하는 사용자입니다.",
    });
  }

  // 새 사용자 생성
  const userData = {
    uid,
    nickname,
    email: null,
  };

  const newUser = await User.create(userData);

  res.json({
    success: true,
    message: "사용자가 성공적으로 생성되었습니다.",
    user: {
      uid: newUser.uid,
      nickname: newUser.nickname,
      email: newUser.email,
      googleId: newUser.googleId,
    },
  });
});

// 구글 유저 저장
exports.registerGoogle = asyncHandler(async (req, res) => {
  const { uid, nickname, token } = req.body;
  const decoded = jwt.verify(token, jwtSecret);
  const googleId = decoded.googleId;

  const user = await User.findOne({ uid: uid });

  if (!user) {
    User.create({ uid, nickname, googleId });
  } else {
    user.nickname = nickname;
    user.googleId = googleId;
    await user.save();
  }

  res.json({
    success: true,
    message: "사용자가 성공적으로 생성되었습니다.",
  });
});

// 현재 사용자 정보 가져오기
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ googleId: req.user.googleId });

  res.json({
    success: true,
    message: "사용자 정보가 성공적으로 가져왔습니다.",
    user: {
      uid: user.uid,
      nickname: user.nickname,
      email: user.email,
      googleId: user.googleId,
    },
  });
});
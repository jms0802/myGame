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
    failureRedirect: "/api/auth/google",
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

    res.status(200).send(`
      <script>
        window.opener.postMessage({ nickname: "${nickname}", existUser: ${!!user}, token: "${token}" }, "${ClientUrl}");
        window.close();
      </script>
    `);
  },
];

// 구글 유저 저장
exports.registerGoogle = asyncHandler(async (req, res) => {
  const { uid, nickname, token } = req.body;
  const decoded = jwt.verify(token, jwtSecret);
  const googleId = decoded.googleId;

  const user = await User.findOne({ uid: uid });

  if (!user) {
    User.create({ uid, nickname, googleId });
  } else {
    return res.status(400).json({
      message: "이미 존재하는 유저입니다.",
    });
  }

  res.status(200).json({
    message: "사용자가 성공적으로 생성되었습니다.",
  });
});
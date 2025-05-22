const express = require("express");
const passport = require("passport");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const auth = require("../middleware/auth");

/**
 * 로그인 페이지
 * GET /login
 */
router.get(["/login"], (req, res) => {
  const token = req.cookies.token;
  const tempGoogleData = req.cookies.temp_google_data;

  if (token) {
    // 토큰이 있으면 홈으로 리다이렉트
    return res.redirect("/home");
  }
  if(tempGoogleData) res.clearCookie('temp_google_data');

  const locals = {
    title: "로그인",
  };
  res.render("login", { locals, layout: mainLayout });
});

/**
 * 로그인 확인
 * POST /login
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        success: false,
        message: "일치하는 사용자가 없습니다.",
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "300s" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "product",
      maxAge: 2 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });
    res.json({
      success: true,
      redirect: "/home",
    });
  })
);

/**
 * Google 로그인
 * Get /auth/google
 */
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * Google 로그인 콜백
 * Get /auth/google/callback
 */
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res, next) => {
    // req.user가 없거나 isNewUser가 true인 경우
    if (!req.user || req.user.isNewUser) {
      // 구글 프로필 정보를 쿠키에 임시 저장
      res.cookie(
        "temp_google_data",
        {
          email: req.user.email,
          googleId: req.user.googleId,
          displayName: req.user.displayName,
        },
        {
          maxAge: 5 * 60 * 1000, // 5분
          httpOnly: true,
        }
      );

      return res.redirect("/register");
    }

    // 기존 사용자인 경우
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "product",
      maxAge: 2 * 60 * 60 * 1000,
    });
    res.redirect("/home");
  }
);

/**
 * 회원가입 페이지
 * GET /register
 */
router.get("/register", (req, res) => {
  const token = req.cookies.token;
  const tempGoogleData = req.cookies.temp_google_data;

  if (token) {
    return res.redirect("/home");
  }

  const { email } = req.query;

  const locals = {
    title: "회원가입",
    email: tempGoogleData ? tempGoogleData.email : "",
  };
  res.render("register", { locals, layout: mainLayout });
});

/**
 * 회원가입
 * POST /register
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, nickname, email, password } = req.body;
    const tempGoogleData = req.cookies.temp_google_data;

    // 이메일 중복 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "이미 등록된 이메일입니다.",
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성 데이터 준비
    const userData = {
      email,
      password: hashedPassword,
      username,
      nickname,
    };

    // temp_google_data 쿠키가 있으면 googleId 추가
    if (tempGoogleData) {
      userData.googleId = tempGoogleData.googleId;
    }

    // 사용자 생성
    const user = await User.create(userData);

    res.json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      redirect: "/login",
    });
  })
);

router.post(
  "/register/check-id",
  asyncHandler(async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });

    res.json({
      exists: !!user,
      message: user
        ? "이미 사용중인 아이디입니다."
        : "사용 가능한 아이디입니다.",
    });
  })
);

// 로그아웃 라우트
router.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

module.exports = router;

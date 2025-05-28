const asyncHandler = require("express-async-handler");
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const mainLayout = "../views/layouts/main.ejs";

// 로그인 페이지 렌더링
exports.getLoginPage = (req, res) => {
  const token = req.cookies.token;
  const tempGoogleData = req.cookies.temp_google_data;

  if (token) {
    return res.redirect("/home");
  }
  if(tempGoogleData) res.clearCookie('temp_google_data');

  const locals = {
    title: "로그인",
  };
  res.render("login", { locals, layout: mainLayout });
};

// 로그인 처리
exports.login = asyncHandler(async (req, res) => {
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
});

// 구글 로그인
exports.googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// 구글 로그인 콜백
exports.googleCallback = [
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    session: false,
  }),
  (req, res) => {
    if (!req.user || req.user.isNewUser) {
      res.cookie(
        "temp_google_data",
        {
          email: req.user.email,
          googleId: req.user.googleId,
          displayName: req.user.displayName,
        },
        {
          maxAge: 5 * 60 * 1000,
          httpOnly: true,
        }
      );
      return res.redirect("/auth/register");
    }

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "product",
      maxAge: 2 * 60 * 60 * 1000,
    });
    res.redirect("/home");
  }
];

// 회원가입 페이지 렌더링
exports.getRegisterPage = (req, res) => {
  const token = req.cookies.token;
  const tempGoogleData = req.cookies.temp_google_data;

  if (token) {
    return res.redirect("/home");
  }

  const locals = {
    title: "회원가입",
    email: tempGoogleData ? tempGoogleData.email : "",
  };
  res.render("register", { locals, layout: mainLayout });
};

// 회원가입 처리
exports.register = asyncHandler(async (req, res) => {
  const { username, nickname, email, password } = req.body;
  const tempGoogleData = req.cookies.temp_google_data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "이미 등록된 이메일입니다.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    email,
    password: hashedPassword,
    username,
    nickname,
  };

  if (tempGoogleData) {
    userData.googleId = tempGoogleData.googleId;
  }

  await User.create(userData);

  res.json({
    success: true,
    message: "회원가입이 완료되었습니다.",
    redirect: "/auth/login",
  });
});

// 아이디 중복 체크
exports.checkUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });

  res.json({
    exists: !!user,
    message: user
      ? "이미 사용중인 아이디입니다."
      : "사용 가능한 아이디입니다.",
  });
});

// 로그아웃
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
};
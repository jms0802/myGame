const express = require("express");
const passport = require("passport");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get(["/login"], (req, res) => {
  const locals = {
    title: "로그인",
  };
  res.render("login", { locals, layout: mainLayout });
});

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
    const token = jwt.sign({ id: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.json({
      success: true,
      redirect: "/home", // 리다이렉트할 URL 전달
    });
  })
);

/**
 * Google 로그인
 * Get /auth/google
 */
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * Google 로그인 콜백
 * Get /auth/google/callback
 */
router.get('/auth/google/callback',
  passport.authenticate('google', { 
      failureRedirect: '/login',
      session: false 
  }),
  (req, res) => {
      // JWT 토큰 생성
      const token = jwt.sign(
          { id: req.user._id }, 
          process.env.JWT_SECRET
      );

      // 쿠키에 토큰 저장
      res.cookie('token', token, { 
          httpOnly: true,
          // secure: process.env.NODE_ENV === 'product',
      });

      // 홈페이지로 리다이렉트
      res.redirect('/home');
  }
);

module.exports = router;

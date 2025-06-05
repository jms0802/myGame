const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const asyncHandler = require("express-async-handler");
const auth = require("../middleware/auth");

/**
 * 로그인 페이지
 * GET /login
 */
router.get(["/login"], authController.getLoginPage);

/**
 * 로그인 확인
 * POST /login
 */
router.post("/login", authController.login);

/**
 * Google 로그인
 * Get /auth/google
 */
router.get("/google", authController.googleAuth);

/**
 * Google 로그인 콜백
 * Get /auth/google/callback
 */
router.get("/google/callback", authController.googleCallback);

/**
 * 회원가입 페이지
 * GET /register
 */
router.get("/register", authController.getRegisterPage);

/**
 * 회원가입
 * POST /register
 */
router.post("/register", authController.register);

/**
 * 회원가입 아이디 중복 체크
 * POST /register/check-id
 */
router.post("/register/check-id", authController.checkUsername);

// 로그아웃 라우트
router.post("/logout", authController.logout);

module.exports = router;

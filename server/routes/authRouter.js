const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const apiAuth = require("../middleware/apiAuth"); // 새로 추가

/**
 * Google 로그인
 * Get /google
 */
router.get("/google", authController.googleAuth);

/**
 * Google 로그인 콜백
 * Get /google/callback
 */
router.get("/google/callback", authController.googleCallback);

/**
 * 회원가입
 * POST /register
 */
router.post("/register/guest", authController.registerGuest);
/**
 * 유저 googleId 저장
 * POST /register/google-id
 */
router.post("/register/google", authController.registerGoogle);

/**
 * 현재 사용자 정보 가져오기
 * GET /me
 */
router.get("/me", apiAuth, authController.getCurrentUser);

module.exports = router;

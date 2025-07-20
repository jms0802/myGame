const express = require('express');
const router = express.Router();
const { getProfile, initUser } = require("../controllers/userController");

/**
 * 사용자 정보 확인
 * GET /me
 */
router.get('/profile', getProfile);

/**
 * 사용자 정보 저장
 * POST /init
 */
router.post('/init', initUser);

module.exports = router;
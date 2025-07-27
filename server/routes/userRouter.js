const express = require('express');
const router = express.Router();
const { getProfile, initUser, updateNickname, checkNickname } = require("../controllers/userController");

/**
 * 사용자 정보 확인
 * GET /profile
 */
router.get('/profile', getProfile);

/**
 * 사용자 정보 저장
 * POST /init
 */
router.post('/init', initUser);

/**
 * 닉네임 변경
 * PUT /nickname
 */
router.put('/nickname', updateNickname);

/**
 * 닉네임 중복확인
 * GET /check-nickname
 */
router.get('/check-nickname', checkNickname);

module.exports = router;
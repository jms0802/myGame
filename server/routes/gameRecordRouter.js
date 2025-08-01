const express = require('express');
const router = express.Router();
const { getGameRecord, saveGameRecord } = require('../controllers/gameController');
const apiAuth = require("../middleware/apiAuth");

/**
 * 게임 기록 조회
 * GET /game-records
 */
router.get('/', apiAuth, getGameRecord);

/**
 * 게임 기록 저장
 * POST /game-record
 */
router.post('/', apiAuth, saveGameRecord);

module.exports = router;
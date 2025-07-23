const express = require('express');
const router = express.Router();
const { getGameRecord, saveGameRecord } = require('../controllers/gameController');

/**
 * 게임 기록 조회
 * GET /game-records
 */
router.get('/', getGameRecord);

/**
 * 게임 기록 저장
 * POST /game-record
 */
router.post('/', saveGameRecord);

module.exports = router;
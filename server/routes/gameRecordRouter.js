const express = require('express');
const router = express.Router();
const { getGameRecord, saveGameRecord } = require('../controllers/gameController');

/**
 * 게임 기록 조회
 * GET /game-records
 */
router.get('/game-records', getGameRecord);

/**
 * 게임 기록 저장
 * POST /game-record
 */
router.post('/game-record', saveGameRecord);

module.exports = router;
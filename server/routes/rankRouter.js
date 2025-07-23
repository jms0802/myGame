const express = require('express');
const router = express.Router();
const { getRank } = require("../controllers/rankController");

/**
 * 랭킹 조회
 * GET /
 */
router.get('/', getRank);

module.exports = router;
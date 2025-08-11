const express = require("express");
const router = express.Router();
const { getRank } = require("../controllers/rankController");

/**
 * @swagger
 * /api/ranks:
 *   get:
 *     tags:
 *       - Rank
 *     summary: 전체 랭킹 조회
 *     description: 전체 랭킹 정보를 playCount 내림차순으로 반환합니다.
 *     responses:
 *       200:
 *         description: 랭킹 정보 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rank:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Rank'
 */
router.get("/", getRank);

module.exports = router;

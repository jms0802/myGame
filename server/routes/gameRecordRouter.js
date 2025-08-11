const express = require("express");
const router = express.Router();
const {
  getGameRecord,
  saveGameRecord,
} = require("../controllers/gameController");
const apiAuth = require("../middleware/apiAuth");

/**
 * @swagger
 * /api/game-records:
 *   get:
 *     tags:
 *       - Record
 *     summary: 내 게임 기록 전체 조회
 *     description: 인증된 사용자의 모든 게임 기록을 반환합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: "Bearer {accessToken} 형식의 JWT 토큰"
 *     requestBody:
 *      content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게임 기록 목록 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 records:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameRecord'
 *       404:
 *         description: 게임 기록이 없음
 */
router.get("/", apiAuth, getGameRecord);

/**
 * @swagger
 * /api/game-records:
 *   post:
 *     tags:
 *       - Record
 *     summary: 게임 기록 저장
 *     description: 새로운 게임 기록을 저장합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: "Bearer {accessToken} 형식의 JWT 토큰"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *               - stageData
 *             properties:
 *               score:
 *                 type: integer
 *               isPublic:
 *                 type: boolean
 *               stageData:
 *                 type: object
 *                 properties:
 *                   robots:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         x:
 *                           type: integer
 *                         y:
 *                           type: integer
 *                         color:
 *                           type: string
 *                   target:
 *                     type: object
 *                     properties:
 *                       x:
 *                         type: integer
 *                       y:
 *                         type: integer
 *                       color:
 *                         type: string
 *                   board:
 *                     type: array
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           walls:
 *                             type: array
 *                             items:
 *                               type: string
 *     responses:
 *       201:
 *         description: 게임 기록 저장 성공
 *       400:
 *         description: 필수 필드 누락
 */
router.post("/", apiAuth, saveGameRecord);

module.exports = router;

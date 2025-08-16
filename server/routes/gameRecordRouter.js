const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
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
router.get("/", apiAuth, gameController.getGameRecords);

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
router.post("/", apiAuth, gameController.saveGameRecord);

/**
 * @swagger
 * /api/game-records/{id}/public:
 *   patch:
 *     tags:
 *       - Record
 *     summary: 게임 기록 보존 여부 수정
 *     description: 특정 게임 기록의 공개(보존) 여부를 수정합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: "Bearer {accessToken} 형식의 JWT 토큰"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "수정할 게임 기록의 _id"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isPublic
 *             properties:
 *               isPublic:
 *                 type: boolean
 *                 description: "true면 공개, false면 비공개"
 *     responses:
 *       200:
 *         description: 게임 기록 보존 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 record:
 *                   $ref: '#/components/schemas/GameRecord'
 *       404:
 *         description: 게임 기록이 없음
 *       400:
 *         description: isPublic 값 없음
 */
router.patch("/:id/public", apiAuth, gameController.updateGameRecordPublic);

/**
 * @swagger
 * /api/game-records/{id}:
 *   patch:
 *     tags:
 *       - Record
 *     summary: 특정 게임 기록 조회
 *     description: 특정 게임 기록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "조회할 게임 기록의 _id"
 *     responses:
 *       200:
 *         description: 게임 기록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 record:
 *                   type: object
 *                   properties:
 *                     robots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           color:
 *                             type: string
 *                           x:
 *                             type: integer
 *                           y:
 *                             type: integer
 *                     target:
 *                       type: object
 *                       properties:
 *                         x:
 *                           type: integer
 *                         y:
 *                           type: integer
 *                         color:
 *                           type: string
 *                     board:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             walls:
 *                               type: array
 *                               items:
 *                                 type: string
 *       404:
 *         description: 게임 기록이 없음
 */
router.get("/:id", gameController.getGameStageData);

module.exports = router;

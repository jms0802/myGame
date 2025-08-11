const express = require('express');
const router = express.Router();
const { getProfile, updateNickname, checkNickname, getCurrentUser, deleteUser } = require("../controllers/userController");
const apiAuth = require("../middleware/apiAuth");

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags:
 *       - User
 *     summary: 현재 사용자 정보
 *     description: 인증된 사용자의 정보를 반환합니다.  
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
 *         description: 사용자 정보 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.get("/me", apiAuth, getCurrentUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: 사용자 정보 확인
 *     description: uid로 사용자 정보를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 uid
 *     responses:
 *       200:
 *         description: 사용자 정보 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: uid 누락
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.get('/profile', getProfile);

/**
 * @swagger
 * /api/users/nickname:
 *   put:
 *     tags:
 *       - User
 *     summary: 닉네임 변경
 *     description: uid와 새로운 nickname으로 닉네임을 변경합니다.
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
 *               - uid
 *               - nickname
 *             properties:
 *               uid:
 *                 type: string
 *               nickname:
 *                 type: string
 *     responses:
 *       200:
 *         description: 닉네임 변경 성공
 *       400:
 *         description: 필수 값 누락 또는 닉네임 길이 초과
 *       409:
 *         description: 닉네임 중복
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.put('/nickname', apiAuth, updateNickname);

/**
 * @swagger
 * /api/users/check-nickname:
 *   get:
 *     tags:
 *       - User
 *     summary: 닉네임 중복 확인
 *     description: 닉네임의 중복 여부를 확인합니다.
 *     parameters:
 *       - in: query
 *         name: nickname
 *         schema:
 *           type: string
 *         required: true
 *         description: 확인할 닉네임
 *       - in: query
 *         name: uid
 *         schema:
 *           type: string
 *         required: false
 *         description: (선택) 본인 제외용 uid
 *     responses:
 *       200:
 *         description: 중복 여부 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 닉네임 누락 또는 길이 초과
 */
router.get('/check-nickname', checkNickname);

// 사용자 삭제 라우트 추가
router.delete('/admin/delete', deleteUser);

module.exports = router;
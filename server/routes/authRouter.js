const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     tags:
 *       - Auth
 *     summary: 구글 로그인 시작
 *     description: 구글 OAuth 인증을 시작합니다.
 *     responses:
 *       302:
 *         description: 구글 인증 페이지로 리다이렉트
 */
router.get("/google", authController.googleAuth);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     tags:
 *       - Auth
 *     summary: 구글 로그인 콜백
 *     description: 구글 인증 후 콜백을 처리합니다.
 *     responses:
 *       200:
 *         description: 인증 성공 및 토큰 반환
 *         content:
 *           text/html:
 *             schema:
 *               type: object
 *               properties:
 *                 nickname:
 *                   type: string
 *                 existUser:
 *                   type: boolean
 *                 token:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     googleId:
 *                       type: string
 */
router.get("/google/callback", authController.googleCallback);

/**
 * @swagger
 * /api/auth/register/google:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 구글 사용자 등록
 *     description: 구글 인증 후 사용자 정보를 등록합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - nickname
 *               - token
 *             properties:
 *               uid:
 *                 type: string
 *               nickname:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 이미 존재하는 유저입니다.   
 */
router.post("/register/google", authController.registerGoogle);

module.exports = router;

// server/docs/config.js

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clash-Game API 문서',
      version: '1.0.0',
      description: 'Clash-Game 프로젝트의 REST API 명세서입니다.',
    },
    servers: [
      { url: "http://localhost:3001" },
      { url: "https://my-game-roan-dev.vercel.app" },
      { url: "https://clash-grid.vercel.app" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        },
      },
      schemas: {
        GameRecord: {
          type: "object",
          properties: {
            uid: {
              type: "string",
              required: true,
              description: "사용자 고유 ID"
            },
            score: {
              type: "number",
              description: "게임 점수"
            },
            playDate: {
              type: "string",
              format: "date-time",
              description: "게임 플레이 날짜"
            },
            isPublic: {
              type: "boolean",
              default: false,
              description: "공개 여부"
            },
            stageData: {
              type: "object",
              description: "스테이지 데이터"
            }
          }
        },
        Rank: {
          type: "object",
          properties: {
            uid: {
              type: "string",
              required: true,
              unique: true,
              description: "사용자 고유 ID"
            },
            nickname: {
              type: "string",
              description: "사용자 닉네임"
            },
            playCount: {
              type: "number",
              description: "플레이 횟수"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "마지막 업데이트 날짜"
            }
          }
        },
        User: {
          type: "object",
          properties: {
            uid: {
              type: "string",
              required: true,
              unique: true,
              description: "사용자 고유 ID"
            },
            email: {
              type: "string",
              description: "이메일 주소"
            },
            googleId: {
              type: "string",
              description: "구글 계정 ID"
            },
            nickname: {
              type: "string",
              description: "사용자 닉네임"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              default: Date.now,
              description: "계정 생성 날짜"
            }
          }
        },
        UserRecord: {
          type: "object",
          properties: {
            uid: {
              type: "string",
              required: true,
              unique: true,
              description: "사용자 고유 ID"
            },
            gameCount: {
              type: "number",
              description: "총 게임 플레이 횟수"
            },
            avgScore: {
              type: "number",
              description: "평균 점수"
            },
            maxScore: {
              type: "number",
              description: "최고 점수"
            },
            lastPlayedAt: {
              type: "string",
              format: "date-time",
              description: "마지막 플레이 날짜"
            }
          }
        }
      }
    }
  },
  apis: [
    './routes/*.js', // 모든 라우터 파일 포함
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

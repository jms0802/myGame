### ✅ 프로젝트 개요

- **프로젝트명**: 리코셰 로봇 퍼즐 게임
- **설명**: 로봇을 이동시키며 목표에 도달하는 퍼즐 게임
- **개발 목적**: 퍼즐 게임 구현 및 백엔드 API, 인증 시스템 학습
- **기술 스택**: React, Express.js, MongoDB, Mongoose, JWT, OAuth (Google)

---

### 1. 📌 기능 명세

| 기능 | 설명 | 우선순위 |
| --- | --- | --- |
| 게임 플레이 | 리액트로 구현된 퍼즐 UI | 높음 |
| 프로필 조회 |  | 높음 |
| 게임 결과 저장 | 유저 ID와 점수, 시간 기록 | 중간 |
| 랭킹 조회 | 최근 점수 기준 정렬 | 중간 |
| Google OAuth 통합 | 이메일 기준 계정 통합 | 중간 |

---

### 2. 🗂️ ERD 설계

![image.png](attachment:de13913c-222a-4df7-9d3e-c8440130135b:image.png)

| 모델 | 필드 | 속성 |
| --- | --- | --- |
| User | _id | ObjectId |
|  | uid | String, required: true, unique: true |
|  | password | String (Hash 암호화 저장) |
|  | email | String |
|  | googleId | String |
|  | nickname | String |
|  | createdAt | Date
default: Date.now |
| GameRecord | _id | ObjectId |
|  | userUid | String, required: true |
|  | score | Int |
|  | playDate | Date |
|  | isPublic | boolean |
|  | stageData | Object (JSON 키-값) |
| Rank | _id | ObjectId |
|  | userUid | String, required: true, unique: true |
|  | nickname | String |
|  | playCount | Int |
|  | updatedAt | Date |
| UserRecord | _id | ObjectId |
|  | userUid | String, required: true, unique: true |
|  | gameCount | Int |
|  | avgScore | Int |
|  | maxScore | Int |
|  | lastPlayedAt | Date |

---

### 3. 🔗 API 설계

| 메서드 | 경로 | 설명 | 요청 데이터 | 응답 데이터 |
| --- | --- | --- | --- | --- |
| GET | /api/auth/google | Google 로그인 요청 |  |  |
| POST | /api/game-record | 게임 결과 저장 | stage, score, playDate |  |
| GET | /api/game-records | 게임 기록 조회 |  | stage, score. playDate |
| GET | /api/rank | 랭킹 조회 |  | uid, nickname, playCount |
| POST | /api/user/me | 프로필 조회 |  | uid, email, nickname, googleid, createdAt, etc |

---

### 4. 🧾 폴더 구조

```
server/
├── app.js
├── .env                      # 환경 변수 (MONGO_URL, JWT_SECRET 등)
├── package.json
├── config/
│   └── db.js                 # MongoDB 연결 설정
├── models/
│   ├── User.js
│   ├── GameRecord.js
│   ├── Rank.js
│   └── UserRecord.js
├── routes/
│   ├── auth.js               # /api/auth/google 등
│   ├── user.js               # /api/user/me
│   ├── gameRecord.js         # /api/game-record, /api/game-records
│   └── rank.js               # /api/rank
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── gameRecordController.js
│   └── rankController.js
├── middlewares/
│   ├── authMiddleware.js     # JWT 인증 처리
│   └── errorHandler.js
├── utils/
│   └── jwt.js                # 토큰 생성/검증 유틸
└── README.md
```

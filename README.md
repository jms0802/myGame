### ✅ 프로젝트 개요

- **프로젝트명**: 리코셰 로봇 퍼즐 게임
- **설명**: 로봇을 이동시키며 목표에 도달하는 퍼즐 게임
- **개발 목적**: 퍼즐 게임 구현 및 백엔드 API, 인증 시스템 학습
- **기술 스택**: 
  - **Frontend**: React 19, Vite, TailwindCSS, React Router DOM
  - **Backend**: Express.js, MongoDB, Mongoose, JWT, Passport.js (Google OAuth)
  - **Deployment**: Vercel (Frontend), Koyeb(Backend), (https://clash-grid.vercel.app/)

---

### 1. 📌 기능 명세

| 기능 | 설명 | 상태 |
| --- | --- | --- |
| 게임 플레이 | React로 구현된 10x10 퍼즐 게임 UI | ✅ 완료 |
| 다크모드 | TailwindCSS 기반 테마 전환 | ✅ 완료 |
| Google OAuth | Passport.js 기반 Google 로그인 | ✅ 완료 |
| 프로필 조회 | 사용자 정보 및 게임 통계 조회 | ✅ 완료 |
| 게임 결과 저장 | 유저 ID와 점수, 시간, 스테이지 데이터 기록 | ✅ 완료 |
| 게임 기록 조회 | 개인 게임 히스토리 조회 | ✅ 완료 |
| 랭킹 시스템 | 플레이 횟수 기준 랭킹 조회 | ✅ 완료 |
| 사용자 통계 | 백엔드용 사용자 통계 데이터 처리 | ❌ 미완료 |

---

### 2. 🗂️ ERD 설계

<img width="361" height="431" alt="Image" src="https://github.com/user-attachments/assets/7710895e-1b7a-410f-920d-c00ec4cd2117" />

| 모델 | 필드 | 속성 | 설명 |
| --- | --- | --- | --- |
| User | uid | String, required, unique | 사용자 고유 ID |
|  | password | String | 해시 암호화된 비밀번호 |
|  | email | String | 이메일 주소 |
|  | googleId | String | Google OAuth ID |
|  | nickname | String | 사용자 닉네임 |
|  | createdAt | Date, default: Date.now | 계정 생성일 |
| GameRecord | uid | String, required | 사용자 고유 ID |
|  | score | Number | 게임 점수 |
|  | playDate | Date | 플레이 날짜 |
|  | isPublic | Boolean, default: false | 공개 여부 |
|  | stageData | Object | 스테이지 데이터 (JSON) |
| Rank | uid | String, required, unique | 사용자 고유 ID |
|  | nickname | String | 사용자 닉네임 |
|  | playCount | Number | 플레이 횟수 |
|  | updatedAt | Date | 업데이트 날짜 |
| UserRecord | uid | String, required, unique | 사용자 고유 ID |
|  | gameCount | Number | 총 게임 수 |
|  | avgScore | Number | 평균 점수 |
|  | maxScore | Number | 최고 점수 |
|  | lastPlayedAt | Date | 마지막 플레이 날짜 |

---

### 3. 🔗 API 설계

| 메서드 | 경로 | 설명 | 요청 데이터 | 응답 데이터 |
| --- | --- | --- | --- | --- |
| GET | /auth/google | Google 로그인 요청 | - | OAuth 리다이렉트 |
| GET | /auth/google/callback | Google 로그인 콜백 | - | JWT 토큰 | 
| POST | /auth/register/google | Google ID 등록 | googleId, email, nickname | 성공 메시지 |
| GET | /auth/me | 현재 사용자 정보 | JWT 토큰 | user{uid, email, nickname, googleId} |
| POST | /api/user/init | 사용자 등록 | uid, nickname | 성공 메시지 |
| GET | /api/user/profile?uid= | 프로필 조회 | uid | user{uid, email, nickname, googleId, createdAt} |
| POST | /api/game-record | 게임 결과 저장 | uid, score, playDate, isPublic, stageData | 성공 메시지 | 
| GET | /api/game-record?uid= | 게임 기록 조회 | uid | gameRecords[] |
| GET | /api/rank | 랭킹 조회 | - | rank{uid, nickname, playCount}[] |

---

### 4. 🧾 프로젝트 구조

```
myGame/
├── server/                          # Express.js 백엔드
│   ├── app.js                       # 메인 서버 파일
│   ├── package.json                 # 서버 의존성
│   ├── config/
│   │   ├── db.js                    # MongoDB 연결 설정
│   │   └── passport.js              # Passport.js 설정
│   ├── models/                      # Mongoose 모델
│   │   ├── User.js
│   │   ├── GameRecord.js
│   │   ├── Rank.js
│   │   └── UserRecord.js
│   ├── routes/                      # API 라우터
│   │   ├── authRouter.js            # 인증 관련
│   │   ├── userRouter.js            # 사용자 관련
│   │   ├── gameRecordRouter.js      # 게임 기록 관련
│   │   └── rankRouter.js            # 랭킹 관련
│   ├── controllers/                 # 비즈니스 로직
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── gameController.js
│   │   └── rankController.js
│   ├── middleware/                  # 미들웨어
│   │   └── apiAuth.js               # JWT 인증
│   ├── views/                       # EJS 템플릿 (서버사이드)
│   │   ├── layouts/
│   │   ├── home.ejs
│   │   ├── login.ejs
│   │   └── register.ejs
│   └── public/                      # 정적 파일
│       └── css/
│           └── style.css
├── web-client/                      # React 프론트엔드
│   ├── package.json                 # 클라이언트 의존성
│   ├── vite.config.js               # Vite 설정
│   ├── vercel.json                  # Vercel 배포 설정
│   ├── src/
│   │   ├── main.jsx                 # 앱 진입점
│   │   ├── App.jsx                  # 메인 컴포넌트
│   │   ├── components/              # React 컴포넌트
│   │   │   ├── Auth/
│   │   │   │   └── LoginModal.jsx   # 로그인 모달
│   │   │   ├── Game/
│   │   │   │   ├── RicochetRobotGame.jsx  # 메인 게임 컴포넌트
│   │   │   │   └── RicochetRobotGame.css
│   │   │   ├── SideBarMenu.jsx      # 사이드바 네비게이션
│   │   │   └── Loading.jsx          # 로딩 컴포넌트
│   │   ├── pages/                   # 페이지 컴포넌트
│   │   │   ├── Main.jsx             # 메인 페이지
│   │   │   ├── Profile.jsx          # 프로필 페이지
│   │   │   └── Rank.jsx             # 랭킹 페이지
│   │   ├── contexts/                # React Context
│   │   │   ├── AuthContext.jsx      # 인증 상태 관리
│   │   │   └── DarkModeContext.jsx  # 다크모드 상태 관리
│   │   ├── hooks/                   # 커스텀 훅
│   │   │   ├── useGameRecord.js     # 게임 기록 관리
│   │   │   ├── useGoogleLogin.js    # Google 로그인
│   │   │   └── useGuestLogin.js     # 게스트 로그인
│   │   ├── api/                     # API 통신
│   │   │   ├── authApi.js           # 인증 API
│   │   │   └── gameApi.js           # 게임 API
│   │   └── utils/                   # 유틸리티
│   │       └── storage.js           # 로컬 스토리지 관리
│   └── public/                      # 정적 파일
│       └── favicon.svg
└── README.md                        # 프로젝트 문서
```
---

### 5. 📌 게임 규칙

- **목표**: 색깔 로봇을 해당 색깔 목표로 이동시키기
- **게임판**: 10x10 격자
- **로봇**: 4가지 색상 (빨강, 파랑, 초록, 노랑)
- **이동**: 로봇은 벽이나 로봇에 부딪힐 때까지 직선 이동
- **점수**: 이동 횟수와 시간에 따라 계산 -> 현재는 임의로 이동 횟수로만 점수 산정
- **스테이지**: 랜덤 생성되는 벽과 목표 위치

---

### 6. 📌 주요 기술적 특징

- **JWT 기반 인증**: 안전한 사용자 세션 관리
- **Google OAuth 2.0**: 소셜 로그인 지원
- **다크모드**: 사용자 선호도 기반 테마 전환
- **CORS 설정**: 개발/프로덕션 환경별 도메인 허용
- **에러 핸들링**: Express async-handler로 비동기 에러 처리

---

### 8. 📊 배포 정보

- **Frontend**: Vercel (https://clash-grid.vercel.app/)
- **Backend**: Koyeb
- **Database**: MongoDB Atlas
- **CORS**: 허용된 도메인에서만 API 접근 가능

---

### 9. 📌 향후 개선 계획

- [ ] 이전 게임 상세보기 (스테이지 정보, 시간, 시도 횟수 등)
- [ ] 관리자 전용 페이지 (사용자 통계)
- [ ] 커스텀 스테이지 생성/공유
- [ ] 보안 강화
- [ ] 실시간 멀티플레이어 지원
- [ ] 게임 모드 추가 (무한 모드, 로그라이크 모드 등)
- [ ] 모바일 앱 버전 개발 (리액트 네이티브 or 게임 엔진을 이용한 개발)

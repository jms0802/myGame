require("dotenv").config();
const express = require('express');

const connectDb = require("./config/db");

const cookieParser = require("cookie-parser");

const cors = require('cors');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/config');

const passport = require('passport');
require('./config/passport');

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3001;

connectDb();

// CORS 설정
const allowedOrigins = [
  'http://localhost:5173',         // 개발용
  'https://my-game-roan-dev.vercel.app', //Preview
  'https://clash-grid.vercel.app',
];


app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// 미들웨어 설정
app.use(express.static('public'));
app.use(passport.initialize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 라우트 설정
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const gameRecordRouter = require('./routes/gameRecordRouter');
const rankRouter = require('./routes/rankRouter');

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/game-records', gameRecordRouter);
app.use('/api/ranks', rankRouter);

const server = app.listen(port, () => {
    console.log(`App Listening on port ${port}`);
});

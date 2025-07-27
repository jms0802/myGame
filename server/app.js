require("dotenv").config();
const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require('path');

const passport = require('passport');
require('./config/passport');

const app = express();
const port = process.env.PORT || 3001;

connectDb();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:5173', // React 앱의 주소
  credentials: true, // 쿠키 포함 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 미들웨어 설정
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set("views", "./views");
app.use(express.static('public'));
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 라우트 설정
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const gameRecordRouter = require('./routes/gameRecordRouter');
const rankRouter = require('./routes/rankRouter');

app.use('/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/game-record', gameRecordRouter);
app.use('/api/rank', rankRouter);

const server = app.listen(port, () => {
    console.log(`App Listening on port ${port}`);
});

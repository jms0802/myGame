require("dotenv").config();
const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require('path');

const passport = require('passport');
require('./config/passport');

const app = express();
const port = process.env.PORT || 3001;

connectDb();

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
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));

const server = app.listen(port, () => {
    console.log(`App Listening on port ${port}`);
});

const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require("../models/User");

module.exports = async function (req, res, next) {
  let token = req.headers.authorization || "";
  if (!token) {
    return res.status(401).json({ message: "인증 토큰이 없습니다." });
  }
  if (token.startsWith('Bearer ')) token = token.substring(7).trim();
  if (!token) {
    return res.status(401).json({ message: "인증 토큰이 없습니다." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ googleId: decoded.googleId });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
}; 
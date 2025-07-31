const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require("../models/User");

// const apiAuth = asyncHandler(async (req, res, next) => {
//     // Authorization 헤더에서 토큰 가져오기
//     const authHeader = req.headers.authorization;
        
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({
//             success: false,
//             message: "인증 토큰이 필요합니다."
//         });
//     }

//     const token = authHeader.substring(7); // 'Bearer ' 제거

//     // 토큰 검증
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findOne({ googleId: decoded.googleId });

//     if (!user) {
//         return res.status(401).json({
//             success: false,
//             message: "유효하지 않은 토큰입니다."
//         });
//     }
    
//     // 사용자 정보를 요청 객체에 추가
//     req.user = user;
//     next();
// });

module.exports = function (req, res, next) {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "인증 토큰이 없습니다." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "유효하지 않은 토큰입니다." });
  }
}; 
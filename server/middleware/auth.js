const jwt = require('jsonwebtoken');
const User = require("../models/User");

const auth = async (req, res, next) => {
    try {
        // 쿠키에서 토큰 가져오기
        const token = req.cookies.token;
        
        if (!token) {
            return res.redirect('/auth/login');
        }

        // 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.redirect('/auth/login');
        
        // 사용자 정보를 요청 객체에 추가
        req.user = user;
        next();
    } catch (error) {
        // 토큰이 유효하지 않으면 로그인 페이지로
        res.redirect('/auth/login');
    }
};

module.exports = auth; 
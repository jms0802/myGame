const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mainLayout = "../views/layouts/main.ejs";

/**
 * 사용자 확인 홈
 * GET /
 */
router.get(['/', '/home'], auth, (req, res) => {
    const locals = {
        title: "Home",
      };
    res.render('home', { locals, layout: mainLayout, user: req.user });
});

router.get('/profile', auth, (req, res) => {
    res.render('profile');
}); 

module.exports = router;
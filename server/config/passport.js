const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const fs = require("fs");
const path = require("path");

const envFile =
  process.env.NODE_ENV === "product" ? ".env.product" : ".env.dev";
require("dotenv").config({ path: path.resolve(__dirname, "..", envFile) });

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(
  asyncHandler(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      proxy: true,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 기존 사용자 확인
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // 새 사용자인 경우
          const tempUser = {
            isNewUser: true,
            email: profile.emails[0].value,
            googleId: profile.id,
            displayName: profile.displayName,
          };
          return done(null, tempUser); // false 대신 tempUser 객체 전달
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;

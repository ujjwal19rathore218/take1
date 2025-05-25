const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userdb = require("../model/userSchema");

dotenv.config();

const router = express.Router();

const secretKey = process.env.JWT_SECRET || "your-secret-key";
const FRONTEND_URL = process.env.FRONTEND_URL; // <--- NEW

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userdb.findOne({ googleID: profile.id });
        if (!user) {
          user = new userdb({
            googleID: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            balance: 1000,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login`, // <--- UPDATED
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ googleID: user.googleID }, secretKey, {
      expiresIn: "1h",
    });
    res.redirect(
      `${FRONTEND_URL}/dashboard?token=${token}` // <--- UPDATED
    );
  }
);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "User Login", user: req.user });
  } else {
    res.status(400).json({ message: "User not authorized" });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(`${FRONTEND_URL}/`); // <--- UPDATED
  });
});

module.exports = { router, passport };
const express = require("express");
const { join } = require("path");
const cors = require("cors");
const { Strategy } = require("passport-google-oauth20");
const passport = require("passport");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const v1Router = require("./routes/v1/v1.router");
passport.use(
  new Strategy(
    {
      callbackURL: "https://localhost:4000/auth/google/callback",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  done(null, id);
});
const app = express();
app.use(helmet());
app.use(cors("http://localhost:3000/"));
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(join(__dirname, "..", "..", "public")));
app.use("/v1", v1Router);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "/auth/success",
  }),
  (req, res) => {
    console.log("Google redirected the auth flow to this endpoint");
  }
);
app.get("/auth/failure", (req, res) => {
  res.json({ message: "Auth failed" });
});
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
app.get("/auth/logout", (req, res) => {
  req.logOut();
  return res.redirect("/");
});
app.get("/auth/success", (req, res) => {
  res.json({ message: "Auth succeeded" });
});

// app.get("/", (req, res) => {
//   res.sendFile(join(__dirname, "..", "public", "index.html"));
// });

module.exports = app;

const express = require("express");
const v1Router = express.Router();
const launchesRouter = require("../launches/launches.router");
const planetsRouter = require("../planets/planets.router");
const checkLoggedIn = (req, res, next) => {
  const loggedIn = req.user;
  if (!loggedIn && req.isAuthenticated()) {
    console.log("unauthorized user");
    return res.json({ message: "you're not logged in" });
  }
  next();
};
v1Router.use("/planets", planetsRouter);
v1Router.use("/launches", launchesRouter);
v1Router.get("/secret", checkLoggedIn, (req, res) => {
  res.json({ message: "secret" });
});
module.exports = v1Router;

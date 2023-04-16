const express = require("express");
const launchesRouter = express.Router();

const {
  httpGetLaunches,
  httpPostLaunches,
  httpDeleteLaunches,
} = require("./launches.controller");

launchesRouter.get("/", httpGetLaunches);
launchesRouter.post("/", httpPostLaunches);
launchesRouter.delete("/:id", httpDeleteLaunches);

module.exports = launchesRouter;

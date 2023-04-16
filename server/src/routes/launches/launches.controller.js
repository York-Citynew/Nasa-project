const {
  getLaunches,
  postLaunches,
  deleteLaunch,
  launchExists,
} = require("../../models/launches.model");
const query = require("../../services/query");
const httpGetLaunches = async (req, res) => {
  res.json(await getLaunches(query(req.query)));
};
const httpPostLaunches = async (req, res) => {
  if (
    (!req.body.launchDate,
    !req.body.rocket ||
      !req.body.target ||
      !req.body.mission ||
      !isNaN(req.body.launchDate))
  ) {
    return res.status(400).json({ error: "missing required fields" });
  } else {
    try {
      const launch = await postLaunches(req.body);
      res.status(201).json({ ok: true }); //fix this
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  }
};
const httpDeleteLaunches = async (req, res) => {
  const { id } = req.params;
  const temp = await launchExists(Number(id));
  console.log(temp);
  if (temp) {
    res.status(200).json(deleteLaunch(Number(id)));
  } else {
    res.status(404).json({ error: "invalid id" });
  }
};
module.exports = { httpGetLaunches, httpPostLaunches, httpDeleteLaunches };

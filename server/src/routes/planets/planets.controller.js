const { getPlanets } = require("../../models/planets.model");
const httpGetPlanets = async (req, res) => {
  res.json(await getPlanets());
};
module.exports = httpGetPlanets;

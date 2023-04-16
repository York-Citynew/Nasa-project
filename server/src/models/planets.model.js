const { parse } = require("csv-parse");
const fs = require("fs");
const { join } = require("path");
// const habitablePlanets = [];
const planets = require("./planets.mongo");
function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

const isPlanetsLoaded = () =>
  new Promise((resolve, reject) =>
    fs
      .createReadStream(join(__dirname, "..", "..", "data", "data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          // habitablePlanets.push(data);
          await savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject();
      })
      .on("end", async () => {
        const planetsLength = (await getPlanets()).length;
        console.log(`${planetsLength} habitable planets found!`);
        resolve();
      })
  );
const savePlanet = async (data) => {
  try {
    await planets.updateOne(
      {
        keplerName: data.kepler_name,
      },
      { keplerName: data.kepler_name },
      { upsert: true }
    );
  } catch (error) {
    console.error(error);
  }
};
const getPlanets = async () => {
  try {
    return await planets.find({}, { _id: 0, __v: 0 });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  isPlanetsLoaded,
  getPlanets,
};

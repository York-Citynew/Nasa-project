const axios = require("axios");
const launches = require("./launches.mongo");
const { getPlanets } = require("./planets.model");
const DEFAULT_FLIGHT_NUMBER = 100;
const SPACE_X_LAUNCHES_URL = "https://api.spacexdata.com/v4/launches/query";
const SPACE_X_LAUNCHES_CONFIG = {
  query: {},
  options: {
    pagination: false,
    populate: [
      {
        path: "rocket",
        select: {
          name: 1,
        },
      },
      {
        path: "payloads",
        select: {
          customers: 1,
        },
      },
    ],
  },
};

const getLaunchesData = async () => {
  if (!(await findLaunch({ flight_number: 1, rocket: "Falcon 1" }))) {
    const response = await axios.post(
      SPACE_X_LAUNCHES_URL,
      SPACE_X_LAUNCHES_CONFIG
    );
    return await response.data.docs.forEach(async (item) => {
      const launch = {
        rocket: item.rocket.name,
        success: item.success,
        customers: item.payloads.flatMap((item) => item.customers),
        flightNumber: item.flight_number,
        launchDate: item.date_local,
        upcoming: item.upcoming,
        mission: item.name,
      };
      saveLaunch(launch);
      await postLaunches(launch);
    });
  } else {
    console.log("else ran");
    return;
  }
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches
    .findOne()
    .sort({ flightNumber: "descending" });
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return await latestLaunch.flightNumber;
};

const saveLaunch = async (launch) =>
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );

const postLaunches = async (launch) => {
  try {
    const existsInHabitablePlanets = (await getPlanets()).findIndex(
      (item) => item === launch.target
    );
    if (!existsInHabitablePlanets) {
      throw new Error(
        "Target planet doesn't exists. Referential integrity error."
      );
    }
    const flightNumber = (await getLatestFlightNumber()) + 1;
    Object.assign(launch, {
      flightNumber: flightNumber,
      success: true,
      upcoming: true,
      customers: ["ZTM", "NASA"],
    });
    return saveLaunch(launch);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getLaunches = async ({ limit, skip }) => {
  try {
    return await launches
      .find(
        {},
        {
          _id: 0,
          __v: 0,
        }
      )
      .sort({ flightNumber: 1 })
      .skip(skip)
      .limit(limit);
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't get launches");
  }
};

const findLaunch = async (filter) => await launches.findOne(filter);

const launchExists = async (id) => {
  try {
    return await findLaunch({ flightNumber: id });
  } catch (error) {
    console.error(error);
    throw new Error("There was a problem validation the input launch");
  }
};
const deleteLaunch = async (id) => {
  try {
    await launches.updateOne(
      { flightNumber: id },
      { success: false, upcoming: false }
    );
  } catch (error) {
    console.error(error);
    throw new Error("There was a problem aborting the launch");
  }
};
module.exports = {
  getLaunches,
  postLaunches,
  getLaunchesData,
  deleteLaunch,
  findLaunch,
  launchExists,
  getLatestFlightNumber,
};

require("dotenv").config();
const fs = require("fs");
const { join } = require("path");
const https = require("https");
const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const { isPlanetsLoaded } = require("./models/planets.model");
const { getLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;
const startServer = async () => {
  await mongoConnect();
  await getLaunchesData();
  await isPlanetsLoaded();
  const server = https.createServer(
    {
      key: fs.readFileSync(join(__dirname, "..", "key.pem")),
      cert: fs.readFileSync(join(__dirname, "..", "cert.pem")),
    },
    app
  );
  server.listen(PORT, () => console.log(`running server on port ${PORT}`));
};

startServer();

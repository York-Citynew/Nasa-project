const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;
mongoose.connection.once("open", () => {
  console.log("connection to Mongo db is stabilized");
});
mongoose.connection.on("error", (err) => console.error(err));
const mongoConnect = async () => await mongoose.connect(MONGO_URL);
const mongoDisconnect = () => mongoose.disconnect;
module.exports = { mongoConnect, mongoDisconnect };

const mongoose = require("mongoose");
const launchesSchema = mongoose.Schema({
  flightNumber: { type: Number, required: true },
  rocket: { type: String, required: true },
  mission: { type: String, required: true },
  launchDate: { type: Date, required: true },
  target: { type: String, required: true },
  customers: { type: [String], required: true },
  success: { type: Boolean, required: true, default: true },
  upcoming: { type: Boolean, required: true },
});
module.exports = mongoose.model("Launch", launchesSchema);

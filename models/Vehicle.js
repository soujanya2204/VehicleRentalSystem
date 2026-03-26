const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  type: String,
  pricePerHour: Number,
  location: String,
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
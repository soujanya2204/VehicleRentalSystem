const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  vehicleId: mongoose.Schema.Types.ObjectId,
  startTime: Date,
  endTime: Date,
  totalPrice: Number,
});

module.exports = mongoose.model("Booking", bookingSchema);
  const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const { vehicleId, startTime, endTime, totalPrice } = req.body;

    const booking = await Booking.create({
      userId: req.user.id,
      vehicleId,
      startTime,
      endTime,
      totalPrice
    });

    res.json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};
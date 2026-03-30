const router = require('express').Router();
const Booking = require('../models/Booking');
const Bike = require('../models/Bike');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { bikeId, startTime, endTime, pickupLocation } = req.body;
    const bike = await Bike.findById(bikeId);
    if (!bike || !bike.available) return res.status(400).json({ message: 'Bike not available' });
    const hours = (new Date(endTime) - new Date(startTime)) / 3600000;
    if (hours <= 0) return res.status(400).json({ message: 'Invalid time range' });
    const isEarlyBooking = (new Date(startTime) - new Date()) >= 30 * 24 * 60 * 60 * 1000;
    const basePrice = hours * bike.pricePerHour;
    const totalPrice = isEarlyBooking ? basePrice * 0.90 : basePrice;
    const booking = await Booking.create({
      user: req.user.id, bike: bikeId, startTime, endTime, totalPrice, pickupLocation
    });
    await Bike.findByIdAndUpdate(bikeId, { available: false });
    res.status(201).json(await booking.populate(['user', 'bike']));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('bike').sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('bike').populate('user', 'name email').sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (req.body.status === 'completed' || req.body.status === 'cancelled') {
      await Bike.findByIdAndUpdate(booking.bike, { available: true });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Cannot cancel this booking' });
    await Booking.findByIdAndDelete(req.params.id);
    await Bike.findByIdAndUpdate(booking.bike, { available: true });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

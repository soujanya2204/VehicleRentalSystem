const express = require("express");
const router = express.Router();
const { createBooking, getBookings } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes
router.post("/", authMiddleware, createBooking);
router.get("/", authMiddleware, getBookings);

module.exports = router;
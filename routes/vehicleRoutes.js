const express = require("express");
const router = express.Router();
const { addVehicle, getVehicles } = require("../controllers/vehicleController");

router.post("/", addVehicle);
router.get("/", getVehicles);

module.exports = router;
const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  available: { type: Boolean, default: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  location: {
    lat: { type: Number, default: 12.9716 },
    lng: { type: Number, default: 77.5946 },
    address: { type: String, default: 'Bangalore, India' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Bike', bikeSchema);

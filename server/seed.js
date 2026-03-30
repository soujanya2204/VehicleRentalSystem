require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Bike = require('./models/Bike');

const bikes = [
  { name: 'DRIVE IT Self Drive', type: 'self-drive', pricePerHour: 150, description: 'Self drive car & bike rental in Bhubaneswar', location: { lat: 20.258105084412403, lng: 85.79883537315789, address: 'DRIVE IT - Self Drive Car & Bike Rental, Bhubaneswar' } },
  { name: 'YOR Khandagiri Bike', type: 'scooter', pricePerHour: 80, description: 'Bike rental near Khandagiri, Bhubaneswar', location: { lat: 20.258547951499857, lng: 85.78651866934183, address: 'YOR Khandagiri - Bike Rental, Bhubaneswar' } },
  { name: 'BIKERLANE Premium', type: 'mountain', pricePerHour: 120, description: 'Premium bike rental service in Bhubaneswar', location: { lat: 20.268322610113724, lng: 85.75801293721932, address: 'BIKERLANE Premium Bike Rental, Bhubaneswar' } },
  { name: "Let's driEV Electric", type: 'electric', pricePerHour: 200, description: 'Electric bike rental near AIIMS Bhubaneswar', location: { lat: 20.230163102473742, lng: 85.77246773141816, address: "Let's driEV - Electric Bike Rental, AIIMS, Bhubaneswar" } },
  { name: 'Velote Scooter Rental', type: 'scooter', pricePerHour: 90, description: 'Scooter and bike rental services in Bhubaneswar', location: { lat: 20.26168866124048, lng: 85.79766096477218, address: 'Velote - Scooter & Bike Rentals, Bhubaneswar' } },
  { name: 'Yana Zap Point OD 02', type: 'scooter', pricePerHour: 70, description: 'Affordable bike and scooter rental point', location: { lat: 20.235517603640027, lng: 85.76264204386815, address: 'Yana Zap Point OD 02 - Bike Scooter Rental, Bhubaneswar' } },
  { name: 'Royal Bike Rental', type: 'road', pricePerHour: 100, description: 'Royal bike rental service in Bhubaneswar', location: { lat: 20.234593888479854, lng: 85.72760917832863, address: 'Royal Bike Rental, Bhubaneswar' } },
  { name: 'Rajlaxmi Rent & Ride', type: 'scooter', pricePerHour: 75, description: 'Bike and scooter rentals - RRR Bhubaneswar', location: { lat: 20.22429507403344, lng: 85.73388368624514, address: 'Rajlaxmi Rent & Ride (RRR), Bhubaneswar' } },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Bike.deleteMany({});

  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({ name: 'Admin', email: 'admin@bikerental.com', password: hashed, role: 'admin' });
  await Bike.insertMany(bikes);

  console.log('✅ Seeded: admin@bikerental.com / admin123');
  console.log('✅ Added 8 Bhubaneswar rental spots');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

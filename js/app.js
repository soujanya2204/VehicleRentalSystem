// ===== MOCK DATA =====
const vehicles = [
  { id: 1, name: "Toyota Camry",      type: "Sedan",  seats: 5,  fuel: "Petrol", transmission: "Auto",   price: 3500,  status: "available", rating: 4.8, image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80" },
  { id: 2, name: "Ford Explorer",     type: "SUV",    seats: 7,  fuel: "Diesel", transmission: "Auto",   price: 5500,  status: "available", rating: 4.6, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80" },
  { id: 3, name: "Honda CBR 500",     type: "Bike",   seats: 2,  fuel: "Petrol", transmission: "Manual", price: 1800,  status: "available", rating: 4.7, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id: 4, name: "Mercedes Sprinter", type: "Van",    seats: 12, fuel: "Diesel", transmission: "Manual", price: 7500,  status: "booked",    rating: 4.5, image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&q=80" },
  { id: 5, name: "BMW 3 Series",      type: "Sedan",  seats: 5,  fuel: "Petrol", transmission: "Auto",   price: 6500,  status: "available", rating: 4.9, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80" },
  { id: 6, name: "Jeep Wrangler",     type: "SUV",    seats: 5,  fuel: "Petrol", transmission: "Manual", price: 6800,  status: "available", rating: 4.7, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80" },
  { id: 7, name: "Yamaha MT-07",      type: "Bike",   seats: 2,  fuel: "Petrol", transmission: "Manual", price: 2200,  status: "available", rating: 4.6, image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80" },
  { id: 8, name: "Hyundai Tucson",    type: "SUV",    seats: 5,  fuel: "Diesel", transmission: "Auto",   price: 4800,  status: "booked",    rating: 4.4, image: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=600&q=80" },
  { id: 9, name: "Royal Enfield Classic 350", type: "Bike", seats: 2, fuel: "Petrol", transmission: "Manual", price: 1500, status: "available", rating: 4.8, image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80" },
  { id: 10, name: "KTM Duke 390",     type: "Bike",   seats: 2,  fuel: "Petrol", transmission: "Manual", price: 2000,  status: "available", rating: 4.7, image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600&q=80" },
  { id: 11, name: "Bajaj Pulsar 220F", type: "Bike", seats: 2,  fuel: "Petrol", transmission: "Manual", price: 1200,  status: "available", rating: 4.5, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80" },
  { id: 12, name: "Hero Splendor Plus", type: "Bike",   seats: 2, fuel: "Petrol", transmission: "Manual", price: 700,  status: "available", rating: 4.4, image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80" },
  { id: 13, name: "Hero Pleasure+",      type: "Scooty", seats: 2, fuel: "Petrol", transmission: "Auto",   price: 600,  status: "available", rating: 4.3, image: "https://media1.thrillophilia.com/filestore/oqa1j7v9ikia3l3vupkfi9913pf1_sc1.webp?w=576&h=650" },
  { id: 14, name: "Suzuki Access 125",   type: "Scooty", seats: 2, fuel: "Petrol", transmission: "Auto",   price: 680,  status: "available", rating: 4.4, image: "https://imgd.aeplcdn.com/272x153/n/cw/ec/188491/access-125-right-side-view-20.png?isig=0&q=80" },
  { id: 15, name: "TVS iQube Electric",  type: "Scooty", seats: 2, fuel: "Electric", transmission: "Auto", price: 750,  status: "available", rating: 4.6, image: "https://www.tvsmotor.com/electric-scooters/tvs-iqube/-/media/Vehicles/Feature/Iqube/Variant/TVS-iQube-3-0-KW/Color-Images/Copper-Brown/3-kw-copper-brown-01.webp" },
  { id: 16, name: "Electric Scooter",    type: "Scooty", seats: 2, fuel: "Electric", transmission: "Auto", price: 500,  status: "available", rating: 4.2, image: "https://www.joyebike.com/wp-content/uploads/2024/10/Essential-Safety-Features-to-Look-for-in-an-Electric-Scooter.jpg" },
];

const myBookings = [
  { id: "BK-1001", vehicleId: 1, from: "2025-07-10", to: "2025-07-13", days: 3, total: 10500, status: "confirmed", pickup: "Downtown Office" },
  { id: "BK-1002", vehicleId: 3, from: "2025-07-20", to: "2025-07-21", days: 1, total: 1800,  status: "pending",   pickup: "Airport Terminal 2" },
  { id: "BK-0998", vehicleId: 2, from: "2025-06-01", to: "2025-06-05", days: 4, total: 22000, status: "completed", pickup: "City Center" },
  { id: "BK-0990", vehicleId: 4, from: "2025-05-15", to: "2025-05-16", days: 1, total: 7500,  status: "cancelled", pickup: "Downtown Office" },
];

// ===== UTILS =====
function getVehicle(id) { return vehicles.find(v => v.id === id); }

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function showToast(msg, type = "success") {
  let t = document.getElementById("toast");
  t.className = `toast ${type}`;
  t.innerHTML = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

// ===== ACTIVE NAV LINK =====
document.addEventListener("DOMContentLoaded", () => {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
});

# 🚲 BikeRental - Full Stack App

## Stack
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React (Client + Admin)
- **Maps**: Ola Maps API

## Project Structure
```
Rental/
├── server/       → Express API (port 5000)
├── client/       → Customer React app (port 3000)
└── admin/        → Admin React app (port 3001)
```

## Setup & Run

### 1. Start MongoDB
Make sure MongoDB is running locally on port 27017.

### 2. Backend
```bash
cd server
npm install
npm run seed       # Creates admin user + sample bikes
npm start
```

### 3. Client (Customer App)
```bash
cd client
npm install
npm start          # Runs on http://localhost:3000
```

### 4. Admin App
```bash
cd admin
npm install
npm start          # Runs on http://localhost:3001
```

## Default Credentials
- **Admin Login**: `admin@bikerental.com` / `admin123`
- Customers can self-register at `/register`

## Features

### Customer App (port 3000)
- Browse all available bikes with filters
- View bike locations on Ola Maps
- Register/Login
- Book a bike with pickup location & time
- View and cancel own bookings

### Admin App (port 3001)
- Dashboard with stats (bikes, bookings, revenue)
- Add / Edit / Delete bikes
- Toggle bike availability
- View all bookings, filter by status
- Confirm / Complete / Cancel bookings
- View all bike locations on Ola Maps

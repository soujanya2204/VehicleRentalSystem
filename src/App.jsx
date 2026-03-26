import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import VendorLayout from './layouts/VendorLayout'
import Login from './pages/Login'
import Dashboard from './pages/vendor/Dashboard'
import Vehicles from './pages/vendor/Vehicles'
import Bookings from './pages/vendor/Bookings'
import Users from './pages/vendor/Users'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/vendor" replace /> : <Login />} />
      <Route
        path="/vendor"
        element={<ProtectedRoute><VendorLayout /></ProtectedRoute>}
      >
        <Route index element={<Dashboard />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

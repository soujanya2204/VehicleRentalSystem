import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/vendor", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/vendor/vehicles", icon: Car, label: "Vehicles" },
  { to: "/vendor/bookings", icon: CalendarCheck, label: "Bookings" },
  { to: "/vendor/users", icon: Users, label: "Users / KYC" },
];

export default function VendorLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Car size={16} className="text-white" />
            </div>
            <span className="text-white text-lg font-semibold tracking-tight">RentWheels</span>
          </div>
          {user && (
            <p className="text-slate-400 text-xs mt-2 truncate">{user.email}</p>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-slate-700">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-100">
        <Outlet />
      </main>
    </div>
  );
}

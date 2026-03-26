import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Car } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const success = login(form.email, form.password)
      if (success) {
        navigate('/vendor')
      } else {
        setError('Invalid email or password. Please try again.')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car size={20} className="text-white" />
          </div>
          <span className="text-white text-xl font-semibold tracking-tight">RentWheels</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-snug">
            Manage your fleet.<br />Grow your business.
          </h2>
          <p className="text-slate-400 mt-4 text-base leading-relaxed">
            The all-in-one vendor platform for vehicle rentals. Track bookings, manage vehicles, and handle customer verification from one place.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[['1,200+', 'Active Rentals'], ['98%', 'Uptime'], ['4.9', 'Vendor Rating']].map(([val, label]) => (
            <div key={label} className="bg-slate-800 rounded-xl p-4">
              <p className="text-white text-2xl font-bold">{val}</p>
              <p className="text-slate-400 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car size={20} className="text-white" />
            </div>
            <span className="text-slate-900 text-xl font-semibold tracking-tight">RentWheels</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Vendor Sign In</h1>
            <p className="text-slate-500 text-sm mt-1">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="vendor@rentwheels.com"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-8">
            Demo credentials: vendor@rentwheels.com / vendor123
          </p>
        </div>
      </div>
    </div>
  )
}

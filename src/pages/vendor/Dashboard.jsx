import { TrendingUp, Car, CalendarCheck, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const stats = [
  { label: 'Total Bookings', value: '128', change: '+12%', up: true, icon: CalendarCheck, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
  { label: 'Total Revenue', value: '$14,320', change: '+8.4%', up: true, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { label: 'Active Vehicles', value: '34', change: '-2', up: false, icon: Car, color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400' },
  { label: 'Pending KYC', value: '7', change: '+3', up: false, icon: Users, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
]

const recentBookings = [
  { id: 'BK001', user: 'Alice Johnson', vehicle: 'Toyota Camry', date: '2025-07-01', amount: '$320', status: 'Active' },
  { id: 'BK002', user: 'Bob Smith', vehicle: 'Honda Civic', date: '2025-07-02', amount: '$240', status: 'Pending' },
  { id: 'BK003', user: 'Carol White', vehicle: 'Ford Explorer', date: '2025-07-03', amount: '$330', status: 'Completed' },
  { id: 'BK004', user: 'David Lee', vehicle: 'BMW X5', date: '2025-07-04', amount: '$450', status: 'Cancelled' },
]

const statusStyles = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const revenueData = [40, 65, 50, 80, 55, 90, 75, 110, 95, 120, 100, 130]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const maxVal = Math.max(...revenueData)

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Welcome back — here's what's happening today.</p>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">
          July 2025
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Revenue Overview</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Monthly revenue in USD (thousands)</p>
            </div>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full font-medium">+18% YoY</span>
          </div>
          <div className="flex items-end gap-1.5 h-36">
            {revenueData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-md hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
                  style={{ height: `${(v / maxVal) * 100}%` }}
                  title={`$${v}k`}
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Fleet Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Available', count: 20, total: 34, color: 'bg-emerald-500' },
              { label: 'Rented', count: 10, total: 34, color: 'bg-blue-500' },
              { label: 'Maintenance', count: 4, total: 34, color: 'bg-amber-500' },
            ].map(({ label, count, total, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{label}</span>
                  <span className="text-slate-400 dark:text-slate-500">{count} / {total}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quick Stats</p>
            {[['Avg. Booking Value', '$285'], ['Bookings Today', '6'], ['New Users', '3']].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">{k}</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-white">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Recent Bookings</h3>
          <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr className="text-left text-slate-500 dark:text-slate-400">
                {['Booking ID', 'Customer', 'Vehicle', 'Date', 'Amount', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">{b.id}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">{b.user}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{b.vehicle}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{b.date}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">{b.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[b.status]}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

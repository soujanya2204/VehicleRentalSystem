const stats = [
  { label: 'Total Bookings', value: '128', color: 'bg-blue-500', sub: '+12 this week' },
  { label: 'Total Revenue', value: '$14,320', color: 'bg-emerald-500', sub: '+$1,200 this week' },
  { label: 'Active Vehicles', value: '34', color: 'bg-violet-500', sub: '4 under maintenance' },
  { label: 'Pending KYC', value: '7', color: 'bg-amber-500', sub: 'Awaiting review' },
]

const recentBookings = [
  { id: 'BK001', user: 'Alice Johnson', vehicle: 'Toyota Camry', date: '2025-07-01', status: 'Active' },
  { id: 'BK002', user: 'Bob Smith', vehicle: 'Honda Civic', date: '2025-07-02', status: 'Pending' },
  { id: 'BK003', user: 'Carol White', vehicle: 'Ford Explorer', date: '2025-07-03', status: 'Completed' },
  { id: 'BK004', user: 'David Lee', vehicle: 'BMW X5', date: '2025-07-04', status: 'Cancelled' },
]

const statusColors = {
  Active: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Completed: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
            <div className={`${s.color} w-2 self-stretch rounded-full`} />
            <div>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-base font-semibold text-slate-700 mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="pb-2 font-medium">ID</th>
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Vehicle</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3 text-slate-500">{b.id}</td>
                  <td className="py-3 font-medium text-slate-700">{b.user}</td>
                  <td className="py-3 text-slate-600">{b.vehicle}</td>
                  <td className="py-3 text-slate-500">{b.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
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

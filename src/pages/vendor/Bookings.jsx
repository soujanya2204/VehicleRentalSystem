import { useState } from 'react'

const initialBookings = [
  { id: 'BK001', user: 'Alice Johnson', vehicle: 'Toyota Camry', start: '2025-07-01', end: '2025-07-05', total: '$320', status: 'Pending' },
  { id: 'BK002', user: 'Bob Smith', vehicle: 'Honda Civic', start: '2025-07-03', end: '2025-07-06', total: '$240', status: 'Active' },
  { id: 'BK003', user: 'Carol White', vehicle: 'Ford Explorer', start: '2025-06-28', end: '2025-07-01', total: '$330', status: 'Completed' },
  { id: 'BK004', user: 'David Lee', vehicle: 'BMW X5', start: '2025-07-07', end: '2025-07-10', total: '$450', status: 'Pending' },
  { id: 'BK005', user: 'Eva Green', vehicle: 'Tesla Model 3', start: '2025-07-02', end: '2025-07-04', total: '$180', status: 'Cancelled' },
]

const statusColors = {
  Active: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Completed: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const filters = ['All', 'Pending', 'Active', 'Completed', 'Cancelled']

export default function Bookings() {
  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter] = useState('All')

  const updateStatus = (id, status) =>
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)))

  const filtered = filter === 'All' ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-2xl font-bold text-slate-800">Bookings</h2>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left text-slate-500">
                {['Booking ID', 'User', 'Vehicle', 'Start', 'End', 'Total', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{b.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{b.user}</td>
                  <td className="px-4 py-3 text-slate-600">{b.vehicle}</td>
                  <td className="px-4 py-3 text-slate-500">{b.start}</td>
                  <td className="px-4 py-3 text-slate-500">{b.end}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{b.total}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(b.id, 'Active')}
                          className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg transition-colors">
                          Approve
                        </button>
                        <button onClick={() => updateStatus(b.id, 'Cancelled')}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors">
                          Reject
                        </button>
                      </div>
                    )}
                    {b.status === 'Active' && (
                      <button onClick={() => updateStatus(b.id, 'Completed')}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors">
                        Mark Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 py-10 text-sm">No bookings found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

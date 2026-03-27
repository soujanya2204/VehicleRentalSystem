import { useState } from 'react'
import { useNotifications } from '../../context/NotificationContext'

const initialBookings = [
  { id: 'BK001', user: 'Alice Johnson', vehicle: 'Toyota Camry', start: '2025-07-01', end: '2025-07-05', total: '$320', status: 'Pending' },
  { id: 'BK002', user: 'Bob Smith', vehicle: 'Honda Civic', start: '2025-07-03', end: '2025-07-06', total: '$240', status: 'Active' },
  { id: 'BK003', user: 'Carol White', vehicle: 'Ford Explorer', start: '2025-06-28', end: '2025-07-01', total: '$330', status: 'Completed' },
  { id: 'BK004', user: 'David Lee', vehicle: 'BMW X5', start: '2025-07-07', end: '2025-07-10', total: '$450', status: 'Pending' },
  { id: 'BK005', user: 'Eva Green', vehicle: 'Tesla Model 3', start: '2025-07-02', end: '2025-07-04', total: '$180', status: 'Cancelled' },
]

const statusStyles = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const filters = ['All', 'Pending', 'Active', 'Completed', 'Cancelled']

export default function Bookings() {
  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter] = useState('All')
  const { addNotification } = useNotifications()

  const updateStatus = (id, status) => {
    const booking = bookings.find(b => b.id === id)
    setBookings(b => b.map(x => x.id === id ? { ...x, status } : x))
    if (status === 'Cancelled') {
      addNotification({ type: 'cancellation', title: 'Booking Cancelled', message: `${booking.user}'s booking for ${booking.vehicle} was cancelled`, time: 'Just now' })
    }
  }

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter)

  const counts = filters.slice(1).reduce((acc, f) => ({ ...acc, [f]: bookings.filter(b => b.status === f).length }), {})

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bookings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{bookings.length} total bookings</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>
            {f}
            {f !== 'All' && counts[f] > 0 && (
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${filter === f ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>{counts[f]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
              <tr className="text-left text-slate-500 dark:text-slate-400">
                {['Booking ID', 'Customer', 'Vehicle', 'Start', 'End', 'Total', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">{b.id}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">{b.user}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{b.vehicle}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{b.start}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{b.end}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">{b.total}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {b.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(b.id, 'Active')} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">Approve</button>
                        <button onClick={() => updateStatus(b.id, 'Cancelled')} className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">Reject</button>
                      </div>
                    )}
                    {b.status === 'Active' && (
                      <button onClick={() => updateStatus(b.id, 'Completed')} className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">Mark Done</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-slate-400 dark:text-slate-500 py-12 text-sm">No bookings found.</p>}
        </div>
      </div>
    </div>
  )
}

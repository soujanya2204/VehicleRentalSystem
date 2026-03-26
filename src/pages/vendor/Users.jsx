import { useState } from 'react'
import { CheckCircle, XCircle, Eye } from 'lucide-react'

const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', joined: '2025-06-10', kyc: 'Pending', doc: 'passport.jpg' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', joined: '2025-06-15', kyc: 'Approved', doc: 'license.jpg' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', joined: '2025-06-20', kyc: 'Pending', doc: 'id_card.jpg' },
  { id: 4, name: 'David Lee', email: 'david@example.com', joined: '2025-06-25', kyc: 'Rejected', doc: 'passport.jpg' },
  { id: 5, name: 'Eva Green', email: 'eva@example.com', joined: '2025-07-01', kyc: 'Pending', doc: 'license.jpg' },
]

const kycColors = {
  Approved: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Rejected: 'bg-red-100 text-red-700',
}

export default function Users() {
  const [users, setUsers] = useState(initialUsers)
  const [filter, setFilter] = useState('All')

  const updateKyc = (id, status) =>
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, kyc: status } : x)))

  const filtered = filter === 'All' ? users : users.filter((u) => u.kyc === filter)

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-2xl font-bold text-slate-800">Users / KYC</h2>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Pending', 'Approved', 'Rejected'].map((f) => (
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
                {['User', 'Email', 'Joined', 'KYC Doc', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">{u.name}</td>
                  <td className="px-4 py-3 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3 text-slate-500">{u.joined}</td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors">
                      <Eye size={13} /> {u.doc}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${kycColors[u.kyc]}`}>
                      {u.kyc}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.kyc === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateKyc(u.id, 'Approved')}
                          className="flex items-center gap-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg transition-colors">
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button onClick={() => updateKyc(u.id, 'Rejected')}
                          className="flex items-center gap-1 text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors">
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}
                    {u.kyc === 'Rejected' && (
                      <button onClick={() => updateKyc(u.id, 'Pending')}
                        className="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1 rounded-lg transition-colors">
                        Re-review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 py-10 text-sm">No users found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useRef } from 'react'
import { Pencil, Trash2, Plus, X, Upload } from 'lucide-react'

const initialVehicles = [
  { id: 1, name: 'Toyota Camry', type: 'Sedan', status: 'Available', priceHour: 15, priceDay: 80, priceWeek: 450, image: null },
  { id: 2, name: 'Ford Explorer', type: 'SUV', status: 'Rented', priceHour: 20, priceDay: 110, priceWeek: 650, image: null },
]

const empty = { name: '', type: 'Sedan', status: 'Available', priceHour: '', priceDay: '', priceWeek: '', image: null }

export default function Vehicles() {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [modal, setModal] = useState(null) // null | 'add' | vehicle obj
  const [form, setForm] = useState(empty)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  const openAdd = () => { setForm(empty); setPreview(null); setModal('add') }
  const openEdit = (v) => { setForm(v); setPreview(v.image); setModal(v) }
  const closeModal = () => { setModal(null); setPreview(null) }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setForm((f) => ({ ...f, image: url }))
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (modal === 'add') {
      setVehicles((v) => [...v, { ...form, id: Date.now() }])
    } else {
      setVehicles((v) => v.map((x) => (x.id === modal.id ? { ...form, id: modal.id } : x)))
    }
    closeModal()
  }

  const handleDelete = (id) => setVehicles((v) => v.filter((x) => x.id !== id))

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Vehicles</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
              {v.image
                ? <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                : <span className="text-slate-400 text-sm">No Image</span>}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{v.name}</p>
                  <p className="text-xs text-slate-400">{v.type}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {v.status}
                </span>
              </div>
              <div className="flex gap-3 text-xs text-slate-500">
                <span>${v.priceHour}/hr</span>
                <span>${v.priceDay}/day</span>
                <span>${v.priceWeek}/wk</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => openEdit(v)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition-colors">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(v.id)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">{modal === 'add' ? 'Add Vehicle' : 'Edit Vehicle'}</h3>
              <button onClick={closeModal}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
            </div>

            {/* Image Upload */}
            <div
              onClick={() => fileRef.current.click()}
              className="h-36 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden"
            >
              {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                : <><Upload size={24} className="text-slate-300 mb-1" /><p className="text-xs text-slate-400">Click to upload image</p></>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-slate-500 mb-1 block">Vehicle Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Toyota Camry" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['Sedan', 'SUV', 'Truck', 'Van', 'Convertible', 'Hatchback'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Available</option>
                  <option>Rented</option>
                  <option>Maintenance</option>
                </select>
              </div>
              {[['priceHour', 'Price / Hour ($)'], ['priceDay', 'Price / Day ($)'], ['priceWeek', 'Price / Week ($)']].map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                  <input type="number" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={closeModal} className="flex-1 border border-slate-200 text-slate-600 text-sm py-2 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors">
                {modal === 'add' ? 'Add Vehicle' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

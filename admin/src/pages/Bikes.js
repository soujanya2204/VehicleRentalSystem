import React, { useEffect, useState } from 'react';
import api from '../api';

const empty = { name: '', type: '', pricePerHour: '', description: '', image: '', location: { lat: 12.9716, lng: 77.5946, address: 'Bangalore, India' } };

export default function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/bikes').then(r => setBikes(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/bikes/${editing}`, form);
      } else {
        await api.post('/bikes', form);
      }
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving bike');
    }
  };

  const handleEdit = bike => {
    setForm({ name: bike.name, type: bike.type, pricePerHour: bike.pricePerHour, description: bike.description, image: bike.image, location: bike.location });
    setEditing(bike._id); setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this bike?')) return;
    await api.delete(`/bikes/${id}`); load();
  };

  const toggleAvail = async bike => {
    await api.put(`/bikes/${bike._id}`, { available: !bike.available }); load();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Manage Bikes</h2>
        <button style={styles.addBtn} onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ Add Bike'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={styles.formTitle}>{editing ? 'Edit Bike' : 'Add New Bike'}</h3>
          <div style={styles.formGrid}>
            {[['name', 'Bike Name'], ['type', 'Type (mountain/road/electric)'], ['pricePerHour', 'Price per Hour (₹)'], ['image', 'Image URL'], ['description', 'Description']].map(([key, placeholder]) => (
              <input key={key} style={styles.input} placeholder={placeholder}
                value={form[key]} type={key === 'pricePerHour' ? 'number' : 'text'}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                required={['name', 'type', 'pricePerHour'].includes(key)} />
            ))}
            <input style={styles.input} placeholder="Location Address" value={form.location.address}
              onChange={e => setForm({ ...form, location: { ...form.location, address: e.target.value } })} />
            <input style={styles.input} placeholder="Latitude" type="number" value={form.location.lat}
              onChange={e => setForm({ ...form, location: { ...form.location, lat: parseFloat(e.target.value) } })} />
            <input style={styles.input} placeholder="Longitude" type="number" value={form.location.lng}
              onChange={e => setForm({ ...form, location: { ...form.location, lng: parseFloat(e.target.value) } })} />
          </div>
          <button style={styles.saveBtn} type="submit">{editing ? 'Update Bike' : 'Add Bike'}</button>
        </form>
      )}

      <div style={styles.table}>
        <table style={styles.tbl}>
          <thead>
            <tr style={styles.thead}>
              {['Name', 'Type', 'Price/hr', 'Status', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {bikes.map(bike => (
              <tr key={bike._id} style={styles.tr}>
                <td style={styles.td}>{bike.name}</td>
                <td style={styles.td}>{bike.type}</td>
                <td style={styles.td}>₹{bike.pricePerHour}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: bike.available ? '#22c55e' : '#ef4444' }}>
                    {bike.available ? 'Available' : 'Booked'}
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(bike)}>Edit</button>
                  <button style={styles.toggleBtn} onClick={() => toggleAvail(bike)}>
                    {bike.available ? 'Mark Booked' : 'Mark Available'}
                  </button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(bike._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '32px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heading: { fontSize: '1.8rem', color: '#1a1a2e', margin: 0 },
  addBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  form: { background: '#fff', padding: '24px', borderRadius: '10px', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  formTitle: { margin: '0 0 16px', color: '#1a1a2e' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' },
  input: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' },
  saveBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer' },
  table: { background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  tbl: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f7fafc' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '0.85rem', color: '#718096', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f0f4f8' },
  td: { padding: '14px 16px', fontSize: '0.9rem', color: '#2d3748' },
  badge: { color: '#fff', padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '600' },
  editBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '0.8rem' },
  toggleBtn: { background: '#f59e0b', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '0.8rem' },
  deleteBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }
};

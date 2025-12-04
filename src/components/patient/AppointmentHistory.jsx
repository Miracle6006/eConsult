import React, { useState, useEffect } from 'react'

export default function Appointment() {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}')
    setAppointments(raw.appointments || [])
  }, [])

  const cancelAppointment = (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}')
    raw.appointments = (raw.appointments || []).map(a => 
      a.id === id ? { ...a, status: 'Cancelled' } : a
    )
    localStorage.setItem('econsult_data_v1', JSON.stringify(raw))
    setAppointments(raw.appointments)
  }

  return (
    <div style={{
      maxWidth: 1200,
      width: '95%',
      margin: '40px auto',
      padding: 40,
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#1d4ed8', marginBottom: 32, textAlign: 'center' }}>My Appointments</h2>

      {appointments.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center' }}>No appointments booked yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ padding: 14, textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>ID</th>
              <th style={{ padding: 14, textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Patient Name</th>
              <th style={{ padding: 14, textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Type</th>
              <th style={{ padding: 14, textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Date</th>
              <th style={{ padding: 14, textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: 14, textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Notes</th>
              <th style={{ padding: 14, textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: a.status === 'Cancelled' ? '#fef2f2' : 'transparent' }}>
                <td style={{ padding: 14 }}>{a.id}</td>
                <td style={{ padding: 14 }}>{a.patientName}</td>
                <td style={{ padding: 14 }}>{a.type}</td>
                <td style={{ padding: 14 }}>{a.date}</td>
                <td style={{ padding: 14, color: a.status === 'Cancelled' ? '#ef4444' : a.status === 'Completed' ? '#10b981' : '#fbbf24', fontWeight: 600 }}>
                  {a.status}
                </td>
                <td style={{ padding: 14 }}>{a.notes || '-'}</td>
                <td style={{ padding: 14, textAlign: 'center' }}>
                  {a.status !== 'Cancelled' && (
                    <button
                      onClick={() => cancelAppointment(a.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 6,
                        border: 'none',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  {a.status === 'Cancelled' && <span style={{ color: '#6b7280' }}>N/A</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

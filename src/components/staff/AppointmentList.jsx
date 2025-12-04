import React, { useState, useEffect } from 'react'

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}')
    setAppointments(raw.appointments || [])
  }, [])

  return (
    <div style={{
      maxWidth: 1100,  // widened
      margin: '40px auto',
      padding: '40px',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ marginBottom: 25, color: '#1d4ed8' }}>Appointments</h2> {/* blue title */}

      {appointments.length === 0 ? (
        <p style={{ color: '#555' }}>No appointments yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
              <th style={{ padding: '12px 18px', color: '#1d4ed8' }}>Patient Name</th>
              <th style={{ padding: '12px 18px', color: '#1d4ed8' }}>Email</th>
              <th style={{ padding: '12px 18px', color: '#1d4ed8' }}>Contact</th>
              <th style={{ padding: '12px 18px', color: '#1d4ed8' }}>Date</th>
              <th style={{ padding: '12px 18px', color: '#1d4ed8' }}>Time</th>
              <th style={{ padding: '12px 18px', color: '#1d4ed8' }}>Type</th>
              <th style={{ padding: '12px 18px', color: '#1d4ed8' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} style={{ borderBottom: '1px solid #eee', color: '#1d4ed8' }}>
                <td style={{ padding: '12px 18px' }}>{a.patientName || '-'}</td>
                <td style={{ padding: '12px 18px' }}>{a.email || '-'}</td>
                <td style={{ padding: '12px 18px' }}>{a.contact || '-'}</td>
                <td style={{ padding: '12px 18px' }}>{a.date || '-'}</td>
                <td style={{ padding: '12px 18px' }}>{a.time || '-'}</td>
                <td style={{ padding: '12px 18px' }}>{a.type || '-'}</td>
                <td style={{ padding: '12px 18px' }}>{a.status || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

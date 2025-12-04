import React, { useState, useEffect } from 'react'

export default function BookAppointmentForm({ onBooked }) {
  const [appointments, setAppointments] = useState([])
  const [patientName, setPatientName] = useState('')
  const [appointmentType, setAppointmentType] = useState('Clinic Visit')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('09:00')
  const [noteOption, setNoteOption] = useState('Eye check')
  const [customNote, setCustomNote] = useState('')

  const noteOptionsList = [
    'Eye check',
    'Routine check',
    'Tooth check',
    'Ear check',
    'Antenatal',
    'Rescheduled',
    'Back pain',
    'Others'
  ]

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}')
    setAppointments(raw.appointments || [])
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (!patientName || !date || !time) {
      alert('Please provide Name, Date, and Time')
      return
    }

    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}')
    const allAppointments = raw.appointments || []
    const id = 'app-' + Date.now()

    const newApp = {
      id,
      patientName,
      type: appointmentType,
      date,
      time,
      notes: noteOption === 'Others' ? customNote : noteOption,
      createdAt: new Date().toISOString()
    }

    raw.appointments = [newApp, ...allAppointments]
    localStorage.setItem('econsult_data_v1', JSON.stringify(raw))

    setAppointments(raw.appointments)
    setPatientName('')
    setAppointmentType('Clinic Visit')
    setDate(new Date().toISOString().split('T')[0])
    setTime('09:00')
    setNoteOption('Eye check')
    setCustomNote('')

    onBooked && onBooked()
    alert(`Appointment booked (ID: ${id}) for ${patientName} on ${date} at ${time}`)
  }

  return (
    <div style={{
      maxWidth: 900,
      width: '100%',
      margin: '40px auto',
      padding: 36,
      borderRadius: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ marginBottom: 24, color: '#1d4ed8', textAlign: 'center' }}>Book Appointment</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: 6, fontWeight: 500, color: '#374151' }}>Full Name *</label>
          <input
            type="text"
            placeholder="Patient Name"
            value={patientName}
            onChange={e => setPatientName(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: 6, fontWeight: 500, color: '#374151' }}>Appointment Type *</label>
          <select
            value={appointmentType}
            onChange={e => setAppointmentType(e.target.value)}
            style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 15, backgroundColor: '#fff' }}
          >
            <option>Clinic Visit</option>
            <option>Home Visit</option>
            <option>Virtual Meet</option>
            <option>Ambulance</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: 6, fontWeight: 500, color: '#374151' }}>Date *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: 6, fontWeight: 500, color: '#374151' }}>Time *</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: 6, fontWeight: 500, color: '#374151' }}>Reason / Notes</label>
          <select
            value={noteOption}
            onChange={e => setNoteOption(e.target.value)}
            style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 15, backgroundColor: '#fff' }}
          >
            {noteOptionsList.map(note => <option key={note}>{note}</option>)}
          </select>
          {noteOption === 'Others' && (
            <input
              type="text"
              placeholder="Enter custom note"
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              style={{ padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 15, marginTop: 10 }}
            />
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: 14,
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#1d4ed8',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 10
          }}
        >
          Save Appointment
        </button>
      </form>
    </div>
  )
}

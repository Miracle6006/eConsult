import React, { useState } from 'react'

export default function PatientForm({ onSaved }) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [notes, setNotes] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name || !age) return alert('Name and age are required')

    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}')
    const patients = raw.patients || []
    const id = 'pat-' + Date.now()
    const newPatient = { id, name, age: Number(age), notes, createdAt: new Date().toISOString() }
    raw.patients = [newPatient, ...patients]
    localStorage.setItem('econsult_data_v1', JSON.stringify(raw))

    setName(''); setAge(''); setNotes('')
    onSaved && onSaved()
    alert('Patient added: ' + name)
  }

  return (
    <form onSubmit={submit}>
      <h4>Add Patient</h4>
      <div className="form-row">
        <input placeholder="Patient Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>
      <div className="form-row">
        <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ height: 64 }} />
      </div>
      <button className="button small-btn" type="submit">Save Patient</button>
    </form>
  )
}

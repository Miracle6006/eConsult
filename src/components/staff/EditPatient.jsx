import React, { useState, useEffect } from 'react'

export default function EditPatient({ patientId, onUpdated }) {
  const [patient, setPatient] = useState(null)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}')
    const pat = (raw.patients || []).find(p => p.id === patientId)
    if (pat) {
      setPatient(pat)
      setName(pat.name)
      setAge(pat.age)
      setNotes(pat.notes || '')
    }
  }, [patientId])

  const submit = (e) => {
    e.preventDefault()
    if (!name || !age) return alert('Name and age required')

    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}')
    raw.patients = (raw.patients || []).map(p => p.id === patientId ? { ...p, name, age: Number(age), notes } : p)
    localStorage.setItem('econsult_data_v1', JSON.stringify(raw))
    onUpdated && onUpdated()
    alert('Patient updated')
  }

  if (!patient) return <p>Loading patient...</p>

  return (
    <form onSubmit={submit}>
      <h4>Edit Patient</h4>
      <div className="form-row">
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={age} onChange={(e) => setAge(e.target.value)} />
      </div>
      <div className="form-row">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ height: 64 }} />
      </div>
      <button className="button small-btn" type="submit">Update Patient</button>
    </form>
  )
}

import React, { useState, useEffect } from 'react'

export default function PatientProfile() {
  const [profile, setProfile] = useState({
    patientId: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    picture: ''
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const allProfiles = JSON.parse(localStorage.getItem('patient_profiles') || '{}')

    if (user.email && allProfiles[user.email]) {
      setProfile(allProfiles[user.email])
    } else if (user.email) {
      setProfile((prev) => ({ ...prev, patientId: 'PID-' + Date.now(), email: user.email }))
    }
  }, [])

  const handlePictureUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setProfile({ ...profile, picture: reader.result })
      reader.readAsDataURL(file)
    }
  }

  const saveProfile = () => {
    const allProfiles = JSON.parse(localStorage.getItem('patient_profiles') || '{}')
    allProfiles[profile.email] = profile
    localStorage.setItem('patient_profiles', JSON.stringify(allProfiles))
    alert('Profile updated')
  }

  const styles = {
    container: {
      maxWidth: 1000,
      width: '95%',
      margin: '40px auto',
      padding: 40,
      borderRadius: 12,
      boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    },
    header: { textAlign: 'center', marginBottom: 32, color: '#1d4ed8', fontSize: 30, fontWeight: 700 },
    formRow: { display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 },
    label: { fontWeight: 500, color: '#374151', marginBottom: 6 },
    input: { padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 },
    picture: { width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 },
    button: {
      padding: 16,
      borderRadius: 8,
      border: 'none',
      backgroundColor: '#1d4ed8',
      color: '#fff',
      fontWeight: 600,
      fontSize: 16,
      cursor: 'pointer'
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>My Profile</h2>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        {profile.picture ? (
          <img src={profile.picture} alt="Profile" style={styles.picture} />
        ) : (
          <div style={{ ...styles.picture, backgroundColor: '#e5e7eb', display: 'inline-block' }}></div>
        )}
        <input type="file" accept="image/*" onChange={handlePictureUpload} style={{ marginTop: 14 }} />
      </div>

      <div style={styles.formRow}>
        <div>
          <label style={styles.label}>Patient ID</label>
          <input style={styles.input} type="text" value={profile.patientId} readOnly />
        </div>
        <div>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div>
          <label style={styles.label}>Phone</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Phone"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>
        <div>
          <label style={styles.label}>Address</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Address"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />
        </div>
        <div>
          <label style={styles.label}>Age</label>
          <input
            style={styles.input}
            type="number"
            placeholder="Age"
            value={profile.age}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button style={styles.button} onClick={saveProfile}>Save Profile</button>
      </div>
    </div>
  )
}

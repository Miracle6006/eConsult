import React, { useState, useEffect } from 'react'

export default function StaffProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    jobRole: '',
    email: '',
    contact: '',
    address: '',
    managerName: '',
    managerEmail: '',
    profilePicture: ''
  })

  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const savedProfiles = JSON.parse(localStorage.getItem('staff_profiles') || '{}')
    if (user.email && savedProfiles[user.email]) {
      setProfile(savedProfiles[user.email])
    } else if (user.email) {
      setProfile(prev => ({ ...prev, email: user.email }))
    }
  }, [])

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfile(prev => ({ ...prev, profilePicture: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const saveProfile = () => {
    const savedProfiles = JSON.parse(localStorage.getItem('staff_profiles') || '{}')
    savedProfiles[profile.email] = profile
    localStorage.setItem('staff_profiles', JSON.stringify(savedProfiles))
    alert('Profile saved')
    setEditing(false)
  }

  return (
    <div style={{
      maxWidth: 600,
      margin: '40px auto',
      padding: '30px',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ marginBottom: 20, color: '#333' }}>My Profile</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {/* Profile Picture */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <img
            src={profile.profilePicture || 'https://via.placeholder.com/120'}
            alt="Profile"
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ padding: 5, cursor: 'pointer' }}
          />
        </div>

        {/* Form Fields */}
        {[
          { label: 'Full Name', key: 'fullName' },
          { label: 'Job Role', key: 'jobRole' },
          { label: 'Email', key: 'email', readOnly: true },
          { label: 'Contact', key: 'contact' },
          { label: 'Address', key: 'address' },
          { label: 'Manager Name', key: 'managerName' },
          { label: 'Manager Email', key: 'managerEmail' }
        ].map(field => (
          <div key={field.key} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: 5, fontWeight: 500 }}>{field.label}</label>
            <input
              type="text"
              value={profile[field.key]}
              readOnly={!editing || field.readOnly}
              onChange={e => handleChange(field.key, e.target.value)}
              style={{
                padding: 10,
                borderRadius: 5,
                border: '1px solid #ccc',
                backgroundColor: (!editing || field.readOnly) ? '#f9f9f9' : '#fff'
              }}
            />
          </div>
        ))}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button
            onClick={() => setEditing(!editing)}
            style={{
              padding: 12,
              borderRadius: 5,
              border: 'none',
              backgroundColor: '#f59e0b',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>

          <button
            onClick={saveProfile}
            style={{
              padding: 12,
              borderRadius: 5,
              border: 'none',
              backgroundColor: '#007bff',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}

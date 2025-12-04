import React, { useState, useEffect } from 'react'

// Centralized Data Manager - Use this across all your components
export const DataManager = {
  // Get all patients
  getPatients: () => {
    try {
      return JSON.parse(localStorage.getItem('patients_profile'))
    } catch {
      return []
    }
  },
  
  // Save patients
  savePatients: (patients) => {
    try {
      localStorage.setItem('patients_profile', JSON.stringify(patients))
      // Trigger storage event for cross-component sync
      window.dispatchEvent(new Event('patients-updated'))
    } catch (e) {
      console.error('Error saving patients:', e)
    }
  },
  
  // Add new patient
  addPatient: (patient) => {
    const patients = DataManager.getPatients()
    const newPatient = {
      id: 'PAT' + Date.now(),
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      lastVisit: '',
      ...patient
    }
    patients.push(newPatient)
    DataManager.savePatients(patients)
    return newPatient
  },
  
  // Get appointments
  getAppointments: () => {
    try {
      return JSON.parse(sessionStorage.getItem('clinic_appointments') || '[]')
    } catch {
      return []
    }
  },
  
  // Save appointments
  saveAppointments: (appointments) => {
    sessionStorage.setItem('clinic_appointments', JSON.stringify(appointments))
    window.dispatchEvent(new Event('appointments-updated'))
  }
}

export default function PatientManagement() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    medicalHistory: 'None',
    allergies: 'None'
  })
    const handleUpdate = () => loadPatients()

  // Load patients on mount
  useEffect(() => {
    loadPatients()
    
    // Listen for patient updates
    window.addEventListener('patients-updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    
    return () => {
      window.removeEventListener('patients-updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const loadPatients = () => {
    const loadedPatients = DataManager.getPatients()
    setPatients(loadedPatients)
   
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddPatient = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields (Name, Email, Phone)')
      return
    }
    
    const newPatient = DataManager.addPatient(formData)
    setPatients(prev => [...prev, newPatient])
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'O+',
      address: '',
      medicalHistory: 'None',
      allergies: 'None'
    })
    setShowAddForm(false)
    alert('✅ Patient added successfully! This patient is now available across all dashboards.')
  }

  const viewPatientProfile = (patient) => {
    setSelectedPatient(patient)
    setShowProfile(true)
  }

  const closeProfile = () => {
    setShowProfile(false)
    setSelectedPatient(null)
  }

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const styles = {
    container: {
      padding: 32,
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    },
    headerSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      flexWrap: 'wrap',
      gap: 16
    },
    header: {
      fontSize: 28,
      fontWeight: 700,
      color: '#1a1f2e',
      marginBottom: 8
    },
    subtitle: {
      fontSize: 14,
      color: '#6b7280'
    },
    addButton: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: '12px 24px',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    searchBox: {
      width: '100%',
      maxWidth: 400,
      padding: '12px 16px',
      borderRadius: 8,
      border: '1px solid #e5e7eb',
      fontSize: 14,
      marginBottom: 24
    },
    patientGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 20
    },
    patientCard: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    patientHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: 12
    },
    patientName: {
      fontSize: 18,
      fontWeight: 600,
      color: '#1a1f2e',
      marginBottom: 4
    },
    patientId: {
      fontSize: 12,
      color: '#6b7280',
      backgroundColor: '#f3f4f6',
      padding: '4px 8px',
      borderRadius: 4
    },
    patientInfo: {
      fontSize: 14,
      color: '#6b7280',
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    viewButton: {
      width: '100%',
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '10px',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 600,
      marginTop: 12
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    },
    modalCard: {
      backgroundColor: '#fff',
      borderRadius: 16,
      maxWidth: 700,
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    modalHeader: {
      padding: 24,
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 700,
      color: '#1a1f2e'
    },
    closeButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '8px 16px',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 600
    },
    modalBody: {
      padding: 24
    },
    formGroup: {
      marginBottom: 16
    },
    label: {
      display: 'block',
      fontSize: 14,
      fontWeight: 600,
      color: '#374151',
      marginBottom: 6
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: 8,
      border: '1px solid #e5e7eb',
      fontSize: 14,
      boxSizing: 'border-box'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    },
    submitButton: {
      width: '100%',
      backgroundColor: '#10b981',
      color: 'white',
      padding: '12px',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 600,
      marginTop: 8
    },
    profileSection: {
      marginBottom: 24
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: '#374151',
      marginBottom: 12,
      paddingBottom: 8,
      borderBottom: '2px solid #e5e7eb'
    },
    profileRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      marginBottom: 12
    },
    profileField: {
      marginBottom: 12
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: 600,
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: 4
    },
    fieldValue: {
      fontSize: 15,
      color: '#1a1f2e'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.header}>View all Patients</h1>
          <p style={styles.subtitle}>Total Patients: {patients.length}</p>
        </div>
        <button style={styles.addButton} onClick={() => setShowAddForm(true)}>
          ➕ Add New Patient
        </button>
      </div>

      <input
        type="text"
        placeholder="Search patients by name, ID, or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBox}
      />

      {/* Patient Grid */}
      <div style={styles.patientGrid}>
        {filteredPatients.map(patient => (
          <div
            key={patient.id}
            style={styles.patientCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div style={styles.patientHeader}>
              <div>
                <div style={styles.patientName}>{patient.name}</div>
                <span style={styles.patientId}>{patient.id}</span>
              </div>
              <span style={styles.statusBadge}>{patient.status}</span>
            </div>
            
            <div style={styles.patientInfo}>📧 {patient.email}</div>
            <div style={styles.patientInfo}>📱 {patient.phone}</div>
            <div style={styles.patientInfo}>👤 {patient.age} years • {patient.gender}</div>
            <div style={styles.patientInfo}>🩸 Blood Group: {patient.bloodGroup}</div>

            <button 
              style={styles.viewButton}
              onClick={() => viewPatientProfile(patient)}
            >
              View Full Profile
            </button>
          </div>
        ))}
      </div>

      {/* Add Patient Form Modal */}
      {showAddForm && (
        <div style={styles.modal} onClick={() => setShowAddForm(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Patient</h2>
              <button style={styles.closeButton} onClick={() => setShowAddForm(false)}>
                Close
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={styles.input}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  style={styles.input}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Medical History</label>
                <input
                  type="text"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <button onClick={handleAddPatient} style={styles.submitButton}>
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Profile Modal */}
      {showProfile && selectedPatient && (
        <div style={styles.modal} onClick={closeProfile}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Patient Profile</h2>
              <button style={styles.closeButton} onClick={closeProfile}>
                Close
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Personal Information</h3>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Full Name</div>
                    <div style={styles.fieldValue}>{selectedPatient.name}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Patient ID</div>
                    <div style={styles.fieldValue}>{selectedPatient.id}</div>
                  </div>
                </div>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Age</div>
                    <div style={styles.fieldValue}>{selectedPatient.age} years</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Gender</div>
                    <div style={styles.fieldValue}>{selectedPatient.gender}</div>
                  </div>
                </div>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Blood Group</div>
                    <div style={styles.fieldValue}>{selectedPatient.bloodGroup}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Status</div>
                    <div style={styles.fieldValue}>{selectedPatient.status}</div>
                  </div>
                </div>
              </div>

              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Contact Information</h3>
                <div style={styles.profileField}>
                  <div style={styles.fieldLabel}>Email</div>
                  <div style={styles.fieldValue}>{selectedPatient.email}</div>
                </div>
                <div style={styles.profileField}>
                  <div style={styles.fieldLabel}>Phone</div>
                  <div style={styles.fieldValue}>{selectedPatient.phone}</div>
                </div>
                <div style={styles.profileField}>
                  <div style={styles.fieldLabel}>Address</div>
                  <div style={styles.fieldValue}>{selectedPatient.address}</div>
                </div>
              </div>

              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Medical Information</h3>
                <div style={styles.profileField}>
                  <div style={styles.fieldLabel}>Medical History</div>
                  <div style={styles.fieldValue}>{selectedPatient.medicalHistory}</div>
                </div>
                <div style={styles.profileField}>
                  <div style={styles.fieldLabel}>Allergies</div>
                  <div style={styles.fieldValue}>{selectedPatient.allergies}</div>
                </div>
              </div>

              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Registration Information</h3>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Registered Date</div>
                    <div style={styles.fieldValue}>{selectedPatient.registeredDate}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Last Visit</div>
                    <div style={styles.fieldValue}>{selectedPatient.lastVisit || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
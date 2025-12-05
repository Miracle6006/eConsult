// src/components/admin/PatientManagement.jsx
import React, { useState, useEffect } from 'react';

// ──────────────────────────────────────────────────────────────
// BULLETPROOF DATA MANAGER – uses the SAME key as your Dashboard
// ──────────────────────────────────────────────────────────────
const DataManager = {
  STORAGE_KEY: 'patient_profiles', // ←←← matches your AdminDashboard

  getPatients: () => {
    try {
      const raw = localStorage.getItem(DataManager.STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      // If someone accidentally saved an object {} instead of array []
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('Corrupted patient_profiles in localStorage → resetting to []');
      localStorage.setItem(DataManager.STORAGE_KEY, '[]');
      return [];
    }
  },

  savePatients: (patients) => {
    try {
      const safe = Array.isArray(patients) ? patients : [];
      localStorage.setItem(DataManager.STORAGE_KEY, JSON.stringify(safe));
      window.dispatchEvent(new Event('patients-updated'));
    } catch (e) {
      console.error('Failed to save patients:', e);
    }
  },

  addPatient: (patientData) => {
    const patients = DataManager.getPatients();
    const newPatient = {
      id: 'PAT' + Date.now(),
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      lastVisit: '',
      ...patientData,
    };
    patients.push(newPatient);
    DataManager.savePatients(patients);
    return newPatient;
  },
};

// ──────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────
export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    medicalHistory: 'None',
    allergies: 'None',
  });

  const loadPatients = () => {
    setPatients(DataManager.getPatients());
  };

  useEffect(() => {
    loadPatients();

    const handler = () => loadPatients();
    window.addEventListener('patients-updated', handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('patients-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = () => {
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.phone?.trim()) {
      alert('Name, Email and Phone are required');
      return;
    }

    DataManager.addPatient(formData);
    loadPatients();
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'O+',
      address: '',
      medicalHistory: 'None',
      allergies: 'None',
    });
    setShowAddForm(false);
    alert('Patient added successfully!');
  };

  const filteredPatients = patients.filter((p) =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ────────────────────── STYLES ──────────────────────
  const styles = {
    container: { padding: 32, backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
    headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
    header: { fontSize: 28, fontWeight: 700, color: '#1a1f2e', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#6b7280' },
    addButton: { backgroundColor: '#10b981', color: 'white', padding: '12px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 },
    searchBox: { width: '100%', maxWidth: 400, padding: '12px 16px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, marginBottom: 24 },
    patientGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
    patientCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s ease' },
    patientHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 },
    patientName: { fontSize: 18, fontWeight: 600, color: '#1a1f2e', marginBottom: 4 },
    patientId: { fontSize: 12, color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: 4 },
    patientInfo: { fontSize: 14, color: '#6b7280', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 },
    statusBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, backgroundColor: '#d1fae5', color: '#065f46' },
    viewButton: { width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 12 },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
    modalCard: { backgroundColor: '#fff', borderRadius: 16, maxWidth: 700, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
    modalHeader: { padding: 24, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { fontSize: 24, fontWeight: 700, color: '#1a1f2e' },
    closeButton: { backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
    modalBody: { padding: 24 },
    formGroup: { marginBottom: 16 },
    label: { display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 },
    input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box', minHeight: 80, fontFamily: 'inherit' },
    select: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    submitButton: { width: '100%', backgroundColor: '#10b981', color: 'white', padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 8 },
    profileSection: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #e5e7eb' },
    profileRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 },
    profileField: { marginBottom: 12 },
    fieldLabel: { fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 },
    fieldValue: { fontSize: 15, color: '#1a1f2e' },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.header}>View all Patients</h1>
          <p style={styles.subtitle}>Total Patients: {patients.length}</p>
        </div>
        <button style={styles.addButton} onClick={() => setShowAddForm(true)}>
          Add New Patient
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, ID, or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBox}
      />

      {/* Patient Grid */}
      <div style={styles.patientGrid}>
        {filteredPatients.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6b7280', fontSize: 18 }}>
            {patients.length === 0 ? 'No patients yet. Click "Add New Patient" to get started!' : 'No patients match your search.'}
          </p>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              style={styles.patientCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.patientHeader}>
                <div>
                  <div style={styles.patientName}>{patient.name || 'Unnamed'}</div>
                  <span style={styles.patientId}>{patient.id}</span>
                </div>
                <span style={styles.statusBadge}>{patient.status || 'Active'}</span>
              </div>
              <div style={styles.patientInfo}>Email: {patient.email}</div>
              <div style={styles.patientInfo}>Phone: {patient.phone}</div>
              <div style={styles.patientInfo}>Age: {patient.age || '?'} • {patient.gender || '?'}</div>
              <div style={styles.patientInfo}>Blood Group: {patient.bloodGroup}</div>

              <button style={styles.viewButton} onClick={() => { setSelectedPatient(patient); setShowProfile(true); }}>
                View Full Profile
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Patient Modal - COMPLETE FORM */}
      {showAddForm && (
        <div style={styles.modal} onClick={() => setShowAddForm(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Patient</h2>
              <button style={styles.closeButton} onClick={() => setShowAddForm(false)}>Close</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={styles.input} placeholder="John Doe" />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.input} placeholder="john@example.com" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={styles.input} placeholder="+234 123 456 7890" />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} style={styles.input} placeholder="30" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} style={styles.select}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} style={styles.select}>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Address</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} style={styles.textarea} placeholder="123 Main Street, Lagos, Nigeria" />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Medical History</label>
                <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} style={styles.textarea} placeholder="Any previous medical conditions, surgeries, etc." />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Allergies</label>
                <textarea name="allergies" value={formData.allergies} onChange={handleInputChange} style={styles.textarea} placeholder="List any known allergies" />
              </div>

              <button onClick={handleAddPatient} style={styles.submitButton}>Add Patient</button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Profile Modal - COMPLETE PROFILE VIEW */}
      {showProfile && selectedPatient && (
        <div style={styles.modal} onClick={() => setShowProfile(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Patient Profile - {selectedPatient.name}</h2>
              <button style={styles.closeButton} onClick={() => setShowProfile(false)}>Close</button>
            </div>
            <div style={styles.modalBody}>
              {/* Personal Information */}
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Personal Information</h3>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Patient ID</div>
                    <div style={styles.fieldValue}>{selectedPatient.id}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Status</div>
                    <div style={styles.fieldValue}>
                      <span style={styles.statusBadge}>{selectedPatient.status || 'Active'}</span>
                    </div>
                  </div>
                </div>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Full Name</div>
                    <div style={styles.fieldValue}>{selectedPatient.name}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Email</div>
                    <div style={styles.fieldValue}>{selectedPatient.email}</div>
                  </div>
                </div>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Phone</div>
                    <div style={styles.fieldValue}>{selectedPatient.phone}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Registered Date</div>
                    <div style={styles.fieldValue}>{selectedPatient.registeredDate || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Demographics</h3>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Age</div>
                    <div style={styles.fieldValue}>{selectedPatient.age || 'N/A'}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Gender</div>
                    <div style={styles.fieldValue}>{selectedPatient.gender || 'N/A'}</div>
                  </div>
                </div>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Blood Group</div>
                    <div style={styles.fieldValue}>{selectedPatient.bloodGroup || 'N/A'}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Last Visit</div>
                    <div style={styles.fieldValue}>{selectedPatient.lastVisit || 'No visits yet'}</div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Address</h3>
                <div style={styles.profileField}>
                  <div style={styles.fieldValue}>{selectedPatient.address || 'No address provided'}</div>
                </div>
              </div>

              {/* Medical Information */}
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Medical Information</h3>
                <div style={styles.profileField}>
                  <div style={styles.fieldLabel}>Medical History</div>
                  <div style={styles.fieldValue}>{selectedPatient.medicalHistory || 'None'}</div>
                </div>
                <div style={styles.profileField}>
                  <div style={styles.fieldLabel}>Allergies</div>
                  <div style={styles.fieldValue}>{selectedPatient.allergies || 'None'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react'

// CENTRAL DATA MANAGER – uses your main app key
export const StaffDataManager = {
  getStaff: () => {
    try {
      const data = JSON.parse(localStorage.getItem('users') || '{}')
      return data.staff || []
    } catch {
      return []
    }
  },

  saveStaff: (staff) => {
    try {
      const data = JSON.parse(localStorage.getItem('users') || '{}')
      data.staff = staff
      localStorage.setItem('users', JSON.stringify(data))

      // Notify Admin Dashboard instantly
      window.dispatchEvent(new Event('staff-updated'))
      window.dispatchEvent(new Event('storage'))
    } catch (e) {
      console.error('Error saving staff:', e)
    }
  },

  addStaff: (staffData) => {
    const staff = StaffDataManager.getStaff()
    const newStaff = {
      id: 'STF' + Date.now().toString().slice(-6),
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      ...staffData
    }
    staff.push(newStaff)
    StaffDataManager.saveStaff(staff)
    return newStaff
  }
}

export default function StaffManagement() {
  const [staff, setStaff] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCustomRole, setShowCustomRole] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const [formData, setFormData] = useState({
    name: '',
    role: 'Doctor',
    customRole: '',
    phone: '',
    email: '',
    department: 'Emergency',
    qualifications: '',
    managerName: '',
    managerEmail: ''
  })

  const predefinedRoles = ['Doctor', 'Nurse', 'Receptionist', 'Accountant', 'Cleaner', 'Pharmacist', 'Lab Technician']
  const departments = [
    'Emergency',
    'Surgery',
    'Pediatrics',
    'Cardiology',
    'Radiology',
    'Laboratory',
    'Pharmacy',
    'Administration',
    'General Medicine',
    'Orthopedics',
    'Neurology',
    'Obstetrics & Gynecology'
  ]

  // Load staff + real-time sync
  useEffect(() => {
    const load = () => setStaff(StaffDataManager.getStaff())

    load()

    window.addEventListener('staff-updated', load)
    window.addEventListener('storage', load)

    return () => {
      window.removeEventListener('staff-updated', load)
      window.removeEventListener('storage', load)
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddStaff = () => {
    if (!formData.name.trim()) return alert('Please enter staff name')
    if (!formData.email.trim()) return alert('Please enter staff email')

    const finalRole = showCustomRole ? formData.customRole.trim() : formData.role
    if (!finalRole) return alert('Please select or enter a role')

    const newStaff = StaffDataManager.addStaff({
      name: formData.name.trim(),
      role: finalRole,
      phone: formData.phone,
      email: formData.email,
      department: formData.department,
      qualifications: formData.qualifications,
      managerName: formData.managerName,
      managerEmail: formData.managerEmail
    })

    setStaff(prev => [...prev, newStaff])

    setFormData({
      name: '',
      role: 'Doctor',
      customRole: '',
      phone: '',
      email: '',
      department: 'Emergency',
      qualifications: '',
      managerName: '',
      managerEmail: ''
    })
    setShowCustomRole(false)
    setShowAddForm(false)
    alert(`Staff added successfully!\nID: ${newStaff.id}`)
  }

  const viewStaffProfile = (member) => {
    setSelectedStaff(member)
    setShowProfile(true)
  }

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const styles = {
    container: { padding: 32, backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
    headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
    header: { fontSize: 28, fontWeight: 700, color: '#1a1f2e', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#6b7280' },
    headerControls: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
    viewToggle: { display: 'flex', gap: 4, backgroundColor: '#fff', borderRadius: 8, padding: 4, border: '1px solid #e5e7eb' },
    viewButton: { padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' },
    viewButtonActive: { backgroundColor: '#3b82f6', color: 'white' },
    viewButtonInactive: { backgroundColor: 'transparent', color: '#6b7280' },
    addButton: { backgroundColor: '#10b981', color: 'white', padding: '12px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 },
    searchBox: { width: '100%', maxWidth: 400, padding: '12px 16px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, marginBottom: 24 },
    staffGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
    staffCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s ease' },
    staffHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 },
    staffName: { fontSize: 18, fontWeight: 600, color: '#1a1f2e', marginBottom: 4 },
    staffId: { fontSize: 12, color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: 4 },
    roleBadge: { padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
    staffInfo: { fontSize: 14, color: '#6b7280', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 },
    profileButton: { width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 12 },
    
    // List view styles
    listContainer: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    listHeader: { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr', gap: 16, padding: '16px 20px', backgroundColor: '#f3f4f6', fontWeight: 600, fontSize: 14, color: '#374151', borderBottom: '2px solid #e5e7eb' },
    listRow: { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr', gap: 16, padding: '16px 20px', borderBottom: '1px solid #e5e7eb', alignItems: 'center', cursor: 'pointer', transition: 'background-color 0.2s' },
    listCell: { fontSize: 14, color: '#1a1f2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    listActions: { display: 'flex', gap: 8 },
    actionButton: { padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
    
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
    modalCard: { backgroundColor: '#fff', borderRadius: 16, maxWidth: 700, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
    modalHeader: { padding: 24, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { fontSize: 24, fontWeight: 700, color: '#1a1f2e' },
    closeButton: { backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
    modalBody: { padding: 24 },
    formGroup: { marginBottom: 16 },
    label: { display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 },
    input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' },
    select: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    submitButton: { width: '100%', backgroundColor: '#10b981', color: 'white', padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 8 },
    profileSection: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #e5e7eb' },
    profileRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 },
    profileField: { marginBottom: 12 },
    fieldLabel: { fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 },
    fieldValue: { fontSize: 15, color: '#1a1f2e' },
    customRoleBtn: { backgroundColor: '#6366f1', color: 'white', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, marginTop: 8 }
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.header}>View All Staff</h1>
          <p style={styles.subtitle}>Total Staff Members: {staff.length}</p>
        </div>
        <div style={styles.headerControls}>
          {/* View Toggle */}
          <div style={styles.viewToggle}>
            <button
              style={{
                ...styles.viewButton,
                ...(viewMode === 'grid' ? styles.viewButtonActive : styles.viewButtonInactive)
              }}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              style={{
                ...styles.viewButton,
                ...(viewMode === 'list' ? styles.viewButtonActive : styles.viewButtonInactive)
              }}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
          <button style={styles.addButton} onClick={() => setShowAddForm(true)}>
            Add New Staff
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search staff by name, ID, role, or department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBox}
      />

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={styles.staffGrid}>
          {filteredStaff.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6b7280', fontSize: 18 }}>
              {staff.length === 0 ? 'No staff yet. Click "Add New Staff" to get started!' : 'No staff match your search.'}
            </p>
          ) : (
            filteredStaff.map(member => (
              <div key={member.id} style={styles.staffCard}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={styles.staffHeader}>
                  <div>
                    <div style={styles.staffName}>{member.name}</div>
                    <span style={styles.staffId}>{member.id}</span>
                  </div>
                  <span style={{
                    ...styles.roleBadge,
                    backgroundColor: member.role === 'Doctor' ? '#dbeafe' : member.role === 'Nurse' ? '#d1fae5' : '#fef3c7',
                    color: member.role === 'Doctor' ? '#1e40af' : member.role === 'Nurse' ? '#065f46' : '#92400e'
                  }}>
                    {member.role}
                  </span>
                </div>
                <div style={styles.staffInfo}>Email: {member.email || 'Not provided'}</div>
                <div style={styles.staffInfo}>Phone: {member.phone || 'Not provided'}</div>
                <div style={styles.staffInfo}>Department: {member.department || 'General'}</div>
                <div style={styles.staffInfo}>Joined: {member.joinedDate}</div>
                <button style={styles.profileButton} onClick={() => viewStaffProfile(member)}>View Profile</button>
              </div>
            ))
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div style={styles.listContainer}>
          <div style={styles.listHeader}>
            <div>Name</div>
            <div>Role</div>
            <div>Email</div>
            <div>Department</div>
            <div>Phone</div>
            <div>Actions</div>
          </div>
          {filteredStaff.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#6b7280', fontSize: 16 }}>
              {staff.length === 0 ? 'No staff yet. Click "Add New Staff" to get started!' : 'No staff match your search.'}
            </div>
          ) : (
            filteredStaff.map(member => (
              <div
                key={member.id}
                style={styles.listRow}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={styles.listCell}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{member.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{member.id}</div>
                </div>
                <div style={styles.listCell}>
                  <span style={{
                    ...styles.roleBadge,
                    backgroundColor: member.role === 'Doctor' ? '#dbeafe' : member.role === 'Nurse' ? '#d1fae5' : '#fef3c7',
                    color: member.role === 'Doctor' ? '#1e40af' : member.role === 'Nurse' ? '#065f46' : '#92400e'
                  }}>
                    {member.role}
                  </span>
                </div>
                <div style={styles.listCell}>{member.email || 'N/A'}</div>
                <div style={styles.listCell}>{member.department || 'General'}</div>
                <div style={styles.listCell}>{member.phone || 'N/A'}</div>
                <div style={styles.listActions}>
                  <button
                    style={{ ...styles.actionButton, backgroundColor: '#3b82f6', color: 'white' }}
                    onClick={() => viewStaffProfile(member)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddForm && (
        <div style={styles.modal} onClick={() => setShowAddForm(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Staff Member</h2>
              <button style={styles.closeButton} onClick={() => setShowAddForm(false)}>Close</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={styles.input} placeholder="e.g. Dr. Ada Obi" />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.input} placeholder="staff@clinic.com" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={styles.input} placeholder="+234 123 456 7890" />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Role *</label>
                {!showCustomRole ? (
                  <>
                    <select name="role" value={formData.role} onChange={handleInputChange} style={styles.select}>
                      {predefinedRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button type="button" style={styles.customRoleBtn} onClick={() => setShowCustomRole(true)}>+ Add Custom Role</button>
                  </>
                ) : (
                  <>
                    <input type="text" name="customRole" value={formData.customRole} onChange={handleInputChange} style={styles.input} placeholder="e.g. Radiologist" autoFocus />
                    <button type="button" style={{ ...styles.customRoleBtn, backgroundColor: '#6b7280' }} onClick={() => { setShowCustomRole(false); setFormData(prev => ({ ...prev, customRole: '' })) }}>Cancel</button>
                  </>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                <select name="department" value={formData.department} onChange={handleInputChange} style={styles.select}>
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Qualifications</label>
                <input type="text" name="qualifications" value={formData.qualifications} onChange={handleInputChange} style={styles.input} placeholder="e.g. MBBS, MPH" />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Manager's Full Name</label>
                  <input type="text" name="managerName" value={formData.managerName} onChange={handleInputChange} style={styles.input} placeholder="e.g. Dr. John Smith" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Manager's Email</label>
                  <input type="email" name="managerEmail" value={formData.managerEmail} onChange={handleInputChange} style={styles.input} placeholder="manager@clinic.com" />
                </div>
              </div>

              <button onClick={handleAddStaff} style={styles.submitButton}>Add Staff Member</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && selectedStaff && (
        <div style={styles.modal} onClick={() => setShowProfile(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Staff Profile</h2>
              <button style={styles.closeButton} onClick={() => setShowProfile(false)}>Close</button>
            </div>
            <div style={styles.modalBody}>
              {/* Personal Information */}
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Personal Information</h3>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Full Name</div>
                    <div style={styles.fieldValue}>{selectedStaff.name}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Staff ID</div>
                    <div style={styles.fieldValue}>{selectedStaff.id}</div>
                  </div>
                </div>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Email</div>
                    <div style={styles.fieldValue}>{selectedStaff.email || 'Not provided'}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Phone</div>
                    <div style={styles.fieldValue}>{selectedStaff.phone || 'Not provided'}</div>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Work Information</h3>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Role</div>
                    <div style={styles.fieldValue}>
                      <span style={{
                        ...styles.roleBadge,
                        backgroundColor: selectedStaff.role === 'Doctor' ? '#dbeafe' : selectedStaff.role === 'Nurse' ? '#d1fae5' : '#fef3c7',
                        color: selectedStaff.role === 'Doctor' ? '#1e40af' : selectedStaff.role === 'Nurse' ? '#065f46' : '#92400e'
                      }}>
                        {selectedStaff.role}
                      </span>
                    </div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Department</div>
                    <div style={styles.fieldValue}>{selectedStaff.department || 'General'}</div>
                  </div>
                </div>
                <div style={styles.profileRow}>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Status</div>
                    <div style={styles.fieldValue}>{selectedStaff.status}</div>
                  </div>
                  <div style={styles.profileField}>
                    <div style={styles.fieldLabel}>Joined Date</div>
                    <div style={styles.fieldValue}>{selectedStaff.joinedDate}</div>
                  </div>
                </div>
                <div style={styles.profileField}>
                  <div style={styles.fieldLabel}>Qualifications</div>
                  <div style={styles.fieldValue}>{selectedStaff.qualifications || 'None provided'}</div>
                </div>
              </div>

              {/* Manager Information */}
              {(selectedStaff.managerName || selectedStaff.managerEmail) && (
                <div style={styles.profileSection}>
                  <h3 style={styles.sectionTitle}>Manager Information</h3>
                  <div style={styles.profileRow}>
                    <div style={styles.profileField}>
                      <div style={styles.fieldLabel}>Manager's Name</div>
                      <div style={styles.fieldValue}>{selectedStaff.managerName || 'Not provided'}</div>
                    </div>
                    <div style={styles.profileField}>
                      <div style={styles.fieldLabel}>Manager's Email</div>
                      <div style={styles.fieldValue}>{selectedStaff.managerEmail || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
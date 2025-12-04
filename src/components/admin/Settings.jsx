import React, { useState, useEffect } from 'react'

// === Centralized Data Manager for Staff & Roles ===
export const StaffDataManager = {
  getStaff: () => {
    try {
      return JSON.parse(sessionStorage.getItem('clinic_staff') || '[]')
    } catch {
      return []
    }
  },

  saveStaff: (staff) => {
    try {
      sessionStorage.setItem('clinic_staff', JSON.stringify(staff))
      window.dispatchEvent(new Event('staff-updated'))
    } catch (e) {
      console.error('Error saving staff:', e)
    }
  },

  addStaff: (staffData, role) => {
    const staff = StaffDataManager.getStaff()
    const newStaff = {
      id: 'STF' + Date.now().toString().slice(-6),
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      role: role,
      ...staffData
    }
    staff.push(newStaff)
    StaffDataManager.saveStaff(staff)
    return newStaff
  }
}

export const RoleDataManager = {
  getRoles: () => {
    try {
      return JSON.parse(sessionStorage.getItem('clinic_roles') || '{}')
    } catch {
      return {}
    }
  },

  saveRoles: (roles) => {
    try {
      sessionStorage.setItem('clinic_roles', JSON.stringify(roles))
      window.dispatchEvent(new Event('roles-updated'))
    } catch (e) {
      console.error('Error saving roles:', e)
    }
  },

  addRole: (roleName, permissions) => {
    const roles = RoleDataManager.getRoles()
    roles[roleName] = {
      permissions: permissions || [],
      createdAt: new Date().toISOString().split('T')[0]
    }
    RoleDataManager.saveRoles(roles)
    return roles
  },

  updateRole: (roleName, permissions) => {
    const roles = RoleDataManager.getRoles()
    if (roles[roleName]) {
      roles[roleName].permissions = permissions
      RoleDataManager.saveRoles(roles)
    }
    return roles
  }
}

export default function StaffManagement() {
  const [staff, setStaff] = useState([])
  const [roles, setRoles] = useState({})
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingRole, setEditingRole] = useState(null)

  const [staffFormData, setStaffFormData] = useState({
    name: '',
    role: 'Doctor',
    phone: '',
    email: '',
    department: 'General',
    qualifications: ''
  })

  const [roleFormData, setRoleFormData] = useState({
    name: '',
    permissions: {}
  })

  const allPermissions = [
    { id: 'view_patients', label: 'View Patient Profiles', module: 'Patients' },
    { id: 'edit_patients', label: 'Edit Patient Profiles', module: 'Patients' },
    { id: 'view_appointments', label: 'View Appointments', module: 'Appointments' },
    { id: 'create_appointments', label: 'Create Appointments', module: 'Appointments' },
    { id: 'cancel_appointments', label: 'Cancel Appointments', module: 'Appointments' },
    { id: 'view_billings', label: 'View Billings', module: 'Billing' },
    { id: 'edit_billings', label: 'Edit Billings', module: 'Billing' },
    { id: 'process_payments', label: 'Process Payments', module: 'Billing' },
    { id: 'generate_reports', label: 'Generate Reports', module: 'Reports' },
    { id: 'view_communications', label: 'View Communications', module: 'Communications' },
    { id: 'send_messages', label: 'Send Messages', module: 'Communications' },
    { id: 'manage_inventory', label: 'Manage Inventory', module: 'Inventory' },
    { id: 'view_lab_results', label: 'View Lab Results', module: 'Lab' },
    { id: 'create_prescriptions', label: 'Create Prescriptions', module: 'Pharmacy' },
    { id: 'manage_staff', label: 'Manage Staff', module: 'Admin' },
    { id: 'system_settings', label: 'System Settings', module: 'Admin' }
  ]

  const defaultRolePermissions = {
    Doctor: ['view_patients', 'edit_patients', 'view_appointments', 'create_appointments', 'cancel_appointments', 'view_lab_results', 'create_prescriptions', 'generate_reports'],
    Nurse: ['view_patients', 'edit_patients', 'view_appointments', 'create_appointments', 'view_billings'],
    Receptionist: ['view_appointments', 'create_appointments', 'cancel_appointments', 'view_communications', 'send_messages'],
    Accountant: ['view_billings', 'edit_billings', 'process_payments', 'generate_reports'],
    Cleaner: ['view_appointments'],
    Pharmacist: ['view_patients', 'create_prescriptions', 'manage_inventory'],
    LabTechnician: ['view_patients', 'view_lab_results', 'manage_inventory'],
    Admin: allPermissions.map(p => p.id)
  }

  useEffect(() => {
    loadData()

    const handleUpdate = () => loadData()
    window.addEventListener('staff-updated', handleUpdate)
    window.addEventListener('roles-updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('staff-updated', handleUpdate)
      window.removeEventListener('roles-updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const loadData = () => {
    const loadedStaff = StaffDataManager.getStaff()
    const loadedRoles = RoleDataManager.getRoles()

    if (Object.keys(loadedRoles).length === 0) {
      const initialRoles = {}
      Object.entries(defaultRolePermissions).forEach(([name, perms]) => {
        initialRoles[name] = { permissions: perms, createdAt: new Date().toISOString().split('T')[0] }
      })
      RoleDataManager.saveRoles(initialRoles)
      setRoles(initialRoles)
    } else {
      setRoles(loadedRoles)
    }

    if (loadedStaff.length === 0) {
      const sampleStaff = [
        { id: 'STF001', name: 'Dr. Chinedu Okeke', role: 'Doctor', phone: '+234 803 456 7890', email: 'chinedu@hospital.com', department: 'Cardiology', qualifications: 'MBBS, FWACS', joinedDate: '2023-06-15', status: 'Active' },
        { id: 'STF002', name: 'Nurse Joy Adams', role: 'Nurse', phone: '+234 812 345 6789', email: 'joy@hospital.com', department: 'General Ward', qualifications: 'RN, RM', joinedDate: '2024-01-20', status: 'Active' }
      ]
      StaffDataManager.saveStaff(sampleStaff)
      setStaff(sampleStaff)
    } else {
      setStaff(loadedStaff)
    }
  }

  const handleStaffInputChange = (e) => {
    const { name, value } = e.target
    setStaffFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'permissions') {
      setRoleFormData(prev => ({
        ...prev,
        permissions: { ...prev.permissions, [value]: checked }
      }))
    } else {
      setRoleFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddStaff = () => {
    if (!staffFormData.name.trim()) return alert('Name is required')
    if (!roles[staffFormData.role]) return alert('Please select a valid role')

    const newStaff = StaffDataManager.addStaff(staffFormData, staffFormData.role)
    setStaff(prev => [...prev, newStaff])
    setStaffFormData({ name: '', role: 'Doctor', phone: '', email: '', department: 'General', qualifications: '' })
    setShowAddForm(false)
    alert('Staff added successfully!')
  }

  const handleAddOrUpdateRole = () => {
    const name = roleFormData.name.trim()
    if (!name) return alert('Role name required')

    const permissions = Object.keys(roleFormData.permissions).filter(k => roleFormData.permissions[k])
    const updated = editingRole
      ? RoleDataManager.updateRole(editingRole, permissions)
      : RoleDataManager.addRole(name, permissions)

    setRoles(updated)
    setRoleFormData({ name: '', permissions: {} })
    setEditingRole(null)
    setShowRoleForm(false)
    alert(editingRole ? 'Role updated!' : 'Role created!')
  }

  const editRole = (name) => {
    const role = roles[name]
    setRoleFormData({
      name,
      permissions: Object.fromEntries(allPermissions.map(p => [p.id, role.permissions.includes(p.id)]))
    })
    setEditingRole(name)
    setShowRoleForm(true)
  }

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const styles = {
    container: { padding: 32, backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
    headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
    header: { fontSize: 28, fontWeight: 700, color: '#1a1f2e', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#6b7280' },
    addButton: { backgroundColor: '#10b981', color: 'white', padding: '12px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 },
    searchBox: { width: '100%', maxWidth: 400, padding: '12px 16px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, marginBottom: 24 },
    staffGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
    staffCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s ease' },
    staffHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 },
    staffName: { fontSize: 18, fontWeight: 600, color: '#1a1f2e', marginBottom: 4 },
    staffId: { fontSize: 12, color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: 4 },
    roleBadge: { padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
    staffInfo: { fontSize: 14, color: '#6b7280', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 },
    viewButton: { width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 12 },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
    modalCard: { backgroundColor: '#fff', borderRadius: 16, maxWidth: 800, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
    modalHeader: { padding: 24, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { fontSize: 24, fontWeight: 700, color: '#1a1f2e' },
    closeButton: { backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
    modalBody: { padding: 24 },
    formGroup: { marginBottom: 16 },
    label: { display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 },
    input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' },
    select: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, backgroundColor: '#fff' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    checkboxGroup: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, marginTop: 8 },
    submitButton: { width: '100%', backgroundColor: '#10b981', color: 'white', padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 8 },
    permissionsList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginTop: 12 },
    permissionItem: { padding: '8px', backgroundColor: '#f3f4f6', borderRadius: 6, fontSize: 13 }
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.header}>Staff & Access Management</h1>
          <p style={styles.subtitle}>Staff: {staff.length} | Roles: {Object.keys(roles).length}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={styles.addButton} onClick={() => setShowAddForm(true)}>Add Staff</button>
          <button style={{ ...styles.addButton, backgroundColor: '#6366f1' }} onClick={() => setShowRoleForm(true)}>Manage Roles</button>
        </div>
      </div>

      <input type="text" placeholder="Search staff..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={styles.searchBox} />

      <div style={styles.staffGrid}>
        {filteredStaff.map(member => (
          <div key={member.id} style={styles.staffCard}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={styles.staffHeader}>
              <div>
                <div style={styles.staffName}>{member.name}</div>
                <span style={styles.staffId}>{member.id}</span>
              </div>
              <span style={{ ...styles.roleBadge, backgroundColor: member.role === 'Doctor' ? '#dbeafe' : member.role === 'Nurse' ? '#d1fae5' : '#fef3c7', color: member.role === 'Doctor' ? '#1e40af' : member.role === 'Nurse' ? '#065f46' : '#92400e' }}>
                {member.role}
              </span>
            </div>
            <div style={styles.staffInfo}>Phone: {member.phone || '—'}</div>
            <div style={styles.staffInfo}>Email: {member.email || '—'}</div>
            <button style={styles.viewButton} onClick={() => { setSelectedStaff(member); setShowProfile(true) }}>
              View Profile & Permissions
            </button>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddForm && (
        <div style={styles.modal} onClick={() => setShowAddForm(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Staff</h2>
              <button style={styles.closeButton} onClick={() => setShowAddForm(false)}>Close</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input name="name" value={staffFormData.name} onChange={handleStaffInputChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Assign Role *</label>
                <select name="role" value={staffFormData.role} onChange={handleStaffInputChange} style={styles.select}>
                  {Object.keys(roles).map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div style={styles.formRow}>
                <input name="phone" placeholder="Phone" value={staffFormData.phone} onChange={handleStaffInputChange} style={styles.input} />
                <input name="email" placeholder="Email" value={staffFormData.email} onChange={handleStaffInputChange} style={styles.input} />
              </div>
              <div style={styles.formRow}>
                <input name="department" placeholder="Department" value={staffFormData.department} onChange={handleStaffInputChange} style={styles.input} />
                <input name="qualifications" placeholder="Qualifications" value={staffFormData.qualifications} onChange={handleStaffInputChange} style={styles.input} />
              </div>
              <button onClick={handleAddStaff} style={styles.submitButton}>Add Staff</button>
            </div>
          </div>
        </div>
      )}

      {/* Role Management Modal */}
      {showRoleForm && (
        <div style={styles.modal} onClick={() => { setShowRoleForm(false); setEditingRole(null); setRoleFormData({ name: '', permissions: {} }) }}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editingRole ? `Edit Role: ${editingRole}` : 'Create New Role'}</h2>
              <button style={styles.closeButton} onClick={() => { setShowRoleForm(false); setEditingRole(null); setRoleFormData({ name: '', permissions: {} }) }}>Close</button>
            </div>
            <div style={styles.modalBody}>
              <input name="name" placeholder="Role Name" value={roleFormData.name} onChange={handleRoleInputChange} style={styles.input} disabled={!!editingRole} />
              <div style={styles.checkboxGroup}>
                {allPermissions.map(p => (
                  <label key={p.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" name="permissions" value={p.id} checked={roleFormData.permissions[p.id] || false} onChange={handleRoleInputChange} />
                    <span style={{ marginLeft: 8 }}>{p.label}</span>
                  </label>
                ))}
              </div>
              <button onClick={handleAddOrUpdateRole} style={styles.submitButton}>
                {editingRole ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && selectedStaff && (
        <div style={styles.modal} onClick={() => setShowProfile(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{selectedStaff.name}</h2>
              <button style={styles.closeButton} onClick={() => setShowProfile(false)}>Close</button>
            </div>
            <div style={styles.modalBody}>
              <p><strong>Role:</strong> {selectedStaff.role}</p>
              <p><strong>Permissions:</strong></p>
              <div style={styles.permissionsList}>
                {roles[selectedStaff.role]?.permissions.map(id => {
                  const perm = allPermissions.find(p => p.id === id)
                  return <div key={id} style={styles.permissionItem}>{perm?.label || id}</div>
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
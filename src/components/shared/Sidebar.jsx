import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const [role, setRole] = useState('')
  const location = useLocation()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setRole(user.role || '')
  }, [])

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = {
    Admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/admin/users', label: 'Staff Management', icon: '👥' },
      { path: '/admin/roles', label: 'Patient Managemnt', icon: '👥' },
      { path: '/admin/access', label: 'Settings', icon: '🔑' }
    ],
    Staff: [
      { path: '/staff/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/staff/addpatient', label: 'Add Patient', icon: '➕' },
      { path: '/staff/addinvoice', label: 'Add Invoice', icon: '🧾' },
      { path: '/staff/patientmanagement', label: 'Patient Management', icon: '👤' },
      { path: '/staff/billing', label: 'Billing', icon: '💳' },
      { path: '/staff/appointments', label: 'Appointments', icon: '📅' },
      { path: '/staff/profile', label: 'Profile', icon: '⚙️' }
    ],
    Patient: [
      { path: '/patient/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/patient/bookappointment', label: 'Book Appointment', icon: '📅' },
      { path: '/patient/appointments', label: 'My Appointments', icon: '📋' },
      { path: '/patient/profile', label: 'My Profile', icon: '👤' }
    ]
  }

  const currentMenu = menuItems[role] || []

  const styles = {
    sidebar: {
      width: '260px',
      height: '100vh',
      backgroundColor: '#1a1f2e',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0
    },
    header: {
      padding: '24px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      backgroundColor: '#242b3d'
    },
    title: {
      margin: 0,
      fontSize: '20px',
      fontWeight: '600',
      color: '#fff'
    },
    subtitle: {
      margin: '4px 0 0 0',
      fontSize: '12px',
      color: '#8b92a8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    menu: {
      listStyle: 'none',
      padding: '16px 0',
      margin: 0,
      flex: 1,
      overflowY: 'auto'
    },
    menuItem: {
      margin: '4px 12px'
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      color: '#b8bfce',
      textDecoration: 'none',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      fontSize: '14px',
      fontWeight: '500'
    },
    activeLink: {
      backgroundColor: '#3b82f6',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
    },
    icon: {
      marginRight: '12px',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px'
    }
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <h3 style={styles.title}>eConsult</h3>
        <p style={styles.subtitle}>{role} Portal</p>
      </div>
      
      <ul style={styles.menu}>
        {currentMenu.map((item) => (
          <li key={item.path} style={styles.menuItem}>
            <Link
              to={item.path}
              style={{
                ...styles.link,
                ...(isActive(item.path) ? styles.activeLink : {})
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = '#242b3d'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#b8bfce'
                }
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
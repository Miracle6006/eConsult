import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo.png'   

export default function Navbar({ title = 'eConsult - Clinic & Patient Management' }) {
  const [userEmail, setUserEmail] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('patient_profile') || '{}')
    setUserEmail(savedProfile.email || 'User')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('patient_profile')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 28px',
      backgroundColor: '#3498db',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logo: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      backgroundColor: '#fff',
      padding: '4px'
    },
    title: {
      margin: 0,
      fontSize: '20px',
      fontWeight: '600'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    userButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 16px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    userIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      color: '#3498db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600'
    },
    dropdown: {
      position: 'absolute',
      top: '48px',
      right: 0,
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '220px',
      overflow: 'hidden',
      zIndex: 1000
    },
    logoutButton: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: 'transparent',
      border: 'none',
      textAlign: 'left',
      cursor: 'pointer',
      color: '#ef4444',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  }

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : 'U'
  }

  return (
    <nav style={styles.navbar}>
      {/* LEFT SECTION = LOGO + TITLE */}
      <div style={styles.leftSection}>
        <img src={Logo} alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>{title}</h2>
      </div>

      {/* RIGHT SECTION = USER */}
      <div style={styles.rightSection}>
        <button
          style={styles.userButton}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div style={styles.userIcon}>{getInitials(userEmail)}</div>
          <span>{userEmail}</span>
          <span style={{ fontSize: '10px' }}>▼</span>
        </button>

        {showDropdown && (
          <div style={styles.dropdown}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
              <strong>Account</strong>
              <div style={{ fontSize: '12px', color: '#666' }}>{userEmail}</div>
            </div>

            <button style={styles.logoutButton} onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

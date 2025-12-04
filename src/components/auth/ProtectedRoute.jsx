import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ roles, children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  if (!user.email) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'Admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'Staff') return <Navigate to="/staff/dashboard" replace />
    if (user.role === 'Patient') return <Navigate to="/patient/dashboard" replace />
    return <Navigate to="/login" replace />
  }

  return children
}
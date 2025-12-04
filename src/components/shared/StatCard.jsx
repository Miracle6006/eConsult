import React from 'react'

export default function StatCard({ title, value, color = '#3498db' }) {
  return (
    <div style={{
      backgroundColor: color,
      color: '#fff',
      padding: 20,
      borderRadius: 8,
      minWidth: 120,
      textAlign: 'center'
    }}>
      <h4>{title}</h4>
      <p style={{ fontSize: 20, fontWeight: 'bold' }}>{value}</p>
    </div>
  )
}

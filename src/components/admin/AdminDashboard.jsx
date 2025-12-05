import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [patients, setPatients] = useState({})
  const [appointments, setAppointments] = useState([])
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    const loadData = () => {
      // Add fallback values for when localStorage is empty
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const savedPatient = JSON.parse(localStorage.getItem('patient_profiles') || '{}')
      
      console.log('Saved Users:', savedUsers)
      console.log('Saved Patients:', savedPatient)
      
      const raw = JSON.parse(sessionStorage.getItem('econsult_data_v1') || '{}')

      setUsers(savedUsers || [])
      setPatients(savedPatient || {})
      setAppointments(raw.appointments || [])
      setInvoices(raw.invoices || [])
    }

    loadData()

    window.addEventListener('staff-updated', loadData)
    window.addEventListener('storage', loadData)

    return () => {
      window.removeEventListener('staff-updated', loadData)
      window.removeEventListener('storage', loadData)
    }
  }, [])

  // Safe calculations with proper null checks
  const staffCount = Array.isArray(users) ? users.length : (users?.staff?.length || 0)
  const patientCount = patients ? Object.keys(patients).length : 0
  const billingCount = invoices?.length || 0

  const pieData = [
    { name: 'Staff', value: staffCount, color: '#10b981' },
    { name: 'Patients', value: patientCount, color: '#8b5cf6' },
    { name: 'Billings', value: billingCount, color: '#facc15' }
  ]
  
  console.log('Pie Data:', pieData)

  const billingStatusData = [
    { status: 'Paid', count: invoices.filter(i => i.paid).length },
    { status: 'Pending', count: invoices.filter(i => !i.paid).length },
    { status: 'Confirmed', count: invoices.filter(i => i.confirmed).length }
  ]

  const styles = {
    container: { padding: 24, backgroundColor: '#f9fafb', minHeight: '100vh' },
    header: { marginBottom: 32 },
    title: { fontSize: 28, fontWeight: 700, color: '#1a1f2e', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#6b7280', margin: 0 },
    chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 },
    chartCard: { backgroundColor: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
    chartTitle: { fontSize: 18, fontWeight: 600, color: '#1a1f2e', marginBottom: 20 }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <p style={styles.subtitle}>Overview of staff, patients, and billings</p>
      </div>

      <div style={styles.chartsGrid}>
        {/* Pie Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Total Users & Billings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                isAnimationActive
                animationDuration={1000}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Billings Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={billingStatusData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="status" stroke="#1f05b1ff" style={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#145beaff" style={{ fontSize: 12 }} />
              <Tooltip wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" fill="#3bf63bff" radius={[4,4,0,0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
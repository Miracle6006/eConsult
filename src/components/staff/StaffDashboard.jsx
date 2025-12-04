import React, { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

export default function StaffDashboard() {
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}')
    setPatients(raw.patients || [])
    setAppointments(raw.appointments || [])
    setInvoices(raw.invoices || [])
  }, [])

  const togglePaid = (id) => {
    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}')
    const updatedInvoices = (raw.invoices || []).map(inv =>
      inv.id === id ? { ...inv, paid: !inv.paid } : inv
    )
    raw.invoices = updatedInvoices
    localStorage.setItem('econsult_data_v1', JSON.stringify(raw))
    setInvoices(updatedInvoices)
  }

  const appointmentTypesData = Object.entries({
    'Clinic Visit': appointments.filter(a => a.type === 'Clinic Visit').length,
    'Home Visit': appointments.filter(a => a.type === 'Home Visit').length,
    'Virtual Meet': appointments.filter(a => a.type === 'Virtual Meet').length,
    'Ambulance Request': appointments.filter(a => a.type === 'Ambulance Request').length
  }).map(([type, count]) => ({ type, count }))

  const appointmentStatusData = Object.entries({
    'Completed': appointments.filter(a => a.status === 'Completed').length,
    'Cancelled': appointments.filter(a => a.status === 'Cancelled').length,
    'Scheduled': appointments.filter(a => a.status === 'Scheduled').length
  }).map(([name, value]) => ({ name, value }))

  const COLORS = ['#10b981', '#ef4444', '#c4c118ff']

  const styles = {
    container: { padding: 24, backgroundColor: '#f9fafb', minHeight: '100vh' },
    header: { marginBottom: 32 },
    title: { fontSize: 28, fontWeight: 700, color: '#1a1f2e', margin: '0 0 8px 0' },
    subtitle: { fontSize: 14, color: '#6b7280', margin: 0 },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 },
    statCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
    statLabel: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
    statValue: { fontSize: 32, fontWeight: 700, color: '#1a1f2e' },
    chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 },
    chartCard: { backgroundColor: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
    chartTitle: { fontSize: 18, fontWeight: 600, color: '#1a1f2e', marginBottom: 20 },
    invoiceList: { backgroundColor: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: 12, borderBottom: '2px solid #e5e7eb', fontSize: 14, fontWeight: 600, color: '#374151' },
    td: { padding: 12, borderBottom: '1px solid #f3f4f6', fontSize: 14, color: '#6b7280' },
    toggleContainer: { position: 'relative', display: 'inline-block', width: 40, height: 20 },
    toggleInput: { opacity: 0, width: 0, height: 0 },
    toggleSlider: (paid) => ({
      position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: paid ? '#3b82f6' : '#ccc', borderRadius: 20, transition: '.4s'
    }),
    toggleCircle: (paid) => ({
      position: 'absolute', height: 16, width: 16, left: paid ? 22 : 2, bottom: 2,
      backgroundColor: '#fff', borderRadius: '50%', transition: '.4s'
    })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Details Log</h2>
        <p style={styles.subtitle}>Overview of patients, appointments, and invoices</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Patients</div>
          <div style={styles.statValue}>{patients.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Appointments</div>
          <div style={styles.statValue}>{appointments.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Invoices</div>
          <div style={styles.statValue}>{invoices.length}</div>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Appointments by Type</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={appointmentTypesData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="type" stroke="#1f05b1ff" style={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="#145beaff" style={{ fontSize: 12 }} />
              <Tooltip wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" fill="#3bf63bff" radius={[4,4,0,0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Appointment Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={appointmentStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                isAnimationActive={true}
                animationDuration={1000}
              >
                {appointmentStatusData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Invoice Table */}
      <div style={styles.invoiceList}>
        <h3 style={styles.chartTitle}>Invoices</h3>
        {invoices.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Patient Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Paid</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={styles.td}>{inv.patientName || 'N/A'}</td>
                  <td style={styles.td}>{inv.email || 'N/A'}</td>
                  <td style={styles.td}>{inv.contact || 'N/A'}</td>
                  <td style={styles.td}>{inv.date || 'N/A'}</td>
                  <td style={styles.td}>₦{inv.amount || 0}</td>
                  <td style={styles.td}>
                    <label style={styles.toggleContainer}>
                      <input
                        type="checkbox"
                        checked={inv.paid || false}
                        onChange={() => togglePaid(inv.id)}
                        style={styles.toggleInput}
                      />
                      <span style={styles.toggleSlider(inv.paid)} />
                      <span style={styles.toggleCircle(inv.paid)} />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color:'#6b7280', textAlign:'center', padding:'20px'}}>No invoices available</p>
        )}
      </div>
    </div>
  )
}

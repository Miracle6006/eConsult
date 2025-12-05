import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard() {
  // Always start with correct types
  const [users, setUsers] = useState([]);           // staff/users → array
  const [patients, setPatients] = useState({});      // patient_profiles → object {id: {...}}
  const [appointments, setAppointments] = useState([]); // from econsult_data_v1
  const [invoices, setInvoices] = useState([]);         // from econsult_data_v1

  useEffect(() => {
    const loadData = () => {
      try {
        // ── 1. USERS / STAFF ───────────────────────────────
        const rawUsers = localStorage.getItem('users');
        const savedUsers = rawUsers ? JSON.parse(rawUsers) : [];
        setUsers(Array.isArray(savedUsers) ? savedUsers : []);

        // ── 2. PATIENTS ─────────────────────────────────────
        const rawPatients = localStorage.getItem('patient_profiles');
        let savedPatients = {};
        if (rawPatients) {
          try {
            const parsed = JSON.parse(rawPatients);
            savedPatients = (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
          } catch (e) {
            console.warn('Corrupted patient_profiles → resetting to {}');
            localStorage.setItem('patient_profiles', '{}'); // auto-heal
            savedPatients = {};
          }
        }
        setPatients(savedPatients);

        // ── 3. APPOINTMENTS & INVOICES (now from localStorage) ─────
        const rawAppData = localStorage.getItem('econsult_data_v1');
        let appData = { appointments: [], invoices: [] };

        if (rawAppData) {
          try {
            const parsed = JSON.parse(rawAppData);
            if (parsed && typeof parsed === 'object') {
              appData = {
                appointments: Array.isArray(parsed.appointments) ? parsed.appointments : [],
                invoices: Array.isArray(parsed.invoices) ? parsed.invoices : []
              };
            }
          } catch (e) {
            console.warn('Corrupted econsult_data_v1 → resetting');
            localStorage.setItem('econsult_data_v1', JSON.stringify({ appointments: [], invoices: [] }));
          }
        } else {
          // First time? Initialize it
          localStorage.setItem('econsult_data_v1', JSON.stringify({ appointments: [], invoices: [] }));
        }

        setAppointments(appData.appointments);
        setInvoices(appData.invoices);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setUsers([]);
        setPatients({});
        setAppointments([]);
        setInvoices([]);
      }
    };

    loadData();

    // Refresh dashboard when any relevant data changes
    const events = ['staff-updated', 'patient-updated', 'appointment-updated', 'invoice-updated', 'storage'];
    events.forEach(ev => window.addEventListener(ev, loadData));

    return () => {
      events.forEach(ev => window.removeEventListener(ev, loadData));
    };
  }, []);

  // ── Safe counters (100% crash-proof) ─────────────────────
  const staffCount = Array.isArray(users) ? users.length : 0;

  const patientCount = patients && typeof patients === 'object' && !Array.isArray(patients)
    ? Object.keys(patients).length
    : 0;

  const billingCount = Array.isArray(invoices) ? invoices.length : 0;

  const pieData = [
    { name: 'Staff', value: staffCount, color: '#10b981' },
    { name: 'Patients', value: patientCount, color: '#8b5cf6' },
    { name: 'Billings', value: billingCount, color: '#facc15' }
  ];

  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const billingStatusData = [
    { status: 'Paid',      count: safeInvoices.filter(i => i.paid).length },
    { status: 'Pending',   count: safeInvoices.filter(i => !i.paid).length },
    { status: 'Confirmed', count: safeInvoices.filter(i => i.confirmed).length }
  ];

  console.log('Pie Data:', pieData);

  // ── Styles ───────────────────────────────────────────────
  const styles = {
    container: { padding: 24, backgroundColor: '#f9fafb', minHeight: '100vh' },
    header: { marginBottom: 32 },
    title: { fontSize: 28, fontWeight: 700, color: '#1a1f2e', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#6b7280', margin: 0 },
    chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 },
    chartCard: { backgroundColor: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
    chartTitle: { fontSize: 18, fontWeight: 600, color: '#1a1f2e', marginBottom: 20 }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <p style={styles.subtitle}>Overview of staff, patients, and billings</p>
      </div>

      <div style={styles.chartsGrid}>
        {/* Pie Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Total Overview</h3>
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                isAnimationActive
                animationDuration={1000}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => v} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Billing Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={billingStatusData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="status" style={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} style={{ fontSize: 12 }} />
              <Tooltip wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
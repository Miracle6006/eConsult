import React, { useState, useEffect } from 'react';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [profile] = useState({ name: 'Take a Quick glance at you Logs' }); // Change as needed
  const [animate, setAnimate] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Your real data should come from localStorage, context, or backend
    const sampleAppointments = [
      { id: 'APT001', type: 'General Checkup', date: '2024-12-05', status: 'Completed', notes: 'Routine checkup', amount: 5000, paid: true },
      { id: 'APT002', type: 'Dental Consultation', date: '2024-12-10', status: 'Scheduled', notes: 'Tooth pain', amount: 8000, paid: false },
      { id: 'APT003', type: 'Eye Examination', date: '2024-11-28', status: 'Cancelled', notes: 'Patient rescheduled', amount: 6000, paid: false },
      { id: 'APT004', type: 'Blood Test', date: '2024-12-15', status: 'Scheduled', notes: 'Fasting required', amount: 3500, paid: false },
      { id: 'APT005', type: 'Physiotherapy', date: '2024-12-20', status: 'Scheduled', notes: 'Back pain', amount: 12000, paid: false },
    ];

    setAppointments(sampleAppointments);
    setTimeout(() => setAnimate(true), 200);
  }, []);

  const statusCount = {
    Completed: appointments.filter(a => a.status === 'Completed').length,
    Scheduled: appointments.filter(a => a.status === 'Scheduled').length,
    Cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  const totalAppointments = appointments.length;

  const handlePayment = (appointment) => {
    // Update local state
    setAppointments(prev => prev.map(a =>
      a.id === appointment.id ? { ...a, paid: true } : a
    ));

    // Show success toast
    setToast({
      message: `Payment Successful!`,
      details: `₦${appointment.amount.toLocaleString()} paid for ${appointment.type}`,
      type: 'success'
    });

    setTimeout(() => setToast(null), 4000);
  };

  // Donut chart path generator
  const createDonutSlice = (start, end, color) => {
    const outerRadius = 80;
    const innerRadius = 50;
    const cx = 110, cy = 110;

    const startAngle = start * 360 - 90;
    const endAngle = end * 360 - 90;
    const largeArc = end - start > 0.5 ? 1 : 0;

    const x1 = cx + outerRadius * Math.cos(startAngle * Math.PI / 180);
    const y1 = cy + outerRadius * Math.sin(startAngle * Math.PI / 180);
    const x2 = cx + outerRadius * Math.cos(endAngle * Math.PI / 180);
    const y2 = cy + outerRadius * Math.sin(endAngle * Math.PI / 180);

    const x1i = cx + innerRadius * Math.cos(startAngle * Math.PI / 180);
    const y1i = cy + innerRadius * Math.sin(startAngle * Math.PI / 180);
    const x2i = cx + innerRadius * Math.cos(endAngle * Math.PI / 180);
    const y2i = cy + innerRadius * Math.sin(endAngle * Math.PI / 180);

    return `M ${x1} ${y1}
            A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
            L ${x2i} ${y2i}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1i} ${y1i} Z`;
  };

  let cumulative = 0;
  const donutData = [
    { status: 'Completed', count: statusCount.Completed, color: '#10b981' },
    { status: 'Scheduled', count: statusCount.Scheduled, color: '#f59e0b' },
    { status: 'Cancelled', count: statusCount.Cancelled, color: '#ef4444' },
  ].filter(d => d.count > 0);

  const styles = {
    container: { padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' },
    header: { marginBottom: '40px' },
    title: { fontSize: '32px', fontWeight: '700', color: '#1e293b' },
    subtitle: { fontSize: '16px', color: '#64748b', marginTop: '8px' },

    chartCard: { background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', marginBottom: '40px' },
    chartTitle: { fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' },

    donutWrapper: { position: 'relative', width: '220px', height: '220px', margin: '0 auto 24px' },
    donutSvg: { width: '100%', height: '100%' },
    donutCenter: {
      position: 'absolute',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      pointerEvents: 'none'
    },
    donutTotal: { fontSize: '36px', fontWeight: '800', color: '#1e293b' },
    donutLabel: { fontSize: '14px', color: '#64748b' },

    legend: { display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' },
    legendItem: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' },
    legendBox: { width: '16px', height: '16px', borderRadius: '6px' },

    tableCard: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#f1f5f9', padding: '16px', textAlign: 'left', fontWeight: '600', color: '#334155', fontSize: '14px' },
    td: { padding: '16px', borderTop: '1px solid #e2e8f0', color: '#475569' },
    payBtn: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
    payBtnHover: { backgroundColor: '#059669' },
    paidBadge: { backgroundColor: '#d1fae5', color: '#065f46', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },

    toast: {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#065f46',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      fontWeight: '600',
      zIndex: 1000,
      animation: 'slideUp 0.4s ease-out'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome back, {profile.email}!</h1>
        <p style={styles.subtitle}>Manage your appointments and payments</p>
      </div>

      {/* Donut Chart */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Your Appointment Status</h3>
        <div style={styles.donutWrapper}>
          <svg viewBox="0 0 220 220" style={styles.donutSvg}>
            {donutData.map((item, i) => {
              const start = cumulative / totalAppointments;
              cumulative += item.count;
              const end = cumulative / totalAppointments;
              return (
                <path
                  key={i}
                  d={createDonutSlice(start, end, item.color)}
                  fill={item.color}
                  stroke="#fff"
                  strokeWidth="3"
                  style={{
                    transition: 'all 1.2s ease-out',
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'scale(1)' : 'scale(0.8)'
                  }}
                />
              );
            })}
          </svg>

          <div style={styles.donutCenter}>
            <div style={styles.donutTotal}>{totalAppointments}</div>
            <div style={styles.donutLabel}>Total</div>
          </div>
        </div>

        <div style={styles.legend}>
          {donutData.map(item => (
            <div key={item.status} style={styles.legendItem}>
              <div style={{ ...styles.legendBox, backgroundColor: item.color }}></div>
              <span>{item.status} ({item.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div style={styles.tableCard}>
        <div style={{ padding: '24px 24px 0', fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
          Your Appointments & Bills
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Service</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Notes</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Payment</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id}>
                <td style={styles.td}><strong>{app.id}</strong></td>
                <td style={styles.td}>{app.type}</td>
                <td style={styles.td}>{app.date}</td>
                <td style={styles.td}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor:
                      app.status === 'Completed' ? '#d1fae5' :
                      app.status === 'Scheduled' ? '#fef3c7' : '#fee2e2',
                    color:
                      app.status === 'Completed' ? '#065f46' :
                      app.status === 'Scheduled' ? '#92400e' : '#991b1b'
                  }}>
                    {app.status}
                  </span>
                </td>
                <td style={styles.td}>{app.notes || '-'}</td>
                <td style={styles.td}>{app.amount > 0 ? `₦${app.amount.toLocaleString()}` : 'Free'}</td>
                <td style={styles.td}>
                  {app.amount === 0 ? (
                    <span style={{ color: '#6b7280', fontStyle: 'italic' }}>No charge</span>
                  ) : app.paid ? (
                    <span style={styles.paid}>Paid</span>
                  ) : (
                    <button
                      onClick={() => handlePayment(app)}
                      style={styles.payBtn}
                      onMouseOver={e => e.target.style.backgroundColor = '#059669'}
                      onMouseOut={e => e.target.style.backgroundColor = '#10b981'}
                    >
                      Pay ₦{app.amount.toLocaleString()}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Success Toast */}
      {toast && (
        <div style={styles.toast}>
          {toast.message}
          <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>
            {toast.details}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100px); opacity: 0; }
          to { transform: translateX(-50%); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
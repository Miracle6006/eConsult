import React, { useState, useEffect } from 'react';

export default function BillingManagement() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}');
    setInvoices(raw.invoices || []);
  }, []);

  const togglePaid = (id) => {
    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}');
    const updatedInvoices = (raw.invoices || []).map(inv =>
      inv.id === id ? { ...inv, paid: !inv.paid } : inv
    );
    raw.invoices = updatedInvoices;
    localStorage.setItem('econsult_data_v1', JSON.stringify(raw));
    setInvoices(updatedInvoices);
  };

  const total = invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  return (
    <div style={{
      maxWidth: '1400px',      // widened container
      margin: '40px auto',
      padding: 30,
      background: '#fefefe',
      borderRadius: 12,
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ marginBottom: 25, color: '#333' }}>Billing Management</h2>

      <div style={{
        background: '#007bff',
        color: '#fff',
        padding: '18px 25px',
        borderRadius: 10,
        fontSize: 20,
        fontWeight: 600,
        marginBottom: 30,
        display: 'inline-block'
      }}>
        Total Revenue: ₦{total.toLocaleString()}
      </div>

      {invoices.length === 0 ? (
        <p style={{ color: '#555', fontSize: 16 }}>No invoices available.</p>
      ) : (
        <div style={{
          overflowX: 'auto',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            minWidth: '1200px' // table now wider
          }}>
            <thead>
              <tr style={{ background: '#f4f6f8', textAlign: 'left', fontWeight: 600 }}>
                <th style={th}>Invoice ID</th>
                <th style={th}>Patient</th>
                <th style={th}>Email</th>
                <th style={th}>Contact</th>
                <th style={th}>Date</th>
                <th style={th}>Amount</th>
                <th style={th}>Staff</th>
                <th style={th}>Paid</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={inv.id} style={{
                  background: idx % 2 === 0 ? '#fff' : '#f9fafb',
                  transition: '0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#eef5ff'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#f9fafb'}>
                  <td style={td}>{inv.invoiceId}</td>
                  <td style={td}>{inv.patientName}</td>
                  <td style={td}>{inv.email}</td>
                  <td style={td}>{inv.contact}</td>
                  <td style={td}>{inv.date}</td>
                  <td style={td}>₦{Number(inv.amount).toLocaleString()}</td>
                  <td style={td}>{inv.staffEmail}</td>
                  <td style={{ ...td, textAlign: 'center' }}>
                    <label style={{ display: 'inline-block', position: 'relative', width: 46, height: 24 }}>
                      <input
                        type="checkbox"
                        checked={inv.paid || false}
                        onChange={() => togglePaid(inv.id)}
                        style={{
                          opacity: 0,
                          width: 0,
                          height: 0
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0, left: 0,
                        right: 0, bottom: 0,
                        backgroundColor: inv.paid ? '#28a745' : '#ccc',
                        borderRadius: 24,
                        transition: '.4s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: 20,
                          width: 20,
                          left: inv.paid ? 22 : 2,
                          bottom: 2,
                          backgroundColor: '#fff',
                          borderRadius: '50%',
                          transition: '.4s'
                        }}></span>
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = {
  padding: '14px 20px',
  borderBottom: '2px solid #e0e0e0'
};

const td = {
  padding: '14px 20px',
  borderBottom: '1px solid #eee'
};

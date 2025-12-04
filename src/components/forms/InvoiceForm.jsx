import React, { useState, useEffect } from 'react';

export default function InvoiceForm({ onSaved }) {
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // default to today
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [staffEmail, setStaffEmail] = useState('');

  // Get logged-in staff email from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setStaffEmail(user.email || '');
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!patientName || !email || !amount) {
      return alert('Patient Name, Email, and Amount are required');
    }

    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}');
    const invoices = raw.invoices || [];
    const id = 'inv-' + Date.now();
    
    const newInvoice = {
      id,
      patientName,
      email,
      contact,
      date,
      amount: Number(amount),
      notes,
      staffEmail,
      createdAt: new Date().toISOString()
    };

    raw.invoices = [newInvoice, ...invoices];
    localStorage.setItem('econsult_data_v1', JSON.stringify(raw));

    // Reset form
    setPatientName('');
    setEmail('');
    setContact('');
    setDate(new Date().toISOString().split('T')[0]);
    setAmount('');
    setNotes('');

    onSaved && onSaved();
    alert(`Invoice saved: ₦${newInvoice.amount}`);
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 500, margin: '0 auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Create Invoice</h2>
      
      <div style={{ marginBottom: 10 }}>
        <label>Patient Name *</label>
        <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} required />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Email *</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Contact</label>
        <input type="text" value={contact} onChange={e => setContact(e.target.value)} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Amount *</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Staff Email</label>
        <input type="email" value={staffEmail} readOnly style={{ backgroundColor: '#f0f0f0' }} />
      </div>

      <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Save Invoice</button>
    </form>
  );
}

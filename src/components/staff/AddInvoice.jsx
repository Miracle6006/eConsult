import React, { useState, useEffect } from 'react';

export default function InvoiceForm({ onSaved }) {
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [staffEmail, setStaffEmail] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setStaffEmail(user.email || '');
  }, []);

  // Generate clean invoice ID e.g INV-20250206120510-123
  const generateInvoiceId = () => {
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const rand = Math.floor(100 + Math.random() * 900);
    return `INV-${timestamp}-${rand}`;
  };

  const submit = (e) => {
    e.preventDefault();

    if (!patientName || !email || !amount) {
      return alert('Patient Name, Email, and Amount are required');
    }

    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}');
    const invoices = raw.invoices || [];

    const newInvoice = {
      id: "inv-" + Date.now(),            // system ID
      invoiceId: generateInvoiceId(),      // visible invoice number
      patientName,
      email,
      contact,
      date,
      amount: Number(amount),
      notes,
      staffEmail,
      paid: false,                         // default unpaid
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
    alert(`Invoice created successfully!`);
  };

  return (
    <div style={{
      maxWidth: 600,
      margin: '40px auto',
      padding: '30px',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ marginBottom: 20, color: '#333' }}>Create Invoice</h2>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <FormInput label="Patient Name *" value={patientName} setValue={setPatientName} required />
        <FormInput label="Email *" type="email" value={email} setValue={setEmail} required />
        <FormInput label="Contact" value={contact} setValue={setContact} />

        <FormInput label="Date" type="date" value={date} setValue={setDate} />

        <FormInput label="Amount *" type="number" value={amount} setValue={setAmount} required />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: 5, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            style={{ padding: 10, borderRadius: 5, border: '1px solid #ccc', resize: 'vertical' }}
          />
        </div>

        <FormInput label="Staff Email" type="email" value={staffEmail} readOnly />

        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 5,
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 10
          }}
        >
          Create Invoice
        </button>
      </form>
    </div>
  );
}

function FormInput({ label, type = "text", value, setValue, required = false, readOnly = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ marginBottom: 5, fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => setValue && setValue(e.target.value)}
        required={required}
        readOnly={readOnly}
        style={{
          padding: 10,
          borderRadius: 5,
          border: '1px solid #ccc',
          backgroundColor: readOnly ? '#f2f2f2' : '#fff'
        }}
      />
    </div>
  );
}

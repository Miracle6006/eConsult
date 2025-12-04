import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('econsult_data_v1') || '{}');
    setPatients(raw.patients || []);
  }, []);

  const handleEdit = (patient) => {
    // store patient data so AddPatient form can load it
    localStorage.setItem("edit_patient", JSON.stringify(patient));
    navigate("/staff/addpatient"); 
  };

  return (
    <div style={{
      maxWidth: "100%",        // FULL WIDTH
      width: "95%",            // Wide but neat
      margin: "40px auto",
      padding: 30,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      fontFamily: "Arial, sans-serif"
    }}>
      
      <h2 style={{ marginBottom: 25, color: "#0c8ef1ff", fontSize: 26 }}>
        List of Registered Patients
      </h2>

      {patients.length === 0 ? (
        <p style={{ color: "#555" }}>No patients added yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0", textAlign: "left" }}>
              <th style={{ padding: "12px 20px" }}>Name</th>
              <th style={{ padding: "12px 20px" }}>Email</th>
              <th style={{ padding: "12px 20px" }}>Contact</th>
              <th style={{ padding: "12px 20px" }}>Gender</th>
              <th style={{ padding: "12px 20px" }}>DOB</th>
              <th style={{ padding: "12px 20px" }}>Address</th>
              <th style={{ padding: "12px 20px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "12px 20px" }}>{p.patientName}</td>
                <td style={{ padding: "12px 20px" }}>{p.email}</td>
                <td style={{ padding: "12px 20px" }}>{p.contact}</td>
                <td style={{ padding: "12px 20px" }}>{p.gender || "-"}</td>
                <td style={{ padding: "12px 20px" }}>{p.dob || "-"}</td>
                <td style={{ padding: "12px 20px" }}>{p.address || "-"}</td>

                <td style={{ padding: "12px 20px" }}>
                  <button
                    onClick={() => handleEdit(p)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 6,
                      border: "none",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function AddPatient() {
  const [form, setForm] = useState({
    patientName: "",
    email: "",
    contact: "",
    gender: "",
    dob: "",
    address: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Load editing data if available
  useEffect(() => {
    const editData = JSON.parse(localStorage.getItem("edit_patient") || "null");
    if (editData) {
      setForm(editData);
      setEditId(editData.id);
      setIsEditing(true);
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const savePatient = (e) => {
    e.preventDefault();

    const raw = JSON.parse(localStorage.getItem("econsult_data_v1") || "{}");
    const patients = raw.patients || [];

    if (isEditing) {
      // UPDATE PATIENT
      const updatedList = patients.map((p) =>
        p.id === editId ? { ...form, id: editId } : p
      );
      raw.patients = updatedList;

      localStorage.setItem("econsult_data_v1", JSON.stringify(raw));
      localStorage.removeItem("edit_patient");

      alert("Patient updated successfully!");
    } else {
      // CREATE NEW PATIENT
      const newPatient = {
        ...form,
        id: "pat-" + Date.now()
      };

      raw.patients = [newPatient, ...patients];
      localStorage.setItem("econsult_data_v1", JSON.stringify(raw));

      alert("Patient added successfully!");
    }

    // Reset form
    setForm({
      patientName: "",
      email: "",
      contact: "",
      gender: "",
      dob: "",
      address: ""
    });

    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <h2 style={{ marginBottom: 25, color: "#333", fontSize: 26 }}>
        {isEditing ? "Edit Patient" : "Add New Patient"}
      </h2>

      <form onSubmit={savePatient} style={{ display: "grid", gap: 20 }}>

        {/* Patient Name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: 5 }}>Patient Name</label>
          <input
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: 5 }}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Contact */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: 5 }}>Contact</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Gender */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: 5 }}>Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* DOB */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: 5 }}>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Address */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: 5 }}>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows="3"
            style={{
              ...inputStyle,
              resize: "none"
            }}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16
          }}
        >
          {isEditing ? "Save Changes" : "Add Patient"}
        </button>
      </form>
    </div>
  );
}

// Shared input styles
const inputStyle = {
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  outline: "none",
  fontSize: 15
};

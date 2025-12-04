import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./components/auth/Login.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// Layout
import Navbar from "./components/shared/Navbar.jsx";
import Sidebar from "./components/shared/Sidebar.jsx";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AccessManagement from "./components/admin/Settings.jsx";
import RoleManager from "./components/admin/PatientManagement.jsx";
import UserManager from "./components/admin/StaffManagement.jsx";

// Staff
import StaffDashboard from "./components/staff/StaffDashboard.jsx";
import AddPatient from "./components/staff/AddPatient.jsx";
import AddInvoice from "./components/staff/AddInvoice.jsx";
import PatientManagement from "./components/staff/PatientManagement.jsx";
import BillingManagement from "./components/staff/BillingManagement.jsx";
import AppointmentList from "./components/staff/AppointmentList.jsx";
import EditPatient from "./components/staff/EditPatient.jsx";
import StaffProfile from "./components/staff/StaffProfile.jsx";

// Patient
import PatientDashboard from "./components/patient/PatientDashboard.jsx";
import Appointment from "./components/patient/AppointmentHistory.jsx";
import BookAppointment from "./components/patient/BookAppointment.jsx";
import PatientProfile from "./components/patient/PatientProfile.jsx";

// Home page
import Home from "./pages/Home.jsx"; 

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Patient Routes */}
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute roles={["Patient"]}>
              <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Navbar />
                  <Routes>
                    <Route path="dashboard" element={<PatientDashboard />} />
                    <Route path="appointments" element={<Appointment />} />
                    <Route path="bookappointment" element={<BookAppointment />} />
                    <Route path="profile" element={<PatientProfile />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Staff Routes */}
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute roles={["Staff"]}>
              <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Navbar />
                  <Routes>
                    <Route path="dashboard" element={<StaffDashboard />} />
                    <Route path="addpatient" element={<AddPatient />} />
                    <Route path="addinvoice" element={<AddInvoice />} />
                    <Route path="patientmanagement" element={<PatientManagement />} />
                    <Route path="billing" element={<BillingManagement />} />
                    <Route path="appointments" element={<AppointmentList />} />
                    <Route path="editpatient/:id" element={<EditPatient />} />
                    <Route path="profile" element={<StaffProfile />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Navbar />
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserManager />} />
                    <Route path="roles" element={<RoleManager />} />
                    <Route path="access" element={<AccessManagement />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Make sure this path is correct

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patients, setPatients] = useState([]);
  const [role, setRole] = useState('Patient');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  // If already logged in → redirect immediately
  useEffect(() => {
    const user = localStorage.getItem('user');
    const savedPatient = localStorage.getItem('patients_profile');
    setPatients(savedPatient ? JSON.parse(savedPatient) : []);

    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role === 'Patient') navigate('/patient/dashboard', { replace: true });
      else if (parsed.role === 'Staff') navigate('/staff/dashboard', { replace: true });
      else if (parsed.role === 'Admin') navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in both email and password');
      return;
    }

    if (!email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    if (role === 'Patient') {
      const patientExists = patients.some(
        (p) => p.email.toLowerCase() === email.toLowerCase().trim()
      );
        if (!patientExists) {
            alert('No patient found with this email. Please check your email or contact support.');     
            return;
        }}

    setIsLoading(true);

    // Simulate login delay (feels real)
    setTimeout(() => {
      // Save login session
      const userData = {
        email: email.toLowerCase().trim(),
        role,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');

      // Optional: Save patient profile for patient dashboard
      if (role === 'Patient') {
        localStorage.setItem('patient_profile', JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: '+234 800 000 0000',
          age: 32,
          bloodGroup: 'O+'
        }));
      }

      setIsLoading(false);

      // Redirect based on role
      if (role === 'Patient') navigate('/patient/dashboard');
      else if (role === 'Staff') navigate('/staff/dashboard');
      else if (role === 'Admin') navigate('/admin/dashboard');
      else navigate('/');
    }, 800);
  };

  // Optional: Add Logout function globally (call from any page)
  useEffect(() => {
    window.logout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('patient_profile');
      alert('You have been logged out successfully');
      navigate('/', { replace: true });
    };
  }, [navigate]);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <img
            src={logo}
            alt="eConsult Logo"
            style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'contain' }}
          />
          <h1 style={styles.title}>Welcome to eConsult</h1>
          <p style={styles.subtitle}>Clinic & Patient Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Login As</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
              <option value="Patient">Patient</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} style={{ ...styles.loginBtn, opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', marginTop: 30, fontSize: 14, color: '#666' }}>
          <p>Don't have an account? <a href="/" style={styles.link}>Go to Homepage</a></p>
          <p style={{ marginTop: 10, fontSize: 12, color: '#999' }}>
            © 2025 eConsult • Secure & Private
          </p>
        </div>
      </div>
    </div>
  );
}

// Beautiful & Responsive Styles
const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '48px 40px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: 460,
    textAlign: 'center'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
    margin: '16px 0 8px'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '16px',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    textAlign: 'left'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  loginBtn: {
    marginTop: '10px',
    padding: '16px',
    background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600'
  }
};

// Focus effects
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = '#3b82f6';
      input.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '#e2e8f0';
      input.style.boxShadow = 'none';
    });
  });
});
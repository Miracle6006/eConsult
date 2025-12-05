import React from 'react';
import logo from '../assets/logo.png';

export default function HomePage() {
  const handleSignIn = () => {
    window.location.href = '/login';
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR – MUCH BIGGER LOGO & TITLE */}
      <nav style={styles.navbar}>
        <div style={styles.logoSection}>
          <img src={logo} alt="eConsult Logo" style={styles.logoImg} />
          <div style={styles.titleBox}>
            <div style={styles.mainTitle}>
              <span style={{ color: '#1d4ed8' }}>e</span>Consult
            </div>
            <div style={styles.subtitle}>Clinic & Patient Management System</div>
          </div>
        </div>
        <button onClick={handleSignIn} style={styles.signInBtn}>
          Sign In
        </button>
      </nav>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>
            Manage Your Clinic <br /> With Confidence
          </h1>
          <p style={styles.heroSubtitle}>
            All-in-one platform for appointments, patient records, billing, and staff management.
          </p>
          <button onClick={handleSignIn} style={styles.ctaButton}>
            Get Started Now
          </button>
        </div>
      </section>

      {/* STAT CARDS – LIGHT BLUE & CLEAN */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>Hospital</div>
            <h3 style={styles.statNumber}>200+</h3>
            <p style={styles.statLabel}>Clinics Trust Us</p>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>Users</div>
            <h3 style={styles.statNumber}>10K+</h3>
            <p style={styles.statLabel}>Happy Patients</p>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>Clock</div>
            <h3 style={styles.statNumber}>99.9%</h3>
            <p style={styles.statLabel}>Uptime Guaranteed</p>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>Headset</div>
            <h3 style={styles.statNumber}>24/7</h3>
            <p style={styles.statLabel}>Live Support</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={styles.services}>
        <h2 style={styles.sectionTitle}>Powerful Features for Modern Clinics</h2>
        <div style={styles.servicesGrid}>
          {services.map((s, i) => (
            <div key={i} style={styles.serviceCard}>
              <div style={styles.serviceIcon}>{s.icon}</div>
              <h3 style={styles.serviceTitle}>{s.title}</h3>
              <p style={styles.serviceDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section style={styles.mission}>
        <h2 style={styles.sectionTitle}>Our Mission</h2>
        <p style={styles.missionText}>
          To make healthcare management simple, secure, and accessible for clinics of all sizes 
          so you can focus on what truly matters: YOUR PATIENTS.
        </p>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2025 eConsult - Clinic & Patient Management System</p>
        <p style={{ fontSize: '14px', marginTop: '8px', color: '#e2e8f0' }}>
          Made with care for better healthcare
        </p>
      </footer>
    </div>
  );
}

const services = [
  { icon: "Calendar", title: "Smart Scheduling", desc: "Online booking with automated reminders" },
  { icon: "Folder", title: "Digital Records", desc: "Secure, instant access to patient history" },
  { icon: "Payments", title: "Easy Billing", desc: "Invoices, payments & reports in one click" },
  { icon: "Shield", title: "Role-Based Access", desc: "Safe & secure for doctors, nurses & admins" }
];

// SMART & MODERN COLOR SCHEME
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // NAVBAR – MUCH BIGGER
  navbar: {
    padding: '32px 60px',
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logoSection: { display: 'flex', alignItems: 'center', gap: '28px' },
  logoImg: { 
    width: 120, 
    height: 120, 
    borderRadius: '20px', 
    objectFit: 'contain',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
  },
  titleBox: {},
  mainTitle: { 
    fontSize: '52px', 
    fontWeight: '900', 
    color: '#0f172a',
    letterSpacing: '-1px',
    margin: 0
  },
  subtitle: { 
    fontSize: '22px', 
    fontWeight: '700', 
    color: '#1d4ed8', 
    marginTop: '8px',
    letterSpacing: '0.5px'
  },
  signInBtn: {
    backgroundColor: '#1d4ed8',
    color: 'white',
    padding: '16px 40px',
    borderRadius: '16px',
    border: 'none',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(29,78,216,0.4)',
  },

  // HERO
  hero: {
    height: '90vh',
    background: `linear-gradient(rgba(4, 140, 250, 0.45), rgba(4, 119, 250, 0.65)), url('https://images.unsplash.com/photo-1551601678-0c0b5f5bc5d6?q=80&w=2070&auto=format') center/cover no-repeat`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
  },
  heroOverlay: { maxWidth: '1000px', padding: '0 20px' },
  heroTitle: { fontSize: '64px', fontWeight: '900', marginBottom: '24px', lineHeight: '1.1' },
  heroSubtitle: { fontSize: '24px', marginBottom: '48px', opacity: 0.95, fontWeight: '500' },
  ctaButton: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '20px 48px',
    fontSize: '22px',
    fontWeight: '800',
    border: 'none',
    borderRadius: '18px',
    cursor: 'pointer',
    boxShadow: '0 12px 35px rgba(16,185,129,0.5)',
  },

  // STATS – LIGHT BLUE CARDS
  statsSection: { padding: '120px 20px', backgroundColor: '#76c5f9ff' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  statCard: {
    backgroundColor: '#dbeafe',
    padding: '50px 20px',
    borderRadius: '24px',
    textAlign: 'center',
    boxShadow: '0 12px 35px rgba(99,102,241,0.15)',
    border: '1px solid #93c5fd',
    color: '#1e40af',
  },
  statIcon: { fontSize: '52px', marginBottom: '18px' },
  statNumber: { fontSize: '50px', fontWeight: '900', margin: '0', color: '#1d4ed8' },
  statLabel: { fontSize: '19px', marginTop: '14px', fontWeight: '600', color: '#1e40af' },

  // SERVICES
  services: { padding: '130px 20px', backgroundColor: '#9ccaf1ff' },
  sectionTitle: { 
    textAlign: 'center', 
    fontSize: '44px', 
    fontWeight: '900', 
    marginBottom: '80px', 
    color: '#0f172a' 
  },
  servicesGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
    gap: '40px', 
    maxWidth: '1200px', 
    margin: '0 auto' 
  },
  serviceCard: { 
    padding: '40px', 
    backgroundColor: '#f8fafc', 
    borderRadius: '20px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
    textAlign: 'center', 
    border: '2px solid #e0f2fe',
    transition: '0.3s'
  },
  serviceIcon: { fontSize: '56px', marginBottom: '24px', color: '#1d4ed8' },
  serviceTitle: { fontSize: '24px', fontWeight: '800', color: '#0f172a' },
  serviceDesc: { color: '#475569', marginTop: '14px', fontSize: '16px' },

  // MISSION
  mission: { 
    padding: '140px 20px', 
    background: 'linear-gradient(135deg, #03b0faff, #9cbbeeff)', 
    color: 'white', 
    textAlign: 'center' 
  },
  missionText: { 
    fontSize: '26px', 
    maxWidth: '1000px', 
    margin: '0 auto', 
    lineHeight: '1.8', 
    fontWeight: '500' 
  },

  // FOOTER
  footer: { 
    padding: '80px 20px', 
    backgroundColor: '#0f172a', 
    color: '#e2e8f0', 
    textAlign: 'center',
    fontSize: '16px'
  }
};

// Hover Effects
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('[style*="serviceCard"], [style*="statCard"]');
  cards.forEach(card => {
    card.style.transition = 'all 0.3s ease';
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-12px)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
  });
});
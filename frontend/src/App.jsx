import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import semua halaman dari satu folder (Flat Structure)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AnalysisResult from './pages/AnalysisResult';
import AuditHistory from './pages/AuditHistory';

/**
 * =================================================================================
 * COMPONENT: RouteGuard
 * =================================================================================
 * Berperan sebagai middleware untuk proteksi rute (RBAC - Role Based Access Control).
 * Memastikan pengguna terautentikasi dan memiliki role yang sesuai sebelum mengakses.
 * =================================================================================
 */
const RouteGuard = ({ children, roleRequired }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // State loading untuk mencegah 'flicker' saat sistem mengecek session di localStorage
  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Initializing JAGAT-X System...</div>;
  
  // Jika belum login, paksa arahkan ke halaman Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logika pengecekan otorisasi role (Admin vs User/Dokter)
  if (roleRequired && user.role !== roleRequired) {
    // Jika dokter coba masuk ke Audit History Admin, lempar ke Dashboard
    return <Navigate to={user.role === 'admin' ? '/audit-history' : '/dashboard'} replace />;
  }

  return children;
};

/**
 * =================================================================================
 * MAIN COMPONENT: App
 * =================================================================================
 * Entry point aplikasi yang mengatur struktur navigasi (Routing) dan Global Provider.
 * Menggunakan React Router DOM untuk manajemen Single Page Application (SPA).
 * =================================================================================
 */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. Halaman Informasi Utama - Terbuka untuk publik */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Gerbang Masuk (Integrasi Database) - Form login tenaga medis */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3. Meja Analisis (Doctor & Radiologist) - Terproteksi Login */}
          <Route 
            path="/dashboard" 
            element={
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            } 
          />

          {/* 4. Visualisasi Hasil AI (Grad-CAM & Triage) - Terproteksi Login */}
          <Route 
            path="/analysis-result" 
            element={
              <RouteGuard>
                <AnalysisResult />
              </RouteGuard>
            } 
          />

          {/* 5. Riwayat Audit (Khusus Admin - UU PDP Compliance) - Terproteksi Role Admin */}
          <Route 
            path="/audit-history" 
            element={
              <RouteGuard roleRequired="admin">
                <AuditHistory />
              </RouteGuard>
            } 
          />

          {/* 6. Fallback: Jika URL tidak ditemukan, arahkan kembali ke Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
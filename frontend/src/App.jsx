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
 * Komponen pembantu untuk cek akses sederhana (Internal Check)
 * Tanpa file terpisah agar struktur tetap ringan.
 */
const RouteGuard = ({ children, roleRequired }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Initializing JAGAT-X System...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    // Jika dokter coba masuk ke Audit History Admin, lempar ke Dashboard
    return <Navigate to={user.role === 'admin' ? '/audit-history' : '/dashboard'} replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. Halaman Informasi Utama */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Gerbang Masuk (Integrasi Database) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3. Meja Analisis (Doctor & Radiologist) */}
          <Route 
            path="/dashboard" 
            element={
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            } 
          />

          {/* 4. Visualisasi Hasil AI (Grad-CAM & Triage) */}
          <Route 
            path="/analysis-result" 
            element={
              <RouteGuard>
                <AnalysisResult />
              </RouteGuard>
            } 
          />

          {/* 5. Riwayat Audit (Khusus Admin - UU PDP Compliance) */}
          <Route 
            path="/audit-history" 
            element={
              <RouteGuard roleRequired="admin">
                <AuditHistory />
              </RouteGuard>
            } 
          />

          {/* 6. Fallback: Jika URL salah, balik ke Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
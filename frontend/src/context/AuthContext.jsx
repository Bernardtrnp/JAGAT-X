import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

/**
 * =================================================================================
 * CONTEXT: AuthContext
 * =================================================================================
 * Menyediakan state global untuk manajemen otentikasi pengguna.
 * Mengelola sesi login, data user, status loading, dan hak akses (RBAC).
 * =================================================================================
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * 1. PERSISTENCE: Session Recovery
   * Mengecek keberadaan session di localStorage saat aplikasi pertama kali dimuat.
   * Hal ini mencegah pengguna log out otomatis ketika menekan tombol refresh.
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('jagat_session');
    if (savedUser) {
      try {
        // Mengembalikan objek user dari string JSON
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Menghapus data jika format JSON rusak/invalid
        localStorage.removeItem('jagat_session');
      }
    }
    setLoading(false);
  }, []);

  /**
   * 2. LOGIN: Integrasi FastAPI /v1/auth/login
   * Mengirim kredensial ke server dan menyimpan data session jika sukses.
   * * @param {string} username - Username tenaga medis/admin
   * @param {string} password - Kata sandi akun
   * @returns {Object} Hasil otentikasi (success status, role, atau error message)
   */
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/v1/auth/login', { 
        username, 
        password 
      });

      // Struktur data disesuaikan dengan response wrapper FastAPI { status, data: { ... } }
      const userData = response.data.data; 

      setUser(userData);
      // Simpan objek user ke localStorage agar state awet saat refresh
      localStorage.setItem('jagat_session', JSON.stringify(userData));
      
      return { success: true, role: userData.role };
    } catch (error) {
      console.error("Auth Error:", error);
      // Mengambil pesan error "Authentication failed: Invalid credentials" dari backend
      const errorMsg = error.response?.data?.detail || "Koneksi ke server JAGAT-X gagal";
      return { success: false, message: errorMsg };
    }
  };

  /**
   * 3. LOGOUT: Session Termination
   * Membersihkan state aplikasi dan menghapus data sesi dari penyimpanan browser.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('jagat_session');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      // Boolean helper untuk mengecek status login dengan cepat
      isAuthenticated: !!user,
      // Boolean helper untuk proteksi route khusus admin
      isAdmin: user?.role === 'admin'
    }}>
      {/* Mencegah rendering komponen anak sebelum pengecekan session selesai */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * HOOK: useAuth
 * Memudahkan komponen fungsional untuk mengakses data otentikasi.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
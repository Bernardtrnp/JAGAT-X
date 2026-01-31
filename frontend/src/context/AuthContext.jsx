import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. PERSISTENCE: Cek session agar tidak log out saat refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('jagat_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('jagat_session');
      }
    }
    setLoading(false);
  }, []);

  /**
   * 2. LOGIN: Integrasi FastAPI /v1/auth/login
   */
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/v1/auth/login', { 
        username, 
        password 
      });

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

  // 3. LOGOUT: Bersihkan sesi
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
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
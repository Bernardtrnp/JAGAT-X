import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import JagatLogo from '../assets/image.png'; // Pastikan path logo benar

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);

    if (result.success) {
      navigate(result.role === 'admin' ? '/audit-history' : '/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      {/* TOP NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-xl">
        <div className="flex items-center gap-6">
          {/* Logo & Brand Section */}
          <div className="flex items-center gap-3 pr-6 border-r border-slate-200">
            <img 
              src={JagatLogo} 
              alt="JAGAT-X Logo" 
              className="w-12 h-12 rounded-xl shadow-lg object-cover"
            />
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-600">
              JAGAT-X
            </span>
          </div>

          {/* Page Title Section - Disesuaikan untuk Login */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 rotate-3">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">Secure Access</h1>
              <p className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em]">Medical Authentication Gateway</p>
            </div>
          </div>
        </div>
        
      </div>

      <div className="flex flex-col items-center justify-center mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-[#1E293B]">Medical Portal Access</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium italic">Authorized Clinicians Only</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Identity Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Identity ID</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Access Key</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-xl text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full group py-4 bg-[#1E293B] hover:bg-[#3B82F6] text-white rounded-2xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:bg-slate-300 disabled:shadow-none"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    ENTER SYSTEM
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Info */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[#64748B]">
            <ShieldCheck size={16} />
            <span className="text-[11px] font-medium tracking-wide uppercase">UU PDP & ISO 27001 COMPLIANT</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
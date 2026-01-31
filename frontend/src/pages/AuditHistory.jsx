import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// Import logo dari folder assets
import JagatLogo from '../assets/image.png'; 
import { 
  ShieldCheck, 
  Hash, 
  Activity,
  Search,
  RefreshCw,
  LogOut,
  Clock,
  User,
  Database
} from 'lucide-react';

const AuditHistory = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/v1/audit/history');
      setLogs(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setTimeout(() => setLoading(false), 800); 
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.audit_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    CRITICAL: "bg-red-500 shadow-red-200 text-white",
    URGENT: "bg-amber-500 shadow-amber-200 text-white",
    MONITORING: "bg-blue-600 shadow-blue-200 text-white",
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 lg:p-10 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP NAVIGATION BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-xl">
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

            {/* Page Title Section */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 rotate-3">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">System Logs</h1>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em]">Immutable Audit Trail</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by Audit ID..."
                className="pl-12 pr-6 py-3 bg-white border-none rounded-2xl w-full md:w-80 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm font-medium"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-xl active:scale-95"
            >
              <LogOut size={18} /> LOGOUT
            </button>
          </div>
        </div>

        {/* STATS SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm flex items-center justify-between group overflow-hidden relative"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Record</p>
              <p className="text-4xl font-black text-slate-900 leading-none">{logs.length}</p>
            </div>
            <Activity className="text-slate-100 group-hover:text-blue-50 transition-colors absolute -right-4 -bottom-4" size={120} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between group overflow-hidden relative shadow-2xl"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Database Status</p>
              <p className="text-4xl font-black text-blue-400 leading-none flex items-center gap-3">
                SECURE <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </p>
            </div>
            <Database className="text-white/[0.03] absolute -right-4 -bottom-4" size={120} />
          </motion.div>
        </div>

        {/* TABLE LOGS */}
        <div className="bg-white rounded-[3rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-7">Unique Audit ID</th>
                  <th className="px-10 py-7">Medical Professional</th>
                  <th className="px-10 py-7 text-center">Triage Status</th>
                  <th className="px-10 py-7 text-right">Execution Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-32 text-center">
                        <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Fetching Security Logs...</p>
                      </td>
                    </tr>
                  ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((log, index) => (
                      <motion.tr 
                        key={log.audit_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50/30 transition-all group cursor-default"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-300">
                              <Hash size={18} />
                            </div>
                            <span className="font-mono text-sm font-black text-slate-700 tracking-tight">{log.audit_id}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">
                              <User size={14} />
                            </div>
                            <span className="text-sm font-bold text-slate-600">{log.doctor_name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex justify-center">
                            <span className={`px-5 py-1.5 rounded-full text-[9px] font-black shadow-lg uppercase tracking-widest ${statusColors[log.triage_result] || 'bg-slate-200'}`}>
                              {log.triage_result}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              {new Date(log.analysis_time).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                              <Clock size={14} className="text-slate-300" />
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {new Date(log.analysis_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-32 text-center text-slate-400">
                        <Search size={40} className="mx-auto mb-4 opacity-20" />
                        <p className="font-bold tracking-widest uppercase text-xs">No matching record found</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-12 flex justify-between items-center px-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">JAGAT-X Core Engine • Security Audit</p>
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75" />
            <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce delay-150" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditHistory;
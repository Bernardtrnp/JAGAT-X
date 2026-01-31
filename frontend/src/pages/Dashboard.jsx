import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Ditambahkan untuk animasi keren
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// Import logo dari folder assets
import JagatLogo from '../assets/image.png'; 
import { 
  Upload as UploadIcon, 
  X, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  FileText,
  Search,
  LogOut,
  User as UserIcon,
  Zap
} from 'lucide-react';

/**
 * =================================================================================
 * COMPONENT: Dashboard
 * =================================================================================
 * Interface utama untuk dokter/tenaga medis melakukan unggah citra radiologi.
 * Menghubungkan Frontend dengan model AI (ResNet-50) melalui API Backend.
 * =================================================================================
 */
const Dashboard = () => {
  // Referensi dan Hooks Navigasi
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Mengambil data dokter & fungsi logout

  // State Management untuk File, Preview, dan UI Feedback
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * PROSES VALIDASI & PREVIEW FILE
   * Memastikan file yang diunggah adalah gambar (JPG/PNG) dan membuat URL preview.
   */
  const processFile = (file) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Format file tidak didukung. Gunakan JPG atau PNG.");
    }
  };

  // Handler untuk input file manual via dialog sistem
  const handleFileChange = (e) => processFile(e.target.files[0]);

  // Fungsi untuk membersihkan pilihan file (reset state)
  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /**
   * HANDLER ANALISIS AI
   * Mengirimkan citra radiologi ke backend FastAPI untuk proses inferensi model.
   */
  const handleRunAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    
    // Penyiapan data Multipart (Image + Metadata User)
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_fullname', user?.full_name || "Dr. Medical Professional");

    try {
      // POST ke endpoint analisis backend
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Navigasi ke halaman hasil dengan membawa payload data analisis
      navigate('/analysis-result', { 
        state: { 
          analysisResult: response.data, 
          originalPreview: preview 
        } 
      });

    } catch (error) {
      console.error("Analysis Error:", error);
      alert(error.response?.data?.detail || "Terjadi kesalahan pada server.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 lg:p-10 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* --- PREMIUM NAVBAR START --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50"
        >
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

            {/* User Info Section - Identitas Dokter yang sedang login */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 rotate-3 transition-transform hover:rotate-0">
                <UserIcon size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">
                  {user?.full_name || "Medical Officer"}
                </h1>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Verified Physician
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-xl active:scale-95 group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> LOGOUT
            </button>
          </div>
        </motion.div>
        {/* --- PREMIUM NAVBAR END --- */}

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri: Upload Area dengan Animasi Drag & Drop */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-[3rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden min-h-[580px] flex flex-col relative group">
              {!selectedFile ? (
                // Tampilan Awal: Dropzone untuk file upload
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); }}
                  className={`flex-1 flex flex-col items-center justify-center p-12 transition-all cursor-pointer border-4 border-dashed m-6 rounded-[2.5rem] ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:bg-slate-50/50 hover:border-blue-200'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 text-blue-600 shadow-inner"
                  >
                    <UploadIcon size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Unggah Citra Radiologi</h3>
                  <p className="text-slate-400 text-center max-w-sm text-sm font-medium leading-relaxed">
                    Seret file X-Ray Anda ke area ini atau klik untuk menelusuri file JPG/PNG lokal.
                  </p>
                  <button className="mt-10 px-10 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                    Pilih File Lokal
                  </button>
                </div>
              ) : (
                // Tampilan Preview: Setelah file dipilih
                <div className="relative flex-1 bg-slate-900 flex items-center justify-center p-10 min-h-[580px]">
                  <motion.img 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={preview} 
                    alt="X-Ray Preview" 
                    className="max-w-full max-h-[520px] object-contain rounded-2xl shadow-2xl border border-white/10" 
                  />
                  
                  {/* Tombol Hapus/Cancel File */}
                  {!isAnalyzing && (
                    <button 
                      onClick={clearFile}
                      className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-red-500 text-white backdrop-blur-xl rounded-2xl transition-all shadow-2xl"
                    >
                      <X size={24} />
                    </button>
                  )}

                  {/* Overlay Loading saat AI sedang berproses */}
                  <AnimatePresence>
                    {isAnalyzing && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-10 text-center z-50"
                      >
                        <div className="relative mb-8">
                           <Loader2 className="w-20 h-20 text-blue-500 animate-spin" />
                           <Activity className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black tracking-[0.2em] uppercase text-white mb-4">ResNet-50 Neural Engine</h3>
                        <p className="text-slate-400 text-base max-w-md font-medium leading-relaxed">
                          Sistem sedang mengekstraksi fitur visual citra dan menghitung probabilitas 6 patologi utama secara real-time...
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          {/* Kolom Kanan: Sidebar dengan Kontrol Analisis & Protokol Klinis */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-white rounded-[3rem] border border-white p-8 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Activity size={22} />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Analysis Setup</h2>
              </div>

              <div className="space-y-8">
                {/* Info File terpilih */}
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Current Selection</p>
                  {selectedFile ? (
                    <div className="flex items-center gap-4 text-slate-700 font-bold relative z-10">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <FileText size={20} className="text-blue-500" />
                      </div>
                      <span className="text-sm truncate">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic font-medium">Awaiting input...</span>
                  )}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                </div>

                {/* Tombol Eksekusi Inferences */}
                <button 
                  onClick={handleRunAnalysis}
                  disabled={!selectedFile || isAnalyzing}
                  className={`w-full py-5 rounded-[2rem] font-black text-sm tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 ${
                    selectedFile && !isAnalyzing
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-95' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isAnalyzing ? (
                    <>RUNNING INFERENCE...</>
                  ) : (
                    <>RUN AI DIAGNOSIS <Zap size={18} fill="currentColor" /></>
                  )}
                </button>

                {/* Seksi Protokol Klinis & Disclaimer */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Protocol</span>
                  </div>
                  <ul className="text-[11px] text-slate-500 space-y-3 font-semibold leading-relaxed">
                    <li className="flex gap-3"><span className="text-blue-500">•</span> Hasil diagnosis AI bersifat "Supportive" bukan "Definitive".</li>
                    <li className="flex gap-3"><span className="text-blue-500">•</span> Verifikasi wajib dilakukan oleh dokter penanggung jawab.</li>
                    <li className="flex gap-3"><span className="text-blue-500">•</span> Kepatuhan UU Perlindungan Data Pribadi diaktifkan.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Privacy Card: Penjelasan Keamanan Data Medis */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl group"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400 backdrop-blur-md">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="text-sm font-black tracking-tight uppercase">Privacy Secured</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Seluruh data citra medis diproses menggunakan akselerasi hardware lokal. Data tidak disimpan permanen sesuai regulasi kerahasiaan kedokteran.
                </p>
              </div>
              <Activity className="absolute -right-6 -bottom-6 text-white/[0.03] group-hover:text-blue-500/10 transition-colors" size={150} />
            </motion.div>
          </motion.aside>
        </main>

        {/* Input Tersembunyi untuk Interaksi Pemilihan File */}
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/jpeg,image/png" 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Brain, Database, Cpu, Activity,
  Network, Microscope, ShieldAlert, ChevronRight,
  Lock, UserCheck, Scale, FileWarning, ClipboardList,
  Stethoscope, CheckCircle, Zap, Eye, ArrowRight,
  Globe, AlertTriangle, Layers, ShieldCheck
} from 'lucide-react';
import JagatLogo from '../assets/image.png'; // Pastikan path logo Anda benar

// --- SHARED COMPONENTS ---

/**
 * NavButton: Komponen tombol navigasi dengan efek gradient slide dan animasi hover.
 */
const NavButton = ({ children, onClick }) => (
  <button 
    onClick={onClick}
    className="relative group px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl overflow-hidden transition-all hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
  >
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
    <span className="relative flex items-center gap-2">
      {children} <ArrowRight size={18} />
    </span>
  </button>
);

/**
 * GlassCard: Komponen kartu dengan efek glassmorphism (blur & semi-transparan).
 */
const GlassCard = ({ children, className = "" }) => (
  <motion.div 
    whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.05)" }}
    className={`bg-white/70 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 ${className}`}
  >
    {children}
  </motion.div>
);

/**
 * =================================================================================
 * COMPONENT: LandingPage
 * =================================================================================
 * Halaman utama (Public Portal) yang menjelaskan value proposition, teknologi AI,
 * dataset, dan sistem triase medis JAGAT-X.
 * =================================================================================
 */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Efek untuk mendeteksi scroll guna mengubah tampilan Navbar (sticky effect)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* DECORATIVE ELEMENTS: Ornamen blur di latar belakang untuk estetika modern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-indigo-50/50 blur-[100px] rounded-full" />
      </div>

      {/* INTEGRATED TOP NAVIGATION BAR: Responsif terhadap status scroll */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 ${
        scrolled ? 'py-4' : 'py-8'
      }`}>
        <div className={`max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 md:p-6 rounded-[2.5rem] border border-white shadow-xl transition-all duration-500 ${
          scrolled ? 'bg-white/90 backdrop-blur-xl shadow-blue-900/5' : 'bg-white/40 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-6">
            {/* Logo & Brand Section */}
            <div className="flex items-center gap-3 pr-6 border-r border-slate-200 cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src={JagatLogo} 
                alt="JAGAT-X Logo" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg object-cover"
              />
              <span className="text-xl md:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-600">
                JAGAT-X
              </span>
            </div>

            {/* Page Title Section - Identitas portal publik */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 rotate-3">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h1 className="text-sm md:text-xl font-black tracking-tight text-slate-900 leading-tight">Public Portal</h1>
                <p className="text-[7px] md:text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em]">Medical Intelligence Core</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <NavButton onClick={() => navigate('/login')}>Login</NavButton>
          </div>
        </div>
      </nav>

      {/* HERO: DASAR PEMIKIRAN - Menjelaskan misi sosial dan fungsi utama screening */}
      <section className="relative pt-60 pb-24 z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-600/5 border border-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-widest mb-6">
              <AlertTriangle size={12} /> AI for Social Impact
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-[1.05] tracking-tight">
              Akselerasi Triage <br />
              <span className="text-blue-600">Gawat Darurat Paru.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Menjawab tantangan distribusi tenaga medis di Indonesia. JAGAT-X membantu dokter IGD melakukan <b>screening awal 6 patologi utama</b> dalam waktu kurang dari 1 detik.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 hover:shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all active:scale-95 flex items-center gap-3"
              >
                Mulai Analisis <ChevronRight />
              </button>
            </div>
          </motion.div>

          {/* Visual Preview Dashboard dengan aksen teknologi */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 blur-2xl rounded-[3rem]" />
            <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800" 
                alt="Radiology Dashboard Preview"
                className="w-full h-[540px] object-cover opacity-70 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Live Inference Pipeline</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 p-3 rounded-lg"><p className="text-[10px] text-white/50 uppercase">Architecture</p><p className="text-sm font-bold text-white">ResNet-50</p></div>
                    <div className="bg-black/20 p-3 rounded-lg"><p className="text-[10px] text-white/50 uppercase">Patology</p><p className="text-sm font-bold text-white">6</p></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DATASET SECTION: Menjelaskan sumber data pelatihan model AI */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black mb-4">Integrasi Dataset Global</h2>
              <p className="text-slate-500 italic">Melalui konsolidasi empat dataset internasional untuk memastikan akurasi deteksi lintas patologi.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
              <Globe size={14} /> Global Distribution Training
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "NIH Chest X-Ray", desc: "112,120 citra untuk identifikasi pola penyakit toraks masif.", icon: Database, color: "text-blue-600" },
              { title: "SIIM-ACR", desc: "Dataset khusus untuk segmentasi presisi kondisi Pneumothorax.", icon: Network, color: "text-indigo-600" },
              { title: "Shenzhen Dataset", desc: "Kumpulan data klinis untuk skrining awal Tuberkulosis (TBC).", icon: Microscope, color: "text-cyan-600" },
              { title: "CheXpert", desc: "Validasi citra paru berskala besar untuk kestabilan model.", icon: ClipboardList, color: "text-purple-600" },
            ].map((d, i) => (
              <GlassCard key={i} className="group">
                <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 ${d.color} flex items-center justify-center mb-6`}>
                  <d.icon size={28} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{d.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{d.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNICAL: ARCHITECTURE - Detail teknis Deep Learning dan pemrosesan citra */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8 leading-tight">Optimasi Deep Learning & <br/> Augmentasi On-the-Fly</h2>
              <p className="text-slate-400 mb-10 leading-relaxed">
                Model kami distandarisasi ke ukuran <b>224x224 piksel</b> dengan normalisasi Z-score. Guna menghadapi variasi citra di lapangan, JAGAT-X menerapkan teknik augmentasi data dinamis:
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Multilabel Classification", icon: Layers },
                  { label: "Random Rotation & Flipping", icon: Zap },
                  { label: "Color Jittering", icon: Eye },
                  { label: "MPS GPU Acceleration", icon: Cpu }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <item.icon size={20} className="text-blue-400" />
                    <span className="text-sm font-bold text-slate-200">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-xl">
                <h4 className="text-2xl font-black mb-4 italic">The ResNet-50 Advantage</h4>
                <p className="text-sm text-blue-50/80 leading-relaxed">
                  Memanfaatkan arsitektur Residual Network 50-layer yang stabil untuk mengekstraksi fitur visual kompleks, memungkinkan performa diagnosa yang tetap presisi meski pada dataset medis yang bising.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRIAGE SYSTEM: Penjelasan alur kerja triase berdasarkan warna (Red, Yellow, Green) */}
      <section className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-900 mb-6">Sistem Triase Cerdas</h2>
            <p className="text-slate-500 max-w-2xl mx-auto italic">Penentuan prioritas layanan berdasarkan tingkat urgensi patologi yang terdeteksi.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { 
                level: "RED (Critical)", 
                conditions: ["Pneumothorax", "Edema Paru"], 
                color: "bg-red-500", bg: "bg-red-50", border: "border-red-100", text: "text-red-900",
                action: "Risiko gagal napas akut. Butuh tindakan segera (Needle Thoracocentesis/Manajemen Jantung) & lapor Radiolog < 5 menit." 
              },
              { 
                level: "YELLOW (Urgent)", 
                conditions: ["Pneumonia", "Tuberculosis (TBC)"], 
                color: "bg-amber-500", bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-900",
                action: "Inisiasi protokol antibiotik atau isolasi untuk penyakit infeksius. Evaluasi lab lanjutan dalam 30-60 menit." 
              },
              { 
                level: "GREEN (Monitoring)", 
                conditions: ["Kardiomegali", "Efusi Pleura"], 
                color: "bg-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-900",
                action: "Observasi tanda vital berkala. Penjadwalan konsultasi non-akut dengan spesialis Jantung atau Paru." 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -10 }}
                className={`p-10 rounded-[3rem] border ${item.bg} ${item.border} flex flex-col gap-6 shadow-sm`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${item.color} shadow-lg flex items-center justify-center text-white`}><Activity size={28} /></div>
                  <h4 className={`text-xl font-black ${item.text}`}>{item.level}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.conditions.map(c => <span key={c} className="px-4 py-1.5 bg-white/80 rounded-xl text-xs font-bold border border-slate-200">{c}</span>)}
                </div>
                <div className="mt-auto pt-6 border-t border-black/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Protokol Penanganan</p>
                  <p className={`text-sm leading-relaxed font-medium ${item.text}/90`}>{item.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLIANCE & PDP: Bagian Disclaimer Medis dan Kepatuhan Hukum Perlindungan Data */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Medical Disclaimer Section */}
          <div className="p-12 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110" />
            <ShieldAlert className="text-red-600 mb-8 relative z-10" size={48} />
            <h5 className="text-2xl font-black mb-6 text-slate-900">Batasan Penggunaan Medis</h5>
            <div className="space-y-5 text-sm text-slate-600 relative z-10">
              <div className="flex gap-4"><Stethoscope className="flex-shrink-0 text-slate-400" size={20} /> <p><b>Clinical Decision Support:</b> JAGAT-X adalah alat bantu, diagnosa final wajib divalidasi oleh dokter radiologi.</p></div>
              <div className="flex gap-4"><FileWarning className="flex-shrink-0 text-slate-400" size={20} /> <p>Prototip akademik untuk percepatan triase, bukan dasar tindakan invasif tanpa verifikasi otoritas medis.</p></div>
              <div className="flex gap-4"><Scale className="flex-shrink-0 text-slate-400" size={20} /> <p>Keputusan klinis akhir sepenuhnya merupakan wewenang tenaga medis yang bertugas.</p></div>
            </div>
          </div>

          {/* Privacy & Regulation Section (UU PDP) */}
          <div className="p-12 bg-blue-600 rounded-[3.5rem] text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110" />
            <Lock className="text-white mb-8 relative z-10" size={48} />
            <h5 className="text-2xl font-black mb-6">Kepatuhan UU PDP No. 27/2022</h5>
            <div className="space-y-5 text-sm text-blue-50 relative z-10">
              <div className="flex gap-4"><UserCheck className="flex-shrink-0" size={20} /> <p><b>Anonymized Processing:</b> Citra medis diproses tanpa menyimpan identitas pribadi (PII) secara permanen untuk menjamin privasi.</p></div>
              <div className="flex gap-4"><Shield className="flex-shrink-0" size={20} /> <p><b>Kedaulatan Data:</b> Seluruh proses inferensi dilakukan pada infrastruktur lokal demi menjaga kerahasiaan rahasia kedokteran.</p></div>
              <div className="flex gap-4"><CheckCircle className="flex-shrink-0" size={20} /> <p><b>Integritas Data:</b> Penerapan standar keamanan tinggi sesuai regulasi perlindungan data pribadi nasional.</p></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
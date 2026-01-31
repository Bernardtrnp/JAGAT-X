import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Printer, // Ganti icon ke Printer
  Activity, 
  Info, 
  ShieldCheck,
  Zap
} from 'lucide-react';

const AnalysisResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef(null);
  
  const { analysisResult, originalPreview } = location.state || {};

  // FUNGSI NATIVE PRINT
  const handlePrint = () => {
    window.print();
  };

  if (!analysisResult) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <h2 className="text-xl font-bold text-slate-800">No Data Available</h2>
        <button onClick={() => navigate('/dashboard')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const triageStyles = {
    red: { bg: "bg-red-500", light: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    orange: { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    blue: { bg: "bg-blue-600", light: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" }
  };

  const currentTheme = triageStyles[analysisResult.triage.color] || triageStyles.blue;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12 font-sans text-slate-900 print:bg-white print:p-0">
      
      {/* Navigation & Actions - SEMBUNYIKAN SAAT PRINT */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10 print:hidden">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all group"
        >
          <div className="p-2 rounded-lg group-hover:bg-slate-100">
            <ChevronLeft size={20} />
          </div>
          KEMBALI KE UPLOAD
        </button>
        
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-xl transition-all active:scale-95"
        >
          <Printer size={18} /> PRINT / SAVE AS PDF
        </button>
      </div>

      {/* AREA REPORT */}
      <div ref={reportRef} className="max-w-7xl mx-auto p-4 bg-[#f8fafc] print:bg-white print:p-0">
        
        {/* Header Tambahan Khusus di PDF (Opsional) */}
        <div className="hidden print:flex justify-between items-center border-b-2 border-slate-100 pb-6 mb-8">
            <div>
                <h1 className="text-2xl font-black">JAGAT-X MEDICAL REPORT</h1>
                <p className="text-xs font-bold text-blue-600">AI-ASSISTED RADIOLOGY ANALYSIS</p>
            </div>
            <div className="text-right text-[10px] text-slate-400 font-bold uppercase">
                Date Generated: {new Date().toLocaleDateString('id-ID')}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm print:shadow-none print:border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Activity className="text-blue-600" size={20} /> 
                  Visual Explanation (XAI)
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original Scan</p>
                  <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
                    <img src={originalPreview} alt="Original" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">AI Heatmap Overlay</p>
                  <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-square border-2 border-blue-500/20 flex items-center justify-center">
                    <img 
                      src={`data:image/jpeg;base64,${analysisResult.visual_explanation}`} 
                      alt="AI Explanation" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`${currentTheme.light} p-8 rounded-[32px] border ${currentTheme.border} print:border-slate-200`}>
              <h4 className={`text-sm font-black uppercase tracking-widest ${currentTheme.text} mb-4 flex items-center gap-2`}>
                <Info size={16} /> Clinical AI Narrative
              </h4>
              <p className={`text-lg font-medium leading-relaxed italic ${currentTheme.text} opacity-90`}>
                "{analysisResult.textual_explanation}"
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm print:shadow-none print:border-slate-100">
              <div className={`p-8 ${currentTheme.bg} text-white`}>
                <div className="flex justify-between items-start mb-6">
                  <Zap size={24} fill="currentColor" />
                  <div className="text-right">
                    <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">Confidence</p>
                    <p className="text-2xl font-black">{(analysisResult.top_confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <h2 className="text-4xl font-black mb-1">{analysisResult.triage.level}</h2>
                <p className="text-sm font-bold opacity-80 uppercase italic leading-tight">
                  {analysisResult.triage.action}
                </p>
              </div>
              
              <div className="p-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Probabilities</h4>
                <div className="space-y-4">
                  {Object.entries(analysisResult.predictions).map(([label, value]) => (
                    <div key={label} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-slate-700">{label}</span>
                        <span className="text-xs font-black text-blue-600">{(value * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600"
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 text-slate-600">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Audit ID</p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[8px] break-all leading-tight">
                    {analysisResult.audit_id}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="hidden print:block text-[8px] text-slate-400 text-center italic mt-4">
              *Laporan ini dihasilkan secara otomatis oleh sistem kecerdasan buatan. 
              Keputusan medis final berada pada tanggung jawab dokter radiolog.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
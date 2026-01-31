from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Konfigurasi Database: SQLite digunakan untuk portabilitas dan performa lokal (Single-node)
DB_URL = "sqlite:///./jagatx.db"

engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- [1] USER SCHEMATIC (RBAC) ---

class User(Base):
    """
    Entitas Pengguna untuk kontrol akses berbasis peran (Role-Based Access Control).
    Menyimpan identitas tenaga medis dan referensi kredensial ter-hashing.
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    full_name = Column(String)
    role = Column(String)  # Definisi peran: 'admin', 'doctor', 'radiologist'

# --- [2] AUDIT TRAIL SCHEMATIC (PDP COMPLIANCE) ---

class AuditLog(Base):
    """
    Log aktivitas pemeriksaan untuk kebutuhan akuntabilitas medis.
    Sesuai UU PDP: Hanya menyimpan metadata aktivitas tanpa menyimpan citra/data pasien.
    """
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(String, unique=True, index=True)           # ID Referensi unik (e.g., JGTX-XXXX)
    doctor_name = Column(String)                                 # Identitas operator/tenaga medis
    triage_result = Column(String)                               # Kategori urgensi (CRITICAL/URGENT/MONITORING)
    analysis_time = Column(DateTime, default=datetime.utcnow)    # Timestamp ISO format

# --- [3] DATABASE INITIALIZATION ---

def init_db():
    """Membangun seluruh skema tabel pada engine database jika belum terdefinisi."""
    Base.metadata.create_all(bind=engine)
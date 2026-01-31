from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import User  # Pastikan file database.py memiliki class User

# [1] KONFIGURASI KEAMANAN
# Menggunakan bcrypt sebagai algoritma hashing standar industri
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Mengubah plain text password menjadi hash yang aman."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Membandingkan input password dengan hash yang ada di database."""
    return pwd_context.verify(plain_password, hashed_password)

# [2] LOGIKA SEEDING (DATABASE INITIALIZATION)
def seed_initial_user(db: Session):
    """
    Menanam user awal jika database baru dibuat.
    Mencakup role: Admin, Doctor, dan Radiologist.
    """
    initial_users = [
        {
            "username": "admin",
            "password": "admin",
            "full_name": "Administrator JAGAT-X",
            "role": "admin"
        },
        {
            "username": "doctor",
            "password": "doctor",
            "full_name": "Dr. Bernard Thimotius",
            "role": "doctor"
        },
        {
            "username": "radiolog",
            "password": "radiolog",
            "full_name": "Dr. Specialist Radiology",
            "role": "radiologist"
        }
    ]

    print("[*] Checking for initial users...")

    for user_data in initial_users:
        # Cek apakah user sudah ada berdasarkan username
        user_exists = db.query(User).filter(User.username == user_data["username"]).first()
        
        if not user_exists:
            try:
                new_user = User(
                    username=user_data["username"],
                    password_hash=hash_password(user_data["password"]),
                    full_name=user_data["full_name"],
                    role=user_data["role"]
                )
                db.add(new_user)
                print(f"[+] User '{user_data['username']}' created successfully.")
            except Exception as e:
                print(f"[!] Error seeding user {user_data['username']}: {e}")
        else:
            print(f"[-] User '{user_data['username']}' already exists. Skipping.")

    # Simpan perubahan secara permanen ke database
    db.commit()

# [3] HELPER: GET USER BY USERNAME
def get_user_by_username(db: Session, username: str):
    """Mencari user di database berdasarkan username."""
    return db.query(User).filter(User.username == username).first()
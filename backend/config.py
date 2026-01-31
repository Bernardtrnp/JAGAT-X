"""
================================================================================
JAGAT-X: SYSTEM CONFIGURATION PROPERTIES
================================================================================
Project for  : DINACOM 11.0 (Dian Nuswantoro Computer Competition)
Team Name    : Tim Penguasa Tanjung Duren
Members      : Bernard Thimotius Turnip, Eleazar Gosdavicraka, 
               Sebastian Kean Vifel Ellindra Zista
Date         : 31 Januari 2026
================================================================================
"""

import torch

class AppConfig:
    # Metadata Project
    PROJECT_NAME = "JAGAT-X"
    TEAM_NAME = "Tim Penguasa Tanjung Duren"
    VERSION = "1.0.0"

    # Perangkat Keras
    DEVICE = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

    # Klasifikasi Penyakit
    TARGET_LABELS = [
        'Cardiomegaly', 'Edema', 'Pneumonia', 
        'Effusion', 'Pneumothorax', 'TBC'
    ]

    # Parameter Model
    MODEL_PATH = "jagatx_best_model.pth"
    PROBABILITY_THRESHOLD = 0.5

    # Pengaturan Keamanan & File
    UPLOAD_DIR = "temp_uploads"
    MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5MB limit
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

    # Triage Color Coding (Hex)
    COLOR_CRITICAL = "#FF0000"
    COLOR_URGENT = "#FFA500"
    COLOR_MONITORING = "#007BFF"
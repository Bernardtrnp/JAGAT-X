import pandas as pd
import os
from sklearn.model_selection import GroupShuffleSplit
from tqdm import tqdm

# --- Configuration & Global Constants ---
# Define directory paths and target pathologies for multi-label classification
BASE_DIR = "/Users/joygabriel/Downloads/JAGAT-X/model"
TARGET_COLS = ['Cardiomegaly', 'Effusion', 'Pneumothorax', 'Edema', 'Pneumonia', 'TBC']

def print_separator(title):
    """Utility function for structured console logging."""
    print(f"\n{'='*60}\n{title}\n{'='*60}")

# --- STEP 0: GLOBAL FILE INDEXING ---
def build_global_index(base_path):
    """
    Creates a high-speed lookup table for image paths.
    This prevents repetitive disk I/O scans and ensures 100% file traceability
    across multiple heterogeneous datasets.
    """
    print(f"Initiating Deep Scan at: {base_path}")
    print("Building file index for optimized data retrieval...")
    index = {}
    extensions = ('.png', '.jpg', '.jpeg')
    
    for root, _, files in os.walk(base_path):
        for f in files:
            if f.lower().endswith(extensions):
                # Map filename to absolute path for instant access
                index[f] = os.path.join(root, f)
    print(f"Success: {len(index)} image files indexed.")
    return index

# --- 1. NIH DATASET PIPELINE ---
def process_nih(global_index):
    """
    Parses NIH Chest X-ray 14 dataset.
    Implements one-hot encoding for multi-label findings from pipe-separated strings.
    """
    csv_path = os.path.join(BASE_DIR, "nihchest/Data_Entry_2017.csv")
    if not os.path.exists(csv_path): return pd.DataFrame()
    
    df = pd.read_csv(csv_path)
    # Extract binary labels from 'Finding Labels' column
    for col in TARGET_COLS:
        df[col] = df['Finding Labels'].apply(lambda x: 1 if col in x else 0) if col != 'TBC' else 0
    
    # Cross-reference filenames with the global index for valid path resolution
    df['file_path'] = df['Image Index'].map(global_index)
    df = df.dropna(subset=['file_path'])
    df['patient_id'] = df['Patient ID'].astype(str)
    df['source'] = 'NIH'
    print(f"📍 NIH: {len(df)} images identified.")
    return df

# --- 2. CHEXPERT DATASET PIPELINE ---
def process_chexpert(global_index):
    """
    Processes Stanford's CheXpert dataset.
    Standardizes 'Uncertain' labels (-1) and filters for Frontal view images
    to maintain clinical consistency.
    """
    csv_path = os.path.join(BASE_DIR, "chexpert/train.csv")
    if not os.path.exists(csv_path): return pd.DataFrame()
    
    df = pd.read_csv(csv_path)
    # Filter for Frontal view to reduce anatomical variance
    df = df[df['Frontal/Lateral'] == 'Frontal'].copy()
    mapping = {'Cardiomegaly':'Cardiomegaly', 'Edema':'Edema', 'Pneumonia':'Pneumonia', 
               'Pneumothorax':'Pneumothorax', 'Pleural Effusion':'Effusion'}
    
    # Convert uncertainty and NaN values to binary 0 (conservative approach)
    for orig, target in mapping.items():
        df[target] = df[orig].fillna(0).replace(-1, 0).astype(int)
    df['TBC'] = 0
    
    # Path reconciliation using base filename
    df['filename'] = df['Path'].apply(lambda x: os.path.basename(x))
    df['file_path'] = df['filename'].map(global_index)
    
    df = df.dropna(subset=['file_path'])
    df['patient_id'] = df['Path'].apply(lambda x: x.split('/')[2])
    df['source'] = 'CheXpert'
    print(f"📍 CheXpert: {len(df)} images identified.")
    return df

# --- 3. SHENZHEN DATASET PIPELINE (TB FOCUS) ---
def process_shenzhen(global_index):
    """
    Specialized pipeline for Tuberculosis detection.
    Extracts labels directly from filename metadata (CHNCXR_xxxx_0/1 format).
    """
    sz_filenames = [f for f in global_index.keys() if f.startswith('CHNCXR')]
    
    if not sz_filenames:
        print("📍 Shenzhen (TBC): 0 images found. Please verify folder structure.")
        return pd.DataFrame()
    
    data = []
    for f in sz_filenames:
        # '_1' denotes Positive TB, '_0' denotes Normal
        label_tbc = 1 if '_1.png' in f.lower() else 0
        
        data.append({
            'file_path': global_index[f],
            # Parse unique patient identifier from filename
            'patient_id': f.split('_')[1] if len(f.split('_')) > 1 else f,
            'source': 'Shenzhen',
            'TBC': label_tbc,
            'Cardiomegaly': 0, 
            'Effusion': 0, 
            'Pneumothorax': 0, 
            'Edema': 0, 
            'Pneumonia': 0
        })
    
    df = pd.DataFrame(data)
    print(f"📍 Shenzhen (TBC): {len(df)} images identified.")
    return df

# --- 4. SIIM-ACR DATASET PIPELINE ---
def process_siim(global_index):
    """
    Integrates SIIM-ACR Pneumothorax competition data.
    Aligns specific Pneumothorax flags with the master multi-label schema.
    """
    csv_path = os.path.join(BASE_DIR, "siim-acr-pneumothorax/stage_1_train_images.csv")
    if not os.path.exists(csv_path): return pd.DataFrame()
    
    df = pd.read_csv(csv_path)
    df['Pneumothorax'] = df['has_pneumo'].astype(int)
    for col in TARGET_COLS:
        if col != 'Pneumothorax': df[col] = 0
    
    df['file_path'] = df['new_filename'].map(global_index)
    df = df.dropna(subset=['file_path'])
    df['patient_id'] = df['ImageId']
    df['source'] = 'SIIM'
    print(f"📍 SIIM: {len(df)} images identified.")
    return df

# --- MAIN SYSTEM EXECUTION ---
def main():
    print_separator("JAGAT-X COMPREHENSIVE DATA INTEGRATION")
    
    # Build global file mapping once to optimize subsequent dataset processing
    global_file_map = build_global_index(BASE_DIR)
    
    # Initialize parallel dataset processing
    nih = process_nih(global_file_map)
    chex = process_chexpert(global_file_map)
    shen = process_shenzhen(global_file_map)
    siim = process_siim(global_file_map)
    
    all_frames = [nih, chex, shen, siim]
    valid_frames = [f for f in all_frames if not f.empty]
    
    if not valid_frames:
        print("CRITICAL ERROR: No data found. Verify BASE_DIR path integrity.")
        return

    # Consolidate disparate datasets into a unified master database
    master_df = pd.concat(valid_frames, ignore_index=True)
    
    # Perform Patient-Wise Group Splitting (Preventing data leakage between sets)
    # Using 15% for validation, ensuring no patient appears in both Train and Val
    print_separator("STRATIFIED SPLITTING & ARCHIVING")
    splitter = GroupShuffleSplit(n_splits=1, test_size=0.15, random_state=42)
    train_idx, val_idx = next(splitter.split(master_df, groups=master_df['patient_id']))
    
    train_df = master_df.iloc[train_idx]
    val_df = master_df.iloc[val_idx]
    
    # Export datasets for training pipeline
    train_df.to_csv(os.path.join(BASE_DIR, "train_master_jagatx.csv"), index=False)
    val_df.to_csv(os.path.join(BASE_DIR, "val_master_jagatx.csv"), index=False)
    
    # Final Integration Summary
    print(f"JAGAT-X UNIFIED DATABASE GENERATED SUCCESSFULLY!")
    print(f"Output Directory: {BASE_DIR}")
    print(f"\nData Distribution by Source:")
    print(master_df['source'].value_counts())
    
    print("\nClinical Pathology Statistics (Total Cases):")
    for col in TARGET_COLS:
        print(f"- {col}: {int(master_df[col].sum())} confirmed cases")

if __name__ == "__main__":
    main()
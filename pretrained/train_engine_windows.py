import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
import pandas as pd
from PIL import Image
import os
import time
from tqdm import tqdm

# ==============================================================================
# 1. ARCHITECTURAL CONFIGURATION
# ==============================================================================
# Model parameters optimized for ResNet-50 on Apple Silicon M-Series architecture
IMG_SIZE = 224          # Input dimensions standardized for ImageNet-based weights
BATCH_SIZE = 32         # Computational throughput optimized for Unified Memory
EPOCHS = 10             # Training iterations for convergence
LEARNING_RATE = 1e-4    # Learning rate for medical-grade transfer learning
NUM_WORKERS = 4         # Multiprocessing workers for asynchronous data loading

# File System Path Integration
BASE_DIR = "/Users/joygabriel/Downloads/JAGAT-X/model"
TRAIN_CSV = os.path.join(BASE_DIR, "train_master_jagatx.csv")
VAL_CSV   = os.path.join(BASE_DIR, "val_master_jagatx.csv")
SAVE_PATH = os.path.join(BASE_DIR, "jagatx_resnet50_224.pth")

# Multi-label diagnostic target classes
TARGET_COLS = [
    "Cardiomegaly", "Effusion", "Pneumothorax", 
    "Edema", "Pneumonia", "TBC"
]

# ==============================================================================
# 2. HARDWARE ACCELERATION SETUP
# ==============================================================================
def get_device():
    """
    Evaluates system hardware for Metal Performance Shaders (MPS) support.
    Enables low-latency GPU acceleration on Apple Silicon.
    """
    if torch.backends.mps.is_available():
        print("[SYSTEM INFO] Hardware Accelerator: Apple Silicon GPU (MPS) active.")
        return torch.device("mps")
    else:
        print("[SYSTEM WARNING] MPS unavailable. Falling back to CPU execution.")
        return torch.device("cpu")

# ==============================================================================
# 3. CLINICAL DATA PIPELINE
# ==============================================================================
class JagatXDataset(Dataset):
    """
    Custom Dataset interface for multi-label pathology classification.
    Implements exception handling to maintain pipeline continuity.
    """
    def __init__(self, csv_file, transform=None):
        self.data = pd.read_csv(csv_file, low_memory=False)
        self.transform = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        row = self.data.iloc[idx]
        img_path = row["file_path"]

        try:
            image = Image.open(img_path).convert("RGB")
        except Exception:
            # Clinical safety fallback: return zero-matrix for corrupted images
            image = Image.new("RGB", (IMG_SIZE, IMG_SIZE))

        labels = torch.tensor(
            row[TARGET_COLS].values.astype("float32"),
            dtype=torch.float32
        )

        if self.transform:
            image = self.transform(image)

        return image, labels

# ==============================================================================
# 4. PRE-PROCESSING AND AUGMENTATION
# ==============================================================================
# Augmentation pipeline to enhance model generalizability across diverse scanners
train_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.1, contrast=0.1),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Validation protocol ensuring clinical data integrity
val_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# ==============================================================================
# 5. CORE EXECUTION ENGINE
# ==============================================================================
def train_one_epoch(model, loader, optimizer, criterion, device, epoch):
    """Executes a single forward/backward pass iteration."""
    model.train()
    running_loss = 0.0

    pbar = tqdm(loader, desc=f"Epoch {epoch+1}/{EPOCHS} | [TRAIN]")
    for images, labels in pbar:
        # Non-blocking memory transfer for optimized asynchronous GPU throughput
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, non_blocking=True)

        optimizer.zero_grad(set_to_none=True) # Optimized memory management
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        pbar.set_postfix(batch_loss=f"{loss.item():.4f}")

    return running_loss / len(loader)

def validate(model, loader, criterion, device, epoch):
    """Performs model evaluation on independent validation set."""
    model.eval()
    running_loss = 0.0

    with torch.no_grad(): # Disable autograd engine for inference efficiency
        pbar = tqdm(loader, desc=f"Epoch {epoch+1}/{EPOCHS} | [VAL  ]")
        for images, labels in pbar:
            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            outputs = model(images)
            loss = criterion(outputs, labels)
            running_loss += loss.item()

    return running_loss / len(loader)

# ==============================================================================
# 6. PIPELINE INTEGRATION
# ==============================================================================
def main():
    device = get_device()

    print("[STATUS] Loading Clinical Datasets...")
    train_dataset = JagatXDataset(TRAIN_CSV, train_transform)
    val_dataset   = JagatXDataset(VAL_CSV, val_transform)

    # DataLoader orchestration for Unix-based systems
    loader_params = {
        "batch_size": BATCH_SIZE,
        "num_workers": NUM_WORKERS,
        "pin_memory": False, # Set to False for MPS backends
        "persistent_workers": True,
        "prefetch_factor": 2
    }

    train_loader = DataLoader(train_dataset, shuffle=True, **loader_params)
    val_loader   = DataLoader(val_dataset, shuffle=False, **loader_params)

    print(f"        - Training Set Volume   : {len(train_dataset)}")
    print(f"        - Validation Set Volume : {len(val_dataset)}")

    print("[STATUS] Initializing ResNet-50 Neural Engine (Weights: IMAGENET1K_V2)...")
    model = models.resnet50(weights="IMAGENET1K_V2")
    
    # Redefine output layer for JAGAT-X multi-label pathology classification
    model.fc = nn.Linear(model.fc.in_features, len(TARGET_COLS))
    model.to(device)

    # Multi-label objective function using Binary Cross Entropy with Logits
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

    print("[STATUS] Initiating JAGAT-X Training Sequence...")
    start_time = time.time()

    for epoch in range(EPOCHS):
        train_loss = train_one_epoch(model, train_loader, optimizer, criterion, device, epoch)
        val_loss = validate(model, val_loader, criterion, device, epoch)

        print(f"[METRICS] Epoch {epoch+1} Complete | Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f}")

        # Sequential checkpointing to mitigate data loss risk
        torch.save(model.state_dict(), SAVE_PATH)

    elapsed = time.time() - start_time
    print(f"\n[FINISH] Training sequence concluded in {elapsed/60:.2f} minutes.")
    print(f"[FINISH] High-performance weights archived at: {SAVE_PATH}")

if __name__ == "__main__":
    main()
# JAGAT-X: Deep Learning-Based Multi-Label Chest X-Ray Triage System

## Project Overview
JAGAT-X is a computer-aided diagnostic (CAD) system developed to assist medical professionals in Emergency Department (ED) environments. The system utilizes a specialized ResNet-50 architecture to perform rapid multi-label classification of six critical thoracic pathologies, enabling automated triage and prioritization of high-risk patients.



## System Features
* **Multi-Label Diagnostic Engine**: Simultaneous detection of Cardiomegaly, Effusion, Pneumothorax, Edema, Pneumonia, and Tuberculosis (TBC).
* **Automated Triage Logic**: Risk-stratified categorization (Critical, Urgent, and Monitoring) based on detected clinical findings.
* **Hardware Acceleration**: Native optimization for Apple Silicon GPU via Metal Performance Shaders (MPS).
* **Data Integration**: Unified pipeline consolidating NIH, CheXpert, SIIM-ACR, and Shenzhen datasets.

## Directory Structure
The `pretrained` directory serves as the core repository for the model's intelligence and data registry:

* `build_master_dataset.py`: Handles global file indexing, label alignment, and stratified patient-wise data splitting.
* `train_engine.py`: The primary training pipeline optimized for high-throughput GPU execution on macOS.
* `jagatx_resnet50_224.pth`: The serialized neural network weights (Model State Dictionary).
* `train_master_jagatx.csv`: The master training manifest containing processed image paths and clinical labels.
* `val_master_jagatx.csv`: The independent validation manifest used for unbiased model performance metrics.



## Technical Specifications
### Model Architecture
The system is built upon the **ResNet-50 (Residual Network)** backbone, leveraging the **IMAGENET1K_V2** pre-trained weights for advanced feature extraction. The architecture has been modified with a custom fully connected head to facilitate 6-dimensional multi-label output.

### Training Configuration
| Parameter | Value |
| :--- | :--- |
| Input Resolution | 224 x 224 Pixels |
| Optimization Algorithm | Adam Optimizer |
| Loss Function | Binary Cross Entropy with Logits |
| Learning Rate | 1e-4 |
| Batch Size | 32 |

### Augmentation Strategy
To ensure clinical generalizability, the training pipeline implements:
* Random Horizontal Flipping
* Stochastic Rotation (10 degrees)
* Color Jittering (Brightness/Contrast adjustments)



## Operational Workflow
1. **Data Ingestion**: Digital radiographs are processed via the `build_master_dataset.py` pipeline.
2. **Neural Analysis**: The `train_engine.py` executes deep feature extraction and pathology scoring.
3. **Clinical Output**: The model generates probability scores which are then mapped to the following triage levels:
    * **RED (Critical)**: Pneumothorax, Edema.
    * **YELLOW (Urgent)**: Tuberculosis, Pneumonia.
    * **GREEN (Monitoring)**: Cardiomegaly, Pleural Effusion.

## Development Environment
* **Language**: Python 3.9+
* **Framework**: PyTorch
* **Hardware**: Apple Silicon (M3 Series)
* **Acceleration**: Metal Performance Shaders (MPS)
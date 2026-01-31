import torch
import torch.nn as nn
from torchvision import models, transforms
import cv2
import numpy as np
from PIL import Image
import base64
import io
from config import AppConfig

# --- [1] MODEL ARCHITECTURE & STATE LOADING ---

def load_jagatx_model():
    """
    Inisialisasi arsitektur ResNet-50 dan restorasi bobot (weights).
    Konfigurasi menyesuaikan output layer dengan jumlah label target pada AppConfig.
    """
    model = models.resnet50()
    # Modifikasi Fully Connected Layer sesuai dimensi output target
    model.fc = nn.Linear(model.fc.in_features, len(AppConfig.TARGET_LABELS))
    
    try:
        # Loading state dictionary dengan toleransi unpickling (weights_only=False)
        checkpoint = torch.load(
            AppConfig.MODEL_PATH, 
            map_location=AppConfig.DEVICE, 
            weights_only=False
        )
        
        # Ekstraksi state_dict baik dari format checkpoint maupun direct saving
        state_dict = checkpoint['model_state_dict'] if 'model_state_dict' in checkpoint else checkpoint
        model.load_state_dict(state_dict)
        
    except FileNotFoundError:
        raise RuntimeError(f"Critical: Model weight tidak ditemukan di {AppConfig.MODEL_PATH}")
    
    model.to(AppConfig.DEVICE)
    model.eval()
    return model

# Singleton instance untuk efisiensi resource memory
JAGATX_MODEL = load_jagatx_model()

# --- [2] PREPROCESSING PIPELINE ---

# Normalisasi data citra berbasis parameter standard ImageNet
IMG_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# --- [3] GRAD-CAM & INFERENCE CORE ---

def predict_and_gradcam(image_path: str):
    """
    Eksekusi inferensi diagnostik dan generasi heatmap Grad-CAM.
    Menggunakan teknik Hooking pada layer konvolusi terakhir untuk ekstraksi gradien.
    """
    # Pre-processing input
    original_img = Image.open(image_path).convert('RGB')
    input_tensor = IMG_TRANSFORM(original_img).unsqueeze(0).to(AppConfig.DEVICE)
    
    # Buffer untuk aktivasi fitur dan gradien backprop
    activations = {}
    gradients = {}

    def get_activations(name):
        def hook(model, input, output):
            activations[name] = output.detach()
        return hook

    def get_gradients(name):
        def hook(model, input, output):
            gradients[name] = output[0].detach()
        return hook

    # Hooking pada Residual Block terakhir (layer4) untuk analisis semantik
    target_layer = JAGATX_MODEL.layer4[-1]
    f_hook = target_layer.register_forward_hook(get_activations('target'))
    b_hook = target_layer.register_full_backward_hook(get_gradients('target'))

    # Forward Pass: Klasifikasi
    output = JAGATX_MODEL(input_tensor)
    probabilities = torch.sigmoid(output).squeeze()
    
    # Seleksi kelas dominan untuk visualisasi fokus AI
    top_class_idx = torch.argmax(probabilities).item()
    
    # Backward Pass: Kalkulasi gradien terhadap target kelas
    JAGATX_MODEL.zero_grad()
    output[0, top_class_idx].backward()

    # Algoritma Grad-CAM: Global Average Pooling pada gradien
    target_gradients = gradients['target']
    target_activations = activations['target']
    weights = torch.mean(target_gradients, dim=(2, 3), keepdim=True)
    
    # Generasi Heatmap via Linear Combination & ReLU
    gradcam_map = torch.sum(weights * target_activations, dim=1).squeeze()
    gradcam_map = np.maximum(gradcam_map.cpu().numpy(), 0) 
    
    if np.max(gradcam_map) != 0:
        gradcam_map = gradcam_map / np.max(gradcam_map)

    # --- [4] IMAGE RECONSTRUCTION & ENCODING ---

    # Rekonstruksi visualisasi untuk integrasi Dashboard (512px)
    img_cv = cv2.imread(image_path)
    img_cv = cv2.resize(img_cv, (512, 512))
    
    heatmap_resized = cv2.resize(gradcam_map, (512, 512))
    heatmap_uint8 = np.uint8(255 * heatmap_resized)
    heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    
    # Superimpose: Menggabungkan citra asli dengan heatmap (70:30 ratio)
    result_visual = cv2.addWeighted(img_cv, 0.7, heatmap_color, 0.3, 0)
    
    # Serialisasi hasil visual ke format Base64 (JSON Friendly)
    _, buffer = cv2.imencode('.jpg', result_visual)
    base64_result = base64.b64encode(buffer).decode('utf-8')

    # Memory Cleanup: Pelepasan hooks
    f_hook.remove()
    b_hook.remove()

    # Mapping probabilitas ke label target
    prediction_results = {
        AppConfig.TARGET_LABELS[i]: round(float(probabilities[i]), 4)
        for i in range(len(AppConfig.TARGET_LABELS))
    }

    return prediction_results, base64_result
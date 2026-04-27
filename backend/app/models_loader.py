import os
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from dotenv import load_dotenv
import torch

# Limit PyTorch threads to reduce memory overhead
torch.set_num_threads(1)

load_dotenv()
SENT_MODEL_DIR = os.environ.get("SENTIMENT_MODEL_DIR", "./models/distil_domain")

def load_sentiment_pipeline(model_dir=SENT_MODEL_DIR):
    if not os.path.exists(model_dir):
        print(f"[models_loader] sentiment model not found at {model_dir}. /analyze will fail.")
        return None
    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    model = AutoModelForSequenceClassification.from_pretrained(model_dir)
    
    # Quantize the model dynamically to save ~50% RAM
    model = torch.quantization.quantize_dynamic(
        model, {torch.nn.Linear}, dtype=torch.qint8
    )
    
    device = 0 if torch.cuda.is_available() else -1
    pipe = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer, device=device)
    print(f"[models_loader] Loaded (quantized) sentiment model from {model_dir} on {'cuda' if device==0 else 'cpu'}")
    return pipe

sentiment_pipeline = load_sentiment_pipeline()












# # backend/app/models_loader.py

# import os
# from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
# import joblib
# import torch

# class Models:
#     def __init__(
#         self,
#         baseline_path='models/baseline/model.joblib',
#         imdb_model_dir='models/distil_imdb',
#         domain_model_dir='models/distil_domain'
#     ):
#         self.device = 0 if torch.cuda.is_available() else -1
#         print(f"🖥️ Device Selected: {'CUDA ✅' if self.device == 0 else 'CPU ⚠️'}")

#         # ========== Load Baseline Model ==========
#         if os.path.exists(baseline_path):
#             self.baseline = joblib.load(baseline_path)
#             print(f"✅ Loaded Baseline Model from {baseline_path}")
#         else:
#             self.baseline = None
#             print(f"⚠️ Baseline model NOT FOUND at {baseline_path}")

#         # ========== Load Transformer Model ==========
#         model_dir_to_use = None
#         if os.path.exists(domain_model_dir):
#             model_dir_to_use = domain_model_dir
#             print(f"✅ Found Domain-Tuned DistilBERT Model at {domain_model_dir}")
#         elif os.path.exists(imdb_model_dir):
#             model_dir_to_use = imdb_model_dir
#             print(f"⚠️ Domain model missing, using IMDB fine-tuned model instead: {imdb_model_dir}")
#         else:
#             print("❌ No transformer models found at models/distil_domain or models/distil_imdb")
#             self.transformer = None
#             return

#         # Load Transformer pipeline
#         self.tokenizer = AutoTokenizer.from_pretrained(model_dir_to_use)
#         self.model = AutoModelForSequenceClassification.from_pretrained(model_dir_to_use)
#         self.transformer = pipeline(
#             'text-classification',
#             model=self.model,
#             tokenizer=self.tokenizer,
#             device=self.device
#         )
#         print(f"✅ Transformer model loaded from {model_dir_to_use}")

#     def predict(self, text: str):
#         out = {}

#         # Baseline
#         if self.baseline:
#             pred = self.baseline.predict([text])[0]
#             out['baseline_label'] = int(pred)
#         else:
#             out['baseline_label'] = None

#         # Transformer
#         if self.transformer:
#             res = self.transformer(text[:512])[0]
#             label_raw = res['label']
#             score = float(res.get('score', 0.0))

#             if label_raw.startswith('LABEL_'):
#                 label = int(label_raw.split('_')[-1])
#             elif label_raw.upper().startswith('POS'):
#                 label = 1
#             elif label_raw.upper().startswith('NEG'):
#                 label = 0
#             else:
#                 label = 1 if score > 0.5 else 0

#             out['transformer_label'] = int(label)
#             out['transformer_score'] = score
#         else:
#             out['transformer_label'] = None
#             out['transformer_score'] = None

#         return out

# # Global instance
# _models = None

# def get_models():
#     global _models
#     if _models is None:
#         _models = Models()
#     return _models

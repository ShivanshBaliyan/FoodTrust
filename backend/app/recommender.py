import os
import ast
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util
from app.db import SessionLocal, Store
import json
import torch

# Limit PyTorch threads to reduce memory overhead
torch.set_num_threads(1)

load_dotenv()
EMB_MODEL_NAME = os.environ.get("EMB_MODEL_NAME", "all-MiniLM-L6-v2")
SIMILARITY_THRESHOLD = float(os.environ.get("SIMILARITY_THRESHOLD", 0.30))
ALPHA = float(os.environ.get("RECOMMEND_ALPHA", 0.6))
BETA = float(os.environ.get("RECOMMEND_BETA", 0.4))

emb_model = SentenceTransformer(EMB_MODEL_NAME)

# Quantize the underlying transformer model to save RAM
emb_model[0].auto_model = torch.quantization.quantize_dynamic(
    emb_model[0].auto_model, {torch.nn.Linear}, dtype=torch.qint8
)

def compute_embedding(text):
    emb = emb_model.encode(text, convert_to_tensor=False)
    return emb.tolist()

def get_recommendations(query, top_k=5):
    session = SessionLocal()
    stores = session.query(Store).all()
    session.close()
    if not stores:
        return []

    q_emb = emb_model.encode(query, convert_to_tensor=True)

    results = []
    max_sim = 0.0
    for s in stores:
        if not s.embedding:
            continue
        try:
            emb = ast.literal_eval(s.embedding)
        except Exception:
            # fallback parsing
            emb = json.loads(s.embedding)
        # compute cosine similarity
        sim = float(util.cos_sim(q_emb, emb).item())
        if sim > max_sim:
            max_sim = sim
        sentiment = s.sentiment_score if s.sentiment_score is not None else 0.5
        final = ALPHA * sim + BETA * sentiment
        results.append({
            "name": s.name,
            "similarity": sim,
            "sentiment_score": sentiment,
            "score": final,
            "tags": s.tags,
            "description": s.description
        })

    if max_sim < SIMILARITY_THRESHOLD:
        return []   # handled by API as no-similarity case

    results_sorted = sorted(results, key=lambda x: x["score"], reverse=True)
    return results_sorted[:top_k]

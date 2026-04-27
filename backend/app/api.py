# backend/app/api.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models_loader import sentiment_pipeline
from app.recommender import get_recommendations, compute_embedding
from app.db import SessionLocal, Review, Store
import json

router = APIRouter()


# ---------- Input Schemas ----------
class TextIn(BaseModel):
    text: str

class RecommendIn(BaseModel):
    text: str
    top_k: int = 5

class ReviewIn(BaseModel):
    store_name: str
    text: str

class AddStoreIn(BaseModel):
    name: str
    tags: str = ""
    description: str = ""


# ---------- Sentiment Analysis ----------
@router.post("/analyze")
def analyze(payload: TextIn):
    """Analyze sentiment of a given text using fine-tuned model."""
    if sentiment_pipeline is None:
        raise HTTPException(status_code=500, detail="Sentiment model not loaded.")
    r = sentiment_pipeline(payload.text[:512])[0]
    return {"label": r.get('label'), "score": float(r.get('score', 0.0))}


# ---------- Recommendations ----------
@router.post("/recommend")
def recommend(payload: RecommendIn):
    """Recommend similar stores based on description similarity (cosine)."""
    results = get_recommendations(payload.text, top_k=payload.top_k)
    if not results:
        return {"message": "No similar stores found.", "results": []}
    return {"query": payload.text, "results": results}


# ---------- Feedback / Review Submission ----------
@router.post("/feedback")
def feedback(payload: ReviewIn):
    """
    User submits feedback for a store.
    - Sentiment of feedback is analyzed.
    - Stored in DB.
    - Store sentiment is re-calculated.
    """
    if sentiment_pipeline is None:
        raise HTTPException(status_code=500, detail="Sentiment model not loaded.")

    r = sentiment_pipeline(payload.text[:512])[0]
    label = r.get('label').lower()
    score = float(r.get('score', 0.0))

    db = SessionLocal()
    # save review
    new_rev = Review(store_name=payload.store_name.strip(), text=payload.text,
                     sentiment_label=label, sentiment_score=score)
    db.add(new_rev)
    db.commit()

    # update store average sentiment
    revs = db.query(Review).filter(Review.store_name.ilike(payload.store_name.strip())).all()
    if revs:
        avg = sum([rv.sentiment_score for rv in revs]) / len(revs)
    else:
        avg = 0.5

    store = db.query(Store).filter(Store.name.ilike(payload.store_name.strip())).first()
    if store:
        store.sentiment_score = float(avg)
        db.commit()

    db.close()
    return {"status": "ok", "label": label, "score": score}


# ---------- View All Reviews ----------
@router.get("/reviews")
def all_reviews():
    """Show all reviews in the database."""
    db = SessionLocal()
    revs = db.query(Review).all()
    db.close()
    return [{"store": r.store_name, "text": r.text, "label": r.sentiment_label, "score": r.sentiment_score} for r in revs]


# ---------- View Reviews for a Specific Store ----------
@router.get("/store_reviews/{store_name}")
def store_reviews(store_name: str):
    """Show reviews for a particular store."""
    db = SessionLocal()
    revs = db.query(Review).filter(Review.store_name.ilike(store_name.strip())).all()
    db.close()
    if not revs:
        return {"message": f"No reviews found for {store_name}"}
    return [{"text": r.text, "label": r.sentiment_label, "score": r.sentiment_score} for r in revs]


# ---------- Add New Store ----------
@router.post("/add_store")
def add_store(payload: AddStoreIn):
    """Add a new store with tags + description. Embedding is precomputed for search."""
    db = SessionLocal()
    text = f"{payload.name} {payload.tags} {payload.description}"
    emb = compute_embedding(text)
    s = db.query(Store).filter(Store.name == payload.name).first()
    if s:
        s.tags = payload.tags
        s.description = payload.description
        s.embedding = json.dumps(emb)
    else:
        s = Store(name=payload.name, tags=payload.tags,
                  description=payload.description,
                  embedding=json.dumps(emb), sentiment_score=0.5)
        db.add(s)
    db.commit()
    db.close()
    return {"status": "ok"}




















# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from app.models_loader import sentiment_pipeline
# from app.recommender import get_recommendations, compute_embedding
# from app.db import SessionLocal, Review, Store
# import json

# router = APIRouter()

# class TextIn(BaseModel):
#     text: str

# class RecommendIn(BaseModel):
#     text: str
#     top_k: int = 5

# class ReviewIn(BaseModel):
#     store_name: str
#     text: str

# class AddStoreIn(BaseModel):
#     name: str
#     tags: str = ""
#     description: str = ""

# @router.post("/analyze")
# def analyze(payload: TextIn):
#     if sentiment_pipeline is None:
#         raise HTTPException(status_code=500, detail="Sentiment model not loaded.")
#     r = sentiment_pipeline(payload.text[:512])[0]
#     return {"label": r.get('label'), "score": float(r.get('score', 0.0))}

# @router.post("/recommend")
# def recommend(payload: RecommendIn):
#     results = get_recommendations(payload.text, top_k=payload.top_k)
#     if not results:
#         return {"message": "No good matches found. Try rephrasing (example: 'healthy and affordable').", "results": []}
#     return {"query": payload.text, "results": results}

# @router.post("/ingest_review")
# def ingest_review(payload: ReviewIn):
#     if sentiment_pipeline is None:
#         raise HTTPException(status_code=500, detail="Sentiment model not loaded.")
#     r = sentiment_pipeline(payload.text[:512])[0]
#     label = r.get('label').lower()
#     score = float(r.get('score', 0.0))

#     db = SessionLocal()
#     new_rev = Review(store_name=payload.store_name.strip(), text=payload.text, sentiment_label=label, sentiment_score=score)
#     db.add(new_rev)
#     db.commit()

#     # recompute store sentiment average
#     revs = db.query(Review).filter(Review.store_name.ilike(payload.store_name.strip())).all()
#     if revs:
#         avg = sum([rv.sentiment_score for rv in revs]) / len(revs)
#     else:
#         avg = 0.5
#     store = db.query(Store).filter(Store.name.ilike(payload.store_name.strip())).first()
#     if store:
#         store.sentiment_score = float(avg)
#         db.commit()
#     db.close()
#     return {"status": "ok", "label": label, "score": score}

# @router.post("/add_store")
# def add_store(payload: AddStoreIn):
#     db = SessionLocal()
#     # compute embedding
#     text = f"{payload.name} {payload.tags} {payload.description}"
#     emb = compute_embedding(text)
#     s = db.query(Store).filter(Store.name == payload.name).first()
#     if s:
#         s.tags = payload.tags
#         s.description = payload.description
#         s.embedding = json.dumps(emb)
#     else:
#         s = Store(name=payload.name, tags=payload.tags, description=payload.description, embedding=json.dumps(emb), sentiment_score=0.5)
#         db.add(s)
#     db.commit()
#     db.close()
#     return {"status": "ok"}







# # backend/app/api.py
# from fastapi import APIRouter
# from pydantic import BaseModel
# from .models_loader import get_models

# router = APIRouter()
# models = get_models()


# class TextIn(BaseModel):
#     text: str


# @router.post('/analyze')
# async def analyze(payload: TextIn):
#     text = payload.text
#     res = models.predict(text)
#     # add a readable mapping
#     mapping = {0: 'negative', 1: 'positive'}
#     return {
#         'text': text,
#         'baseline': mapping.get(res['baseline_label']) if res['baseline_label'] is not None else None,
#         'transformer': mapping.get(res['transformer_label']) if res['transformer_label'] is not None else None,
#         'transformer_score': res['transformer_score']
#     }

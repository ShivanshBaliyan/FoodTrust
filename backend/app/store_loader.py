import os
import pandas as pd
import json
from app.db import init_db, SessionLocal, Store, Review
from app.recommender import compute_embedding
from app.models_loader import sentiment_pipeline

def load_stores_from_csv(csv_path="data/stores.csv", reviews_csv="data/reviews.csv"):
    init_db()
    df = pd.read_csv(csv_path)
    rev_df = None
    try:
        rev_df = pd.read_csv(reviews_csv)
    except Exception:
        rev_df = None

    db = SessionLocal()
    for _, row in df.iterrows():
        name = str(row['name']).strip()
        tags = str(row.get('tags', '')).strip()
        desc = str(row.get('description', '')).strip()
        emb_text = f"{name} {tags} {desc}"
        emb = compute_embedding(emb_text)
        sentiment_score = 0.5

        if rev_df is not None:
            reviews_for_store = rev_df[rev_df['store_name'].str.strip().str.lower() == name.lower()]
            scores = []
            if sentiment_pipeline is not None and len(reviews_for_store) > 0:
                for t in reviews_for_store['text'].tolist():
                    try:
                        r = sentiment_pipeline(t[:512])[0]
                        label = r.get('label', '').lower()
                        score = float(r.get('score', 0.5))
                        if 'neg' in label or label.startswith('label_0'):
                            scores.append(1 - score)  # convert somewhat negative -> lower
                        else:
                            scores.append(score)
                    except Exception:
                        continue
            if len(scores) > 0:
                sentiment_score = float(sum(scores) / len(scores))

        existing = db.query(Store).filter(Store.name == name).first()
        if existing:
            existing.tags = tags
            existing.description = desc
            existing.embedding = json.dumps(emb)
            existing.sentiment_score = sentiment_score
        else:
            s = Store(name=name, tags=tags, description=desc, embedding=json.dumps(emb), sentiment_score=sentiment_score)
            db.add(s)
    db.commit()
    db.close()
    print("[store_loader] Stores loaded/updated.")

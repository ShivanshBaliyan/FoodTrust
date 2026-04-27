# baseline/train_baseline.py
from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
import joblib
from utils.helper import ensure_dir, set_seed_all


def train_baseline(out_path="models/baseline/model.joblib"):
    set_seed_all()
    ensure_dir("models/baseline")
    print("Loading IMDB dataset...")
    ds = load_dataset("imdb")

    X_train = ds["train"]["text"]
    y_train = ds["train"]["label"]
    X_test = ds["test"]["text"]
    y_test = ds["test"]["label"]

    print("Training TF-IDF + LogisticRegression...")
    pipe = Pipeline([
        ("tfidf", TfidfVectorizer(max_features=30000, ngram_range=(1,2))),
        ("clf", LogisticRegression(max_iter=300))
    ])

    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Baseline test accuracy: {acc:.4f}")
    print(classification_report(y_test, preds))

    joblib.dump(pipe, out_path)
    print(f"Saved baseline model to {out_path}")


if __name__ == '__main__':
    train_baseline()

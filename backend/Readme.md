# 🧠 Sentiment-Based Store Recommender

A FastAPI + React system that analyzes reviews, stores feedback, and recommends similar stores using fine-tuned transformer models and cosine similarity.

---

## 🚀 Project Overview

### Workflow:
1. **Fine-tuned Sentiment Model**
   - Trained on IMDB → fine-tuned on Yelp.
   - Used to classify sentiment (positive/negative) and score intensity.

2. **Database**
   - Stores info about each store (name, tags, description, embedding, average sentiment).
   - Stores user feedbacks with sentiment results.

3. **Recommendation System**
   - Converts store descriptions and user queries into embeddings.
   - Uses **cosine similarity** to find closest stores.
   - Combines similarity and sentiment scores:
     \[
     \text{final\_score} = 0.6 \times \text{similarity} + 0.4 \times \text{sentiment}
     \]

4. **Frontend**
   - Tailwind-styled React interface to:
     - Analyze sentiment
     - Add new stores
     - Give feedback
     - Get recommendations

---

## 🧩 Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| `POST` | `/analyze` | Analyze sentiment of a text. |
| `POST` | `/add_store` | Add a new store or update an existing one. |
| `POST` | `/feedback` | Submit feedback for a store (auto-analyzes and updates sentiment). |
| `POST` | `/recommend` | Get similar stores based on query text. |
| `GET` | `/reviews` | Show all reviews. |
| `GET` | `/store_reviews/{store}` | Show reviews for a particular store. |

---

## ⚙️ Setup & Run (Local)

### 1️⃣ Clone
```bash
git clone <repo-url>
cd sentiment-recommender


### Backend
cd backend
python -m venv venv
source venv/bin/activate   # on Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

### Frontend
cd frontend
npm install
npm run dev

### Docker
docker-compose up --build



## Working:
** 🧮 How Store Sentiment Works**
Each feedback is scored (e.g., 0.85 → positive, 0.25 → negative).
Average sentiment = mean of all scores for that store.
Default for new store = 0.5 (neutral).

** 🔍 How Recommendations Work**
Text → converted into embedding.
Compared with all store embeddings using cosine similarity.
Final ranking = 0.6 * similarity + 0.4 * sentiment.

** ✨ Example Flow**
Add stores via /add_store or admin panel.
Add reviews or feedbacks using /feedback.
Query /recommend to get personalized store suggestions.








python -c "from app.store_loader import load_stores_from_csv; load_stores_from_csv('data/stores.csv','data/reviews.csv')"


📚 Notes
The initial sentiment scores are computed from data/reviews.csv.
User feedback directly updates store sentiment and can improve recommendation accuracy.
from fastapi import FastAPI
from app.api import router
from app.db import init_db
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="VibeLens Backend")

@app.on_event("startup")
def startup():
    init_db()

app.include_router(router, prefix="/api")




# # backend/app/main.py
# from fastapi import FastAPI
# from .api import router as api_router
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI(title='Sentiment API')
# app.include_router(api_router, prefix='/api')

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=['*'],
#     allow_credentials=True,
#     allow_methods=['*'],
#     allow_headers=['*'],
# )

@app.get('/')
async def root():
    return {'message': 'Sentiment API running'}

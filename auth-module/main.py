# main.py
from fastapi import FastAPI
from auth.routes import router
from auth.db import init_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Модуль авторизации")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Модуль авторизации работает. См. /docs"}
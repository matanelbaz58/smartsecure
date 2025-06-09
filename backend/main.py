from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas

from joblib import load
import numpy as np

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app runs on port 3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load("../ml_model/rf_traffic_model.joblib")  # load once

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "SmartSecure API is running"}

@app.post("/packets/", response_model=schemas.PacketOut)
def submit_packet(packet: schemas.PacketCreate, db: Session = Depends(get_db)):
    features = np.array([[packet.duration, packet.protocol_type, packet.src_bytes, packet.dst_bytes]])
    is_attack = bool(model.predict(features)[0])

    db_packet = models.Packet(**packet.dict(), is_attack=is_attack)
    db.add(db_packet)
    db.commit()
    db.refresh(db_packet)
    return db_packet

@app.get("/alerts/", response_model=list[schemas.PacketOut])
def get_attacks(db: Session = Depends(get_db)):
    return db.query(models.Packet).filter(models.Packet.is_attack == True).all()

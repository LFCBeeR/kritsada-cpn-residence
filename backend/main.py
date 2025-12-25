from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select, delete

from backend.db import engine, get_db, SessionLocal
from backend.models import Base, Favorite, User, Property
from backend.schemas import PropertyOut, FavoritesOut, UserOut
from backend.seed_db import seed_if_empty

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()

    yield

app = FastAPI(title="Property Favorites API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _ensure_user_id(user_id: str):
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="Missing user_id")

def _ensure_user_exists(db: Session, user_id: str):
    row = db.execute(select(User.username).where(User.username == user_id)).first()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")

def _ensure_property_exists(db: Session, property_id: int):
    row = db.execute(select(Property.id).where(Property.id == property_id)).first()
    if not row:
        raise HTTPException(status_code=404, detail="Property not found")

@app.get("/api/health")
def health():
    return {"ok": True}

@app.get("/api/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    try:
        rows = db.execute(select(User).order_by(User.username)).scalars().all()
        return [{"username": r.username} for r in rows]
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")

@app.get("/api/properties", response_model=list[PropertyOut])
def list_properties(db: Session = Depends(get_db)):
    try:
        rows = db.execute(select(Property).order_by(Property.id)).scalars().all()
        return rows
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")

@app.get("/api/users/{user_id}/favorites", response_model=FavoritesOut)
def get_favorites(user_id: str, db: Session = Depends(get_db)):
    _ensure_user_id(user_id)
    _ensure_user_exists(db, user_id)

    try:
        rows = db.execute(
            select(Favorite.property_id).where(Favorite.username == user_id)
        ).all()
        fav_ids = [r[0] for r in rows]
        return {"user_id": user_id, "favorites": fav_ids}
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")

@app.post("/api/users/{user_id}/favorites/{property_id}", response_model=FavoritesOut)
def favorite_property(user_id: str, property_id: int, db: Session = Depends(get_db)):
    _ensure_user_id(user_id)
    _ensure_user_exists(db, user_id)
    _ensure_property_exists(db, property_id)

    try:
        exists = db.execute(
            select(Favorite.id).where(
                Favorite.username == user_id,
                Favorite.property_id == property_id
            )
        ).first()

        if not exists:
            db.add(Favorite(username=user_id, property_id=property_id))
            db.commit()

        return get_favorites(user_id, db)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")

@app.delete("/api/users/{user_id}/favorites/{property_id}", response_model=FavoritesOut)
def unfavorite_property(user_id: str, property_id: int, db: Session = Depends(get_db)):
    _ensure_user_id(user_id)
    _ensure_user_exists(db, user_id)
    _ensure_property_exists(db, property_id)

    try:
        db.execute(
            delete(Favorite).where(
                Favorite.username == user_id,
                Favorite.property_id == property_id
            )
        )
        db.commit()
        return get_favorites(user_id, db)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")
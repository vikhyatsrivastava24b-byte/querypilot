from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models
from pydantic import BaseModel

router = APIRouter()

# Simple schemas for project creation
class ProjectCreate(BaseModel):
    title: str

class ProjectResponse(BaseModel):
    id: int
    title: str
    class Config:
        from_attributes = True

@router.post("/", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    # For now, create a dummy user if none exists (since auth isn't fully wired)
    user = db.query(models.User).first()
    if not user:
        user = models.User(email="demo@example.com", password_hash="hash")
        db.add(user)
        db.commit()
        db.refresh(user)

    db_project = models.Project(title=project.title, user_id=user.id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()


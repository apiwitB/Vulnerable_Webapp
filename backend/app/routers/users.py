from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

# VULNERABILITY: IDOR (Insecure Direct Object Reference)
# Any logged in user can view any other user's profile by ID
@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Vulnerable because we don't check if current_user.id == user_id
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# VULNERABILITY: Mass Assignment + IDOR
# Any logged in user can update any user's profile, including their role!
@router.put("/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # VULNERABILITY: IDOR - no check if current_user.id == user_id
    
    # VULNERABILITY: Mass Assignment
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value) # This allows updating 'role' directly!
        
    db.commit()
    db.refresh(user)
    return user

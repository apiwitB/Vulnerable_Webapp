from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)

# VULNERABILITY: Broken Access Control via Header Manipulation
# An attacker can just send `X-Admin: true` to bypass the role check
def verify_admin(x_admin: Optional[str] = Header(None), current_user: models.User = Depends(auth.get_current_user)):
    if x_admin == "true":
        return True
    
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    return True

@router.get("/users", response_model=List[schemas.User])
def get_all_users(db: Session = Depends(get_db), is_admin: bool = Depends(verify_admin)):
    users = db.query(models.User).all()
    return users

@router.put("/users/{user_id}/role", response_model=schemas.User)
def change_user_role(user_id: int, role: str, db: Session = Depends(get_db), is_admin: bool = Depends(verify_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.role = role
    db.commit()
    db.refresh(user)
    return user

@router.get("/orders", response_model=List[schemas.Order])
def get_all_orders(db: Session = Depends(get_db), is_admin: bool = Depends(verify_admin)):
    orders = db.query(models.Order).all()
    return orders

@router.delete("/products/{product_id}")
def delete_product_admin(product_id: int, db: Session = Depends(get_db), is_admin: bool = Depends(verify_admin)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully by admin"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(
    prefix="/api/cart",
    tags=["Cart"]
)

@router.get("/", response_model=List[schemas.CartItem])
def get_cart(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()
    return cart_items

@router.post("/", response_model=schemas.CartItem)
def add_to_cart(item: schemas.CartItemCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Check if product exists
    product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Check if already in cart
    cart_item = db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id, models.CartItem.product_id == item.product_id).first()
    if cart_item:
        cart_item.quantity += item.quantity
    else:
        cart_item = models.CartItem(
            user_id=current_user.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(cart_item)
        
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.put("/{item_id}", response_model=schemas.CartItem)
def update_cart_item(item_id: int, item_update: schemas.CartItemUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    cart_item = db.query(models.CartItem).filter(models.CartItem.id == item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    # VULNERABILITY: IDOR (Insecure Direct Object Reference)
    # We do NOT check if cart_item.user_id == current_user.id
    # A user can update another user's cart item
    
    cart_item.quantity = item_update.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    cart_item = db.query(models.CartItem).filter(models.CartItem.id == item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    # VULNERABILITY: IDOR
    # We do NOT check if cart_item.user_id == current_user.id
    
    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart"}

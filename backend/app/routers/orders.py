from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)

@router.post("/", response_model=schemas.Order)
def create_order(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Get user's cart
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    # Calculate total
    total = sum(item.product.price * item.quantity for item in cart_items)
    
    # Create order
    order = models.Order(user_id=current_user.id, total=total)
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Create order items and clear cart
    for cart_item in cart_items:
        order_item = models.OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
        db.add(order_item)
        db.delete(cart_item)
        
    db.commit()
    db.refresh(order)
    return order

@router.get("/", response_model=List[schemas.Order])
def get_orders(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # This one correctly gets only the user's orders
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    return orders

@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    # VULNERABILITY: IDOR
    # We do NOT check if order.user_id == current_user.id
    # Anyone can view anyone else's order details if they know the ID
    
    return order

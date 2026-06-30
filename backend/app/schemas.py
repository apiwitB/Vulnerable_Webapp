from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

# Vulnerable: Allows Mass Assignment on role and avatar_url
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    avatar_url: Optional[str] = None

class User(UserBase):
    id: int
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None

class Product(ProductBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        orm_mode = True

# --- Cart Schemas ---
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItem(CartItemBase):
    id: int
    user_id: int
    product: Product

    class Config:
        orm_mode = True

# --- Order Schemas ---
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    product: Product

    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    total: float
    status: str = "pending"

class Order(OrderBase):
    id: int
    user_id: int
    created_at: datetime
    items: List[OrderItem] = []

    class Config:
        orm_mode = True

# --- Post and Comment Schemas ---
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: int

class Comment(CommentBase):
    id: int
    post_id: int
    user_id: int
    created_at: datetime
    user: User

    class Config:
        orm_mode = True

class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    user_id: int
    created_at: datetime
    user: User
    comments: List[Comment] = []

    class Config:
        orm_mode = True

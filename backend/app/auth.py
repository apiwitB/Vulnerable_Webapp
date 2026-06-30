import jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.database import get_db
from sqlalchemy.orm import Session
from app import models
import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

# VULNERABILITY: Weak JWT Secret and algorithm (Loaded from .env)
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_md5_hash(password: str) -> str:
    # VULNERABILITY: MD5 is insecure for hashing passwords
    return hashlib.md5(password.encode()).hexdigest()

def create_access_token(data: dict):
    to_encode = data.copy()
    # VULNERABILITY: Not setting an expiration date makes the token valid forever
    # expire = datetime.utcnow() + timedelta(minutes=15)
    # to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # VULNERABILITY: Verification logic is often skipped or poorly implemented in weak auth
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

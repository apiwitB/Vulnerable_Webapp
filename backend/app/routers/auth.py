from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db, get_raw_connection
from app import models, schemas, auth

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # VULNERABILITY: Use MD5 for password hashing
    hashed_password = auth.get_md5_hash(user.password)
    
    new_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Note: We don't use OAuth2PasswordRequestForm strictly here so we can accept JSON body for easier hacking,
# or we can use form data. Let's use a Pydantic schema for login body for clarity in API, 
# although OAuth2PasswordRequestForm is standard for swagger. Let's stick to standard so Swagger works easily.
from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_raw_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()
    
    hashed_password = auth.get_md5_hash(form_data.password)
    username = form_data.username

    # VULNERABILITY: SQL Injection in login
    # Query is directly concatenated
    query = f"SELECT * FROM users WHERE username = '{username}' AND password_hash = '{hashed_password}'"
    
    print(f"Executing Query: {query}") # Helpful for hackers to see in logs
    
    try:
        cursor.execute(query)
        user_record = cursor.fetchone()
    except Exception as e:
        # VULNERABILITY: Information disclosure via error message
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cursor.close()
        conn.close()

    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate JWT
    access_token = auth.create_access_token(data={"sub": user_record['username']})
    return {"access_token": access_token, "token_type": "bearer"}

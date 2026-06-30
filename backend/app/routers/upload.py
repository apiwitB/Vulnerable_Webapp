import os
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, auth

router = APIRouter(
    prefix="/api/upload",
    tags=["Upload"]
)

# VULNERABILITY: Path Traversal & Insecure File Upload
# 1. No extension check (can upload .php, .html)
# 2. Uses user-provided filename directly without sanitization (e.g. ../../../etc/passwd)
@router.post("/avatar")
def upload_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    UPLOAD_DIR = "static/uploads"
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
        
    # VULNERABILITY: Path Traversal
    # file.filename could be "../../../bad_file.txt"
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            # Read and write in chunks just in case it's large
            buffer.write(file.file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")
        
    # Update user avatar URL
    avatar_url = f"/{file_path}"
    
    # We update the user in DB
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    user.avatar_url = avatar_url
    db.commit()
    
    return {"message": "Avatar uploaded successfully", "avatar_url": avatar_url}

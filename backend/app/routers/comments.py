from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(
    prefix="/api/comments",
    tags=["Comments"]
)

# VULNERABILITY: CSRF - No CSRF token is required or checked for this endpoint
@router.post("/", response_model=schemas.Comment)
def create_comment(comment: schemas.CommentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # VULNERABILITY: Stored XSS
    # Content is not sanitized. An attacker can submit <script>alert(1)</script>
    new_comment = models.Comment(
        post_id=comment.post_id,
        user_id=current_user.id,
        content=comment.content
    )
    
    # Check if post exists
    post = db.query(models.Post).filter(models.Post.id == comment.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
        
    # VULNERABILITY: IDOR / Broken Access Control
    # Anyone can delete any comment
    
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}

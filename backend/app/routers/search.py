from fastapi import APIRouter, HTTPException
from app.database import get_raw_connection
from typing import List, Dict, Any

router = APIRouter(
    prefix="/api/search",
    tags=["Search"]
)

@router.get("/")
def search_products(q: str = ""):
    conn = get_raw_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()
    
    # VULNERABILITY: SQL Injection
    # Example attack: q=a' UNION SELECT id, username, email, password_hash, role, avatar_url, NULL FROM users--
    query = f"SELECT id, name, description, price, stock, image_url FROM products WHERE name LIKE '%{q}%' OR description LIKE '%{q}%'"
    
    print(f"Executing Search Query: {query}")
    
    try:
        cursor.execute(query)
        results = cursor.fetchall()
    except Exception as e:
        # VULNERABILITY: Information disclosure via error message
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cursor.close()
        conn.close()

    return {"query": q, "results": results}

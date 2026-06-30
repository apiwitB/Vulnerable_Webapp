import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/fetch",
    tags=["Fetch"]
)

class URLRequest(BaseModel):
    url: str

# VULNERABILITY: Server-Side Request Forgery (SSRF)
# The server will blindly make a GET request to the provided URL
# without checking if it's pointing to localhost, internal network (169.254.169.254, 10.x.x.x, etc.)
@router.post("/")
def fetch_url(payload: URLRequest):
    try:
        # VULNERABLE: No validation of URL scheme or host
        response = requests.get(payload.url, timeout=5)
        # Only return the first 500 characters to simulate a "preview"
        content = response.text[:500]
        return {"url": payload.url, "status_code": response.status_code, "preview": content}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {str(e)}")

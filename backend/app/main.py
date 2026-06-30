from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, products, search, cart, orders, posts, comments, upload, fetch, admin

app = FastAPI(
    title="shadowMarketplace",
    description="A very vulnerable API",
    debug=True, # VULNERABILITY: Debug mode enabled, traceback on error
    # VULNERABILITY: Swagger and Redoc are enabled by default and exposed
)

# เปิด CORS ให้ React ที่รันคนละ Port คุยกับ Backend ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Vulnerable FastAPI Backend"}

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(search.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(upload.router)
app.include_router(fetch.router)
app.include_router(admin.router)
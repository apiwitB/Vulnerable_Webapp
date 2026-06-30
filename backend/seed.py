import hashlib
from app.database import engine, SessionLocal, Base
from app.models import User, Product, Post, Comment

def get_md5_hash(password: str) -> str:
    return hashlib.md5(password.encode()).hexdigest()

def seed_data():
    # Create tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if users exist
        if db.query(User).first():
            print("Database already seeded. Skipping.")
            return

        print("Seeding Users...")
        admin = User(
            username="admin", 
            email="admin@shadowmarket.com", 
            password_hash=get_md5_hash("admin123"), 
            role="admin",
            avatar_url="/static/avatars/admin.png"
        )
        user1 = User(
            username="hacker01", 
            email="hacker01@example.com", 
            password_hash=get_md5_hash("password"), 
            role="user",
            avatar_url="/static/avatars/hacker.png"
        )
        user2 = User(
            username="noob", 
            email="noob@example.com", 
            password_hash=get_md5_hash("123456"), 
            role="user"
        )
        db.add_all([admin, user1, user2])
        db.commit()

        print("Seeding Products...")
        products = [
            Product(name="WiFi Pineapple", description="Rogue AP and WiFi auditing tool", price=99.99, stock=10, created_by=admin.id),
            Product(name="Rubber Ducky", description="USB keystroke injection tool", price=49.99, stock=50, created_by=admin.id),
            Product(name="Lockpick Set", description="Beginner lockpick set with clear padlock", price=29.99, stock=100, created_by=admin.id),
            Product(name="Flipper Zero", description="Multi-tool for hardware geeks", price=169.00, stock=5, created_by=admin.id),
            Product(name="Raspberry Pi 4", description="Mini computer for various projects", price=89.00, stock=20, created_by=admin.id)
        ]
        db.add_all(products)
        db.commit()

        print("Seeding Posts & Comments...")
        post = Post(title="Welcome to shadowMarketplace", content="Have fun testing this vulnerable app!", user_id=admin.id)
        db.add(post)
        db.commit()

        comment = Comment(post_id=post.id, user_id=user1.id, content="First! Can't wait to find bugs.")
        db.add(comment)
        db.commit()

        print("Seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()

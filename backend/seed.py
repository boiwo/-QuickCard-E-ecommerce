from app import app
from models import db, Category, Product, User, CartItem
from werkzeug.security import generate_password_hash

# -----------------------------
# PRODUCT DATA (CLEAN + WORKING IMAGE LINKS)
# -----------------------------
products = [
    {
        "name": "MacBook Air M2",
        "price": 1199.99,
        "stock": 10,
        "description": "Apple MacBook Air M2 with 13-inch Retina Display and long battery life.",
        "category": "Laptops",
        "image_url": "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        "name": "Dell XPS 13",
        "price": 1099.99,
        "stock": 8,
        "description": "Dell XPS 13 Ultrabook with InfinityEdge Display and sleek aluminum design.",
        "category": "Laptops",
        "image_url": "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        "name": "iPhone 15 Pro",
        "price": 999.99,
        "stock": 20,
        "description": "Apple iPhone 15 Pro with A17 chip and advanced camera system.",
        "category": "Phones",
        "image_url": "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        "name": "Samsung Galaxy S24",
        "price": 899.99,
        "stock": 15,
        "description": "Samsung Galaxy S24 with AI-enhanced photography and AMOLED display.",
        "category": "Phones",
        "image_url": "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        "name": "Sony WH-1000XM5",
        "price": 399.99,
        "stock": 25,
        "description": "Sony Wireless Noise Cancelling Headphones with immersive sound.",
        "category": "Accessories",
        "image_url": "https://images.pexels.com/photos/3394655/pexels-photo-3394655.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        "name": "Apple Watch Series 9",
        "price": 499.99,
        "stock": 18,
        "description": "Apple Watch Series 9 with S9 chip and advanced fitness tracking.",
        "category": "Accessories",
        "image_url": "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
]

# -----------------------------
# SEED SCRIPT
# -----------------------------
with app.app_context():
    print("🔄 Resetting database...")
    db.drop_all()
    db.create_all()

    # Add categories dynamically
    categories = {}
    for p in products:
        cat_name = p["category"]
        if cat_name not in categories:
            cat = Category(name=cat_name)
            db.session.add(cat)
            db.session.flush()
            categories[cat_name] = cat

    db.session.commit()

    # Add products
    for item in products:
        p = Product(
            name=item["name"],
            description=item["description"],
            price=item["price"],
            stock=item["stock"],
            image_url=item["image_url"],
            rating=4.8,
            category_id=categories[item["category"]].id,
        )
        db.session.add(p)
    db.session.commit()

    # Add demo user
    demo_user = User(
        name="Demo User",
        email="demo@example.com",
        password_hash=generate_password_hash("password"),
    )
    db.session.add(demo_user)
    db.session.commit()

    # Add a sample cart item
    first_product = Product.query.first()
    if first_product:
        cart_item = CartItem(user_id=demo_user.id, product_id=first_product.id, quantity=1)
        db.session.add(cart_item)
        db.session.commit()

    print("✅ Seeded database successfully with working images!")

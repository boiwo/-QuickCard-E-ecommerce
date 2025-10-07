# seed.py
import random
from app import app
from models import db, Category, Product, User, CartItem
from werkzeug.security import generate_password_hash

# ✅ Sample categories
sample_categories = ["Laptops", "Phones", "Accessories"]

# ✅ Random sample data
laptop_names = ["MacBook Air", "MacBook Pro", "Dell XPS 13", "HP Spectre", "Lenovo ThinkPad"]
phone_names = ["iPhone 15", "Samsung Galaxy S24", "Google Pixel 8", "OnePlus 12", "Xiaomi 14"]
accessory_names = ["Wireless Mouse", "Mechanical Keyboard", "Bluetooth Headphones", "USB-C Hub", "Portable SSD"]

image_urls = {
    "Laptops": "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    "Phones": "https://images.pexels.com/photos/5077046/pexels-photo-5077046.jpeg",
    "Accessories": "https://images.pexels.com/photos/38316/mouse-computer-technology-wireless-38316.jpeg",
}

def random_price(category):
    if category == "Laptops":
        return round(random.uniform(800, 2000), 2)
    elif category == "Phones":
        return round(random.uniform(400, 1500), 2)
    else:
        return round(random.uniform(10, 200), 2)

def random_stock():
    return random.randint(3, 20)

def random_rating():
    return round(random.uniform(3.5, 5.0), 1)

with app.app_context():
    print("🔄 Resetting database...")
    db.drop_all()
    db.create_all()

    # ✅ Create categories dynamically
    categories = {}
    for name in sample_categories:
        cat = Category(name=name)
        db.session.add(cat)
        categories[name] = cat
    db.session.commit()

    # ✅ Create 20 products dynamically
    all_products = (
        [(n, "Laptops") for n in laptop_names] +
        [(n, "Phones") for n in phone_names] +
        [(n, "Accessories") for n in accessory_names]
    )

    # Duplicate some products to reach ~20 items
    while len(all_products) < 20:
        all_products.append(random.choice(all_products))

    for name, category in all_products:
        product = Product(
            name=name,
            description=f"{name} - High-quality {category.lower()} with modern features.",
            price=random_price(category),
            stock=random_stock(),
            image_url=image_urls[category],
            rating=random_rating(),
            category_id=categories[category].id,
        )
        db.session.add(product)
    db.session.commit()

    # ✅ Demo user
    demo = User(name="Demo User", email="demo@example.com", password_hash=generate_password_hash("password"))
    db.session.add(demo)
    db.session.commit()

    # ✅ Add 1 product to demo cart
    first_product = Product.query.first()
    if first_product:
        ci = CartItem(user_id=demo.id, product_id=first_product.id, quantity=1)
        db.session.add(ci)
        db.session.commit()

    print("✅ Seeded 20 products, 3 categories, and 1 demo user (demo@example.com / password)")

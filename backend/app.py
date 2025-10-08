from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Product, Category, CartItem
import os

app = Flask(__name__)
CORS(app)

# ------------------------------
# DATABASE CONFIGURATION
# ------------------------------
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", "sqlite:///quickcart.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# ------------------------------
# HOME ROUTE
# ------------------------------
@app.route("/")
def home():
    return jsonify({"message": "Welcome to QuickCart API!"})

# ------------------------------
# FEATURED PRODUCTS
# ------------------------------
@app.route("/api/featured-products", methods=["GET"])
def get_featured_products():
    featured = db.session.query(Product).filter(Product.featured == True).all()
    return jsonify([p.to_dict() for p in featured]), 200

# Optional route to mark product as featured
@app.route("/api/products/<int:product_id>/feature", methods=["PUT"])
def mark_product_featured(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    product.featured = True
    db.session.commit()
    return jsonify({"message": f"Product '{product.name}' is now featured."}), 200

# ------------------------------
# PRODUCTS CRUD
# ------------------------------
@app.route("/api/products", methods=["GET"])
def get_products():
    query = db.session.query(Product)

    # Filters
    category = request.args.get("category")
    min_price = request.args.get("minPrice", type=float)
    max_price = request.args.get("maxPrice", type=float)
    min_rating = request.args.get("minRating", type=float)
    search = request.args.get("search")
    sort_by = request.args.get("sortBy", "name")

    if category:
        query = query.join(Category).filter(Category.name.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if min_rating is not None:
        query = query.filter(Product.rating >= min_rating)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    # Sorting
    if sort_by == "price-low":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price-high":
        query = query.order_by(Product.price.desc())
    elif sort_by == "rating":
        query = query.order_by(Product.rating.desc())
    else:
        query = query.order_by(Product.name.asc())

    # Pagination
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 12, type=int)
    paginated = query.paginate(page=page, per_page=limit, error_out=False)

    products = [p.to_dict() for p in paginated.items]

    return jsonify({
        "products": products,
        "page": page,
        "total": paginated.total,
        "pages": paginated.pages,
        "has_more": paginated.has_next
    })

@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product.to_dict())

@app.route("/api/products", methods=["POST"])
def create_product():
    data = request.get_json()
    new_product = Product(
        name=data.get("name"),
        description=data.get("description"),
        price=data.get("price"),
        stock=data.get("stock", 0),
        image_url=data.get("image_url"),
        category_id=data.get("category_id"),
        rating=data.get("rating", 0.0),
        featured=data.get("featured", False),
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

@app.route("/api/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.get_json()
    for key, value in data.items():
        if hasattr(product, key):
            setattr(product, key, value)

    db.session.commit()
    return jsonify(product.to_dict()), 200

@app.route("/api/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200

# ------------------------------
# COMBINED PRODUCTS ROUTE
# ------------------------------
@app.route("/api/all-products", methods=["GET"])
def get_all_products_combined():
    featured_products = db.session.query(Product).filter(Product.featured == True).all()
    featured_list = [p.to_dict() for p in featured_products]

    query = db.session.query(Product)

    # Filters
    category = request.args.get("category")
    min_price = request.args.get("minPrice", type=float)
    max_price = request.args.get("maxPrice", type=float)
    min_rating = request.args.get("minRating", type=float)
    search = request.args.get("search")
    sort_by = request.args.get("sortBy", "name")

    if category:
        query = query.join(Category).filter(Category.name.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if min_rating is not None:
        query = query.filter(Product.rating >= min_rating)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    # Sorting
    if sort_by == "price-low":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price-high":
        query = query.order_by(Product.price.desc())
    elif sort_by == "rating":
        query = query.order_by(Product.rating.desc())
    else:
        query = query.order_by(Product.name.asc())

    # Pagination
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 12, type=int)
    paginated = query.paginate(page=page, per_page=limit, error_out=False)
    shop_list = [p.to_dict() for p in paginated.items]

    return jsonify({
        "featured_products": featured_list,
        "all_products": shop_list,
        "shop_page": page,
        "shop_total": paginated.total,
        "shop_pages": paginated.pages,
        "shop_has_more": paginated.has_next
    }), 200

# ------------------------------
# CATEGORIES CRUD
# ------------------------------
@app.route("/api/categories", methods=["GET"])
def get_categories():
    categories = db.session.query(Category).all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories])

@app.route("/api/categories", methods=["POST"])
def create_category():
    data = request.get_json()
    new_category = Category(name=data["name"])
    db.session.add(new_category)
    db.session.commit()
    return jsonify({"id": new_category.id, "name": new_category.name}), 201

# ------------------------------
# CART CRUD
# ------------------------------
@app.route("/api/cart", methods=["GET"])
def get_cart_items():
    items = db.session.query(CartItem).all()
    return jsonify([item.to_dict() for item in items])

@app.route("/api/cart", methods=["POST"])
def add_to_cart():
    data = request.get_json()
    new_item = CartItem(
        user_id=data["user_id"],
        product_id=data["product_id"],
        quantity=data.get("quantity", 1)
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route("/api/cart/<int:item_id>", methods=["DELETE"])
def remove_cart_item(item_id):
    item = db.session.get(CartItem, item_id)
    if not item:
        return jsonify({"error": "Cart item not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed from cart"}), 200

# ------------------------------
# RUN SERVER
# ------------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)

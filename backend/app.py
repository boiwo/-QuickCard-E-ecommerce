from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Product, Category, User, CartItem
import os

app = Flask(__name__)
CORS(app)

# ------------------------------
# DATABASE CONFIGURATION
# ------------------------------
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///quickcart.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# ------------------------------
# ROUTES
# ------------------------------

@app.route("/")
def home():
    return jsonify({"message": "Welcome to QuickCart API!"})

# ------------------------------
# PRODUCTS CRUD
# ------------------------------

@app.route("/api/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200


@app.route("/api/products", methods=["POST"])
def create_product():
    data = request.get_json()
    new_product = Product(
        name=data.get("name"),
        description=data.get("description"),
        price=data.get("price"),
        stock=data.get("stock"),
        image_url=data.get("image_url"),
        category_id=data.get("category_id")
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201


@app.route("/api/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    product.name = data.get("name", product.name)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.stock = data.get("stock", product.stock)
    product.image_url = data.get("image_url", product.image_url)
    db.session.commit()
    return jsonify(product.to_dict()), 200


@app.route("/api/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200

# ------------------------------
# CATEGORIES CRUD
# ------------------------------

@app.route("/api/categories", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories])


@app.route("/api/categories", methods=["POST"])
def create_category():
    data = request.get_json()
    new_category = Category(name=data["name"])
    db.session.add(new_category)
    db.session.commit()
    return jsonify({"id": new_category.id, "name": new_category.name}), 201

# ------------------------------
# CART ITEMS (Basic CRUD)
# ------------------------------

@app.route("/api/cart", methods=["GET"])
def get_cart_items():
    items = CartItem.query.all()
    return jsonify([item.to_dict() for item in items]), 200


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
    item = CartItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed from cart"}), 200


# ------------------------------
# RUN APP
# ------------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)


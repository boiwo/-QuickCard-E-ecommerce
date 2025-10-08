// src/pages/Cart.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { user } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    loading,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to proceed to checkout.');
      navigate("/login?redirect=/checkout");
      return;
    }
    // Only navigate to checkout if cart is not empty
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      alert('Your cart is empty. Add products before checking out.');
      navigate('/shop');
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  // ✅ Safety: Ensure cartItems is an array
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-content" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div className="cart-items" style={{ flex: '2 1 400px', minWidth: '320px' }}>
            {cartItems.map((item) => {
              const product = item.products || item;
              const imageUrl = Array.isArray(product.images)
                ? product.images[0]
                : product.image_url || "https://via.placeholder.com/150";

              return (
                <div key={product.id} className="cart-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '1.5rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to={`/product/${product.slug || product.id}`} className="item-image">
                      <img src={imageUrl} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    </Link>
                    <div>
                      <Link to={`/product/${product.slug || product.id}`} className="item-name" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2d3748' }}>
                        {product.name}
                      </Link>
                      <p className="item-description" style={{ color: '#4a5568', fontSize: '0.95rem', margin: '0.25rem 0' }}>
                        {product.short_description || product.description}
                      </p>
                      <p className="item-price" style={{ fontWeight: 'bold', color: '#3182ce', fontSize: '1.1rem' }}>
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="item-quantity" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#2d3748' }}>Quantity:</span>
                    <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => updateQuantity(product.id, item.quantity - 1)}
                        style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#edf2f7', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                        min="1"
                        max={product.stock}
                        style={{ width: '40px', textAlign: 'center', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                      />
                      <button
                        onClick={() => updateQuantity(product.id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                        style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#edf2f7', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#3182ce', marginLeft: 'auto' }}>${(product.price * item.quantity).toFixed(2)}</span>
                  </div>

                  <button
                    className="btn-remove"
                    onClick={() => removeFromCart(product.id)}
                    style={{ marginTop: '0.5rem', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary" style={{ flex: '1 1 320px', minWidth: '280px', background: '#f7fafc', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '2rem', marginLeft: 'auto', marginTop: '0' }}>
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary btn-large" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <Link to="/shop" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


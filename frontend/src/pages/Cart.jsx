import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
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

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => {
              const images = Array.isArray(item.products.images) ? item.products.images : [];
              const imageUrl = images.length > 0 ? images[0] : 'https://via.placeholder.com/100';

              return (
                <div key={item.id} className="cart-item">
                  <Link to={`/product/${item.products.slug}`} className="item-image">
                    <img src={imageUrl} alt={item.products.name} />
                  </Link>

                  <div className="item-details">
                    <Link to={`/product/${item.products.slug}`} className="item-name">
                      {item.products.name}
                    </Link>
                    <p className="item-description">{item.products.short_description}</p>
                    <p className="item-price">${parseFloat(item.products.price).toFixed(2)}</p>
                  </div>

                  <div className="item-quantity">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        min="1"
                        max={item.products.stock}
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.products.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <p className="item-total-price">
                      ${(parseFloat(item.products.price) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="btn-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>

            {subtotal < 50 && (
              <p className="shipping-notice">
                Add ${(50 - subtotal).toFixed(2)} more to get free shipping!
              </p>
            )}

            <div className="summary-row summary-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary btn-large"
              onClick={handleCheckout}
            >
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

export default Cart;

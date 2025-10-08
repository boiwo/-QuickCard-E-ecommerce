import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate required fields
    for (const key of ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country']) {
      if (!formData[key]) {
        alert('Please fill in all required fields.');
        return;
      }
    }

    setProcessing(true);

    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 10;
    const total = subtotal + shipping;

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: total,
        status: 'pending',
        shipping_address: formData
      })
      .select()
      .single();

    if (orderError) {
      alert('Failed to create order. Please try again.');
      setProcessing(false);
      return;
    }

    // Support both item.products and item for price
    const orderItems = cartItems.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products?.price || item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      alert('Failed to create order items. Please try again.');
      setProcessing(false);
      return;
    }

    await clearCart();

    alert('Order placed successfully!');
    navigate(`/order-confirmation/${orderData.id}`);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/shop')} className="btn btn-primary">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            <div className="checkout-main">
              <section className="checkout-section">
                <h2>Shipping Information</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="checkout-section">
                <h2>Payment Method</h2>

                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💳 Credit/Debit Card</span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>PayPal</span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💵 Cash on Delivery</span>
                  </label>
                </div>

                <p className="payment-note">
                  This is a demo. No actual payment will be processed.
                </p>
              </section>
            </div>

            <div className="checkout-sidebar">
              <div className="order-summary">
                <h2>Order Summary</h2>

                <div className="summary-items">
                  {cartItems.map((item) => {
                    const name = item.products?.name || item.name;
                    const price = item.products?.price || item.price;
                    return (
                      <div key={item.id} className="summary-item">
                        <span className="item-name">
                          {name} × {item.quantity}
                        </span>
                        <span className="item-price">
                          ${(parseFloat(price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="summary-row summary-total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;



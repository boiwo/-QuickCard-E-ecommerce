import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (orderData) {
      setOrder(orderData);

      const { data: itemsData } = await supabase
        .from('order_items')
        .select(`
          *,
          products (*)
        `)
        .eq('order_id', orderId);

      if (itemsData) {
        setOrderItems(itemsData);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>Order not found</h2>
          <Link to="/orders" className="btn btn-primary">View My Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order. Your order has been successfully placed.</p>
          <p className="order-id">Order ID: <strong>{order.id}</strong></p>
        </div>

        <div className="confirmation-content">
          <section className="confirmation-section">
            <h2>Order Details</h2>
            <div className="order-info">
              <div className="info-row">
                <span className="label">Order Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <span className="label">Status:</span>
                <span className="status-badge">{order.status}</span>
              </div>
              <div className="info-row">
                <span className="label">Total Amount:</span>
                <span className="total-amount">${parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section className="confirmation-section">
            <h2>Shipping Address</h2>
            <div className="shipping-address">
              <p>{order.shipping_address.fullName}</p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
              </p>
              <p>{order.shipping_address.country}</p>
              <p>Phone: {order.shipping_address.phone}</p>
              <p>Email: {order.shipping_address.email}</p>
            </div>
          </section>

          <section className="confirmation-section">
            <h2>Order Items</h2>
            <div className="order-items">
              {orderItems.map((item) => {
                const images = Array.isArray(item.products.images) ? item.products.images : [];
                const imageUrl = images.length > 0 ? images[0] : 'https://via.placeholder.com/100';

                return (
                  <div key={item.id} className="order-item">
                    <img src={imageUrl} alt={item.products.name} />
                    <div className="item-details">
                      <h3>{item.products.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">
                        ${parseFloat(item.price).toFixed(2)} each
                      </p>
                    </div>
                    <div className="item-total">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="confirmation-actions">
          <Link to="/orders" className="btn btn-primary">
            View All Orders
          </Link>
          <Link to="/shop" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

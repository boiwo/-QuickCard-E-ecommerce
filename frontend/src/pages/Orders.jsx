import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);

    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="container">
        <div className="auth-required">
          <h2>Please login to view your orders</h2>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container">
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Start shopping to place your first order!</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id.substring(0, 8)}</h3>
                  <p className="order-date">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                  <p className="order-total">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="order-items">
                {order.order_items.map((item) => {
                  const images = Array.isArray(item.products.images) ? item.products.images : [];
                  const imageUrl = images.length > 0 ? images[0] : 'https://via.placeholder.com/80';

                  return (
                    <div key={item.id} className="order-item">
                      <img src={imageUrl} alt={item.products.name} />
                      <div className="item-info">
                        <Link to={`/product/${item.products.slug}`} className="item-name">
                          {item.products.name}
                        </Link>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="order-actions">
                <Link
                  to={`/order-confirmation/${order.id}`}
                  className="btn btn-secondary btn-small"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;

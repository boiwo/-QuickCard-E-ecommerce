
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlist, loading } = useWishlist(); // renamed to match context

  if (!user) {
    return (
      <div className="container">
        <div className="auth-required">
          <h2>Please login to view your wishlist</h2>
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
        <p>Loading wishlist...</p>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container">
        <div className="empty-wishlist">
          <div className="empty-icon">💝</div>
          <h2>Your wishlist is empty</h2>
          <p>Save your favorite items to your wishlist!</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1>My Wishlist</h1>
        <p className="wishlist-count">
          {wishlist.length} item{wishlist.length !== 1 ? 's' : ''}
        </p>

        <div className="products-grid">
          {wishlist.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

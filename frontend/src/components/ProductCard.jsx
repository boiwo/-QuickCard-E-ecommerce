import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const imageUrl = product.image_url || 'https://via.placeholder.com/300';

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image">
          <img src={imageUrl} alt={product.name} loading="lazy" />
          <button
            className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlistToggle}
          >
            {inWishlist ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <div className="price">${parseFloat(product.price).toFixed(2)}</div>
          <div>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
        </div>
      </Link>

      <button
        className="btn btn-primary"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;


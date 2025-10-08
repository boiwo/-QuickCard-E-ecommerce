import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://127.0.0.1:5001/api'
    : 'https://quickcard-e-ecommerce-2.onrender.com/api';


const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    search: '',
    sortBy: 'name',
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const [cartMessage, setCartMessage] = useState('');

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch products when filters or page changes
  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });
    params.append('page', page);
    params.append('limit', 12);

    try {
      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      const data = await res.json();

      const fetchedProducts = Array.isArray(data)
        ? data
        : data.products || [];

      if (page === 1) {
        setProducts(fetchedProducts);
      } else {
        setProducts((prev) => [...prev, ...fetchedProducts]);
      }

      setHasMore(data.has_more ?? false);
    } catch (err) {
      console.error('Error fetching products:', err);
    }

    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      search: '',
      sortBy: 'name',
    });
    setPage(1);
  };

  const loadMore = () => setPage((prev) => prev + 1);

  // Add to cart handler for Shop page
  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    setCartMessage('Product added to cart!');
    setTimeout(() => setCartMessage(''), 2000);
  };

  return (
    <div className="shop-page">
      <div className="container">
        <h1 className="shop-title" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', color: '#2d3748' }}>Shop All Products</h1>

        {/* Cart message notification */}
        {cartMessage && (
          <div className="cart-message success" style={{ background: '#38a169', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{cartMessage}</div>
        )}

        {/* Filter Section */}
        <div className="shop-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', background: '#f7fafc', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e0', minWidth: '200px', fontSize: '1rem' }}
          />

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e0', width: '120px', fontSize: '1rem' }}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e0', width: '120px', fontSize: '1rem' }}
          />

          <select
            value={filters.minRating}
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
          >
            <option value="">Any Rating</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
            <option value="1">1+ stars</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
          >
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>

          <button onClick={clearFilters} style={{ padding: '0.5rem 1.5rem', borderRadius: '6px', background: '#3182ce', color: '#fff', fontWeight: 'bold', border: 'none', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 1px 4px rgba(49,130,206,0.08)' }}>Clear All Filters</button>
        </div>

        {/* Products */}
        {loading && page === 1 ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>

            {hasMore && (
              <button onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;

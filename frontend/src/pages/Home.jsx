import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://127.0.0.1:5000/api"; // Flask backend base URL

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      // Fetch featured products and categories simultaneously
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/categories`),
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      // Show only 8 featured items (you can change logic as needed)
      const featured = productsData.filter((p) => p.featured).slice(0, 8);

      setFeaturedProducts(featured);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  // Hero carousel slides
  const slides = [
    {
      title: "Summer Sale",
      subtitle: "Up to 50% off on selected items",
      cta: "Shop Now",
      link: "/shop",
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "New Arrivals",
      subtitle: "Discover the latest trends",
      cta: "Explore",
      link: "/shop",
      bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Free Shipping",
      subtitle: "On orders over $50",
      cta: "Learn More",
      link: "/shop",
      bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{ background: slide.bg }}
            >
              <div className="container">
                <div className="hero-content">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <Link to={slide.link} className="btn btn-primary btn-large">
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.name}`}
                className="category-card"
              >
                <div className="category-image">
                  <img
                    src={category.image_url || "https://via.placeholder.com/200"}
                    alt={category.name}
                  />
                </div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/shop" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No featured products found.</p>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>24/7 Support</h3>
              <p>Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


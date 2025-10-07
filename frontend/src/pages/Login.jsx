import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const { error } = await signUp(formData.email, formData.password);

      if (error) {
        setError(error.message);
      } else {
        alert('Account created successfully! You can now login.');
        setIsSignUp(false);
        setFormData({ ...formData, password: '', confirmPassword: '' });
      }
    } else {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        setError(error.message);
      } else {
        const redirect = searchParams.get('redirect') || '/';
        navigate(redirect);
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-card">
            <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="login-subtitle">
              {isSignUp ? 'Sign up to start shopping' : 'Sign in to your account'}
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setFormData({ email: '', password: '', confirmPassword: '' });
                  }}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials:</p>
              <p>Email: demo@example.com</p>
              <p>Password: demo123</p>
              <p className="demo-note">
                (You can also create your own account)
              </p>
            </div>
          </div>

          <div className="login-features">
            <h2>Why Shop With Us?</h2>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <h3>Wide Selection</h3>
                  <p>Thousands of products to choose from</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <h3>Secure Shopping</h3>
                  <p>Your data is safe with us</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <h3>Fast Delivery</h3>
                  <p>Quick and reliable shipping</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <h3>Easy Returns</h3>
                  <p>30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

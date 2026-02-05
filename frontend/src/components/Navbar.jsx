import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCartStore, useAuthStore } from '../store/store';
import './Navbar.css';

function Navbar() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <h1>Spice Hub</h1>
            <p>Indian Cuisine</p>
          </Link>

          <ul className="navbar-menu">
            <li><Link to="/home">HOME</Link></li>
            <li><Link to="/menu">MENU</Link></li>
            <li><Link to="/tablereservation">TABLE BOOKING</Link></li>
            <li><Link to="/blog">BLOG</Link></li>
            <li><Link to="/feedback">FEEDBACK</Link></li>
            <li><Link to="/contact">CONTACT</Link></li>
            {isAdmin && <li><Link to="/admin" className="admin-link">🔐 ADMIN</Link></li>}
          </ul>

          <div className="navbar-actions">
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="user-menu">
                <FaUser />
                <span>{user?.username}</span>
                <button onClick={logout} className="btn-logout">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-nav">LOGIN</Link>
                <Link to="/register" className="btn-nav">REGISTER</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

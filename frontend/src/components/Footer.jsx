import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SPICE HUB</h3>
            <p>Indian Cuisine</p>
            <p>32 Avenue Road</p>
            <p>WS10 8AR</p>
            <div className="footer-contact">
              <p><FaPhone /> +44 121 568 8629</p>
              <p><FaEnvelope /> spicehub32@gmail.com</p>
            </div>
          </div>

          <div className="footer-section">
            <h3>OPENING HOURS</h3>
            <div className="opening-hours">
              <p><strong>Sunday:</strong> 17:00 - TILL LATE</p>
              <p><strong>Monday:</strong> CLOSED</p>
              <p><strong>Tuesday:</strong> 17:00 - TILL LATE</p>
              <p><strong>Wednesday:</strong> 17:00 - TILL LATE</p>
              <p><strong>Thursday:</strong> 17:00 - TILL LATE</p>
              <p><strong>Friday:</strong> 17:00 - TILL LATE</p>
              <p><strong>Saturday:</strong> 17:00 - TILL LATE</p>
            </div>
          </div>

          <div className="footer-section">
            <h3>QUICK LINKS</h3>
            <ul className="footer-links">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/tablereservation">Table Booking</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>FOLLOW US</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61556830421941" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            </div>
            <div className="payment-cards">
              <h4>ALL CREDIT CARDS ACCEPTED</h4>
              <p>Visa • Mastercard • Amex • PayPal</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 SPICE HUB - INDIAN CUISINE. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

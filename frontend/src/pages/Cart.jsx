import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useCartStore } from '../store/store';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Your Cart</h1>
          <div className="empty-cart">
            <p>Your shopping cart is empty!</p>
            <button onClick={() => navigate('/menu')} className="btn">
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Your Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={`${item.id}-${item.portionType}`} className="cart-item">
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-portion">{item.portionType}</p>
                </div>
                
                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item.id, item.portionType, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.portionType, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-price">
                  £{(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button
                  className="btn-remove"
                  onClick={() => removeItem(item.id, item.portionType)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>£{getTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>£{getTotal().toFixed(2)}</span>
            </div>
            <button className="btn btn-checkout" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

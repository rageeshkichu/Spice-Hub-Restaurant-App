import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../services/api';
import { useCartStore } from '../store/store';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [orderType, setOrderType] = useState('delivery');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    delivery_postcode: '',
    notes: '',
  });

  const deliveryFee = orderType === 'delivery' ? 2.50 : 0;
  const subtotal = getTotal();
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        order_type: orderType,
        ...formData,
        subtotal: subtotal.toFixed(2),
        delivery_fee: deliveryFee.toFixed(2),
        total: total.toFixed(2),
        items: items.map((item) => ({
          menu_item: item.id,
          portion_type: item.portionType,
          quantity: item.quantity,
          price: item.price.toFixed(2),
        })),
      };

      const response = await createOrder(orderData);
      toast.success(`Order placed successfully! Order number: ${response.data.order_number}`);
      clearCart();
      navigate('/');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            <div className="checkout-details">
              <div className="order-type">
                <h2>Order Type</h2>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="delivery"
                      checked={orderType === 'delivery'}
                      onChange={(e) => setOrderType(e.target.value)}
                    />
                    Delivery
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="collection"
                      checked={orderType === 'collection'}
                      onChange={(e) => setOrderType(e.target.value)}
                    />
                    Collection
                  </label>
                </div>
              </div>

              <div className="customer-details">
                <h2>Your Details</h2>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {orderType === 'delivery' && (
                <div className="delivery-details">
                  <h2>Delivery Address</h2>
                  <div className="form-group">
                    <label>Address *</label>
                    <textarea
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={handleChange}
                      required
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Postcode *</label>
                    <input
                      type="text"
                      name="delivery_postcode"
                      value={formData.delivery_postcode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="order-notes">
                <h2>Additional Notes</h2>
                <div className="form-group">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions..."
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-items">
                {items.map((item) => (
                  <div key={`${item.id}-${item.portionType}`} className="summary-item">
                    <div>
                      <p className="item-name">{item.name}</p>
                      <p className="item-meta">
                        {item.portionType} × {item.quantity}
                      </p>
                    </div>
                    <p className="item-total">£{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="summary-row">
                    <span>Delivery Fee:</span>
                    <span>£{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-submit" disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;

import { useState } from 'react';
import { toast } from 'react-toastify';
import { createReservation } from '../services/api';
import './TableReservation.css';

function TableReservation() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    reservation_date: '',
    reservation_time: '',
    number_of_guests: 2,
    special_requests: '',
  });

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
      await createReservation(formData);
      toast.success('Reservation submitted successfully! We will confirm shortly.');
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        reservation_date: '',
        reservation_time: '',
        number_of_guests: 2,
        special_requests: '',
      });
    } catch (error) {
      toast.error('Failed to submit reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reservation-page">
      <div className="reservation-header">
        <h1>MAKE A RESERVATION</h1>
        <p>Book your table at Spice Hub</p>
      </div>

      <div className="container">
        <div className="reservation-content">
          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-row">
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
            </div>

            <div className="form-row">
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
              <div className="form-group">
                <label>Number of Guests *</label>
                <select
                  name="number_of_guests"
                  value={formData.number_of_guests}
                  onChange={handleChange}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="reservation_date"
                  value={formData.reservation_date}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="reservation_time"
                  value={formData.reservation_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Special Requests</label>
              <textarea
                name="special_requests"
                value={formData.special_requests}
                onChange={handleChange}
                rows="4"
                placeholder="Any special requests or dietary requirements..."
              />
            </div>

            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? 'Reserving...' : 'RESERVE NOW'}
            </button>
          </form>

          <div className="reservation-info">
            <div className="info-card">
              <h3>Opening Hours</h3>
              <div className="hours-list">
                <p><strong>Sunday:</strong> 17:00 - TILL LATE</p>
                <p><strong>Monday:</strong> CLOSED</p>
                <p><strong>Tuesday:</strong> 17:00 - TILL LATE</p>
                <p><strong>Wednesday:</strong> 17:00 - TILL LATE</p>
                <p><strong>Thursday:</strong> 17:00 - TILL LATE</p>
                <p><strong>Friday:</strong> 17:00 - TILL LATE</p>
                <p><strong>Saturday:</strong> 17:00 - TILL LATE</p>
              </div>
            </div>

            <div className="info-card">
              <h3>Contact Us</h3>
              <p><strong>Address:</strong></p>
              <p>32 Avenue Road, WS10 8AR</p>
              <p><strong>Phone:</strong></p>
              <p>+44 121 568 8629</p>
              <p><strong>Email:</strong></p>
              <p>spicehub32@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableReservation;

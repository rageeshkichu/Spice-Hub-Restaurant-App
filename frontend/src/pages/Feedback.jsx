import { useState } from 'react';
import { toast } from 'react-toastify';
import { createFeedback } from '../services/api';
import { FaStar } from 'react-icons/fa';
import './Feedback.css';

function Feedback() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 5,
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRating = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createFeedback(formData);
      toast.success('Thank you for your feedback!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        rating: 5,
        message: '',
      });
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h1>Feedback</h1>
        <p>We value your opinion</p>
      </div>

      <div className="container">
        <div className="feedback-content">
          <div className="feedback-intro">
            <h2>Share Your Experience</h2>
            <p>
              Your feedback helps us improve our service and provide you with the best dining experience.
              Please take a moment to share your thoughts with us.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Rating *</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={star <= formData.rating ? 'star active' : 'star'}
                    onClick={() => handleRating(star)}
                  />
                ))}
                <span className="rating-text">{formData.rating} out of 5</span>
              </div>
            </div>

            <div className="form-group">
              <label>Your Feedback *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Tell us about your experience..."
                required
              />
            </div>

            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Feedback;

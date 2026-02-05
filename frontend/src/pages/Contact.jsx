import { useState } from 'react';
import { toast } from 'react-toastify';
import { createContactMessage } from '../services/api';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Contact.css';

function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
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
      await createContactMessage(formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <div className="icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3>Address</h3>
                <p>Spice Hub - Indian Cuisine</p>
                <p>32 Avenue Road</p>
                <p>WS10 8AR</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">
                <FaPhone />
              </div>
              <div>
                <h3>Phone</h3>
                <p>+44 121 568 8629</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">
                <FaEnvelope />
              </div>
              <div>
                <h3>Email</h3>
                <p>spicehub32@gmail.com</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <h2>Send us a Message</h2>
            
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

            <div className="form-row">
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
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;

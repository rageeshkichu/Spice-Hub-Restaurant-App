import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getRestaurantSettings, updateRestaurantSettings } from '../../services/adminApi';
import { getContactMessages } from '../../services/adminApi';

function AdminSettingsManager() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState(null);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postcode: '',
    phone: '',
    email: '',
    delivery_fee: 0,
    minimum_order: 0,
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    is_accepting_orders: true,
    is_accepting_reservations: true,
  });

  useEffect(() => {
    if (activeSection === 'general') {
      fetchSettings();
    } else if (activeSection === 'messages') {
      fetchContactMessages();
    }
  }, [activeSection]);

  const fetchSettings = async () => {
    try {
      const response = await getRestaurantSettings();
      if (response.data.results && response.data.results.length > 0) {
        const setting = response.data.results[0];
        setSettings(setting);
        setFormData({
          name: setting.name,
          address: setting.address,
          postcode: setting.postcode,
          phone: setting.phone,
          email: setting.email,
          delivery_fee: setting.delivery_fee,
          minimum_order: setting.minimum_order,
          facebook_url: setting.facebook_url,
          instagram_url: setting.instagram_url,
          twitter_url: setting.twitter_url,
          is_accepting_orders: setting.is_accepting_orders,
          is_accepting_reservations: setting.is_accepting_reservations,
        });
      }
    } catch (error) {
      toast.error('Failed to fetch settings');
    }
  };

  const fetchContactMessages = async () => {
    try {
      const response = await getContactMessages();
      setContactMessages(response.data.results || []);
    } catch (error) {
      toast.error('Failed to fetch contact messages');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (settings) {
        await updateRestaurantSettings(settings.id, formData);
        toast.success('Settings updated successfully');
        fetchSettings();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-subsection-tabs">
        <button
          className={`subsection-tab ${activeSection === 'general' ? 'active' : ''}`}
          onClick={() => setActiveSection('general')}
        >
          General Settings
        </button>
        <button
          className={`subsection-tab ${activeSection === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveSection('messages')}
        >
          Contact Messages
        </button>
      </div>

      {activeSection === 'general' && (
        <div className="subsection">
          <h3>Restaurant Settings</h3>

          {settings ? (
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Restaurant Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Postcode *</label>
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="2"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Delivery Fee (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.delivery_fee}
                    onChange={(e) => setFormData({ ...formData, delivery_fee: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Order (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimum_order}
                    onChange={(e) => setFormData({ ...formData, minimum_order: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <h4>Social Media</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Facebook URL</label>
                  <input
                    type="url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="form-group">
                  <label>Instagram URL</label>
                  <input
                    type="url"
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Twitter URL</label>
                  <input
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>

              <h4>Order & Reservations</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_accepting_orders}
                      onChange={(e) => setFormData({ ...formData, is_accepting_orders: e.target.checked })}
                    />
                    Accepting Orders
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_accepting_reservations}
                      onChange={(e) => setFormData({ ...formData, is_accepting_reservations: e.target.checked })}
                    />
                    Accepting Reservations
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          ) : (
            <p className="empty-state">No settings found. Create one from admin panel.</p>
          )}
        </div>
      )}

      {activeSection === 'messages' && (
        <div className="subsection">
          <h3>Contact Form Messages</h3>

          {contactMessages.length === 0 ? (
            <p className="empty-state">No contact messages yet</p>
          ) : (
            <div className="messages-grid">
              {(Array.isArray(contactMessages) ? contactMessages : []).map((message) => (
                <div key={message.id} className="message-card">
                  <div className="message-header">
                    <h5>{message.name}</h5>
                    <span className="subject-badge">{message.subject}</span>
                  </div>

                  <div className="message-details">
                    <div className="detail-row">
                      <strong>Email:</strong> {message.email}
                    </div>
                    <div className="detail-row">
                      <strong>Phone:</strong> {message.phone}
                    </div>
                    <div className="message-content">
                      <p>{message.message}</p>
                    </div>
                  </div>

                  <div className="message-footer">
                    <small>Received: {new Date(message.created_at).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminSettingsManager;

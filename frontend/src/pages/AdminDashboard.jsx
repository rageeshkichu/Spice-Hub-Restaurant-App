import { useState } from 'react';
import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import AdminMenuManager from '../components/Admin/AdminMenuManager';
import AdminBlogManager from '../components/Admin/AdminBlogManager';
import AdminOrdersManager from '../components/Admin/AdminOrdersManager';
import AdminReservationsManager from '../components/Admin/AdminReservationsManager';
import AdminFeedbackManager from '../components/Admin/AdminFeedbackManager';
import AdminSettingsManager from '../components/Admin/AdminSettingsManager';
import './Admin.css';

function AdminDashboard() {
  const { isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const tabs = [
    { id: 'menu', label: 'Menu Management', icon: '🍽️' },
    { id: 'blog', label: 'Blog Posts', icon: '📝' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'reservations', label: 'Reservations', icon: '🪑' },
    { id: 'feedback', label: 'Feedback', icon: '⭐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1>🔐 Admin Dashboard</h1>
          <p>Manage your restaurant website content</p>
        </div>

        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="admin-content">
          {activeTab === 'menu' && <AdminMenuManager />}
          {activeTab === 'blog' && <AdminBlogManager />}
          {activeTab === 'orders' && <AdminOrdersManager />}
          {activeTab === 'reservations' && <AdminReservationsManager />}
          {activeTab === 'feedback' && <AdminFeedbackManager />}
          {activeTab === 'settings' && <AdminSettingsManager />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

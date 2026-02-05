import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllFeedback, publishFeedback } from '../../services/adminApi';

function AdminFeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await getAllFeedback();
      setFeedbacks(response.data.results || []);
    } catch (error) {
      toast.error('Failed to fetch feedback');
    }
  };

  const handlePublish = async (id, currentStatus) => {
    try {
      await publishFeedback(id, !currentStatus);
      toast.success(currentStatus ? 'Feedback unpublished' : 'Feedback published');
      fetchFeedback();
    } catch (error) {
      toast.error('Failed to update feedback');
    }
  };

  const filteredFeedbacks = filter === 'all' ? feedbacks : filter === 'published' ? feedbacks.filter((f) => f.is_published) : feedbacks.filter((f) => !f.is_published);

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#4caf50';
    if (rating >= 3) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="admin-section">
      <h3>Customer Feedback Management</h3>

      <div className="filter-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All Feedback</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
        <button onClick={fetchFeedback} className="btn btn-small btn-primary">
          🔄 Refresh
        </button>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <p className="empty-state">No feedback found</p>
      ) : (
        <div className="feedback-grid">
          {(Array.isArray(filteredFeedbacks) ? filteredFeedbacks : []).map((feedback) => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-header">
                <h5>{feedback.name}</h5>
                <div className="rating" style={{ color: getRatingColor(feedback.rating) }}>
                  {'⭐'.repeat(feedback.rating)}
                  <span style={{ color: '#ddd' }}>
                    {'⭐'.repeat(5 - feedback.rating)}
                  </span>
                </div>
              </div>

              <div className="feedback-details">
                <div className="detail-row">
                  <strong>Email:</strong> {feedback.email}
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong> {feedback.phone}
                </div>
                <div className="feedback-message">
                  <p>{feedback.message}</p>
                </div>

                {feedback.is_published ? (
                  <span className="published-badge">✓ PUBLISHED</span>
                ) : (
                  <span className="unpublished-badge">⊘ UNPUBLISHED</span>
                )}
              </div>

              <div className="feedback-actions">
                <button
                  className={`btn btn-small ${feedback.is_published ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => handlePublish(feedback.id, feedback.is_published)}
                >
                  {feedback.is_published ? '🔒 Unpublish' : '🔓 Publish'}
                </button>
              </div>

              <div className="feedback-footer">
                <small>Submitted: {new Date(feedback.created_at).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminFeedbackManager;

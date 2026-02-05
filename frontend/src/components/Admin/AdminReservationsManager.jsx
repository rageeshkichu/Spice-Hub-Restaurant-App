import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllReservations, updateReservationStatus } from '../../services/adminApi';

function AdminReservationsManager() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await getAllReservations();
      setReservations(response.data.results || []);
    } catch (error) {
      toast.error('Failed to fetch reservations');
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      toast.success('Reservation status updated');
      fetchReservations();
    } catch (error) {
      toast.error('Failed to update reservation status');
    }
  };

  const filteredReservations = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#4caf50',
      completed: '#2196f3',
      cancelled: '#f44336',
    };
    return colors[status] || '#999';
  };

  const isUpcoming = (dateTime) => {
    return new Date(dateTime) > new Date();
  };

  return (
    <div className="admin-section">
      <h3>Table Reservations Management</h3>

      <div className="filter-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All Reservations</option>
          {(Array.isArray(statuses) ? statuses : []).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <button onClick={fetchReservations} className="btn btn-small btn-primary">
          🔄 Refresh
        </button>
      </div>

      {filteredReservations.length === 0 ? (
        <p className="empty-state">No reservations found</p>
      ) : (
        <div className="reservations-grid">
          {(Array.isArray(filteredReservations) ? filteredReservations : []).map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-header">
                <h5>Reservation #{reservation.id}</h5>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(reservation.status) }}
                >
                  {reservation.status.toUpperCase()}
                </span>
              </div>

              <div className="reservation-details">
                <div className="detail-row">
                  <strong>👤 Name:</strong> {reservation.customer_name}
                </div>
                <div className="detail-row">
                  <strong>📞 Phone:</strong> {reservation.customer_phone}
                </div>
                <div className="detail-row">
                  <strong>📧 Email:</strong> {reservation.customer_email}
                </div>
                <div className="detail-row">
                  <strong>📅 Date:</strong> {new Date(reservation.reservation_date).toLocaleDateString()}
                </div>
                <div className="detail-row">
                  <strong>🕐 Time:</strong> {reservation.reservation_time}
                </div>
                <div className="detail-row">
                  <strong>👥 Guests:</strong> {reservation.number_of_guests} people
                </div>

                {reservation.special_requests && (
                  <div className="detail-row">
                    <strong>📝 Special Requests:</strong>
                    <p>{reservation.special_requests}</p>
                  </div>
                )}

                {isUpcoming(
                  `${reservation.reservation_date}T${reservation.reservation_time}`
                ) ? (
                  <div className="upcoming-badge">⏰ UPCOMING</div>
                ) : (
                  <div className="past-badge">✓ PAST</div>
                )}
              </div>

              <div className="reservation-actions">
                <select
                  value={reservation.status}
                  onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                  className="status-select"
                >
                  {(Array.isArray(statuses) ? statuses : []).map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="reservation-footer">
                <small>Booked: {new Date(reservation.created_at).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReservationsManager;

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
import { workersAPI } from '../services/api';
import { formatCurrency, formatDate, formatTime, getStatusVariant, capitalize } from '../utils/helpers';

const WorkerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await workersAPI.getBookings();
      setBookings(response.data.bookings || []);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await workersAPI.updateBookingStatus(bookingId, newStatus);
      // Refresh bookings after status update
      fetchBookings();
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating booking status:', err);
    }
  };

  const filterBookings = (status) => {
    if (status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const inProgress = bookings.filter(b => b.status === 'in-progress').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    
    return { total, pending, confirmed, inProgress, completed };
  };

  const stats = getBookingStats();

  const renderStatusActions = (booking) => {
    switch (booking.status) {
      case 'pending':
        return (
          <>
            <Button 
              variant="success" 
              size="sm" 
              className="me-2"
              onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
            >
              Confirm
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
            >
              Decline
            </Button>
          </>
        );
      case 'confirmed':
        return (
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => handleStatusUpdate(booking._id, 'in-progress')}
          >
            Start Work
          </Button>
        );
      case 'in-progress':
        return (
          <Button 
            variant="success" 
            size="sm"
            onClick={() => handleStatusUpdate(booking._id, 'completed')}
          >
            Mark Complete
          </Button>
        );
      default:
        return null;
    }
  };

  const renderBookingCard = (booking) => (
    <Card key={booking._id} className="booking-card mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center mb-3">
              <div className="client-avatar me-3">
                {booking.user?.name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div>
                <h5 className="mb-1">{booking.user?.name || 'Client'}</h5>
                <p className="text-muted mb-0">
                  <span className="me-3">📅 {formatDate(booking.scheduledDate)}</span>
                  <span className="me-3">🕐 {formatTime(booking.scheduledTime)}</span>
                  <span>📍 {booking.address.city}, {booking.address.state}</span>
                </p>
              </div>
            </div>
            
            <div className="booking-details mb-3">
              <div className="detail-row">
                <span className="detail-label">Service:</span>
                <span className="service-tag">{capitalize(booking.serviceType)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration:</span>
                <span>{booking.estimatedHours} hours</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Cost:</span>
                <span className="fw-bold text-success">{formatCurrency(booking.totalCost)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment:</span>
                <span>
                  <Badge bg={booking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    {booking.paymentStatus || 'pending'}
                  </Badge>
                </span>
              </div>
              {booking.description && (
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="text-muted">{booking.description}</span>
                </div>
              )}
            </div>
          </Col>
          <Col md={4} className="text-end">
            <div className="booking-status mb-3">
              <Badge bg={getStatusVariant(booking.status)} className="status-badge">
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
            <div className="booking-actions">
              {renderStatusActions(booking)}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className="worker-dashboard">
      <Container className="py-5">
        {/* Stats Section */}
        <Row className="mb-5">
          <Col>
            <h2 className="mb-4">My Bookings</h2>
            <Row>
              <Col md={3}>
                <Card className="stat-card mb-3">
                  <Card.Body className="text-center">
                    <div className="stat-icon">📊</div>
                    <div className="stat-number">{stats.total}</div>
                    <p className="stat-label">Total Bookings</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card mb-3">
                  <Card.Body className="text-center">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-number">{stats.pending}</div>
                    <p className="stat-label">Pending</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card mb-3">
                  <Card.Body className="text-center">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-number">{stats.inProgress}</div>
                    <p className="stat-label">In Progress</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card mb-3">
                  <Card.Body className="text-center">
                    <div className="stat-icon">✅</div>
                    <div className="stat-number">{stats.completed}</div>
                    <p className="stat-label">Completed</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Bookings Section */}
        <Card className="bookings-section">
          <Card.Body>
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            {bookings.length === 0 ? (
              <div className="empty-state text-center py-5">
                <div className="empty-icon mb-3">📋</div>
                <h5>No bookings yet</h5>
                <p className="text-muted mb-4">Your bookings will appear here once clients book your services</p>
              </div>
            ) : (
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="all" title={`All (${stats.total})`}>
                  {filterBookings('all').map(renderBookingCard)}
                </Tab>
                <Tab eventKey="pending" title={`Pending (${stats.pending})`}>
                  {filterBookings('pending').map(renderBookingCard)}
                </Tab>
                <Tab eventKey="confirmed" title={`Confirmed (${stats.confirmed})`}>
                  {filterBookings('confirmed').map(renderBookingCard)}
                </Tab>
                <Tab eventKey="in-progress" title={`In Progress (${stats.inProgress})`}>
                  {filterBookings('in-progress').map(renderBookingCard)}
                </Tab>
                <Tab eventKey="completed" title={`Completed (${stats.completed})`}>
                  {filterBookings('completed').map(renderBookingCard)}
                </Tab>
              </Tabs>
            )}
          </Card.Body>
        </Card>
      </Container>

      <style jsx>{`
        .worker-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
        }
        
        .stat-card {
          border: none;
          border-radius: var(--radius-xl);
          background: white;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-sm);
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        
        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-600);
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          color: var(--gray-600);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0;
        }
        
        .bookings-section {
          border: none;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }
        
        .booking-card {
          border: none;
          border-radius: var(--radius-lg);
          transition: all 0.2s ease;
          border-left: 4px solid var(--primary-500);
        }
        
        .booking-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateX(4px);
        }
        
        .client-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
        }
        
        .service-tag {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
        }
        
        .status-badge {
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
        }
        
        .detail-row {
          margin-bottom: 0.5rem;
        }
        
        .detail-label {
          font-weight: 600;
          color: var(--gray-600);
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default WorkerDashboard; 
 
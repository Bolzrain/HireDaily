import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { bookingsAPI, paymentsAPI } from '../services/api';
import { formatCurrency, formatDate, formatTime, getStatusVariant, capitalize } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(null);

  useEffect(() => {
    fetchBookings();
    
    // Check if redirected from successful booking
    if (location.state?.bookingSuccess) {
      const { workerName, serviceType } = location.state;
      setSuccessMessage(`Successfully booked ${workerName} for ${capitalize(serviceType)} service!`);
      setShowSuccessAlert(true);
      setActiveTab('pending'); // Show pending tab to display the new booking
      
      // Clear the state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    }
  }, [location.state]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getAll();
      setBookings(response.data.bookings || []);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
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
    const completed = bookings.filter(b => b.status === 'completed').length;
    
    return { total, pending, confirmed, completed };
  };

  const stats = getBookingStats();

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.cancel(bookingId);
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      setPaymentLoading(bookingId);
      const response = await paymentsAPI.createCheckoutSession(bookingId);
      
      if (response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        setError('Failed to create payment session');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
      console.error('Payment error:', err);
    } finally {
      setPaymentLoading(null);
    }
  };

  const renderBookingCard = (booking) => (
    <Card key={booking._id} className="booking-card mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center mb-3">
              <div className="worker-avatar me-3">
                {booking.worker?.name?.charAt(0)?.toUpperCase() || 'W'}
              </div>
              <div>
                <h5 className="mb-1">{booking.worker?.name || 'Worker'}</h5>
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
            </div>

            <p className="booking-description text-muted mb-0">
              {booking.description}
            </p>
          </Col>
          
          <Col md={4} className="text-end">
            <div className="booking-status mb-3">
              <Badge bg={getStatusVariant(booking.status)} className="status-badge">
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
            
            <div className="booking-actions">
              {booking.status === 'pending' && (
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleCancelBooking(booking._id)}
                  className="me-2 mb-2"
                >
                  Cancel
                </Button>
              )}
              
              {booking.paymentStatus !== 'paid' && (
                <Button 
                  variant="success" 
                  size="sm"
                  className="mb-2"
                  onClick={() => handlePayment(booking._id)}
                  disabled={paymentLoading === booking._id}
                >
                  {paymentLoading === booking._id ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-1" />
                      Processing...
                    </>
                  ) : (
                    '💳 Pay'
                  )}
                </Button>
              )}
              
              {booking.status === 'completed' && !booking.rating?.score && (
                <Button 
                  as={Link}
                  to={`/bookings/${booking._id}/rate`}
                  variant="warning" 
                  size="sm"
                  className="mb-2"
                >
                  Rate Worker
                </Button>
              )}
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
    <div className="user-dashboard">
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="dashboard-header">
              <h1 className="fw-bold">Welcome back, {user?.name}! 👋</h1>
              <p className="text-muted">Manage your bookings and track your service requests</p>
            </div>
          </Col>
        </Row>

        {/* Success Alert */}
        {showSuccessAlert && (
          <Row className="mb-4">
            <Col>
              <Alert variant="success" dismissible onClose={() => setShowSuccessAlert(false)}>
                <Alert.Heading>🎉 Booking Successful!</Alert.Heading>
                {successMessage}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body className="text-center">
                <div className="stat-icon">📊</div>
                <h3 className="stat-number">{stats.total}</h3>
                <p className="stat-label">Total Bookings</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body className="text-center">
                <div className="stat-icon">⏳</div>
                <h3 className="stat-number">{stats.pending}</h3>
                <p className="stat-label">Pending</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body className="text-center">
                <div className="stat-icon">✅</div>
                <h3 className="stat-number">{stats.confirmed}</h3>
                <p className="stat-label">Confirmed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body className="text-center">
                <div className="stat-icon">🎉</div>
                <h3 className="stat-number">{stats.completed}</h3>
                <p className="stat-label">Completed</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Bookings Section */}
        <Card className="bookings-section">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Your Bookings</h4>
              <Button as={Link} to="/workers" variant="primary">
                Book New Worker
              </Button>
            </div>

            {bookings.length === 0 ? (
              <div className="empty-state text-center py-5">
                <div className="empty-icon mb-3">📋</div>
                <h5>No bookings yet</h5>
                <p className="text-muted mb-4">Start by booking a worker for your next project</p>
                <Button as={Link} to="/workers" variant="primary" size="lg">
                  Find Workers
                </Button>
              </div>
            ) : (
              <>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4"
                >
                  <Tab eventKey="all" title={`All (${bookings.length})`}>
                    {filterBookings('all').map(renderBookingCard)}
                  </Tab>
                  <Tab eventKey="pending" title={`Pending (${stats.pending})`}>
                    {filterBookings('pending').map(renderBookingCard)}
                  </Tab>
                  <Tab eventKey="confirmed" title={`Confirmed (${stats.confirmed})`}>
                    {filterBookings('confirmed').map(renderBookingCard)}
                  </Tab>
                  <Tab eventKey="completed" title={`Completed (${stats.completed})`}>
                    {filterBookings('completed').map(renderBookingCard)}
                  </Tab>
                </Tabs>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      <style jsx>{`
        .user-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
        }
        
        .dashboard-header {
          text-align: center;
          margin-bottom: 2rem;
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
        
        .worker-avatar {
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
        
        .booking-details {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        
        .detail-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .detail-label {
          font-weight: 600;
          color: var(--gray-700);
          font-size: 0.875rem;
        }
        
        .service-tag {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .status-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-lg);
        }
        
        .booking-description {
          font-size: 0.875rem;
          line-height: 1.4;
        }
        
        .booking-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .empty-state {
          color: var(--gray-600);
        }
        
        .empty-icon {
          font-size: 4rem;
          opacity: 0.5;
        }
        
        @media (max-width: 768px) {
          .booking-details {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .booking-actions {
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard; 
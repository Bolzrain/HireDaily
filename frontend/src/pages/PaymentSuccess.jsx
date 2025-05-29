import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { paymentsAPI } from '../services/api';
import { formatCurrency, capitalize } from '../utils/helpers';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const bookingId = searchParams.get('booking_id');

    if (sessionId && bookingId) {
      handlePaymentConfirmation(sessionId, bookingId);
    } else {
      setError('Invalid payment confirmation link');
      setLoading(false);
    }
  }, [location]);

  const handlePaymentConfirmation = async (sessionId, bookingId) => {
    try {
      setLoading(true);
      const response = await paymentsAPI.handlePaymentSuccess(sessionId, bookingId);
      
      if (response.data.success) {
        setBooking(response.data.booking);
        setPaymentConfirmed(true);
      } else {
        setError(response.data.message || 'Payment confirmation failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm payment');
      console.error('Payment confirmation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Confirming payment...</span>
        </Spinner>
        <p className="mt-3">Confirming your payment...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={6}>
            <Alert variant="danger" className="text-center">
              <Alert.Heading>Payment Error</Alert.Heading>
              <p>{error}</p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="payment-success-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            {paymentConfirmed && (
              <Card className="success-card shadow-lg">
                <Card.Body className="p-5 text-center">
                  <div className="success-icon mb-4">
                    <div className="check-circle">✓</div>
                  </div>
                  
                  <h2 className="fw-bold text-success mb-3">Payment Successful! 🎉</h2>
                  <p className="lead text-muted mb-4">
                    Your booking has been confirmed and payment has been processed successfully.
                  </p>

                  {booking && (
                    <Card className="booking-summary-card mb-4">
                      <Card.Body>
                        <h5 className="mb-3">Booking Summary</h5>
                        <Row className="text-start">
                          <Col md={6}>
                            <div className="summary-item mb-2">
                              <span className="label">Worker:</span>
                              <span className="value fw-bold">{booking.worker.name}</span>
                            </div>
                            <div className="summary-item mb-2">
                              <span className="label">Service:</span>
                              <span className="value">{capitalize(booking.serviceType)}</span>
                            </div>
                            <div className="summary-item mb-2">
                              <span className="label">Duration:</span>
                              <span className="value">{booking.estimatedHours} hours</span>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="summary-item mb-2">
                              <span className="label">Status:</span>
                              <span className="value">
                                <span className="badge bg-success">Confirmed</span>
                              </span>
                            </div>
                            <div className="summary-item mb-2">
                              <span className="label">Payment:</span>
                              <span className="value">
                                <span className="badge bg-success">Paid</span>
                              </span>
                            </div>
                            <div className="summary-item mb-2">
                              <span className="label">Total Cost:</span>
                              <span className="value fw-bold text-success">
                                {formatCurrency(booking.totalCost)}
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  )}

                  <div className="action-buttons">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="me-3"
                      onClick={() => navigate('/dashboard')}
                    >
                      View My Bookings
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="lg"
                      onClick={() => navigate('/workers')}
                    >
                      Book Another Worker
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .payment-success-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--success-50) 0%, var(--primary-50) 100%);
        }
        
        .success-card {
          border: none;
          border-radius: var(--radius-2xl);
          overflow: hidden;
        }
        
        .success-icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .check-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: bold;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          animation: successPulse 2s ease-in-out infinite;
        }
        
        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .booking-summary-card {
          background: var(--gray-50);
          border: none;
          border-radius: var(--radius-lg);
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .label {
          color: var(--gray-600);
          font-weight: 500;
        }
        
        .value {
          color: var(--gray-900);
        }
        
        .action-buttons {
          margin-top: 2rem;
        }
        
        .btn {
          border-radius: var(--radius-lg);
          padding: 0.75rem 2rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess; 
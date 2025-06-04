import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { bookingsAPI } from '../services/api';
import { generateStars } from '../utils/helpers';

const RateWorker = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    score: 5,
    review: ''
  });

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getById(bookingId);
      setBooking(response.data);
      
      if (response.data.rating?.score) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to fetch booking details');
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'score' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await bookingsAPI.rate(bookingId, formData);
      navigate('/dashboard', { 
        state: { 
          ratingSuccess: true,
          workerName: booking.worker.name
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
      console.error('Error submitting rating:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Booking not found</Alert>
      </Container>
    );
  }

  return (
    <div className="rate-worker-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="rating-card shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="worker-avatar mb-3">
                    {booking.worker.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="fw-bold">Rate {booking.worker.name}</h2>
                  <p className="text-muted">How was your experience with this worker?</p>
                </div>

                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <div className="rating-stars text-center">
                      <div className="current-rating mb-2">
                        {generateStars(formData.score)}
                      </div>
                      <Form.Range
                        name="score"
                        value={formData.score}
                        onChange={handleChange}
                        min={1}
                        max={5}
                        step={1}
                        className="rating-slider"
                      />
                      <div className="rating-labels d-flex justify-content-between">
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Write a Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="review"
                      value={formData.review}
                      onChange={handleChange}
                      placeholder="Share your experience with this worker..."
                      maxLength={300}
                    />
                    <Form.Text className="text-muted">
                      {formData.review.length}/300 characters
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Rating'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .rate-worker-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
        }
        
        .rating-card {
          border: none;
          border-radius: var(--radius-2xl);
        }
        
        .worker-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 2rem;
          margin: 0 auto;
        }
        
        .rating-stars {
          font-size: 2rem;
          color: #fbbf24;
          margin-bottom: 1rem;
        }
        
        .rating-slider {
          width: 100%;
          margin: 1rem 0;
        }
        
        .rating-labels {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin-top: 0.5rem;
        }
        
        .current-rating {
          font-size: 2.5rem;
          color: #fbbf24;
        }
      `}</style>
    </div>
  );
};

export default RateWorker; 
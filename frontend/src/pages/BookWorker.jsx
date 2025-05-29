import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { workersAPI, bookingsAPI } from '../services/api';
import { formatCurrency, capitalize } from '../utils/helpers';

const BookWorker = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    estimatedHours: 1,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    notes: ''
  });

  useEffect(() => {
    fetchWorker();
  }, [workerId]);

  const fetchWorker = async () => {
    try {
      setLoading(true);
      const response = await workersAPI.getById(workerId);
      setWorker(response.data);
      // Pre-select the first skill if available
      if (response.data.skills && response.data.skills.length > 0) {
        setFormData(prev => ({
          ...prev,
          serviceType: response.data.skills[0]
        }));
      }
    } catch (err) {
      setError('Failed to fetch worker details');
      console.error('Error fetching worker:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateTotal = () => {
    return worker?.hourlyRate * formData.estimatedHours || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        workerId: workerId,
        ...formData,
        hourlyRate: worker.hourlyRate,
        totalCost: calculateTotal()
      };

      await bookingsAPI.create(bookingData);
      setSuccess('Booking request sent successfully!');
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            bookingSuccess: true, 
            workerName: worker.name,
            serviceType: formData.serviceType 
          } 
        });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      console.error('Error creating booking:', err);
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

  if (!worker) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Worker not found</Alert>
      </Container>
    );
  }

  return (
    <div className="book-worker-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="booking-card shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Book {worker.name}</h2>
                  <p className="text-muted">Fill out the details below to book this worker</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {/* Worker Info Card */}
                <Card className="worker-info-card mb-4">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={8}>
                        <div className="d-flex align-items-center mb-3">
                          <div className="worker-avatar me-3">
                            {worker.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="mb-1">{worker.name}</h5>
                            <p className="text-muted mb-0">
                              {worker.location.city}, {worker.location.state}
                            </p>
                          </div>
                        </div>
                        <div className="skills-display">
                          {worker.skills.map(skill => (
                            <span key={skill} className="skill-tag me-2 mb-1">
                              {capitalize(skill)}
                            </span>
                          ))}
                        </div>
                      </Col>
                      <Col md={4} className="text-end">
                        <div className="rate-display">
                          <div className="rate-amount">{formatCurrency(worker.hourlyRate)}</div>
                          <div className="rate-label">per hour</div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Service Type</Form.Label>
                        <Form.Select
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a service</option>
                          {worker.skills.map(skill => (
                            <option key={skill} value={skill}>
                              {capitalize(skill)}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Estimated Hours</Form.Label>
                        <Form.Control
                          type="number"
                          name="estimatedHours"
                          value={formData.estimatedHours}
                          onChange={handleChange}
                          min="1"
                          max="12"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the work you need done..."
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Preferred Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="scheduledDate"
                          value={formData.scheduledDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Preferred Time</Form.Label>
                        <Form.Control
                          type="time"
                          name="scheduledTime"
                          value={formData.scheduledTime}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="mb-3">Work Address</h5>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Additional Notes (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any special instructions or requirements..."
                    />
                  </Form.Group>

                  {/* Cost Summary */}
                  <Card className="cost-summary-card mb-4">
                    <Card.Body>
                      <h6 className="mb-3">Cost Summary</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Hourly Rate:</span>
                        <span>{formatCurrency(worker.hourlyRate)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Hours:</span>
                        <span>{formData.estimatedHours}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span className="text-success">{formatCurrency(calculateTotal())}</span>
                      </div>
                    </Card.Body>
                  </Card>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate(-1)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="success" 
                      disabled={submitting}
                      className="book-submit-btn"
                    >
                      {submitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Booking...
                        </>
                      ) : (
                        <>
                          📅 Book Now
                        </>
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
        .book-worker-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
        }
        
        .booking-card {
          border: none;
          border-radius: var(--radius-2xl);
          overflow: hidden;
        }
        
        .worker-info-card {
          background: linear-gradient(135deg, var(--primary-50), var(--success-50));
          border: none;
          border-radius: var(--radius-xl);
        }
        
        .worker-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.5rem;
        }
        
        .skill-tag {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
        }
        
        .rate-display {
          text-align: center;
        }
        
        .rate-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--success-600);
        }
        
        .rate-label {
          font-size: 0.875rem;
          color: var(--gray-600);
        }
        
        .cost-summary-card {
          background: var(--gray-50);
          border: none;
          border-radius: var(--radius-lg);
        }
        
        .book-submit-btn {
          background: linear-gradient(135deg, #059669, #047857);
          border: none;
          padding: 0.75rem 2rem;
          font-weight: 600;
          border-radius: var(--radius-lg);
        }
        
        .book-submit-btn:hover {
          background: linear-gradient(135deg, #047857, #065f46);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
};

export default BookWorker; 
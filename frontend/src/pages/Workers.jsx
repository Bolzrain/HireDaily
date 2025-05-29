import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { workersAPI } from '../services/api';
import { formatCurrency, generateStars, capitalize } from '../utils/helpers';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    skill: '',
    location: '',
    minRate: '',
    maxRate: '',
    search: ''
  });
  const [skills, setSkills] = useState([]);

  const fetchSkills = async () => {
    try {
      const response = await workersAPI.getSkills();
      setSkills(response.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workersAPI.getAll(filters);
      setWorkers(response.data.workers);
    } catch (err) {
      setError('Failed to fetch workers');
      console.error('Error fetching workers:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSkills();
    fetchWorkers();
  }, [fetchWorkers]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      skill: '',
      location: '',
      minRate: '',
      maxRate: '',
      search: ''
    });
  };

  return (
    <div className="workers-page animate-fade-in">
      <Container className="py-4">
        {/* Header Section */}
        <Row className="mb-3">
          <Col>
            <div className="page-header animate-fade-in-up">
              <h1 className="display-5 fw-bold gradient-text">Find Workers</h1>
              <p className="lead text-muted">Browse skilled professionals in your area</p>
              <div className="section-divider"></div>
            </div>
          </Col>
        </Row>

        {/* Modern Filters */}
        <Card className="filter-card mb-6 animate-fade-in-up">
          <Card.Body className="p-4">
            <div className="filter-header mb-4">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="filter-icon me-2">🔍</span>
                Filter Workers
              </h5>
            </div>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name or description"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Skill</Form.Label>
                <Form.Select
                  name="skill"
                  value={filters.skill}
                  onChange={handleFilterChange}
                >
                  <option value="">All Skills</option>
                  {skills.map(skill => (
                    <option key={skill} value={skill}>
                      {capitalize(skill)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="City or State"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Min Rate</Form.Label>
                <Form.Control
                  type="number"
                  name="minRate"
                  value={filters.minRate}
                  onChange={handleFilterChange}
                  placeholder="₹100"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-1">
                <Form.Label>Max Rate</Form.Label>
                <Form.Control
                  type="number"
                  name="maxRate"
                  value={filters.maxRate}
                  onChange={handleFilterChange}
                  placeholder="₹5000"
                />
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={clearFilters} className="mb-3">
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : workers.length === 0 ? (
        <Alert variant="info">No workers found matching your criteria.</Alert>
      ) : (
        <Row className="g-4">
          {workers.map((worker, index) => (
            <Col md={6} lg={4} key={worker._id}>
              <Card className="worker-card h-100 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <Card.Body className="p-4">
                  <div className="worker-header d-flex justify-content-between align-items-start mb-3">
                    <div className="worker-info">
                      <div className="worker-avatar">
                        {worker.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <h5 className="worker-name mb-1">{worker.name}</h5>
                    </div>
                    <div className="rate-badge">
                      {formatCurrency(worker.hourlyRate)}/hr
                    </div>
                  </div>
                  
                  <div className="worker-details mb-3">
                    <div className="detail-item mb-2">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">
                        {worker.location.city}, {worker.location.state}
                      </span>
                    </div>
                    
                    <div className="detail-item mb-3">
                      <span className="detail-icon">💼</span>
                      <span className="detail-text">
                        {worker.experience} years experience
                      </span>
                    </div>
                  </div>
                  
                  <div className="skills-section mb-3">
                    {worker.skills.map(skill => (
                      <Badge key={skill} className="skill-badge me-1 mb-1">
                        {capitalize(skill)}
                      </Badge>
                    ))}
                  </div>
                  
                  {worker.description && (
                    <p className="worker-description text-muted mb-3">
                      {worker.description.length > 100 
                        ? `${worker.description.substring(0, 100)}...` 
                        : worker.description
                      }
                    </p>
                  )}
                  
                  <div className="worker-footer">
                    <div className="rating-section mb-3">
                      <span className="stars">{generateStars(worker.rating.average)}</span>
                      <small className="rating-count text-muted ms-1">
                        ({worker.rating.count})
                      </small>
                    </div>
                    <div className="worker-actions d-flex gap-2">
                      <Button 
                        as={Link} 
                        to={`/book/${worker._id}`} 
                        variant="success"
                        className="book-now-btn flex-fill"
                        size="sm"
                      >
                        <span className="btn-icon">📅</span>
                        Book Now
                      </Button>
                      <Button 
                        as={Link} 
                        to={`/workers/${worker._id}`} 
                        variant="outline-primary"
                        className="view-details-btn"
                        size="sm"
                      >
                        <span className="btn-icon">👁️</span>
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      </Container>

      <style jsx>{`
        .mb-6 {
          margin-bottom: 8rem !important;
        }
        
        .workers-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .section-divider {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-500), var(--primary-700));
          margin: 1rem auto;
          border-radius: var(--radius-md);
        }
        
        .filter-card {
          background: white;
          border: none;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          position: relative;
        }
        
        .filter-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-500), var(--primary-700));
        }
        
        .filter-header {
          border-bottom: 1px solid var(--gray-100);
          padding-bottom: 1rem;
        }
        
        .filter-icon {
          font-size: 1.2rem;
          color: var(--primary-600);
        }
        
        .worker-card {
          border: none;
          border-radius: var(--radius-xl);
          background: white;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .worker-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, var(--primary-50), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .worker-card:hover::before {
          opacity: 1;
        }
        
        .worker-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-xl);
        }
        
        .worker-card .card-body {
          position: relative;
          z-index: 1;
        }
        
        .worker-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .worker-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        
        .worker-name {
          font-weight: 700;
          color: var(--gray-900);
          margin: 0;
        }
        
        .rate-badge {
          background: linear-gradient(135deg, var(--success-500), #059669);
          color: white;
          font-weight: 700;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .detail-icon {
          font-size: 1rem;
          color: var(--primary-600);
          width: 20px;
          text-align: center;
        }
        
        .detail-text {
          font-size: 0.875rem;
          color: var(--gray-600);
          font-weight: 500;
        }
        
        .skill-badge {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          border: none;
        }
        
        .worker-description {
          font-size: 0.875rem;
          line-height: 1.5;
        }
        
        .rating-section .stars {
          color: #fbbf24;
          font-size: 0.875rem;
        }
        
        .rating-count {
          font-size: 0.75rem;
        }
        
        .view-details-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          text-decoration: none;
          color: white;
        }
        
        .view-details-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
          color: white;
          text-decoration: none;
        }
        
        .book-now-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #059669, #047857);
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          text-decoration: none;
          color: white;
        }
        
        .book-now-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
          background: linear-gradient(135deg, #047857, #065f46);
          color: white;
          text-decoration: none;
        }
        
        .worker-actions {
          margin-top: auto;
        }
        
        .btn-icon {
          font-size: 1rem;
        }
        
        @media (max-width: 768px) {
          .worker-info {
            gap: 0.75rem;
          }
          
          .worker-avatar {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Workers; 
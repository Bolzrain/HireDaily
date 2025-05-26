import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: {
      city: '',
      state: '',
      zipCode: ''
    }
  });
  
  const [workerFormData, setWorkerFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    skills: [],
    location: {
      city: '',
      state: '',
      zipCode: ''
    },
    hourlyRate: '',
    experience: '',
    description: '',
    availability: {
      isAvailable: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: {
        start: '09:00',
        end: '17:00'
      }
    }
  });
  
  const [showAlert, setShowAlert] = useState(false);
  const { register, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  const skillOptions = [
    'construction', 'electrician', 'plumber', 'carpenter', 
    'gardener', 'painter', 'cleaner', 'handyman'
  ];

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setUserFormData({
        ...userFormData,
        location: {
          ...userFormData.location,
          [locationField]: value
        }
      });
    } else {
      setUserFormData({
        ...userFormData,
        [name]: value
      });
    }
  };

  const handleWorkerChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'skills') {
      const updatedSkills = checked
        ? [...workerFormData.skills, value]
        : workerFormData.skills.filter(skill => skill !== value);
      
      setWorkerFormData({
        ...workerFormData,
        skills: updatedSkills
      });
    } else if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setWorkerFormData({
        ...workerFormData,
        location: {
          ...workerFormData.location,
          [locationField]: value
        }
      });
    } else {
      setWorkerFormData({
        ...workerFormData,
        [name]: type === 'number' ? Number(value) : value
      });
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const result = await register(userFormData, 'user');
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    const result = await register(workerFormData, 'worker');
    if (result.success) {
      navigate('/worker-dashboard');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Join HireDaily</h2>
                <p className="text-muted">Create your account to get started</p>
              </div>

              {showAlert && error && (
                <Alert variant="danger" dismissible onClose={() => setShowAlert(false)}>
                  {error}
                </Alert>
              )}

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
                justify
              >
                <Tab eventKey="user" title="I need workers">
                  <Form onSubmit={handleUserSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={userFormData.name}
                            onChange={handleUserChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={userFormData.phone}
                            onChange={handleUserChange}
                            placeholder="1234567890"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={userFormData.email}
                        onChange={handleUserChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={userFormData.password}
                        onChange={handleUserChange}
                        minLength={6}
                        required
                      />
                    </Form.Group>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="location.city"
                            value={userFormData.location.city}
                            onChange={handleUserChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="location.state"
                            value={userFormData.location.state}
                            onChange={handleUserChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Zip Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="location.zipCode"
                            value={userFormData.location.zipCode}
                            onChange={handleUserChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="worker" title="I'm a worker">
                  <Form onSubmit={handleWorkerSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={workerFormData.name}
                            onChange={handleWorkerChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={workerFormData.phone}
                            onChange={handleWorkerChange}
                            placeholder="1234567890"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={workerFormData.email}
                        onChange={handleWorkerChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={workerFormData.password}
                        onChange={handleWorkerChange}
                        minLength={6}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Skills (Select all that apply)</Form.Label>
                      <Row>
                        {skillOptions.map((skill) => (
                          <Col md={6} key={skill}>
                            <Form.Check
                              type="checkbox"
                              name="skills"
                              value={skill}
                              label={skill.charAt(0).toUpperCase() + skill.slice(1)}
                              checked={workerFormData.skills.includes(skill)}
                              onChange={handleWorkerChange}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Hourly Rate ($)</Form.Label>
                          <Form.Control
                            type="number"
                            name="hourlyRate"
                            value={workerFormData.hourlyRate}
                            onChange={handleWorkerChange}
                            min={10}
                            max={200}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Years of Experience</Form.Label>
                          <Form.Control
                            type="number"
                            name="experience"
                            value={workerFormData.experience}
                            onChange={handleWorkerChange}
                            min={0}
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
                        value={workerFormData.description}
                        onChange={handleWorkerChange}
                        placeholder="Tell us about your experience and services..."
                      />
                    </Form.Group>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="location.city"
                            value={workerFormData.location.city}
                            onChange={handleWorkerChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="location.state"
                            value={workerFormData.location.state}
                            onChange={handleWorkerChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Zip Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="location.zipCode"
                            value={workerFormData.location.zipCode}
                            onChange={handleWorkerChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100"
                      disabled={loading || workerFormData.skills.length === 0}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Worker Account'
                      )}
                    </Button>
                  </Form>
                </Tab>
              </Tabs>

              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register; 
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user'
  });
  const [showAlert, setShowAlert] = useState(false);
  
  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password, formData.userType);
    if (result.success) {
      navigate(formData.userType === 'worker' ? '/worker-dashboard' : '/dashboard');
    }
  };

  return (
    <div className="login-page">
      <Container className="py-5">
        <Row className="justify-content-center min-vh-75 align-items-center">
          <Col md={6} lg={5}>
            <div className="login-container animate-fade-in-up">
              <Card className="modern-form border-0">
                <div className="form-header">
                  <div className="login-icon mb-3">🏗️</div>
                  <h2 className="fw-bold mb-2 gradient-text">Welcome Back</h2>
                  <p className="text-muted mb-0">Sign in to your HireDaily account</p>
                </div>

                <div className="form-content">
                  {showAlert && error && (
                    <Alert variant="danger" dismissible onClose={() => setShowAlert(false)} className="modern-alert">
                      <div className="d-flex align-items-center">
                        <span className="alert-icon me-2">⚠️</span>
                        {error}
                      </div>
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label">
                        <span className="label-icon">👤</span>
                        Account Type
                      </Form.Label>
                      <Form.Select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        required
                        className="modern-select"
                      >
                        <option value="user">I'm looking to hire workers</option>
                        <option value="worker">I'm a service worker</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label">
                        <span className="label-icon">📧</span>
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        className="modern-input"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="modern-label">
                        <span className="label-icon">🔒</span>
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="modern-input"
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 mb-4 modern-submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Signing you in...
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">🚀</span>
                          Sign In
                        </>
                      )}
                    </Button>
                  </Form>

                  <div className="auth-footer text-center">
                    <p className="mb-0 text-muted">
                      Don't have an account?{' '}
                      <Link to="/register" className="auth-link">
                        <strong>Create one here</strong>
                      </Link>
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--primary-50) 0%, var(--gray-50) 100%);
          display: flex;
          align-items: center;
        }
        
        .min-vh-75 {
          min-height: 75vh;
        }
        
        .login-container {
          max-width: 100%;
        }
        
        .login-icon {
          font-size: 3rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        
        .modern-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: var(--spacing-sm);
          font-size: 0.9rem;
        }
        
        .label-icon {
          font-size: 1rem;
        }
        
        .modern-input,
        .modern-select {
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          box-shadow: var(--shadow-sm);
        }
        
        .modern-input:focus,
        .modern-select:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), var(--shadow-md);
          outline: none;
          transform: translateY(-1px);
        }
        
        .modern-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          padding: 1rem 2rem;
          border-radius: var(--radius-lg);
          font-size: 1rem;
          background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
          border: none;
          box-shadow: var(--shadow-md);
          transition: all 0.3s ease;
        }
        
        .modern-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%);
        }
        
        .modern-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .btn-icon {
          font-size: 1.1rem;
        }
        
        .auth-link {
          color: var(--primary-600);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .auth-link:hover {
          color: var(--primary-700);
          text-decoration: underline;
        }
        
        .modern-alert {
          border: none;
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, var(--error-500) 0%, #dc2626 100%);
          color: white;
          border-left: 4px solid #b91c1c;
          margin-bottom: 1.5rem;
        }
        
        .alert-icon {
          font-size: 1.1rem;
        }
        
        .auth-footer {
          padding-top: 1rem;
          border-top: 1px solid var(--gray-100);
        }
        
        /* Loading state for spinner */
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
          border-width: 0.15rem;
        }
        
        @media (max-width: 768px) {
          .form-header {
            padding: 2rem 1.5rem;
          }
          
          .form-content {
            padding: 2rem 1.5rem;
          }
          
          .login-icon {
            font-size: 2.5rem;
          }
          
          .modern-input,
          .modern-select {
            padding: 0.875rem 1rem;
            font-size: 0.9rem;
          }
          
          .modern-submit-btn {
            padding: 0.875rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login; 
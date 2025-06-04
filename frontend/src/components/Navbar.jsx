import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar 
      className="modern-navbar shadow-sm"
      variant="light" 
      expand="lg"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="modern-brand">
          <img 
            src="/Logo.png" 
            alt="HireDaily Logo" 
            className="brand-icon-img"
          />
          <span className="brand-text gradient-text">HireDaily</span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" className="modern-toggle" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="modern-nav-link">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Home</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/workers" className="modern-nav-link">
              <span className="nav-icon">👷</span>
              <span className="nav-text">Find Workers</span>
            </Nav.Link>
          </Nav>
          
          <Nav className="ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to={user?.userType === 'worker' ? '/worker-dashboard' : '/dashboard'}
                  className="modern-nav-link"
                >
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">Dashboard</span>
                </Nav.Link>
                <div className="user-welcome d-flex align-items-center me-3">
                  <div className="user-avatar status-online">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="welcome-text">
                    <span className="welcome-greeting">Welcome back,</span>
                    <strong className="user-name">{user?.name}</strong>
                  </div>
                </div>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={handleLogout}
                  className="modern-logout-btn"
                >
                  <span className="btn-icon">🚪</span>
                  <span className="btn-text">Logout</span>
                </Button>
              </>
            ) : (
              <div className="auth-buttons d-flex gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary"
                  size="sm"
                  className="modern-auth-btn auth-signin"
                >
                  <span className="btn-icon">🔑</span>
                  <span className="btn-text">Sign In</span>
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary"
                  size="sm"
                  className="modern-auth-btn auth-signup"
                >
                  <span className="btn-icon">🚀</span>
                  <span className="btn-text">Get Started</span>
                </Button>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar; 
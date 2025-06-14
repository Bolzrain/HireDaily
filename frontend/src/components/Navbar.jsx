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
      
      <style jsx>{`
        .modern-navbar {
          background-color: #ffffff !important;
          background: #ffffff !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .modern-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          font-weight: 800;
          font-size: 1.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
        }
        
        .modern-brand:hover {
          transform: scale(1.05);
          text-decoration: none;
        }
        
        .brand-icon-img {
          width: 2.25rem;
          height: auto;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
          transition: all 0.3s ease;
          animation: brandFloat 3s ease-in-out infinite;
        }
        
        @keyframes brandFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(2deg); }
        }
        
        .modern-brand:hover .brand-icon-img {
          transform: scale(1.1) rotate(10deg);
          filter: drop-shadow(0 6px 12px rgba(59, 130, 246, 0.3));
        }
        
        .brand-text {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        
        .modern-toggle {
          border: none;
          padding: 0.5rem;
          border-radius: var(--radius-lg);
          transition: all 0.2s ease;
          position: relative;
          background: transparent;
        }
        
        .modern-toggle:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .modern-toggle:hover {
          background: var(--primary-50);
        }
        
        .modern-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-lg);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          color: var(--gray-700);
          text-decoration: none;
          margin: 0 0.25rem;
          position: relative;
          overflow: hidden;
        }
        
        .modern-nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transition: left 0.6s;
        }
        
        .modern-nav-link:hover::before {
          left: 100%;
        }
        
        .modern-nav-link:hover {
          background: var(--primary-50);
          color: var(--primary-700);
          text-decoration: none;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .nav-icon {
          font-size: 1.1rem;
          transition: transform 0.2s ease;
        }
        
        .modern-nav-link:hover .nav-icon {
          transform: scale(1.1);
        }
        
        .nav-text {
          font-size: 0.9rem;
          letter-spacing: 0.025em;
        }
        
        .user-welcome {
          background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-xl);
          border: 2px solid var(--gray-100);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .user-welcome::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--gradient-primary-soft);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .user-welcome:hover::before {
          opacity: 1;
        }
        
        .user-welcome:hover {
          border-color: var(--primary-200);
          box-shadow: var(--shadow-md);
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          margin-right: 0.75rem;
          box-shadow: var(--shadow-md);
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }
        
        .user-avatar::after {
          content: '';
          position: absolute;
          top: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background: var(--success-500);
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: var(--shadow-sm);
        }
        
        .user-welcome:hover .user-avatar {
          transform: scale(1.05);
          box-shadow: var(--shadow-lg);
        }
        
        .welcome-text {
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }
        
        .welcome-greeting {
          font-size: 0.75rem;
          color: var(--gray-500);
          line-height: 1;
          margin-bottom: 2px;
        }
        
        .user-name {
          font-size: 0.875rem;
          color: var(--gray-800);
          line-height: 1;
          font-weight: 600;
        }
        
        .modern-logout-btn,
        .modern-auth-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          border-radius: var(--radius-lg);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
          letter-spacing: 0.025em;
          position: relative;
          overflow: hidden;
        }
        
        .modern-logout-btn::before,
        .modern-auth-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.4s ease;
        }
        
        .modern-logout-btn:hover::before,
        .modern-auth-btn:hover::before {
          width: 200px;
          height: 200px;
        }
        
        .modern-logout-btn:hover,
        .auth-signin:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-600);
          color: var(--primary-700);
        }
        
        .auth-signup {
          background: var(--gradient-primary);
          border: none;
          color: white;
        }
        
        .auth-signup:hover {
          background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
          transform: translateY(-2px);
          box-shadow: var(--shadow-colored);
          color: white;
        }
        
        .btn-icon {
          font-size: 1rem;
          transition: transform 0.2s ease;
        }
        
        .modern-logout-btn:hover .btn-icon,
        .modern-auth-btn:hover .btn-icon {
          transform: scale(1.1);
        }
        
        .btn-text {
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .auth-buttons {
          gap: 0.5rem;
        }
        
        @media (max-width: 991px) {
          .modern-navbar {
            padding: 0.75rem 0;
          }
          
          .modern-brand {
            font-size: 1.5rem;
          }
          
          .brand-icon-img {
            width: 2rem;
          }
          
          .user-welcome {
            margin: 0.5rem 0;
            justify-content: center;
          }
          
          .auth-buttons {
            flex-direction: column;
            width: 100%;
            margin-top: 0.5rem;
          }
          
          .modern-auth-btn {
            justify-content: center;
            width: 100%;
          }
          
          .modern-nav-link {
            justify-content: center;
            margin: 0.25rem 0;
          }
        }
        
        @media (max-width: 576px) {
          .modern-brand {
            font-size: 1.25rem;
          }
          
          .brand-icon-img {
            width: 1.75rem;
          }
          
          .user-avatar {
            width: 35px;
            height: 35px;
            font-size: 0.9rem;
          }
          
          .welcome-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </BootstrapNavbar>
  );
};

export default Navbar; 
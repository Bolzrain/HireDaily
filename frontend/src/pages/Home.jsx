import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Enhanced Hero Section */}
      <section className="hero-section text-white section-padding">
        <Container>
          <Row className="align-items-center min-vh-70">
            <Col lg={6} className="hero-content">
              <div className="animate-fade-in-up">
                <h1 className="display-4 fw-bold mb-4">
                  Find <span className="text-gradient-warm">Skilled Workers</span> for Any Job
                </h1>
                <p className="lead mb-4 opacity-90">
                  Connect with experienced professionals for construction, electrical, plumbing, 
                  carpentry, gardening, and more. Get quality work done at competitive rates.
                </p>
                <div className="hero-stats mb-4">
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-number">10K+</span>
                      <span className="stat-label">Workers</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">50K+</span>
                      <span className="stat-label">Jobs Done</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">4.9★</span>
                      <span className="stat-label">Rating</span>
                    </div>
                  </div>
                </div>
                <div className="hero-buttons d-flex gap-3 flex-wrap">
                  <Button 
                    as={Link} 
                    to="/workers" 
                    variant="light" 
                    size="lg"
                    className="hero-btn-primary"
                  >
                    <span className="btn-icon">🔍</span>
                    <span className="btn-text">Find Workers</span>
                  </Button>
                  {!isAuthenticated && (
                    <Button 
                      as={Link} 
                      to="/register" 
                      variant="outline-light" 
                      size="lg"
                      className="hero-btn-secondary"
                    >
                      <span className="btn-icon">🚀</span>
                      <span className="btn-text">Join as Worker</span>
                    </Button>
                  )}
                </div>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-visual animate-fade-in-up">
                <div className="hero-cards-stack">
                  <div className="hero-card hero-card-1 glass-effect">
                    <div className="hero-icon">🏗️</div>
                    <h4 className="text-dark mb-2">Quality Work</h4>
                    <p className="text-muted mb-0">Verified professionals ready to help</p>
                  </div>
                  <div className="hero-card hero-card-2 glass-effect">
                    <div className="hero-icon">⚡</div>
                    <h4 className="text-dark mb-2">Fast Service</h4>
                    <p className="text-muted mb-0">Quick response and reliable delivery</p>
                  </div>
                  <div className="hero-card hero-card-3 glass-effect">
                    <div className="hero-icon">💼</div>
                    <h4 className="text-dark mb-2">Fair Pricing</h4>
                    <p className="text-muted mb-0">Competitive rates for all services</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Enhanced Features Section */}
      <section className="section-padding bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold gradient-text">How It Works</h2>
              <p className="lead text-muted">Simple steps to get your work done</p>
              <div className="section-divider"></div>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md={4}>
              <Card className="feature-card h-100 text-center animate-fade-in-up">
                <Card.Body>
                  <div className="feature-step">1</div>
                  <div className="feature-icon">🔍</div>
                  <Card.Title className="h4 mb-3">Search Workers</Card.Title>
                  <Card.Text className="text-muted">
                    Browse through our verified workers by skill, location, and rating. 
                    Use filters to find the perfect match for your needs.
                  </Card.Text>
                  <div className="feature-tags">
                    <span className="feature-tag">Verified</span>
                    <span className="feature-tag">Rated</span>
                    <span className="feature-tag">Local</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="feature-card h-100 text-center animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <Card.Body>
                  <div className="feature-step">2</div>
                  <div className="feature-icon">📅</div>
                  <Card.Title className="h4 mb-3">Book Service</Card.Title>
                  <Card.Text className="text-muted">
                    Schedule your service with detailed requirements and preferred timing. 
                    Get instant confirmation and worker contact details.
                  </Card.Text>
                  <div className="feature-tags">
                    <span className="feature-tag">Instant</span>
                    <span className="feature-tag">Flexible</span>
                    <span className="feature-tag">Secure</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="feature-card h-100 text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <Card.Body>
                  <div className="feature-step">3</div>
                  <div className="feature-icon">✅</div>
                  <Card.Title className="h4 mb-3">Get Work Done</Card.Title>
                  <Card.Text className="text-muted">
                    Professional workers complete your job to satisfaction. 
                    Rate their service and help others make informed decisions.
                  </Card.Text>
                  <div className="feature-tags">
                    <span className="feature-tag">Quality</span>
                    <span className="feature-tag">Guaranteed</span>
                    <span className="feature-tag">Support</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Enhanced Services Section */}
      <section className="section-padding">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold gradient-text">Our Services</h2>
              <p className="lead text-muted">Professional workers for every need</p>
              <div className="section-divider"></div>
            </Col>
          </Row>
          
          <Row className="g-4">
            {[
              { icon: '🏗️', title: 'Construction', desc: 'Building and renovation work', color: 'primary', popular: true },
              { icon: '⚡', title: 'Electrical', desc: 'Wiring and electrical repairs', color: 'warning', popular: false },
              { icon: '🔧', title: 'Plumbing', desc: 'Pipe installation and repairs', color: 'info', popular: true },
              { icon: '🪚', title: 'Carpentry', desc: 'Wood work and furniture', color: 'success', popular: false },
              { icon: '🌱', title: 'Gardening', desc: 'Landscaping and maintenance', color: 'success', popular: true },
              { icon: '🎨', title: 'Painting', desc: 'Interior and exterior painting', color: 'danger', popular: false },
              { icon: '🧹', title: 'Cleaning', desc: 'Deep cleaning services', color: 'info', popular: false },
              { icon: '🔨', title: 'Handyman', desc: 'General repair and maintenance', color: 'dark', popular: true },
            ].map((service, index) => (
              <Col md={3} sm={6} key={index} className="mb-4">
                <Card className="service-card h-100 text-center animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <Card.Body>
                    {service.popular && <div className="service-badge">Popular</div>}
                    <div className="service-icon">{service.icon}</div>
                    <Card.Title className="h5 mb-3">{service.title}</Card.Title>
                    <Card.Text className="text-muted small mb-3">{service.desc}</Card.Text>
                    <Button 
                      as={Link} 
                      to="/workers" 
                      variant="outline-primary" 
                      size="sm" 
                      className="service-btn"
                    >
                      Find Workers
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Enhanced CTA Section */}
      {!isAuthenticated && (
        <section className="cta-section text-white section-padding">
          <Container>
            <Row className="text-center">
              <Col>
                <div className="cta-content animate-fade-in-up">
                  <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
                  <p className="lead mb-5 opacity-90">
                    Join thousands of satisfied customers and skilled workers
                  </p>
                  <div className="cta-stats mb-5">
                    <Row>
                      <Col md={3} sm={6} className="mb-3">
                        <div className="cta-stat">
                          <div className="cta-stat-number">10,000+</div>
                          <div className="cta-stat-label">Active Workers</div>
                        </div>
                      </Col>
                      <Col md={3} sm={6} className="mb-3">
                        <div className="cta-stat">
                          <div className="cta-stat-number">50,000+</div>
                          <div className="cta-stat-label">Jobs Completed</div>
                        </div>
                      </Col>
                      <Col md={3} sm={6} className="mb-3">
                        <div className="cta-stat">
                          <div className="cta-stat-number">4.9/5</div>
                          <div className="cta-stat-label">Average Rating</div>
                        </div>
                      </Col>
                      <Col md={3} sm={6} className="mb-3">
                        <div className="cta-stat">
                          <div className="cta-stat-number">24/7</div>
                          <div className="cta-stat-label">Support</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="cta-buttons d-flex justify-content-center gap-3 flex-wrap">
                    <Button 
                      as={Link} 
                      to="/register" 
                      variant="light" 
                      size="lg"
                      className="cta-btn-primary"
                    >
                      <span className="btn-icon">🚀</span>
                      <span className="btn-text">Sign Up Now</span>
                    </Button>
                    <Button 
                      as={Link} 
                      to="/workers" 
                      variant="outline-light" 
                      size="lg"
                      className="cta-btn-secondary"
                    >
                      <span className="btn-icon">👀</span>
                      <span className="btn-text">Browse Workers</span>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      <style jsx>{`
        .min-vh-70 {
          min-height: 70vh;
        }
        
        .text-gradient-warm {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }
        
        .hero-stats {
          margin: var(--spacing-2xl) 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          max-width: 400px;
        }
        
        .stat-item {
          text-align: center;
          padding: var(--spacing-md);
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .stat-number {
          display: block;
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          line-height: 1;
        }
        
        .stat-label {
          display: block;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.25rem;
        }
        
        .hero-cards-stack {
          position: relative;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .hero-card {
          position: absolute;
          width: 280px;
          padding: var(--spacing-xl);
          text-align: center;
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(20px);
          transition: all 0.4s ease;
        }
        
        .hero-card-1 {
          top: 0;
          left: 50%;
          transform: translateX(-50%) rotate(-2deg);
          animation: heroFloat1 4s ease-in-out infinite;
          z-index: 3;
        }
        
        .hero-card-2 {
          top: 80px;
          left: -20px;
          transform: rotate(3deg);
          animation: heroFloat2 4s ease-in-out infinite 1s;
          z-index: 2;
        }
        
        .hero-card-3 {
          top: 80px;
          right: -20px;
          transform: rotate(-3deg);
          animation: heroFloat3 4s ease-in-out infinite 2s;
          z-index: 1;
        }
        
        @keyframes heroFloat1 {
          0%, 100% { transform: translateX(-50%) rotate(-2deg) translateY(0px); }
          50% { transform: translateX(-50%) rotate(-2deg) translateY(-10px); }
        }
        
        @keyframes heroFloat2 {
          0%, 100% { transform: rotate(3deg) translateY(0px); }
          50% { transform: rotate(3deg) translateY(-15px); }
        }
        
        @keyframes heroFloat3 {
          0%, 100% { transform: rotate(-3deg) translateY(0px); }
          50% { transform: rotate(-3deg) translateY(-8px); }
        }
        
        .hero-card:hover {
          transform: translateX(-50%) rotate(0deg) translateY(-10px) scale(1.05);
          z-index: 10;
        }
        
        .hero-card-2:hover {
          transform: rotate(0deg) translateY(-10px) scale(1.05);
        }
        
        .hero-card-3:hover {
          transform: rotate(0deg) translateY(-10px) scale(1.05);
        }
        
        .feature-step {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: var(--shadow-lg);
          z-index: 10;
        }
        
        .feature-tags {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: var(--spacing-md);
        }
        
        .feature-tag {
          background: var(--primary-100);
          color: var(--primary-700);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.025em;
        }
        
        .service-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: var(--gradient-warm);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: var(--shadow-sm);
        }
        
        .service-btn {
          font-weight: 600;
          border-radius: var(--radius-lg);
          transition: all 0.3s ease;
          border-width: 2px;
        }
        
        .service-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .cta-stats {
          margin: var(--spacing-2xl) 0;
        }
        
        .cta-stat {
          text-align: center;
          padding: var(--spacing-lg);
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-xl);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .cta-stat:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
        }
        
        .cta-stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        
        .cta-stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }
        
        .btn-text {
          font-weight: 700;
        }
        
        @media (max-width: 768px) {
          .hero-cards-stack {
            height: 300px;
          }
          
          .hero-card {
            width: 240px;
            padding: var(--spacing-lg);
          }
          
          .hero-card-2,
          .hero-card-3 {
            display: none;
          }
          
          .hero-card-1 {
            position: relative;
            top: auto;
            left: auto;
            transform: none;
            animation: none;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 300px;
          }
          
          .stat-number {
            font-size: 1.5rem;
          }
          
          .feature-step {
            width: 35px;
            height: 35px;
            font-size: 1rem;
          }
          
          .cta-stat-number {
            font-size: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .stats-grid {
            grid-template-columns: 1fr;
            max-width: 200px;
          }
          
          .hero-card {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home; 
import { useState, useEffect } from "react";
import "../styles/home.css";

function HomePage() {
  const [isAnimated, setIsAnimated] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const demoMessages = [
    { type: "received", text: "Hey there! 👋", delay: 0 },
    { type: "sent", text: "Hi! Just checking out this demo.", delay: 1000 },
    { type: "received", text: "Pretty cool, right? ✨", delay: 2000 },
    { type: "sent", text: "The real-time updates are amazing!", delay: 3500 },
    { type: "received", text: "Built with modern tech stack 🚀", delay: 5000 },
  ];

  useEffect(() => {
    setIsAnimated(true);

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % demoMessages.length);
    }, 6000);

    return () => clearInterval(messageTimer);
  }, []);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-dot"></span>
          ChatApp
        </div>
        <div className="nav-links">
          <a href="/signin">Sign In</a>
          <a href="/signup" className="nav-button">
            Get Started
          </a>
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <div className={`hero-text ${isAnimated ? "animate" : ""}`}>
            <div className={`hero-badge ${isAnimated ? "animate" : ""}`}>
              <span className="badge-text">💼 Portfolio Project</span>
            </div>
            <h1>
              Full-Stack Chat Application<span className="accent-dot">.</span>
            </h1>
            <p className="tagline">
              A production-ready real-time messaging platform built with modern
              web technologies, featuring microservices architecture, Docker
              containerization, and scalable deployment.
            </p>
            <div className="tech-badges">
              <div className="tech-badge">
                <img src="/react.svg" alt="React" />
                React 18
              </div>
              <div className="tech-badge">
                <img src="/typescript.svg" alt="TypeScript" />
                TypeScript
              </div>
              <div className="tech-badge">
                <img src="/socketio.svg" alt="Socket.IO" />
                Socket.IO
              </div>
              <div className="tech-badge">
                <img src="/express.svg" alt="Express" />
                Express.js
              </div>
              <div className="tech-badge tech-badge-docker">🐳 Docker</div>
              <div className="tech-badge tech-badge-mongo">🍃 MongoDB</div>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">TypeScript</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Real-time</span>
                <span className="stat-label">WebSocket</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Dockerized</span>
                <span className="stat-label">Deployment</span>
              </div>
            </div>
            <div className="hero-buttons">
              <a href="/signup" className="primary-button">
                <span>🚀 Try Live Demo</span>
              </a>
              <a
                href="https://github.com/elmountahiii/chat-app"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button">
                <svg
                  className="github-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                </svg>
                View Source Code
              </a>
            </div>
          </div>
          <div className={`hero-image ${isAnimated ? "animate" : ""}`}>
            <div className="chat-preview">
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="user-avatar">YE</div>
                  <div className="user-info">
                    <span className="user-name">Live Demo</span>
                    <span className="user-status">🟢 Online</span>
                  </div>
                </div>
                <div className="chat-actions">
                  <span className="action-dot"></span>
                  <span className="action-dot"></span>
                  <span className="action-dot"></span>
                </div>
              </div>
              <div className="chat-messages">
                {demoMessages
                  .slice(0, Math.max(1, messageIndex + 1))
                  .map((msg, index) => (
                    <div key={index} className={`message ${msg.type}`}>
                      {msg.text}
                    </div>
                  ))}
                <div className="typing-indicator">
                  <span>Someone is typing</span>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." disabled />
                <button disabled>📤</button>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="features-header">
            <h2>
              Key Features<span className="accent-dot">.</span>
            </h2>
            <p className="features-subtitle">
              Production-ready features built with industry best practices
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">⚡️</span>
              </div>
              <h3>Real-time Communication</h3>
              <p>
                WebSocket-powered instant messaging with Socket.IO for
                zero-latency experience
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🔐</span>
              </div>
              <h3>JWT Authentication</h3>
              <p>
                Secure user authentication with JSON Web Tokens and protected
                routes
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📱</span>
              </div>
              <h3>Responsive Design</h3>
              <p>Mobile-first responsive design with CSS Grid and Flexbox</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🐳</span>
              </div>
              <h3>Containerized Deployment</h3>
              <p>
                Docker containers with multi-stage builds and production
                optimization
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🏗️</span>
              </div>
              <h3>Microservices Architecture</h3>
              <p>
                Separated frontend, backend, and database services with Nginx
                reverse proxy
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">⚙️</span>
              </div>
              <h3>TypeScript Throughout</h3>
              <p>
                100% TypeScript codebase with strict type checking and
                IntelliSense
              </p>
            </div>
          </div>
        </section>

        <section className="architecture-section">
          <div className="container">
            <div className="architecture-header">
              <h2>
                Technical Architecture<span className="accent-dot">.</span>
              </h2>
              <p className="architecture-subtitle">
                Scalable full-stack architecture with modern development
                practices
              </p>
            </div>

            <div className="architecture-grid">
              <div className="arch-layer">
                <h3>Frontend Layer</h3>
                <div className="arch-tech">
                  <span className="tech-pill">React 18</span>
                  <span className="tech-pill">TypeScript</span>
                  <span className="tech-pill">Vite</span>
                  <span className="tech-pill">CSS3</span>
                </div>
                <p>
                  Modern React application with hooks, context API, and
                  responsive design
                </p>
              </div>

              <div className="arch-layer">
                <h3>Backend Layer</h3>
                <div className="arch-tech">
                  <span className="tech-pill">Node.js</span>
                  <span className="tech-pill">Express.js</span>
                  <span className="tech-pill">Socket.IO</span>
                  <span className="tech-pill">JWT</span>
                </div>
                <p>
                  RESTful API with real-time WebSocket communication and secure
                  authentication
                </p>
              </div>

              <div className="arch-layer">
                <h3>Database Layer</h3>
                <div className="arch-tech">
                  <span className="tech-pill">MongoDB</span>
                  <span className="tech-pill">Mongoose</span>
                </div>
                <p>
                  NoSQL database with optimized schemas and indexing for chat
                  data
                </p>
              </div>

              <div className="arch-layer">
                <h3>DevOps Layer</h3>
                <div className="arch-tech">
                  <span className="tech-pill">Docker</span>
                  <span className="tech-pill">Nginx</span>
                  <span className="tech-pill">Docker Compose</span>
                </div>
                <p>
                  Containerized deployment with reverse proxy and service
                  orchestration
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="highlights-section">
          <div className="container">
            <div className="highlights-header">
              <h2>
                Project Highlights<span className="accent-dot">.</span>
              </h2>
              <p>Key technical achievements and implementation details</p>
            </div>

            <div className="highlights-grid">
              <div className="highlight-card">
                <div className="highlight-icon">🚀</div>
                <h3>Performance Optimized</h3>
                <ul>
                  <li>React 18 concurrent features</li>
                  <li>Code splitting with lazy loading</li>
                  <li>Optimized Docker images</li>
                  <li>Nginx caching strategies</li>
                </ul>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon">🔧</div>
                <h3>Developer Experience</h3>
                <ul>
                  <li>Hot module replacement</li>
                  <li>TypeScript strict mode</li>
                  <li>ESLint & Prettier setup</li>
                  <li>Development Docker setup</li>
                </ul>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon">🛡️</div>
                <h3>Security Features</h3>
                <ul>
                  <li>JWT token authentication</li>
                  <li>Protected API routes</li>
                  <li>Input validation & sanitization</li>
                  <li>CORS configuration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-dot"></span>
                ChatApp
              </div>
              <p>
                A full-stack portfolio project demonstrating modern web
                development skills
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Project</h4>
                <ul>
                  <li>
                    <a href="/signup">Live Demo</a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/elmountahiii/chat-app"
                      target="_blank"
                      rel="noopener noreferrer">
                      Source Code
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/elmountahiii/chat-app#readme"
                      target="_blank"
                      rel="noopener noreferrer">
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Technologies</h4>
                <ul>
                  <li>React & TypeScript</li>
                  <li>Node.js & Express</li>
                  <li>Socket.IO & MongoDB</li>
                  <li>Docker & Nginx</li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Connect</h4>
                <ul>
                  <li>
                    <a
                      href="https://github.com/elmountahiii"
                      target="_blank"
                      rel="noopener noreferrer">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/in/youssef-el-mountahi"
                      target="_blank"
                      rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href="mailto:elmountahi.youssef@gmail.com">Email</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              Designed & Built by{" "}
              <a
                href="https://github.com/elmountahiii"
                target="_blank"
                rel="noopener noreferrer">
                Youssef El Mountahi
              </a>
            </p>
            <p>© {new Date().getFullYear()} • Portfolio Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;

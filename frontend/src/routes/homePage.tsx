import { useState, useEffect } from "react";
import "../styles/home.css";

function HomePage() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">ChatApp</div>
        <div className="nav-links">
          <a href="/auth">Demo</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <div className={`hero-text ${isAnimated ? "animate" : ""}`}>
            <h1>Simple. Secure. Real-time Chat.</h1>
            <p className="tagline">
              A modern chat application built with React & Socket.IO
            </p>
            <div className="hero-buttons">
              <a href="/auth" className="primary-button">
                View Demo
              </a>
              <a
                href="https://github.com/elmountahiii/chat-app"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button">
                Source Code
              </a>
            </div>
          </div>
        </section>

        <section
          id="demo"
          className={`demo-section ${isAnimated ? "animate" : ""}`}>
          <div className="chat-demo">
            <div className="chat-messages">
              <div className="message received">
                <p>Hey there! 👋</p>
                <span>11:23 AM</span>
              </div>
              <div className="message sent">
                <p>Hi! Just checking out this demo.</p>
                <span>11:24 AM</span>
              </div>
              <div className="message received">
                <p>Pretty cool, right?</p>
                <span>11:25 AM</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <h2>Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <span>💬</span>
              <h3>Real-time Chat</h3>
              <p>Instant messaging with Socket.IO</p>
            </div>
            <div className="feature-card">
              <span>🎨</span>
              <h3>Modern UI</h3>
              <p>Clean and responsive design</p>
            </div>
            <div className="feature-card">
              <span>⚡</span>
              <h3>Fast</h3>
              <p>Built with React for performance</p>
            </div>
          </div>
        </section>

        <section id="about" className="about-section">
          <h2>About</h2>
          <p>
            A portfolio project showcasing full-stack development with React,
            Socket.IO, and Express. Built as a demonstration of real-time web
            applications.
          </p>
          <div className="tech-stack">
            <span>React</span>
            <span>Socket.IO</span>
            <span>Express</span>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <p>
            Built by{" "}
            <a
              href="https://github.com/elmountahiii"
              target="_blank"
              rel="noopener noreferrer">
              Youssef El Mountahi
            </a>
          </p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;

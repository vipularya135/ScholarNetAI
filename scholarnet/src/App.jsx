import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import Scholars from './Scholars.jsx'

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const location = useLocation();

  const contentData = [
    {
      title: "Discover Top Professors",
      subtitle: "Across India",
      description: "Find and connect with leading academic experts in various fields."
    },
    {
      title: "Academic Excellence",
      subtitle: "Beyond STEM",
      description: "Explore top researchers in arts, humanities, business, and more."
    },
    {
      title: "Research Excellence",
      subtitle: "Access Impact",
      description: "Access professors with the highest research impact and citations."
    },
    {
      title: "Global Connections",
      subtitle: "Local Expertise",
      description: "Connect with world-class academics right here in India."
    }
  ];

  const changeContent = (newIndex) => {
    if (isAnimating || newIndex === currentIndex) return;
    
    setIsAnimating(true);
    
    // Fade out current content
    setTimeout(() => {
      setCurrentIndex(newIndex);
      // Fade in new content
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 400);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndex === contentData.length - 1 ? 0 : currentIndex + 1;
      changeContent(nextIndex);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, contentData.length, isAnimating]);

  const currentContent = contentData[currentIndex];

  const handleExploreClick = () => {
    setShowGraphs(!showGraphs);
  };

  // Home component
  const Home = () => (
    <main className="main-content">
      <div className="hero-section">
        <h1 className={`main-title ${isAnimating ? 'animate-out' : 'animate-in'}`}>
          <span className={`title-line-1 ${isAnimating ? 'animate-out' : 'animate-in'}`}>
            {currentContent.title}
          </span>
          <span className={`title-line-2 ${isAnimating ? 'animate-out' : 'animate-in'}`}>
            {currentContent.subtitle}
          </span>
        </h1>
        <p className={`subtitle ${isAnimating ? 'animate-out' : 'animate-in'}`}>
          {currentContent.description}
        </p>
        
        {/* Dots Indicator */}
        <div className="dots-indicator">
          {contentData.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => changeContent(index)}
            ></span>
          ))}
        </div>
      </div>

      <div className="product-showcase">
        <div className="showcase-item">
          <div className="showcase-icon">📚</div>
          <p>One place for students to find all scholars</p>
        </div>
        <div className="showcase-item">
          <div className="showcase-icon">🏛️</div>
          <p>110+ institutions across India</p>
        </div>
        <div className="showcase-item">
          <div className="showcase-icon">👨‍🏫</div>
          <p>10,000+ verified professors</p>
        </div>
        <div className="showcase-item">
          <div className="showcase-icon">🔬</div>
          <p>Across 10 different domains</p>
        </div>
      </div>
      
      {/* Visualize Button */}
      <div className="visualize-button-container">
        <button className="explore-button" onClick={handleExploreClick}>
          Visualize and Analyze Trends
        </button>
      </div>

      {/* Graphs Section */}
      {showGraphs && (
        <div className="graphs-section">
          <div className="graphs-container">
            <h2 className="graphs-title">Graphs Coming Soon</h2>
            <p className="graphs-description">
              Interactive visualizations and analytics will be available here soon.
            </p>
            <div className="graphs-placeholder">
              <div className="placeholder-chart">
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '80%'}}></div>
                <div className="chart-bar" style={{height: '40%'}}></div>
                <div className="chart-bar" style={{height: '90%'}}></div>
                <div className="chart-bar" style={{height: '70%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">ScholarlyAI</span>
        </div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/scholars" className={location.pathname === '/scholars' ? 'active' : ''}>Scholars</Link>
          <Link to="/ai-chat" className={location.pathname === '/ai-chat' ? 'active' : ''}>AI Chat</Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scholars" element={<Scholars />} />
        <Route path="/ai-chat" element={<div className="coming-soon">AI Chat page coming soon...</div>} />
      </Routes>

      <footer className="footer">
        <p>Vipul Arya</p>
        <p><a href="mailto:krishnamvipul@gmail.com">krishnamvipul@gmail.com</a></p>
      </footer>
    </div>
  )
}

export default App

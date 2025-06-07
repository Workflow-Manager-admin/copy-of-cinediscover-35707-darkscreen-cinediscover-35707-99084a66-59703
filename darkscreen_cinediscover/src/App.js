import React from 'react';
import './App.css';
import MovieContainer from './MovieContainer';
import backgrnImg from './20250607_151420_backgrn.jpg';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      {/* Ensure background image is rendered and never blocks content */}
      <img
        src={backgrnImg}
        alt=""
        className="app-bg-art"
        draggable="false"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          pointerEvents: "none",
          position: "fixed",
          right: 0,
          bottom: 0,
          width: "47vw",
          maxWidth: 600,
          minWidth: 240,
          height: "auto",
          zIndex: 0,
          opacity: 0.17, // Slightly less prominent
          filter: "blur(13px) saturate(1.17) grayscale(0.17)",
          maskImage:
            "linear-gradient(110deg, transparent 3%, #000 30%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(110deg, transparent 3%, #000 30%, #000 100%)",
          transition: "opacity 0.35s",
          background: "none",
          userSelect: "none",
        }}
      />
      <nav className="navbar cine-navbar">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div 
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}
          >
            {/* CineScope Brand Header */}
            <div className="cine-logo-header">
              <span className="cine-logo-icon" aria-label="CineScope" role="img">🎬</span>
              <span className="cine-logo-text">
                Cine
                <span style={{ color: 'var(--accent)' }}>Scope</span>
              </span>
            </div>
            {/* Watchlist Button */}
            <button
              className="btn btn-watchlist"
              type="button"
              aria-label="View Watchlist"
              tabIndex={0}
              title="View your saved Watchlist"
              style={{
                marginLeft: 8,
                minWidth: 90,
                fontWeight: 700,
                border: "none",
                boxShadow: "none",
                padding: "0.36em 1.05em",
                height: 34,
                lineHeight: 1.2
              }}
              disabled={false}
            >
              <span style={{
                fontWeight: 700,
                fontSize: "1em",
                letterSpacing: "0.01em"
              }}>
                View Watchlist
              </span>
            </button>
          </div>
        </div>
      </nav>
      <main style={{ position: "relative", zIndex: 2 }}>
        {/* Integrate main MovieContainer for business logic, replacing old hero */}
        <MovieContainer />
      </main>
    </div>
  );
}

export default App;
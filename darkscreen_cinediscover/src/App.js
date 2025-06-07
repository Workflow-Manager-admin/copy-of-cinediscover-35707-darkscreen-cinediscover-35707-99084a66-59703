import React from 'react';
import './App.css';
import MovieContainer from './MovieContainer';
import backgrnImg from './20250607_151420_backgrn.jpg';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      {/* Subtle background image, visually unobtrusive */}
      <img
        src={backgrnImg}
        alt=""
        className="app-bg-art"
        draggable="false"
        aria-hidden="true"
      />
      <nav className="navbar cine-navbar">
        <div className="container">
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
              // For future: Add onClick to show modal/page
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
      <main>
        {/* Integrate main MovieContainer for business logic, replacing old hero */}
        <MovieContainer />
      </main>
    </div>
  );
}

export default App;
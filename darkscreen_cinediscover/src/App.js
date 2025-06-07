import React from 'react';
import './App.css';
import MovieContainer from './MovieContainer';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
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
                marginLeft: 16,
                minWidth: 112,
                fontWeight: 700,
                letterSpacing: ".01em"
              }}
              disabled={false} // Future: Conditionally active/inactive if needed
            >
              <span role="img" aria-hidden="true" style={{ marginRight: 7, fontSize: "1.2em", verticalAlign: "middle" }}>⭐</span>
              View Watchlist
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
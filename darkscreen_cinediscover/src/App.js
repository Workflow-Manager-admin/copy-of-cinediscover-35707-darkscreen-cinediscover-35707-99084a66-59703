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
                marginLeft: 0,
                minWidth: 132,
                fontWeight: 800,
                border: "none"
              }}
              disabled={false} // Future: Conditionally active/inactive if needed
            >
              <span role="img" aria-hidden="true" style={{
                marginRight: 10,
                fontSize: "1.36em",
                verticalAlign: "middle",
                filter: "drop-shadow(0 2.5px 18px #fff2), drop-shadow(0 1.5px 15px #e50914bb)"
              }}>⭐</span>
              <span style={{
                fontWeight: 830,
                fontSize: "1.09em",
                letterSpacing: "0.03em",
                paddingTop: 2,
                paddingBottom: 2
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
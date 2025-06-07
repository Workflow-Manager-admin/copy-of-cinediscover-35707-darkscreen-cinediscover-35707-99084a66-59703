import React from 'react';
import './App.css';
import MovieContainer from './MovieContainer';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      <nav className="navbar cine-navbar">
        <div className="container">
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            {/* CineScope Brand Header */}
            <div className="cine-logo-header">
              <span className="cine-logo-icon" aria-label="CineScope" role="img">🎬</span>
              <span className="cine-logo-text">Cine
                <span style={{ color: 'var(--accent)' }}>Scope</span>
              </span>
            </div>
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
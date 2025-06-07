import React, { useState, useEffect } from 'react';
import './App.css';
import MovieContainer from './MovieContainer';
import WatchlistModal from './WatchlistModal';
import backgrnImg from './20250607_151420_backgrn.jpg';

// PUBLIC_INTERFACE
function App() {
  // -- Watchlist state LIFTED here --
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = window.localStorage.getItem("cine_watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist watchlist to localStorage on change
  useEffect(() => {
    window.localStorage.setItem("cine_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Modal open state
  const [modalOpen, setModalOpen] = useState(false);

  // Accessibility: Close modal on navigation or hashchange
  useEffect(() => {
    if (!modalOpen) return;
    const onNav = () => setModalOpen(false);
    window.addEventListener("hashchange", onNav);
    return () => window.removeEventListener("hashchange", onNav);
  }, [modalOpen]);

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
          opacity: 0.17,
          filter: "blur(13px) saturate(1.17) grayscale(0.17)",
          maskImage: "linear-gradient(110deg, transparent 3%, #000 30%, #000 100%)",
          WebkitMaskImage: "linear-gradient(110deg, transparent 3%, #000 30%, #000 100%)",
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
              onClick={() => setModalOpen(true)}
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
        {/* Display watchlist modal overlay (portal-like) */}
        <WatchlistModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          watchlist={watchlist}
        />
        {/* Integrate main MovieContainer for business logic, replacing old hero */}
        <MovieContainer watchlist={watchlist} setWatchlist={setWatchlist} />
      </main>
      {/* Responsive, sticky footer with legal/disclaimer message */}
      <footer className="cine-footer" role="contentinfo">
        <span className="cine-footer-text">
          All movie data and images are sourced from public APIs (e.g., OMDb). This site is for personal/educational use only &copy; All rights to respective content owners.
        </span>
      </footer>
    </div>
  );
}

export default App;
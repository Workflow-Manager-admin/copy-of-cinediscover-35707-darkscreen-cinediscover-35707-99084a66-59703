import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
/**
 * MovieContainer - Main container component handling movie fetch,
 * loading/offline handling, and localStorage watchlist management.
 * Provides a responsive movie grid placeholder for future cards.
 */
function MovieContainer() {
  // Movie list fetched from remote API (placeholder for now)
  const [movies, setMovies] = useState([]);
  // Loading state for movie fetch
  const [loading, setLoading] = useState(true);
  // Online/offline browser state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // Watchlist state synchronized with localStorage
  const [watchlist, setWatchlist] = useState(() => {
    try {
      // Get list from localStorage or default to empty
      const saved = window.localStorage.getItem("cine_watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Set up network state listeners
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);
    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
    };
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    window.localStorage.setItem("cine_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Placeholder for future movie fetch effect
  useEffect(() => {
    // Simulate async load
    setLoading(true);
    const timer = setTimeout(() => {
      // TODO: Replace with real fetch
      setMovies([]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Loading indicator
  if (loading) {
    return (
      <section className="container" style={{ paddingTop: 112 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
            color: "var(--accent)",
          }}
        >
          <span
            className="spinner"
            style={{
              display: "inline-block",
              width: 44,
              height: 44,
              border: "4px solid var(--accent)",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              animation: "spin 1.1s linear infinite",
              marginRight: 20,
            }}
          />
          <span>Loading movies…</span>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
          `}
        </style>
      </section>
    );
  }

  // Offline state
  if (!isOnline) {
    return (
      <section className="container" style={{ paddingTop: 112 }}>
        <div
          style={{
            background: "var(--card-bg)",
            borderRadius: 8,
            padding: 36,
            margin: "42px auto 0",
            maxWidth: 440,
            boxShadow: "0 2px 14px 0 rgba(0,0,0,.19)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2px solid var(--accent)",
          }}
        >
          <span
            role="img"
            aria-label="offline"
            style={{
              fontSize: 44,
              color: "var(--accent)",
              marginBottom: 14,
              filter: "drop-shadow(0 3px 10px #e509144c)",
            }}
          >
            ⚡
          </span>
          <h2 style={{ color: "var(--accent)", margin: 0 }}>
            Offline Mode
          </h2>
          <div style={{ color: "var(--text-secondary)", marginTop: 14, textAlign: "center" }}>
            You are currently offline.<br />
            Showing your saved watchlist (read-only).<br />
            Online features are disabled.
          </div>
          {/* Optionally, render watchlist */}
        </div>
      </section>
    );
  }

  // Movie grid placeholder
  return (
    <section className="container" style={{ paddingTop: 112, paddingBottom: 48 }}>
      <h2 style={{ color: "var(--accent)", marginBottom: 24, fontWeight: 700 }}>
        Discover Movies
      </h2>
      <div
        className="movie-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 28,
        }}
        data-testid="movie-grid"
      >
        {/* Placeholder cards for structure demonstration */}
        {[1, 2, 3, 4, 5, 6].map((_, idx) => (
          <div
            key={idx}
            className="movie-card placeholder"
            aria-hidden="true"
            style={{
              background: "var(--card-bg)",
              borderRadius: 12,
              minHeight: 280,
              boxShadow: "0 2px 20px 0 #18181c33",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 20,
              opacity: 0.32,
            }}
          >
            <div
              style={{
                background: "#35354f",
                borderRadius: 10,
                width: 110,
                height: 165,
                marginBottom: 18,
              }}
            />
            <div
              style={{
                width: 90,
                height: 17,
                background: "#32212e",
                borderRadius: 6,
                marginBottom: 10,
              }}
            />
            <div
              style={{
                width: 60,
                height: 13,
                background: "#34262f",
                borderRadius: 6,
              }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 34,
          color: "var(--text-secondary)",
          textAlign: "center",
        }}
      >
        {/* Info text - to be replaced by actual fetched results */}
        Movie cards will appear here.
      </div>
    </section>
  );
}

export default MovieContainer;

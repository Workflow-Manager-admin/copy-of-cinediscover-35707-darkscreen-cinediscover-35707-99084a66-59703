import React, { useEffect, useState } from "react";

/**
 * MovieContainer - Main container component handling movie fetch,
 * loading/offline handling, and localStorage watchlist management.
 * Provides a responsive movie grid with real movie data using OMDb API,
 * loading spinner, and overlays offline/error state as needed.
 *
 * OMDb API Docs: http://www.omdbapi.com/
 */
function MovieContainer() {
  // Movie list fetched from remote API
  const [movies, setMovies] = useState([]);
  // Loading state for movie fetch
  const [loading, setLoading] = useState(true);
  // Online/offline browser state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // Fetch error or offline state (to trigger offline/error overlay)
  const [fetchError, setFetchError] = useState(null);
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

  // Fetch movies from OMDb API (example: popular US movies, since OMDb has no "popular" endpoint, use search terms)
  useEffect(() => {
    let ignore = false;
    async function fetchMovies() {
      setLoading(true);
      setFetchError(null);
      // Use OMDb API key "thewdb" (public demo) for non-commercial use
      // OMDb returns 10 results per page for search; use a popular term to simulate discovery
      const OMDB_API_URL = "https://www.omdbapi.com/?apikey=thewdb&s=star&y=2019,2023&type=movie&page=1";
      try {
        if (!navigator.onLine) {
          setIsOnline(false);
          setLoading(false);
          setFetchError("offline");
          return;
        }
        const resp = await fetch(OMDB_API_URL);
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await resp.json();
        if (!data.Search) {
          throw new Error("Unable to fetch movies, try again later.");
        }
        if (!ignore) {
          setMovies(data.Search);
          setLoading(false);
          setIsOnline(true);
        }
      } catch (err) {
        if (!ignore) {
          setLoading(false);
          if (!navigator.onLine) {
            setFetchError("offline");
            setIsOnline(false);
          } else {
            setFetchError("Error fetching movies.");
            setIsOnline(true);
          }
        }
      }
    }
    fetchMovies();
    return () => { ignore = true; };
  }, []);

  // Centralized "offline or fetch error" overlay panel
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

  if (fetchError === "offline" || !isOnline) {
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
            You are currently offline or unable to load movies.<br />
            Showing your saved watchlist (read-only if offline).<br />
            Online features are disabled.
          </div>
          {/* Optionally, render the local watchlist */}
          {watchlist && watchlist.length > 0 && (
            <div style={{ marginTop: 18, width: "100%" }}>
              <h4 style={{ color: "var(--accent)", marginBottom: 4, marginTop: 12 }}>Watchlist</h4>
              <ul style={{padding:0, margin:0, listStyle:"none", maxHeight:180, overflow:"auto"}}>
                {watchlist.map((movie, idx) => (
                  <li key={movie.imdbID || idx} style={{
                    marginBottom: 10,
                    background: "#23232a",
                    borderRadius: 6,
                    padding: "8px 12px",
                    color: "#fff",
                    fontSize: 15,
                  }}>
                    {(movie.Title || movie) + (movie.Year ? ` (${movie.Year})` : "")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (fetchError) {
    // Error unrelated to offline, show message with retry option
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
            aria-label="error"
            style={{
              fontSize: 44,
              color: "var(--accent)",
              marginBottom: 14,
              filter: "drop-shadow(0 3px 10px #e509144c)",
            }}
          >
            ⚠️
          </span>
          <h2 style={{ color: "var(--accent)", margin: 0 }}>
            Could not fetch movies
          </h2>
          <div style={{ color: "var(--text-secondary)", marginTop: 14, textAlign: "center" }}>
            {fetchError}
          </div>
        </div>
      </section>
    );
  }

  // Movie grid
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
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="movie-card"
              style={{
                background: "var(--card-bg)",
                borderRadius: 12,
                minHeight: 280,
                boxShadow: "0 2px 20px 0 #18181c33",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 20,
                textAlign: "center"
              }}
            >
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/110x165?text=No+Image"}
                alt={`${movie.Title} Poster`}
                style={{
                  width: 110,
                  height: 165,
                  objectFit: "cover",
                  borderRadius: 10,
                  marginBottom: 18,
                  background: "#282838"
                }}
              />
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#fff",
                  marginBottom: 6,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 130,
                }}
                title={movie.Title}
              >
                {movie.Title}
              </div>
              <div style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginBottom: 12
              }}>{movie.Year}</div>
              {/* Watchlist and Showtimes buttons stub (to be implemented in next subtasks) */}
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <button
                  className="btn"
                  style={{
                    background: watchlist.find(entry => entry.imdbID === movie.imdbID) ? "var(--accent)" : "#282828",
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: 13,
                    border: watchlist.find(entry => entry.imdbID === movie.imdbID) ? "2px solid #e50914" : "1px solid #444",
                    borderRadius: 4,
                    padding: "7px 12px",
                    cursor: "pointer"
                  }}
                  title={watchlist.find(entry => entry.imdbID === movie.imdbID) ? "Remove from Watchlist" : "Add to Watchlist"}
                  onClick={() => {
                    setWatchlist((prev) => {
                      if (prev.find(item => item.imdbID === movie.imdbID)) {
                        // Remove
                        return prev.filter(item => item.imdbID !== movie.imdbID);
                      }
                      // Add
                      return [...prev, movie];
                    });
                  }}
                >
                  {watchlist.find(entry => entry.imdbID === movie.imdbID) ? "✓ In Watchlist" : "+ Watchlist"}
                </button>
                <a
                  className="btn"
                  style={{
                    background: "#23232a",
                    color: "var(--accent)",
                    fontWeight: 600,
                    fontSize: 13,
                    border: "1px solid var(--accent)",
                    borderRadius: 4,
                    padding: "7px 12px",
                    textDecoration: "none",
                    display: "inline-block"
                  }}
                  href={`https://www.google.com/search?q=${encodeURIComponent(movie.Title + " showtimes near me")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Search showtimes"
                >
                  Showtimes
                </a>
              </div>
            </div>
          ))
        ) : (
          // No movies fallback
          <div style={{
            gridColumn: "1/-1",
            color: "var(--text-secondary)",
            textAlign: "center",
            fontSize: 16,
            opacity: 0.7,
            marginTop: 24,
          }}>
            No movies found.
          </div>
        )}
      </div>
      {/* Description, maybe hint next features */}
      <div
        style={{
          marginTop: 34,
          color: "var(--text-secondary)",
          textAlign: "center",
        }}
      >
        Browse and add your favorite movies to the Watchlist, or check local showtimes!
      </div>
    </section>
  );
}

export default MovieContainer;

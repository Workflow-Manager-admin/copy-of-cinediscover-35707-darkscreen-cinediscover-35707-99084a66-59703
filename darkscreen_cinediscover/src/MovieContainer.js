import React, { useEffect, useState } from "react";

/**
 * MovieContainer - Main container component handling movie fetch,
 * loading/offline handling, and localStorage watchlist management.
 *
 * Features:
 *  - Fetch and display movies from OMDb API.
 *  - Add/remove movies to/from watchlist, persist watchlist in localStorage.
 *  - Visually distinguish movies in watchlist.
 *  - Show a loading spinner and handle offline/errors.
 *
 * OMDb API Docs: http://www.omdbapi.com/
 */
// PUBLIC_INTERFACE
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
      // Get list from localStorage or default to empty array
      const saved = window.localStorage.getItem("cine_watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Listen for online/offline state changes
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);
    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
    };
  }, []);

  // Persist watchlist to localStorage on change
  useEffect(() => {
    window.localStorage.setItem("cine_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch movies from OMDb API (simulate discovery)
  useEffect(() => {
    let ignore = false;
    async function fetchMovies() {
      setLoading(true);
      setFetchError(null);
      // Example query; OMDb API demo key is public
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

  // Loading spinner overlay
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
              marginRight: 20,
            }}
          />
          <span>Loading movies…</span>
        </div>
      </section>
    );
  }

  // Offline overlay, show watchlist (read-only)
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
          {/* Render the local watchlist */}
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

  // Error overlay (not offline)
  if (fetchError) {
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

  // Main Movie Grid UI
  return (
    <section className="container" style={{ paddingTop: 112, paddingBottom: 48 }}>
      <h2 style={{ color: "var(--accent)", marginBottom: 24, fontWeight: 700 }}>
        Discover Movies
      </h2>
      <div className="movie-grid" data-testid="movie-grid">
        {movies && movies.length > 0 ? (
          movies.map((movie) => {
            // Is this movie in the watchlist?
            const inWatchlist = watchlist.some(entry => entry.imdbID === movie.imdbID);
            return (
              <div
                key={movie.imdbID}
                className={`movie-card${inWatchlist ? " movie-watchlisted" : ""}`}
                tabIndex={0}
                aria-label={`${movie.Title} (${movie.Year})${inWatchlist ? " in watchlist" : ""}`}
                style={{
                  boxShadow: inWatchlist
                    ? "0 0 0 2px var(--accent), 0 2px 14px 0 rgba(0,0,0,.22)"
                    : undefined,
                  position: "relative",
                }}
              >
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/110x165?text=No+Image"}
                  alt={movie.Poster !== "N/A" ? `${movie.Title} Poster` : "No Image"}
                  style={inWatchlist ? { filter: "brightness(1.07) saturate(1.25)", border: "2px solid var(--accent)" } : {}}
                />
                <div
                  className="movie-title"
                  title={movie.Title}
                >
                  {movie.Title}
                </div>
                <div className="movie-year">{movie.Year}</div>
                <div className="movie-card-actions">
                  <button
                    className={`btn${inWatchlist ? " watchlist-active" : ""}`}
                    title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    aria-pressed={inWatchlist}
                    onClick={() => {
                      setWatchlist((prev) => {
                        // Remove if in, else add movie to watchlist
                        if (prev.some(item => item.imdbID === movie.imdbID)) {
                          return prev.filter(item => item.imdbID !== movie.imdbID);
                        }
                        return [...prev, movie];
                      });
                    }}
                  >
                    {inWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
                  </button>
                  <a
                    className="btn showtimes"
                    href={`https://www.google.com/search?q=${encodeURIComponent(movie.Title + " showtimes near me")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Show showtimes for this movie in Google"
                    tabIndex={0}
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      marginLeft: 8,
                      border: "none",
                      fontWeight: 600,
                      letterSpacing: ".01em",
                      padding: "0.5em 1.25em",
                      borderRadius: "5px",
                      transition: "background .15s",
                      textDecoration: "none",
                      boxShadow: "0 2px 10px #e509142b",
                      outline: "none",
                      fontSize: 14,
                      cursor: "pointer"
                    }}
                    onMouseOver={e => (e.target.style.background = "#b00610")}
                    onMouseOut={e => (e.target.style.background = "var(--accent)")}
                  >
                    Showtimes
                  </a>
                </div>
                {inWatchlist && (
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "var(--accent)",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14,
                      boxShadow: "0 1.5px 6px #e5091445",
                    }}
                    title="Watchlisted"
                    aria-label="In Watchlist"
                  >
                    ★
                  </span>
                )}
              </div>
            );
          })
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
      {/* Description or upgrade hint */}
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

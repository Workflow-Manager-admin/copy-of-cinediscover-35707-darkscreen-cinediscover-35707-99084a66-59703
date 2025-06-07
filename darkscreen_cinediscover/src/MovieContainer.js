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
/**
 * MovieContainer - Main container component handling movie fetch,
 * loading/offline handling, and localStorage watchlist management.
 *
 * Now features:
 *  - Dynamic search input (real-time OMDb query)
 *  - Fetching movies from OMDb in response to user search (test key: thewdb)
 *  - Shows movie Title, Year, and Poster fields as API result
 *  - UI/UX reflects loading/offline/error state and query result
 *
 * OMDb API Docs: http://www.omdbapi.com/
 */
// PUBLIC_INTERFACE
function MovieContainer() {
  // Movie list fetched from OMDb API
  const [movies, setMovies] = useState([]);
  // Loading state for movie fetch
  const [loading, setLoading] = useState(false);
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

  // Search query state, default to "star" (legacy) or empty string for blank
  const [query, setQuery] = useState("star");

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

  // Fetch movies from OMDb API with dynamic query on query change
  useEffect(() => {
    let ignore = false;
    // Only search if query is not just empty or whitespace
    if (!query.trim()) {
      setMovies([]);
      setLoading(false);
      setFetchError(null);
      return;
    }
    async function fetchMovies() {
      setLoading(true);
      setFetchError(null);
      // Interpolate API URL with query
      const OMDB_API_URL = `https://www.omdbapi.com/?apikey=thewdb&s=${encodeURIComponent(query)}&type=movie&page=1`;
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
          if (data.Error && data.Error.toLowerCase().includes("too many results")) {
            // Encourage more specific query
            throw new Error("Too many results. Please narrow your search.");
          }
          setMovies([]); // No results but not an error per se
          setLoading(false);
          setIsOnline(true);
          return;
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
            setFetchError(err.message || "Error fetching movies.");
            setIsOnline(true);
          }
        }
      }
    }
    fetchMovies();
    return () => { ignore = true; };
  }, [query]);

  // -- UI Part 1: Loading spinner overlay
  if (loading) {
    return (
      <section className="container" style={{ paddingTop: 112 }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 230,
          color: "var(--accent)",
        }}>
          <span className="spinner" style={{ marginRight: 20 }} />
          <span>Loading movies…</span>
        </div>
      </section>
    );
  }

  // -- UI Part 2: Offline overlay, show watchlist (read-only)
  if (fetchError === "offline" || !isOnline) {
    return (
      <section className="container" style={{ paddingTop: 112 }}>
        <div className="offline-box">
          <span className="offline-icon" role="img" aria-label="offline">⚡</span>
          <div className="offline-title">Offline Mode</div>
          <div className="offline-desc">
            You are currently offline or unable to load movies.<br />
            Showing your saved watchlist (read-only if offline).<br />
            Online features are disabled.
          </div>
          {/* Render the local watchlist */}
          {watchlist && watchlist.length > 0 && (
            <div className="watchlist-list">
              <h4 style={{ color: "var(--accent)", marginBottom: 4, marginTop: 12 }}>Watchlist</h4>
              <ul>
                {watchlist.map((movie, idx) => (
                  <li key={movie.imdbID || idx}>
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

  // -- UI Part 3: Error overlay (not offline)
  if (fetchError) {
    return (
      <section className="container" style={{ paddingTop: 112 }}>
        <div className="error-box">
          <span className="error-icon" role="img" aria-label="error">⚠️</span>
          <div className="error-title">Could not fetch movies</div>
          <div className="error-desc">{fetchError}</div>
        </div>
      </section>
    );
  }

  // -- UI Part 4: Main Movie Grid UI with search bar
  return (
    <section className="container" style={{ paddingTop: 112, paddingBottom: 48 }}>
      <h2 style={{ color: "var(--accent)", marginBottom: 12, fontWeight: 700 }}>
        Discover Movies
      </h2>

      {/* -- Search Input UI -- */}
      <div style={{
        marginBottom: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title…"
          aria-label="Search movies"
          autoFocus
          style={{
            width: "100%",
            maxWidth: 340,
            padding: "0.6em 1.2em",
            fontSize: "1.07rem",
            borderRadius: 6,
            border: "2px solid var(--accent)",
            outline: "none",
            background: "var(--card-bg)",
            color: "var(--text-color)",
            boxShadow: "0 2px 10px #e5091417",
            fontWeight: 500,
            marginRight: 8,
            letterSpacing: "0.01em"
          }}
          onKeyDown={e => { if (e.key === "Escape") setQuery(""); }} // Clear on Esc
        />
        {query &&
          <button
            className="btn"
            title="Clear search"
            aria-label="Clear"
            style={{ marginLeft: 6, padding: "0.53em 1.2em" }}
            onClick={() => setQuery("")}
          >Clear</button>
        }
      </div>

      {/* -- Movies Grid -- */}
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
              >
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/110x165?text=No+Image"}
                  alt={movie.Poster !== "N/A" ? `${movie.Title} Poster` : "No Image"}
                  className={inWatchlist ? "movie-watchlisted-img" : ""}
                  loading="lazy"
                />
                <div className="movie-title" title={movie.Title}>
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
                  >
                    Showtimes
                  </a>
                </div>
                {inWatchlist && (
                  <span
                    className="star-badge"
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
      {/* -- Description/Info -- */}
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

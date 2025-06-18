import React, { useEffect, useRef } from "react";
import "./App.css";
// All modal centering and overlay positioning for the watchlist modal is strictly handled via CSS (position: fixed, transform: translate(-50%, -50%))
// Any legacy usage of scroll-offset or JS-based centering has been removed/not used.

/**
 * Modal overlay that displays the user's watchlist.
 * Minimal, responsive, and visually integrated.
 *
 * Props:
 * - open: boolean (if true, modal is shown)
 * - onClose: () => void (called on ESC, click outside, or close btn)
 * - watchlist: array of movie objects {Title, Year, Poster, imdbID}
 */
/**
 * WatchlistModal component displays the user's watchlist in a modal dialog.
 * Adds ability to remove movies directly from the modal via a small remove button per entry.
 * 
 * Props:
 * - open: boolean - controls modal visibility
 * - onClose: function - closes the modal
 * - watchlist: array - movie objects
 * - setWatchlist: function - update watchlist (removal)
 */
// PUBLIC_INTERFACE
export default function WatchlistModal({ open, onClose, watchlist, setWatchlist }) {
  const overlayRef = useRef();

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose && onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Trap focus and click outside to close
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose && onClose();
      }
    }
    overlayRef.current && overlayRef.current.addEventListener('click', onClickOutside);
    return () => {
      overlayRef.current && overlayRef.current.removeEventListener('click', onClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="watchlist-modal-overlay" ref={overlayRef} aria-modal="true" role="dialog" tabIndex={-1}>
      <div className="watchlist-modal-content" tabIndex={0}>
        <button
          className="watchlist-modal-close"
          onClick={onClose}
          aria-label="Close watchlist"
          title="Close"
        >
          ×
        </button>
        <h3 className="watchlist-modal-title">Your Watchlist</h3>
        {(!watchlist || watchlist.length === 0) ? (
          <div className="watchlist-modal-empty">
            <span role="img" aria-label="empty">📭</span>
            <div>No movies in your watchlist.</div>
          </div>
        ) : (
          <div className="watchlist-modal-list">
            {watchlist.map((movie) => (
              <div className="watchlist-modal-item" key={movie.imdbID || movie.Title}>
                <img
                  src={movie.Poster !== "N/A" && movie.Poster ? movie.Poster : "https://via.placeholder.com/60x90?text=No+Image"}
                  alt={movie.Title + " Poster"}
                  className="watchlist-modal-poster"
                  loading="lazy"
                  width={60}
                  height={90}
                />
                <div className="watchlist-modal-meta">
                  <span className="watchlist-modal-movie-title" title={movie.Title}>
                    {movie.Title}
                  </span>
                  <span className="watchlist-modal-movie-year">
                    {movie.Year}
                  </span>
                </div>
                <button
                  className="remove-watchlist-btn"
                  aria-label={`Remove ${movie.Title} from watchlist`}
                  title="Remove from Watchlist"
                  onClick={() => {
                    setWatchlist((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));
                  }}
                  tabIndex={0}
                  type="button"
                  // Accessibility: Focus styling is handled by CSS, button is clearly labeled, and tabIndex ensures keyboard access.
                  // UX: positioned absolutely, does not overlap text or image, styled small and minimalist in App.css
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import "./App.css";

/**
 * Modal overlay that displays the user's watchlist.
 * Minimal, responsive, and visually integrated.
 *
 * Props:
 * - open: boolean (if true, modal is shown)
 * - onClose: () => void (called on ESC, click outside, or close btn)
 * - watchlist: array of movie objects {Title, Year, Poster, imdbID}
 */
export default function WatchlistModal({ open, onClose, watchlist }) {
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

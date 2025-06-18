import React, { useEffect, useRef } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * LoginModal - Modal overlay for user login (UI only)
 * 
 * Props:
 *  - open: boolean (visible if true)
 *  - onClose: function (called to close the modal)
 * 
 * Shows fields for email, password, generic login CTA, and a "Continue with Google" button.
 */
export default function LoginModal({ open, onClose }) {
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

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose && onClose();
      }
    }
    const el = overlayRef.current;
    if (el) el.addEventListener("click", onClickOutside);
    return () => {
      if (el) el.removeEventListener("click", onClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="login-modal-overlay"
      ref={overlayRef}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      style={{
        position: "fixed",
        zIndex: 1210,
        background: "rgba(26,13,16,0.68)",
        top: 0, left: 0, right: 0, bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "modal-fade-in 0.22s",
        transition: "background 0.16s"
      }}
    >
      <div
        className="login-modal-content"
        tabIndex={0}
        style={{
          background: "var(--secondary-bg, #23232a)",
          color: "var(--text-color, #fff)",
          boxShadow: "0 10px 34px 0 #0a010833, 0 1.2px 12px #e5091425",
          borderRadius: 18,
          minWidth: 295,
          width: "96vw",
          maxWidth: 380,
          padding: "32px 22px 28px 22px",
          position: "relative",
          maxHeight: "94vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch"
        }}
      >
        <button
          className="login-modal-close"
          onClick={onClose}
          aria-label="Close login"
          title="Close"
          style={{
            position: "absolute",
            right: 15,
            top: 15,
            background: "none",
            border: "none",
            color: "var(--accent, #e50914)",
            fontSize: "1.8rem",
            fontWeight: 800,
            cursor: "pointer",
            opacity: 0.86
          }}
        >×</button>
        <div
          className="login-modal-title"
          style={{
            color: "var(--accent, #e50914)",
            fontWeight: 760,
            margin: 0,
            marginBottom: 20,
            fontSize: "1.18rem",
            letterSpacing: "0.012em",
            textAlign: "center"
          }}
        >
          Sign In to CineScope
        </div>
        <form
          className="login-modal-form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}
          // onSubmit just prevents default, as there is no backend/auth at this step
          onSubmit={e => e.preventDefault()}
        >
          <label htmlFor="cine-login-email" style={{ fontWeight: 600, fontSize: "1rem" }}>
            Email
            <input
              id="cine-login-email"
              type="email"
              autoComplete="username"
              required
              placeholder="your@email.com"
              style={{
                width: "100%",
                borderRadius: 6,
                border: "2px solid var(--accent, #e50914)",
                background: "var(--card-bg, #23232a)",
                color: "var(--text-color, #fff)",
                fontSize: "1rem",
                padding: "0.64em 1em",
                marginTop: 4,
                fontWeight: 500
              }}
            />
          </label>
          <label htmlFor="cine-login-pw" style={{ fontWeight: 600, fontSize: "1rem" }}>
            Password
            <input
              id="cine-login-pw"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              style={{
                width: "100%",
                borderRadius: 6,
                border: "2px solid var(--accent, #e50914)",
                background: "var(--card-bg, #23232a)",
                color: "var(--text-color, #fff)",
                fontSize: "1rem",
                padding: "0.64em 1em",
                marginTop: 4,
                fontWeight: 500
              }}
            />
          </label>
          <button
            type="submit"
            className="btn btn-login"
            style={{
              marginTop: 6,
              width: "100%",
              background: "var(--accent, #e50914)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 700,
              padding: "0.57em 0",
              fontSize: "1.09rem",
              boxShadow: "0 2px 10px #e5091431",
              letterSpacing: "0.014em",
              cursor: "pointer",
              marginBottom: 5
            }}
          >
            Log In
          </button>
        </form>
        <div style={{
          margin: "11px 0 5px 0",
          textAlign: "center",
          color: "var(--text-secondary, #CCCCCC)",
          fontSize: "0.98rem"
        }}>
          or
        </div>
        <button
          className="btn btn-google-login"
          type="button"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            background: "#fff",
            color: "#444",
            border: "2px solid #eee",
            borderRadius: 7,
            fontWeight: 700,
            fontSize: "1.01rem",
            padding: "0.53em 0",
            marginBottom: 3,
            cursor: "pointer",
            boxShadow: "0 1.5px 10px #0001",
            transition: "background 0.14s, color 0.14s"
          }}
          tabIndex={0}
          title="Continue with Google (UI only)"
        >
          <span style={{ fontSize: "1.18em", lineHeight: 0 }}>
            <svg width="22" height="22" viewBox="0 0 20 20" style={{ verticalAlign: "middle" }} aria-hidden>
              <g>
                <path fill="#EA4335" d="M10 8.04V11.7h5.74c-.14.96-.98 2.86-3.74 2.86-2.25 0-4.09-1.87-4.09-4.17s1.84-4.18 4.09-4.18c1.27 0 2.13.53 2.62.99l2.13-2.06C16.24 3.5 14.37 2.43 12 2.43c-4.11 0-7.44 3.34-7.44 7.44S7.89 17.3 12 17.3c3.2 0 5.3-2.23 5.3-5.37 0-.36-.04-.65-.09-.91H10z"></path>
                <path fill="#34A853" d="M10 18.6c2.54 0 4.69-.83 6.25-2.27l-2.89-2.27c-.8.53-1.81.84-3.36.84-2.58 0-4.74-1.74-5.5-4.24H1.83v2.67C3.38 16.2 6.48 18.6 10 18.6z"></path>
                <path fill="#4A90E2" d="M4.5 11.3c-.21-.63-.32-1.31-.32-2s.12-1.37.32-1.99V4.63H1.83A8.71 8.71 0 0 0 1.29 10a8.71 8.71 0 0 0 .54 3.37l2.67-2.07z"></path>
                <path fill="#FBBC05" d="M10 3.96c1.33 0 2.34.46 3.06 1.36l2.3-2.27C14.68 1.91 12.75 1 10 1 6.48 1 3.38 3.4 1.83 7.01l2.67 2.07C5.26 5.7 7.43 3.96 10 3.96z"></path>
              </g>
            </svg>
          </span>
          <span style={{ flexGrow: 1 }}>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

import React from "react";
import "./App.css";

/**
 * SortButton - A small, visually accented button to toggle sorting order.
 * Matches Clear button style but smaller. Shows current sort direction (asc/desc).
 *
 * @param {Object} props
 * @param {string} direction - "asc" or "desc" (current state).
 * @param {Function} onToggle - Callback to toggle direction.
 */
 // PUBLIC_INTERFACE
function SortButton({ direction, onToggle }) {
  return (
    <button
      className="btn sort-btn"
      onClick={onToggle}
      aria-label={`Sort by year (${direction === "asc" ? "Ascending" : "Descending"})`}
      title={`Sort by year (${direction === "asc" ? "Ascending" : "Descending"})`}
      style={{
        padding: "0.35em 0.85em",
        fontSize: "14px",
        marginLeft: "3px",
        marginRight: "2px",
        lineHeight: 1.1,
        minWidth: 0,
        borderRadius: "5px",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35em",
        fontWeight: 600,
        verticalAlign: "middle",
        height: "30px"
      }}
      tabIndex={0}
      type="button"
    >
      <span style={{ fontWeight: 700, fontSize: "1em", letterSpacing: "0.01em" }}>
        Year&nbsp;{direction === "asc" ? "↑" : "↓"}
      </span>
    </button>
  );
}

export default SortButton;

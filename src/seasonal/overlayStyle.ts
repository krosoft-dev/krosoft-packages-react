import type React from "react";

/** Calque plein écran au-dessus de tout, qui laisse passer les clics. */
export const OVERLAY_STYLE: React.CSSProperties = {
  position: "fixed",
  width: "100vw",
  height: "100vh",
  top: 0,
  left: 0,
  zIndex: 9999,
  pointerEvents: "none",
};

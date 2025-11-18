"use client"

import "./loading-pulse.css"

export default function LoadingPulse() {
  return (
    <div className="pulse-loading-container">
      <div className="pulse-loading-content">
        <div className="pulse-spinner">
          <div className="pulse-circle"></div>
          <div className="pulse-circle"></div>
          <div className="pulse-circle"></div>
          <div className="pulse-shadow"></div>
          <div className="pulse-shadow"></div>
          <div className="pulse-shadow"></div>
        </div>
        <div className="pulse-text">Cargando su contenido</div>
      </div>
    </div>
  )
}


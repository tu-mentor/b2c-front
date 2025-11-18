"use client"

import "./loading-skeleton.css"

export default function LoadingSkeleton() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton-logo"></div>
        <div className="skeleton-nav">
          <div className="skeleton-nav-item"></div>
          <div className="skeleton-nav-item"></div>
          <div className="skeleton-nav-item"></div>
        </div>
      </div>

      <div className="skeleton-content">
        <div className="skeleton-sidebar">
          <div className="skeleton-sidebar-item"></div>
          <div className="skeleton-sidebar-item"></div>
          <div className="skeleton-sidebar-item"></div>
          <div className="skeleton-sidebar-item"></div>
        </div>

        <div className="skeleton-main">
          <div className="skeleton-title"></div>
          <div className="skeleton-subtitle"></div>

          <div className="skeleton-cards">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>

          <div className="skeleton-text-block">
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line"></div>
          </div>
        </div>
      </div>

      <div className="skeleton-loading-indicator">
        <div className="skeleton-loading-text">Cargando la aplicación</div>
        <div className="skeleton-loading-dots">
          <div className="skeleton-dot"></div>
          <div className="skeleton-dot"></div>
          <div className="skeleton-dot"></div>
        </div>
      </div>
    </div>
  )
}


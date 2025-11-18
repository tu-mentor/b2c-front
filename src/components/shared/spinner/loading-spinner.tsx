"use client"

import { useEffect, useState, memo } from "react"
import "./loading-spinner.css"

// Memoizar el componente para evitar re-renders innecesarios
const LoadingSpinner = memo(function LoadingSpinner() {
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Usar requestAnimationFrame para mejor rendimiento de animación
    let animationFrameId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      if (elapsed < 3000) { // 3 segundos de animación
          const newProgress = Math.min((elapsed / 3000) * 100, 100);
          setProgress(newProgress);
          animationFrameId = requestAnimationFrame(animate);
      } else {
          setProgress(100);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Renderizar el spinner inmediatamente con will-change para mejor rendimiento
  return (
    <div className="loading-container" style={{ willChange: 'transform, opacity' }}>
      <div className="loading-content">
        <div className="spinner-container">
          <div className="spinner-outer" style={{ willChange: 'transform' }}>
            <div className="spinner-inner" style={{ willChange: 'transform' }}></div>
          </div>
        </div>
        <div className="loading-text">Cargando</div>
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${progress}%`,
                willChange: 'width',
                transition: 'width 0.1s ease-out'
              }}
            ></div>
          </div>
          <div className="progress-percentage">{Math.round(progress)}%</div>
        </div>
      </div>
    </div>
  )
})

export default LoadingSpinner


"use client"

import type React from "react"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

interface VideoPopupProps {
  onClose: () => void
  videoSrc: string
  title?: string
  description?: string
}

export default function VideoPopup({
  onClose,
  videoSrc,
  title = "Guía de Usuario",
  description = "Este video muestra paso a paso cómo utilizar nuestra plataforma.",
}: VideoPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 })

  // Close popup when clicking outside the video container
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  // Handle video metadata load to get dimensions
  const handleVideoMetadata = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current
      setVideoDimensions({ width: videoWidth, height: videoHeight })
    }
  }

  // Close popup when pressing Escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscKey)

    // Prevent scrolling of the body when popup is open
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  // Calculate dimensions maintaining aspect ratio
  const calculateDimensions = () => {
    if (videoDimensions.width === 0 || videoDimensions.height === 0) {
      return { width: "80vw", maxWidth: "1200px" }
    }

    const aspectRatio = videoDimensions.width / videoDimensions.height
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const maxWidth = Math.min(windowWidth * 0.8, 1200) // 80% of window width or 1200px
    const maxHeight = windowHeight * 0.8 // 80% of window height

    let width = maxWidth
    let height = width / aspectRatio

    // If height exceeds maximum height, scale down width accordingly
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    return {
      width: `${width}px`,
      maxWidth: "100%",
    }
  }

  const dimensions = calculateDimensions()

  const popup = (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: 9999,
      }}
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "relative",
          width: dimensions.width,
          maxWidth: dimensions.maxWidth,
          backgroundColor: "#000",
          borderRadius: "0.5rem",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 10,
            padding: "0.5rem",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "9999px",
            color: "white",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
          }}
        >
          <X size={24} />
        </button>

        <div style={{ width: "100%", position: "relative" }}>
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
            controls
            autoPlay
            src={videoSrc}
            onLoadedMetadata={handleVideoMetadata}
          >
            <source src={videoSrc} type="video/mp4" />
            Tu navegador no soporta la reproducción de videos.
          </video>
        </div>

        {(title || description) && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
          >
            {title && (
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "white",
                  margin: 0,
                }}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#cbd5e0",
                  marginTop: "0.25rem",
                  margin: 0,
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )

  return createPortal(popup, document.body)
}


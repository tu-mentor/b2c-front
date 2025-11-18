"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Skill = {
  name: string
  score: number
  color: string
}

type DynamicSkillWheelProps = {
  skills: Skill[]
  className?: string
  wheelSize?: number
  textColor?: string
  backgroundColor?: string
}

export default function DynamicSkillWheel({
  skills,
  className = "",
  wheelSize = 0.9,
  textColor = "text-gray-900 dark:text-gray-100",
  backgroundColor = "bg-white dark:bg-gray-800",
}: DynamicSkillWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        const minSize = Math.min(width, height)
        setSize({ width: minSize, height: minSize })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Set the skill with the highest score as the active skill by default
    const highestScoringSkill = skills.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    )
    setActiveSkill(highestScoringSkill)
  }, [skills])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size.width
    canvas.height = size.height

    const centerX = size.width / 2
    const centerY = size.height / 2
    const radius = Math.min(centerX, centerY) * wheelSize

    const totalScore = skills.reduce((sum, skill) => sum + skill.score, 0)

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let startAngle = -Math.PI / 2
      skills.forEach((skill) => {
        const sliceAngle = (2 * Math.PI * skill.score) / totalScore

        // Draw skill segment
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
        ctx.lineTo(centerX, centerY)
        ctx.fillStyle = skill === hoveredSkill ? lightenColor(skill.color, 20) : skill.color
        ctx.fill()

        // Add a subtle shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        // Draw skill name
        const nameRadius = radius * 0.7
        const nameAngle = startAngle + sliceAngle / 2

        // Reset shadow for score percentage
        ctx.shadowColor = 'transparent'

        // Draw score percentage
        const scoreRadius = radius * 0.85
        const scoreX = centerX + Math.cos(nameAngle) * scoreRadius
        const scoreY = centerY + Math.sin(nameAngle) * scoreRadius

        ctx.save()
        ctx.translate(scoreX, scoreY)
        ctx.rotate(nameAngle + Math.PI / 2)
        ctx.fillStyle = "#FFFFFF"
        ctx.font = `bold ${size.width * 0.060}px Arial`
        ctx.textAlign = "center"
        ctx.fillText(`${skill.score}%`, 0, 0)
        ctx.restore()

        startAngle += sliceAngle
      })

      // Draw a glossy overlay
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)")
      gradient.addColorStop(0.8, "rgba(255, 255, 255, 0.1)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    drawWheel()

    // Add hover effect
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const angle = Math.atan2(y - centerY, x - centerX) + Math.PI / 2
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)

      if (distance <= radius) {
        let currentAngle = 0
        const hoveredSkill = skills.find((skill) => {
          const sliceAngle = (2 * Math.PI * skill.score) / totalScore
          currentAngle += sliceAngle
          return angle < currentAngle
        })
        setHoveredSkill(hoveredSkill || null)
      } else {
        setHoveredSkill(null)
      }

      drawWheel()
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", () => {
      setHoveredSkill(null)
      drawWheel()
    })

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", () => {
        setHoveredSkill(null)
        drawWheel()
      })
    }
  }, [skills, size, wheelSize, hoveredSkill])

  const handleClick = () => {
    if (hoveredSkill) {
      setActiveSkill(hoveredSkill)
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`} onClick={handleClick}>
      <canvas ref={canvasRef} className="cursor-pointer" />
      <AnimatePresence>
        {activeSkill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              setActiveSkill(null)
            }}
          >
            <div className={`p-6 rounded-lg ${backgroundColor} ${textColor}`}>
              <h2 className="text-2xl font-bold mb-2">{activeSkill.name}</h2>
              <p className="text-xl">Score: {activeSkill.score}%</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt
  return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`
}
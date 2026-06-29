"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

export function ConfettiTrigger() {
  useEffect(() => {
    const hasVisited = localStorage.getItem("has_visited_crabscart")
    if (!hasVisited) {
      localStorage.setItem("has_visited_crabscart", "true")
      
      // Launch premium custom-colored confetti matching Magicpin theme
      const duration = 3.5 * 1000
      const end = Date.now() + duration

      const frame = () => {
        // Left side launch
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.85 },
          colors: ["#ec2652", "#f43f5e", "#fda4af", "#ffffff", "#1e293b"]
        })
        // Right side launch
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.85 },
          colors: ["#ec2652", "#f43f5e", "#fda4af", "#ffffff", "#1e293b"]
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      
      // Delay slightly for better visual entrance after load
      const timeoutId = setTimeout(frame, 600)
      return () => clearTimeout(timeoutId)
    }
  }, [])

  return null
}

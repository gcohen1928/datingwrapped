"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Define types for the components
type ElementProps = {
  color: string;
  size: number;
  className?: string;
}

// Define type for the element objects
type FloatingElement = {
  id: string;
  type: "heart" | "star";
  color: string;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  rotate: number;
}

// SVG Heart component
const Heart = ({ color, size, className = "" }: ElementProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1"
    />
  </svg>
)

// SVG Star component
const Star = ({ color, size, className = "" }: ElementProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1"
    />
  </svg>
)

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    // Generate random elements only once on component mount
    // Updated with more pastel colors and opacity
    const heartColors = [
      "rgba(255, 182, 193, 0.6)", // Light Pink with opacity
      "rgba(255, 192, 203, 0.5)", // Pink with opacity
      "rgba(255, 105, 180, 0.4)", // Hot Pink with opacity
      "rgba(218, 112, 214, 0.5)", // Orchid with opacity
      "rgba(186, 85, 211, 0.4)", // Medium Orchid with opacity
      "rgba(147, 112, 219, 0.5)", // Medium Purple with opacity
      "rgba(138, 43, 226, 0.3)", // Blue Violet with opacity
      "rgba(216, 191, 216, 0.7)", // Thistle with opacity
    ]

    const starColors = [
      "rgba(255, 215, 0, 0.5)", // Gold with opacity
      "rgba(255, 250, 205, 0.7)", // Lemon Chiffon with opacity
      "rgba(250, 250, 210, 0.6)", // Light Goldenrod with opacity
      "rgba(255, 255, 224, 0.7)", // Light Yellow with opacity
      "rgba(255, 248, 220, 0.6)", // Cornsilk with opacity
      "rgba(255, 255, 240, 0.7)", // Ivory with opacity
      "rgba(240, 255, 240, 0.6)", // Honeydew with opacity
      "rgba(245, 255, 250, 0.7)", // Mint Cream with opacity
    ]

    const newElements: FloatingElement[] = []

    // Create hearts
    for (let i = 0; i < 12; i++) {
      newElements.push({
        id: `heart-${i}`,
        type: "heart",
        color: heartColors[i % heartColors.length],
        size: 20 + Math.random() * 30,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * .5,
        rotate: Math.random() * 360,
      })
    }

    // Create stars
    for (let i = 0; i < 15; i++) {
      newElements.push({
        id: `star-${i}`,
        type: "star",
        color: starColors[i % starColors.length],
        size: 10 + Math.random() * 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 0.5,
        rotate: Math.random() * 360,
      })
    }

    setElements(newElements)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          initial={{
            x: `${element.x}vw`,
            y: `${element.y}vh`,
            rotate: element.rotate,
            opacity: element.type === "star" ? 0.3 : 0,
          }}
          animate={{
            x: [`${element.x}vw`, `${(element.x + 20) % 100}vw`, `${(element.x + 10) % 100}vw`, `${element.x}vw`],
            y: [`${element.y}vh`, `${(element.y + 15) % 100}vh`, `${(element.y - 10) % 100}vh`, `${element.y}vh`],
            rotate: [element.rotate, element.rotate + 180, element.rotate + 360],
            opacity: element.type === "star" ? [0.3, 0.7, 0.5, 0.3] : [0, 0.7, 0.5, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {element.type === "heart" ? (
            <Heart color={element.color} size={element.size} />
          ) : (
            <Star color={element.color} size={element.size} />
          )}
        </motion.div>
      ))}
    </div>
  )
} 
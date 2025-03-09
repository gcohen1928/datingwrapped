"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import FloatingElements from "./floating-elements"
import { useAuth } from "../providers/auth-provider"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Gradient Background with increased opacity for lighter pastel effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-100/80 via-brand-lavender-100/70 to-brand-mint-100/80" />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-lavender-500 mb-6 max-w-4xl font-inter"
          initial={{ opacity: 0, y: 50 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Track Your Love Life with Dating Wrapped
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-brand-lavender-400 mb-12 max-w-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Log dates, see stats, share your story
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="transition-all duration-300"
          >
            {!user ? (
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-brand-lavender-400 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Link>
            ) : (
              <Link
                href="/your-dates"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-lavender-600 hover:bg-brand-lavender-700 md:py-4 md:text-lg md:px-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Your Dates
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1 }}
            className="relative"
          >
            <Link
              href="#features"
              className="text-purple-600 font-medium text-lg underline decoration-2 underline-offset-4 hover:text-purple-800 transition-colors duration-300"
            >
              Learn More
            </Link>
            <motion.span
              className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400"
              animate={{
                scaleX: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
} 
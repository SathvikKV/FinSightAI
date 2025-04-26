"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingQueriesProps {
  className?: string
}

const sampleQueries = [
  { text: "What were Apple's risks in 2022?", emoji: "🍎" },
  { text: "Tesla revenue growth last 3 years", emoji: "🚗" },
  { text: "Microsoft cloud strategy", emoji: "☁️" },
  { text: "Amazon logistics investments", emoji: "📦" },
  { text: "Google AI initiatives", emoji: "🤖" },
  { text: "Netflix content spending", emoji: "🎬" },
  { text: "Facebook privacy concerns", emoji: "👤" },
  { text: "JPMorgan acquisition strategy", emoji: "💰" },
  { text: "Disney streaming services", emoji: "✨" },
  { text: "Walmart e-commerce growth", emoji: "🛒" },
]

export default function FloatingQueries({ className }: FloatingQueriesProps) {
  const router = useRouter()
  const [queries, setQueries] = useState(sampleQueries.slice(0, 6))
  const [visibleQueries, setVisibleQueries] = useState(6)

  // Adjust number of visible queries based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleQueries(3)
      } else if (window.innerWidth < 1024) {
        setVisibleQueries(4)
      } else {
        setVisibleQueries(6)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Rotate queries every 10 seconds
    const interval = setInterval(() => {
      setQueries((prev) => {
        const newQueries = [...prev]
        // Remove first query and add a random one from the sample that's not already in the list
        const removed = newQueries.shift()
        const available = sampleQueries.filter(
          (q) => !newQueries.some((nq) => nq.text === q.text) && q.text !== removed?.text,
        )
        if (available.length > 0) {
          const randomIndex = Math.floor(Math.random() * available.length)
          newQueries.push(available[randomIndex])
        } else {
          newQueries.push(sampleQueries[Math.floor(Math.random() * sampleQueries.length)])
        }
        return newQueries
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleQueryClick = (query: string) => {
    router.push(`/query?query=${encodeURIComponent(query)}`)
  }

  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
      {queries.slice(0, visibleQueries).map((query, index) => (
        <motion.button
          key={`${query.text}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-100 px-3 py-2 rounded-full 
                    border border-blue-500/30 backdrop-blur-sm flex items-center gap-2 
                    transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
          onClick={() => handleQueryClick(query.text)}
        >
          <span>{query.emoji}</span>
          <span className="line-clamp-1">{query.text}</span>
        </motion.button>
      ))}
    </div>
  )
}

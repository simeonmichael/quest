"use client"

import { useState, useEffect, useCallback } from "react"

export function useCountdownTimer(expiresAt: number | string | undefined, onExpired?: () => void) {
  const [timeLeft, setTimeLeft] = useState<string>("00:00")
  const [percentage, setPercentage] = useState(100)
  const [isExpired, setIsExpired] = useState(false)

  const calculateAndUpdateTime = useCallback(() => {
    if (!expiresAt) {
      setTimeLeft("00:00")
      setPercentage(0)
      return
    }

    const expiresAtMs = typeof expiresAt === "string" ? Number.parseInt(expiresAt, 10) : expiresAt

    if (isNaN(expiresAtMs)) {
      setTimeLeft("00:00")
      setPercentage(0)
      return
    }

    const now = Date.now()
    const secondsLeft = Math.max(0, Math.floor((expiresAtMs - now) / 1000))
    const initialSeconds = Math.floor((expiresAtMs - now) / 1000)

    if (secondsLeft === 0) {
      setTimeLeft("00:00")
      setPercentage(0)
      setIsExpired(true)
      onExpired?.()
      return
    }

    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`)

    // Calculate percentage for progress bar
    const percent = Math.max(0, (secondsLeft / initialSeconds) * 100)
    setPercentage(percent)
  }, [expiresAt, onExpired])

  useEffect(() => {
    calculateAndUpdateTime()
    const interval = setInterval(calculateAndUpdateTime, 100)

    return () => clearInterval(interval)
  }, [calculateAndUpdateTime])

  return { timeLeft, percentage, isExpired }
}

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useCountdownTimer } from "@/hooks/use-countdown-timer"
import QuestionForm from "@/components/audience/question-form"

interface SessionData {
  id: string
  name: string
  createdAt: number
  expiresAt: number
  questions: any[]
}

export default function AskPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setSessionData(data)
          const now = Date.now()
          if (now > data.expiresAt) {
            setIsExpired(true)
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error)
      }
    }

    fetchSession()

    const interval = setInterval(fetchSession, 1000)
    return () => clearInterval(interval)
  }, [sessionId])

  const { timeLeft } = useCountdownTimer(sessionData?.expiresAt || Date.now())

  const handleSubmitQuestion = async (askerName: string, questionText: string) => {
    if (!sessionData || isExpired) return

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          text: questionText,
          askerName,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
      } else if (response.status === 410) {
        setIsExpired(true)
      }
    } catch (error) {
      console.error("Error submitting question:", error)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <QuestionForm
        sessionName={sessionData?.name}
        isExpired={isExpired}
        submitted={submitted}
        timeLeft={timeLeft}
        onSubmit={handleSubmitQuestion}
      />
    </div>
  )
}

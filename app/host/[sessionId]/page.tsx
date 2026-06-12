"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import HostDashboard from "@/components/host/host-dashboard"

interface SessionData {
  id: string
  name: string
  createdAt: number
  expiresAt: number
  questions: Question[]
}

interface Question {
  id: string
  text: string
  askerName: string
  timestamp: number
  answered: boolean
}

export default function HostPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
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

    const interval = setInterval(fetchSession, 500)
    return () => clearInterval(interval)
  }, [sessionId])

  const handleCopyLink = () => {
    const audienceLink = `${typeof window !== "undefined" ? window.location.origin : ""}/ask/${sessionId}`
    navigator.clipboard.writeText(audienceLink)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleToggleAnswered = async (questionId: string) => {
    if (!sessionData) return
    const question = sessionData.questions.find((q) => q.id === questionId)
    if (question) {
      try {
        const response = await fetch(`/api/questions/${questionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            answered: !question.answered,
          }),
        })
        if (response.ok) {
          const updated = await response.json()
          setSessionData(updated)
        }
      } catch (error) {
        console.error("Error updating question:", error)
      }
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
      if (response.ok) {
        const updated = await response.json()
        setSessionData(updated)
      }
    } catch (error) {
      console.error("Error deleting question:", error)
    }
  }

  if (!mounted || !sessionData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading session...</div>
      </div>
    )
  }

  const audienceLink = `${typeof window !== "undefined" ? window.location.origin : ""}/ask/${sessionId}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <HostDashboard
        sessionData={sessionData}
        audienceLink={audienceLink}
        isExpired={isExpired}
        copySuccess={copySuccess}
        onCopyLink={handleCopyLink}
        onToggleAnswered={handleToggleAnswered}
        onDeleteQuestion={handleDeleteQuestion}
      />
    </div>
  )
}

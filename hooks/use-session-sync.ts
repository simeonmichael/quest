"use client"

import { useEffect, useState, useRef, useCallback } from "react"

export interface SessionData {
  id: string
  name: string
  createdAt: number
  expiresAt: number
  questions: Question[]
}

export interface Question {
  id: string
  text: string
  askerName: string
  timestamp: number
  answered: boolean
}

export function useSessionSync(sessionId: string, pollInterval = 500) {
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [newQuestionsCount, setNewQuestionsCount] = useState(0)
  const previousCountRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  const updateSession = useCallback(() => {
    const data = localStorage.getItem(`session_${sessionId}`)
    if (data) {
      const session = JSON.parse(data)
      const now = Date.now()

      if (now > session.expiresAt) {
        setIsExpired(true)
      } else {
        setSessionData(session)

        // Track new questions for animation purposes
        if (session.questions.length > previousCountRef.current) {
          setNewQuestionsCount(session.questions.length - previousCountRef.current)
        }
        previousCountRef.current = session.questions.length
      }
    }
  }, [sessionId])

  useEffect(() => {
    // Initial load
    updateSession()

    // Poll for updates
    intervalRef.current = setInterval(updateSession, pollInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [sessionId, pollInterval, updateSession])

  const addQuestion = useCallback(
    (question: Question) => {
      if (!sessionData) return

      const updated = {
        ...sessionData,
        questions: [...sessionData.questions, question],
      }

      setSessionData(updated)
      localStorage.setItem(`session_${sessionId}`, JSON.stringify(updated))
    },
    [sessionData, sessionId],
  )

  const updateQuestion = useCallback(
    (questionId: string, updates: Partial<Question>) => {
      if (!sessionData) return

      const updated = {
        ...sessionData,
        questions: sessionData.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
      }

      setSessionData(updated)
      localStorage.setItem(`session_${sessionId}`, JSON.stringify(updated))
    },
    [sessionData, sessionId],
  )

  const deleteQuestion = useCallback(
    (questionId: string) => {
      if (!sessionData) return

      const updated = {
        ...sessionData,
        questions: sessionData.questions.filter((q) => q.id !== questionId),
      }

      setSessionData(updated)
      localStorage.setItem(`session_${sessionId}`, JSON.stringify(updated))
    },
    [sessionData, sessionId],
  )

  return {
    sessionData,
    isExpired,
    newQuestionsCount,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  }
}

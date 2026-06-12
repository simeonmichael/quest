"use client"

import { useState, useEffect } from "react"
import { Trash2, CheckCircle2, Circle } from "lucide-react"

interface Question {
  id: string
  text: string
  askerName: string
  timestamp: number
  answered: boolean
}

interface Props {
  questions: Question[]
  onToggleAnswered: (questionId: string) => void
  onDeleteQuestion: (questionId: string) => void
  isExpired?: boolean
}

export default function QuestionList({ questions, onToggleAnswered, onDeleteQuestion, isExpired = false }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)

    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  if (!mounted) return null

  if (questions.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-slate-400 text-lg">
          {isExpired
            ? "Session has ended. No more questions can be submitted."
            : "No questions yet. Share the link with your audience to get started."}
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-700">
      {questions.map((question, idx) => (
        <div
          key={question.id}
          className={`p-6 transition-colors duration-200 ${isExpired ? "opacity-75" : "hover:bg-slate-800/50"}`}
          style={{
            animation: `fadeInScale 0.4s ease-out ${idx * 50}ms both`,
          }}
        >
          <div className="flex gap-4">
            <button
              onClick={() => onToggleAnswered(question.id)}
              className="flex-shrink-0 mt-1 text-slate-400 hover:text-indigo-400 transition-colors duration-150 disabled:opacity-50"
              title={isExpired ? "Session ended" : question.answered ? "Mark as pending" : "Mark as answered"}
              disabled={isExpired}
            >
              {question.answered ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6" />}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div>
                  <p className="text-slate-300 font-semibold">{question.askerName || "Anonymous"}</p>
                  <p className="text-slate-500 text-xs">{formatTime(question.timestamp)}</p>
                </div>
                {question.answered && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold w-fit animate-pulse">
                    ✓ Answered
                  </span>
                )}
              </div>
              <p className="text-slate-200 leading-relaxed break-words">{question.text}</p>
            </div>

            <button
              onClick={() => onDeleteQuestion(question.id)}
              className="flex-shrink-0 text-slate-400 hover:text-red-400 transition-colors duration-150 disabled:opacity-50"
              title={isExpired ? "Session ended" : "Delete question"}
              disabled={isExpired}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

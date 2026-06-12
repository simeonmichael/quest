"use client"

import { useMemo } from "react"
import Link from "next/link"
import QuestionList from "./question-list"
import SessionHeader from "./session-header"

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

interface Props {
  sessionData: SessionData
  audienceLink: string
  isExpired: boolean
  copySuccess: boolean
  onCopyLink: () => void
  onToggleAnswered: (questionId: string) => void
  onDeleteQuestion: (questionId: string) => void
}

export default function HostDashboard({
  sessionData,
  audienceLink,
  isExpired,
  copySuccess,
  onCopyLink,
  onToggleAnswered,
  onDeleteQuestion,
}: Props) {
  const stats = useMemo(() => {
    return {
      total: sessionData.questions.length,
      answered: sessionData.questions.filter((q) => q.answered).length,
      pending: sessionData.questions.filter((q) => !q.answered).length,
    }
  }, [sessionData.questions])

  const recentQuestions = [...sessionData.questions]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <SessionHeader
          sessionName={sessionData.name}
          isExpired={isExpired}
          audienceLink={audienceLink}
          copySuccess={copySuccess}
          expiresAt={sessionData.expiresAt}
          onCopyLink={onCopyLink}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Questions", value: stats.total, color: "indigo" },
            { label: "Answered", value: stats.answered, color: "green" },
            { label: "Pending", value: stats.pending, color: "amber" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-6 flex flex-col items-center justify-center">
              <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
              <p
                className={`text-4xl font-bold ${
                  stat.color === "indigo"
                    ? "text-indigo-400"
                    : stat.color === "green"
                      ? "text-green-400"
                      : "text-amber-400"
                }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Questions */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4">
            <h2 className="text-xl font-bold text-slate-50 flex items-center gap-2">
              <span>Live Questions</span>
              {stats.pending > 0 && !isExpired && (
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full animate-pulse">
                  {stats.pending}
                </span>
              )}
              {isExpired && <span className="text-xs font-semibold text-red-400 ml-2">(Closed)</span>}
            </h2>
          </div>
          <QuestionList
            questions={recentQuestions}
            onToggleAnswered={onToggleAnswered}
            onDeleteQuestion={onDeleteQuestion}
            isExpired={isExpired}
          />
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-slate-400 hover:text-slate-300 text-sm transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

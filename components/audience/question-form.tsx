"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, Clock, AlertCircle } from "lucide-react"

interface Props {
  sessionName?: string
  isExpired: boolean
  submitted: boolean
  timeLeft: string
  onSubmit: (askerName: string, questionText: string) => void
}

export default function QuestionForm({ sessionName, isExpired, submitted, timeLeft, onSubmit }: Props) {
  const [askerName, setAskerName] = useState("")
  const [questionText, setQuestionText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim() || isExpired || isSubmitting) return

    setIsSubmitting(true)
    onSubmit(askerName || "Anonymous", questionText)
    setQuestionText("")
    setAskerName("")
    setIsSubmitting(false)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Session Info */}
        <div className="text-center mb-8 animate-fade-in-scale">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Quest
          </h1>
          {sessionName && <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">{sessionName}</h2>}
        </div>

        {/* Status */}
        {isExpired ? (
          <div className="glass-dark rounded-2xl p-8 mb-8 border-red-500/30 flex flex-col items-center gap-4 animate-fade-in-scale">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-red-400 mb-2">Session Expired</h3>
              <p className="text-slate-400">This Q&A session has ended. No more questions can be submitted.</p>
            </div>
          </div>
        ) : (
          timeLeft && (
            <div className="glass-dark rounded-lg px-4 py-3 mb-8 flex items-center justify-center gap-2 animate-fade-in-scale">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-semibold">Time remaining: {timeLeft}</span>
            </div>
          )
        )}

        {/* Form */}
        <div className="glass rounded-2xl p-8 animate-fade-in-scale">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-3">Your Name (Optional)</label>
              <input
                type="text"
                value={askerName}
                onChange={(e) => setAskerName(e.target.value)}
                placeholder="John Doe"
                disabled={isExpired}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-3">Your Question</label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask your question here..."
                disabled={isExpired}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isExpired || !questionText.trim() || isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {submitted ? "Question Submitted!" : "Submit Question"}
            </button>

            {submitted && (
              <div className="glass-dark rounded-lg px-4 py-3 border-green-500/30 text-center animate-fade-in-scale">
                <p className="text-green-400 font-semibold">✓ Your question has been posted!</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">Questions appear in real-time on the host's screen</p>
        </div>
      </div>
    </div>
  )
}

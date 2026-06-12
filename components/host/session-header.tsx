"use client"

import { useState, useEffect } from "react"
import { Copy, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { useCountdownTimer } from "@/hooks/use-countdown-timer"

interface Props {
  sessionName: string
  isExpired: boolean
  audienceLink: string
  copySuccess: boolean
  expiresAt: number
  onCopyLink: () => void
}

export default function SessionHeader({
  sessionName,
  isExpired,
  audienceLink,
  copySuccess,
  expiresAt,
  onCopyLink,
}: Props) {
  const [mounted, setMounted] = useState(false)
  const { timeLeft, percentage } = useCountdownTimer(expiresAt)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isWarning = percentage < 20 && !isExpired
  const isCritical = percentage < 5 && !isExpired

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-50 mb-2">{sessionName}</h1>
          <div className="flex items-center gap-2">
            {isExpired ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Session Expired
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  isCritical
                    ? "bg-red-500/20 text-red-400 animate-pulse"
                    : isWarning
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-green-500/20 text-green-400"
                }`}
              >
                <Clock className="w-4 h-4" />
                {timeLeft} remaining
              </span>
            )}
          </div>
        </div>

        {!isExpired && (
          <button onClick={onCopyLink} className="flex items-center gap-2 btn-primary whitespace-nowrap">
            {copySuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Audience Link
              </>
            )}
          </button>
        )}
      </div>

      {!isExpired && (
        <div className="space-y-3">
          <div className="glass rounded-lg px-4 py-3 flex items-center gap-2 overflow-x-auto">
            <span className="text-slate-400 text-sm font-medium flex-shrink-0">Share:</span>
            <code className="text-slate-300 text-sm font-mono truncate">{audienceLink}</code>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-gradient-to-r from-indigo-500 to-pink-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

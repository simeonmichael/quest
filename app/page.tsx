"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [sessionName, setSessionName] = useState("")
  const [durationMinutes, setDurationMinutes] = useState("30")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionName.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sessionName,
          durationMinutes: Number(durationMinutes),
        }),
      })

      if (!response.ok) throw new Error("Failed to create session")

      const session = await response.json()
      router.push(`/host/${session.id}`)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to create session")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left side - Hero */}
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Quest
              </h1>
              <p className="text-slate-400 text-lg mt-2">Real-time Q&A for events</p>
            </div>

            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Engage your audience instantly. Hosts create a shareable link, audiences ask questions live, and you see
              everything in real-time with beautiful animations.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: "⚡", label: "Real-time questions" },
                { icon: "🎨", label: "Beautiful animations" },
                { icon: "⏱️", label: "Auto-expiring links" },
              ].map((feature) => (
                <div key={feature.label} className="flex items-center gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-slate-300">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Create Session Form */}
          <div className="flex items-center justify-center">
            <div className="glass rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-slate-50">Start Hosting</h2>

              <form onSubmit={handleCreateSession} className="space-y-5">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Session Name</label>
                  <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="e.g., Q&A with Engineers"
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Link Expiration</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="240">4 hours</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !sessionName.trim()}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base"
                >
                  {isLoading ? "Creating..." : "Create Session"}
                </button>

                <p className="text-slate-500 text-xs text-center mt-4">You'll get a shareable link after creation</p>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">Built for seamless audience engagement • No sign-up required</p>
        </div>
      </div>
    </div>
  )
}

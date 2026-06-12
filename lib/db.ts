import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {}
      },
    },
  })
}

export async function getSession(sessionId: string) {
  const supabase = await getSupabaseClient()

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single()

  if (sessionError || !session) return null

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("session_id", sessionId)
    .order("timestamp", { ascending: false })

  if (questionsError) return null

  return {
    id: session.id,
    name: session.name,
    createdAt: session.created_at,
    expiresAt: session.expires_at,
    questions: (questions || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      askerName: q.asker_name,
      timestamp: q.timestamp,
      answered: q.answered,
    })),
  }
}

export async function createSession(sessionId: string, name: string, expiresAt: number) {
  const supabase = await getSupabaseClient()
  const now = Date.now()

  const { error } = await supabase.from("sessions").insert({
    id: sessionId,
    name,
    created_at: now,
    expires_at: expiresAt,
    created_at_iso: new Date(now).toISOString(),
  })

  if (error) throw error

  return getSession(sessionId)
}

export async function addQuestion(
  sessionId: string,
  questionId: string,
  text: string,
  askerName: string,
  timestamp: number,
) {
  const supabase = await getSupabaseClient()
  const now = Date.now()

  const { error } = await supabase.from("questions").insert({
    id: questionId,
    session_id: sessionId,
    text,
    asker_name: askerName,
    timestamp,
    answered: false,
    created_at: now,
  })

  if (error) throw error

  return getSession(sessionId)
}

export async function updateQuestion(sessionId: string, questionId: string, updates: { answered?: boolean }) {
  const supabase = await getSupabaseClient()

  if (updates.answered !== undefined) {
    const { error } = await supabase
      .from("questions")
      .update({ answered: updates.answered })
      .eq("id", questionId)
      .eq("session_id", sessionId)

    if (error) throw error
  }

  return getSession(sessionId)
}

export async function deleteQuestion(sessionId: string, questionId: string) {
  const supabase = await getSupabaseClient()

  const { error } = await supabase.from("questions").delete().eq("id", questionId).eq("session_id", sessionId)

  if (error) throw error

  return getSession(sessionId)
}

export async function deleteExpiredSessions() {
  const supabase = await getSupabaseClient()
  const now = Date.now()

  const { error } = await supabase.from("sessions").delete().lt("expires_at", now)

  if (error) console.error("Error deleting expired sessions:", error)
}

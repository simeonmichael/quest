import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, text, askerName } = await request.json()

    if (!sessionId || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if session exists and is not expired
    const { data: session, error: sessionError } = await supabase.from("sessions").select().eq("id", sessionId).single()

    if (sessionError) throw sessionError

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const now = Date.now()
    if (now > session.expires_at) {
      return NextResponse.json({ error: "Session has expired" }, { status: 410 })
    }

    // Insert new question
    const questionId = Date.now().toString()
    const { data: question, error: questionError } = await supabase
      .from("questions")
      .insert({
        id: questionId,
        session_id: sessionId,
        text,
        asker_name: askerName || "Anonymous",
        created_at: now,
      })
      .select()
      .single()

    if (questionError) throw questionError

    return NextResponse.json(question)
  } catch (error) {
    console.error("Error adding question:", error)
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 })
  }
}

import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params

    const supabase = await createClient()
    const { data: session, error: sessionError } = await supabase.from("sessions").select().eq("id", sessionId).single()

    if (sessionError) throw sessionError

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select()
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })

    if (questionsError) throw questionsError

    const transformedQuestions = (questions || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      askerName: q.asker_name || "Anonymous",
      timestamp: new Date(q.created_at).getTime(),
      answered: q.answered || false,
    }))

    return NextResponse.json({
      id: session.id,
      name: session.name,
      createdAt: new Date(session.created_at).getTime(),
      expiresAt: new Date(session.expires_at).getTime(),
      questions: transformedQuestions,
    })
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}

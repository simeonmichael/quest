import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const { questionId } = await params
    const { answered, sessionId } = await request.json()

    const supabase = await createClient()

    const { error } = await supabase.from("questions").update({ answered }).eq("id", questionId)

    if (error) throw error

    const { data: session, error: sessionError } = await supabase.from("sessions").select().eq("id", sessionId).single()

    if (sessionError) throw sessionError

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
    console.error("Error updating question:", error)
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const { questionId } = await params
    const { sessionId } = await request.json()

    const supabase = await createClient()

    const { error } = await supabase.from("questions").delete().eq("id", questionId)

    if (error) throw error

    const { data: session, error: sessionError } = await supabase.from("sessions").select().eq("id", sessionId).single()

    if (sessionError) throw sessionError

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
    console.error("Error deleting question:", error)
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 })
  }
}

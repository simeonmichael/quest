import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, durationMinutes } = await request.json()

    if (!name || !durationMinutes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()
    const sessionId = Math.random().toString(36).substring(2, 9)
    const createdAt = Date.now()
    const expiresAt = createdAt + Number(durationMinutes) * 60 * 1000

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        id: sessionId,
        name,
        created_at: createdAt,
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

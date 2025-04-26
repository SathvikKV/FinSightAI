import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, top_k, form_type } = body

    // Call your FastAPI backend
    const response = await fetch(`${process.env.API_BASE_URL}/rag_answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        top_k,
        form_type,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ answer: data })
  } catch (error) {
    console.error("Error in rag-answer route:", error)
    return NextResponse.json({ error: "Failed to generate AI answer" }, { status: 500 })
  }
}

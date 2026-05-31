import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ reply: "API key not configured!" })
    }

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `You are an expert AI fitness coach for Axis Fitness app. 
              Help users with:
              - Exercise form and technique
              - Muscle groups and anatomy
              - Workout programming and splits
              - Injury prevention and recovery
              - Nutrition basics
              - Motivation and mindset
              Keep responses concise, friendly and practical. 
              Use emojis occasionally. Always prioritize safety.`
            }]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
          }
        })
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Gemini error:', data)
      return NextResponse.json({ 
        reply: `Error: ${data.error?.message || 'Unknown error'}` 
      })
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || "Sorry I couldn't get a response. Please try again!"

    return NextResponse.json({ reply })

  } catch (error: any) {
    console.error('Coach API error:', error)
    return NextResponse.json({ reply: `Error: ${error.message}` })
  }
}
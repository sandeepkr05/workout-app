import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { messages } = await request.json()

  const lastMessage = messages[messages.length - 1].content
  const history = messages.slice(0, -1).map((m: any) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: `You are an expert AI fitness coach for Axis Fitness app.
            You help users with:
            - Exercise form and technique
            - Muscle groups and anatomy  
            - Workout programming and splits
            - Injury prevention and recovery
            - Nutrition basics
            - Motivation and mindset
            Keep responses concise, friendly and practical. Use emojis occasionally.
            Always prioritize safety and proper form.`
          }]
        },
        contents: [
          ...history,
          {
            role: 'user',
            parts: [{ text: lastMessage }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        }
      })
    }
  )

  const data = await response.json()
  
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text 
    || "Sorry, I couldn't get a response. Please try again!"

  return NextResponse.json({ reply })
}
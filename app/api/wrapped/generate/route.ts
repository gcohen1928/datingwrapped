import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SlideTemplate } from '../../../wrapped/default-slides'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const systemPrompt = `You are an expert data analyst and storyteller. Your task is to analyze dating history data and generate content for specific slides in a "Dating Wrapped" presentation.

For each slide template provided, analyze the date entries and generate relevant data and insights.
Each slide should be unique and interesting, focusing specifically on the topic described in the template.

Keep the tone light and engaging while being respectful and appropriate.

Return the response as a JSON object with a 'slides' array, where each slide contains:
{
  "id": string (matching the template ID),
  "title": string (matching the template title),
  "description": string (matching the template description),
  "type": string (matching the template type),
  "data": object (containing relevant statistics and information for this slide)
}`

export async function POST(request: Request) {
  try {
    const { dateEntries, selectedTemplates } = await request.json()

    if (!dateEntries || !Array.isArray(dateEntries)) {
      return new NextResponse('Invalid date entries', { status: 400 })
    }

    if (!selectedTemplates || !Array.isArray(selectedTemplates)) {
      return new NextResponse('Invalid slide templates', { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            dateEntries,
            selectedTemplates,
            request: "Please analyze these date entries and generate content for each selected slide template. Follow the format specified in the system prompt."
          })
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    if (!completion.choices[0].message.content) {
      throw new Error('No content received from OpenAI')
    }

    const rawSlides = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json({ slides: rawSlides.slides })
  } catch (error) {
    console.error('Error generating slides:', error)
    return new NextResponse(
      'Error generating slides',
      { status: 500 }
    )
  }
} 
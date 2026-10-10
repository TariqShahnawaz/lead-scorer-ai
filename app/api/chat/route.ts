import { google } from '@ai-sdk/google'
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from 'ai'
import { scoreLead } from '@/lib/tools'

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY. Add your Google AI API key to .env.local and restart the dev server.' },
      { status: 503 },
    )
  }

  const result = streamText({
    model: google('gemini-3.5-flash'),
    system: `You are a sales lead scoring assistant.
    When a user provides lead information, use the scoreLead tool
    to analyze and score the lead. Always use the tool when you
    have enough information to score a lead.`,
    messages: await convertToModelMessages(messages, {
      tools: { scoreLead },
    }),
    tools: {
      scoreLead,
    },
    stopWhen: stepCountIs(3),
  })

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error)

      if (/quota|resource_exhausted|limit exceeded|credits?/i.test(message)) {
        return 'Google AI quota exceeded. Check your usage and billing, or wait for the quota to reset.'
      }

      if (/api key not valid|invalid api key/i.test(message)) {
        return 'The Google AI API key is invalid. Update GOOGLE_GENERATIVE_AI_API_KEY in .env.local and restart the dev server.'
      }

      return 'Google AI could not score this lead. Check the dev server logs for details and try again.'
    },
  })
}
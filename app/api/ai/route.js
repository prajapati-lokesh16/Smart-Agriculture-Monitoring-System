import { NextResponse } from 'next/server';

// POST /api/ai
export async function POST(request) {
  try {
    const { message, context } = await request.json();

    // build payload to AI model (Gemini/OpenAI)
    const body = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert IoT agriculture assistant. Provide concise, actionable advice for the farmer based on incoming sensor data and questions.',
        },
        { role: 'user', content: message },
      ],
      // optionally include context for automated insights
      ...(context && { context }),
    };

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const result = await resp.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error('AI route error', err);
    return NextResponse.json({ error: 'Failed to contact AI' }, { status: 500 });
  }
}

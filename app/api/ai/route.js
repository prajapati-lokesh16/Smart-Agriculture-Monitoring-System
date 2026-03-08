import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, context } = await request.json();

    // Gemini API URL (Google ka direct endpoint)
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Prompt build karna (Context + Message)
    const systemPrompt = "You are an expert IoT agriculture assistant. Provide concise, actionable advice for the farmer based on incoming sensor data and questions.";
    const userPrompt = context 
      ? `Context (Sensor Data): ${JSON.stringify(context)}\n\nQuestion: ${message}`
      : message;

    const body = {
      contents: [{
        parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
      }]
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });

    const result = await resp.json();

    // Gemini ka response structure OpenAI se alag hota hai, 
    // hum use OpenAI ke format mein convert karke bhej rahe hain
    const aiResponse = result.candidates[0].content.parts[0].text;

    return NextResponse.json({
      choices: [
        {
          message: {
            content: aiResponse,
          },
        },
      ],
    });
  } catch (err) {
    console.error('Gemini API route error', err);
    return NextResponse.json({ error: 'Failed to contact Gemini' }, { status: 500 });
  }
}
}
}

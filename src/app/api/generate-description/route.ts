import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { eventName, eventType } = await req.json();

    if (!eventName) {
      return NextResponse.json(
        { error: "Event name is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert event planner and copywriter. Generate an engaging and professional event description that will attract attendees.
          The description should be between 150-200 words and include:
          - A compelling introduction
          - Key event highlights
          - What attendees will experience
          - Why they should attend
          Use a professional but engaging tone.`,
        },
        {
          role: "user",
          content: `Generate a description for an event titled: "${eventName}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const description = completion.choices[0].message.content;

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Only POST requests allowed" }, { status: 405 });
    }

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an architecture assistant." },
          {
            role: "user",
            content: [
              { type: "text", text: "Generate a black-and-white schematic elevation of this tiny house." },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    if (!gptResponse.ok) {
      const errorData = await gptResponse.json();
      return NextResponse.json({ error: "GPT API error", details: errorData }, { status: gptResponse.status });
    }

    const gptData = await gptResponse.json();
    if (!gptData.choices?.[0]?.message?.content) {
      return NextResponse.json({ error: "Invalid GPT response format" }, { status: 500 });
    }

    const prompt = gptData.choices[0].message.content;

    const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1024",
        n: 1
      })
    });

    if (!dalleResponse.ok) {
      const errorData = await dalleResponse.json();
      return NextResponse.json({ error: "DALL-E API error", details: errorData }, { status: dalleResponse.status });
    }

    const dalleData = await dalleResponse.json();
    if (!dalleData.data?.[0]?.url) {
      return NextResponse.json({ error: "Invalid DALL-E response format" }, { status: 500 });
    }

    return NextResponse.json({ schematicUrl: dalleData.data[0].url });
  } catch (error) {
    console.error("Schematic generation error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

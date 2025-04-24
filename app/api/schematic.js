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

    // STEP 1: Use GPT-4o to turn the image into a prompt
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
              { type: "text", text: "Create a prompt for a black-and-white architectural schematic elevation of this tiny house." },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    if (!gptResponse.ok) {
      const gptError = await gptResponse.text();
      return NextResponse.json({ error: "GPT-4o failed", details: gptError }, { status: 500 });
    }

    const gptData = await gptResponse.json();
    const schematicPrompt = gptData.choices[0].message.content;

    // STEP 2: Feed that prompt to DALL·E
    const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: schematicPrompt,
        size: "1024x1024",
        n: 1
      })
    });

    if (!dalleResponse.ok) {
      const dalleError = await dalleResponse.text();
      return NextResponse.json({ error: "DALL·E error", details: dalleError }, { status: 500 });
    }

    const dalleData = await dalleResponse.json();
    return NextResponse.json({ schematicUrl: dalleData.data[0].url });

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}

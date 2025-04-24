import { NextResponse } from "next/server";

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new NextResponse(
        JSON.stringify({ error: "Only POST requests allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { imageUrl } = body;
    if (!imageUrl) {
      return new NextResponse(
        JSON.stringify({ error: "imageUrl is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // STEP 1: Use GPT-4o to create a custom DALL·E prompt
    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an architectural assistant that converts tiny house images into schematic drawing prompts." },
          {
            role: "user",
            content: [
              { type: "text", text: "Create a prompt for a black-and-white architectural schematic elevation of this modern tiny house." },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ]
      })
    });

    if (!gptResponse.ok) {
      const errorText = await gptResponse.text();
      return new NextResponse(
        JSON.stringify({ error: "GPT-4o failed", details: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const gptData = await gptResponse.json();
    const prompt = gptData?.choices?.[0]?.message?.content?.trim();
    if (!prompt) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid GPT-4o response (no prompt generated)" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // STEP 2: Send the prompt to DALL·E
    const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
        n: 1
      })
    });

    if (!dalleResponse.ok) {
      const dalleText = await dalleResponse.text();
      return new NextResponse(
        JSON.stringify({ error: "DALL·E error", details: dalleText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const dalleData = await dalleResponse.json();
    const schematicUrl = dalleData?.data?.[0]?.url;

    if (!schematicUrl) {
      return new NextResponse(
        JSON.stringify({ error: "No image returned from DALL·E" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ schematicUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Schematic generation error:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

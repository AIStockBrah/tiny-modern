import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

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

    // Generate the schematic using DALL-E
    const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a black-and-white architectural schematic elevation of this tiny house. Focus on clean lines, technical details, and proper architectural drafting conventions.`,
        size: "1024x1024",
        n: 1
      })
    });

    if (!dalleResponse.ok) {
      const errorData = await dalleResponse.json();
      return new NextResponse(
        JSON.stringify({ 
          error: "DALL-E API error", 
          details: errorData 
        }),
        { status: dalleResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const dalleData = await dalleResponse.json();
    if (!dalleData.data?.[0]?.url) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid DALL-E response format" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ schematicUrl: dalleData.data[0].url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Schematic generation error:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

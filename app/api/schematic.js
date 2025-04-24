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

    // First, generate the schematic using DALL-E directly
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
      return NextResponse.json({ 
        error: "DALL-E API error", 
        details: errorData 
      }, { 
        status: dalleResponse.status 
      });
    }

    const dalleData = await dalleResponse.json();
    if (!dalleData.data?.[0]?.url) {
      return NextResponse.json({ 
        error: "Invalid DALL-E response format" 
      }, { 
        status: 500 
      });
    }

    return NextResponse.json({ 
      schematicUrl: dalleData.data[0].url 
    });
  } catch (error) {
    console.error("Schematic generation error:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { 
      status: 500 
    });
  }
}

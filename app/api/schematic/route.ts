import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const imageUrl = body?.imageUrl;
    const viewType = body?.viewType || 'schematic';

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    const viewTypePrompts = {
      floorplan: "Create a top-down architectural floor plan layout that matches the style and proportions of this modern tiny house. Maintain the same architectural language, materials, and design elements seen in the original image. Show walls, rooms, and entry in a clean minimalist style with the same proportions and spatial relationships as the original design.",
      schematic: "Generate a black-and-white architectural drawing that captures the exact proportions, materials, and design elements of this modern tiny house. Create four orthographic views (floor plan, front elevation, side elevation, and section) that precisely match the original design's dimensions and architectural features. Use a clean technical drawing grid with accurate dimensions and linework that reflects the original building's style.",
      render3d: "Render a 3D isometric cutaway view that maintains the exact proportions, materials, and architectural features of this tiny house. Show the interior layout with furniture and walls while preserving the original design's spatial relationships and aesthetic qualities. Match the original image's style, materials, and architectural language in the 3D representation."
    };

    // STEP 1: Use GPT-4o to generate schematic prompt
    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an architectural assistant that creates schematic prompts for AI rendering. Your task is to analyze the original image and create prompts that will generate views that match its exact style, proportions, and design elements." },
          {
            role: "user",
            content: [
              { type: "text", text: viewTypePrompts[viewType as keyof typeof viewTypePrompts] },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ]
      })
    });

    if (!gptResponse.ok) {
      const errorText = await gptResponse.text();
      return NextResponse.json({ error: "GPT-4o failed", details: errorText }, { status: 500 });
    }

    const gptData = await gptResponse.json();
    const schematicPrompt = gptData?.choices?.[0]?.message?.content?.trim();
    if (!schematicPrompt) {
      return NextResponse.json({ error: "Invalid GPT-4o response" }, { status: 500 });
    }

    // Optional: Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // STEP 2: Generate schematic image with DALL·E 3
    const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
      const dalleText = await dalleResponse.text();
      return NextResponse.json({ error: "DALL·E error", details: dalleText }, { status: 500 });
    }

    const dalleData = await dalleResponse.json();
    const schematicUrl = dalleData?.data?.[0]?.url;

    if (!schematicUrl) {
      return NextResponse.json({ error: "No image returned from DALL·E" }, { status: 500 });
    }

    return NextResponse.json({ schematicUrl });

  } catch (error: any) {
    console.error("Schematic generation error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
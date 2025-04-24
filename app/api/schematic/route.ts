import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    // Three prompt types: floor plan, schematic elevations, 3D render
    const promptTypes: Record<string, string> = {
      floorplan: "Create a top-down architectural floor plan layout of this modern tiny house in black and white, showing walls, rooms, and entry.",
      schematic: "Generate a black-and-white architectural schematic elevation showing the front and side view of this modern tiny house, as a technical drawing.",
      render3d: "Render a 3D isometric cutaway floor plan view of this tiny house, with visible furniture and walls, in a clean architectural style."
    };

    const results: Record<string, string> = {};

    for (const [label, task] of Object.entries(promptTypes)) {
      // 🔁 Step 1: GPT-4o prompt generation
      const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are an architecture assistant that helps generate precise image prompts for architectural visuals." },
            {
              role: "user",
              content: [
                { type: "text", text: task },
                { type: "image_url", image_url: { url: imageUrl } }
              ]
            }
          ]
        })
      });

      const gptData = await gptResponse.json();
      const prompt = gptData?.choices?.[0]?.message?.content?.trim();

      if (!prompt) {
        console.warn(`GPT failed for ${label}`);
        continue;
      }

      // 🎨 Step 2: DALL·E 3 image generation
      const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          size: "1024x1024",
          n: 1
        })
      });

      const dalleData = await dalleResponse.json();
      const imageUrl = dalleData?.data?.[0]?.url;

      if (imageUrl) {
        results[label] = imageUrl;
      } else {
        console.warn(`DALL·E failed for ${label}`);
      }
    }

    return NextResponse.json(results);
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}
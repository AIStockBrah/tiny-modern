
import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Only POST requests allowed", { status: 405 });
  }

  const { imageUrl } = await req.json();

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

  const gptData = await gptResponse.json();
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

  const dalleData = await dalleResponse.json();
  const imageUrlResult = dalleData.data[0].url;

  return NextResponse.json({ schematicUrl: imageUrlResult });
}

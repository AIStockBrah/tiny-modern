import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'API token is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Using the tnymdrn model instead of SDXL
        version: "c7da49677e2dcace4abc21b806f8babc84b4f4b2b2a9d0f966c0f91141616d06",
        input: {
          prompt: "TNYMDRN, " + prompt.trim(),
          lora_scale: 0.77,
          num_outputs: 1, // Changed to 1 for web interface, but can be increased
          aspect_ratio: "1:1",
          output_format: "png",
          prompt_strength: 0.77,
          extra_lora_scale: 0.77,
          num_inference_steps: 27
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || 'Failed to generate image' },
        { status: response.status }
      );
    }

    const prediction = await response.json();
    console.log('Prediction started:', prediction);

    // Poll for the result
    const result = await pollForResult(prediction.urls.get);
    console.log('Generation complete:', result);

    // Since this model can return multiple images, we'll take the first one
    // You could modify the frontend to display multiple images if desired
    const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    if (result.status === "failed") {
      return NextResponse.json(
        { error: result.error || "Image generation failed" },
        { status: 500 }
      );
    }

    if (!result.output || (Array.isArray(result.output) && result.output.length === 0)) {
      return NextResponse.json(
        { error: "No image was generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

async function pollForResult(getUrl: string) {
  const maxAttempts = 60;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(getUrl, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check generation status');
    }

    const result = await response.json();
    console.log('Poll attempt', attempts + 1, 'status:', result.status);

    if (result.status === "succeeded") {
      return result;
    } else if (result.status === "failed") {
      throw new Error(result.error || "Image generation failed");
    }

    attempts += 1;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error("Timeout waiting for image generation");
}

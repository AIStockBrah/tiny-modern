'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Sparkles } from "lucide-react";
import Image from "next/image";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const trainedKeywords = [
    'tiny', 'modern', 'cabin', 'farmhouse', 'cyber', 'cottage', 
    'wood', 'glass', 'steel', 'circle', 'rectangle', 'Aframe', 
    'cliff', 'forest', 'beach'
  ];

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedImage(null);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (!data.imageUrl) {
        throw new Error('No image URL received from the server');
      }

      setGeneratedImage(data.imageUrl);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setPrompt(prev => prev ? `${prev} ${keyword}` : keyword);
  };

  return (
    <div className="grid md:grid-cols-5 gap-8 items-start">
      <div className="md:col-span-2 space-y-6">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Describe your architectural vision
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A modern minimalist house with large windows, surrounded by nature, with a flat roof and clean lines..."
            className="min-h-32"
          />
        </div>

        <Button 
          className="w-full gap-2" 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate Architecture'}
        </Button>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">TRAINED KEYWORDS</h3>
          <div className="flex flex-wrap gap-2">
            {trainedKeywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleKeywordClick(keyword)}
                className="px-3 py-1 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-3 space-y-6">
        <div className="aspect-[4/3] rounded-lg border bg-card overflow-hidden relative">
          {generatedImage ? (
            <Image
              src={generatedImage}
              alt="Generated architecture"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">Your Vision Will Appear Here</h3>
                <p className="text-sm text-muted-foreground">
                  Describe your architectural concept and click generate
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 
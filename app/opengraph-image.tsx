import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'TINY MODERN - AI Architecture Generator'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: '#ffffff',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #f8f8f8 1px, transparent 1px), linear-gradient(to bottom, #f8f8f8 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.5,
          }}
        />

        {/* Sketch Image */}
        <div
          style={{
            width: '80%',
            height: '60%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <img
            src="https://tiny-modern.vercel.app/images/gallery/modern-sketch.jpg"
            alt="Modern architectural sketch"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            padding: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '16px',
              letterSpacing: '0.05em',
              lineHeight: 1.1,
            }}
          >
            TINY MODERN
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#666666',
              marginTop: '0',
              letterSpacing: '0.02em',
              maxWidth: '600px',
            }}
          >
            AI-Powered Architectural Visualization
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 
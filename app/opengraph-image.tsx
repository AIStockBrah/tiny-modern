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
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://tiny-modern.vercel.app/images/gallery/modern-cabin-pool.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Dark Overlay with gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            textAlign: 'center',
            position: 'relative',
            padding: '40px',
            height: '100%',
            paddingBottom: '60px',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              letterSpacing: '0.05em',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              lineHeight: 1.1,
            }}
          >
            TINY MODERN
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: 'white',
              marginTop: '0',
              letterSpacing: '0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              opacity: 0.9,
              maxWidth: '800px',
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
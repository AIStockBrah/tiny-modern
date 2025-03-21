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
          background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              letterSpacing: '-0.025em',
            }}
          >
            TINY MODERN
          </h1>
          <p
            style={{
              fontSize: '30px',
              color: '#888888',
              marginTop: '0',
              letterSpacing: '-0.025em',
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
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'TINY MODERN - AI Architecture Generator'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}

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
          background: 'white',
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
              fontSize: '80px',
              fontWeight: 'bold',
              color: 'black',
              marginBottom: '20px',
            }}
          >
            TINY MODERN
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: '#666666',
            }}
          >
            AI-Powered Architectural Visualization
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await fetch(
            new URL('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap')
          ).then((res) => res.arrayBuffer()),
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )
} 
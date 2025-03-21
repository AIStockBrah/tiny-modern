import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const contentType = 'image/png'
export const size = {
  width: 180,
  height: 180,
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '22%',
          background: 'white',
        }}
      >
        <img
          src="/images/icon-sketch.jpg"
          alt="Modern architectural sketch"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.6)',
          }}
        />
        <div
          style={{
            fontSize: '80px',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '-0.05em',
            position: 'relative',
            zIndex: 2,
          }}
        >
          TM
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 
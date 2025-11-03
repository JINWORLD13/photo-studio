import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Moment Snap - 감성 스냅 포토그래퍼';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1c1917 0%, #78716c 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
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
              fontSize: 80,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}
          >
            Moment Snap
          </h1>
          <p
            style={{
              fontSize: 40,
              color: '#e7e5e4',
              margin: 0,
              maxWidth: 800,
            }}
          >
            감성 스냅 포토그래퍼
          </p>
          <p
            style={{
              fontSize: 30,
              color: '#d6d3d1',
              marginTop: 20,
            }}
          >
            당신의 소중한 순간을 영원히
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


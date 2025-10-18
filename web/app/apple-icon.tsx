import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #111827 100%)',
          borderRadius: '40px',
        }}
      >
        <div
          style={{
            width: '140px',
            height: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: '28px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: 'white',
              fontFamily: 'sans-serif',
              letterSpacing: '-2px',
              display: 'flex',
              textShadow: '0 4px 8px rgba(0,0,0,0.4)',
            }}
          >
            누
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

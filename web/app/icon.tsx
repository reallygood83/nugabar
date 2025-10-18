import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
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
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'sans-serif',
            letterSpacing: '-0.5px',
            display: 'flex',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          누
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

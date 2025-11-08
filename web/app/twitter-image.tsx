import { ImageResponse } from 'next/og';

// Edge Runtime 사용 (필수)
export const runtime = 'edge';

// 이미지 크기 설정 (Twitter summary_large_image 규격)
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Alt 텍스트
export const alt = '누가바 - AI 기반 학생 행동특성 및 누가기록 생성기';

// Twitter OG 이미지 생성 (opengraph-image와 동일한 디자인)
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 배경 패턴 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 30,
            zIndex: 1,
          }}
        >
          {/* 이모지 아이콘 */}
          <div
            style={{
              fontSize: 120,
              marginBottom: 20,
            }}
          >
            📝
          </div>

          {/* 제목 */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            누가바
          </div>

          {/* 부제 */}
          <div
            style={{
              fontSize: 36,
              color: '#cbd5e1',
              textAlign: 'center',
              marginTop: -10,
            }}
          >
            학생 행동특성 및 누가기록 생성기
          </div>

          {/* 설명 */}
          <div
            style={{
              fontSize: 28,
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: 900,
              lineHeight: 1.4,
              marginTop: 20,
            }}
          >
            AI 기반 자동 생성으로 교사의 업무 효율을 높이는 스마트한 교육 도구
          </div>

          {/* 특징 배지들 */}
          <div
            style={{
              display: 'flex',
              gap: 15,
              marginTop: 30,
            }}
          >
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '2px solid #3b82f6',
                borderRadius: 999,
                padding: '12px 24px',
                fontSize: 22,
                color: '#60a5fa',
                fontWeight: 600,
              }}
            >
              🤖 AI 자동생성
            </div>
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid #22c55e',
                borderRadius: 999,
                padding: '12px 24px',
                fontSize: 22,
                color: '#4ade80',
                fontWeight: 600,
              }}
            >
              ⚡ 빠른 처리
            </div>
            <div
              style={{
                background: 'rgba(168, 85, 247, 0.2)',
                border: '2px solid #a855f7',
                borderRadius: 999,
                padding: '12px 24px',
                fontSize: 22,
                color: '#c084fc',
                fontWeight: 600,
              }}
            >
              ✨ NEIS 규정 준수
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

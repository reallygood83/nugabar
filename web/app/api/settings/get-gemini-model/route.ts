import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

const GEMINI_MODEL = 'gemini-2.5-flash';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    return NextResponse.json({
      success: true,
      geminiModel: GEMINI_MODEL,
    });
  } catch (error) {
    console.error('Gemini 모델 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gemini 모델 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

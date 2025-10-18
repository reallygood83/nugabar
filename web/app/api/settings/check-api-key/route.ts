import { NextRequest, NextResponse } from 'next/server';
import { getGeminiApiKey } from '@/lib/user-settings';

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ success: false, error: '사용자 인증이 필요합니다.' }, { status: 401 });
    }

    // API 키 존재 여부 확인
    const apiKey = await getGeminiApiKey(uid);
    const hasApiKey = !!apiKey;

    return NextResponse.json({ success: true, hasApiKey });
  } catch (error) {
    console.error('API 키 확인 오류:', error);
    return NextResponse.json({ success: false, error: '확인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

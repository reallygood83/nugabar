import { NextRequest, NextResponse } from 'next/server';
import { saveGeminiApiKey } from '@/lib/user-settings';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ success: false, error: '사용자 인증이 필요합니다.' }, { status: 401 });
    }

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json({ success: false, error: 'API 키를 입력해주세요.' }, { status: 400 });
    }

    // API 키 저장
    await saveGeminiApiKey(uid, apiKey.trim());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API 키 저장 오류:', error);
    return NextResponse.json({ success: false, error: '저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

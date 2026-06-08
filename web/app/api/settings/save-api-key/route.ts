import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { saveGeminiApiKey } from '@/lib/user-settings';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    const { apiKey } = await request.json();

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json({ success: false, error: 'API 키를 입력해주세요.' }, { status: 400 });
    }

    // API 키 저장
    await saveGeminiApiKey(auth.uid, apiKey.trim());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API 키 저장 오류:', error);
    return NextResponse.json({ success: false, error: '저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

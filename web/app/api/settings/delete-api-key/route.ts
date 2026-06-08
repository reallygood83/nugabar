import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { deleteGeminiApiKey } from '@/lib/user-settings';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    // API 키 삭제
    await deleteGeminiApiKey(auth.uid);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API 키 삭제 오류:', error);
    return NextResponse.json({ success: false, error: '삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

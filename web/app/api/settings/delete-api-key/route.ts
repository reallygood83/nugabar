import { NextRequest, NextResponse } from 'next/server';
import { deleteGeminiApiKey } from '@/lib/user-settings';

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ success: false, error: '사용자 인증이 필요합니다.' }, { status: 401 });
    }

    // API 키 삭제
    await deleteGeminiApiKey(uid);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API 키 삭제 오류:', error);
    return NextResponse.json({ success: false, error: '삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

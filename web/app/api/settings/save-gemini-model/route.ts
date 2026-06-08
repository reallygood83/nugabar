import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getAdminDb } from '@/lib/firebase-admin';

const GEMINI_MODEL = 'gemini-2.5-flash';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    await getAdminDb()
      .collection('users')
      .doc(auth.uid)
      .collection('settings')
      .doc('preferences')
      .set({ geminiModel: GEMINI_MODEL }, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Gemini 모델이 저장되었습니다.',
    });
  } catch (error) {
    console.error('Gemini 모델 저장 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gemini 모델 저장 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    const { closureDates } = await request.json();

    // Firestore에 휴업일 저장
    await db.collection('users').doc(auth.uid).set({
      schoolClosureDates: closureDates || '',
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({
      success: true,
      message: '학교 휴업일이 저장되었습니다',
    });
  } catch (error: any) {
    console.error('학교 휴업일 저장 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

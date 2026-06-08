import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    const userDoc = await db.collection('users').doc(auth.uid).get();

    return NextResponse.json({
      success: true,
      schoolName: userDoc.data()?.schoolName || '',
    });
  } catch (error) {
    console.error('학교명 불러오기 오류:', error);
    return NextResponse.json({ success: false, error: '불러오기 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

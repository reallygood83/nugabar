import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    const { schoolName } = await request.json();

    if (!schoolName || !schoolName.trim()) {
      return NextResponse.json({ success: false, error: '학교명을 입력해주세요.' }, { status: 400 });
    }

    await db.collection('users').doc(auth.uid).set({
      schoolName: schoolName.trim(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('학교명 저장 오류:', error);
    return NextResponse.json({ success: false, error: '저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

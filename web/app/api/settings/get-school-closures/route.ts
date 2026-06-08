import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    // Firestore에서 휴업일 불러오기
    const userDoc = await db.collection('users').doc(auth.uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({
        success: true,
        closureDates: '',
      });
    }

    const userData = userDoc.data();

    return NextResponse.json({
      success: true,
      closureDates: userData?.schoolClosureDates || '',
    });
  } catch (error: any) {
    console.error('학교 휴업일 불러오기 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

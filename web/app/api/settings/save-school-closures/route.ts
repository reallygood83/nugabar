import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { uid, closureDates } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'UID가 필요합니다' },
        { status: 400 }
      );
    }

    // Firestore에 휴업일 저장
    await db.collection('users').doc(uid).update({
      schoolClosureDates: closureDates || '',
      updatedAt: new Date().toISOString(),
    });

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

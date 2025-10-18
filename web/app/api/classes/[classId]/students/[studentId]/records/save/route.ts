import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; studentId: string }> }
) {
  try {
    const { uid, content, observationDates, behaviorText } = await request.json();
    const { classId, studentId } = await params;

    if (!uid || !classId || !studentId || !content) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // Firestore에 누가기록 저장
    const recordRef = await db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .collection('students')
      .doc(studentId)
      .collection('cumulativeRecords')
      .add({
        content,
        observationDates: observationDates || [],
        behaviorText: behaviorText || '',
        createdAt: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      message: '누가기록이 저장되었습니다',
      recordId: recordRef.id,
    });
  } catch (error: any) {
    console.error('누가기록 저장 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

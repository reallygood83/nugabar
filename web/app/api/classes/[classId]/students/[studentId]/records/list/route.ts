import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; studentId: string }> }
) {
  try {
    const { uid } = await request.json();
    const { classId, studentId } = await params;

    if (!uid || !classId || !studentId) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // Firestore에서 누가기록 목록 조회
    const recordsSnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .collection('students')
      .doc(studentId)
      .collection('cumulativeRecords')
      .orderBy('createdAt', 'desc')
      .get();

    const records = recordsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      records,
    });
  } catch (error: any) {
    console.error('누가기록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

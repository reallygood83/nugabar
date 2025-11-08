import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { uid } = await request.json();
    const { classId } = await params;

    if (!uid || !classId) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // Firestore에서 학생 목록 조회
    const studentsSnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .collection('students')
      .orderBy('number', 'asc')
      .get();

    // 각 학생의 누가기록 개수 계산
    const students = await Promise.all(
      studentsSnapshot.docs.map(async (doc) => {
        const recordsSnapshot = await db
          .collection('users')
          .doc(uid)
          .collection('classes')
          .doc(classId)
          .collection('students')
          .doc(doc.id)
          .collection('cumulativeRecords')
          .get();

        return {
          id: doc.id,
          ...doc.data(),
          recordCount: recordsSnapshot.size,
        };
      })
    );

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error: any) {
    console.error('학생 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

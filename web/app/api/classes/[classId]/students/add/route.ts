import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { maskName } from '@/lib/name-masking';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { uid, number, name } = await request.json();
    const { classId } = await params;

    if (!uid || !classId || !number || !name) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // 이름 자동 마스킹
    const maskedName = maskName(name);

    // Firestore에 학생 추가
    const studentRef = await db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .collection('students')
      .add({
        number: parseInt(number),
        maskedName,
        createdAt: new Date().toISOString(),
      });

    // 학급의 학생 수 업데이트
    const studentsSnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .collection('students')
      .get();

    await db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .update({
        studentCount: studentsSnapshot.size,
      });

    return NextResponse.json({
      success: true,
      message: '학생이 추가되었습니다',
      studentId: studentRef.id,
      maskedName,
    });
  } catch (error: any) {
    console.error('학생 추가 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

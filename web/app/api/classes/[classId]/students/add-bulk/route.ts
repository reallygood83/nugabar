import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { maskName } from '@/lib/name-masking';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { uid, students } = await request.json();
    const { classId } = await params;

    if (!uid || !classId || !students || !Array.isArray(students)) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // Firestore batch 작업 준비
    const batch = db.batch();
    const studentsCollectionRef = db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .collection('students');

    const addedStudents: Array<{ number: number; maskedName: string }> = [];

    // 각 학생 추가
    for (const student of students) {
      const { number, name } = student;

      if (!number || !name) {
        continue; // 필수 정보가 없으면 건너뛰기
      }

      const maskedName = maskName(name.trim());
      const studentRef = studentsCollectionRef.doc();

      batch.set(studentRef, {
        number: parseInt(number),
        maskedName,
        createdAt: new Date().toISOString(),
      });

      addedStudents.push({ number: parseInt(number), maskedName });
    }

    // Batch 실행
    await batch.commit();

    // 학급의 학생 수 업데이트
    const studentsSnapshot = await studentsCollectionRef.get();

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
      message: `${addedStudents.length}명의 학생이 추가되었습니다`,
      addedCount: addedStudents.length,
      students: addedStudents,
    });
  } catch (error: any) {
    console.error('일괄 학생 추가 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

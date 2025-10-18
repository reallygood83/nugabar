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

    // Firestore 컬렉션 참조
    const studentsCollectionRef = db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .collection('students');

    const addedStudents: Array<{ number: number; maskedName: string }> = [];

    // 각 학생 추가 (병렬 처리)
    const addPromises = students.map(async (student) => {
      const { number, name } = student;

      if (!number || !name) {
        return null; // 필수 정보가 없으면 건너뛰기
      }

      const maskedName = maskName(name.trim());

      // Firebase add() 메서드로 자동 생성 ID 사용
      await studentsCollectionRef.add({
        number: parseInt(number),
        maskedName,
        createdAt: new Date().toISOString(),
      });

      return { number: parseInt(number), maskedName };
    });

    // 모든 학생 추가 대기
    const results = await Promise.all(addPromises);
    addedStudents.push(...results.filter((r) => r !== null) as Array<{ number: number; maskedName: string }>);

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

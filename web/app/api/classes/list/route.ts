import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'UID가 필요합니다' },
        { status: 400 }
      );
    }

    // Firestore에서 학급 목록 조회
    const classesSnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .orderBy('createdAt', 'desc')
      .get();

    const classes = classesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 각 학급의 학생 수와 누가기록 수 계산
    const classesWithCounts = await Promise.all(
      classes.map(async (classItem: any) => {
        const studentsSnapshot = await db
          .collection('users')
          .doc(uid)
          .collection('classes')
          .doc(classItem.id)
          .collection('students')
          .get();

        let totalRecords = 0;
        for (const studentDoc of studentsSnapshot.docs) {
          const recordsSnapshot = await db
            .collection('users')
            .doc(uid)
            .collection('classes')
            .doc(classItem.id)
            .collection('students')
            .doc(studentDoc.id)
            .collection('cumulativeRecords')
            .get();

          totalRecords += recordsSnapshot.size;
        }

        return {
          ...classItem,
          studentCount: studentsSnapshot.size,
          recordCount: totalRecords,
        };
      })
    );

    return NextResponse.json({
      success: true,
      classes: classesWithCounts,
    });
  } catch (error: any) {
    console.error('학급 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

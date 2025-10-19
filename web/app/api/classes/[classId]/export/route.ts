import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { generateClassExcel, StudentRecord } from '@/lib/excel-export';

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

    // 학급 정보 조회
    const classDoc = await db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .get();

    if (!classDoc.exists) {
      return NextResponse.json(
        { success: false, error: '학급을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const classData = classDoc.data();
    const className = classData?.className || '학급';

    // 모든 학생과 누가기록 조회
    const studentsSnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .collection('students')
      .orderBy('number', 'asc')
      .get();

    const allRecords: StudentRecord[] = [];

    for (const studentDoc of studentsSnapshot.docs) {
      const studentData = studentDoc.data();
      const recordsSnapshot = await db
        .collection('users')
        .doc(uid)
        .collection('classes')
        .doc(classId)
        .collection('students')
        .doc(studentDoc.id)
        .collection('cumulativeRecords')
        .orderBy('createdAt', 'desc')
        .get();

      for (const recordDoc of recordsSnapshot.docs) {
        const recordData = recordDoc.data();
        const observationDates = recordData.observationDates || [];
        const observationPeriod =
          observationDates.length > 0
            ? `${observationDates[0]} ~ ${observationDates[observationDates.length - 1]}`
            : '';

        allRecords.push({
          studentName: studentData.maskedName,
          studentNumber: studentData.number,
          createdAt: recordData.createdAt?.split('T')[0] || '',
          observationPeriod,
          content: recordData.content,
          behaviorText: recordData.behaviorText,
        });
      }
    }

    // 엑셀 파일 생성
    const excelBuffer = generateClassExcel(allRecords, className);

    // Response 반환 (Buffer를 Uint8Array로 변환)
    return new Response(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(className)}_누가기록.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error('엑셀 다운로드 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

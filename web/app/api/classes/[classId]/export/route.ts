import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { generateClassExcel, StudentRecord } from '@/lib/excel-export';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    console.log('[Excel Export] 시작');

    // Step 1: Request 파싱
    let uid, classId;
    try {
      const body = await request.json();
      uid = body.uid;
      const resolvedParams = await params;
      classId = resolvedParams.classId;
      console.log('[Excel Export] Request 파싱 완료:', { uid, classId });
    } catch (parseError: any) {
      console.error('[Excel Export] Request 파싱 에러:', parseError);
      throw new Error(`Request 파싱 실패: ${parseError.message}`);
    }

    if (!uid || !classId) {
      console.error('[Excel Export] 필수 정보 누락:', { uid, classId });
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // Step 2: 학급 정보 조회
    let classDoc;
    try {
      console.log('[Excel Export] 학급 정보 조회 중...');
      classDoc = await db
        .collection('users')
        .doc(uid)
        .collection('classes')
        .doc(classId)
        .get();
      console.log('[Excel Export] 학급 정보 조회 완료:', { exists: classDoc.exists });
    } catch (classError: any) {
      console.error('[Excel Export] 학급 정보 조회 에러:', classError);
      throw new Error(`학급 정보 조회 실패: ${classError.message}`);
    }

    if (!classDoc.exists) {
      console.error('[Excel Export] 학급을 찾을 수 없음');
      return NextResponse.json(
        { success: false, error: '학급을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const classData = classDoc.data();
    const className = classData?.className || '학급';
    console.log('[Excel Export] 학급명:', className);

    // Step 3: 학생 목록 조회
    let studentsSnapshot;
    try {
      console.log('[Excel Export] 학생 목록 조회 중...');
      studentsSnapshot = await db
        .collection('users')
        .doc(uid)
        .collection('classes')
        .doc(classId)
        .collection('students')
        .orderBy('number', 'asc')
        .get();
      console.log('[Excel Export] 학생 수:', studentsSnapshot.docs.length);
    } catch (studentsError: any) {
      console.error('[Excel Export] 학생 목록 조회 에러:', studentsError);
      throw new Error(`학생 목록 조회 실패: ${studentsError.message}`);
    }

    const allRecords: StudentRecord[] = [];

    // Step 4: 각 학생의 누가기록 조회
    for (const studentDoc of studentsSnapshot.docs) {
      try {
        const studentData = studentDoc.data();
        console.log('[Excel Export] 학생 처리 중:', studentData.maskedName);

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

        console.log('[Excel Export] 누가기록 수:', recordsSnapshot.docs.length);

        for (const recordDoc of recordsSnapshot.docs) {
          try {
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
          } catch (recordError: any) {
            console.error('[Excel Export] 누가기록 처리 에러:', recordError);
            throw new Error(`누가기록 처리 실패: ${recordError.message}`);
          }
        }
      } catch (studentError: any) {
        console.error('[Excel Export] 학생 처리 에러:', studentError);
        throw new Error(`학생 데이터 처리 실패: ${studentError.message}`);
      }
    }

    console.log('[Excel Export] 전체 누가기록 수:', allRecords.length);

    // Step 5: 엑셀 파일 생성
    let excelBuffer;
    try {
      console.log('[Excel Export] 엑셀 파일 생성 중...');
      excelBuffer = generateClassExcel(allRecords, className);
      console.log('[Excel Export] 엑셀 파일 생성 완료, 크기:', excelBuffer.length);
    } catch (excelError: any) {
      console.error('[Excel Export] 엑셀 파일 생성 에러:', excelError);
      throw new Error(`엑셀 파일 생성 실패: ${excelError.message}`);
    }

    // Step 6: Response 반환
    try {
      console.log('[Excel Export] Response 생성 중...');
      const response = new Response(new Uint8Array(excelBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(className)}_누가기록.xlsx"`,
        },
      });
      console.log('[Excel Export] Response 생성 완료');
      return response;
    } catch (responseError: any) {
      console.error('[Excel Export] Response 생성 에러:', responseError);
      throw new Error(`Response 생성 실패: ${responseError.message}`);
    }
  } catch (error: any) {
    console.error('[Excel Export] 최종 에러:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stack
      },
      { status: 500 }
    );
  }
}

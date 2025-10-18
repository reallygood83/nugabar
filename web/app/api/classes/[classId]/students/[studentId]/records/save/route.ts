import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; studentId: string }> }
) {
  try {
    const { uid, records, behaviorText } = await request.json();
    const { classId, studentId } = await params;

    if (!uid || !classId || !studentId || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // 여러 누가기록을 순차적으로 저장
    const studentRef = db
      .collection('users')
      .doc(uid)
      .collection('classes')
      .doc(classId)
      .collection('students')
      .doc(studentId);

    // Promise.all로 병렬 처리
    const savePromises = records.map((record: any) => {
      return studentRef.collection('cumulativeRecords').add({
        content: record.content || record.text || '',
        observationDates: record.observationDates || [],
        date: record.date || new Date().toISOString().split('T')[0],
        behaviorText: behaviorText || '',
        createdAt: new Date().toISOString(),
      });
    });

    // 모든 저장 완료 대기
    await Promise.all(savePromises);

    return NextResponse.json({
      success: true,
      message: `${records.length}개의 누가기록이 저장되었습니다`,
      count: records.length,
    });
  } catch (error: any) {
    console.error('누가기록 저장 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

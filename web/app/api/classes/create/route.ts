import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { uid, grade, classNumber, semester, year } = await request.json();

    if (!uid || !grade || !classNumber) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // 학급 이름 생성
    const className = `${year || new Date().getFullYear()}-${grade}학년 ${classNumber}반`;

    // Firestore에 학급 생성
    const classRef = await db.collection('users').doc(uid).collection('classes').add({
      className,
      year: year || new Date().getFullYear(),
      semester: semester || 1,
      grade: parseInt(grade),
      classNumber: parseInt(classNumber),
      createdAt: new Date().toISOString(),
      studentCount: 0,
    });

    return NextResponse.json({
      success: true,
      message: '학급이 생성되었습니다',
      classId: classRef.id,
      className,
    });
  } catch (error: any) {
    console.error('학급 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

interface Activity {
  id: string;
  date: string;
  category: 'autonomous' | 'club' | 'career' | 'volunteer';
  subject: string;
  content: string;
  selected: boolean;
}

interface GeneratedRecord {
  activityId: string;
  activitySubject: string;
  activityDate: string;
  activityCategory: string;
  records: string[];
  generatedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, pdfFileName, activities, generatedRecords } = await request.json();

    // 입력 검증
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!pdfFileName) {
      return NextResponse.json(
        { success: false, error: 'PDF 파일명이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        { success: false, error: '활동 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    // Firebase 초기화
    const app = getApp();
    const db = getFirestore(app);

    // Firestore에 저장할 데이터 구성
    const dataToSave = {
      userId,
      pdfFileName,
      uploadedAt: Timestamp.now(),
      activities: activities.map((activity: Activity) => ({
        id: activity.id,
        date: activity.date,
        category: activity.category,
        subject: activity.subject,
        content: activity.content,
        selected: activity.selected || false
      })),
      generatedRecords: generatedRecords || [],
      updatedAt: Timestamp.now()
    };

    // Firestore에 저장
    const docRef = await addDoc(
      collection(db, 'users', userId, 'creativeActivities'),
      dataToSave
    );

    return NextResponse.json({
      success: true,
      documentId: docRef.id,
      message: '활동 데이터가 저장되었습니다.'
    });

  } catch (error) {
    console.error('활동 저장 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '활동 저장 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

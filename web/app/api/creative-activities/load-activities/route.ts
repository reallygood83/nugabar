import { NextRequest, NextResponse } from 'next/server';
import { getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    // 입력 검증
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // Firebase 초기화
    const app = getApp();
    const db = getFirestore(app);

    // Firestore에서 데이터 조회
    const activitiesRef = collection(db, 'users', userId, 'creativeActivities');
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      orderBy('uploadedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    // 데이터 변환
    const data = querySnapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        pdfFileName: docData.pdfFileName,
        uploadedAt: docData.uploadedAt instanceof Timestamp
          ? docData.uploadedAt.toDate().toISOString()
          : docData.uploadedAt,
        activities: docData.activities || [],
        generatedRecords: docData.generatedRecords || [],
        updatedAt: docData.updatedAt instanceof Timestamp
          ? docData.updatedAt.toDate().toISOString()
          : docData.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      data,
      count: data.length
    });

  } catch (error) {
    console.error('활동 불러오기 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '활동 불러오기 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { success: false, error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const app = getApp();
    const db = getFirestore(app);

    const docRef = doc(db, 'users', uid, 'settings', 'preferences');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return NextResponse.json({
        success: true,
        geminiModel: data.geminiModel || 'gemini-2.0-flash', // Default to 2.0-flash
      });
    } else {
      return NextResponse.json({
        success: true,
        geminiModel: 'gemini-2.0-flash', // Default model
      });
    }
  } catch (error) {
    console.error('Gemini 모델 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gemini 모델 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { uid, geminiModel } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { success: false, error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!geminiModel) {
      return NextResponse.json(
        { success: false, error: 'Gemini 모델을 선택해주세요.' },
        { status: 400 }
      );
    }

    // Validate model name
    const validModels = ['gemini-2.0-flash', 'gemini-2.5-flash'];
    if (!validModels.includes(geminiModel)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 모델입니다.' },
        { status: 400 }
      );
    }

    const app = getApp();
    const db = getFirestore(app);

    await setDoc(
      doc(db, 'users', uid, 'settings', 'preferences'),
      { geminiModel },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Gemini 모델이 저장되었습니다.',
    });
  } catch (error) {
    console.error('Gemini 모델 저장 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gemini 모델 저장 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

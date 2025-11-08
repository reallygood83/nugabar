import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);

export async function POST(request: NextRequest) {
  try {
    const { schoolName, uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ success: false, error: '사용자 인증이 필요합니다.' }, { status: 401 });
    }

    if (!schoolName || !schoolName.trim()) {
      return NextResponse.json({ success: false, error: '학교명을 입력해주세요.' }, { status: 400 });
    }

    // Firestore에 학교명 저장
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      schoolName: schoolName.trim(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('학교명 저장 오류:', error);
    return NextResponse.json({ success: false, error: '저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ success: false, error: '사용자 인증이 필요합니다.' }, { status: 401 });
    }

    // Firestore에서 학교명 불러오기
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().schoolName) {
      return NextResponse.json({
        success: true,
        schoolName: userDoc.data().schoolName
      });
    } else {
      return NextResponse.json({
        success: true,
        schoolName: ''
      });
    }
  } catch (error) {
    console.error('학교명 불러오기 오류:', error);
    return NextResponse.json({ success: false, error: '불러오기 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

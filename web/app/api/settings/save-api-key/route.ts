import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'Gemini API 키는 서버에 저장하지 않습니다. 설정 화면에서 브라우저 로컬 저장을 사용해주세요.',
    },
    { status: 410 }
  );
}

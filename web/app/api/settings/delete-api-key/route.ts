import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Gemini API 키는 서버에 저장되지 않습니다. 브라우저 로컬 저장소에서 삭제해주세요.',
  });
}

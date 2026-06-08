import { NextRequest, NextResponse } from 'next/server';

export function getRequestGeminiApiKey(request: NextRequest): string | null {
  const apiKey = request.headers.get('x-gemini-api-key')?.trim();
  return apiKey || null;
}

export function missingGeminiApiKeyResponse() {
  return NextResponse.json(
    {
      success: false,
      error: 'Gemini API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 브라우저에 저장해주세요.',
    },
    { status: 400 }
  );
}

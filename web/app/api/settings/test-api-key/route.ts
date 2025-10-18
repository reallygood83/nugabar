import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json({
        success: false,
        message: 'API 키를 입력해주세요.'
      }, { status: 400 });
    }

    // Gemini API 테스트 호출 (gemini-2.0-flash 모델)
    const testResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Hello' }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 10,
          }
        })
      }
    );

    if (!testResponse.ok) {
      const errorData = await testResponse.json();
      return NextResponse.json({
        success: false,
        message: `API 키가 유효하지 않습니다. (${errorData.error?.message || '인증 실패'})`
      });
    }

    // 성공
    return NextResponse.json({
      success: true,
      message: 'API 키가 정상적으로 작동합니다! ✅'
    });

  } catch (error) {
    console.error('API 키 테스트 오류:', error);
    return NextResponse.json({
      success: false,
      message: '테스트 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

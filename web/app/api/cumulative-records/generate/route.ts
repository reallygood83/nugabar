import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getRequestGeminiApiKey, missingGeminiApiKeyResponse } from '@/lib/gemini-api-key-server';
import { validateCumulativeRecord } from '@/lib/neis-compliance';
import { generateCumulativeRecordDates, formatKoreanDate } from '@/lib/korean-holidays';
import { db } from '@/lib/firebase-admin';

// Apps Script 누가기록 생성 로직 이식
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    const {
      behaviorText,
      recordCount = 5,
      excludedDates = [] // 휴업일 및 결석일 (선택사항)
    } = await request.json();
    const uid = auth.uid;

    // 설정에서 저장된 학교 휴업일 불러오기
    let allExcludedDates = [...excludedDates];

    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const schoolClosures = userData?.schoolClosureDates || '';

        if (schoolClosures) {
          // 학교 휴업일 파싱 후 추가
          const schoolClosureDates = schoolClosures
            .split(/[,\n]/)
            .map((d: string) => d.trim())
            .filter((d: string) => d.length > 0)
            .map((d: string) => {
              // YYYY-MM-DD 형식으로 변환
              const cleaned = d.replace(/[년월일\s.-]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
              return cleaned;
            });

          allExcludedDates = [...allExcludedDates, ...schoolClosureDates];
        }
      }
    } catch (error) {
      console.error('학교 휴업일 불러오기 오류:', error);
      // 오류가 발생해도 계속 진행 (사용자가 입력한 날짜만 사용)
    }

    if (!behaviorText || !behaviorText.trim()) {
      return NextResponse.json({ success: false, error: '행동특성 텍스트를 입력해주세요.' }, { status: 400 });
    }

    const apiKey = getRequestGeminiApiKey(request);
    if (!apiKey) {
      return missingGeminiApiKeyResponse();
    }

    // Apps Script createCumulativeRecordsPrompt 로직 100% 이식
    const diversityElements = [
      "학습 태도와 참여 모습",
      "동료와의 협력 관계",
      "문제 해결 접근 방식",
      "학습 과정에서의 특성",
      "과제 수행 시의 모습",
      "표현 및 소통 능력",
      "학습에 대한 관심과 노력"
    ];

    const prompt = `당신은 대한민국 초등학교 교사를 돕는 AI 조수입니다.
주어진 '행동특성 및 종합의견'을 바탕으로 ${recordCount}개의 **완전히 다른** 열린 형태 누가기록을 생성해야 합니다.

### 🎯 열린 형태 누가기록 작성 지침
1. **일반적 표현**: 모든 학생에게 적용 가능한 일반적인 표현 사용
2. **구체적 상황 금지**: 특정 교구, 구체적 사건, 고유한 상황 언급 금지
3. **추상적 행동**: "협력하여", "노력하며", "집중하여" 등 추상적이고 일반적인 행동 중심
4. **문장 길이**: 100-150자 내외로 제한 (공백 포함)
5. **마침표 종결**: 모든 문장은 반드시 마침표(.)로 종료

### 🚫 내용 중복 방지 원칙
1. **완전한 차별화**: 각 누가기록은 완전히 다른 관찰 관점에서 작성
2. **유사 표현 금지**: 비슷한 동사, 형용사, 문장 구조 사용 금지
3. **다양한 영역 활용**: ${diversityElements.join(', ')}

### **다양성 요소**
- 1번째 기록: 학습 참여 태도 중심
- 2번째 기록: 동료 관계 및 협력 중심
- 3번째 기록: 문제 해결 방식 중심
- 4번째 기록: 표현 및 소통 능력 중심
- 5번째 기록: 학습 관리 및 성찰 중심

### ✨ 한국어 문장 품질 지침
1. **종결어 다양성**: "~함" 종결을 전체 문장의 40% 이하로 제한하고, 다양한 명사형 종결어 사용
   - 자연스러운 명사형 종결: ~함, ~임, ~됨, ~음, ~을 보임
   - **금지**: ~줌함, ~습니함, ~였습니다 등 불완전한 형태 절대 사용 금지
2. **중복 표현 제거**: 같은 단어나 표현이 2회 이상 반복되지 않도록 주의
3. **문장 구조**: 간결하고 명확한 한국어 문장 구조 사용
4. **추측성 표현 금지**: "~것으로 보임", "~것 같음", "~듯함" 등 불확실한 표현 사용 금지
5. **글자 수 최적화**: 각 문장은 100-150자 이내로 작성하여 읽기 쉽게 구성

**종결어 사용 예시**:
- ✅ 좋은 예시: "수업 시간에 적극적으로 참여함.", "친구들과 협력하는 모습을 보임.", "과제를 성실히 수행함."
- ❌ 나쁜 예시: "수업 시간에 적극적으로 참여줌함.", "친구들과 협력하는 것으로 보였습니다.", "과제를 성실히 수행하였습니다."

---
**[학생의 행동특성 및 종합의견]**
${behaviorText}
---

위 내용을 바탕으로, ${recordCount}개의 열린 형태 누가기록을 JSON 형식으로 생성해주세요.

**응답 형식**: [{"record": "누가기록 내용."}, {"record": "누가기록 내용."}, ...]
`;

    // Gemini API 호출 (gemini-2.5-flash 모델)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    const data = await response.json();

    // Gemini API 응답 에러 처리
    if (!response.ok) {
      console.error('Gemini API 오류:', data);
      return NextResponse.json({
        success: false,
        error: data.error?.message || 'AI 생성 실패'
      }, { status: 500 });
    }

    // 응답 구조 검증 및 텍스트 추출
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error('예상치 못한 Gemini API 응답:', data);
      return NextResponse.json({
        success: false,
        error: 'AI 응답 형식이 올바르지 않습니다.'
      }, { status: 500 });
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error('Gemini API 응답에 content가 없습니다:', candidate);
      return NextResponse.json({
        success: false,
        error: 'AI가 텍스트를 생성하지 못했습니다.'
      }, { status: 500 });
    }

    const generatedText = candidate.content.parts[0].text || '';

    if (!generatedText.trim()) {
      return NextResponse.json({
        success: false,
        error: 'AI가 빈 텍스트를 생성했습니다.'
      }, { status: 500 });
    }

    // JSON 파싱
    let cleanedText = generatedText.replace(/^```json\s*|\s*```$/g, '').trim();
    cleanedText = cleanedText.replace(/^```\s*|\s*```$/g, '').trim();

    const recordsData = JSON.parse(cleanedText);

    if (!Array.isArray(recordsData)) {
      throw new Error('JSON 배열 형식이 아닙니다.');
    }

    // 날짜 생성 (Apps Script 로직 100%: 평일 + 공휴일 제외 + 모두 다른 날짜)
    const excludedDateObjects = allExcludedDates.map((dateStr: string) => new Date(dateStr));
    const validDates = generateCumulativeRecordDates(recordsData.length, excludedDateObjects);

    // 날짜와 내용 매핑 + NEIS 검증
    const records = recordsData.map((item, index) => {
      let recordText = item.record || item.text || '';

      // NEIS 규정 검증 및 자동 수정 (Apps Script 로직 100% 적용)
      const validation = validateCumulativeRecord(recordText);
      recordText = validation.validatedText;

      return {
        date: formatKoreanDate(validDates[index]),
        text: recordText,
        length: recordText.length,
        isValid: validation.isValid,
        violations: validation.violations
      };
    });

    return NextResponse.json({
      success: true,
      records: records,
      totalCount: records.length
    });

  } catch (error) {
    console.error('Error generating cumulative records:', error);
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

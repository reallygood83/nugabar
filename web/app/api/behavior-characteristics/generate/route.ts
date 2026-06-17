import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getRequestGeminiApiKey, missingGeminiApiKeyResponse } from '@/lib/gemini-api-key-server';
import { validateBehaviorCharacteristic } from '@/lib/neis-compliance';

// Apps Script INTENSITY_MODIFIERS 이식
const intensityModifiers = {
  1: { prefix: '약간', suffix: '경향을 보임' },
  2: { prefix: '', suffix: '모습을 보임' },
  3: { prefix: '매우', suffix: '뛰어난 모습을 보임' }
};

// Apps Script 60개 키워드 데이터 참조용
const keywordData: Record<string, string> = {
  active_participation: '수업에 적극적으로 참여하며',
  high_concentration: '높은 집중력을 보이며',
  frequent_questions: '궁금한 점을 적극적으로 질문하며',
  task_completion: '주어진 과제를 성실히 수행하고',
  self_directed_learning: '스스로 학습 계획을 세우고 실천하며',
  note_taking: '수업 내용을 체계적으로 정리하며',
  homework_diligent: '숙제를 빠짐없이 해오며',
  learning_preparation: '수업 준비물을 빠짐없이 준비하며',
  attention_needed: '수업 집중력 향상이 기대되며',
  passive_participation: '보다 적극적인 참여가 기대되며',
  collaborative: '친구들과 협력하여',
  caring: '친구들을 배려하는 마음으로',
  leadership: '모둠을 이끌어가는 리더십을 보이며',
  conflict_resolution: '문제 상황을 슬기롭게 해결하며',
  communication_skills: '자신의 생각을 명확히 표현하고',
  inclusive_behavior: '모든 친구를 포용하는 마음으로',
  empathy: '친구들의 마음을 잘 이해하며',
  helpful_attitude: '어려움에 처한 친구를 적극적으로 도우며',
  friendship_building: '새로운 친구들과 쉽게 친해지며',
  shy_interaction: '친구들과의 활발한 교류가 기대되며',
  quick_understanding: '새로운 내용을 빠르게 이해하며',
  good_application: '학습한 내용을 다양하게 응용하며',
  creative_thinking: '독창적인 아이디어로',
  logical_expression: '논리적으로 설명하며',
  analytical_thinking: '문제를 체계적으로 분석하며',
  problem_solving: '어려운 문제에 도전하여 해결하며',
  critical_thinking: '다양한 관점에서 생각하며',
  memory_retention: '학습한 내용을 오래 기억하며',
  synthesis_skills: '여러 정보를 종합하여 판단하며',
  needs_reinforcement: '기초 개념 이해가 더욱 향상되면',
  active_presentation: '자신 있게 발표하며',
  discussion_leader: '토론을 주도적으로 이끌어가며',
  idea_contributor: '참신한 아이디어를 제시하며',
  group_activity_leader: '모둠 활동에서 주도적 역할을 하며',
  volunteer_actively: '자원봉사 활동에 적극적으로 참여하며',
  class_responsibility: '맡은 학급 업무를 성실히 수행하며',
  event_participation: '학교 행사에 적극적으로 참여하며',
  opinion_expression: '자신의 의견을 적극적으로 표현하며',
  presentation_anxiety: '발표에 대한 자신감 향상이 기대되며',
  observer_role: '신중하게 관찰하며',
  responsible: '맡은 일에 책임감을 갖고',
  diligent: '성실한 태도로',
  patient: '끈기있게 노력하며',
  organized: '체계적으로 정리하며',
  curious: '호기심을 바탕으로',
  honest: '진실한 마음으로',
  considerate: '사려깊게 행동하며',
  positive_attitude: '긍정적인 마음으로',
  self_control: '자신을 잘 조절하며',
  impulsive: '신중한 행동이 더욱 기대되며',
  artistic_talent: '뛰어난 예술적 감각으로',
  mathematical_aptitude: '뛰어난 수학적 사고력으로',
  language_skills: '우수한 언어 능력으로',
  physical_coordination: '뛰어난 신체 협응력으로',
  technology_interest: '기술에 대한 높은 관심으로',
  musical_talent: '음악적 재능을 발휘하며',
  athletic_ability: '우수한 운동 능력으로',
  science_interest: '과학에 대한 탐구심으로',
  writing_talent: '뛰어난 글쓰기 실력으로',
  area_exploration: '다양한 영역을 탐색하며'
};

function cleanBehaviorText(text: string) {
  return text
    .replace(/^```(?:text)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^행동특성\s*및\s*종합의견\s*[:：]\s*/i, '')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function generateBehaviorText(apiKey: string, prompt: string) {
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
          temperature: 0.45,
          maxOutputTokens: 1536,
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error('Gemini API 오류:', data);
    throw new Error(data.error?.message || 'AI 생성 실패');
  }

  if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
    console.error('예상치 못한 Gemini API 응답:', data);
    throw new Error('AI 응답 형식이 올바르지 않습니다.');
  }

  const candidate = data.candidates[0];
  if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
    console.error('Gemini API 응답에 content가 없습니다:', candidate);
    throw new Error('AI가 텍스트를 생성하지 못했습니다.');
  }

  const generatedText = cleanBehaviorText(candidate.content.parts[0].text || '');
  if (!generatedText) {
    throw new Error('AI가 빈 텍스트를 생성했습니다.');
  }

  return generatedText;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    const { keywords } = await request.json();

    if (!keywords || Object.keys(keywords).length === 0) {
      return NextResponse.json({ success: false, error: '키워드를 선택해주세요.' }, { status: 400 });
    }

    const apiKey = getRequestGeminiApiKey(request);
    if (!apiKey) {
      return missingGeminiApiKeyResponse();
    }

    // Apps Script 강도 조절 시스템 적용
    const keywordTexts = Object.entries(keywords).map(([keywordId, intensity]) => {
      const baseText = keywordData[keywordId] || keywordId;
      const modifier = intensityModifiers[intensity as 1 | 2 | 3];

      if (modifier.prefix) {
        return `${modifier.prefix} ${baseText}`;
      }
      return baseText;
    });

    const keywordList = keywordTexts.join(', ');
    const prompt = `당신은 대한민국 초등학교 담임교사의 생활기록부 문장을 돕는 전문 작성자입니다. 다음 키워드들을 바탕으로 학생의 행동특성 및 종합의견을 작성해주세요.

키워드: ${keywordList}

## 출력 형식
- 제목, 라벨, 따옴표, 마크다운 없이 본문만 출력
- 하나의 자연스러운 문단으로 출력
- 반드시 4~6문장, 350~480자 사이로 작성
- 각 문장은 마침표(.)로 끝낼 것

## 📋 NEIS 기재 규칙 (절대 준수)
- 글자수: 350-480자 (공백 포함)
- 형식: 하나의 연결된 문단
- **어조: 명사형 종결 (~함, ~임, ~됨, ~음, ~을 보임, ~하는 모습을 보임)**
- 주어 생략: 모든 문장에서 주어('이 학생은', '학생이' 등) 생략 필수
- 금지 어미: **'~했습니함', '~했습니다', '~합니다', '~했다', '~한다' 등 절대 금지**

## 📝 올바른 명사형 종결어미 사용법 (반드시 준수)
- 동작/행동: **~함** (예: 참여함, 노력함, 발표함, 집중함, 도움을 줌)
- 상태/성질: **~임** (예: 적극적임, 성실함)
- 변화/결과: **~됨** (예: 향상됨, 발전됨, 개선됨)
- 소유/특성: **~음** (예: 뛰어남, 우수함, 탁월함)
- 양상/모습: **~을/를 보임** (예: 성장하는 모습을 보임, 발전하는 모습을 보임)

## 🚫 절대 금지 어미 및 중복 종결어
- ~습니함 ❌ (한국어에 존재하지 않는 잘못된 어미)
- ~했습니다 ❌
- ~합니다 ❌
- ~했다 ❌
- ~한다 ❌

## ⚠️ 명사형 종결어 중복 절대 금지 (매우 중요!)
**동사 기반 명사형(-ㅁ 어미)은 그 자체로 완결된 종결어이므로, 뒤에 '함'을 절대 붙이지 말 것!**

**잘못된 중복 종결어 예시 (절대 사용 금지!):**
- ❌ 살핌함 → ✅ 살핌 (살피다 → 살핌)
- ❌ 느낌함 → ✅ 느낌 (느끼다 → 느낌)
- ❌ 드러냄함 → ✅ 드러냄 (드러내다 → 드러냄)
- ❌ 보여줌함 → ✅ 보여줌 (보여주다 → 보여줌)
- ❌ 나타냄함 → ✅ 나타냄 (나타내다 → 나타냄)
- ❌ 이룸함 → ✅ 이룸 (이루다 → 이룸)
- ❌ 다짐함 → ✅ 다짐 (다지다 → 다짐)
- ❌ 갖춤함 → ✅ 갖춤 (갖추다 → 갖춤)

**핵심 규칙: 동사가 "-ㅁ"으로 끝나면 거기서 종결! 뒤에 "함"을 붙이면 안 됨!**
- 올바른 예시: 친구들의 마음을 세심하게 살핌. (O)
- 잘못된 예시: 친구들의 마음을 세심하게 살핌함. (X)
- 올바른 예시: 새로운 지식 습득에 즐거움을 느낌. (O)
- 잘못된 예시: 새로운 지식 습득에 즐거움을 느낌함. (X)

## ✨ 고품질 작성 가이드 (중요!)
1. **종결어미 다양화 필수**
   - ~함 종결어는 전체의 40% 이내로 제한
   - ~며, ~고, ~되어, ~임, ~음 등을 골고루 섞어 사용
   - 연속으로 같은 종결어 사용 금지 (예: ~함. ~함. ~함. ❌)

2. **중복 표현 제거**
   - 같은 단어나 표현을 2번 이상 사용하지 말 것
   - "적극적으로", "긍정적으로", "책임감" 등의 반복 금지
   - 유사한 의미의 다른 표현으로 대체

3. **문장 구조 최적화**
   - 짧은 문장(20-30자)과 긴 문장(40-50자)을 적절히 배합
   - 나열식 서술 지양, 의미 단위별 문장 구성
   - 문장 연결이 자연스럽고 유기적이어야 함

4. **추측성 표현 절대 금지**
   - "~할 수 있을 것으로 기대됨" ❌
   - "~하면 좋겠음" ❌
   - "~하기를 바람" ❌
   - 관찰된 사실만 객관적으로 서술

5. **글자 수 최적화**
   - 350-480자 범위 준수 (너무 짧으면 관찰 근거가 부족하고, 너무 길면 산만함)
   - 핵심 내용만 간결하고 명확하게 서술

6. **관찰 근거 확장**
   - 선택된 키워드를 단순히 이어 붙이지 말고 학습 태도, 관계 태도, 과제 수행, 성장 모습으로 나누어 서술
   - "친구를 도움"처럼 단편 표현으로 끝내지 말고 어떤 태도와 변화가 드러나는지 구체화
   - "돕는함", "대하는함", "보이는함", "참여하는함"처럼 관형형 뒤에 함을 붙인 표현 절대 금지

## 작성 예시
✅ 올바른 예시 (종결어 다양화 + 중복 없음):
"수업에 안정적으로 참여하며 새로운 내용을 이해하려는 태도가 꾸준함. 모둠 활동에서 친구들의 의견을 차분히 듣고 자신의 생각을 분명하게 표현함. 과제 수행 과정에서 필요한 자료를 스스로 확인하고 끝까지 완성하려는 책임감을 보임. 어려움을 겪는 친구에게 먼저 다가가 방법을 함께 찾으며 협력적인 관계를 형성함. 다양한 활동을 통해 학습과 생활 전반에서 성실하고 배려 깊은 성장을 보임."

❌ 잘못된 예시 (종결어 중복, 표현 반복):
"적극적으로 참여함. 적극적으로 도움을 줌함. 책임감이 강함. 책임감을 보임. 긍정적인 태도를 보임함. 긍정적으로 참여함. 의견을 드러냄함."
→ "줌함", "보임함", "드러냄함" 같은 중복 종결어 절대 금지!

행동특성 및 종합의견:`;

    let generatedText = await generateBehaviorText(apiKey, prompt);
    let validation = validateBehaviorCharacteristic(generatedText);

    if (!validation.isValid) {
      const retryPrompt = `${prompt}

이전 생성 결과는 품질 검사를 통과하지 못했습니다.
검사 위반: ${validation.violations.join(', ')}

아래 문장을 참고하되 그대로 복사하지 말고, 반드시 350~480자의 자연스러운 한 문단으로 다시 작성하세요.
이전 결과: ${generatedText}`;

      generatedText = await generateBehaviorText(apiKey, retryPrompt);
      validation = validateBehaviorCharacteristic(generatedText);
    }

    if (!validation.isValid) {
      console.error('행동특성 품질 검증 실패:', validation.violations, generatedText);
      return NextResponse.json({
        success: false,
        error: `AI가 생활기록부 기준에 맞는 문장을 만들지 못했습니다. 다시 생성해주세요. 위반 사유: ${validation.violations.join(', ')}`,
        violations: validation.violations,
      }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      text: validation.validatedText,
      isValid: validation.isValid,
      violations: validation.violations
    });

  } catch (error) {
    console.error('Error generating behavior characteristics:', error);
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getGeminiApiKey } from '@/lib/user-settings';
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

export async function POST(request: NextRequest) {
  try {
    const { keywords, uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ success: false, error: '사용자 인증이 필요합니다.' }, { status: 401 });
    }

    if (!keywords || Object.keys(keywords).length === 0) {
      return NextResponse.json({ success: false, error: '키워드를 선택해주세요.' }, { status: 400 });
    }

    // 사용자의 Gemini API 키 가져오기
    const apiKey = await getGeminiApiKey(uid);
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 입력해주세요.'
      }, { status: 400 });
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
    const prompt = `당신은 초등학교 교사입니다. 다음 키워드들을 바탕으로 학생의 행동특성 및 종합의견을 작성해주세요.

키워드: ${keywordList}

## 📋 NEIS 기재 규칙 (절대 준수)
- 글자수: 400-500자 (공백 포함)
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
**동사 기반 명사형은 그 자체로 완결된 종결어이므로, 뒤에 '함'을 절대 붙이지 말 것!**
- ❌ 드러냄함 → ✅ 드러냄 (드러내다 → 드러냄)
- ❌ 보여줌함 → ✅ 보여줌 (보여주다 → 보여줌)
- ❌ 나타남함 → ✅ 나타남 (나타나다 → 나타남)
- ❌ 느낌함 → ✅ 느낌 (느끼다 → 느낌)
- ❌ 이룸함 → ✅ 이룸 (이루다 → 이룸)

**올바른 명사형 종결어 예시:**
- 드러냄 (O), 보여줌 (O), 나타남 (O), 느낌 (O), 이룸 (O)
- 절대로 뒤에 '함'을 붙이지 말 것!

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
   - 400-500자 범위 준수 (너무 길면 산만함)
   - 핵심 내용만 간결하고 명확하게 서술

## 작성 예시
✅ 올바른 예시 (종결어 다양화 + 중복 없음):
"수업에 적극적으로 참여하며 새로운 내용을 빠르게 이해함. 친구들과 협력하여 과제를 완수하고, 어려움에 처한 친구를 자연스럽게 도움. 맡은 일에 대한 책임감이 강하며, 꾸준한 노력으로 학습 능력이 향상됨. 자신의 의견을 명확하게 드러냄."

❌ 잘못된 예시 (종결어 중복, 표현 반복):
"적극적으로 참여함. 적극적으로 도움을 줌함. 책임감이 강함. 책임감을 보임. 긍정적인 태도를 보임함. 긍정적으로 참여함. 의견을 드러냄함."
→ "줌함", "보임함", "드러냄함" 같은 중복 종결어 절대 금지!

행동특성 및 종합의견:`;

    // Gemini API 호출 (gemini-2.0-flash 모델 사용)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
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

    // NEIS 규정 검증 및 자동 수정 (Apps Script 로직 100% 적용)
    const validation = validateBehaviorCharacteristic(generatedText);

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

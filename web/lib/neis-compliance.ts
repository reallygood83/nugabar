/**
 * NEIS 규정 준수 검증 시스템
 *
 * Apps Script의 checkNeisCompliance() 및 ensureNeisCompliance() 로직 100% 이식
 */

// Apps Script FORBIDDEN_EXPRESSIONS 이식
const FORBIDDEN_EXPRESSIONS = [
  // 신체적 특징 및 외모
  '외모', '생김새', '키가 작', '키가 큰', '뚱뚱', '말랐', '못생긴', '예쁜', '잘생긴',

  // 가정환경 및 개인정보
  '가난', '부자', '편부모', '한부모', '조손가정', '다문화', '이혼', '재혼', '저소득',

  // 차별적 표현
  '장애', '장애인', '문제아', '열등', '우등', '바보', '멍청', '똑똑', '천재',

  // 부정적 평가
  '게으른', '나태', '무능', '실패', '포기', '불성실', '태만', '나쁜',

  // 과도한 긍정 표현
  '완벽', '최고', '최상', '최우수', '1등', '100점',

  // 비교 표현
  '~보다 나은', '~보다 못한', '평균 이하', '평균 이상',

  // 성적 관련 직접 표현
  '성적이 좋', '성적이 나쁜', '점수가 낮', '점수가 높',

  // 행동 문제 직접 명시
  '문제 행동', 'ADHD', '과잉행동', '산만', '폭력', '싸움',

  // 기타 부적절 표현
  '종교', '정치', '인종', '성별', '지역'
];

/**
 * Apps Script checkNeisCompliance() 함수 100% 이식
 *
 * NEIS 규정 준수 여부 검증
 * @param text - 검증할 텍스트
 * @param maxLength - 최대 글자 수 (행동특성: 500, 누가기록: 150)
 * @returns 검증 결과 객체
 */
export function checkNeisCompliance(text: string, maxLength: number = 500): {
  isCompliant: boolean;
  violations: string[];
  characterCount: number;
  hasProperEnding: boolean;
} {
  const violations: string[] = [];
  const trimmedText = text.trim();

  // 1. 글자 수 검증
  const characterCount = trimmedText.length;
  if (characterCount > maxLength) {
    violations.push(`글자 수 초과 (${characterCount}자 / 최대 ${maxLength}자)`);
  }

  if (characterCount === 0) {
    violations.push('빈 텍스트');
  }

  // 2. 마침표 종결 검증 (Apps Script 로직)
  const hasProperEnding = /[.!?]$/.test(trimmedText);
  if (!hasProperEnding) {
    violations.push('문장 종결 부호(. ! ?) 누락');
  }

  // 2-1. 명사형 종결어미 검증 (Apps Script NEIS 규정)
  const sentences = trimmedText.split(/[.!?]/).filter(s => s.trim().length > 0);
  const invalidEndings: string[] = [];

  // 올바른 명사형 종결어미 패턴 (동사 기반 명사형 포함)
  const validEndings = /(함|임|됨|음|냄|줌|남|감|봄|듦|짐|킴|침|림|룸|을 보임|를 보임|하는 모습을 보임|는 모습을 보임|하는 특성을 보임|에 해당함|으로 나타남|하며 성장함)$/;

  // 금지된 어미 패턴 (Apps Script 로직)
  const prohibitedEndings = /(습니함|했습니함|였습니함|았습니함|었습니함|했습니다|였습니다|았습니다|었습니다|입니다|합니다|했다|한다|이다|해요|했어요|아요|어요)$/;

  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim();
    if (trimmed.length === 0) return;

    // 금지된 어미 체크
    if (prohibitedEndings.test(trimmed)) {
      invalidEndings.push(`문장 ${index + 1}: 금지된 어미 사용 (${trimmed.match(prohibitedEndings)?.[0]})`);
    }
    // 올바른 명사형 종결어미 체크
    else if (!validEndings.test(trimmed)) {
      invalidEndings.push(`문장 ${index + 1}: 명사형 종결어미 미준수`);
    }
  });

  if (invalidEndings.length > 0) {
    violations.push(...invalidEndings);
  }

  // 3. 금지 표현 검증
  const foundForbiddenExpressions: string[] = [];
  for (const forbidden of FORBIDDEN_EXPRESSIONS) {
    if (trimmedText.includes(forbidden)) {
      foundForbiddenExpressions.push(forbidden);
    }
  }

  if (foundForbiddenExpressions.length > 0) {
    violations.push(
      `금지 표현 포함: ${foundForbiddenExpressions.join(', ')}`
    );
  }

  // 4. 기타 규정 검증
  // 연속된 공백 검증
  if (/\s{2,}/.test(trimmedText)) {
    violations.push('연속된 공백 포함');
  }

  // 특수문자 과다 사용 검증
  const specialCharCount = (trimmedText.match(/[^\w\s가-힣.,!?]/g) || []).length;
  if (specialCharCount > 5) {
    violations.push('특수문자 과다 사용');
  }

  return {
    isCompliant: violations.length === 0,
    violations,
    characterCount,
    hasProperEnding
  };
}

/**
 * Apps Script ensureNeisCompliance() 함수 100% 이식
 *
 * 텍스트를 NEIS 규정에 맞게 자동 수정
 * @param text - 수정할 텍스트
 * @param maxLength - 최대 글자 수
 * @returns 수정된 텍스트
 */
export function ensureNeisCompliance(text: string, maxLength: number = 500): string {
  let result = text.trim();

  // 1. 연속된 공백 제거
  result = result.replace(/\s{2,}/g, ' ');

  // 2. 금지 표현 제거
  for (const forbidden of FORBIDDEN_EXPRESSIONS) {
    result = result.replace(new RegExp(forbidden, 'g'), '');
  }

  // 3. 글자 수 제한 (Apps Script 로직: 초과 시 마지막 문장 단위로 잘라냄)
  if (result.length > maxLength) {
    // 문장 단위로 분할
    const sentences = result.split(/([.!?])/);
    let truncated = '';

    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i] + (sentences[i + 1] || '');
      if ((truncated + sentence).length <= maxLength - 3) {
        truncated += sentence;
      } else {
        break;
      }
    }

    // 150자 제한의 경우 "..." 추가
    if (maxLength === 150 && truncated.length < result.length) {
      result = truncated.trim() + '...';
    } else {
      result = truncated.trim();
    }
  }

  // 4. 명사형 종결어미 자동 수정 (Apps Script validateAndCorrectNounEndings 로직)
  // 문장을 마침표 기준으로 분리 (마침표는 제거)
  const sentences = result.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const correctedSentences: string[] = [];

  for (const sent of sentences) {
    let sentence = sent.trim();
    if (sentence.length === 0) continue;

    // 금지된 어미 패턴 (중복 패턴 추가)
    const prohibitedEndings = /(습니함|했습니함|였습니함|았습니함|었습니함|했습니다|였습니다|았습니다|었습니다|입니다|합니다|했다|한다|이다|해요|했어요|아요|어요|큼함|작음함|많음함|적음함|높음함|낮음함|좋음함|나쁨함|함함|음함|임함|됨함)$/;

    // 올바른 명사형 종결어미 패턴 (동사 기반 명사형 포함)
    const validEndings = /(함|임|됨|음|큼|작음|많음|적음|높음|낮음|좋음|나쁨|냄|줌|남|감|봄|듦|짐|킴|침|림|룸|을 보임|를 보임|하는 모습을 보임|는 모습을 보임)$/;

    // 1단계: 모든 중복 어미 패턴 제거 (가장 먼저, if 블록 밖에서 처리)
    // 기본 명사형 종결어미 중복 제거
    sentence = sentence.replace(/함함$/, '함');
    sentence = sentence.replace(/음함$/, '음');
    sentence = sentence.replace(/임함$/, '임');
    sentence = sentence.replace(/됨함$/, '됨');

    // 형용사형 어미 중복 제거
    sentence = sentence.replace(/큼함$/, '큼');
    sentence = sentence.replace(/작음함$/, '작음');
    sentence = sentence.replace(/많음함$/, '많음');
    sentence = sentence.replace(/적음함$/, '적음');
    sentence = sentence.replace(/높음함$/, '높음');
    sentence = sentence.replace(/낮음함$/, '낮음');
    sentence = sentence.replace(/좋음함$/, '좋음');
    sentence = sentence.replace(/나쁨함$/, '나쁨');

    // 동사 기반 명사형 어미 중복 제거 (사용자 버그 수정)
    sentence = sentence.replace(/냄함$/, '냄');    // 드러내다 → 드러냄
    sentence = sentence.replace(/줌함$/, '줌');    // 보여주다 → 보여줌
    sentence = sentence.replace(/남함$/, '남');    // 남다 → 남
    sentence = sentence.replace(/감함$/, '감');    // 느끼다 → 느낌
    sentence = sentence.replace(/봄함$/, '봄');    // 보다 → 봄
    sentence = sentence.replace(/듦함$/, '듦');    // 들다 → 듦
    sentence = sentence.replace(/짐함$/, '짐');    // 지다 → 짐
    sentence = sentence.replace(/킴함$/, '킴');    // 끼다 → 끼침
    sentence = sentence.replace(/침함$/, '침');    // 하다 → 함 (끼침, 꺼침 등)
    sentence = sentence.replace(/림함$/, '림');    // 이루다 → 이룸
    sentence = sentence.replace(/룸함$/, '룸');    // 이루다 → 이룸

    // 2단계: 형용사형 어미 변환 (모든 문장에 적용, if 블록 밖)
    sentence = sentence.replace(/커요$/, '큼');
    sentence = sentence.replace(/작아요$/, '작음');
    sentence = sentence.replace(/많아요$/, '많음');
    sentence = sentence.replace(/적어요$/, '적음');
    sentence = sentence.replace(/높아요$/, '높음');
    sentence = sentence.replace(/낮아요$/, '낮음');
    sentence = sentence.replace(/좋아요$/, '좋음');
    sentence = sentence.replace(/나빠요$/, '나쁨');
    sentence = sentence.replace(/크아요$/, '큼');

    // 3단계: 금지된 어미를 명사형으로 변환
    if (prohibitedEndings.test(sentence)) {
      // ~습니함 (잘못된 중복 어미) → ~함
      sentence = sentence.replace(/습니함$/, '함');
      sentence = sentence.replace(/했습니함$/, '함');
      sentence = sentence.replace(/였습니함$/, '임');
      sentence = sentence.replace(/았습니함$/, '함');
      sentence = sentence.replace(/었습니함$/, '함');

      // ~했습니다 → ~함
      sentence = sentence.replace(/했습니다$/, '함');
      sentence = sentence.replace(/였습니다$/, '임');
      sentence = sentence.replace(/았습니다$/, '함');
      sentence = sentence.replace(/었습니다$/, '함');

      // ~합니다 → ~함
      sentence = sentence.replace(/합니다$/, '함');
      sentence = sentence.replace(/입니다$/, '임');

      // ~했다/한다 → ~함
      sentence = sentence.replace(/했다$/, '함');
      sentence = sentence.replace(/한다$/, '함');
      sentence = sentence.replace(/이다$/, '임');

      // ~해요/했어요 → ~함
      sentence = sentence.replace(/해요$/, '함');
      sentence = sentence.replace(/했어요$/, '함');

      // 일반적인 ~아요/어요 → ~음 (형용사 변환 후에 처리)
      sentence = sentence.replace(/아요$/, '음');
      sentence = sentence.replace(/어요$/, '음');
    }

    // 여전히 올바른 어미가 아니면 기본 "~함" 추가
    if (!validEndings.test(sentence)) {
      // 동사형 어간 추출 시도
      if (sentence.endsWith('하')) {
        sentence += '는 모습을 보임';
      } else if (sentence.endsWith('이')) {
        sentence = sentence.slice(0, -1) + '임';
      } else {
        sentence += '함';
      }
    }

    correctedSentences.push(sentence);
  }

  // 마침표로 연결 (각 문장 끝에만 마침표 추가)
  result = correctedSentences.join('. ').trim();

  // 5. 마침표 종결 보장
  if (result.length > 0 && !/[.!?]$/.test(result)) {
    if (maxLength === 500) {
      result += '.';
    } else if (maxLength === 150) {
      if (!result.endsWith('...')) {
        result += '.';
      }
    }
  }

  // 5. 재검증 및 안전 처리
  const finalCheck = checkNeisCompliance(result, maxLength);
  if (!finalCheck.isCompliant) {
    // 여전히 규정 위반 시 강제 트림
    if (finalCheck.characterCount > maxLength) {
      result = result.substring(0, maxLength - 1) + '.';
    }
  }

  return result;
}

/**
 * 행동특성 전용 NEIS 검증 (500자 제한)
 */
export function validateBehaviorCharacteristic(text: string): {
  isValid: boolean;
  validatedText: string;
  violations: string[];
} {
  const compliance = checkNeisCompliance(text, 500);

  if (!compliance.isCompliant) {
    const validatedText = ensureNeisCompliance(text, 500);
    return {
      isValid: false,
      validatedText,
      violations: compliance.violations
    };
  }

  return {
    isValid: true,
    validatedText: text,
    violations: []
  };
}

/**
 * 누가기록 전용 NEIS 검증 (150자 제한)
 */
export function validateCumulativeRecord(text: string): {
  isValid: boolean;
  validatedText: string;
  violations: string[];
} {
  const compliance = checkNeisCompliance(text, 150);

  if (!compliance.isCompliant) {
    const validatedText = ensureNeisCompliance(text, 150);
    return {
      isValid: false,
      validatedText,
      violations: compliance.violations
    };
  }

  return {
    isValid: true,
    validatedText: text,
    violations: []
  };
}

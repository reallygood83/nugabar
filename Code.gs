// =================================================================================
// 파일: NugaBar_Complete_GoogleAppsScript.gs - Complete System 63개 키워드 완전 통합
// Complete System의 모든 기능을 Google Apps Script로 완전 이식
// =================================================================================

/**
 * @OnlyCurrentDoc
 * @RequiredScopes https://www.googleapis.com/auth/script.external_request
 */

/**
 * 권한 승인을 위한 트리거 함수 - 개발자가 한 번만 실행하여 권한 승인 받기
 * 사용자는 권한 승인할 필요 없음 - 개발자가 승인하면 모든 사용자가 사용 가능
 */
function authorizePermissions() {
  try {
    // 간단한 외부 요청으로 권한 트리거
    const response = UrlFetchApp.fetch('https://www.google.com');
    console.log('✅ 권한 승인 완료 - 모든 사용자가 사용 가능');
    return '권한이 성공적으로 승인되었습니다. 이제 모든 사용자가 API 기능을 사용할 수 있습니다.';
  } catch (error) {
    console.error('❌ 권한 승인 필요:', error);
    throw new Error('권한 승인이 필요합니다. 개발자가 이 함수를 Apps Script 편집기에서 실행해주세요.');
  }
}

/**
 * testGeminiApiKey 함수 실행 시 자동으로 권한 승인 처리
 */
function testPermissions() {
  // 이 함수를 실행하면 권한 승인 팝업이 나타남
  return testGeminiApiKey('test-key-for-permission');
}

/**
 * NugaBar Complete System 웹앱 진입점
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('NugaBarComplete')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('누가기록 생성기 - Complete System 완전 통합');
}

/**
 * Complete System 63개 키워드 데이터베이스 (완전 이식)
 */
const OBSERVATION_CATEGORIES = [
  {
    id: 'learning_attitude',
    name: '학습태도',
    description: '수업 참여도, 집중력, 과제 수행 등',
    order: 1,
    color: '#4285F4',
    keywords: [
      {
        id: 'active_participation',
        text: '적극적 참여',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '수업에 적극적으로 참여하며',
        description: '발표, 질문, 토론 등에 능동적 참여'
      },
      {
        id: 'high_concentration',
        text: '집중력 우수',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '높은 집중력을 보이며',
        description: '수업 시간 내내 집중하여 참여'
      },
      {
        id: 'frequent_questions',
        text: '질문 빈도 높음',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '궁금한 점을 적극적으로 질문하며',
        description: '호기심을 바탕으로 한 적극적 질문'
      },
      {
        id: 'task_completion',
        text: '과제 성실 수행',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '주어진 과제를 성실히 수행하고',
        description: '과제를 빠짐없이 완성하여 제출'
      },
      {
        id: 'self_directed_learning',
        text: '자기주도학습',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '스스로 학습 계획을 세우고 실천하며',
        description: '자발적인 학습 태도와 계획성'
      },
      {
        id: 'note_taking',
        text: '필기 정리 우수',
        weight: 3,
        frequency: 0,
        positivity: 'positive',
        autoText: '수업 내용을 체계적으로 정리하며',
        description: '수업 필기를 잘 정리하고 복습에 활용'
      },
      {
        id: 'homework_diligent',
        text: '숙제 성실',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '숙제를 빠짐없이 해오며',
        description: '주어진 숙제를 성실히 완수'
      },
      {
        id: 'learning_preparation',
        text: '학습 준비 철저',
        weight: 3,
        frequency: 0,
        positivity: 'positive',
        autoText: '수업 준비물을 빠짐없이 준비하며',
        description: '교과서, 학용품 등 수업 준비 완벽'
      },
      {
        id: 'attention_needed',
        text: '집중력 개선 필요',
        weight: 3,
        frequency: 0,
        positivity: 'improvement',
        autoText: '수업 집중력 향상이 기대되며',
        description: '주의가 산만하거나 집중 시간이 짧음'
      },
      {
        id: 'passive_participation',
        text: '수동적 참여',
        weight: 3,
        frequency: 0,
        positivity: 'improvement',
        autoText: '보다 적극적인 참여가 기대되며',
        description: '지시에만 따르고 자발성이 부족'
      }
    ]
  },
  {
    id: 'social_skills',
    name: '대인관계',
    description: '협력, 배려, 소통 능력 등',
    order: 2,
    color: '#34A853',
    keywords: [
      {
        id: 'collaborative',
        text: '협력적',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '친구들과 협력하여',
        description: '모둠 활동에서 잘 협력함'
      },
      {
        id: 'caring',
        text: '배려심 많음',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '친구들을 배려하는 마음으로',
        description: '다른 학생들을 잘 도와줌'
      },
      {
        id: 'leadership',
        text: '리더십 발휘',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '모둠을 이끌어가는 리더십을 보이며',
        description: '모둠 활동에서 주도적 역할'
      },
      {
        id: 'conflict_resolution',
        text: '갈등 해결 능력',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '문제 상황을 슬기롭게 해결하며',
        description: '친구 간 갈등을 원만히 해결'
      },
      {
        id: 'communication_skills',
        text: '의사소통 능력',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '자신의 생각을 명확히 표현하고',
        description: '자신의 의견을 잘 전달함'
      },
      {
        id: 'inclusive_behavior',
        text: '포용적 태도',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '모든 친구를 포용하는 마음으로',
        description: '다양한 친구들을 받아들이고 함께함'
      },
      {
        id: 'empathy',
        text: '공감 능력',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '친구들의 마음을 잘 이해하며',
        description: '다른 사람의 감정을 잘 이해하고 공감'
      },
      {
        id: 'helpful_attitude',
        text: '도움주기 적극적',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '어려움에 처한 친구를 적극적으로 도우며',
        description: '친구들의 어려움을 도와주려는 의지'
      },
      {
        id: 'friendship_building',
        text: '친구 사귀기 능숙',
        weight: 3,
        frequency: 0,
        positivity: 'positive',
        autoText: '새로운 친구들과 쉽게 친해지며',
        description: '새로운 환경에서 빠르게 적응하고 친구 사귐'
      },
      {
        id: 'shy_interaction',
        text: '소극적 교우관계',
        weight: 3,
        frequency: 0,
        positivity: 'improvement',
        autoText: '친구들과의 활발한 교류가 기대되며',
        description: '친구들과의 상호작용이 부족'
      }
    ]
  },
  {
    id: 'cognitive_abilities',
    name: '학습능력',
    description: '이해력, 사고력, 창의성 등',
    order: 3,
    color: '#EA4335',
    keywords: [
      {
        id: 'quick_understanding',
        text: '이해력 빠름',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '새로운 내용을 빠르게 이해하며',
        description: '설명을 듣고 즉시 이해함'
      },
      {
        id: 'good_application',
        text: '응용력 좋음',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '학습한 내용을 다양하게 응용하며',
        description: '배운 것을 새로운 상황에 적용'
      },
      {
        id: 'creative_thinking',
        text: '창의적 사고',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '독창적인 아이디어로',
        description: '기존과 다른 참신한 접근'
      },
      {
        id: 'logical_expression',
        text: '논리적 표현',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '논리적으로 설명하며',
        description: '체계적이고 순서있는 설명'
      },
      {
        id: 'analytical_thinking',
        text: '분석적 사고',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '문제를 체계적으로 분석하며',
        description: '복잡한 내용을 잘 분석함'
      },
      {
        id: 'problem_solving',
        text: '문제해결력',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '어려운 문제에 도전하여 해결하며',
        description: '복잡한 문제를 단계적으로 해결'
      },
      {
        id: 'critical_thinking',
        text: '비판적 사고',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '다양한 관점에서 생각하며',
        description: '주어진 정보를 비판적으로 검토'
      },
      {
        id: 'memory_retention',
        text: '기억력 우수',
        weight: 3,
        frequency: 0,
        positivity: 'positive',
        autoText: '학습한 내용을 오래 기억하며',
        description: '배운 내용을 잘 기억하고 활용'
      },
      {
        id: 'synthesis_skills',
        text: '종합 사고력',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '여러 정보를 종합하여 판단하며',
        description: '다양한 정보를 통합하여 결론 도출'
      },
      {
        id: 'needs_reinforcement',
        text: '기초 개념 보강 필요',
        weight: 3,
        frequency: 0,
        positivity: 'improvement',
        autoText: '기초 개념 이해가 더욱 향상되면',
        description: '기본 개념의 추가 학습이 필요'
      }
    ]
  },
  {
    id: 'participation_level',
    name: '참여도',
    description: '발표, 토론, 활동 참여 정도',
    order: 4,
    color: '#FBBC04',
    keywords: [
      {
        id: 'active_presentation',
        text: '발표 적극적',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '자신 있게 발표하며',
        description: '발표 기회에 적극적으로 참여'
      },
      {
        id: 'discussion_leader',
        text: '토론 주도',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '토론을 주도적으로 이끌어가며',
        description: '토론에서 중심적 역할 수행'
      },
      {
        id: 'idea_contributor',
        text: '아이디어 제시',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '참신한 아이디어를 제시하며',
        description: '새로운 아이디어를 자주 제안'
      },
      {
        id: 'group_activity_leader',
        text: '모둠활동 주도',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '모둠 활동에서 주도적 역할을 하며',
        description: '모둠 활동을 이끌어감'
      },
      {
        id: 'volunteer_actively',
        text: '자원봉사 적극적',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '자원봉사 활동에 적극적으로 참여하며',
        description: '봉사활동이나 도움이 필요한 일에 적극 참여'
      },
      {
        id: 'class_responsibility',
        text: '학급 업무 성실',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '맡은 학급 업무를 성실히 수행하며',
        description: '주어진 역할과 책임을 다함'
      },
      {
        id: 'event_participation',
        text: '행사 참여 적극적',
        weight: 3,
        frequency: 0,
        positivity: 'positive',
        autoText: '학교 행사에 적극적으로 참여하며',
        description: '학교의 다양한 행사와 활동에 참여'
      },
      {
        id: 'opinion_expression',
        text: '의견 표현 적극적',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '자신의 의견을 적극적으로 표현하며',
        description: '자신의 생각과 의견을 명확히 전달'
      },
      {
        id: 'presentation_anxiety',
        text: '발표 부담감',
        weight: 3,
        frequency: 0,
        positivity: 'improvement',
        autoText: '발표에 대한 자신감 향상이 기대되며',
        description: '발표를 어려워하거나 피하려 함'
      },
      {
        id: 'observer_role',
        text: '관찰자 역할',
        weight: 3,
        frequency: 0,
        positivity: 'neutral',
        autoText: '신중하게 관찰하며',
        description: '직접 참여보다는 관찰을 선호'
      }
    ]
  },
  {
    id: 'character_traits',
    name: '성격특성',
    description: '성실성, 책임감, 인내심 등',
    order: 5,
    color: '#9C27B0',
    keywords: [
      {
        id: 'responsible',
        text: '책임감 강함',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '맡은 일에 책임감을 갖고',
        description: '자신의 역할을 끝까지 완수'
      },
      {
        id: 'diligent',
        text: '성실함',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '성실한 태도로',
        description: '꾸준하고 성실한 학습 태도'
      },
      {
        id: 'patient',
        text: '인내심 있음',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '끈기있게 노력하며',
        description: '어려운 상황에서도 포기하지 않음'
      },
      {
        id: 'organized',
        text: '체계적',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '체계적으로 정리하며',
        description: '계획적이고 정돈된 학습'
      },
      {
        id: 'curious',
        text: '호기심 많음',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '호기심을 바탕으로',
        description: '새로운 것에 대한 관심이 높음'
      },
      {
        id: 'honest',
        text: '정직함',
        weight: 5,
        frequency: 0,
        positivity: 'positive',
        autoText: '진실한 마음으로',
        description: '거짓말하지 않고 솔직한 태도'
      },
      {
        id: 'considerate',
        text: '사려깊음',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '사려깊게 행동하며',
        description: '다른 사람을 배려하며 신중하게 행동'
      },
      {
        id: 'positive_attitude',
        text: '긍정적 사고',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '긍정적인 마음으로',
        description: '어려운 상황에서도 긍정적으로 접근'
      },
      {
        id: 'self_control',
        text: '자기통제력',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '자신을 잘 조절하며',
        description: '감정이나 행동을 적절히 조절'
      },
      {
        id: 'impulsive',
        text: '충동적 행동',
        weight: 3,
        frequency: 0,
        positivity: 'improvement',
        autoText: '신중한 행동이 더욱 기대되며',
        description: '생각 없이 행동하는 경우가 있음'
      }
    ]
  },
  {
    id: 'special_talents',
    name: '특기사항',
    description: '특별한 재능이나 관심사',
    order: 6,
    color: '#FF9800',
    keywords: [
      {
        id: 'artistic_talent',
        text: '예술적 재능',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '뛰어난 예술적 감각으로',
        description: '그리기, 만들기 등 예술 활동에 재능'
      },
      {
        id: 'mathematical_aptitude',
        text: '수학적 사고력',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '뛰어난 수학적 사고력으로',
        description: '수학적 문제 해결 능력이 뛰어남'
      },
      {
        id: 'language_skills',
        text: '언어 능력',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '우수한 언어 능력으로',
        description: '읽기, 쓰기, 말하기 능력이 뛰어남'
      },
      {
        id: 'physical_coordination',
        text: '신체 협응력',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '뛰어난 신체 협응력으로',
        description: '체육 활동이나 손재주가 좋음'
      },
      {
        id: 'technology_interest',
        text: '기술 관심도',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '기술에 대한 높은 관심으로',
        description: 'IT, 과학 기술에 특별한 흥미'
      },
      {
        id: 'musical_talent',
        text: '음악적 재능',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '음악적 재능을 발휘하며',
        description: '노래, 악기 연주 등 음악 활동에 소질'
      },
      {
        id: 'athletic_ability',
        text: '운동 능력',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '우수한 운동 능력으로',
        description: '다양한 체육 활동에서 뛰어난 성과'
      },
      {
        id: 'science_interest',
        text: '과학 탐구심',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '과학에 대한 탐구심으로',
        description: '과학 실험과 탐구 활동에 흥미'
      },
      {
        id: 'writing_talent',
        text: '글쓰기 재능',
        weight: 4,
        frequency: 0,
        positivity: 'positive',
        autoText: '뛰어난 글쓰기 실력으로',
        description: '창의적이고 논리적인 글쓰기 능력'
      },
      {
        id: 'area_exploration',
        text: '관심 영역 탐색',
        weight: 3,
        frequency: 0,
        positivity: 'neutral',
        autoText: '다양한 영역을 탐색하며',
        description: '아직 특별한 관심사를 찾는 중'
      }
    ]
  }
];

/**
 * 강도 조절 시스템 (Complete System 완전 이식)
 */
const INTENSITY_MODIFIERS = {
  1: { prefix: '약간', suffix: '경향을 보임' },      // 약간
  2: { prefix: '', suffix: '모습을 보임' },         // 보통  
  3: { prefix: '매우', suffix: '뛰어난 모습을 보임' } // 매우
};

/**
 * NEIS 생기부 작성 규정
 */
const NEIS_REGULATIONS = {
  maxLength: 500,
  mandatoryEnding: ['함', '임', '됨', '을 보임', '하는 모습을 보임'],
  prohibitedContent: ['학생 이름', '구체적 날짜', '시간 표현'],
  requiredFormat: {
    coreValueInParentheses: false,
    objectiveDescription: true,
    specificBehaviorExamples: true,
    positiveExpression: true
  }
};

/**
 * GEMINI API 설정 및 Configuration
 */
const GEMINI_CONFIG = {
  model: 'gemini-2.0-flash-exp',
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',
  generationConfig: {
    temperature: 0.7,
    topK: 32,
    topP: 1,
    maxOutputTokens: 4096,
    stopSequences: []
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ]
};

/**
 * GEMINI API 키 관리
 */
/**
 * 개선된 GEMINI API 키 조회 함수
 */
function getGeminiApiKey() {
  try {
    const properties = PropertiesService.getScriptProperties();
    let apiKey = properties.getProperty('GEMINI_API_KEY');
    
    console.log('🔑 API 키 조회 시도...');
    console.log('🔑 저장된 API 키 존재 여부:', !!apiKey);
    
    if (!apiKey) {
      // 백업 키 조회 시도
      apiKey = properties.getProperty('GEMINI_API_KEY_BACKUP');
      console.log('🔑 백업 API 키 조회:', !!apiKey);
    }
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('GEMINI API 키가 설정되지 않았습니다.');
    }
    
    // API 키 유효성 기본 검증
    if (apiKey.length < 20) {
      throw new Error('잘못된 형식의 API 키입니다.');
    }
    
    console.log('🔑 API 키 검증 성공, 마지막 4자리:', apiKey.slice(-4));
    return apiKey;
    
  } catch (error) {
    console.error('🔑 API 키 조회 실패:', error.message);
    throw error;
  }
}

/**
 * 완전 재작성된 GEMINI API 키 테스트 함수
 */
function testGeminiApiKey(testApiKey) {
  const DEBUG_MODE = true;
  
  function debugLog(message, data = null) {
    if (DEBUG_MODE) {
      console.log(`🧪 [API TEST] ${message}`);
      if (data) console.log('🧪 [TEST DATA]', data);
    }
  }
  
  try {
    debugLog('API 키 테스트 시작');
    
    // 1. 입력값 검증
    if (!testApiKey || typeof testApiKey !== 'string') {
      debugLog('테스트 실패: API 키가 제공되지 않음');
      return {
        success: false,
        message: 'API 키가 제공되지 않았습니다.',
        error: 'NO_API_KEY'
      };
    }
    
    const cleanApiKey = testApiKey.trim();
    if (cleanApiKey.length < 20) {
      debugLog('테스트 실패: API 키가 너무 짧음', cleanApiKey.length);
      return {
        success: false,
        message: 'API 키 형식이 올바르지 않습니다. (너무 짧음)',
        error: 'INVALID_FORMAT'
      };
    }
    
    debugLog('API 키 형식 검증 통과', `길이: ${cleanApiKey.length}, 마지막 4자리: ${cleanApiKey.slice(-4)}`);
    
    // 2. 테스트 요청 구성
    const testPrompt = 'Hi';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${cleanApiKey}`;
    
    const requestBody = {
      contents: [{
        role: 'user',
        parts: [{ text: testPrompt }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 20,
        topK: 1,
        topP: 1
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NugaRecord-Test/1.0'
      },
      payload: JSON.stringify(requestBody),
      muteHttpExceptions: true
    };
    
    debugLog('API 테스트 요청 전송 중...');
    
    // 3. API 호출 실행
    const startTime = new Date().getTime();
    const response = UrlFetchApp.fetch(url, options);
    const endTime = new Date().getTime();
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    debugLog('API 응답 수신', {
      statusCode: responseCode,
      responseTime: `${endTime - startTime}ms`,
      responseLength: responseText.length
    });
    
    // 4. 응답 상태 검증
    if (responseCode === 400) {
      debugLog('테스트 실패: 잘못된 요청 (400)');
      return {
        success: false,
        message: 'API 키가 유효하지 않거나 권한이 없습니다.',
        error: 'INVALID_API_KEY',
        statusCode: responseCode
      };
    }
    
    if (responseCode === 403) {
      debugLog('테스트 실패: 권한 거부 (403)');
      return {
        success: false,
        message: 'API 키 권한이 거부되었습니다. Gemini API가 활성화되어 있는지 확인해주세요.',
        error: 'FORBIDDEN',
        statusCode: responseCode
      };
    }
    
    if (responseCode === 429) {
      debugLog('테스트 실패: 할당량 초과 (429)');
      return {
        success: false,
        message: 'API 할당량을 초과했습니다. 잠시 후 다시 시도해주세요.',
        error: 'QUOTA_EXCEEDED',
        statusCode: responseCode
      };
    }
    
    if (responseCode !== 200) {
      debugLog('테스트 실패: 예상치 못한 상태 코드', responseCode);
      return {
        success: false,
        message: `API 호출 실패 (상태 코드: ${responseCode})`,
        error: 'UNEXPECTED_STATUS',
        statusCode: responseCode,
        responseText: responseText.substring(0, 200)
      };
    }
    
    // 5. 응답 데이터 파싱
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      debugLog('테스트 실패: JSON 파싱 오류', parseError.message);
      return {
        success: false,
        message: 'API 응답 형식이 올바르지 않습니다.',
        error: 'PARSE_ERROR'
      };
    }
    
    // 6. 응답 내용 검증
    if (responseData.error) {
      debugLog('테스트 실패: API 오류 응답', responseData.error);
      return {
        success: false,
        message: `API 오류: ${responseData.error.message || responseData.error.code}`,
        error: 'API_ERROR',
        apiError: responseData.error
      };
    }
    
    if (!responseData.candidates || responseData.candidates.length === 0) {
      debugLog('테스트 실패: 응답 후보 없음');
      return {
        success: false,
        message: 'API 응답에서 내용을 찾을 수 없습니다.',
        error: 'NO_CANDIDATES'
      };
    }
    
    const candidate = responseData.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      debugLog('테스트 실패: 응답 내용 없음');
      return {
        success: false,
        message: 'API 응답 내용이 비어있습니다.',
        error: 'EMPTY_CONTENT'
      };
    }
    
    const testResponse = candidate.content.parts[0].text.trim();
    debugLog('테스트 성공!', {
      responseLength: testResponse.length,
      finishReason: candidate.finishReason
    });
    
    // 7. 성공 시 API 키 저장
    try {
      PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', cleanApiKey);
      debugLog('API 키 저장 완료');
    } catch (saveError) {
      debugLog('API 키 저장 실패', saveError.message);
      return {
        success: false,
        message: 'API 키는 유효하지만 저장에 실패했습니다.',
        error: 'SAVE_ERROR'
      };
    }
    
    return {
      success: true,
      message: 'API 키가 정상적으로 작동합니다.',
      testResponse: testResponse.substring(0, 50) + (testResponse.length > 50 ? '...' : ''),
      responseTime: endTime - startTime,
      keyPreview: cleanApiKey.slice(-4)
    };
    
  } catch (error) {
    console.error('API 키 테스트 오류:', error);
    
    let errorMessage = 'API 키 테스트 중 오류가 발생했습니다.';
    
    if (error.message.includes('API_KEY_INVALID')) {
      errorMessage = 'API 키가 유효하지 않습니다. 올바른 Gemini API 키를 입력해주세요.';
    } else if (error.message.includes('PERMISSION_DENIED')) {
      errorMessage = 'API 키 권한이 없습니다. API 키 설정을 확인해주세요.';
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      errorMessage = 'API 할당량이 초과되었습니다. 나중에 다시 시도해주세요.';
    }
    
    return {
      success: false,
      message: errorMessage,
      error: error.message
    };
  }
}

/**
 * GEMINI API 호출 함수
 */
/**
 * 완전 재설계된 GEMINI API 통신 함수 - 견고성과 디버깅 강화
 */
function callGeminiAPI(prompt, systemInstruction = '') {
  const DEBUG_MODE = true;
  const MAX_RETRIES = 2;
  
  function debugLog(message, data = null) {
    if (DEBUG_MODE) {
      console.log(`🔥 [GEMINI API] ${message}`);
      if (data) console.log('🔥 [DATA]', data);
    }
  }
  
  function validateInputs(prompt, systemInstruction) {
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('유효한 prompt가 필요합니다.');
    }
    if (prompt.length > 30000) {
      throw new Error('프롬프트가 너무 깁니다. (최대 30,000자)');
    }
    if (systemInstruction && systemInstruction.length > 10000) {
      throw new Error('시스템 지시사항이 너무 깁니다. (최대 10,000자)');
    }
    return true;
  }
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      debugLog(`API 호출 시도 ${attempt}/${MAX_RETRIES}`);
      
      // 1. 입력값 검증
      validateInputs(prompt, systemInstruction);
      
      // 2. API 키 검증
      const apiKey = getGeminiApiKey();
      if (!apiKey || apiKey.length < 10) {
        throw new Error('유효하지 않은 API 키입니다.');
      }
      debugLog('API 키 검증 완료', `마지막 4자리: ${apiKey.slice(-4)}`);
      
      // 3. URL 구성
      const url = `${GEMINI_CONFIG.apiUrl}${GEMINI_CONFIG.model}:generateContent?key=${apiKey}`;
      debugLog('API URL 구성 완료', url.replace(apiKey, '***'));
      
      // 4. 요청 본문 구성 - 완전히 검증된 구조
      const requestBody = {
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
          stopSequences: []
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH', 
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };
      
      // 5. systemInstruction 추가 (별도 필드)
      if (systemInstruction && systemInstruction.trim().length > 0) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction.trim() }]
        };
        debugLog('시스템 지시사항 추가됨', `길이: ${systemInstruction.length}자`);
      }
      
      const payloadSize = JSON.stringify(requestBody).length;
      debugLog(`요청 본문 크기: ${payloadSize}자`);
      
      if (payloadSize > 1000000) { // 1MB 제한
        throw new Error('요청 본문이 너무 큽니다.');
      }
      
      // 6. HTTP 요청 옵션
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'GAS-NugaRecord/1.0'
        },
        payload: JSON.stringify(requestBody),
        muteHttpExceptions: true
      };
      
      // 7. API 호출 실행
      debugLog('API 요청 전송 중...');
      const startTime = new Date().getTime();
      const response = UrlFetchApp.fetch(url, options);
      const endTime = new Date().getTime();
      
      const responseCode = response.getResponseCode();
      const responseText = response.getContentText();
      
      debugLog(`API 응답 수신`, {
        statusCode: responseCode,
        responseTime: `${endTime - startTime}ms`,
        responseSize: `${responseText.length}자`
      });
      
      // 8. HTTP 상태 코드 검증
      if (responseCode === 429) {
        const waitTime = Math.min(2000 * attempt, 10000);
        debugLog(`Rate limit 감지, ${waitTime}ms 대기 후 재시도...`);
        Utilities.sleep(waitTime);
        continue;
      }
      
      if (responseCode !== 200) {
        let errorMessage = `HTTP ${responseCode}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          errorMessage += `: ${responseText.substring(0, 200)}`;
        }
        throw new Error(`API 호출 실패: ${errorMessage}`);
      }
      
      // 9. 응답 데이터 파싱 및 검증
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`응답 파싱 실패: ${parseError.message}`);
      }
      
      debugLog('응답 데이터 구조', Object.keys(responseData));
      
      // 10. 응답 내용 검증
      if (responseData.error) {
        throw new Error(`API 오류: ${responseData.error.message || responseData.error.code}`);
      }
      
      if (!responseData.candidates || responseData.candidates.length === 0) {
        throw new Error('응답에서 후보를 찾을 수 없습니다.');
      }
      
      const candidate = responseData.candidates[0];
      
      // 11. 응답 완료 상태 확인
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        const reason = candidate.finishReason;
        debugLog(`응답 중단됨: ${reason}`);
        
        if (reason === 'SAFETY') {
          throw new Error('안전 필터에 의해 응답이 차단되었습니다. 프롬프트를 수정해주세요.');
        }
        if (reason === 'MAX_TOKENS') {
          debugLog('토큰 한계 도달, 부분 응답 사용');
        } else {
          throw new Error(`응답 생성 중단: ${reason}`);
        }
      }
      
      // 12. 최종 텍스트 추출
      const content = candidate.content;
      if (!content || !content.parts || content.parts.length === 0) {
        throw new Error('응답 내용이 비어있습니다.');
      }
      
      const generatedText = content.parts[0].text;
      if (!generatedText || generatedText.trim().length === 0) {
        throw new Error('생성된 텍스트가 비어있습니다.');
      }
      
      debugLog('✅ AI 응답 성공', {
        textLength: generatedText.length,
        finishReason: candidate.finishReason,
        attempt: attempt
      });
      
      return {
        success: true,
        content: generatedText.trim(),
        usage: responseData.usageMetadata || {},
        metadata: {
          responseTime: endTime - startTime,
          attempt: attempt,
          finishReason: candidate.finishReason
        }
      };
      
    } catch (error) {
      debugLog(`시도 ${attempt} 실패`, error.toString());
      
      if (attempt === MAX_RETRIES) {
        console.error('🔥 GEMINI API 최종 실패:', error);
        return {
          success: false,
          error: error.toString(),
          message: `GEMINI API 호출 실패 (${MAX_RETRIES}회 시도): ${error.message}`,
          lastAttempt: attempt
        };
      }
      
      // 재시도 가능한 오류인지 확인
      const retryableErrors = ['rate limit', 'timeout', 'network', '429', '500', '502', '503'];
      const isRetryable = retryableErrors.some(errorType => 
        error.toString().toLowerCase().includes(errorType)
      );
      
      if (!isRetryable) {
        console.error('🔥 재시도 불가능한 오류:', error);
        return {
          success: false,
          error: error.toString(),
          message: `GEMINI API 호출 실패: ${error.message}`,
          lastAttempt: attempt
        };
      }
      
      // 재시도 전 대기
      const waitTime = 1000 * attempt;
      debugLog(`${waitTime}ms 대기 후 재시도...`);
      Utilities.sleep(waitTime);
    }
  }
}

/**
 * 사용자 워크스페이스 생성 및 Google Sheets 연동
 */
function createUserWorkspace(userName) {
  try {
    // 새 스프레드시트 생성
    const spreadsheet = SpreadsheetApp.create(`누가기록_${userName}_${new Date().toLocaleDateString()}`);
    const spreadsheetId = spreadsheet.getId();
    
    // 4개 워크시트 생성
    const sheets = {
      studentInfo: spreadsheet.getActiveSheet(),
      keywordRecords: spreadsheet.insertSheet('키워드선택기록'),
      cumulativeRecords: spreadsheet.insertSheet('누가기록'),
      behaviorRecords: spreadsheet.insertSheet('행동특성기록')
    };
    
    // 학생정보 시트 설정
    sheets.studentInfo.setName('학생정보');
    sheets.studentInfo.getRange(1, 1, 1, 6).setValues([['학생번호', '이름', '학급', '생년월일', '성별', '특이사항']]);
    
    // 키워드선택기록 시트 설정
    sheets.keywordRecords.getRange(1, 1, 1, 8).setValues([
      ['날짜', '학생번호', '카테고리', '키워드', '강도', '맥락', '생성텍스트', '사용빈도']
    ]);
    
    // 누가기록 시트 설정
    sheets.cumulativeRecords.getRange(1, 1, 1, 5).setValues([
      ['날짜', '학생번호', '이름', '누가기록', '글자수']
    ]);
    
    // 행동특성기록 시트 설정
    sheets.behaviorRecords.getRange(1, 1, 1, 6).setValues([
      ['날짜', '학생번호', '이름', '행동특성텍스트', '선택키워드수', '글자수']
    ]);
    
    // 헤더 스타일 적용
    Object.values(sheets).forEach(sheet => {
      const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
      headerRange.setBackground('#4285F4');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
    });
    
    return {
      success: true,
      spreadsheetId: spreadsheetId,
      spreadsheetUrl: spreadsheet.getUrl(),
      message: '워크스페이스가 성공적으로 생성되었습니다.'
    };
    
  } catch (error) {
    console.error('워크스페이스 생성 오류:', error);
    return {
      success: false,
      error: error.toString(),
      message: '워크스페이스 생성 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 키워드 데이터베이스 반환
 */
function getKeywordDatabase() {
  return {
    categories: OBSERVATION_CATEGORIES,
    intensityModifiers: INTENSITY_MODIFIERS,
    neisRegulations: NEIS_REGULATIONS
  };
}

/**
 * planetweb 스타일 고급 프롬프트 시스템
 */
const ACHIEVEMENT_STRATEGIES = {
  '매우잘함': {
    focus: '구체적 성취사례와 창의적 접근',
    tone: '적극적, 우수한, 탁월한',
    structure: '활동 → 과정 → 성취 → 발전방향',
    ratio: '사실:성취:발전 = 3:4:3'
  },
  '잘함': {
    focus: '꾸준한 노력과 목표달성 과정',
    tone: '성실한, 지속적인, 향상되는',
    structure: '노력 → 과정 → 성취 → 잠재력',
    ratio: '노력:성취:잠재력 = 4:3:3'
  },
  '보통': {
    focus: '성장가능성과 긍정적 변화',
    tone: '점차, 꾸준히, 발전하는',
    structure: '현재상태 → 변화과정 → 성장징조 → 기대',
    ratio: '현재:변화:기대 = 2:4:4'
  },
  '노력요함': {
    focus: '긍정적 변화와 잠재력 발굴',
    tone: '향후, 지속적으로, 기대되는',
    structure: '관찰사실 → 긍정요소 → 지원방향 → 성장기대',
    ratio: '사실:긍정:기대 = 2:3:5'
  }
};

const EDUCATIONAL_ELEMENTS = {
  '학습태도': {
    핵심역량: ['자기주도학습능력', '학습동기', '학습습관'],
    관찰포인트: ['수업 참여도', '과제 수행', '학습 집중력', '질문 태도'],
    연결어: ['~을 통해 학습 의욕을', '~에서 적극성을', '~과정에서 성실함을']
  },
  '대인관계': {
    핵심역량: ['의사소통능력', '협력능력', '공감능력'],
    관찰포인트: ['친구 관계', '협력 태도', '갈등 해결', '배려심'],
    연결어: ['~를 통해 협력하며', '~에서 배려심을', '~과정에서 소통능력을']
  },
  '학습능력': {
    핵심역량: ['문제해결능력', '창의적사고력', '비판적사고력'],
    관찰포인트: ['이해력', '사고력', '표현력', '응용력'],
    연결어: ['~를 해결하며', '~과정에서 창의적으로', '~를 통해 논리적으로']
  },
  '참여도': {
    핵심역량: ['의사표현능력', '주도성', '적극성'],
    관찰포인트: ['발표 태도', '토론 참여', '활동 주도', '의견 표현'],
    연결어: ['~에 적극 참여하며', '~에서 주도적으로', '~과정을 통해 자신감을']
  },
  '성격특성': {
    핵심역량: ['자기관리능력', '인내심', '책임감'],
    관찰포인트: ['성실성', '끈기', '정직성', '자기통제'],
    연결어: ['~를 꾸준히 실천하며', '~에서 인내심을', '~과정에서 책임감을']
  },
  '특기사항': {
    핵심역량: ['특별재능', '관심영역', '잠재력'],
    관찰포인트: ['예술적 감각', '운동 능력', '과학적 사고', '언어 능력'],
    연결어: ['~에서 특별한 재능을', '~를 통해 잠재력을', '~과정에서 흥미를']
  }
};

/**
 * NEIS 2025 지침 기반 행동특성 생성을 위한 전문 GEMINI 프롬프트 생성
 */
function createBehaviorCharacteristicsPrompt(selectedKeywords, context = {}) {
  // 키워드 분석 및 성취수준 자동 판단
  console.log('🔥 입력된 선택 키워드:', selectedKeywords);
  console.log('🔥 컨텍스트 정보:', context);
  
  // 글자수와 내용 스타일 설정 추출
  const charCount = context.charCount || 500;
  const contentStyle = context.contentStyle || 'generic';
  
  console.log(`🔥 설정된 글자수: ${charCount}, 스타일: ${contentStyle}`);
  
  const keywordAnalysis = selectedKeywords.map((sk, index) => {
    console.log(`🔥 키워드 ${index} 처리:`, sk);
    
    const category = OBSERVATION_CATEGORIES.find(cat => cat.id === sk.categoryId);
    console.log(`🔥 찾은 카테고리:`, category ? category.name : '없음');
    
    const keyword = category ? category.keywords.find(k => k.id === (sk.id || sk.keywordId)) : null;
    console.log(`🔥 찾은 키워드:`, keyword ? keyword.text : '없음');
    
    if (!keyword) {
      console.warn(`🔥 키워드 매핑 실패 - categoryId: ${sk.categoryId}, keywordId: ${sk.keywordId}`);
      return null;
    }
    
    const intensity = INTENSITY_MODIFIERS[sk.intensity || 2];
    const analysis = {
      category: category.name,
      keyword: keyword.text,
      description: keyword.description,
      positivity: keyword.positivity,
      intensity: intensity,
      context: sk.context || '',
      weight: keyword.weight || 3
    };
    
    console.log(`🔥 키워드 ${index} 분석 완료:`, analysis);
    return analysis;
  }).filter(Boolean);
  
  // 성취수준 자동 판단 (키워드 가중치와 긍정성 기반)
  console.log('🔥 키워드 분석 결과 수:', keywordAnalysis.length);
  console.log('🔥 유효한 키워드 분석:', keywordAnalysis);
  
  if (keywordAnalysis.length === 0) {
    console.error('🔥 유효한 키워드가 없음 - 폴백 실행');
    throw new Error('유효한 키워드가 없습니다.');
  }
  
  const totalWeight = keywordAnalysis.reduce((sum, ka) => sum + (ka.weight || 3), 0);
  const avgWeight = totalWeight / keywordAnalysis.length;
  const positiveRatio = keywordAnalysis.filter(ka => ka.positivity === 'positive').length / keywordAnalysis.length;
  
  let achievementLevel = '보통';
  if (avgWeight >= 4.5 && positiveRatio >= 0.8) achievementLevel = '매우잘함';
  else if (avgWeight >= 3.5 && positiveRatio >= 0.6) achievementLevel = '잘함';
  else if (positiveRatio < 0.4) achievementLevel = '노력요함';
  
  const strategy = ACHIEVEMENT_STRATEGIES[achievementLevel];
  
  // 주요 카테고리 식별
  const primaryCategory = keywordAnalysis.reduce((prev, current) => 
    prev.weight > current.weight ? prev : current
  ).category;
  
  const educationalElements = EDUCATIONAL_ELEMENTS[primaryCategory] || EDUCATIONAL_ELEMENTS['학습태도'];
  
  // 내용 스타일에 따른 서술 방식 정의
  const styleSettings = {
    'generic': {
      description: '범용적, 열린형 내용',
      approach: '일반적이고 적응 가능한 표현 중심',
      specificity: '낮음 (구체적 상황보다 일반적 특성 강조)',
      examples: '"다양한 상황에서", "여러 활동을 통해", "꾸준한 노력으로"'
    },
    'balanced': {
      description: '균형잡힌 내용',
      approach: '일반적 특성과 구체적 사례의 조화',
      specificity: '중간 (적절한 구체성과 일반성의 균형)',
      examples: '"모둠 활동에서", "특정 교과 시간에", "프로젝트 수행 중"'
    },
    'specific': {
      description: '구체적, 상세한 내용',
      approach: '구체적 교육활동과 상황 중심 서술',
      specificity: '높음 (세부적 상황과 맥락 포함)',
      examples: '"국어 토론 수업에서", "과학 실험 과정에서", "체육 협력 경기 중"'
    }
  };
  
  const currentStyle = styleSettings[contentStyle] || styleSettings['generic'];
  
  const systemInstruction = `# 2025 NEIS 지침 준수 초등학교 행동특성 및 종합의견 전문 생성

## 📋 NEIS 기재 규칙 (절대 준수)
- 글자수: 정확히 ${charCount-50}-${charCount}자 (공백 포함, 초등학교 기준)
- 형식: 하나의 연결된 문단 (영역별 구분 절대 금지)
- 어조: 명사형 종결 (~함, ~임, ~됨, ~음, ~을 보임, ~하는 모습을 보임)
- 주어 생략: 모든 문장에서 주어('이 학생은', '학생이' 등) 생략 필수
- 금지 어미: '~했습니함', '~했습니다', '~합니다' 등 잘못된 어미 사용 금지
- 학생명: 절대 언급 금지 (개인정보 보호)
- 금지사항: 날짜, 시간, 교외활동, 사교육, 가족배경 언급 금지

## 🎨 내용 스타일 설정: ${contentStyle.toUpperCase()}
- 서술 방식: ${currentStyle.approach}
- 구체성 수준: ${currentStyle.specificity}
- 표현 예시: ${currentStyle.examples}
- 적용성: ${currentStyle.description}

## 🎯 성장 서사(Growth Narrative) 구조 - NEIS 권장 방식
**도전 → 과정/행동 → 결과 → 변화/깨달음**의 흐름으로 구성
- ${achievementLevel} 수준에 맞는 서술 전략 적용
- 중점사항: ${strategy.focus}
- 서술 어조: ${strategy.tone}
- 구조 배분: ${strategy.ratio}

## 🔍 누가기록 기반 구체적 서술 원칙
1. **객관적 관찰 사실**: 교사가 학교 교육활동 내에서 직접 관찰한 내용만 기재
2. **구체적 상황 묘사**: "수업에 열심히 참여함" → "모둠 토의에서 친구 의견을 경청하고 자신의 생각을 논리적으로 제시함"
3. **맥락 포함**: 관찰된 행동의 교육적 상황과 의미를 함께 기록
4. **성장 과정 포착**: 학기 초와 현재의 변화, 극복 노력, 발전 모습을 연결

## 📝 전문적 서술 기법
**강점 서술**: 구체적 일화를 통한 증명 (명사형 종결 필수)
- 나쁜 예: "리더십이 뛰어남"
- 좋은 예: "학급 과학 프로젝트에서 자발적으로 역할을 분배하고 의견 충돌을 중재하여 팀의 성공적 완수를 이끔"

**약점/도전과제 서술**: 반드시 변화 가능성과 함께 제시 (명사형 종결 필수)
- 나쁜 예: "수업 시간에 산만했습니다"
- 좋은 예: "학기 초 개별 과제 집중에 어려움을 보였으나, 체크리스트 활용으로 과제 완성도가 향상되는 등 자기조절 능력 발달을 위해 노력함"

**올바른 명사형 종결어미 사용법** (반드시 준수):
- 동작/행동: ~함 (예: 참여함, 노력함, 발표함, 집중함, 도움을 줌)
- 상태/성질: ~임 (예: 적극적임, 성실함의 대명사임, 우수함)
- 변화/결과: ~됨 (예: 향상됨, 발전됨, 개선됨)
- 소유/특성: ~음 (예: 뛰어남, 우수함, 탁월함)
- 양상/모습: ~을/를 보임 (예: 성장하는 모습을 보임, 발전하는 모습을 보임)
- 완성형: ~하는 특성을 보임 (예: 도전하는 특성을 보임)
- 지속형: ~하며 ~함 (예: 꾸준히 노력하며 성장함)

**🚫 절대 금지 어미** (한국어에 존재하지 않는 잘못된 문법):
- ~습니함 ❌ (완전히 잘못된 어미 - 한국어에 존재하지 않음)
- ~했습니함 ❌ (말이 안 되는 조합)
- ~였습니함 ❌ (존재하지 않는 어미)
- ~였습니다 ❌ (존댓말이므로 금지)
- ~했습니다 ❌ (존댓말이므로 금지)
- ~입니다 ❌ (존댓말이므로 금지)
- ~합니다 ❌ (존댓말이므로 금지)
- ~했다 ❌ (반말이므로 금지)
- ~한다 ❌ (반말이므로 금지)
- ~해요 ❌ (존댓말이므로 금지)
- ~했어요 ❌ (존댓말이므로 금지)

**⚠️ 특히 주의**: "~습니함"은 한국어에 절대 존재하지 않는 어미입니다!
올바른 예: "적극적으로 참여함" (O) / "적극적으로 참여했습니함" (X)

**명사형 종결어미 변환 규칙**:
1. 과거형 → 명사형: "참여했다" → "참여함"
2. 현재형 → 명사형: "노력한다" → "노력함"
3. 존댓말 → 명사형: "발표했습니다" → "발표함"
4. 잘못된 조합 수정: "도움을 주었습니함" → "도움을 줌"
5. 상태 표현: "적극적이다" → "적극적임"

## 🎨 NEIS 지침 준수 표현 기법
- **연결어 활용**: "~을 통해", "~에서", "~과정에서" (인과관계)
- **시간 흐름**: "점차", "꾸준히", "지속적으로" (성장 과정)
- **미래 지향**: "앞으로", "더욱", "계속해서" (발전 기대)
- **교육적 가치 부여**: 단순 행동 나열이 아닌 교육적 의미와 가치 강조

## ⚡ 4단계 생성 지침 (NEIS 권장 구조)
${charCount <= 400 ? 
  '1단계 (80-100자): 주요 교육활동 참여 양상과 관찰 특성 도입\n' +
  '2단계 (120-140자): 키워드 기반 행동사례와 성취과정 서술\n' +
  '3단계 (100-120자): 성취수준별 강점과 성장 가능성 제시\n' +
  '4단계 (60-80자): 교육적 기대와 발전 방향 제시' :
  charCount >= 550 ?
  '1단계 (120-140자): 주요 교육활동 상황에서의 참여 양상과 관찰된 특성을 자연스럽게 도입\n' +
  '2단계 (180-220자): 선택된 키워드 기반 구체적 행동사례와 성취과정을 누가기록 방식으로 서술\n' +
  '3단계 (140-170자): 현재 성취수준에 적합한 긍정적 표현으로 강점과 성장 가능성을 제시\n' +
  '4단계 (100-120자): 향후 교육적 기대와 발전 방향을 핵심역량과 연결하여 미래지향적으로 마무리' :
  '1단계 (100-120자): 주요 교육활동 상황에서의 참여 양상과 관찰된 특성을 자연스럽게 도입\n' +
  '2단계 (150-180자): 선택된 키워드 기반 구체적 행동사례와 성취과정을 누가기록 방식으로 서술\n' +
  '3단계 (120-150자): 현재 성취수준에 적합한 긍정적 표현으로 강점과 성장 가능성을 제시\n' +
  '4단계 (80-100자): 향후 교육적 기대와 발전 방향을 핵심역량과 연결하여 미래지향적으로 마무리'
}

⚠️ NEIS 위반 금지사항:
- 영역별 명시적 구분 금지 (예: "학습태도:", "대인관계:" 등)
- 추상적 미사여구나 형식적 칭찬 지양
- 키워드 단순 나열보다 자연스러운 문장 통합
- 학교 밖 활동이나 사교육 관련 내용 절대 금지

🔍 **명사형 종결어미 최종 검증 지침**:
생성된 모든 문장은 다음 중 하나로 끝나야 함:
✅ 올바른 어미: ~함, ~임, ~됨, ~음, ~을/를 보임, ~하는 특성을 보임, ~하며 성장함
❌ 금지 어미: ~했습니함, ~습니함, ~했습니다, ~합니다, ~했다, ~한다, ~해요, ~했어요

**생성 후 반드시 확인**: 모든 문장이 명사형 종결어미로 끝나는지 검증하고, 잘못된 어미 발견 시 즉시 수정`;

  const userPrompt = `다음 누가기록 기반 관찰 정보를 종합하여 2025 NEIS 지침에 완벽히 준수하는 행동특성 및 종합의견을 작성해주세요:

## 🔍 교육활동 내 관찰된 행동특성 (누가기록 기반)
${keywordAnalysis.map((ka, index) => 
  `${index + 1}. [${ka.category}] ${ka.keyword} (${ka.intensity.prefix || '보통'} 수준)
   • 관찰 내용: ${ka.description}
   • 교육적 맥락: 학교 교육과정 내 ${ka.category} 영역에서 관찰됨
   • 발현 양상: ${ka.positivity === 'positive' ? '긍정적 특성' : '개선 노력 중'}${ka.context ? `\n   • 특이사항: ${ka.context}` : ''}`
).join('\n')}

## 🎯 종합 평가 및 성취수준
- **관찰 기간**: 학기 전반에 걸친 지속적 관찰
- **주요 강점 영역**: ${primaryCategory}
- **성취수준 판정**: ${achievementLevel} (키워드 분석 기반)
- **성장 지향성**: ${Math.round(positiveRatio * 100)}% 긍정적 특성 보임

## 📝 교육과정 맥락 정보
${context.observationContext ? `• 주요 관찰 상황: ${context.observationContext}` : ''}
${context.classActivity ? `• 교육활동 참여: ${context.classActivity}` : ''}
${context.specialProgram ? `• 특별 프로그램: ${context.specialProgram}` : ''}

## ✍️ 작성 요구사항
위의 누가기록을 바탕으로 **${achievementLevel}** 수준에 맞는 행동특성 및 종합의견을 작성해주세요.

**🚨 절대 준수 사항 (위반 시 재생성 필수):**
1. NEIS 지침 완벽 준수 (${charCount-50}-${charCount}자, 명사형 종결, 하나의 문단, 주어 생략)
2. 성장 서사 구조 적용 (도전→과정→결과→변화/깨달음)
3. ${currentStyle.approach} - ${currentStyle.description}
4. 선택된 모든 키워드를 자연스럽게 통합 (나열 금지)
5. 교육적 가치와 미래 발전 가능성 강조

🔥 **최우선 문법 준수 지침**:
6. **명사형 종결어미만 사용**: ~함, ~임, ~됨, ~음, ~을/를 보임 (이것만 허용)
7. **"~습니함" 절대 금지**: 이 어미는 한국어에 존재하지 않는 잘못된 문법
8. **모든 존댓말 금지**: ~습니다, ~합니다, ~였습니다 등 모든 존댓말 어미 사용 금지
9. **반말 금지**: ~했다, ~한다, ~이다 등 모든 반말 어미 사용 금지
10. **주어 완전 생략**: "본 학생은", "이 학생은", "학생이" 등 모든 주어 제거

**스타일별 서술 지침:**
- ${contentStyle === 'generic' ? 
   '✅ 다양한 학생에게 적용 가능한 일반적이고 열린 표현 사용' + 
   '\n- 예: "다양한 교육활동에서", "여러 상황을 통해", "지속적인 노력으로"' + 
   '\n- 구체적 과목명이나 특정 상황보다는 범용적 표현 선호' :
   contentStyle === 'balanced' ?
   '✅ 일반적 특성과 구체적 사례를 적절히 조화하여 서술' +
   '\n- 예: "교과 활동에서", "모둠 과제 수행 시", "창의적 체험활동을 통해"' +
   '\n- 과도하지 않은 수준의 구체성으로 균형 유지' :
   '✅ 구체적 교육활동과 상황을 중심으로 상세히 서술' +
   '\n- 예: "국어 토론 수업에서", "과학 실험 관찰 중", "체육 협력 경기에서"' +
   '\n- 세부적 맥락과 상황을 포함하여 생생하게 표현'
}

**생성할 내용:** ${currentStyle.description}으로 교사가 1년간 관찰한 사실을 바탕으로, 이 학생의 고유한 성장 과정과 교육적 가치를 증명하는 전문적인 종합의견을 작성해주세요.`;

  return { systemInstruction, userPrompt };
}

/**
 * 선택된 키워드로 행동특성 텍스트 생성 (GEMINI API 활용)
 */
/**
 * 완전 재설계된 행동특성 생성 함수 - 견고성과 사용성 강화
 */
function generateBehaviorCharacteristics(selectedKeywords, context = {}) {
  const DEBUG_MODE = true;
  
  function debugLog(message, data = null) {
    if (DEBUG_MODE) {
      console.log(`📝 [BEHAVIOR GEN] ${message}`);
      if (data) console.log('📝 [DATA]', data);
    }
  }
  
  try {
    debugLog('행동특성 생성 시작');
    debugLog('입력 데이터', {
      keywordCount: selectedKeywords?.length || 0,
      contextKeys: Object.keys(context || {}),
      charCount: context?.charCount || '미설정',
      contentStyle: context?.contentStyle || '미설정'
    });
    
    // 1. 입력값 검증
    if (!selectedKeywords || !Array.isArray(selectedKeywords) || selectedKeywords.length === 0) {
      debugLog('잘못된 입력: 선택된 키워드가 없음');
      return {
        success: false,
        message: '키워드를 하나 이상 선택해주세요.',
        generated: 'error'
      };
    }
    
    if (selectedKeywords.length > 20) {
      debugLog('경고: 키워드 수가 많음', selectedKeywords.length);
      return {
        success: false,
        message: '키워드는 최대 20개까지 선택 가능합니다.',
        generated: 'error'
      };
    }
    
    // 2. API 키 상태 확인
    let hasValidApiKey = false;
    let apiKeyError = null;
    
    try {
      const apiKey = getGeminiApiKey();
      hasValidApiKey = !!(apiKey && apiKey.length > 10);
      debugLog('API 키 상태', hasValidApiKey ? '설정됨' : '미설정');
    } catch (error) {
      apiKeyError = error.message;
      debugLog('API 키 확인 오류', apiKeyError);
    }
    
    // 3. AI 생성 시도 (조건이 맞을 경우)
    let aiGenerationAttempted = false;
    
    if (hasValidApiKey && !apiKeyError) {
      try {
        debugLog('AI 생성 시도 시작');
        aiGenerationAttempted = true;
        
        // 3.1. 프롬프트 생성
        const promptResult = createBehaviorCharacteristicsPrompt(selectedKeywords, context);
        if (!promptResult || !promptResult.systemInstruction || !promptResult.userPrompt) {
          throw new Error('프롬프트 생성 실패');
        }
        
        debugLog('프롬프트 생성 완료', {
          systemLength: promptResult.systemInstruction.length,
          userLength: promptResult.userPrompt.length
        });
        
        // 3.2. GEMINI API 호출
        const aiResponse = callGeminiAPI(promptResult.userPrompt, promptResult.systemInstruction);
        
        if (aiResponse.success && aiResponse.content) {
          debugLog('AI 생성 성공', {
            textLength: aiResponse.content.length,
            responseTime: aiResponse.metadata?.responseTime,
            attempt: aiResponse.metadata?.attempt
          });
          
          // 3.3. 텍스트 후처리 및 검증
          let generatedText = aiResponse.content;
          
          // 마크다운 코드 블록 제거
          generatedText = generatedText.replace(/^```[\s\S]*?\n|```[\s\S]*?$/g, '').trim();
          // 불필요한 마크다운 제거
          generatedText = generatedText.replace(/^\**\s*/, '').trim();
          // 중복 공백 정리
          generatedText = generatedText.replace(/\s+/g, ' ').trim();
          
          // 잘못된 어미 패턴 사전 수정
          generatedText = generatedText.replace(/([가-힣])(했습니함|했습니다|합니다)([.!?])/g, '$1함$3');
          generatedText = generatedText.replace(/([가-힣])(했다|한다)([.!?])/g, '$1함$3');
          generatedText = generatedText.replace(/([가-힣])(습니다)([.!?])/g, '$1음$3');
          generatedText = generatedText.replace(/([가-힣])(됩니다|됩니함)([.!?])/g, '$1됨$3');
          
          if (!generatedText || generatedText.length < 50) {
            throw new Error('생성된 텍스트가 너무 짧습니다.');
          }
          
          // 3.4. NEIS 규정 준수 검증
          const compliance = checkNeisCompliance(generatedText);
          debugLog('NEIS 규정 검증', compliance);
          
          // 규정 위반시 보정 시도
          if (!compliance.isValid) {
            const correctedText = ensureNeisCompliance(generatedText);
            if (correctedText && correctedText !== generatedText) {
              generatedText = correctedText;
              debugLog('NEIS 규정 보정 적용');
            }
          }
          
          // 3.5. 사용량 통계 업데이트
          const updatedUsage = updateUsageStatistics();
          
          // 3.6. 성공 결과 반환
          const finalCompliance = checkNeisCompliance(generatedText);
          
          return {
            success: true,
            text: generatedText,
            length: generatedText.length,
            keywordCount: selectedKeywords.length,
            compliance: finalCompliance,
            generated: 'ai',
            usage: aiResponse.usage || {},
            usageStats: updatedUsage,
            metadata: {
              apiResponseTime: aiResponse.metadata?.responseTime,
              apiAttempt: aiResponse.metadata?.attempt,
              promptLength: promptResult.systemInstruction.length + promptResult.userPrompt.length,
              corrected: !compliance.isValid
            }
          };
          
        } else {
          throw new Error(`AI API 호출 실패: ${aiResponse.error || aiResponse.message || '알 수 없는 오류'}`);
        }
        
      } catch (aiError) {
        debugLog('AI 생성 실패', aiError.toString());
        
        // AI 실패 시 폴백으로 전환
        const fallbackReason = `AI실패: ${aiError.message}`;
        return generateBehaviorCharacteristicsFallback(selectedKeywords, context, fallbackReason);
      }
    }
    
    // 4. API 키가 없거나 AI 생성을 시도하지 않은 경우 폴백 실행
    const fallbackReason = !hasValidApiKey ? '키설정실패' : '알수없음';
    debugLog('폴백 실행', fallbackReason);
    return generateBehaviorCharacteristicsFallback(selectedKeywords, context, fallbackReason);
    
  } catch (error) {
    console.error('📝 행동특성 생성 예외:', error);
    
    // 예외 발생 시 폴백
    return generateBehaviorCharacteristicsFallback(
      selectedKeywords || [], 
      context || {}, 
      `Exception: ${error.message}`
    );
  }
}

/**
 * 행동특성 생성 폴백 함수 (기존 로직)
 */
function generateBehaviorCharacteristicsFallback(selectedKeywords, context = {}, reason = '') {
  console.log('🔥 폴백 함수 실행, 이유:', reason);
  console.log('🔥 폴백에 전달된 키워드:', selectedKeywords);
  
  try {
    if (!selectedKeywords || selectedKeywords.length === 0) {
      throw new Error('선택된 키워드가 없습니다.');
    }
    
    // 카테고리별 키워드 그룹화
    const keywordsByCategory = selectedKeywords.reduce((acc, sk) => {
      if (!acc[sk.categoryId]) acc[sk.categoryId] = [];
      acc[sk.categoryId].push(sk);
      return acc;
    }, {});
    
    // 텍스트 생성
    const sentences = [];
    
    Object.entries(keywordsByCategory).forEach(([categoryId, keywords]) => {
      const category = OBSERVATION_CATEGORIES.find(cat => cat.id === categoryId);
      if (!category) return;
      
      const keywordTexts = keywords.map(sk => {
        const keyword = category.keywords.find(k => k.id === (sk.id || sk.keywordId));
        if (!keyword) return '';
        
        const modifier = INTENSITY_MODIFIERS[sk.intensity || 2];
        let baseText = keyword.autoText || keyword.text;
        
        // 강도 적용
        if (modifier.prefix) {
          baseText = `${modifier.prefix} ${baseText}`;
        }
        
        // 맥락 추가
        if (sk.context) {
          baseText += ` ${sk.context}`;
        }
        
        return baseText.trim();
      }).filter(Boolean);
      
      if (keywordTexts.length > 0) {
        sentences.push(keywordTexts.join(', '));
      }
    });
    
    // 최종 텍스트 구성
    let finalText = sentences.join('. ');
    
    // 맥락 정보 추가
    if (context.observationContext) {
      finalText += ` ${context.observationContext}에서`;
    }
    if (context.classActivity) {
      finalText += ` ${context.classActivity}을 통해`;
    }
    if (context.specialProgram) {
      finalText += ` ${context.specialProgram}에 참여하며`;
    }
    
    // NEIS 규정 준수 - 명사형 종결
    if (!finalText.endsWith('.')) {
      finalText += ' 성장하는 모습을 보임.';
    }
    
    // 글자 수 제한 확인
    if (finalText.length > NEIS_REGULATIONS.maxLength) {
      finalText = finalText.substring(0, NEIS_REGULATIONS.maxLength - 10) + ' 모습을 보임.';
    }
    
    return {
      success: true,
      text: finalText,
      length: finalText.length,
      keywordCount: selectedKeywords.length,
      compliance: checkNeisCompliance(finalText),
      generated: 'fallback',
      fallbackReason: reason || '기본생성'
    };
    
  } catch (error) {
    console.error('행동특성 폴백 생성 오류:', error);
    return {
      success: false,
      error: error.toString(),
      message: '텍스트 생성 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 누가기록 생성을 위한 GEMINI 프롬프트 생성
 */
function createCumulativeRecordsPrompt(description, count) {
    const diversityElements = [
        "학습 태도와 참여 모습",
        "동료와의 협력 관계", 
        "문제 해결 접근 방식",
        "학습 과정에서의 특성",
        "과제 수행 시의 모습",
        "표현 및 소통 능력",
        "학습에 대한 관심과 노력"
    ];

    const guidelines = `
    ### 🎯 열린 형태 누가기록 작성 지침 (매우 중요!)
    1. **일반적 표현**: 모든 학생에게 적용 가능한 일반적인 표현 사용
    2. **구체적 상황 금지**: "찰흙으로", "오답노트를", "친구의 작품이 무너져서" 등 구체적 상황 서술 금지
    3. **추상적 행동**: "협력하여", "노력하며", "집중하여" 등 추상적이고 일반적인 행동 중심
    4. **보편적 맥락**: 어떤 학급, 어떤 상황에서도 활용 가능한 내용
    5. **특정 도구/상황 배제**: 특정 교구, 구체적 사건, 고유한 상황 언급 금지
    6. **문장 길이**: 100-150자 내외로 제한 (공백 포함)
    7. **마침표 종결**: 모든 문장은 반드시 마침표(.)로 종료
    
    ### 🚫 내용 중복 방지 원칙 (절대 중요!)
    1. **완전한 차별화**: 각 누가기록은 완전히 다른 관찰 관점에서 작성
    2. **유사 표현 금지**: 비슷한 동사, 형용사, 문장 구조 사용 금지
    3. **다양한 영역 활용**: 학습태도, 협력관계, 문제해결, 표현능력, 참여도 등 다른 영역 중심
    4. **부분 중복 배제**: 문장의 일부분이라도 유사한 내용 포함 금지
    5. **독창적 서술**: 각각의 기록이 독립적이고 독창적인 관찰 내용이어야 함
    
    ### 🎨 다양성 확보 전략
    - **1번째 기록**: 학습 참여 태도 중심
    - **2번째 기록**: 동료 관계 및 협력 중심  
    - **3번째 기록**: 문제 해결 방식 중심
    - **4번째 기록**: 표현 및 소통 능력 중심
    - **5번째 기록**: 학습 관리 및 성찰 중심
    
    ### **다양성 요소** (${diversityElements.length}개 영역 활용)
    - ${diversityElements.join('\n    - ')}
    
    ### **좋은 예시 vs 나쁜 예시**
    
    ❌ **구체적 상황 (사용 금지)**:
    - "찰흙으로 인물상을 만들 때 세심한 관찰력을 보임."
    - "친구의 작품이 무너지자 함께 고민하며 문제 해결 능력을 나타냄."
    - "오답노트를 정리하며 체계적인 학습 관리 능력을 보임."
    
    ✅ **열린 형태 (권장, 각각 다른 영역)**:
    - "학습 활동에서 세심한 관찰력을 발휘하며 꼼꼼하게 작업을 수행함." (학습태도)
    - "동료와 협력하여 문제를 해결하며 상호 도움을 주고받는 모습을 보임." (협력관계)
    - "어려운 과제에 끈기있게 도전하며 창의적인 해결방안을 모색함." (문제해결)
    
    ### **표현 지침**
    - 행동특성을 기반으로 한 일반적 서술
    - 특정 교과목, 특정 도구, 특정 상황 언급 금지
    - 모든 학생에게 자연스럽게 적용 가능한 표현
    - 교육적 가치가 있는 관찰 내용 중심
    - **완전 차별화**: 각 기록은 완전히 다른 내용과 표현으로 작성
    `;

    return `
    당신은 대한민국 초등학교 교사를 돕는 AI 조수입니다. 
    주어진 '행동특성 및 종합의견'을 바탕으로 ${count}개의 **완전히 다른** 열린 형태 누가기록을 생성해야 합니다.
    
    **핵심 원칙**: 생성된 누가기록은 어떤 학생에게도 자연스럽게 적용될 수 있도록 
    구체적인 상황, 도구, 사건을 완전히 배제하고 일반적이면서도 의미 있는 관찰 내용으로 작성해주세요.

    ${guidelines}

    ---
    **[학생의 행동특성 및 종합의견]**
    ${description}
    ---

    위 내용을 바탕으로, ${count}개의 열린 형태 누가기록을 JSON 형식으로 생성해주세요. 
    
    **생성 요구사항 (중요!):**
    - ${count}개의 누가기록은 **완전히 다른 내용**이어야 합니다 (유사한 단어, 표현, 구조 사용 금지)
    - 각 기록은 **다른 관찰 영역**에 초점을 맞춰 작성 (학습태도/협력관계/문제해결/표현능력/학습관리 등)
    - 각 기록은 100-150자 내외, 마침표로 종료
    - 행동특성 기반으로 어떤 학생에게도 적용 가능하도록 작성
    - **중복 체크**: 생성 후 각 기록이 서로 다른지 반드시 확인
    
    **응답 형식**: [{"record": "누가기록 내용."}, {"record": "누가기록 내용."}, ...]
    `;
}

/**
 * 행동특성을 기반으로 누가기록 생성 (GEMINI API 활용)
 */
function generateCumulativeRecords(behaviorText, recordCount = 5, options = {}) {
  try {
    if (!behaviorText) {
      return {
        success: false,
        message: '행동특성 텍스트가 없습니다.'
      };
    }
    
    // GEMINI API 프롬프트 생성
    const { systemInstruction, userPrompt } = createCumulativeRecordsPrompt(behaviorText, recordCount, options);
    
    // GEMINI API 호출
    const aiResponse = callGeminiAPI(userPrompt, systemInstruction);
    
    if (!aiResponse.success) {
      // AI 생성 실패 시 기본 방식으로 폴백
      return generateCumulativeRecordsFallback(behaviorText, recordCount);
    }
    
    let generatedContent = aiResponse.content;
    
    try {
      // JSON 파싱 시도
      generatedContent = generatedContent.replace(/^```json\s*|\s*```$/g, '').trim();
      generatedContent = generatedContent.replace(/^```\s*|\s*```$/g, '').trim();
      
      const recordsData = JSON.parse(generatedContent);
      
      if (!Array.isArray(recordsData)) {
        throw new Error('JSON 배열 형식이 아닙니다.');
      }
      
      // 날짜 생성 및 최종 형태 구성
      const records = recordsData.map((item, index) => {
        const baseDate = new Date();
        const recordDate = new Date(baseDate);
        recordDate.setDate(baseDate.getDate() - (index * Math.floor(Math.random() * 7) + 1));
        
        // 평일만 선택하도록 조정
        while (recordDate.getDay() === 0 || recordDate.getDay() === 6) {
          recordDate.setDate(recordDate.getDate() - 1);
        }
        
        let recordText = item.record || item.text || '';
        
        // NEIS 규정 준수 검증 및 보정
        const compliance = checkNeisCompliance(recordText);
        if (!compliance.isValid) {
          recordText = ensureNeisCompliance(recordText);
        }
        
        return {
          date: recordDate.toLocaleDateString(),
          text: recordText,
          length: recordText.length,
          context: item.context || '',
          focus: item.focus || '',
          sequence: item.sequence || (index + 1)
        };
      });
      
      // 사용량 통계 업데이트
      const updatedUsage = updateUsageStatistics();
      
      return {
        success: true,
        records: records,
        totalCount: records.length,
        generated: 'ai',
        usage: aiResponse.usage || {},
        usageStats: updatedUsage
      };
      
    } catch (parseError) {
      console.warn('JSON 파싱 실패, 폴백 모드로 전환:', parseError);
      return generateCumulativeRecordsFallback(behaviorText, recordCount);
    }
    
  } catch (error) {
    console.error('누가기록 생성 오류:', error);
    return generateCumulativeRecordsFallback(behaviorText, recordCount);
  }
}

/**
 * 누가기록 생성 폴백 함수 (기존 로직)
 */
function generateCumulativeRecordsFallback(behaviorText, recordCount = 5) {
  try {
    const records = [];
    const baseDate = new Date();
    
    for (let i = 0; i < recordCount; i++) {
      // 날짜 변형 (1-7일 간격)
      const recordDate = new Date(baseDate);
      recordDate.setDate(baseDate.getDate() - (i * Math.floor(Math.random() * 7) + 1));
      
      // 평일만 선택
      while (recordDate.getDay() === 0 || recordDate.getDay() === 6) {
        recordDate.setDate(recordDate.getDate() - 1);
      }
      
      // 기본 텍스트에 변형 추가
      let recordText = behaviorText;
      
      // 약간의 변형을 위한 접두사/접미사
      const prefixes = ['', '수업 중 ', '활동 시간에 ', '모둠 활동에서 '];
      const suffixes = ['', ' 계속 발전하는 모습임.', ' 꾸준히 노력하는 모습임.', ' 더욱 성장하는 모습임.'];
      
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      if (prefix && !recordText.startsWith(prefix)) {
        recordText = prefix + recordText;
      }
      if (suffix && !recordText.endsWith('.')) {
        recordText = recordText.replace(/\.$/, '') + suffix;
      }
      
      // 250자 제한
      if (recordText.length > 250) {
        recordText = recordText.substring(0, 240) + ' 모습을 보임.';
      }
      
      records.push({
        date: recordDate.toLocaleDateString(),
        text: recordText,
        length: recordText.length,
        sequence: i + 1
      });
    }
    
    return {
      success: true,
      records: records,
      totalCount: recordCount,
      generated: 'fallback'
    };
    
  } catch (error) {
    console.error('누가기록 폴백 생성 오류:', error);
    return {
      success: false,
      error: error.toString(),
      message: '누가기록 생성 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 한국 공휴일 목록 (2025년 기준)
 */
function getKoreanHolidays(year) {
  const holidays = [];
  
  // 고정 공휴일
  holidays.push(new Date(year, 0, 1));   // 신정
  holidays.push(new Date(year, 2, 1));   // 삼일절
  holidays.push(new Date(year, 4, 5));   // 어린이날
  holidays.push(new Date(year, 5, 6));   // 현충일
  holidays.push(new Date(year, 7, 15));  // 광복절
  holidays.push(new Date(year, 9, 3));   // 개천절
  holidays.push(new Date(year, 9, 9));   // 한글날
  holidays.push(new Date(year, 11, 25)); // 크리스마스
  
  // 2025년 추가 공휴일 (음력 기반은 매년 변동)
  if (year === 2025) {
    holidays.push(new Date(2025, 0, 28));  // 설날 연휴 시작
    holidays.push(new Date(2025, 0, 29));  // 설날
    holidays.push(new Date(2025, 0, 30));  // 설날 연휴 끝
    holidays.push(new Date(2025, 4, 5));   // 부처님오신날
    holidays.push(new Date(2025, 8, 16));  // 추석 연휴 시작
    holidays.push(new Date(2025, 8, 17));  // 추석
    holidays.push(new Date(2025, 8, 18));  // 추석 연휴 끝
  }
  
  return holidays;
}

/**
 * 학교 수업일 중 랜덤 날짜 생성 (평일, 공휴일 제외)
 */
function generateRandomSchoolDate(year, startMonth, endMonth) {
  const schoolDays = [];
  const holidays = getKoreanHolidays(year);
  const holidayStrings = holidays.map(h => h.toDateString());
  
  // 여름방학 제외 (7월 15일 ~ 8월 31일)
  const summerStart = new Date(year, 6, 15);
  const summerEnd = new Date(year, 7, 31);
  
  // 겨울방학 제외 (12월 23일 ~ 2월 말)
  const winterStart = new Date(year, 11, 23);
  const winterEnd = new Date(year + 1, 1, 28);
  
  for (let month = startMonth; month <= endMonth; month++) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
      const currentDay = new Date(day);
      const dayOfWeek = currentDay.getDay();
      
      // 평일만 (월-금, 0=일요일, 6=토요일)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // 공휴일 제외
        if (!holidayStrings.includes(currentDay.toDateString())) {
          // 방학 제외
          if (!(currentDay >= summerStart && currentDay <= summerEnd) &&
              !(currentDay >= winterStart && currentDay <= winterEnd)) {
            schoolDays.push(new Date(currentDay));
          }
        }
      }
    }
  }
  
  if (schoolDays.length === 0) {
    // 폴백: 기본 날짜 반환
    return new Date(year, startMonth - 1, 15);
  }
  
  // 랜덤 선택
  const randomIndex = Math.floor(Math.random() * schoolDays.length);
  return schoolDays[randomIndex];
}

/**
 * 학생별 누가기록 생성 함수 (새로운 시스템)
 */
function generateCumulativeRecordsForStudents(studentsData, recordCount = 5, dateSettings = {}) {
  // 🔒 절대 null 반환 방지 - 최상위 안전장치
  const SAFE_RETURN_TEMPLATE = {
    success: false,
    error: 'INITIALIZATION_ERROR',
    message: '초기화 중 오류가 발생했습니다.',
    records: [],
    totalStudents: 0,
    recordsPerStudent: 5,
    totalRecords: 0,
    errorType: 'InitializationError'
  };
  
  try {
    // 🔎 함수 시그니처 로깅
    console.log('🚀 generateCumulativeRecordsForStudents 시작');
    console.log('🔎 함수 존재 여부 확인:', typeof generateCumulativeRecordsForStudents);
    console.log('🔎 arguments 개수:', arguments.length);
    console.log('🔎 arguments 내용:', Array.from(arguments));
    
    // 입력 매개변수 검증
    console.log('🔍 입력 매개변수 검증 시작...');
    console.log('📝 받은 매개변수:', { 
      studentsDataType: typeof studentsData,
      studentsDataIsArray: Array.isArray(studentsData),
      studentsDataLength: studentsData ? studentsData.length : 'N/A',
      recordCount: recordCount,
      dateSettingsType: typeof dateSettings,
      dateSettings: dateSettings
    });
    
    // studentsData 검증
    if (!studentsData) {
      console.error('❌ studentsData가 null 또는 undefined');
      return {
        success: false,
        error: '학생 데이터가 제공되지 않았습니다.',
        records: [],
        totalStudents: 0,
        recordsPerStudent: recordCount,
        totalRecords: 0
      };
    }
    
    if (!Array.isArray(studentsData)) {
      console.error('❌ studentsData가 배열이 아님:', typeof studentsData);
      return {
        success: false,
        error: '학생 데이터가 올바른 형식이 아닙니다. 배열이어야 합니다.',
        records: [],
        totalStudents: 0,
        recordsPerStudent: recordCount,
        totalRecords: 0
      };
    }
    
    if (studentsData.length === 0) {
      console.error('❌ 학생 데이터가 빈 배열');
      return {
        success: false,
        error: '생성할 학생 데이터가 없습니다.',
        records: [],
        totalStudents: 0,
        recordsPerStudent: recordCount,
        totalRecords: 0
      };
    }
    
    // recordCount 검증
    if (typeof recordCount !== 'number' || recordCount < 1 || recordCount > 20) {
      console.warn('⚠️ recordCount 값이 잘못됨, 기본값 5로 설정');
      recordCount = 5;
    }
    
    // dateSettings 안전한 destructuring
    let year = 2025;
    let startMonth = 3;
    let endMonth = 7;
    
    if (dateSettings && typeof dateSettings === 'object') {
      try {
        year = dateSettings.year || 2025;
        startMonth = dateSettings.startMonth || 3;
        endMonth = dateSettings.endMonth || 7;
      } catch (destructureError) {
        console.warn('⚠️ dateSettings destructuring 오류, 기본값 사용:', destructureError);
        year = 2025;
        startMonth = 3;
        endMonth = 7;
      }
    }
    
    console.log(`📚 학생별 누가기록 생성 시작: ${studentsData.length}명, 각 ${recordCount}개`);
    console.log('📝 받은 학생 데이터:', studentsData);
    console.log(`📅 날짜 설정: ${year}년 ${startMonth}월~${endMonth}월`);
    
    // 각 학생 데이터 유효성 검증
    for (let i = 0; i < studentsData.length; i++) {
      const student = studentsData[i];
      if (!student || typeof student !== 'object') {
        console.error(`❌ 학생 데이터 ${i}번이 올바르지 않음:`, student);
        return {
          success: false,
          error: `학생 데이터 ${i}번이 올바르지 않습니다.`,
          records: [],
          totalStudents: studentsData.length,
          recordsPerStudent: recordCount,
          totalRecords: 0
        };
      }
      
      if (!student.name || typeof student.name !== 'string') {
        console.error(`❌ 학생 데이터 ${i}번의 이름이 올바르지 않음:`, student.name);
        return {
          success: false,
          error: `학생 데이터 ${i}번의 이름이 올바르지 않습니다.`,
          records: [],
          totalStudents: studentsData.length,
          recordsPerStudent: recordCount,
          totalRecords: 0
        };
      }
    }
    
    // API 키 확인
    const properties = PropertiesService.getScriptProperties();
    const apiKey = properties.getProperty('GEMINI_API_KEY');
    const allProps = properties.getProperties();
    
    console.log('🔍 Properties 확인:', Object.keys(allProps));
    console.log('🔍 GEMINI_API_KEY 존재 여부:', !!apiKey);
    if (apiKey) {
      console.log('🔍 API 키 길이:', apiKey.length, '마지막 4자리:', apiKey.slice(-4));
    }
    
    if (!apiKey || apiKey.trim() === '' || apiKey.length < 20) {
      console.error('❌ GEMINI API 키가 설정되지 않았거나 유효하지 않음');
      console.error('❌ API 키 상태:', { exists: !!apiKey, length: apiKey?.length, value: apiKey?.slice(0, 10) + '...' });
      return {
        success: false,
        error: 'GEMINI API 키가 설정되지 않았거나 유효하지 않습니다. AI 설정 탭에서 올바른 API 키를 설정해주세요.'
      };
    }
    console.log('✅ API 키 확인됨 - 길이:', apiKey.length);
    
    const results = [];
    
    for (let s = 0; s < studentsData.length; s++) {
      try {
        const student = studentsData[s];
        console.log(`📝 ${student.name} (${student.number}번) 누가기록 생성 중...`);
        console.log(`📝 학생 행동특성 텍스트:`, student.behaviorText?.substring(0, 100) + '...');
      
      if (!student.behaviorText || student.behaviorText.trim() === '') {
        console.error(`❌ ${student.name} 학생의 행동특성 텍스트가 비어있음`);
        
        // 빈 행동특성이라도 기본 기록 생성
        const defaultRecords = [];
        for (let i = 0; i < recordCount; i++) {
          let randomDate, formattedDate;
          try {
            randomDate = generateRandomSchoolDate(year, startMonth, endMonth);
            formattedDate = Utilities.formatDate(randomDate, 'GMT+9', 'yyyy.MM.dd (E)');
          } catch (dateError) {
            console.warn('⚠️ 날짜 생성 오류, 기본값 사용:', dateError);
            randomDate = new Date(year, startMonth - 1, 15);
            formattedDate = Utilities.formatDate(randomDate, 'GMT+9', 'yyyy.MM.dd (E)');
          }
          
          defaultRecords.push({
            text: `${student.name} 학생의 누가기록 ${i + 1} (행동특성 데이터 없음)`,
            date: formattedDate,
            rawDate: randomDate
          });
        }
        
        results.push({
          studentNumber: student.number,
          studentName: student.name,
          records: defaultRecords,
          behaviorText: student.behaviorText || '',
          keywords: student.keywords || []
        });
        
        continue; // 다음 학생으로
      }
      
      const studentRecords = [];
      
      for (let i = 0; i < recordCount; i++) {
        try {
          console.log(`🔄 ${student.name} 누가기록 ${i + 1}/${recordCount} 생성 시작`);
          
          // 행동특성을 기반으로 누가기록 생성
          const recordPrompt = createCumulativeRecordsPrompt(
            student.behaviorText,
            1  // 한 번에 하나씩 생성
          );
          
          console.log(`📤 프롬프트 생성 완료, 길이: ${recordPrompt.length}`);
          
          // AI API 호출
          console.log(`📤 API 호출 시작 - 프롬프트 길이: ${recordPrompt.length}`);
          const response = callGeminiAPI(recordPrompt);
          console.log(`📥 API 응답 받음:`, response?.success ? 'SUCCESS' : 'FAILED');
          console.log(`📥 응답 내용 길이:`, response?.content?.length || 0);
          
          if (response && response.success) {
            let content = response.content;
            
            // JSON 응답 파싱 시도 (강화된 버전 - 다중 폴백 전략)
            try {
              console.log('🔍 원본 응답:', content.substring(0, 200) + '...');
              
              // 1차 시도: 직접 JSON 파싱
              let parsed = null;
              try {
                parsed = JSON.parse(content);
                console.log('✅ 1차 직접 JSON 파싱 성공');
              } catch (directParseError) {
                console.log('🔍 1차 직접 파싱 실패, 2차 시도 중...');
                
                // 2차 시도: JSON 마크다운 제거 후 파싱
                try {
                  let cleanedContent = content.trim();
                  // 백틱과 json 키워드 제거
                  cleanedContent = cleanedContent.replace(/^```json\s*/i, '').replace(/\s*```$/g, '');
                  cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/g, '');
                  
                  parsed = JSON.parse(cleanedContent);
                  console.log('✅ 2차 마크다운 정리 후 파싱 성공');
                } catch (markdownParseError) {
                  console.log('🔍 2차 파싱 실패, 3차 시도 중...');
                  
                  // 3차 시도: JSON 배열 경계 추출 후 파싱
                  try {
                    let cleanedContent = content.trim();
                    cleanedContent = cleanedContent.replace(/^```json\s*/i, '').replace(/\s*```$/g, '');
                    
                    const jsonStart = cleanedContent.indexOf('[');
                    const jsonEnd = cleanedContent.lastIndexOf(']');
                    if (jsonStart !== -1 && jsonEnd !== -1) {
                      cleanedContent = cleanedContent.substring(jsonStart, jsonEnd + 1);
                      parsed = JSON.parse(cleanedContent);
                      console.log('✅ 3차 배열 경계 추출 후 파싱 성공');
                    } else {
                      throw new Error('JSON 배열 경계를 찾을 수 없음');
                    }
                  } catch (boundaryParseError) {
                    console.log('🔍 3차 파싱 실패, 4차 시도 중...');
                    
                    // 4차 시도: 객체 경계 추출 후 파싱
                    try {
                      let cleanedContent = content.trim();
                      cleanedContent = cleanedContent.replace(/^```json\s*/i, '').replace(/\s*```$/g, '');
                      
                      const objStart = cleanedContent.indexOf('{');
                      const objEnd = cleanedContent.lastIndexOf('}');
                      if (objStart !== -1 && objEnd !== -1) {
                        cleanedContent = cleanedContent.substring(objStart, objEnd + 1);
                        // 단일 객체인 경우 배열로 감싸기
                        if (!cleanedContent.startsWith('[')) {
                          cleanedContent = '[' + cleanedContent + ']';
                        }
                        parsed = JSON.parse(cleanedContent);
                        console.log('✅ 4차 객체 경계 추출 후 파싱 성공');
                      } else {
                        throw new Error('JSON 객체 경계를 찾을 수 없음');
                      }
                    } catch (objectParseError) {
                      console.error('❌ 모든 JSON 파싱 방법 실패');
                      throw objectParseError;
                    }
                  }
                }
              }
              
              // 파싱된 결과에서 실제 텍스트 추출
              if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                const firstItem = parsed[0];
                if (firstItem && typeof firstItem === 'object' && firstItem.record) {
                  content = firstItem.record;
                  console.log('✅ JSON 파싱 성공 - record 키에서 추출:', content.substring(0, 50) + '...');
                } else if (typeof firstItem === 'string') {
                  content = firstItem;
                  console.log('✅ JSON 파싱 성공 - 문자열 직접 사용:', content.substring(0, 50) + '...');
                } else {
                  console.log('⚠️ 예상과 다른 JSON 구조, 문자열 변환:', firstItem);
                  content = JSON.stringify(firstItem).replace(/^"|"$/g, ''); // 양끝 따옴표 제거
                }
              } else if (parsed && typeof parsed === 'object' && parsed.record) {
                content = parsed.record;
                console.log('✅ JSON 파싱 성공 - 단일 객체 record 키:', content.substring(0, 50) + '...');
              } else {
                console.log('⚠️ 예상과 다른 파싱 결과, 원본 사용:', typeof parsed);
              }
              
            } catch (e) {
              console.error('❌ JSON 파싱 완전 실패:', e.message);
              console.log('🔧 정규식 폴백 시도 중...');
              
              // 최종 폴백: 정규식으로 record 내용 추출
              const recordPatterns = [
                /"record":\s*"([^"]+)"/,
                /'record':\s*'([^']+)'/,
                /record["']?\s*:\s*["']([^"']+)["']/,
                /"([^"]*(?:하는|하며|보임|나타남|됨|함|음)(?:\.|$)[^"]*)"/
              ];
              
              let extracted = false;
              for (let pattern of recordPatterns) {
                const match = content.match(pattern);
                if (match && match[1]) {
                  content = match[1];
                  console.log('✅ 정규식으로 record 추출 성공:', content.substring(0, 50) + '...');
                  extracted = true;
                  break;
                }
              }
              
              if (!extracted) {
                console.log('⚠️ 모든 추출 방법 실패, 원본 텍스트 사용');
                // 마지막으로 JSON 형태의 텍스트 정리 시도
                content = content.replace(/^["']|["']$/g, '').replace(/\\n/g, ' ').replace(/\\"|\\"/g, '"');
              }
            }
            
            // NEIS 규정 준수 확인 및 보정
            const compliance = checkNeisCompliance(content);
            if (!compliance.isValid) {
              content = ensureNeisCompliance(content);
            }
            
            // 랜덤 날짜 생성
            let randomDate, formattedDate;
            try {
              randomDate = generateRandomSchoolDate(year, startMonth, endMonth);
              formattedDate = Utilities.formatDate(randomDate, 'GMT+9', 'yyyy.MM.dd (E)');
            } catch (dateError) {
              console.warn('⚠️ 날짜 생성 오류, 기본값 사용:', dateError);
              randomDate = new Date(year, startMonth - 1, 15);
              formattedDate = Utilities.formatDate(randomDate, 'GMT+9', 'yyyy.MM.dd (E)');
            }
            
            studentRecords.push({
              text: content,
              date: formattedDate,
              rawDate: randomDate
            });
            console.log(`✅ ${student.name} 누가기록 ${i + 1} 생성 완료 (${formattedDate})`);
            
          } else {
            // AI 생성 실패 시 폴백 생성
            const fallbackRecord = generateCumulativeRecordsFallback(
              student.behaviorText,
              student.keywords || []
            );
            let randomDate, formattedDate;
            try {
              randomDate = generateRandomSchoolDate(year, startMonth, endMonth);
              formattedDate = Utilities.formatDate(randomDate, 'GMT+9', 'yyyy.MM.dd (E)');
            } catch (dateError) {
              console.warn('⚠️ 날짜 생성 오류, 기본값 사용:', dateError);
              randomDate = new Date(year, startMonth - 1, 15);
              formattedDate = Utilities.formatDate(randomDate, 'GMT+9', 'yyyy.MM.dd (E)');
            }
            
            studentRecords.push({
              text: fallbackRecord.text || `${student.name} 학생의 누가기록 ${i + 1}`,
              date: formattedDate,
              rawDate: randomDate
            });
            console.log(`⚠️ ${student.name} 누가기록 ${i + 1} 폴백 생성 (${formattedDate})`);
          }
          
        } catch (error) {
          console.error(`❌ ${student.name} 누가기록 ${i + 1} 생성 오류:`, error);
          const randomDate = generateRandomSchoolDate(year, startMonth, endMonth);
          const formattedDate = Utilities.formatDate(randomDate, 'GMT+9', 'yyyy.MM.dd (E)');
          
          studentRecords.push({
            text: `${student.name} 학생의 누가기록 ${i + 1} (생성 오류)`,
            date: formattedDate,
            rawDate: randomDate
          });
        }
      }
      
        results.push({
          studentNumber: student.number,
          studentName: student.name,
          records: studentRecords,
          behaviorText: student.behaviorText,
          keywords: student.keywords
        });
      
      } catch (studentError) {
        console.error(`❌ ${studentsData[s]?.name || s + '번'} 학생 처리 중 오류:`, studentError);
        
        // 학생 처리 실패 시 기본 기록 생성
        const errorRecords = [];
        for (let i = 0; i < recordCount; i++) {
          let randomDate, formattedDate;
          try {
            randomDate = generateRandomSchoolDate(year, startMonth, endMonth);
            formattedDate = Utilities.formatDate(randomDate, 'GMT+9', 'yyyy.MM.dd (E)');
          } catch (dateError) {
            console.warn('⚠️ 날짜 생성 오류, 기본값 사용:', dateError);
            randomDate = new Date(year, startMonth - 1, 15);
            formattedDate = Utilities.formatDate(randomDate, 'GMT+9', 'yyyy.MM.dd (E)');
          }
          
          errorRecords.push({
            text: `${studentsData[s]?.name || '학생'} 누가기록 ${i + 1} (오류로 인한 기본 생성)`,
            date: formattedDate,
            rawDate: randomDate
          });
        }
        
        results.push({
          studentNumber: studentsData[s]?.number || s + 1,
          studentName: studentsData[s]?.name || `학생 ${s + 1}`,
          records: errorRecords,
          behaviorText: studentsData[s]?.behaviorText || '',
          keywords: studentsData[s]?.keywords || [],
          error: studentError.message || 'Unknown error'
        });
      }
    }
    
    console.log(`🎉 전체 누가기록 생성 완료: ${results.length}명`);
    console.log('🎉 최종 결과 데이터:', results);
    
    // 안전한 최종 결과 생성 - null 반환 방지
    let totalRecords = 0;
    try {
      totalRecords = results.reduce((sum, student) => sum + (student.records ? student.records.length : 0), 0);
    } catch (reduceError) {
      console.warn('⚠️ totalRecords 계산 오류:', reduceError);
      totalRecords = 0;
    }
    
    const finalResult = {
      success: true,
      records: results || [],
      totalStudents: studentsData ? studentsData.length : 0,
      recordsPerStudent: recordCount || 5,
      totalRecords: totalRecords
    };
    
    console.log('🎉 반환할 최종 결과:', finalResult);
    
    // 최종 검증 - 절대 null 반환하지 않음
    if (!finalResult || typeof finalResult !== 'object') {
      console.error('❌ 최종 결과가 올바르지 않음, 안전한 결과 반환');
      return {
        success: false,
        error: 'Final result validation failed',
        records: [],
        totalStudents: 0,
        recordsPerStudent: 5,
        totalRecords: 0
      };
    }
    
    // 🔒 마지막 안전장치 - 모든 필수 필드 보장
    const safeResult = {
      success: finalResult.success !== false,
      records: Array.isArray(finalResult.records) ? finalResult.records : [],
      totalStudents: typeof finalResult.totalStudents === 'number' ? finalResult.totalStudents : 0,
      recordsPerStudent: typeof finalResult.recordsPerStudent === 'number' ? finalResult.recordsPerStudent : 5,
      totalRecords: typeof finalResult.totalRecords === 'number' ? finalResult.totalRecords : 0,
      timestamp: new Date().toISOString(),
      functionName: 'generateCumulativeRecordsForStudents'
    };
    
    // 에러 메시지가 있는 경우 포함
    if (finalResult.error) {
      safeResult.error = finalResult.error;
    }
    if (finalResult.message) {
      safeResult.message = finalResult.message;
    }
    
    console.log('🔒 안전한 최종 결과 반환:', safeResult);
    return safeResult;
    
  } catch (error) {
    console.error('❌ 학생별 누가기록 생성 오류:', error);
    console.error('❌ 오류 스택:', error.stack);
    console.error('❌ 오류 상세 정보:', {
      name: error.name,
      message: error.message,
      toString: error.toString()
    });
    
    // 🔒 안전한 폴백 결과 반환 - SAFE_RETURN_TEMPLATE 사용
    try {
      const safeStudentsData = studentsData && Array.isArray(studentsData) ? studentsData : [];
      const safeRecordCount = typeof recordCount === 'number' ? recordCount : 5;
      const safeDateSettings = dateSettings && typeof dateSettings === 'object' ? dateSettings : {};
      
      const errorResult = {
        ...SAFE_RETURN_TEMPLATE,
        success: false,
        error: error.toString() || 'Unknown error occurred',
        message: `학생별 누가기록 생성 중 오류가 발생했습니다: ${error.message || 'Unknown error'}`,
        errorType: error.name || 'UnknownError',
        totalStudents: safeStudentsData.length,
        recordsPerStudent: safeRecordCount,
        studentsCount: safeStudentsData.length,
        recordCount: safeRecordCount,
        dateSettings: safeDateSettings,
        timestamp: new Date().toISOString(),
        functionName: 'generateCumulativeRecordsForStudents'
      };
      
      console.log('🔒 오류 상황에서 안전한 결과 반환:', errorResult);
      return errorResult;
      
    } catch (returnError) {
      console.error('❌ 오류 반환 중에도 오류:', returnError);
      
      // 🔒 최후의 안전장치 - 어떤 상황에서도 null을 반환하지 않음
      const criticalErrorResult = {
        ...SAFE_RETURN_TEMPLATE,
        success: false,
        error: 'CRITICAL_ERROR',
        message: '심각한 오류가 발생했습니다.',
        errorType: 'CriticalError',
        timestamp: new Date().toISOString(),
        functionName: 'generateCumulativeRecordsForStudents'
      };
      
      console.log('🔒 치명적 오류에서 안전한 결과 반환:', criticalErrorResult);
      return criticalErrorResult;
    }
  }
}

/**
 * NEIS 규정 준수 검사 (강화된 버전)
 */
function checkNeisCompliance(text) {
  if (!text || typeof text !== 'string') {
    return {
      length: false,
      ending: false,
      noProhibitedContent: false,
      sentences: false,
      isValid: false,
      details: '텍스트가 유효하지 않습니다.'
    };
  }
  
  // 1. 글자 수 검사
  const lengthCheck = text.length <= NEIS_REGULATIONS.maxLength && text.length >= 50;
  
  // 2. 종결형 검사 - 각 문장별로 검사
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
  const sentenceEndingCheck = sentences.every(sentence => {
    const trimmed = sentence.trim();
    if (!trimmed) return true;
    
    const validEndings = /(함|임|됨|음|을 보임|를 보임|에 해당함|으로 나타남|하는 모습을 보임|는 모습을 보임|라고 할 수 있음)$/;
    return validEndings.test(trimmed);
  });
  
  // 3. 금지 내용 검사 (확장된 패턴)
  const prohibitedPatterns = [
    /\d{4}년|\d{1,2}월|\d{1,2}일/,  // 구체적 날짜
    /\d{1,2}시|\d{1,2}분/,         // 구체적 시간
    /김\w+|이\w+|박\w+|최\w+|정\w+/, // 학생 이름 패턴
    /[가-힣]{2,3}이는|[가-힣]{2,3}가|[가-힣]{2,3}은/, // 이름+조사 패턴
    /오늘|어제|내일|지난주|다음주/,   // 구체적 시점
    /\d+교시|\d+번째/              // 구체적 순서
  ];
  
  const noProhibitedContent = !prohibitedPatterns.some(pattern => pattern.test(text));
  
  // 4. 전체 유효성 검사
  const compliance = {
    length: lengthCheck,
    ending: sentenceEndingCheck,
    noProhibitedContent: noProhibitedContent,
    sentences: sentences.length > 0 && sentences.length <= 10,
    isValid: false,
    details: ''
  };
  
  compliance.isValid = compliance.length && compliance.ending && compliance.noProhibitedContent && compliance.sentences;
  
  // 상세 정보 생성
  const issues = [];
  if (!compliance.length) {
    if (text.length > NEIS_REGULATIONS.maxLength) {
      issues.push(`글자 수 초과 (${text.length}/${NEIS_REGULATIONS.maxLength})`);
    } else if (text.length < 50) {
      issues.push(`글자 수 부족 (${text.length}/50)`);
    }
  }
  if (!compliance.ending) issues.push('명사형 종결 미준수');
  if (!compliance.noProhibitedContent) issues.push('금지 내용 포함');
  if (!compliance.sentences) issues.push('문장 구조 문제');
  
  compliance.details = issues.length > 0 ? issues.join(', ') : '모든 규정 준수';
  
  return compliance;
}

/**
 * NEIS 규정 준수를 위한 텍스트 보정 함수
 */
function ensureNeisCompliance(text) {
  if (!text || typeof text !== 'string') {
    return '적절한 행동특성을 보임.';
  }
  
  let correctedText = text.trim();
  
  // 1. 금지 내용 제거/대체
  const replacements = [
    { pattern: /\d{4}년|\d{1,2}월|\d{1,2}일/g, replacement: '' },
    { pattern: /\d{1,2}시|\d{1,2}분/g, replacement: '' },
    { pattern: /김\w+|이\w+|박\w+|최\w+|정\w+/g, replacement: '해당 학생' },
    { pattern: /오늘|어제|내일/g, replacement: '' },
    { pattern: /지난주|다음주/g, replacement: '평소' },
    { pattern: /\d+교시/g, replacement: '수업 시간' },
    { pattern: /\d+번째/g, replacement: '' }
  ];
  
  replacements.forEach(({ pattern, replacement }) => {
    correctedText = correctedText.replace(pattern, replacement);
  });
  
  // 2. 주어 생략 강화 (모든 주어 형태 제거)
  const subjectPatterns = [
    /^본 학생은\s*/g,
    /^이 학생은\s*/g,
    /^해당 학생은\s*/g,
    /^그 학생은\s*/g,
    /^학생은\s*/g,
    /^학생이\s*/g,
    /\.\s*본 학생은\s*/g,
    /\.\s*이 학생은\s*/g,
    /\.\s*해당 학생은\s*/g,
    /\.\s*학생은\s*/g,
    /\.\s*학생이\s*/g
  ];
  
  subjectPatterns.forEach(pattern => {
    correctedText = correctedText.replace(pattern, '. ');
  });
  
  // 연속 공백 정리
  correctedText = correctedText.replace(/\s+/g, ' ').trim();
  
  // 3. 문장 종결형 보정
  const sentences = correctedText.split(/[.!?]/).filter(s => s.trim().length > 0);
  const correctedSentences = sentences.map(sentence => {
    let trimmed = sentence.trim();
    if (!trimmed) return '';
    
    // 명사형 종결 패턴 확인
    const validEndings = /(함|임|됨|음|을 보임|를 보임|에 해당함|으로 나타남|하는 모습을 보임|는 모습을 보임)$/;
    const invalidEndings = /(습니함|했습니함|였습니함|았습니함|었습니함|했습니다|였습니다|았습니다|었습니다|입니다|합니다|했다|한다|이다|다)$/;
    
    // 🚨 잘못된 어미 강력 수정 (특히 "습니함" 계열)
    if (invalidEndings.test(trimmed)) {
      console.log(`❌ 잘못된 어미 발견: "${trimmed}"`);
      
      // 1순위: "습니함" 계열 모든 변형 수정
      trimmed = trimmed.replace(/(.*)(습니함|했습니함|였습니함|았습니함|었습니함)$/, '$1함');
      
      // 2순위: 존댓말 어미 수정
      trimmed = trimmed.replace(/(.*)(했습니다|였습니다|았습니다|었습니다)$/, '$1함');
      trimmed = trimmed.replace(/(.*)(입니다|합니다)$/, '$1임');
      
      // 3순위: 반말 어미 수정
      trimmed = trimmed.replace(/(.*)(했다|한다)$/, '$1함');
      trimmed = trimmed.replace(/(.*)(이다|다)$/, '$1임');
      
      console.log(`✅ 수정된 어미: "${trimmed}"`);
    }
    
    if (!validEndings.test(trimmed)) {
      // 적절한 종결형으로 변환
      if (trimmed.endsWith('다') || trimmed.endsWith('는다') || trimmed.endsWith('한다')) {
        trimmed = trimmed.replace(/다$|는다$|한다$/, '함');
      } else if (trimmed.endsWith('요') || trimmed.endsWith('어요') || trimmed.endsWith('아요')) {
        trimmed = trimmed.replace(/요$|어요$|아요$/, '음');
      } else if (!trimmed.endsWith('.')) {
        trimmed += '을 보임';
      }
    }
    
    return trimmed;
  }).filter(Boolean);
  
  correctedText = correctedSentences.join('. ');
  
  // 4. 글자 수 조정
  if (correctedText.length > NEIS_REGULATIONS.maxLength) {
    // 마지막 문장을 단축하여 글자 수 맞춤
    const targetLength = NEIS_REGULATIONS.maxLength - 20;
    correctedText = correctedText.substring(0, targetLength);
    
    // 마지막 완전한 문장까지만 유지
    const lastSentenceEnd = Math.max(
      correctedText.lastIndexOf('.'),
      correctedText.lastIndexOf('함'),
      correctedText.lastIndexOf('임'),
      correctedText.lastIndexOf('됨')
    );
    
    if (lastSentenceEnd > 0) {
      correctedText = correctedText.substring(0, lastSentenceEnd + 1);
    } else {
      correctedText = correctedText.substring(0, NEIS_REGULATIONS.maxLength - 10) + ' 모습을 보임.';
    }
  } else if (correctedText.length < 50) {
    // 너무 짧은 경우 보완
    correctedText += ' 지속적으로 성장하는 모습을 보임.';
  }
  
  // 5. 최종 점검 및 마무리
  if (!correctedText.endsWith('.')) {
    correctedText += '.';
  }
  
  // 연속된 마침표 정리
  correctedText = correctedText.replace(/\.+/g, '.');
  
  return correctedText.trim();
}

/**
 * 향상된 NEIS 규정 상세 검증
 */
function validateDetailedNeisCompliance(text) {
  const basicCompliance = checkNeisCompliance(text);
  
  // 추가 검증 항목들
  const additionalChecks = {
    hasEducationalValue: /학습|수업|활동|참여|발표|토론|모둠|과제/.test(text),
    isObjective: !/생각|느낌|추측|것 같|아마|혹시/.test(text),
    isPositive: !/못|안|나쁨|부족|문제|걱정/.test(text) || /향상|발전|성장|개선|기대/.test(text),
    hasSpecificBehavior: text.length > 100 && /구체적|명확|분명/.test(text)
  };
  
  return {
    ...basicCompliance,
    educational: additionalChecks.hasEducationalValue,
    objective: additionalChecks.isObjective,
    positive: additionalChecks.isPositive,
    specific: additionalChecks.hasSpecificBehavior,
    overallQuality: Object.values(additionalChecks).filter(Boolean).length >= 3
  };
}

/**
 * Google Sheets에 데이터 저장
 */
function saveToGoogleSheets(spreadsheetId, sheetName, data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return {
        success: false,
        message: `시트 '${sheetName}'를 찾을 수 없습니다.`
      };
    }
    
    // 데이터 추가
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow + 1, 1, data.length, data[0].length);
    range.setValues(data);
    
    return {
      success: true,
      message: `데이터가 '${sheetName}' 시트에 저장되었습니다.`,
      rowsAdded: data.length
    };
    
  } catch (error) {
    console.error('Google Sheets 저장 오류:', error);
    return {
      success: false,
      error: error.toString(),
      message: 'Google Sheets 저장 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 키워드 사용 빈도 업데이트
 */
function updateKeywordFrequency(keywordId, categoryId) {
  // 실제 구현에서는 별도의 데이터베이스나 Properties Service 사용
  try {
    const properties = PropertiesService.getScriptProperties();
    const frequencyKey = `freq_${categoryId}_${keywordId}`;
    const currentFreq = parseInt(properties.getProperty(frequencyKey) || '0');
    
    properties.setProperty(frequencyKey, (currentFreq + 1).toString());
    
    return {
      success: true,
      frequency: currentFreq + 1
    };
  } catch (error) {
    console.error('키워드 빈도 업데이트 오류:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 자주 사용되는 키워드 조회
 */
function getPopularKeywords(limit = 10) {
  try {
    const properties = PropertiesService.getScriptProperties();
    const allProperties = properties.getProperties();
    
    const frequencies = [];
    Object.keys(allProperties).forEach(key => {
      if (key.startsWith('freq_')) {
        const [, categoryId, keywordId] = key.split('_');
        frequencies.push({
          categoryId,
          keywordId,
          frequency: parseInt(allProperties[key])
        });
      }
    });
    
    // 빈도순 정렬
    frequencies.sort((a, b) => b.frequency - a.frequency);
    
    return {
      success: true,
      popularKeywords: frequencies.slice(0, limit)
    };
    
  } catch (error) {
    console.error('인기 키워드 조회 오류:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * API 키 설정 함수
 */
/**
 * 개선된 API 키 설정 함수
 */
function setApiKey(apiKey) {
  try {
    console.log('🔑 API 키 설정 시도...');
    
    // 입력값 검증
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new Error('유효하지 않은 API 키입니다.');
    }
    
    const cleanApiKey = apiKey.trim();
    
    // API 키 기본 형식 검증
    if (cleanApiKey.length < 20) {
      throw new Error('API 키가 너무 짧습니다. 올바른 Gemini API 키를 입력해주세요.');
    }
    
    // Properties Service에 저장
    const properties = PropertiesService.getScriptProperties();
    properties.setProperty('GEMINI_API_KEY', cleanApiKey);
    
    console.log('🔑 API 키 저장 성공, 마지막 4자리:', cleanApiKey.slice(-4));
    
    // 저장 후 즉시 검증
    const savedKey = properties.getProperty('GEMINI_API_KEY');
    if (!savedKey || savedKey !== cleanApiKey) {
      throw new Error('저장 후 검증에 실패했습니다.');
    }
    
    return {
      success: true,
      message: 'API 키가 성공적으로 저장되었습니다.',
      keyLength: cleanApiKey.length,
      keyPreview: cleanApiKey.slice(-4)
    };
    
  } catch (error) {
    console.error('🔑 API 키 설정 실패:', error.message);
    return {
      success: false,
      error: error.toString(),
      message: `API 키 설정 실패: ${error.message}`
    };
  }
}

/**
 * API 키 제거 함수
 */
function clearApiKey() {
  try {
    const properties = PropertiesService.getScriptProperties();
    properties.deleteProperty('GEMINI_API_KEY');
    
    return {
      success: true,
      message: 'API 키가 제거되었습니다.'
    };
  } catch (error) {
    console.error('API 키 제거 오류:', error);
    return {
      success: false,
      error: error.toString(),
      message: 'API 키 제거 중 오류가 발생했습니다.'
    };
  }
}

/**
 * AI 설정 조회 함수
 */
function getAiSettings() {
  try {
    const properties = PropertiesService.getScriptProperties();
    const hasApiKey = !!properties.getProperty('GEMINI_API_KEY');
    
    // 기본 설정값
    const defaultSettings = {
      behaviorStyle: 'standard',
      recordCount: 5,
      includeActivities: true,
      useAiFallback: true
    };
    
    // 저장된 설정 불러오기
    const savedSettings = properties.getProperty('AI_SETTINGS');
    const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    
    // 사용량 통계 불러오기
    const today = new Date().toDateString();
    const thisMonth = new Date().getFullYear() + '-' + (new Date().getMonth() + 1);
    
    const todayUsage = parseInt(properties.getProperty(`USAGE_${today}`) || '0');
    const monthUsage = parseInt(properties.getProperty(`USAGE_MONTH_${thisMonth}`) || '0');
    const totalUsage = parseInt(properties.getProperty('USAGE_TOTAL') || '0');
    
    return {
      ...settings,
      hasApiKey: hasApiKey,
      usage: {
        today: todayUsage,
        month: monthUsage,
        total: totalUsage
      }
    };
  } catch (error) {
    console.error('AI 설정 조회 오류:', error);
    return {
      behaviorStyle: 'standard',
      recordCount: 5,
      includeActivities: true,
      useAiFallback: true,
      hasApiKey: false,
      usage: { today: 0, month: 0, total: 0 }
    };
  }
}

/**
 * AI 설정 저장 함수
 */
function saveAiSettings(settings) {
  try {
    const properties = PropertiesService.getScriptProperties();
    properties.setProperty('AI_SETTINGS', JSON.stringify(settings));
    
    return {
      success: true,
      message: 'AI 설정이 저장되었습니다.'
    };
  } catch (error) {
    console.error('AI 설정 저장 오류:', error);
    return {
      success: false,
      error: error.toString(),
      message: 'AI 설정 저장 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 사용량 통계 업데이트 함수
 */
function updateUsageStatistics() {
  try {
    const properties = PropertiesService.getScriptProperties();
    const today = new Date().toDateString();
    const thisMonth = new Date().getFullYear() + '-' + (new Date().getMonth() + 1);
    
    // 오늘 사용량 증가
    const todayUsage = parseInt(properties.getProperty(`USAGE_${today}`) || '0') + 1;
    properties.setProperty(`USAGE_${today}`, todayUsage.toString());
    
    // 이번 달 사용량 증가
    const monthUsage = parseInt(properties.getProperty(`USAGE_MONTH_${thisMonth}`) || '0') + 1;
    properties.setProperty(`USAGE_MONTH_${thisMonth}`, monthUsage.toString());
    
    // 전체 사용량 증가
    const totalUsage = parseInt(properties.getProperty('USAGE_TOTAL') || '0') + 1;
    properties.setProperty('USAGE_TOTAL', totalUsage.toString());
    
    return {
      today: todayUsage,
      month: monthUsage,
      total: totalUsage
    };
  } catch (error) {
    console.error('사용량 통계 업데이트 오류:', error);
    return null;
  }
}

/**
 * 간단한 테스트 함수
 */
function testCompleteSystem() {
  console.log('NugaBar Complete System 테스트 시작');
  console.log('총 카테고리 수:', OBSERVATION_CATEGORIES.length);
  
  let totalKeywords = 0;
  OBSERVATION_CATEGORIES.forEach(category => {
    console.log(`${category.name}: ${category.keywords.length}개 키워드`);
    totalKeywords += category.keywords.length;
  });
  
  console.log('총 키워드 수:', totalKeywords);
  console.log('테스트 완료');
  
  // API 키 테스트
  try {
    const apiKey = getGeminiApiKey();
    console.log('GEMINI API 키 설정됨:', !!apiKey);
  } catch (error) {
    console.log('GEMINI API 키 미설정');
  }
  
  return {
    categories: OBSERVATION_CATEGORIES.length,
    totalKeywords: totalKeywords,
    intensityLevels: Object.keys(INTENSITY_MODIFIERS).length,
    geminiApiAvailable: !!PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY')
  };
}

/**
 * 명사형 종결어미 검증 및 수정 전용 함수
 */
function validateAndCorrectNounEndings(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  // 올바른 명사형 종결어미 패턴
  const validEndings = [
    '함', '임', '됨', '음', '을 보임', '를 보임', 
    '하는 모습을 보임', '는 모습을 보임', '에 해당함', 
    '으로 나타남', '라고 할 수 있음', '에 해당됨'
  ];
  
  // 잘못된 어미 패턴과 올바른 대체어미
  const incorrectPatterns = [
    { pattern: /([가-힣])(했습니함|했습니다)([.!?])/g, replacement: '$1함$3' },
    { pattern: /([가-힣])(합니다|합니함)([.!?])/g, replacement: '$1함$3' },
    { pattern: /([가-힣])(했다|한다)([.!?])/g, replacement: '$1함$3' },
    { pattern: /([가-힣])(습니다|습니함)([.!?])/g, replacement: '$1음$3' },
    { pattern: /([가-힣])(됩니다|됩니함)([.!?])/g, replacement: '$1됨$3' },
    { pattern: /([가-힣])(입니다|입니함)([.!?])/g, replacement: '$1임$3' },
    { pattern: /([가-힣])(있습니다|있습니함)([.!?])/g, replacement: '$1있음$3' },
    { pattern: /([가-힣])(없습니다|없습니함)([.!?])/g, replacement: '$1없음$3' }
  ];
  
  let correctedText = text;
  let correctionCount = 0;
  
  // 잘못된 패턴 수정
  incorrectPatterns.forEach(({ pattern, replacement }) => {
    const beforeText = correctedText;
    correctedText = correctedText.replace(pattern, replacement);
    if (beforeText !== correctedText) {
      correctionCount++;
    }
  });
  
  // 주어 생략 검증 및 수정
  const subjectPatterns = [
    /이 학생은 /g,
    /학생이 /g,
    /아이가 /g,
    /그가 /g,
    /그녀가 /g,
    /[가-힣]{2,3}이는 /g,
    /[가-힣]{2,3}가 /g,
    /[가-힣]{2,3}은 /g
  ];
  
  subjectPatterns.forEach(pattern => {
    const beforeText = correctedText;
    correctedText = correctedText.replace(pattern, '');
    if (beforeText !== correctedText) {
      correctionCount++;
    }
  });
  
  // 중복 공백 정리
  correctedText = correctedText.replace(/\s+/g, ' ').trim();
  
  return {
    originalText: text,
    correctedText: correctedText,
    correctionCount: correctionCount,
    isValid: correctionCount === 0
  };
}

/**
 * 텍스트의 명사형 종결어미 준수 여부 확인
 */
function checkNounEndingCompliance(text) {
  if (!text || typeof text !== 'string') {
    return { isValid: false, details: '텍스트가 없습니다.' };
  }
  
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
  const issues = [];
  
  // 올바른 명사형 종결어미 패턴
  const validEndings = /(함|임|됨|음|을 보임|를 보임|하는 모습을 보임|는 모습을 보임|에 해당함|으로 나타남|라고 할 수 있음)$/;
  
  // 잘못된 어미 패턴
  const invalidEndings = /(했습니함|했습니다|합니다|습니다|했다|한다|됩니다|입니다)$/;
  
  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim();
    if (!trimmed) return;
    
    // 잘못된 어미 검사
    if (invalidEndings.test(trimmed)) {
      issues.push(`문장 ${index + 1}: 잘못된 어미 사용 (${trimmed.match(invalidEndings)[0]})`);
    }
    
    // 올바른 어미 검사
    if (!validEndings.test(trimmed)) {
      issues.push(`문장 ${index + 1}: 명사형 종결어미 미준수`);
    }
    
    // 주어 생략 검사
    if (/(이 학생은|학생이|아이가|그가|그녀가|[가-힣]{2,3}이는|[가-힣]{2,3}가|[가-힣]{2,3}은)/.test(trimmed)) {
      issues.push(`문장 ${index + 1}: 주어 생략 미준수`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    totalSentences: sentences.length,
    issues: issues,
    details: issues.length > 0 ? issues.join('; ') : '모든 문장이 명사형 종결어미 규칙을 준수합니다.'
  };
}
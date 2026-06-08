import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth-server';
import { getGeminiApiKey } from '@/lib/user-settings';

const GEMINI_MODEL = 'gemini-2.5-flash';

// AI 작성 지침 로드
async function loadGuidelines(): Promise<string> {
  try {
    const guidelinesPath = path.join(process.cwd(), 'AI_창체누가기록_작성지침.md');
    const guidelines = await fs.readFile(guidelinesPath, 'utf-8');
    return guidelines;
  } catch (error) {
    console.error('지침 파일 로드 오류:', error);
    // 기본 지침 반환
    return `
# AI 창체 누가기록 작성 지침

## 핵심 원칙
- 학생 개별 특성을 관찰하여 구체적으로 기술
- 단순 참여 사실이 아닌 구체적 행동과 성장 과정 서술
- 동기-과정-결과(MPR) 구조로 작성

## 절대 금지 사항
- 공인시험, 교외 수상, 부모 직업 등 언급 금지
- 추상적 칭찬("열심히", "잘함") 금지
- 모든 학생에게 동일한 기록 금지

## 글쓰기 모델 (MPR)
1. 동기(Motive): 활동 참여 계기, 관심사
2. 과정(Process): 구체적 행동, 역할, 사고 과정
3. 결과(Result): 지식·기능·태도 변화, 성장

## 출력 형식
- 자연스러운 한 문단 형식
- 마크다운 없이 순수 텍스트만 출력
- 구체적 행동 동사 사용
- 관찰 가능한 사실만 기술
`;
  }
}

// 카테고리별 관찰 포인트
const categoryObservationPoints = {
  autonomous: '리더십, 의사소통, 민주적 의사결정, 갈등 조정, 논리적 의견 제시, 경청 태도',
  club: '협업, 문제해결, 창의성, 정보 탐색, 발표력, 자료 조사 주도성',
  career: '흥미 분야 탐색, 질문의 구체성, 적극성, 자기 이해, 진로 탐색 의지',
  volunteer: '인성, 나눔, 배려, 공동체 의식, 헌신적 태도'
};

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    const { activity, recordCount } = await request.json();
    const uid = auth.uid;

    if (!activity) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 사용자의 Gemini API 키 가져오기
    const apiKey = await getGeminiApiKey(uid);
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Gemini API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 입력해주세요.' },
        { status: 400 }
      );
    }

    // AI 작성 지침 로드
    const guidelines = await loadGuidelines();

    // 카테고리별 관찰 포인트
    const observationPoints = categoryObservationPoints[activity.category as keyof typeof categoryObservationPoints] || '';

    // Gemini 프롬프트 생성
    const prompt = `
당신은 초등학교 교사로서 학생의 창체 누가기록을 작성하는 전문가입니다.

아래의 작성 지침을 반드시 준수하여 누가기록을 작성해주세요:

${guidelines}

---

## 활동 정보
- **날짜**: ${activity.date}
- **분류**: ${activity.category === 'autonomous' ? '자율활동' : activity.category === 'club' ? '동아리활동' : activity.category === 'career' ? '진로활동' : '봉사활동'}
- **주제**: ${activity.subject}
- **내용**: ${activity.content}

## 관찰 포인트
이 활동에서 특히 주목해야 할 역량: ${observationPoints}

---

## 작성 요구사항
1. **${recordCount}개의 서로 다른 누가기록**을 생성하세요
2. 각 누가기록은 **서로 다른 학생의 개별 특성**을 반영해야 합니다
3. **동기-과정-결과(MPR) 구조**를 따르세요
4. **구체적인 행동과 관찰 가능한 사실**만 기술하세요
5. **마크다운 없이 순수 텍스트**로만 출력하세요
6. 각 누가기록은 **2-4문장**으로 작성하세요
7. **금지 사항**(교외 수상, 부모 직업 등)을 절대 포함하지 마세요
8. **추상적 칭찬**("열심히", "잘함")을 사용하지 마세요

## 출력 형식
각 누가기록을 "---" 구분자로 구분하여 출력하세요. 예시:

평소 환경 문제에 관심이 많아 교내 에너지 절약 캠페인에 자발적으로 참여하여, 각 학급의 에너지 사용 실태를 조사하고 분석한 데이터를 바탕으로 설득력 있는 포스터를 제작하고 발표함. 이 과정을 통해 문제 해결을 위한 데이터 활용 능력을 길렀으며, 공동체를 위해 헌신하는 태도를 함양함.
---
학급자치회에서 서기 역할을 맡아 회의 내용을 누락 없이 꼼꼼하게 기록하는 책임감 있는 모습을 보였으며, 이러한 성실한 태도는 온책읽기 동아리 활동에서도 자신의 독서 과정을 체계적으로 관리하는 모습으로 이어져 깊이 있는 독후 활동의 밑거름이 됨.
---
(계속...)

지금 바로 ${recordCount}개의 누가기록을 생성해주세요.
`;

    // Gemini API 호출 (고정 모델 사용)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 생성된 누가기록 파싱
    const records = text
      .split('---')
      .map(record => record.trim())
      .filter(record => record.length > 0)
      .filter(record => !record.includes('각 누가기록을')) // 예시 텍스트 제외
      .slice(0, recordCount); // 요청한 개수만큼만 반환

    if (records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'AI 누가기록 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      records: records,
      count: records.length
    });

  } catch (error) {
    console.error('누가기록 생성 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '누가기록 생성 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

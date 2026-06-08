import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse-fork';
import { Timestamp } from 'firebase-admin/firestore';
import { requireAuth } from '@/lib/auth-server';
import { db } from '@/lib/firebase-admin';

// Activity 타입 정의
interface Activity {
  id: string;
  date: string;
  category: 'autonomous' | 'club' | 'career' | 'volunteer';
  subject: string;
  content: string;
  selected: boolean;
}

// 카테고리 분류 키워드
const categoryKeywords = {
  autonomous: ['자치', '적응', '안전', '건강', '학급', '회의', '학예', '행사', '축제'],
  club: ['동아리', '창체', '독서', '예술', '체육', '음악', '미술', '과학', '수학'],
  career: ['진로', '직업', '체험', '탐색', '꿈', '희망', '장래', '미래'],
  volunteer: ['봉사', '나눔', '캠페인', '환경', '정화', '도움', '기부']
};

// 카테고리 자동 분류 함수
function categorizeActivity(subject: string, content: string): Activity['category'] {
  const text = `${subject} ${content}`.toLowerCase();

  // 각 카테고리 점수 계산
  const scores = {
    autonomous: 0,
    club: 0,
    career: 0,
    volunteer: 0
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        scores[category as keyof typeof scores]++;
      }
    }
  }

  // 가장 높은 점수의 카테고리 반환
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'autonomous'; // 기본값

  const topCategory = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
  return (topCategory as Activity['category']) || 'autonomous';
}

// PDF에서 활동 데이터 추출
function extractActivities(pdfText: string): Activity[] {
  const activities: Activity[] = [];
  const lines = pdfText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // 날짜 패턴 (YYYY-MM-DD, YYYY.MM.DD, MM/DD 등)
  const datePattern = /(\d{4}[-./]\d{1,2}[-./]\d{1,2}|\d{1,2}[-./]\d{1,2})/;

  let currentDate = '';
  let currentSubject = '';
  let currentContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 날짜 찾기
    const dateMatch = line.match(datePattern);
    if (dateMatch) {
      // 이전 활동 저장
      if (currentDate && currentSubject) {
        const category = categorizeActivity(currentSubject, currentContent);
        activities.push({
          id: `${Date.now()}-${activities.length}`,
          date: normalizeDate(currentDate),
          category,
          subject: currentSubject,
          content: currentContent.trim() || currentSubject,
          selected: false
        });
      }

      // 새로운 활동 시작
      currentDate = dateMatch[0];
      currentSubject = '';
      currentContent = '';

      // 같은 줄에 주제가 있을 수 있음
      const afterDate = line.substring(dateMatch.index! + dateMatch[0].length).trim();
      if (afterDate) {
        // 요일 제거 (월, 화, 수, 목, 금, 토, 일)
        const subjectWithoutDay = afterDate.replace(/^[월화수목금토일]\s*/, '');
        currentSubject = subjectWithoutDay;
      }
    } else if (currentDate && !currentSubject) {
      // 날짜 다음 줄이 주제 (요일 제거)
      const subjectWithoutDay = line.replace(/^[월화수목금토일]\s*/, '');
      currentSubject = subjectWithoutDay;
    } else if (currentDate && currentSubject) {
      // 내용 추가
      currentContent += ' ' + line;
    }
  }

  // 마지막 활동 저장
  if (currentDate && currentSubject) {
    const category = categorizeActivity(currentSubject, currentContent);
    activities.push({
      id: `${Date.now()}-${activities.length}`,
      date: normalizeDate(currentDate),
      category,
      subject: currentSubject,
      content: currentContent.trim() || currentSubject,
      selected: false
    });
  }

  return activities;
}

// 날짜 정규화 (YYYY-MM-DD 형식으로 통일)
function normalizeDate(dateStr: string): string {
  // YYYY-MM-DD 형식이면 그대로 반환
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // YYYY.MM.DD 또는 YYYY/MM/DD 형식
  if (/^\d{4}[./]\d{1,2}[./]\d{1,2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split(/[./]/).map(n => n.padStart(2, '0'));
    return `${year}-${month}-${day}`;
  }

  // MM-DD 또는 MM/DD 형식 (현재 연도 추가)
  if (/^\d{1,2}[/-]\d{1,2}$/.test(dateStr)) {
    const [month, day] = dateStr.split(/[-/]/).map(n => n.padStart(2, '0'));
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${month}-${day}`;
  }

  return dateStr;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth.error;

    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;

    if (!pdfFile) {
      return NextResponse.json(
        { success: false, error: 'PDF 파일이 없습니다.' },
        { status: 400 }
      );
    }

    // PDF 파일을 Buffer로 변환
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // PDF 파싱
    const data = await pdf(buffer);
    const pdfText = data.text;

    // 활동 데이터 추출
    const activities = extractActivities(pdfText);

    if (activities.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'PDF에서 활동 데이터를 추출할 수 없습니다. 파일 형식을 확인해주세요.'
        },
        { status: 400 }
      );
    }

    // Firebase에 저장
    try {
      await db.collection('users').doc(auth.uid).collection('creativeActivities').add({
        userId: auth.uid,
        uploadedAt: Timestamp.now(),
        pdfFileName: pdfFile.name,
        activities: activities,
        generatedRecords: []
      });
    } catch (firebaseError) {
      console.error('Firebase 저장 오류:', firebaseError);
      // Firebase 저장 실패해도 파싱된 데이터는 반환
    }

    return NextResponse.json({
      success: true,
      activities: activities,
      totalCount: activities.length,
      categories: {
        autonomous: activities.filter(a => a.category === 'autonomous').length,
        club: activities.filter(a => a.category === 'club').length,
        career: activities.filter(a => a.category === 'career').length,
        volunteer: activities.filter(a => a.category === 'volunteer').length
      }
    });

  } catch (error) {
    console.error('PDF 파싱 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'PDF 처리 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

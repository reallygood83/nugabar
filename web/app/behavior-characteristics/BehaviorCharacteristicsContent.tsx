'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authenticatedFetch } from '@/lib/authenticated-fetch';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { YouTubeSubscribeModal } from '@/components/common/YouTubeSubscribeModal';

export default function BehaviorCharacteristicsContent() {
  const { user, isDevMode } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 학생 정보 가져오기
  const classId = searchParams.get('classId');
  const studentId = searchParams.get('studentId');
  const studentName = searchParams.get('studentName');
  const studentNumber = searchParams.get('studentNumber');

  const [selectedKeywords, setSelectedKeywords] = useState<Record<string, number>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 강도 조절 시스템
  const intensityModifiers = {
    1: { prefix: '약간', suffix: '경향을 보임', label: '약간', color: 'bg-blue-100 border-blue-300' },
    2: { prefix: '', suffix: '모습을 보임', label: '보통', color: 'bg-blue-300 border-blue-500' },
    3: { prefix: '매우', suffix: '뛰어난 모습을 보임', label: '매우', color: 'bg-blue-500 border-blue-700 text-white' }
  };

  // 60개 키워드 데이터
  const categories = [
    {
      id: 'learning_attitude',
      name: '학습태도',
      description: '수업 참여도, 집중력, 과제 수행 등',
      color: '#4285F4',
      keywords: [
        { id: 'active_participation', text: '적극적 참여', autoText: '수업에 적극적으로 참여하며' },
        { id: 'high_concentration', text: '집중력 우수', autoText: '높은 집중력을 보이며' },
        { id: 'frequent_questions', text: '질문 빈도 높음', autoText: '궁금한 점을 적극적으로 질문하며' },
        { id: 'task_completion', text: '과제 성실 수행', autoText: '주어진 과제를 성실히 수행하고' },
        { id: 'self_directed_learning', text: '자기주도학습', autoText: '스스로 학습 계획을 세우고 실천하며' },
        { id: 'note_taking', text: '필기 정리 우수', autoText: '수업 내용을 체계적으로 정리하며' },
        { id: 'homework_diligent', text: '숙제 성실', autoText: '숙제를 빠짐없이 해오며' },
        { id: 'learning_preparation', text: '학습 준비 철저', autoText: '수업 준비물을 빠짐없이 준비하며' },
        { id: 'attention_needed', text: '집중력 개선 필요', autoText: '수업 집중력 향상이 기대되며' },
        { id: 'passive_participation', text: '수동적 참여', autoText: '보다 적극적인 참여가 기대되며' },
      ]
    },
    {
      id: 'social_skills',
      name: '대인관계',
      description: '협력, 배려, 소통 능력 등',
      color: '#34A853',
      keywords: [
        { id: 'collaborative', text: '협력적', autoText: '친구들과 협력하여' },
        { id: 'caring', text: '배려심 많음', autoText: '친구들을 배려하는 마음으로' },
        { id: 'leadership', text: '리더십 발휘', autoText: '모둠을 이끌어가는 리더십을 보이며' },
        { id: 'conflict_resolution', text: '갈등 해결 능력', autoText: '문제 상황을 슬기롭게 해결하며' },
        { id: 'communication_skills', text: '의사소통 능력', autoText: '자신의 생각을 명확히 표현하고' },
        { id: 'inclusive_behavior', text: '포용적 태도', autoText: '모든 친구를 포용하는 마음으로' },
        { id: 'empathy', text: '공감 능력', autoText: '친구들의 마음을 잘 이해하며' },
        { id: 'helpful_attitude', text: '도움주기 적극적', autoText: '어려움에 처한 친구를 적극적으로 도우며' },
        { id: 'friendship_building', text: '친구 사귀기 능숙', autoText: '새로운 친구들과 쉽게 친해지며' },
        { id: 'shy_interaction', text: '소극적 교우관계', autoText: '친구들과의 활발한 교류가 기대되며' },
      ]
    },
    {
      id: 'cognitive_abilities',
      name: '학습능력',
      description: '이해력, 사고력, 창의성 등',
      color: '#EA4335',
      keywords: [
        { id: 'quick_understanding', text: '이해력 빠름', autoText: '새로운 내용을 빠르게 이해하며' },
        { id: 'good_application', text: '응용력 좋음', autoText: '학습한 내용을 다양하게 응용하며' },
        { id: 'creative_thinking', text: '창의적 사고', autoText: '독창적인 아이디어로' },
        { id: 'logical_expression', text: '논리적 표현', autoText: '논리적으로 설명하며' },
        { id: 'analytical_thinking', text: '분석적 사고', autoText: '문제를 체계적으로 분석하며' },
        { id: 'problem_solving', text: '문제해결력', autoText: '어려운 문제에 도전하여 해결하며' },
        { id: 'critical_thinking', text: '비판적 사고', autoText: '다양한 관점에서 생각하며' },
        { id: 'memory_retention', text: '기억력 우수', autoText: '학습한 내용을 오래 기억하며' },
        { id: 'synthesis_skills', text: '종합 사고력', autoText: '여러 정보를 종합하여 판단하며' },
        { id: 'needs_reinforcement', text: '기초 개념 보강 필요', autoText: '기초 개념 이해가 더욱 향상되면' },
      ]
    },
    {
      id: 'participation_level',
      name: '참여도',
      description: '발표, 토론, 활동 참여 정도',
      color: '#FBBC04',
      keywords: [
        { id: 'active_presentation', text: '발표 적극적', autoText: '자신 있게 발표하며' },
        { id: 'discussion_leader', text: '토론 주도', autoText: '토론을 주도적으로 이끌어가며' },
        { id: 'idea_contributor', text: '아이디어 제시', autoText: '참신한 아이디어를 제시하며' },
        { id: 'group_activity_leader', text: '모둠활동 주도', autoText: '모둠 활동에서 주도적 역할을 하며' },
        { id: 'volunteer_actively', text: '자원봉사 적극적', autoText: '자원봉사 활동에 적극적으로 참여하며' },
        { id: 'class_responsibility', text: '학급 업무 성실', autoText: '맡은 학급 업무를 성실히 수행하며' },
        { id: 'event_participation', text: '행사 참여 적극적', autoText: '학교 행사에 적극적으로 참여하며' },
        { id: 'opinion_expression', text: '의견 표현 적극적', autoText: '자신의 의견을 적극적으로 표현하며' },
        { id: 'presentation_anxiety', text: '발표 부담감', autoText: '발표에 대한 자신감 향상이 기대되며' },
        { id: 'observer_role', text: '관찰자 역할', autoText: '신중하게 관찰하며' },
      ]
    },
    {
      id: 'character_traits',
      name: '성격특성',
      description: '성실성, 책임감, 인내심 등',
      color: '#9C27B0',
      keywords: [
        { id: 'responsible', text: '책임감 강함', autoText: '맡은 일에 책임감을 갖고' },
        { id: 'diligent', text: '성실함', autoText: '성실한 태도로' },
        { id: 'patient', text: '인내심 있음', autoText: '끈기있게 노력하며' },
        { id: 'organized', text: '체계적', autoText: '체계적으로 정리하며' },
        { id: 'curious', text: '호기심 많음', autoText: '호기심을 바탕으로' },
        { id: 'honest', text: '정직함', autoText: '진실한 마음으로' },
        { id: 'considerate', text: '사려깊음', autoText: '사려깊게 행동하며' },
        { id: 'positive_attitude', text: '긍정적 사고', autoText: '긍정적인 마음으로' },
        { id: 'self_control', text: '자기통제력', autoText: '자신을 잘 조절하며' },
        { id: 'impulsive', text: '충동적 행동', autoText: '신중한 행동이 더욱 기대되며' },
      ]
    },
    {
      id: 'special_talents',
      name: '특기사항',
      description: '특별한 재능이나 관심사',
      color: '#FF9800',
      keywords: [
        { id: 'artistic_talent', text: '예술적 재능', autoText: '뛰어난 예술적 감각으로' },
        { id: 'mathematical_aptitude', text: '수학적 사고력', autoText: '뛰어난 수학적 사고력으로' },
        { id: 'language_skills', text: '언어 능력', autoText: '우수한 언어 능력으로' },
        { id: 'physical_coordination', text: '신체 협응력', autoText: '뛰어난 신체 협응력으로' },
        { id: 'technology_interest', text: '기술 관심도', autoText: '기술에 대한 높은 관심으로' },
        { id: 'musical_talent', text: '음악적 재능', autoText: '음악적 재능을 발휘하며' },
        { id: 'athletic_ability', text: '운동 능력', autoText: '우수한 운동 능력으로' },
        { id: 'science_interest', text: '과학 탐구심', autoText: '과학에 대한 탐구심으로' },
        { id: 'writing_talent', text: '글쓰기 재능', autoText: '뛰어난 글쓰기 실력으로' },
        { id: 'area_exploration', text: '관심 영역 탐색', autoText: '다양한 영역을 탐색하며' },
      ]
    },
  ];

  const toggleKeyword = (keywordId: string) => {
    setSelectedKeywords(prev => {
      const current = prev[keywordId] || 0;
      const next = current >= 3 ? 0 : current + 1;

      if (next === 0) {
        const newState = { ...prev };
        delete newState[keywordId];
        return newState;
      }

      return { ...prev, [keywordId]: next };
    });
  };

  const handleGenerate = async () => {
    if (Object.keys(selectedKeywords).length === 0) {
      alert('최소 1개 이상의 키워드를 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await authenticatedFetch(user, isDevMode, '/api/behavior-characteristics/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: selectedKeywords,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedText(data.text);
      } else {
        alert('생성 실패: ' + data.error);
      }
    } catch {
      alert('생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    alert('복사되었습니다!');
  };

  const handleSaveBehaviorText = async () => {
    if (!generatedText || !classId || !studentId) {
      alert('❌ 저장할 행동특성이 없거나 학생 정보가 없습니다.');
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem('tempBehaviorText', generatedText);
      localStorage.setItem('tempClassId', classId);
      localStorage.setItem('tempStudentId', studentId);

      alert('✅ 행동특성이 저장되었습니다! 누가기록 생성 페이지로 이동합니다.');
      router.push(`/cumulative-records?classId=${classId}&studentId=${studentId}&studentName=${studentName}&studentNumber=${studentNumber}&fromBehavior=true`);
    } catch {
      alert('❌ 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const navigateToCumulativeRecords = () => {
    if (!classId || !studentId) {
      alert('❌ 학생 정보가 없어 이동할 수 없습니다.');
      return;
    }

    router.push(`/cumulative-records?classId=${classId}&studentId=${studentId}&studentName=${studentName}&studentNumber=${studentNumber}`);
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">행동특성 생성</h1>
        <p className="text-muted-foreground">학생의 행동특성을 AI로 자동 생성합니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Keyword Selection */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>키워드 선택</CardTitle>
              <CardDescription>관찰된 행동 특성을 선택하세요 (최대 5개 권장)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map(category => (
                <div key={category.id}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {category.keywords.map(keyword => {
                      const intensity = selectedKeywords[keyword.id] || 0;
                      const isSelected = intensity > 0;
                      const modifier = intensity > 0 ? intensityModifiers[intensity as 1 | 2 | 3] : null;

                      return (
                        <Button
                          key={keyword.id}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleKeyword(keyword.id)}
                          className={`justify-start text-sm ${isSelected ? modifier?.color : ''}`}
                        >
                          {keyword.text}
                          {isSelected && (
                            <span className="ml-auto text-xs opacity-75">
                              {modifier?.label}
                            </span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || selectedKeywords.length === 0}
              className="flex-1"
            >
              {isGenerating ? '생성 중...' : '행동특성 생성'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedKeywords({})}
              disabled={Object.keys(selectedKeywords).length === 0}
            >
              초기화
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            선택된 키워드: {Object.keys(selectedKeywords).length}개
            {Object.keys(selectedKeywords).length > 0 && ' (클릭하여 강도 조절: 약간 → 보통 → 매우)'}
          </p>
        </div>

        {/* Right: Generated Result */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>생성 결과</CardTitle>
              <CardDescription>AI가 생성한 행동특성 문장입니다</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedText ? (
                <>
                  <div className="p-4 bg-secondary rounded-lg mb-4 min-h-[300px] whitespace-pre-wrap">
                    {generatedText}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={copyToClipboard}>
                      📋 복사하기
                    </Button>
                    <Button variant="outline" onClick={() => setGeneratedText('')}>
                      지우기
                    </Button>
                    {classId && studentId && (
                      <>
                        <Button
                          onClick={handleSaveBehaviorText}
                          disabled={isSaving}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isSaving ? '저장 중...' : '💾 저장하고 누가기록 생성하기'}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={navigateToCumulativeRecords}
                        >
                          📝 누가기록 페이지로 이동
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg min-h-[300px] flex items-center justify-center">
                  키워드를 선택하고 생성 버튼을 눌러주세요
                </div>
              )}
            </CardContent>
          </Card>

          {/* NEIS Compliance Info */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">✅ 나이스 규정 준수</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• 500자 이내 자동 조정</li>
                <li>• 금지 표현 자동 필터링</li>
                <li>• 과거형/명사형 종결 검증</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* YouTube Subscribe Modal */}
      <YouTubeSubscribeModal
        isOpen={isGenerating}
        onClose={() => {}}
        storageKey="behavior-characteristics-modal-shown"
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import NavigationHeader from '@/components/common/NavigationHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CumulativeRecordsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [behaviorText, setBehaviorText] = useState('');
  const [recordCount, setRecordCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [excludedDates, setExcludedDates] = useState(''); // 휴업일, 결석일 입력
  const [generatedRecords, setGeneratedRecords] = useState<Array<{
    date: string;
    text: string;
    length: number;
  }>>([]);

  const handleGenerate = async () => {
    if (!behaviorText.trim()) {
      alert('행동특성 텍스트를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    try {
      // 제외 날짜 파싱 (콤마나 줄바꿈으로 구분된 날짜)
      const parsedDates = excludedDates
        .split(/[,\n]/)
        .map(d => d.trim())
        .filter(d => d.length > 0)
        .map(d => {
          // YYYY-MM-DD 형식으로 변환
          const cleaned = d.replace(/[년월일\s.-]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
          return cleaned;
        });

      const response = await fetch('/api/cumulative-records/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          behaviorText: behaviorText.trim(),
          recordCount,
          uid: user?.uid,
          excludedDates: parsedDates,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedRecords(data.records);
      } else {
        alert('생성 실패: ' + data.error);
      }
    } catch (error) {
      alert('생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyAllRecords = () => {
    const text = generatedRecords
      .map(record => `${record.date}\n${record.text}\n`)
      .join('\n');
    navigator.clipboard.writeText(text);
    alert('모든 누가기록이 복사되었습니다!');
  };

  const copyRecord = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('복사되었습니다!');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">누가기록 생성</h1>
          <p className="text-muted-foreground">행동특성을 바탕으로 누가기록을 AI로 자동 생성합니다</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>행동특성 입력</CardTitle>
                <CardDescription>생성된 행동특성 문장을 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">행동특성 및 종합의견</label>
                  <textarea
                    value={behaviorText}
                    onChange={(e) => setBehaviorText(e.target.value)}
                    placeholder="예) 수업에 적극적으로 참여하며 높은 집중력을 보이고, 친구들과 협력하여 과제를 성실히 수행하는 모습을 보였음."
                    className="w-full min-h-[200px] p-3 border rounded-lg resize-y"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {behaviorText.length}자 / 권장: 400-500자
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">생성 개수</label>
                  <div className="flex gap-2">
                    {[3, 5, 7, 10].map(num => (
                      <Button
                        key={num}
                        variant={recordCount === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRecordCount(num)}
                      >
                        {num}개
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    🗓️ 학생별 결석일 (선택사항)
                  </label>
                  <textarea
                    value={excludedDates}
                    onChange={(e) => setExcludedDates(e.target.value)}
                    placeholder="예) 2025-01-15, 2025-02-20&#10;또는&#10;2025년 1월 15일&#10;2025년 2월 20일&#10;&#10;이 학생의 결석일을 입력하세요"
                    className="w-full min-h-[80px] p-3 border rounded-lg resize-y text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 학교 전체 휴업일은 <strong>설정 페이지</strong>에서 한 번만 저장하면 자동으로 적용됩니다
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !behaviorText.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? '생성 중...' : '누가기록 생성'}
              </Button>
            </div>

            {/* Guidelines */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">📋 누가기록 작성 지침</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="space-y-1">
                  <li>• 100-150자 내외 권장</li>
                  <li>• 일반적이고 보편적인 표현 사용</li>
                  <li>• 구체적 상황/도구 언급 금지</li>
                  <li>• 각 기록은 다른 관찰 영역 중심</li>
                  <li>• 평일 날짜로 자동 생성 (주말 제외)</li>
                  <li>• 한국 공휴일 자동 제외</li>
                  <li>• 모든 날짜는 서로 다름</li>
                  <li>• 휴업일/결석일 선택 입력 가능</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right: Generated Results */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>생성된 누가기록</CardTitle>
                    <CardDescription>총 {generatedRecords.length}개</CardDescription>
                  </div>
                  {generatedRecords.length > 0 && (
                    <Button onClick={copyAllRecords} variant="outline" size="sm">
                      📋 전체 복사
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedRecords.length > 0 ? (
                  <div className="space-y-3">
                    {generatedRecords.map((record, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            {index + 1}. {record.date}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyRecord(record.text)}
                            className="h-6 px-2 text-xs"
                          >
                            복사
                          </Button>
                        </div>
                        <p className="text-sm leading-relaxed">{record.text}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {record.length}자
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg min-h-[400px] flex items-center justify-center">
                    행동특성을 입력하고 생성 버튼을 눌러주세요
                  </div>
                )}
              </CardContent>
            </Card>

            {/* NEIS Compliance Info */}
            {generatedRecords.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">✅ 나이스 규정 준수</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    <li>• 150자 이내 자동 조정</li>
                    <li>• 금지 표현 자동 필터링</li>
                    <li>• 마침표 종결 검증</li>
                    <li>• 평일 날짜로 생성</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

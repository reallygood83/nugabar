'use client';

import { useState } from 'react';

interface Activity {
  id: string;
  date: string;
  category: 'autonomous' | 'club' | 'career' | 'volunteer';
  subject: string;
  content: string;
  selected: boolean;
}

interface GeneratedRecord {
  activityId: string;
  activitySubject: string;
  activityDate: string;
  activityCategory: string;
  records: string[];
  generatedAt: string;
}

interface RecordGeneratorProps {
  selectedActivities: Activity[];
  onGenerationComplete: (records: GeneratedRecord[]) => void;
  onGeneratingChange?: (isGenerating: boolean) => void;
  userId: string;
}

export default function RecordGenerator({
  selectedActivities,
  onGenerationComplete,
  onGeneratingChange,
  userId
}: RecordGeneratorProps) {
  const [recordCount, setRecordCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleGenerate = async () => {
    if (selectedActivities.length === 0) {
      setError('활동을 선택해주세요.');
      return;
    }

    if (recordCount < 1 || recordCount > 20) {
      setError('생성 개수는 1~20개 사이로 설정해주세요.');
      return;
    }

    setIsGenerating(true);
    onGeneratingChange?.(true);
    setError('');
    setProgress({ current: 0, total: selectedActivities.length });

    try {
      const allRecords: GeneratedRecord[] = [];

      // 각 활동에 대해 순차적으로 누가기록 생성
      for (let i = 0; i < selectedActivities.length; i++) {
        const activity = selectedActivities[i];
        setProgress({ current: i + 1, total: selectedActivities.length });

        const response = await fetch('/api/creative-activities/generate-records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            activity: {
              date: activity.date,
              category: activity.category,
              subject: activity.subject,
              content: activity.content
            },
            recordCount
          })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || `${activity.subject} 누가기록 생성 실패`);
        }

        allRecords.push({
          activityId: activity.id,
          activitySubject: activity.subject,
          activityDate: activity.date,
          activityCategory: activity.category,
          records: data.records,
          generatedAt: new Date().toISOString()
        });
      }

      onGenerationComplete(allRecords);
    } catch (err) {
      console.error('누가기록 생성 오류:', err);
      setError(err instanceof Error ? err.message : '누가기록 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
      onGeneratingChange?.(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="space-y-4">
      {/* 설정 영역 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          누가기록 생성 설정
        </h3>

        <div className="space-y-4">
          {/* 생성 개수 설정 */}
          <div>
            <label htmlFor="recordCount" className="block text-sm font-medium text-gray-700 mb-2">
              활동당 생성할 누가기록 개수
            </label>
            <div className="flex items-center gap-4">
              <input
                id="recordCount"
                type="range"
                min="1"
                max="20"
                value={recordCount}
                onChange={(e) => setRecordCount(parseInt(e.target.value))}
                disabled={isGenerating}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="w-16 text-center">
                <span className="text-2xl font-bold text-blue-600">{recordCount}</span>
                <span className="text-sm text-gray-500 ml-1">개</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              각 활동마다 {recordCount}개의 서로 다른 누가기록이 생성됩니다
            </p>
          </div>

          {/* 선택된 활동 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  선택된 활동: <span className="text-blue-600 font-bold">{selectedActivities.length}개</span>
                </p>
                <p className="text-sm text-gray-600">
                  총 <span className="font-semibold text-gray-900">{selectedActivities.length * recordCount}개</span>의 누가기록이 생성됩니다
                </p>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* 생성 버튼 */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedActivities.length === 0}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              isGenerating || selectedActivities.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>AI 누가기록 생성 중... ({progress.current}/{progress.total})</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI 누가기록 생성하기</span>
              </div>
            )}
          </button>

          {/* 진행 상황 표시 */}
          {isGenerating && progress.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>진행 상황</span>
                <span>{Math.round((progress.current / progress.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-yellow-900 mb-1">AI 작성 지침</h4>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• 각 누가기록은 학생 개별 특성을 반영하여 생성됩니다</li>
              <li>• 동기-과정-결과(MPR) 구조로 작성됩니다</li>
              <li>• 교외 수상, 부모 직업 등 금지 사항이 자동으로 제외됩니다</li>
              <li>• 생성된 누가기록은 교사의 검토 후 사용을 권장합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

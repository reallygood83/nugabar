'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import PDFUploader from '@/components/creative-activities/PDFUploader';
import ActivityTable from '@/components/creative-activities/ActivityTable';
import RecordGenerator from '@/components/creative-activities/RecordGenerator';
import GeneratedRecordsList from '@/components/creative-activities/GeneratedRecordsList';

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

export default function CreativeActivitiesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [generatedRecords, setGeneratedRecords] = useState<GeneratedRecord[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // 인증되지 않은 사용자 리다이렉트 (클라이언트 사이드에서만 실행)
  useEffect(() => {
    if (!user) {
      router.push('/'); // 메인 페이지로 리다이렉트 (구글 로그인 페이지)
    }
  }, [user, router]);

  // 사용자 정보 로딩 중
  if (!user) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  const handleUploadSuccess = (parsedActivities: Activity[]) => {
    setActivities(parsedActivities);
    setUploadSuccess(true);
    setUploadError('');
    setSelectedActivities([]);
    setGeneratedRecords([]);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(false);
    setActivities([]);
    setSelectedActivities([]);
    setGeneratedRecords([]);
  };

  const handleSelectionChange = (selected: Activity[]) => {
    setSelectedActivities(selected);
  };

  const handleGenerationComplete = (records: GeneratedRecord[]) => {
    setGeneratedRecords(records);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            창체 누가기록 자동 생성
          </h1>
          <p className="text-gray-600">
            창체세부진도표 PDF를 업로드하여 AI 누가기록을 자동으로 생성하세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {uploadError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-900 font-semibold">오류 발생</h3>
                <p className="text-red-800 text-sm mt-1">{uploadError}</p>
              </div>
            </div>
          </div>
        )}

        {/* 성공 메시지 */}
        {uploadSuccess && activities.length > 0 && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-green-900 font-semibold">PDF 파싱 완료</h3>
                <p className="text-green-800 text-sm mt-1">
                  총 {activities.length}개의 활동이 추출되었습니다
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 메인 콘텐츠 영역 - 단계별 안내 */}
        <div className="space-y-6">
          {/* Step 1: PDF 업로드 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                PDF 업로드
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              창체세부진도표 PDF 파일을 업로드해주세요
            </p>
            <PDFUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              userId={user.uid}
            />
          </div>

          {/* Step 2: 활동 선택 */}
          <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${
            activities.length === 0 ? 'opacity-50' : ''
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full ${
                activities.length > 0 ? 'bg-blue-600' : 'bg-gray-300'
              } text-white flex items-center justify-center font-bold`}>
                2
              </div>
              <h2 className={`text-xl font-semibold ${
                activities.length > 0 ? 'text-gray-900' : 'text-gray-400'
              }`}>
                활동 선택
              </h2>
            </div>
            <p className={`mb-4 ${
              activities.length > 0 ? 'text-gray-600' : 'text-gray-400'
            }`}>
              추출된 활동 목록에서 누가기록을 생성할 활동을 선택하세요
            </p>
            {activities.length > 0 && (
              <ActivityTable
                activities={activities}
                onSelectionChange={handleSelectionChange}
              />
            )}
          </div>

          {/* Step 3: 누가기록 생성 */}
          <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${
            selectedActivities.length === 0 ? 'opacity-50' : ''
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full ${
                selectedActivities.length > 0 ? 'bg-blue-600' : 'bg-gray-300'
              } text-white flex items-center justify-center font-bold`}>
                3
              </div>
              <h2 className={`text-xl font-semibold ${
                selectedActivities.length > 0 ? 'text-gray-900' : 'text-gray-400'
              }`}>
                누가기록 생성
              </h2>
            </div>
            <p className={`mb-4 ${
              selectedActivities.length > 0 ? 'text-gray-600' : 'text-gray-400'
            }`}>
              AI가 선택한 활동에 대한 누가기록을 자동으로 생성합니다
            </p>
            {selectedActivities.length > 0 && (
              <RecordGenerator
                selectedActivities={selectedActivities}
                onGenerationComplete={handleGenerationComplete}
                userId={user.uid}
              />
            )}
          </div>
        </div>

        {/* 생성된 누가기록 목록 */}
        {generatedRecords.length > 0 && (
          <div className="mt-8">
            <GeneratedRecordsList records={generatedRecords} />
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 사용 가이드
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• 창체세부진도표 PDF 파일을 준비해주세요</li>
            <li>• 자율활동, 동아리활동, 진로활동, 봉사활동이 자동으로 분류됩니다</li>
            <li>• 생성된 누가기록은 복사 버튼으로 쉽게 NEIS에 붙여넣을 수 있습니다</li>
            <li>• AI 작성 지침에 따라 개별화된 누가기록이 생성됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

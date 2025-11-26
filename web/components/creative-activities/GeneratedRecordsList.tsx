'use client';

import { useState } from 'react';

interface GeneratedRecord {
  activityId: string;
  activitySubject: string;
  activityDate: string;
  activityCategory: string;
  records: string[];
  generatedAt: string;
}

interface GeneratedRecordsListProps {
  records: GeneratedRecord[];
}

// 카테고리 정보
const categoryInfo = {
  autonomous: { name: '자율활동', color: 'blue' },
  club: { name: '동아리활동', color: 'green' },
  career: { name: '진로활동', color: 'purple' },
  volunteer: { name: '봉사활동', color: 'orange' }
};

export default function GeneratedRecordsList({ records }: GeneratedRecordsListProps) {
  const [copiedId, setCopiedId] = useState<string>('');

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
      alert('복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 📥 CSV 다운로드 기능
  const downloadCSV = () => {
    // CSV 헤더
    const headers = ['활동명', '활동일자', '카테고리', '누가기록', '글자수'];

    // 모든 활동의 누가기록을 하나의 배열로 통합
    const rows: string[][] = [];
    records.forEach(record => {
      const categoryName = categoryInfo[record.activityCategory as keyof typeof categoryInfo]?.name || record.activityCategory;

      record.records.forEach(text => {
        rows.push([
          record.activitySubject,
          record.activityDate,
          categoryName,
          `"${text.replace(/"/g, '""')}"`, // 쌍따옴표 이스케이프
          text.length.toString()
        ]);
      });
    });

    // CSV 문자열 생성 (BOM 추가로 한글 깨짐 방지)
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Blob 생성 및 다운로드
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // 파일명: 창체누가기록_날짜.csv
    const today = new Date().toISOString().split('T')[0];
    const fileName = `창체누가기록_${today}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('📥 CSV 파일이 다운로드되었습니다!');
  };

  if (records.length === 0) {
    return null;
  }

  // 전체 누가기록 개수
  const totalRecords = records.reduce((sum, r) => sum + r.records.length, 0);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              생성된 누가기록
            </h2>
            <p className="text-gray-600">
              {records.length}개 활동에 대한 총 {totalRecords}개의 누가기록이 생성되었습니다
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              📥 CSV 다운로드
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-green-800">생성 완료</span>
            </div>
          </div>
        </div>
      </div>

      {/* 각 활동별 누가기록 */}
      {records.map((record, recordIndex) => {
        const category = categoryInfo[record.activityCategory as keyof typeof categoryInfo];

        return (
          <div key={recordIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* 활동 정보 헤더 */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${category.color}-50 text-${category.color}-700 border border-${category.color}-200`}>
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500">{record.activityDate}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {record.activitySubject}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">생성 개수</p>
                  <p className="text-xl font-bold text-blue-600">{record.records.length}개</p>
                </div>
              </div>
            </div>

            {/* 누가기록 목록 */}
            <div className="divide-y divide-gray-200">
              {record.records.map((text, textIndex) => {
                const uniqueId = `${record.activityId}-${textIndex}`;
                const isCopied = copiedId === uniqueId;

                return (
                  <div key={textIndex} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* 번호 */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                        {textIndex + 1}
                      </div>

                      {/* 누가기록 텍스트 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                          {text}
                        </p>
                      </div>

                      {/* 복사 버튼 */}
                      <button
                        onClick={() => handleCopy(text, uniqueId)}
                        className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          isCopied
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isCopied ? (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>복사됨</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>복사</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* 안내 메시지 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">사용 안내</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• 복사 버튼을 클릭하여 누가기록을 클립보드에 복사할 수 있습니다</li>
              <li>• NEIS 시스템에 붙여넣기하여 사용하세요</li>
              <li>• 각 누가기록은 교육부 지침에 따라 개별화되어 생성되었습니다</li>
              <li>• 교사의 최종 검토 후 사용을 권장합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

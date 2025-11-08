'use client';

import { useState, useRef } from 'react';

interface PDFUploaderProps {
  onUploadSuccess: (activities: any[]) => void;
  onUploadError: (error: string) => void;
  userId: string;
}

export default function PDFUploader({ onUploadSuccess, onUploadError, userId }: PDFUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // PDF 파일인지 확인
    if (file.type !== 'application/pdf') {
      onUploadError('PDF 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      onUploadError('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setFileName(file.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('userId', userId);

      const response = await fetch('/api/creative-activities/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'PDF 파싱에 실패했습니다.');
      }

      onUploadSuccess(data.activities);
    } catch (error) {
      console.error('PDF 업로드 오류:', error);
      onUploadError(error instanceof Error ? error.message : 'PDF 업로드 중 오류가 발생했습니다.');
      setFileName('');
    } finally {
      setIsUploading(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        onClick={handleClick}
        disabled={isUploading}
        className={`w-full border-2 border-dashed rounded-lg p-8 transition-all ${
          isUploading
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 font-medium">PDF 분석 중...</p>
              <p className="text-sm text-gray-500">{fileName}</p>
            </>
          ) : (
            <>
              <svg
                className="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  PDF 파일 업로드
                </p>
                <p className="text-sm text-gray-600">
                  클릭하여 창체세부진도표 PDF를 선택하세요
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  최대 파일 크기: 10MB
                </p>
              </div>
            </>
          )}
        </div>
      </button>

      {fileName && !isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{fileName}</span>
          <span className="text-gray-500">업로드 완료</span>
        </div>
      )}
    </div>
  );
}

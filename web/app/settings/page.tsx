'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authenticatedFetch } from '@/lib/authenticated-fetch';
import {
  deleteLocalGeminiApiKey,
  getLocalGeminiApiKey,
  saveLocalGeminiApiKey,
} from '@/lib/local-gemini-api-key';
import NavigationHeader from '@/components/common/NavigationHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const { user, isDevMode } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  // 학교 휴업일 설정
  const [schoolClosureDates, setSchoolClosureDates] = useState('');
  const [isSavingClosures, setIsSavingClosures] = useState(false);

  // 학교명 설정
  const [schoolName, setSchoolName] = useState('');
  const [isSavingSchoolName, setIsSavingSchoolName] = useState(false);

  // Gemini 모델 설정
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [isSavingModel, setIsSavingModel] = useState(false);

  useEffect(() => {
    checkApiKey();
    loadSchoolClosures();
    loadSchoolName();
    loadGeminiModel();
  }, [user]);

  useEffect(() => {
    checkApiKey();
  }, []);

  const loadSchoolClosures = async () => {
    if (!user?.uid) return;

    try {
      const response = await authenticatedFetch(user, isDevMode, '/api/settings/get-school-closures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success && data.closureDates) {
        setSchoolClosureDates(data.closureDates);
      }
    } catch (error) {
      console.error('학교 휴업일 불러오기 오류:', error);
    }
  };

  const loadSchoolName = async () => {
    if (!user?.uid) return;

    try {
      const response = await authenticatedFetch(user, isDevMode, '/api/settings/get-school-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success && data.schoolName) {
        setSchoolName(data.schoolName);
      }
    } catch (error) {
      console.error('학교명 불러오기 오류:', error);
    }
  };

  const loadGeminiModel = async () => {
    if (!user?.uid) return;

    try {
      const response = await authenticatedFetch(user, isDevMode, '/api/settings/get-gemini-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success && data.geminiModel) {
        setGeminiModel(data.geminiModel);
      }
    } catch (error) {
      console.error('Gemini 모델 불러오기 오류:', error);
    }
  };

  const checkApiKey = async () => {
    setHasApiKey(!!getLocalGeminiApiKey());
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      alert('API 키를 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      saveLocalGeminiApiKey(apiKey.trim());
      alert('✅ API 키가 이 브라우저에만 저장되었습니다!');
      setHasApiKey(true);
      setApiKey('');
    } catch (error) {
      alert('❌ 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      alert('테스트할 API 키를 입력해주세요.');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/settings/test-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
        }),
      });

      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        message: '테스트 중 오류가 발생했습니다.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 API 키를 삭제하시겠습니까?')) {
      return;
    }

    try {
      deleteLocalGeminiApiKey();
      alert('✅ 이 브라우저에 저장된 API 키가 삭제되었습니다.');
      setHasApiKey(false);
      setApiKey('');
    } catch (error) {
      alert('❌ 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSaveClosures = async () => {
    setIsSavingClosures(true);
    try {
      const response = await authenticatedFetch(user, isDevMode, '/api/settings/save-school-closures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          closureDates: schoolClosureDates.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ 학교 휴업일이 저장되었습니다!');
      } else {
        alert('❌ 저장 실패: ' + data.error);
      }
    } catch (error) {
      alert('❌ 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingClosures(false);
    }
  };

  const handleSaveSchoolName = async () => {
    setIsSavingSchoolName(true);
    try {
      const response = await authenticatedFetch(user, isDevMode, '/api/settings/save-school-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: schoolName.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ 학교명이 저장되었습니다!');
        // 헤더 새로고침을 위해 페이지 리로드
        window.location.reload();
      } else {
        alert('❌ 저장 실패: ' + data.error);
      }
    } catch (error) {
      alert('❌ 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingSchoolName(false);
    }
  };

  const handleSaveGeminiModel = async () => {
    setIsSavingModel(true);
    try {
      const response = await authenticatedFetch(user, isDevMode, '/api/settings/save-gemini-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiModel,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Gemini 모델이 저장되었습니다!');
      } else {
        alert('❌ 저장 실패: ' + data.error);
      }
    } catch (error) {
      alert('❌ 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingModel(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">설정</h1>
          <p className="text-muted-foreground">Gemini API 키 및 개인 설정 관리</p>
        </div>

        <div className="grid gap-6">
          {/* API Key Section */}
          <Card>
            <CardHeader>
              <CardTitle>🔑 Gemini API 키 설정</CardTitle>
              <CardDescription>
                Gemini API 키는 서버에 저장하지 않고 이 브라우저에만 보관합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasApiKey && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ API 키가 이 브라우저에 저장되어 있습니다. 새로운 키를 입력하면 기존 키를 덮어씁니다.
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Gemini API 키</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full p-3 border rounded-lg font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  API 키는 서버에 저장되지 않으며 AI 생성 요청 때만 임시로 전달됩니다
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleTest}
                  disabled={isTesting || !apiKey.trim()}
                  variant="outline"
                >
                  {isTesting ? '테스트 중...' : '🧪 테스트'}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !apiKey.trim()}
                  className="flex-1"
                >
                  {isSaving ? '저장 중...' : '💾 저장'}
                </Button>
                {hasApiKey && (
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                  >
                    🗑️ 삭제
                  </Button>
                )}
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg border ${
                    testResult.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <p
                    className={`text-sm ${
                      testResult.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {testResult.success ? '✅' : '❌'} {testResult.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gemini Model */}
          <Card>
            <CardHeader>
              <CardTitle>🤖 Gemini AI 모델</CardTitle>
              <CardDescription>
                모든 AI 생성 기능은 Gemini 2.5 Flash 모델로 고정됩니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  사용할 모델
                </label>
                <div className="w-full p-3 border rounded-lg bg-gray-50 font-medium">
                  Gemini 2.5 Flash
                </div>
              </div>

              <Button
                onClick={handleSaveGeminiModel}
                disabled={isSavingModel}
                className="w-full"
              >
                {isSavingModel ? '저장 중...' : '💾 고정 모델 저장'}
              </Button>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>💡 모델 안내:</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1 ml-4">
                  <li>• <strong>Gemini 2.5 Flash</strong>만 사용합니다.</li>
                  <li>• 기존에 저장된 2.0 설정이 있어도 서버에서 2.5 Flash로 처리합니다.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How to Get API Key */}
          <Card>
            <CardHeader>
              <CardTitle>📖 API 키 발급 방법</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google AI Studio
                  </a>
                  에 접속합니다
                </li>
                <li>Google 계정으로 로그인합니다</li>
                <li>&quot;Get API key&quot; 또는 &quot;API 키 만들기&quot; 버튼을 클릭합니다</li>
                <li>생성된 API 키를 복사합니다</li>
                <li>위의 입력란에 붙여넣고 &quot;테스트&quot; 버튼으로 확인 후 &quot;저장&quot;합니다</li>
              </ol>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>무료 사용량:</strong> Gemini API는 무료 티어로 제공됩니다.
                  자세한 내용은{' '}
                  <a
                    href="https://ai.google.dev/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Google AI 가격 정책
                  </a>
                  을 참조하세요.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* School Name */}
          <Card>
            <CardHeader>
              <CardTitle>🏫 학교 정보 설정</CardTitle>
              <CardDescription>
                헤더에 표시될 학교명을 설정합니다 (예: 박달초등학교)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  학교명
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="예) 박달초등학교"
                  className="w-full p-3 border rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  헤더에 &quot;{schoolName || '학교명'} 누가바&quot; 형식으로 표시됩니다
                </p>
              </div>

              <Button
                onClick={handleSaveSchoolName}
                disabled={isSavingSchoolName}
                className="w-full"
              >
                {isSavingSchoolName ? '저장 중...' : '💾 학교명 저장'}
              </Button>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 학교명을 저장하면 모든 페이지 헤더에 표시됩니다
                </p>
              </div>
            </CardContent>
          </Card>

          {/* School Closure Dates */}
          <Card>
            <CardHeader>
              <CardTitle>🗓️ 학교 휴업일 설정</CardTitle>
              <CardDescription>
                누가기록 생성 시 제외할 학교 휴업일을 미리 설정합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  휴업일 목록 (연간 또는 학기별로 설정)
                </label>
                <textarea
                  value={schoolClosureDates}
                  onChange={(e) => setSchoolClosureDates(e.target.value)}
                  placeholder="예) 2025-01-15, 2025-02-20&#10;또는&#10;2025년 1월 15일&#10;2025년 2월 20일&#10;&#10;운동회, 소풍, 현장학습 등 휴업일을 입력하세요"
                  className="w-full min-h-[120px] p-3 border rounded-lg resize-y text-sm font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  콤마(,) 또는 줄바꿈으로 구분하여 입력하세요. 주말과 공휴일은 자동 제외되므로 입력하지 않아도 됩니다.
                </p>
              </div>

              <Button
                onClick={handleSaveClosures}
                disabled={isSavingClosures}
                className="w-full"
              >
                {isSavingClosures ? '저장 중...' : '💾 휴업일 저장'}
              </Button>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 설정한 휴업일은 누가기록 생성 시 자동으로 반영됩니다. 학생별 결석일은 누가기록 생성 페이지에서 별도로 입력할 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

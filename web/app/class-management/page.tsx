'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authenticatedFetch } from '@/lib/authenticated-fetch';
import { useRouter } from 'next/navigation';
import NavigationHeader from '@/components/common/NavigationHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Class {
  id: string;
  className: string;
  year: number;
  semester: number;
  grade: number;
  classNumber: number;
  studentCount: number;
  recordCount: number;
  createdAt: string;
}

export default function ClassManagementPage() {
  const { user, isDevMode } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // 새 학급 생성 폼 상태
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [grade, setGrade] = useState('3');
  const [classNumber, setClassNumber] = useState('1');
  const [semester, setSemester] = useState('1');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    if (user) {
      loadClasses();
    }
  }, [user]);

  const loadClasses = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await authenticatedFetch(user, isDevMode, '/api/classes/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        setClasses(data.classes);
      }
    } catch (error) {
      console.error('학급 목록 불러오기 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClass = async () => {
    if (!user) return;

    setIsCreating(true);
    try {
      const response = await authenticatedFetch(user, isDevMode, '/api/classes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          classNumber,
          semester,
          year: parseInt(year),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ 학급이 생성되었습니다!');
        setShowCreateForm(false);
        loadClasses();
      } else {
        alert('❌ 생성 실패: ' + data.error);
      }
    } catch (error) {
      alert('❌ 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-16">
          <p className="text-center text-gray-600">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavigationHeader />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 학급 관리</h1>
          <p className="text-gray-600">학급을 생성하고 학생별 누가기록을 관리하세요</p>
        </div>

        {/* 학급 목록 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>🏫 내 학급 목록</CardTitle>
                <CardDescription>등록된 학급: {classes.length}개</CardDescription>
              </div>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {showCreateForm ? '❌ 취소' : '➕ 새 학급 만들기'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showCreateForm && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-4">새 학급 만들기</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">년도</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">학년</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {[1, 2, 3, 4, 5, 6].map((g) => (
                        <option key={g} value={g}>
                          {g}학년
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">반</label>
                    <select
                      value={classNumber}
                      onChange={(e) => setClassNumber(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                        <option key={c} value={c}>
                          {c}반
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">학기</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="1">1학기</option>
                      <option value="2">2학기</option>
                    </select>
                  </div>
                </div>
                <Button
                  onClick={handleCreateClass}
                  disabled={isCreating}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isCreating ? '생성 중...' : '✅ 학급 생성하기'}
                </Button>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">불러오는 중...</div>
            ) : classes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                아직 생성된 학급이 없습니다. 위에서 새 학급을 만들어보세요!
              </div>
            ) : (
              <div className="space-y-3">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/class-management/${cls.id}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {cls.className}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          학생: {cls.studentCount}명 | 누가기록: {cls.recordCount}개
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/class-management/${cls.id}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        관리하기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

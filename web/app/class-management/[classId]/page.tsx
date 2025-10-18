'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import NavigationHeader from '@/components/common/NavigationHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Student {
  id: string;
  number: number;
  maskedName: string;
  recordCount: number;
  createdAt: string;
}

interface ClassData {
  id: string;
  className: string;
  year: number;
  semester: number;
  grade: number;
  classNumber: number;
  studentCount: number;
  recordCount: number;
}

export default function ClassDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 학생 추가 폼 상태
  const [studentNumber, setStudentNumber] = useState('1');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    if (user && classId) {
      loadClassData();
      loadStudents();
    }
  }, [user, classId]);

  const loadClassData = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/classes/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });

      const data = await response.json();
      if (data.success) {
        const currentClass = data.classes.find((c: ClassData) => c.id === classId);
        setClassData(currentClass || null);
      }
    } catch (error) {
      console.error('학급 정보 불러오기 오류:', error);
    }
  };

  const loadStudents = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/classes/${classId}/students/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });

      const data = await response.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error('학생 목록 불러오기 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!user || !studentName.trim()) {
      alert('❌ 학생 이름을 입력해주세요.');
      return;
    }

    setIsAddingStudent(true);
    try {
      const response = await fetch(`/api/classes/${classId}/students/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          number: studentNumber,
          name: studentName,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ 학생이 추가되었습니다!');
        setShowAddForm(false);
        setStudentName('');
        setStudentNumber((parseInt(studentNumber) + 1).toString());
        loadClassData();
        loadStudents();
      } else {
        alert('❌ 추가 실패: ' + data.error);
      }
    } catch (error) {
      alert('❌ 추가 중 오류가 발생했습니다.');
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleExportExcel = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      const response = await fetch(`/api/classes/${classId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!response.ok) {
        throw new Error('엑셀 다운로드 실패');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${classData?.className || '학급'}_누가기록.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('✅ 엑셀 파일이 다운로드되었습니다!');
    } catch (error) {
      console.error('엑셀 다운로드 오류:', error);
      alert('❌ 엑셀 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
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
        {/* 학급 정보 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/class-management')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← 학급 목록으로
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {classData?.className || '학급'}
          </h1>
          <p className="text-gray-600">
            학생 {classData?.studentCount || 0}명 | 누가기록 {classData?.recordCount || 0}개
          </p>
        </div>

        {/* 학생 목록 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>👥 학생 목록</CardTitle>
                <CardDescription>등록된 학생: {students.length}명</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleExportExcel}
                  disabled={isExporting || students.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isExporting ? '다운로드 중...' : '📊 엑셀 다운로드'}
                </Button>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {showAddForm ? '❌ 취소' : '➕ 학생 추가'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-4">새 학생 추가</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">번호</label>
                    <input
                      type="number"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-1 block">이름</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddStudent();
                        }
                      }}
                      placeholder="학생 이름 (자동으로 가운데 글자가 *로 마스킹됩니다)"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddStudent}
                  disabled={isAddingStudent || !studentName.trim()}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isAddingStudent ? '추가 중...' : '✅ 학생 추가하기'}
                </Button>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">불러오는 중...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                아직 등록된 학생이 없습니다. 위에서 학생을 추가해보세요!
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/class-management/${classId}/students/${student.id}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {student.number}번 {student.maskedName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          누가기록: {student.recordCount}개
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/class-management/${classId}/students/${student.id}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        누가기록 관리
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

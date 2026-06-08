'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authenticatedFetch } from '@/lib/authenticated-fetch';
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
  const { user, isDevMode } = useAuth();
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // 학생 추가 폼 상태
  const [studentNumber, setStudentNumber] = useState('1');
  const [studentName, setStudentName] = useState('');

  // 일괄 등록 상태
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [bulkInput, setBulkInput] = useState('');
  const [isAddingBulk, setIsAddingBulk] = useState(false);

  useEffect(() => {
    if (user && classId) {
      loadClassData();
      loadStudents();
    }
  }, [user, classId]);

  const loadClassData = async () => {
    if (!user) return;

    try {
      const response = await authenticatedFetch(user, isDevMode, '/api/classes/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const response = await authenticatedFetch(user, isDevMode, `/api/classes/${classId}/students/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const response = await authenticatedFetch(user, isDevMode, `/api/classes/${classId}/students/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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

  const parseBulkInput = (input: string): Array<{ number: number; name: string }> => {
    const lines = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const students: Array<{ number: number; name: string }> = [];

    for (const line of lines) {
      // 탭으로 구분된 경우 (엑셀 복사-붙여넣기)
      if (line.includes('\t')) {
        const parts = line.split('\t');
        const number = parseInt(parts[0]);
        const name = parts[1]?.trim();

        if (!isNaN(number) && name) {
          students.push({ number, name });
        }
      }
      // 공백으로 구분된 경우
      else if (line.includes(' ')) {
        const parts = line.split(/\s+/);
        const number = parseInt(parts[0]);
        const name = parts.slice(1).join(' ').trim();

        if (!isNaN(number) && name) {
          students.push({ number, name });
        }
      }
      // 숫자만 있고 이름이 없는 경우 (이름만 입력)
      else {
        // 기존 학생 수에서 다음 번호 자동 할당
        students.push({
          number: students.length + (parseInt(studentNumber) || 1),
          name: line,
        });
      }
    }

    return students;
  };

  const handleAddBulk = async () => {
    if (!user || !bulkInput.trim()) {
      alert('❌ 학생 목록을 입력해주세요.');
      return;
    }

    const parsedStudents = parseBulkInput(bulkInput);

    if (parsedStudents.length === 0) {
      alert('❌ 올바른 형식의 학생 정보가 없습니다.');
      return;
    }

    const confirmMessage = `${parsedStudents.length}명의 학생을 추가하시겠습니까?\n\n${parsedStudents
      .slice(0, 5)
      .map((s) => `${s.number}번 ${s.name}`)
      .join('\n')}${parsedStudents.length > 5 ? `\n... 외 ${parsedStudents.length - 5}명` : ''}`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsAddingBulk(true);
    try {
      const response = await authenticatedFetch(user, isDevMode, `/api/classes/${classId}/students/add-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: parsedStudents,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ ${data.addedCount}명의 학생이 추가되었습니다!`);
        setShowAddForm(false);
        setBulkInput('');
        loadClassData();
        loadStudents();
      } else {
        alert('❌ 추가 실패: ' + data.error);
      }
    } catch (error) {
      alert('❌ 일괄 추가 중 오류가 발생했습니다.');
    } finally {
      setIsAddingBulk(false);
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
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {showAddForm ? '❌ 취소' : '➕ 학생 추가'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">새 학생 추가</h3>
                  {/* 탭 버튼 */}
                  <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setAddMode('single')}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        addMode === 'single'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      한 명씩 추가
                    </button>
                    <button
                      onClick={() => setAddMode('bulk')}
                      className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                        addMode === 'bulk'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      🚀 일괄 추가
                    </button>
                  </div>
                </div>

                {addMode === 'single' ? (
                  // 한 명씩 추가 폼
                  <>
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
                  </>
                ) : (
                  // 일괄 추가 폼
                  <>
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">
                        📋 학생 명단 입력 <span className="text-gray-500">(여러 방식 지원)</span>
                      </label>
                      <textarea
                        value={bulkInput}
                        onChange={(e) => setBulkInput(e.target.value)}
                        placeholder={`아래 형식 중 하나로 입력하세요:

1️⃣ 엑셀에서 복사-붙여넣기 (번호와 이름 열 선택 후 복사)
1	강지민
2	김수현
3	박민준

2️⃣ 번호와 이름을 띄어쓰기로 구분
1 강지민
2 김수현
3 박민준

3️⃣ 이름만 입력 (번호는 자동으로 부여됩니다)
강지민
김수현
박민준`}
                        className="w-full p-3 border rounded-lg font-mono text-sm h-64 resize-y"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        💡 <strong>팁:</strong> 엑셀에서 번호와 이름 열을 선택해서 복사한 후 붙여넣으면
                        자동으로 인식됩니다!
                      </p>
                    </div>
                    <Button
                      onClick={handleAddBulk}
                      disabled={isAddingBulk || !bulkInput.trim()}
                      className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                    >
                      {isAddingBulk
                        ? '추가 중...'
                        : `✅ 일괄 추가하기 (${parseBulkInput(bulkInput).length}명)`}
                    </Button>
                  </>
                )}
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

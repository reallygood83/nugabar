'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import NavigationHeader from '@/components/common/NavigationHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CumulativeRecord {
  id: string;
  content: string;
  observationDates: string[];
  behaviorText: string;
  createdAt: string;
}

interface Student {
  id: string;
  number: number;
  maskedName: string;
}

interface ClassData {
  className: string;
}

export default function StudentRecordPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const studentId = params.studentId as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [records, setRecords] = useState<CumulativeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 누가기록 생성을 위한 상태 (기존 시스템 재사용)
  const [showGenerateForm, setShowGenerateForm] = useState(false);

  useEffect(() => {
    if (user && classId && studentId) {
      loadStudentData();
      loadRecords();
    }
  }, [user, classId, studentId]);

  const loadStudentData = async () => {
    if (!user) return;

    try {
      // 학급 정보 가져오기
      const classResponse = await fetch('/api/classes/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });
      const classData = await classResponse.json();
      if (classData.success) {
        const currentClass = classData.classes.find((c: any) => c.id === classId);
        if (currentClass) {
          setClassData({ className: currentClass.className });
        }
      }

      // 학생 목록에서 현재 학생 찾기
      const studentsResponse = await fetch(`/api/classes/${classId}/students/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });
      const studentsData = await studentsResponse.json();
      if (studentsData.success) {
        const currentStudent = studentsData.students.find((s: any) => s.id === studentId);
        if (currentStudent) {
          setStudent({
            id: currentStudent.id,
            number: currentStudent.number,
            maskedName: currentStudent.maskedName,
          });
        }
      }
    } catch (error) {
      console.error('학생 정보 불러오기 오류:', error);
    }
  };

  const loadRecords = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/classes/${classId}/students/${studentId}/records/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });

      const data = await response.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (error) {
      console.error('누가기록 불러오기 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecord = async (content: string, observationDates: string[], behaviorText: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/classes/${classId}/students/${studentId}/records/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          content,
          observationDates,
          behaviorText,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ 누가기록이 저장되었습니다!');
        setShowGenerateForm(false);
        loadRecords();
      } else {
        alert('❌ 저장 실패: ' + data.error);
      }
    } catch (error) {
      alert('❌ 저장 중 오류가 발생했습니다.');
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
        {/* 학생 정보 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/class-management/${classId}`)}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← {classData?.className || '학급'} 학생 목록으로
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {student?.number}번 {student?.maskedName}
          </h1>
          <p className="text-gray-600">
            누가기록: {records.length}개
          </p>
        </div>

        {/* 누가기록 생성 버튼 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📝 누가기록 생성</CardTitle>
            <CardDescription>행동특성을 입력하면 AI가 누가기록을 생성합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push(`/behavior-characteristics?classId=${classId}&studentId=${studentId}&studentName=${student?.maskedName}&studentNumber=${student?.number}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
            >
              ✨ 행동특성 생성하기
            </Button>
            <p className="text-sm text-gray-500 mt-2 text-center">
              행동특성 입력 페이지로 이동합니다
            </p>
          </CardContent>
        </Card>

        {/* 저장된 누가기록 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>📚 저장된 누가기록</CardTitle>
            <CardDescription>이 학생의 모든 누가기록 ({records.length}개)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">불러오는 중...</div>
            ) : records.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                아직 저장된 누가기록이 없습니다. 위에서 새 누가기록을 생성해보세요!
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm text-gray-500">
                        생성일: {new Date(record.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                      {record.observationDates && record.observationDates.length > 0 && (
                        <div className="text-sm text-blue-600 font-medium">
                          관찰기간: {record.observationDates[0]} ~ {record.observationDates[record.observationDates.length - 1]}
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">📝 누가기록 내용</h4>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {record.content}
                      </p>
                    </div>

                    {record.behaviorText && (
                      <details className="mt-3">
                        <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                          원본 행동특성 보기
                        </summary>
                        <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
                          {record.behaviorText}
                        </div>
                      </details>
                    )}
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

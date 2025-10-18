/**
 * 엑셀 파일 생성 유틸리티
 * 학급 누가기록 데이터를 Excel 파일로 변환합니다.
 */

import * as XLSX from 'xlsx';

export interface StudentRecord {
  studentName: string;
  studentNumber: number;
  createdAt: string;
  observationPeriod: string;
  content: string;
  behaviorText?: string;
}

/**
 * 학급 전체 누가기록을 Excel 파일로 생성합니다.
 * @param records - 누가기록 배열
 * @param className - 학급명
 * @returns Excel 파일 ArrayBuffer
 */
export function generateClassExcel(
  records: StudentRecord[],
  className: string
): ArrayBuffer {
  // 데이터를 Excel 형식으로 변환
  const data = records.map((record) => ({
    번호: record.studentNumber,
    학생명: record.studentName,
    생성일: record.createdAt,
    관찰기간: record.observationPeriod,
    누가기록: record.content,
    원본행동특성: record.behaviorText || '',
  }));

  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 열 너비 설정
  const columnWidths = [
    { wch: 8 },  // 번호
    { wch: 12 }, // 학생명
    { wch: 12 }, // 생성일
    { wch: 25 }, // 관찰기간
    { wch: 100 }, // 누가기록
    { wch: 50 }, // 원본행동특성
  ];
  worksheet['!cols'] = columnWidths;

  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, className);

  // Excel 파일로 변환 (ArrayBuffer 형태)
  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
}

/**
 * 개별 학생 누가기록을 Excel 파일로 생성합니다.
 * @param records - 학생의 누가기록 배열
 * @param studentName - 학생 이름 (마스킹된 이름)
 * @returns Excel 파일 ArrayBuffer
 */
export function generateStudentExcel(
  records: Omit<StudentRecord, 'studentName' | 'studentNumber'>[],
  studentName: string
): ArrayBuffer {
  const data = records.map((record, index) => ({
    순번: index + 1,
    생성일: record.createdAt,
    관찰기간: record.observationPeriod,
    누가기록: record.content,
    원본행동특성: record.behaviorText || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const columnWidths = [
    { wch: 8 },  // 순번
    { wch: 12 }, // 생성일
    { wch: 25 }, // 관찰기간
    { wch: 100 }, // 누가기록
    { wch: 50 }, // 원본행동특성
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, studentName);

  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
}

/**
 * 한국 공휴일 및 날짜 유틸리티
 * Apps Script getKoreanHolidays() 함수 100% 이식
 */

/**
 * 한국 공휴일 목록 (2025년 기준)
 * @param year - 조회할 연도
 * @returns 공휴일 Date 배열
 */
export function getKoreanHolidays(year: number): Date[] {
  const holidays: Date[] = [];

  // 고정 공휴일
  holidays.push(new Date(year, 0, 1));   // 신정
  holidays.push(new Date(year, 2, 1));   // 삼일절
  holidays.push(new Date(year, 4, 5));   // 어린이날
  holidays.push(new Date(year, 5, 6));   // 현충일
  holidays.push(new Date(year, 7, 15));  // 광복절
  holidays.push(new Date(year, 9, 3));   // 개천절
  holidays.push(new Date(year, 9, 9));   // 한글날
  holidays.push(new Date(year, 11, 25)); // 크리스마스

  // 2025년 추가 공휴일 (음력 기반은 매년 변동)
  if (year === 2025) {
    holidays.push(new Date(2025, 0, 28));  // 설날 연휴 시작
    holidays.push(new Date(2025, 0, 29));  // 설날
    holidays.push(new Date(2025, 0, 30));  // 설날 연휴 끝
    holidays.push(new Date(2025, 4, 5));   // 부처님오신날
    holidays.push(new Date(2025, 8, 16));  // 추석 연휴 시작
    holidays.push(new Date(2025, 8, 17));  // 추석
    holidays.push(new Date(2025, 8, 18));  // 추석 연휴 끝
  }

  // 2026년 공휴일 (필요시 추가)
  if (year === 2026) {
    // TODO: 2026년 음력 공휴일 추가
  }

  return holidays;
}

/**
 * 날짜가 공휴일인지 확인
 * @param date - 확인할 날짜
 * @returns 공휴일 여부
 */
export function isHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const holidays = getKoreanHolidays(year);
  const dateString = date.toDateString();

  return holidays.some(holiday => holiday.toDateString() === dateString);
}

/**
 * 날짜가 주말인지 확인
 * @param date - 확인할 날짜
 * @returns 주말 여부 (0=일요일, 6=토요일)
 */
export function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

/**
 * 날짜가 방학 기간인지 확인 (여름방학, 겨울방학)
 * @param date - 확인할 날짜
 * @returns 방학 여부
 */
export function isVacation(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // 여름방학: 7월 15일 ~ 8월 31일
  const summerStart = new Date(year, 6, 15);
  const summerEnd = new Date(year, 7, 31);

  // 겨울방학: 12월 20일 ~ 다음해 2월 28일
  const winterStart = new Date(year, 11, 20);
  const winterEnd = new Date(year + 1, 1, 28);

  return (date >= summerStart && date <= summerEnd) ||
         (date >= winterStart && date <= winterEnd);
}

/**
 * 날짜가 학교 수업일인지 확인 (평일 + 공휴일 제외 + 방학 제외)
 * @param date - 확인할 날짜
 * @param excludedDates - 추가로 제외할 날짜들 (휴업일, 결석일)
 * @returns 수업일 여부
 */
export function isSchoolDay(date: Date, excludedDates: Date[] = []): boolean {
  // 주말 체크
  if (isWeekend(date)) {
    return false;
  }

  // 공휴일 체크
  if (isHoliday(date)) {
    return false;
  }

  // 방학 체크
  if (isVacation(date)) {
    return false;
  }

  // 사용자 지정 제외 날짜 체크
  const dateString = date.toDateString();
  if (excludedDates.some(excluded => excluded.toDateString() === dateString)) {
    return false;
  }

  return true;
}

/**
 * 이전 학교 수업일 찾기
 * @param fromDate - 기준 날짜
 * @param excludedDates - 제외할 날짜들
 * @returns 이전 수업일
 */
export function getPreviousSchoolDay(fromDate: Date, excludedDates: Date[] = []): Date {
  const previousDate = new Date(fromDate);
  previousDate.setDate(previousDate.getDate() - 1);

  // 최대 30일 이전까지 검색
  let attempts = 0;
  while (!isSchoolDay(previousDate, excludedDates) && attempts < 30) {
    previousDate.setDate(previousDate.getDate() - 1);
    attempts++;
  }

  return previousDate;
}

/**
 * 누가기록용 유효한 날짜 생성 (Apps Script 로직 100% 이식)
 * 각 날짜가 모두 달라야 하며, 평일 + 공휴일 제외
 * @param count - 생성할 날짜 개수
 * @param excludedDates - 제외할 날짜들 (휴업일, 결석일)
 * @returns 유효한 날짜 배열 (최신순)
 */
export function generateCumulativeRecordDates(
  count: number,
  excludedDates: Date[] = []
): Date[] {
  const dates: Date[] = [];
  const usedDateStrings = new Set<string>();
  let currentDate = new Date();

  // 최대 365일 이전까지 검색
  let attempts = 0;
  const maxAttempts = 365;

  while (dates.length < count && attempts < maxAttempts) {
    // 1-7일 간격으로 랜덤하게 이전 날짜 생성
    const daysBack = Math.floor(Math.random() * 7) + 1;
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() - daysBack);

    // 학교 수업일인지 확인
    if (isSchoolDay(currentDate, excludedDates)) {
      const dateString = currentDate.toDateString();

      // 중복 날짜 체크
      if (!usedDateStrings.has(dateString)) {
        dates.push(new Date(currentDate));
        usedDateStrings.add(dateString);
      }
    }

    attempts++;
  }

  // 최신순 정렬
  return dates.sort((a, b) => b.getTime() - a.getTime());
}

/**
 * 날짜 배열을 한국어 형식으로 포맷
 * @param date - 포맷팅할 날짜
 * @returns "YYYY. MM. DD" 형식 문자열
 */
export function formatKoreanDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
}
